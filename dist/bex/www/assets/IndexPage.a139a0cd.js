import { Q as QPage } from "./QPage.062929ba.js";
import { r as ref, K as openBlock, L as createBlock, M as withCtx, O as createBaseVNode, Z as toDisplayString } from "./index.8c4d84bb.js";
import "./render.cfc3f4d1.js";
const _hoisted_1 = /* @__PURE__ */ createBaseVNode("span", null, "Index", -1);
const _sfc_main = {
  __name: "IndexPage",
  setup(__props) {
    const isPopup = ref(false);
    if ("bex_type" in window)
      window.bex_type.then((type) => {
        isPopup.value = type === "bex-popup";
      });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(QPage, { class: "flex flex-center column q-gutter-y-md q-pa-md" }, {
        default: withCtx(() => [
          _hoisted_1,
          createBaseVNode("span", null, "This is " + toDisplayString(isPopup.value ? "" : "not") + " a popup", 1)
        ]),
        _: 1
      });
    };
  }
};
export { _sfc_main as default };
