import { Q as QItem } from "./QItem.033819c2.js";
import { a as QItemSection, b as QItemLabel, Q as QList } from "./QList.78849ffd.js";
import { Q as QBtn } from "./QBtn.5848d314.js";
import { Q as QPage } from "./QPage.476cf600.js";
import { u as useBridge } from "./bexBridge.2fbfd709.js";
import { r as ref, q as computed, a as onBeforeUnmount, K as openBlock, L as createBlock, M as withCtx, N as createVNode, _ as createTextVNode, Z as toDisplayString, R as unref, O as createBaseVNode } from "./index.b0068bd8.js";
import "./use-dark.73118c32.js";
import "./Ripple.31e5d7c7.js";
import "./render.a8eadc37.js";
import "./QIcon.b3f3bd12.js";
const _hoisted_1 = { style: { "white-space": "pre-wrap" } };
const _sfc_main = {
  __name: "ServerPage",
  setup(__props) {
    const log = (...args) => console.log("[bex] ui", ...args);
    const {
      bexSend,
      bexSendBridged,
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
      serverActive.value = data.active;
    });
    bexSend("query-connected-tabs").then(({ data }) => {
      console.log("connected tabs:", data);
      if (!data)
        return;
      connectedTabs.value = data;
    });
    const roll20Available = computed(() => connectedTabs.value > 0);
    const serverStatusCallback = ({ data, respond }) => {
      log("got server status update", data);
      serverActive.value = data;
      respond();
    };
    const bexOffServerStatus = bexOn("server-status", serverStatusCallback);
    onBeforeUnmount(() => {
      bexOffServerStatus();
    });
    const rollData = ref(null);
    async function roll20HelloWorld() {
      bexSendBridged("dom", "send-message", { msg: "Hello World", target: "MYSELF" }).then((data) => {
        console.log("got a response:", data);
        rollData.value = data;
      });
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(QPage, { class: "flex column q-gutter-y-md q-pa-md" }, {
        default: withCtx(() => [
          createVNode(QList, null, {
            default: withCtx(() => [
              createVNode(QItem, { class: "text-h4 header-item q-mb-md" }, {
                default: withCtx(() => [
                  createTextVNode(" Server ")
                ]),
                _: 1
              }),
              createVNode(QItem, null, {
                default: withCtx(() => [
                  createVNode(QItemSection, null, {
                    default: withCtx(() => [
                      createVNode(QItemLabel, null, {
                        default: withCtx(() => [
                          createTextVNode("Roll20 is " + toDisplayString(unref(roll20Available) ? "" : "not") + " connected", 1)
                        ]),
                        _: 1
                      }),
                      createVNode(QItemLabel, { caption: "" }, {
                        default: withCtx(() => [
                          createTextVNode(" Connected Tabs: " + toDisplayString(connectedTabs.value), 1)
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(QItem, null, {
                default: withCtx(() => [
                  createVNode(QBtn, {
                    outline: "",
                    label: `Turn Server ${serverActive.value ? "off" : "on"}`,
                    class: "full-width",
                    onClick: toggleServer
                  }, null, 8, ["label"])
                ]),
                _: 1
              }),
              createVNode(QItem, null, {
                default: withCtx(() => [
                  createVNode(QBtn, {
                    outline: "",
                    label: "roll20 Hello World",
                    class: "full-width",
                    onClick: roll20HelloWorld
                  })
                ]),
                _: 1
              }),
              createVNode(QItem, null, {
                default: withCtx(() => [
                  createBaseVNode("pre", _hoisted_1, toDisplayString(rollData.value), 1)
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ]),
        _: 1
      });
    };
  }
};
export { _sfc_main as default };
