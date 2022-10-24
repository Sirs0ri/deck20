import { bexBackground } from "quasar/wrappers"

const log = (...args) => console.log("[bex] background", ...args)

// This shares state, theres only ever one background.js
let serverActive = false
let port
let connectedTabs = 0

export default bexBackground((bridge /* , allActiveConnections */) => {
  // This runs in the background, when ever there is a bridge.
  // This can talk to the UI from src/
  // this can talk to content scripts inside a tab
  // This can not talk to dom.js

  log("active", Date.now(), { serverActive })

  // TODO: Use different handler for this?
  // TODO: REspond with error if no roll20 tab is connected?
  function sendMessageToRoll20Dom (msg) {
    bridge.send("native-comm", msg)
  }

  // ========== Native Communication ==========
  // This uses the "nativeCommunication" feature to start/stop the server
  // located in src-native-bridge (which is a very basic node.js server).
  // When opening a "port" to the native app, Chrome starts the node app,
  // as soon as no connection is active anymore (via port.disconnect()),
  // Chrome kills the node application automatically.

  function startServer () {
    if (serverActive) return "Server already running"

    log("starting server...")

    port = chrome.runtime.connectNative("de.sirs0ri.roll20deck")

    // Forward messages received from the server to the bridge
    port.onMessage.addListener((data) => {
      log("Received", data)
      sendMessageToRoll20Dom({ ...data, _origin: "native" })
    })

    port.onDisconnect.addListener(() => {
      log("Disconnected")
    })

    updateServerState(true)
  }

  function stopServer () {
    if (!serverActive) return "Server already stopped"

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

  // ========== BEX Bridge ==========
  // This bridge allows communications between different parts of the BEX:
  // This background script runs in the background as soon as a part of the
  // extension is active, and it connects the UI in src/ and any content scripts
  // running in tabs. Content Scripts are used to forward communication to
  // dom.js instances, which by design can only talk to their respective
  // content script.

  updateServerState(serverActive)

  bridge.on("ui-called-action", ({ data, respond }) => {
    log("forwarding UI action", data)
    sendMessageToRoll20Dom({ ...data, _origin: "bex" })
    respond()
  })

  bridge.on("query-server-status", evt => {
    evt.respond(serverActive)
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

  // ========== STATE PERSISTENCE ==========
  bridge.on("restore-store", ({ data, respond }) => {
    // TODO: Get state from somewhere
    chrome.storage.local.get([data], items => {
      respond(items[data])
    })
  })

  bridge.on("persist-store", ({ data, respond }) => {
    // TODO: Get state from somewhere
    chrome.storage.local.set({ [data.key]: data.value }, () => {
      respond(true)
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
})
