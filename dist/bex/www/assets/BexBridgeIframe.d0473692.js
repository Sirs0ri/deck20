import { u as useCharacterStore, Q as QAvatar } from "./characters-store.048f4fbd.js";
import { u as useQuasar } from "./use-quasar.3e7bdfda.js";
import { a5 as _export_sfc, a6 as storeToRefs, K as openBlock, L as createBlock, M as withCtx, ab as pushScopeId, ac as popScopeId, O as createBaseVNode } from "./index.b0068bd8.js";
import { u as useRollsStore } from "./rolls-store.bc7910dc.js";
import { u as useBridge } from "./bexBridge.2fbfd709.js";
import "./QIcon.b3f3bd12.js";
import "./render.a8eadc37.js";
var BexBridgeIframe_vue_vue_type_style_index_0_lang = "";
var BexBridgeIframe_vue_vue_type_style_index_1_scoped_true_lang = "";
const _withScopeId = (n) => (pushScopeId("data-v-95b362d2"), n = n(), popScopeId(), n);
const _hoisted_1 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("img", { src: "/icons/icosahedron.png" }, null, -1));
const _sfc_main = {
  __name: "BexBridgeIframe",
  setup(__props) {
    const $q = useQuasar();
    const { bexOn } = useBridge($q.bex);
    const charStore = useCharacterStore();
    const { currentCharacter } = storeToRefs(charStore);
    const rollStore = useRollsStore();
    bexOn("query-talents", async ({ data }) => {
      if (!data._pathing)
        return;
      const { uuid, src } = data._pathing;
      await charStore.restoration;
      let talents = [];
      for (const t of Object.values(currentCharacter.value.talents)) {
        talents.push(t);
        for (const [extraname, extraValue] of Object.entries(t.extraRolls)) {
          talents.push({
            attributes: t.attributes,
            extraRolls: {},
            group: t.group,
            name: `${t.name} (${extraname})`,
            specializations: [],
            value: extraValue
          });
        }
      }
      if (data.filter) {
        const rExpIllegals = /[.*+?^${}()|[\]\\]/g;
        const rExpEscape = (word) => word.replace(rExpIllegals, "\\$&");
        const str = data.filter instanceof Array ? data.filter.map((word) => `(${rExpEscape(word)})`).join("|") : rExpEscape(data.filter);
        const re = new RegExp(str, "i");
        talents = talents.filter((t) => t.name.match(re));
      }
      const responseMsg = {
        command: `bridge-response.${uuid}`,
        data: {
          result: talents.map((t) => ({
            label: `${t.name} (${t.attributes.join("/")}): ${t.value}`,
            value: t.name,
            talent: t
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
    bexOn("query-attributes", async ({ data }) => {
      if (!data._pathing)
        return;
      const { uuid, src } = data._pathing;
      await charStore.restoration;
      let attributes = Object.values(currentCharacter.value.attributes);
      if (data.filter) {
        const rExpIllegals = /[.*+?^${}()|[\]\\]/g;
        const rExpEscape = (word) => word.replace(rExpIllegals, "\\$&");
        const str = data.filter instanceof Array ? data.filter.map((word) => `(${rExpEscape(word)})`).join("|") : rExpEscape(data.filter);
        const re = new RegExp(str, "i");
        attributes = attributes.filter((a) => a.short.match(re));
      }
      const responseMsg = {
        command: `bridge-response.${uuid}`,
        data: {
          result: attributes.map((a) => ({
            label: `${a.name}: ${a.value}`,
            value: a.name,
            attribute: a
          })),
          associatedToken: currentCharacter.value.associatedToken,
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
    bexOn("persist-roll", ({ data }) => {
      var _a;
      if ((_a = data == null ? void 0 : data.msgData) == null ? void 0 : _a.id)
        rollStore.addRoll(data, data.msgData.id);
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
var BexBridgeIframe = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-95b362d2"]]);
export { BexBridgeIframe as default };
