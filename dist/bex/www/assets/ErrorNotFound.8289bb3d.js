import { Q as QBtn } from "./QBtn.bb64f6d1.js";
import { a5 as _export_sfc, K as openBlock, P as createElementBlock, O as createBaseVNode, N as createVNode } from "./index.8717e996.js";
import "./Ripple.07673d05.js";
import "./render.ce83acf7.js";
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