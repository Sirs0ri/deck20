import { Q as QBtn } from "./QBtn.d99eb4cd.js";
import { Q as QPage } from "./QPage.2745413d.js";
import { r as ref, K as openBlock, L as createBlock, M as withCtx, O as createBaseVNode, Z as toDisplayString, N as createVNode, H as getUid } from "./index.1f497e8e.js";
import { u as useBridge } from "./bexBridge.5ef02c5c.js";
import "./QIcon.2cc72089.js";
import "./render.797a0507.js";
import "./Ripple.9df462d2.js";
const _hoisted_1 = /* @__PURE__ */ createBaseVNode("span", null, "Rolls", -1);
const _sfc_main = {
  __name: "RollsPage",
  setup(__props) {
    const roll20Available = ref(false);
    const rollData = ref(null);
    const { bexSend, bexOn } = useBridge();
    console.log("querying connected Tabs");
    bexSend("query-connected-tabs").then(({ data }) => {
      console.log("connected tabs:", data);
      if (data == null)
        return;
      if (data > 0)
        roll20Available.value = true;
    });
    async function roll20HelloWorld() {
      bridgedMessage("dom", "send-message", { msg: "/w max Hello World" }).then((data) => {
        console.log("got a response:", data);
        rollData.value = data;
      });
    }
    async function bridgedMessage(dst, command, data = {}, timeout = -1) {
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
          }),
          createBaseVNode("pre", null, toDisplayString(rollData.value), 1)
        ]),
        _: 1
      });
    };
  }
};
export { _sfc_main as default };
