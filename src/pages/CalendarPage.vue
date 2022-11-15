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
import { uid } from "quasar"
import Calendar from "src/components/calendar/CalendarView.vue"
import { useCalendarStore } from "src/stores/calendar-store"
import { getFormattedDate } from "src/utils/calendar"
import { useBridge } from "src/utils/bexBridge"

const { bexSend, bexOn } = useBridge()

const store = useCalendarStore()

function sendToRoll20 (evt) {
  const sendPublicly = evt.ctrlKey

  bridgedMessage("dom", "send-message", {
    msg: `${sendPublicly ? "" : "/w Max "}Heute ist der ${getFormattedDate(store.today)}`,
  })
}

async function bridgedMessage (dst, command, data = {}, timeout = -1) {
  return new Promise((resolve, reject) => {
    const uuid = uid()
    let off

    // Set up timeout, if necessary
    if (timeout >= 0) {
      setTimeout(() => {
        off && off()
        reject("Timeout")
      }, timeout)
    }

    if (dst === "background") {
      // We can talk to the background script, send the command directly
      bexSend(command, data).then(data => {
        resolve(data)
      })
    } else {
      // Set up handler for the answer
      off = bexOn(`bridge-response.${uuid}`, ({ data, respond }) => {
        off()
        resolve(data)
      })

      data._pathing = {
        uuid,
        src: "ui",
        dst,
        lastFwd: "ui",
      }

      // Send command
      bexSend("bridge-forward", {
        command,
        data,
      })
    }
  })
}
</script>
