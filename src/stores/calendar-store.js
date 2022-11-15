import { ref, watch } from "vue"
import { defineStore } from "pinia"
import { uid as getUid } from "quasar"

import { addDays, dateEquals } from "src/utils/calendar"

import { isBex, useBridge } from "src/utils/bexBridge"

const STORE_NAME = "calendar"

export const useCalendarStore = defineStore(STORE_NAME, () => {
  // #region ========== STATE ==========
  const uid = getUid()

  const initialDate = { day: 0, month: 0, year: 0 }

  const today = ref({ ...initialDate })
  watch(today, (newVal, oldVal) => {
    if (dateEquals(oldVal, initialDate)) return
    if (dateEquals(oldVal, newVal)) return
    persistDebounced()
  })

  function increment () {
    today.value = addDays(today.value, 1)
  }

  // #endregion

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
          today: today.value,
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
      if (data && "today" in data) today.value = data.today
      else today.value = { day: 10, month: 5, year: 1025 }

      return true
    }
    // TODO: this is not a BEX, store will have to be restored some other way
    today.value = { day: 1, month: 5, year: 1019 }
    return true
  }
  bexOn("store-persisted", ({ data }) => {
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
    today,
    increment,
    restored,
    restoration,
  }
})
