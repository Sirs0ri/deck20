<template>
  <q-page class="flex column q-gutter-y-md q-pa-md">
    <q-list>
      <q-item class="text-h4 header-item q-mb-md">
        Server
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label>Roll20 is {{ roll20Available ? '' : 'not' }} connected</q-item-label>
          <q-item-label caption>
            Connected Tabs: {{ connectedTabs }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <q-btn
          outline
          :label="`Turn Server ${serverActive ? 'off' : 'on'}`"
          class="full-width"
          @click="toggleServer"
        />
      </q-item>

      <q-item>
        <q-btn
          outline
          label="roll20 Hello World"
          class="full-width"
          @click="roll20HelloWorld"
        />
      </q-item>

      <q-item>
        <pre style="white-space: pre-wrap;">{{ rollData }}</pre>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import { ref, onBeforeUnmount, computed } from "vue"

import { useBridge } from "src/utils/bexBridge"

const log = (...args) => console.log("[bex] ui", ...args)

const {
  bexSend,
  bexSendBridged,
  bexOn,
} = useBridge()

const serverActive = ref(false)
const connectedTabs = ref(0)

// This can talk to background
// There is no locally running content script, since it's not an allowlisted origin
// There is no access to other content scripts.
// There is no access to dom scripts
function toggleServer () {
  bexSend("toggle-server")
}

// Set up BEX Bridge comms
bexSend("query-server-status").then(({ data }) => {
  if (!data) return
  serverActive.value = data.active
})
bexSend("query-connected-tabs").then(({ data }) => {
  console.log("connected tabs:", data)
  if (!data) return
  connectedTabs.value = data
})

const roll20Available = computed(() => connectedTabs.value > 0)

const serverStatusCallback = ({ data, respond }) => {
  log("got server status update", data)
  serverActive.value = data
  respond()
}

const bexOffServerStatus = bexOn("server-status", serverStatusCallback)

onBeforeUnmount(() => {
  bexOffServerStatus()
})

const rollData = ref(null)

async function roll20HelloWorld () {
  bexSendBridged("dom", "send-message", { msg: "Hello World", target: "MYSELF" })
    .then(data => {
      console.log("got a response:", data)
      rollData.value = data
    })
}
</script>
