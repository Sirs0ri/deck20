import { bexBackground } from "quasar/wrappers"

/** Wrapper for console.log that adds a "[bex] background" prefix infront of the logged message
 *
 * @param  {...any} args
 */
const log = (...args) => {
  if (process.env.DEBUGGING) { console.log("[bex] background:", ...args) }
}

self.addEventListener("install", (event) => {
  // The promise that skipWaiting() returns can be safely ignored.
  self.skipWaiting()

  // Perform any other actions required for your
  // service worker to install, potentially inside
  // of event.waitUntil();

  log("installed", Date.now())
})

// This shares state, theres only ever one background.js
// Once the service worker is no longer used and is stopped,
// this will be reset, which is fine.
let serverActive = false
let port
let connectedTabs = 0

let serverUnavailable

export default bexBackground((bridge /* , allActiveConnections */) => {
  // This is a Service Worker. It runs in the background, when ever there is
  // some active part of the BEX, be it th eUI or Content Script.
  // This can talk to the UI from src/
  // this can talk to content scripts inside a tab
  // This can not talk to dom.js

  log("active", Date.now(), { serverActive })

  function sendMessageToRoll20Dom ({ command, data }) {
    data._pathing = {
      src: "background",
      dst: "dom",
      lastFwd: "background",
    }
    bridge.send("bridge-forward", {
      command,
      data,
    })
  }

  // #region ========== Native Communication ==========
  // This uses the "nativeCommunication" feature to start/stop the server
  // located in src-native-bridge (which is a very basic node.js server).
  // When opening a "port" to the native app, Chrome starts the node app,
  // as soon as no connection is active anymore (via port.disconnect()),
  // Chrome kills the node application automatically.

  async function startServer () {
    serverUnavailable = null
    // if (serverUnavailable) return "Server not available"
    if (serverActive) return "Server already running"

    const serverPromise = new Promise((resolve, reject) => {
      log("starting server...")
      const _port = chrome.runtime.connectNative("de.sirs0ri.deck20")

      _port.onDisconnect.addListener(() => {
        if (chrome.runtime.lastError) {
          log("Server failed to start.", chrome.runtime.lastError.message)
          reject(chrome.runtime.lastError)
        }
      })

      // The server failes *almost* instantly (within a single digit amount of
      // ms), but not quite. Unfortunately there's no error to catch, only the
      // chrome.runtime.lastError that might have a value in the onDisconnect-
      // Callback.
      // If this hasn't happened within 50 ms, it is save to assume the server
      // is running.
      setTimeout(() => {
        resolve(_port)
      }, 50)
    })

    port = await serverPromise.catch(e => {
      console.warn("server not available!")
      serverUnavailable = true
      return null
    })

    if (!port) {
      updateServerState(false)
      return
    }

    // Forward messages received from the server to the bridge
    port.onMessage.addListener((data) => {
      log("Received", data)
      sendMessageToRoll20Dom(data)
    })

    port.onDisconnect.addListener(() => {
      log("Disconnected")
      updateServerState(false)
    })

    updateServerState(true)
  }

  function stopServer () {
    if (port == null || !serverActive) return "Server already stopped"

    log("stopping server...")

    port.disconnect()

    updateServerState(false)
  }

  function updateServerState (newState) {
    serverActive = newState

    bridge.send("server-status", serverActive)

    if (serverActive) {
      chrome.action.setIcon({
        path: {
          16: "www/icons/icon-16x16.png",
          24: "www/icons/icon-24x24.png",
          32: "www/icons/icon-32x32.png",
        },
      })
    } else {
      chrome.action.setIcon({
        path: {
          16: "www/icons/icon-16x16-bw.png",
          24: "www/icons/icon-24x24-bw.png",
          32: "www/icons/icon-32x32-bw.png",
        },
      })
    }

    log("server is now", serverActive ? "running" : "stopped")
  }

  // #endregion

  // #region ========== BEX Bridge ==========
  // This bridge allows communications between different parts of the BEX:
  // This background script runs in the background as soon as a part of the
  // extension is active, and it connects the UI in src/ and any content scripts
  // running in tabs. Content Scripts are used to forward communication to
  // dom.js instances, which by design can only talk to their respective
  // content script.

  updateServerState(serverActive)

  bridge.on("query-server-status", evt => {
    if (serverActive) {
      evt.respond({
        active: serverActive,
        unavailable: serverUnavailable,
      })
      return
    }
    // Test starting the server if it's not already running
    startServer().then(() => {
      evt.respond({
        active: serverActive,
        unavailable: serverUnavailable,
      })
      if (serverActive) stopServer()
    })
  })

  bridge.on("toggle-server", evt => {
    if (!serverActive) startServer()
    else stopServer()
    evt.respond()
  })

  // Keep track of connected content scripts. Start/stop the server above
  // when the first tab connects/the last one disconnects.
  bridge.on("query-connected-tabs", evt => {
    evt.respond(connectedTabs)
  })
  bridge.on("tab-connected", evt => {
    connectedTabs++
    if (connectedTabs === 1) {
      startServer()
    }
    evt.respond(connectedTabs)
  })
  bridge.on("tab-disconnected", evt => {
    connectedTabs--
    if (connectedTabs === 0) {
      stopServer()
    }
    evt.respond()
  })

  // Forward messages from the UI to the dom, via the content script
  // ui -> background -> content -> dom
  const PREV_BRIDGE_STEPS = ["ui"]
  const PREV_BRIDGE_STEP = "ui"
  const CURRENT_BRIDGE_STEP = "background"
  const NEXT_BRIDGE_STEP = "content"
  const NEXT_BRIDGE_STEPS = ["content", "dom"]

  bridge.on("bridge-forward", ({ data }) => {
    // break, if a forwarded message has no pathing info
    if (!data.data._pathing) return

    const { src, dst, lastFwd, uuid } = data.data._pathing
    // break if we sent this message
    if (lastFwd === CURRENT_BRIDGE_STEP) return

    if (dst === CURRENT_BRIDGE_STEP || dst === PREV_BRIDGE_STEP) {
      log("executing", data)

      if (data.command.startsWith("bridge-response.")) {
        // forward the response, without caring about any response it might get.
        bridge.send(data.command, data.data)
        return
      }
      // do command, handle response
      bridge.send(data.command, data.data)
        .then(response => {
          const responseMsg = {
            command: `bridge-response.${uuid}`,
            data: response,
            pathing: {
              uuid,
              src: CURRENT_BRIDGE_STEP,
              dst: src,
              lastFwd: CURRENT_BRIDGE_STEP,
            },
          }
          log("returning response", responseMsg)
          bridge.send("bridge-forward", responseMsg)
        })
      return
    }

    log("got request to forward a message:", data)
    if ( // This came from a previous hop and goes to the next
      (lastFwd === PREV_BRIDGE_STEP && NEXT_BRIDGE_STEPS.includes(dst)) ||
      (lastFwd === NEXT_BRIDGE_STEP && PREV_BRIDGE_STEPS.includes(dst))) {
      data.data._pathing.lastFwd = CURRENT_BRIDGE_STEP
      log("forwarding", data)

      bridge.send("bridge-forward", data)
    }
  })

  // #endregion

  // #region ========== STATE PERSISTENCE ==========
  bridge.on("restore-store", ({ data, respond }) => {
    // TODO: Get state from somewhere
    chrome.storage.local.get([data], items => {
      respond(items[data])
    })
  })

  bridge.on("persist-store", ({ data, respond }) => {
    // TODO: Get state from somewhere
    const { key, uid, value } = data

    chrome.storage.local.set({ [key]: value }, () => {
      respond(true)
      // Inform other instances of the store that something's changed, because
      // the different contexts of the BEX (iframe, popup, options page) don't
      // share states
      bridge.send(`store-persisted.${key}`, { uid })
    })
  })

  // bridge.on("storage.get", ({ data, respond }) => {
  //   const { key } = data
  //   if (key === null) {
  //     chrome.storage.local.get(null, items => {
  //       // Group the values up into an array to take advantage of the bridge's chunk splitting.
  //       respond(Object.values(items))
  //     })
  //   } else {
  //     chrome.storage.local.get([key], items => {
  //       respond(items[key])
  //     })
  //   }
  // })
  // // Usage:
  // // const { data } = await bridge.send('storage.get', { key: 'someKey' })

  // bridge.on("storage.set", ({ data, respond }) => {
  //   chrome.storage.local.set({ [data.key]: data.value }, () => {
  //     respond()
  //   })
  // })
  // // Usage:
  // // await bridge.send('storage.set', { key: 'someKey', value: 'someValue' })

  // bridge.on("storage.remove", ({ data, respond }) => {
  //   chrome.storage.local.remove(data.key, () => {
  //     respond()
  //   })
  // })
  // #endregion
})
