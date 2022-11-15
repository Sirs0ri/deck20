// Hooks added here have a bridge allowing communication between the BEX Content Script and the Quasar Application.
// More info: https://quasar.dev/quasar-cli/developing-browser-extensions/content-hooks

import { bexContent } from "quasar/wrappers"

/** Wrapper for console.log that adds a "[bex] content" prefix infront of the logged message
 *
 * @param  {...any} args
 */
const log = (...args) => {
  if (process.env.DEBUGGING) { console.log("[bex] content:", ...args) }
}

// TODO: Run this only once, otherwise messages will be handled in every tab leading to duplications.
// Ideally, if Tab A connects first, then tab B connects secondly, B will not handle commands until A is closed.

// #region ========== BEX INJECTION ==========

const
  iFrame = document.createElement("iframe")
// const defaultFrameHeight = "600px"
const defaultFrameHeight = "32px"

/**
 * Set the height of our iFrame housing our BEX
 * @param height
 */
const setIFrameHeight = height => {
  iFrame.height = height
}

/**
 * Reset the iFrame to its default height e.g The height of the top bar.
 */
const resetIFrameHeight = () => {
  setIFrameHeight(defaultFrameHeight)
}

/**
 * The code below will get everything going. Initialize the iFrame with defaults and add it to the page.
 * @type {string}
 */
iFrame.id = "bex-app-iframe"
iFrame.width = "32px"
// iFrame.width = "375px"
resetIFrameHeight()

// Assign some styling so it looks seamless
Object.assign(iFrame.style, {
  position: "fixed",
  right: "8px",
  bottom: "16px",
  // top: "0",
  // left: "0",
  border: "0",
  zIndex: "9999999", // Make sure it's on top
  overflow: "visible",
  pointerEvents: "none",
})

;(function () {
  // When the page loads, insert our browser extension app.
  iFrame.src = chrome.runtime.getURL("www/index.html#/iframe")
  // iFrame.src = chrome.runtime.getURL("www/index.html#/iframe")
  document.body.prepend(iFrame)
})()
// #endregion

export default bexContent((bridge) => {
  // This runs in the context of a tab with an allowlisted origin
  // This can talk to background.js
  // This is the only one being able to talk to the local dom.js

  log("active", Date.now())

  // Register the tab with the background script, and set up an event listener to unregister it on close.
  bridge.send("tab-connected")

  addEventListener("pagehide", (event) => {
    bridge.send("tab-disconnected")
  })

  // #region ========== bridge forwarding ==========
  // Set up forwarding from background.js to dom.js
  // ui -> background -> content -> dom
  const PREV_BRIDGE_STEPS = ["ui", "background"]
  const PREV_BRIDGE_STEP = "background"
  const CURRENT_BRIDGE_STEP = "content"
  const NEXT_BRIDGE_STEP = "dom"
  const NEXT_BRIDGE_STEPS = ["dom"]

  bridge.on("bridge-forward", ({ data }) => {
    // break, if a forwarded message has no pathing info
    if (!data?.data?._pathing) return

    const { src, dst, lastFwd, uuid } = data.data._pathing
    // break if we sent this message
    if (lastFwd === CURRENT_BRIDGE_STEP) return

    if (dst === CURRENT_BRIDGE_STEP || dst === NEXT_BRIDGE_STEP) {
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
})
