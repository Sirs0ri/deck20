import { a0 as defineStore, I as reactive, H as uid, w as watch, r as ref, R as unref } from "./index.e5422758.js";
import { u as useBridge } from "./bexBridge.93e2371e.js";
const STORE_NAME = "rolls";
const useRollsStore = defineStore(STORE_NAME, () => {
  const rolls = reactive({});
  const uid$1 = uid();
  function addRoll(data, key) {
    rolls[key] = data;
  }
  watch(rolls, () => persistDebounced());
  const restored = ref(false);
  const restoration = ref(null);
  const { bexSend, bexOn } = useBridge();
  let timeout = null;
  function persistDebounced() {
    if (!restored.value)
      return;
    if (timeout)
      clearTimeout(timeout);
    timeout = setTimeout(persist, 750);
  }
  function persist() {
    if (!restored.value)
      return;
    {
      bexSend("persist-store", {
        key: STORE_NAME,
        uid: uid$1,
        value: {
          rolls: unref(rolls)
        }
      });
    }
  }
  async function restore() {
    {
      const { data } = await bexSend("restore-store", STORE_NAME);
      if (data && "rolls" in data) {
        for (const key in data.rolls) {
          if (Object.hasOwnProperty.call(data.rolls, key)) {
            rolls[key] = data.rolls[key];
          }
        }
        return true;
      } else {
        return true;
      }
    }
  }
  bexOn(`store-persisted.${STORE_NAME}`, ({ data }) => {
    if (data.uid !== uid$1) {
      restored.value = false;
      restoration.value = restore().then((success) => {
        restored.value = success;
      });
    }
  });
  restoration.value = restore().then((success) => {
    restored.value = success;
  });
  return {
    uid: uid$1,
    restored,
    restoration,
    rolls,
    addRoll
  };
});
export { useRollsStore as u };
