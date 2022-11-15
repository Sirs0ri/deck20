import { a as useSizeProps, b as useSize, Q as QIcon } from "./QIcon.2cc72089.js";
import { c as createComponent, f as hMergeSlotSafely } from "./render.797a0507.js";
import { q as computed, h, a5 as _export_sfc, a6 as storeToRefs, K as openBlock, L as createBlock, M as withCtx, ab as pushScopeId, ac as popScopeId, O as createBaseVNode } from "./index.1f497e8e.js";
import { u as useQuasar } from "./use-quasar.8d8cb0a2.js";
import { u as useCharacterStore } from "./characters-store.3bcceb6c.js";
import { u as useBridge } from "./bexBridge.5ef02c5c.js";
var QAvatar = createComponent({
  name: "QAvatar",
  props: {
    ...useSizeProps,
    fontSize: String,
    color: String,
    textColor: String,
    icon: String,
    square: Boolean,
    rounded: Boolean
  },
  setup(props, { slots }) {
    const sizeStyle = useSize(props);
    const classes = computed(
      () => "q-avatar" + (props.color ? ` bg-${props.color}` : "") + (props.textColor ? ` text-${props.textColor} q-chip--colored` : "") + (props.square === true ? " q-avatar--square" : props.rounded === true ? " rounded-borders" : "")
    );
    const contentStyle = computed(() => props.fontSize ? { fontSize: props.fontSize } : null);
    return () => {
      const icon = props.icon !== void 0 ? [h(QIcon, { name: props.icon })] : void 0;
      return h("div", {
        class: classes.value,
        style: sizeStyle.value
      }, [
        h("div", {
          class: "q-avatar__content row flex-center overflow-hidden",
          style: contentStyle.value
        }, hMergeSlotSafely(slots.default, icon))
      ]);
    };
  }
});
var BexBridgeIframe_vue_vue_type_style_index_0_lang = "";
var BexBridgeIframe_vue_vue_type_style_index_1_scoped_true_lang = "";
const _withScopeId = (n) => (pushScopeId("data-v-5d5f024c"), n = n(), popScopeId(), n);
const _hoisted_1 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("img", { src: "/icons/icosahedron.png" }, null, -1));
const _sfc_main = {
  __name: "BexBridgeIframe",
  setup(__props) {
    const $q = useQuasar();
    useBridge($q.bex);
    const store = useCharacterStore();
    const { currentCharacter, restoration } = storeToRefs(store);
    $q.bex.on("query-talents", async ({ data }) => {
      if (!data._pathing)
        return;
      const { uuid, src } = data._pathing;
      await restoration.value;
      let talents = Object.values(currentCharacter.value.talents);
      if (data.msg) {
        const re = new RegExp(data.msg, "i");
        talents = talents.filter((t) => t.name.match(re));
      }
      const responseMsg = {
        command: `bridge-response.${uuid}`,
        data: {
          result: talents.map((t) => ({
            label: `${t.name} (${t.attributes.join("/")}): ${t.value}`,
            value: t.name
          })),
          _pathing: {
            uuid,
            src: "ui",
            dst: src,
            lastFwd: "ui"
          }
        }
      };
      $q.bex.send("bridge-forward", responseMsg);
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(QAvatar, {
        size: "sm",
        class: "info-avatar"
      }, {
        default: withCtx(() => [
          _hoisted_1
        ]),
        _: 1
      });
    };
  }
};
var BexBridgeIframe = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-5d5f024c"]]);
export { BexBridgeIframe as default };
