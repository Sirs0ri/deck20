<template>
  <q-page class="flex flex-center column q-gutter-y-md q-pa-md">
    <span>Rolls</span>

    <span>Roll20 is {{ roll20Available ? '' : 'not' }} connected</span>

    <q-btn
      outline
      label="roll20 Hello World"
      class="full-width"
      @click="roll20HelloWorld"
    />

    <pre>{{ rollData }}</pre>
  </q-page>
</template>

<script setup>
import { ref } from "vue"
import { uid } from "quasar"
import { useBridge } from "src/utils/bexBridge"

const roll20Available = ref(false)
const rollData = ref(null)

const { bexSend, bexOn } = useBridge()

// Query connected tabs
console.log("querying connected Tabs")
bexSend("query-connected-tabs").then(({ data }) => {
  console.log("connected tabs:", data)
  if (data == null) return
  if (data > 0) roll20Available.value = true
})

async function roll20HelloWorld () {
  bridgedMessage("dom", "send-message", { msg: "/w max Hello World" })
    .then(data => {
      console.log("got a response:", data)
      rollData.value = data
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
