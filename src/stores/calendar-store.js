import { ref, watch } from "vue"
import { defineStore } from "pinia"

import { addDays, dateEquals } from "src/utils/calendar"

import { isBex, useBridge } from "src/utils/bexBridge"

export const useCalendarStore = defineStore("calendar", () => {
  const initialDate = { day: 0, month: 0, year: 0 }
  const today = ref({ ...initialDate })

  watch(today, (newVal, oldVal) => {
    if (dateEquals(oldVal, initialDate)) return
    if (dateEquals(oldVal, newVal)) return
    persist()
  })

  const {
    bexSend,
  } = useBridge()

  // Todo: handle store init without anything to restore
  async function restore () {
    if (isBex) {
      // Restore state via BEX bridge
      const { data } = await bexSend("restore-store", "calendar")
      if ("today" in data) today.value = data.today
      return true
    } else {
      // TODO: this is not a BEX, store will have to be restored some other way
      today.value = { day: 1, month: 5, year: 1019 }
      return true
    }
  }

  const restored = restore()

  function increment () {
    today.value = addDays(today.value, 1)

    persist()
  }

  function persist () {
    if (isBex) {
      // Persist state via BEX bridge
      bexSend("persist-store", {
        key: "calendar",
        value: {
          today: today.value,
        },
      })
    } else {
      // TODO: This is not a BEX, store will have to be persisted some other way
    }
  }

  return {
    today,
    increment,
    restored,
    // persist,
  }
})
