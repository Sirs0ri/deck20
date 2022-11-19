import { a as useSizeProps, b as useSize, Q as QIcon } from "./QIcon.b3f3bd12.js";
import { c as createComponent, f as hMergeSlotSafely } from "./render.a8eadc37.js";
import { q as computed, h, a0 as defineStore, I as reactive, H as getUid, w as watch, r as ref, R as unref } from "./index.b0068bd8.js";
import { u as useBridge } from "./bexBridge.2fbfd709.js";
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
const STORE_NAME = "characters";
const useCharacterStore = defineStore(STORE_NAME, () => {
  const characters = reactive({});
  const uid = getUid();
  function setCharacter(key, data) {
    characters[key] = data;
    currentCharacterKey.value = key;
  }
  function deleteCharacter(key) {
    delete characters[key];
    const characterKeys = Object.keys(characters);
    setCurrentCharacter(characterKeys[0]);
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
  bexOn(`store-persisted.${STORE_NAME}`, ({ data }) => {
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
    setCurrentCharacter,
    deleteCharacter
  };
});
export { QAvatar as Q, useCharacterStore as u };
