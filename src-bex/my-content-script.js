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

  // Set up forwarding from background.js to dom.js
  // bridge.on("forwarded-ui-action", evt => {
  //   log("got forwarded-ui-action, pinging dom")
  //   bridge.send("do-dom-manipulation")
  //   evt.respond()
  // })
  bridge.on("native-comm", ({ data, respond }) => {
    log("got forwarded-ui-action, pinging dom")
    bridge.send("forwarded-comm", data)
    respond()
  })
})
