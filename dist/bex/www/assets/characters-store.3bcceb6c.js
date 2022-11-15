import { a3 as defineStore, I as reactive, H as getUid, w as watch, r as ref, q as computed, R as unref } from "./index.1f497e8e.js";
import { u as useBridge } from "./bexBridge.5ef02c5c.js";
const STORE_NAME = "characters";
const useCharacterStore = defineStore(STORE_NAME, () => {
  const characters = reactive({});
  const uid = getUid();
  function setCharacter(key, data) {
    characters[key] = data;
    currentCharacterKey.value = key;
  }
  watch(characters, () => persistDebounced());
  const currentCharacterKey = ref(null);
  function setCurrentCharacter(key) {
    currentCharacterKey.value = key;
    persist();
  }
  const currentCharacter = computed(() => characters[currentCharacterKey.value]);
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
        uid,
        value: {
          characters: unref(characters),
          currentCharacterKey: unref(currentCharacterKey)
        }
      });
    }
  }
  async function restore() {
    {
      const { data } = await bexSend("restore-store", STORE_NAME);
      if (data && "characters" in data) {
        for (const key in data.characters) {
          if (Object.hasOwnProperty.call(data.characters, key)) {
            characters[key] = data.characters[key];
          }
        }
        if ("currentCharacterKey" in data)
          currentCharacterKey.value = data.currentCharacterKey;
        return true;
      } else {
        return true;
      }
    }
  }
  bexOn("store-persisted", ({ data }) => {
    if (data.uid !== uid) {
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
    uid,
    restored,
    restoration,
    characters,
    currentCharacter,
    currentCharacterKey,
    setCharacter,
    setCurrentCharacter
  };
});
export { useCharacterStore as u };
