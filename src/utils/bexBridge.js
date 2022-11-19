import { computed, ref } from "vue"
import { uid } from "quasar"

export const isBex = process.env.MODE === "bex"

const bridge = ref(null)

function registerBridge (b) {
  bridge.value = b
}

const bexConnected = computed(() => { return bridge.value != null })

/**
 * Send a command via BEX
 * @param {String} command Command to send via BEX
 * @param {Object} data Data to attach to the command
 * @returns Response
 */
async function bexSend (command, data) {
  if (!bridge.value) return { data: null, respond: () => {} }
  return bridge.value.send(command, data)
}

/**
 * Pass along a BEX command through the bridge to a destination,
 * useful if the two communicating components can't directly talk to each other.
 *
 * @param {String} dst Where to send the message to, [ui, background, content, dom]
 * @param {String} command Bex-Command to execute at the destination, eg. "send-message"
 * @param {Object} data Data to pass alopng with the command
 * @param {Number} timeout in ms. Reject if the command doesn't get an answer after a certain time.
 * @returns Promise that'll resolve with the data returned by the destination in response to the command
 */
async function bexSendBridged (dst, command, data = {}, timeout = -1) {
  return new Promise((resolve, reject) => {
    const uuid = uid()
    let off

    // Set up timeout, if necessary
    if (timeout >= 0) {
      setTimeout(() => {
        off && off()
        reject("Timeout")
      }, timeout)
    }

    if (dst === "background") {
      // We can talk to the background script, send the command directly
      bexSend(command, data).then(data => {
        resolve(data)
      })
    } else {
      // Set up handler for the answer
      off = bexOn(`bridge-response.${uuid}`, ({ data, respond }) => {
        off()
        resolve(data)
      })

      data._pathing = {
        uuid,
        src: "ui",
        dst,
        lastFwd: "ui",
      }

      // Send command
      bexSend("bridge-forward", {
        command,
        data,
      })
    }
  })
}
/**
 * Register a command handler via BE
 * @param {String} command Command to react to via BEX
 * @param {Function} callback Callback to execute once the command is answered
 * @returns {Function} function to un-register the callback
 */
function bexOn (command, callback) {
  if (!bridge.value) return () => {}
  bridge.value.on(command, callback)

  return () => bexOff(command, callback)
}
/**
 * Un-register a command handler via BE
 * @param {String} command Command to unregister via BEX
 * @param {Function} callback Callback to unregister
 */
function bexOff (command, callback) {
  if (!bridge.value) return
  bridge.value.off(command, callback)
}

/** Register the bex bridge
 *
 * @param {BexBridge} b Can be used to register the bex bridge right away
 * @returns A bunch of exports
 */
export function useBridge (b) {
  if (b) registerBridge(b)
  return {
    bridge,
    registerBridge,
    bexConnected,
    bexSend,
    bexSendBridged,
    bexOn,
    bexOff,
  }
}
