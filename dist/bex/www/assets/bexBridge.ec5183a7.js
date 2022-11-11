import { r as ref, q as computed } from "./index.8717e996.js";
const bridge = ref(null);
function registerBridge(b) {
  bridge.value = b;
}
const bexConnected = computed(() => {
  return bridge.value != null;
});
async function bexSend(command, data) {
  if (!bridge.value)
    return { data: null, respond: () => {
    } };
  return await bridge.value.send(command, data);
}
function bexOn(command, callback) {
  if (!bridge.value)
    return () => {
    };
  bridge.value.on(command, callback);
  return () => bexOff(command, callback);
}
function bexOff(command, callback) {
  if (!bridge.value)
    return;
  bridge.value.off(command, callback);
}
function useBridge(b) {
  if (b)
    registerBridge(b);
  return {
    bridge,
    registerBridge,
    bexConnected,
    bexSend,
    bexOn,
    bexOff
  };
}
export { useBridge as u };
