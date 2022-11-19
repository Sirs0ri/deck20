import { Q as QItem } from "./QItem.033819c2.js";
import { Q as QList, a as QItemSection, b as QItemLabel } from "./QList.78849ffd.js";
import { Q as QBtn } from "./QBtn.5848d314.js";
import { Q as QPage } from "./QPage.476cf600.js";
import { u as useRollsStore } from "./rolls-store.bc7910dc.js";
import { r as ref, K as openBlock, L as createBlock, M as withCtx, N as createVNode, _ as createTextVNode, P as createElementBlock, Q as renderList, R as unref, S as Fragment, Z as toDisplayString, O as createBaseVNode } from "./index.b0068bd8.js";
import "./use-dark.73118c32.js";
import "./Ripple.31e5d7c7.js";
import "./render.a8eadc37.js";
import "./QIcon.b3f3bd12.js";
import "./bexBridge.2fbfd709.js";
var RollsPage_vue_vue_type_style_index_0_lang = "";
const _hoisted_1 = ["innerHTML"];
const _sfc_main = {
  __name: "RollsPage",
  setup(__props) {
    const rollStore = useRollsStore();
    rollStore.restoration.then(() => {
      console.log("There are", Object.keys(rollStore.rolls).length, "rolls stored");
      console.log(rollStore.rolls);
    });
    const activeItems = ref([]);
    function toggleRollView(id) {
      const index = activeItems.value.indexOf(id);
      if (index >= 0) {
        activeItems.value.splice(index, 1);
        return;
      }
      activeItems.value.push(id);
    }
    function getIsVisible(id) {
      return activeItems.value.includes(id);
    }
    const reInlineRoll = /\$\[\[(?<name>\d)]]/g;
    const reModifier = /{{\s*mod\s*=\s*(\d+)\s*}}/i;
    function getRollHtml(id) {
      const roll = rollStore.rolls[id];
      const getSpanWithTooltip = (textContent, tooltip) => {
        return `<span title="${tooltip}">${textContent}</span>`;
      };
      const htmlStr = roll.msgData.content.replaceAll(reInlineRoll, (match, p1, offset, string, groups) => {
        const num = parseInt(p1);
        const inlineRoll = roll.msgData.inlinerolls[num];
        return getSpanWithTooltip(inlineRoll.results.total, inlineRoll.expression);
      });
      return htmlStr;
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(QPage, { class: "flex column q-gutter-y-md q-pa-md" }, {
        default: withCtx(() => [
          createVNode(QList, null, {
            default: withCtx(() => [
              createVNode(QItem, { class: "text-h4 header-item q-mb-md" }, {
                default: withCtx(() => [
                  createTextVNode(" W\xFCrfe ")
                ]),
                _: 1
              }),
              (openBlock(true), createElementBlock(Fragment, null, renderList(unref(rollStore).rolls, (roll, id) => {
                return openBlock(), createBlock(QItem, { key: id }, {
                  default: withCtx(() => [
                    createVNode(QItemSection, { top: "" }, {
                      default: withCtx(() => [
                        createVNode(QItemLabel, null, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(roll.talent.name), 1)
                          ]),
                          _: 2
                        }, 1024),
                        getIsVisible(id) ? (openBlock(), createBlock(QItemLabel, {
                          key: 0,
                          style: { "word-break": "break-all" }
                        }, {
                          default: withCtx(() => [
                            createBaseVNode("div", {
                              innerHTML: getRollHtml(id)
                            }, null, 8, _hoisted_1)
                          ]),
                          _: 2
                        }, 1024)) : (openBlock(), createBlock(QItemLabel, {
                          key: 1,
                          caption: ""
                        }, {
                          default: withCtx(() => {
                            var _a, _b, _c;
                            return [
                              createTextVNode(" TaW: " + toDisplayString(roll.talent.value) + " TaP*: " + toDisplayString(roll.total) + " Mod: " + toDisplayString(((_c = (_b = (_a = roll.msgData) == null ? void 0 : _a.original_content) == null ? void 0 : _b.match(reModifier)) == null ? void 0 : _c[1]) || "unbekannt"), 1)
                            ];
                          }),
                          _: 2
                        }, 1024))
                      ]),
                      _: 2
                    }, 1024),
                    createVNode(QItemSection, {
                      side: "",
                      top: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(QBtn, {
                          icon: getIsVisible(id) ? "sym_r_expand_less" : "sym_r_expand_more",
                          round: "",
                          flat: "",
                          onClick: ($event) => toggleRollView(id)
                        }, null, 8, ["icon", "onClick"])
                      ]),
                      _: 2
                    }, 1024)
                  ]),
                  _: 2
                }, 1024);
              }), 128))
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
