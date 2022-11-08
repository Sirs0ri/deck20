import { b as QBtn } from "./QBtn.5b5977d6.js";
import { Q as QPage } from "./QPage.1363b0e6.js";
import { u as useBridge } from "./bexBridge.197c9c8f.js";
import { r as ref, M as openBlock, N as createBlock, O as withCtx, U as createBaseVNode, S as toDisplayString, P as createVNode } from "./index.295f82e9.js";
import "./render.1283e78e.js";
const _hoisted_1 = /* @__PURE__ */ createBaseVNode("span", null, "Rolls", -1);
const _sfc_main = {
  __name: "RollsPage",
  setup(__props) {
    const roll20Available = ref(false);
    const { bexSend } = useBridge();
    console.log("querying connected Tabs");
    bexSend("query-connected-tabs").then(({ data }) => {
      console.log("connected tabs:", data);
      if (data == null)
        return;
      if (data > 0)
        roll20Available.value = true;
    });
    function roll20HelloWorld() {
      bexSend("ui-called-action", {
        command: "do-message",
        data: "/w Max Hello World"
      });
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(QPage, { class: "flex flex-center column q-gutter-y-md q-pa-md" }, {
        default: withCtx(() => [
          _hoisted_1,
          createBaseVNode("span", null, "Roll20 is " + toDisplayString(roll20Available.value ? "" : "not") + " connected", 1),
          createVNode(QBtn, {
            outline: "",
            label: "roll20 Hello World",
            class: "full-width",
            onClick: roll20HelloWorld
          })
        ]),
        _: 1
      });
    };
  }
};
export { _sfc_main as default };
