import { computed, ref } from "vue"

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
    bexOn,
    bexOff,
  }
}
