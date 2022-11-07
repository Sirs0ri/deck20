import { b as QBtn } from "./QBtn.bd4123d9.js";
import { aa as _export_sfc, M as openBlock, V as createElementBlock, U as createBaseVNode, P as createVNode } from "./index.c6d27518.js";
import "./render.9ad54730.js";
const _sfc_main = {};
const _hoisted_1 = { class: "fullscreen bg-blue text-white text-center q-pa-md flex flex-center" };
const _hoisted_2 = /* @__PURE__ */ createBaseVNode("div", { style: { "font-size": "30vh" } }, " 404 ", -1);
const _hoisted_3 = /* @__PURE__ */ createBaseVNode("div", {
  class: "text-h2",
  style: { "opacity": ".4" }
}, " Oops. Nothing here... ", -1);
function _sfc_render(_ctx, _cache) {
  return openBlock(), createElementBlock("div", _hoisted_1, [
    createBaseVNode("div", null, [
      _hoisted_2,
      _hoisted_3,
      createVNode(QBtn, {
        class: "q-mt-xl",
        color: "white",
        "text-color": "blue",
        unelevated: "",
        to: "/",
        label: "Go Home",
        "no-caps": ""
      })
    ])
  ]);
}
var ErrorNotFound = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { ErrorNotFound as default };
