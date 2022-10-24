import { defineStore } from "pinia"
import { ref, watch } from "vue"

import { addDays, dateEquals } from "src/components/calendar/calendar"
import { useQuasar } from "quasar"

export const useCalendarStore = defineStore("calendar", () => {
  const $q = useQuasar()

  const initialDate = { day: 0, month: 0, year: 0 }
  const today = ref({ ...initialDate })

  watch(today, (newVal, oldVal) => {
    if (dateEquals(oldVal, initialDate)) return
    if (dateEquals(oldVal, newVal)) return
    persist()
  })

  async function restore () {
    if ($q.bex != null) {
      // Restore state via BEX bridge
      const { data } = await $q.bex.send("restore-store", "calendar")
      if ("today" in data) today.value = data.today
      return true
    } else {
      // TODO: this is not a BEX, store will have to be restored some other way
      return new Promise(resolve => { resolve(false) })
    }
  }

  const restored = restore()

  function increment () {
    today.value = addDays(today.value, 1)

    persist()
  }

  function persist () {
    if ($q.bex != null) {
      // Persist state via BEX bridge
      $q.bex.send("persist-store", {
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
    persist,
  }
})
