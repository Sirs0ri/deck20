import { r as ref, q as computed, H as getUid } from "./index.b0068bd8.js";
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
  return bridge.value.send(command, data);
}
async function bexSendBridged(dst, command, data = {}, timeout = -1) {
  return new Promise((resolve, reject) => {
    const uuid = getUid();
    let off;
    if (timeout >= 0) {
      setTimeout(() => {
        off && off();
        reject("Timeout");
      }, timeout);
    }
    if (dst === "background") {
      bexSend(command, data).then((data2) => {
        resolve(data2);
      });
    } else {
      off = bexOn(`bridge-response.${uuid}`, ({ data: data2, respond }) => {
        off();
        resolve(data2);
      });
      data._pathing = {
        uuid,
        src: "ui",
        dst,
        lastFwd: "ui"
      };
      bexSend("bridge-forward", {
        command,
        data
      });
    }
  });
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
    bexSendBridged,
    bexOn,
    bexOff
  };
}
export { useBridge as u };
