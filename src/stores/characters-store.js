import { computed, ref, unref } from "vue"
import { defineStore } from "pinia"

import { isBex, useBridge } from "src/utils/bexBridge"

const STORE_NAME = "characters"

export const useCharacterStore = defineStore(STORE_NAME, () => {
  // ========== STATE ==========

  const characters = ref({})
  function setCharacter (key, data) {
    characters.value[key] = data
    currentCharacterKey.value = key
    persist()
  }

  const currentCharacterKey = ref(null)

  function setCurrentCharacter (key) {
    currentCharacterKey.value = key
    persist()
  }

  const currentCharacter = computed(() => characters.value[currentCharacterKey.value])

  // ========== PERSISTENCE ==========
  const {
    bexSend,
  } = useBridge()

  function persist () {
    if (isBex) {
      // Persist state via BEX bridge
      bexSend("persist-store", {
        key: STORE_NAME,
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
      if ("characters" in data) {
        for (const key in data.characters) {
          if (Object.hasOwnProperty.call(data.characters, key)) {
            const character = data.characters[key]
            setCharacter(key, character)
          }
        }

        if ("currentCharacterKey" in data) currentCharacterKey.value = data.currentCharacterKey
        return true
      } else {
      // TODO: this is not a BEX, store will have to be restored some other way
        return true
      }
    }
  }

  const restored = restore()

  return {
    restored,
    characters,
    currentCharacter,
    currentCharacterKey,
    setCharacter,
    setCurrentCharacter,
  }
})
