import { b as QBtn } from "./QBtn.92cc2f66.js";
import { Q as QPage } from "./QPage.bf0e4832.js";
import { u as useBridge } from "./bexBridge.f82d375f.js";
import { r as ref, a as onBeforeUnmount, M as openBlock, N as createBlock, O as withCtx, P as createVNode, U as createBaseVNode, S as toDisplayString } from "./index.302dcafb.js";
import "./render.1627e0f5.js";
const _sfc_main = {
  __name: "ServerPage",
  setup(__props) {
    const log = (...args) => console.log("[bex] ui", ...args);
    const {
      bexSend,
      bexOn
    } = useBridge();
    const serverActive = ref(false);
    const connectedTabs = ref(0);
    function toggleServer() {
      bexSend("toggle-server");
    }
    bexSend("query-server-status").then(({ data }) => {
      if (!data)
        return;
      serverActive.value = data;
    });
    bexSend("query-connected-tabs").then(({ data }) => {
      if (!data)
        return;
      connectedTabs.value = data;
    });
    const serverStatusCallback = ({ data, respond }) => {
      log("got server status update", data);
      serverActive.value = data;
      respond();
    };
    const bexOffServerStatus = bexOn("server-status", serverStatusCallback);
    onBeforeUnmount(() => {
      bexOffServerStatus();
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(QPage, { class: "flex flex-center column q-gutter-y-md q-pa-md" }, {
        default: withCtx(() => [
          createVNode(QBtn, {
            outline: "",
            label: `Turn Server ${serverActive.value ? "off" : "on"}`,
            class: "full-width",
            onClick: toggleServer
          }, null, 8, ["label"]),
          createBaseVNode("span", null, " Connected Tabs: " + toDisplayString(connectedTabs.value), 1)
        ]),
        _: 1
      });
    };
  }
};
export { _sfc_main as default };