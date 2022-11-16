import { computed, ref, unref, watch, reactive } from "vue"
import { defineStore } from "pinia"
import { uid as getUid } from "quasar"

import { isBex, useBridge } from "src/utils/bexBridge"

const STORE_NAME = "characters"

export const useCharacterStore = defineStore(STORE_NAME, () => {
  // ========== STATE ==========
  const characters = reactive({})
  const uid = getUid()

  function setCharacter (key, data) {
    characters[key] = data
    currentCharacterKey.value = key
  }

  watch(characters, () => persistDebounced())

  const currentCharacterKey = ref(null)

  function setCurrentCharacter (key) {
    currentCharacterKey.value = key
    persist()
  }

  const currentCharacter = computed(() => characters[currentCharacterKey.value])

  // #region ========== PERSISTENCE ==========
  const restored = ref(false)
  const restoration = ref(null)

  const { bexSend, bexOn } = useBridge()

  let timeout = null
  function persistDebounced () {
    if (!restored.value) return
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(persist, 750)
  }

  function persist () {
    if (!restored.value) return

    if (isBex) {
      // Persist state via BEX bridge
      bexSend("persist-store", {
        key: STORE_NAME,
        uid,
        value: {
          characters: unref(characters),
          currentCharacterKey: unref(currentCharacterKey),
        },
      })
    } else {
      // TODO: This is not a BEX, store will have to be persisted some other way
    }
  }

  async function restore () {
    if (isBex) {
      // Restore state via BEX bridge
      const { data } = await bexSend("restore-store", STORE_NAME)
      if (data && "characters" in data) {
        for (const key in data.characters) {
          if (Object.hasOwnProperty.call(data.characters, key)) {
            characters[key] = data.characters[key]
          }
        }

        if ("currentCharacterKey" in data) currentCharacterKey.value = data.currentCharacterKey
        return true
      } else {
        // No data was restored, but the connection succeeded. This is considered a success.
        return true
      }
    }
    // TODO: this is not a BEX, store will have to be restored some other way
    return true
  }

  bexOn(`store-persisted.${STORE_NAME}`, ({ data }) => {
    if (data.uid !== uid) {
      restored.value = false
      restoration.value = restore().then((success) => {
        restored.value = success
      })
    }
  })

  restoration.value = restore().then((success) => {
    restored.value = success
  })

  // #endregion

  return {
    uid,
    restored,
    restoration,
    characters,
    currentCharacter,
    currentCharacterKey,
    setCharacter,
    setCurrentCharacter,
  }
})
