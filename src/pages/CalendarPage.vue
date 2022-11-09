<template>
  <q-page class="flex column flex-center q-pa-md justify-between">
    <q-item class="text-h4 header-item" style="border-radius: 0.5em;">
      Kalender
    </q-item>
    <Calendar />

    <div class="row full-width justify-around">
      <q-btn
        class="text-weight-regular"
        icon-right="sym_r_send"
        label="Teilen"
        no-caps
        flat
        @click="sendToRoll20"
      />
      <q-btn
        class="text-weight-regular icon-md-filled"
        icon-right="sym_r_event_upcoming"
        label="weiter"
        no-caps
        flat
        @click="store.increment"
      />
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar"
import Calendar from "src/components/calendar/CalendarView.vue"
import { getFormattedDate } from "src/utils/calendar"
import { useCalendarStore } from "src/stores/calendar-store"

const $q = useQuasar()

const store = useCalendarStore()

function sendToRoll20 (evt) {
  const sendPublicly = evt.ctrlKey
  $q.bex.send("ui-called-action", {
    command: "do-message",
    data: `${sendPublicly ? "" : "/w Max "}Heute ist der ${getFormattedDate(store.today)}`,
  })
}
</script>
