<template>
  <q-page class="flex flex-center column q-gutter-y-md q-pa-md">
    <q-btn
      outline
      :label="`Turn Server ${serverActive ? 'off' : 'on'}`"
      class="full-width"
      @click="toggleServer"
    />

    <span>
      Connected Tabs: {{ connectedTabs }}
    </span>
  </q-page>
</template>

<script setup>
import { ref, onBeforeUnmount } from "vue"
// import { useQuasar } from "quasar"

import { useBridge } from "src/utils/bexBridge"

const log = (...args) => console.log("[bex] ui", ...args)

const {
  bexSend,
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
  if (!data) return
  connectedTabs.value = data
})

const serverStatusCallback = ({ data, respond }) => {
  log("got server status update", data)
  serverActive.value = data
  respond()
}

const bexOffServerStatus = bexOn("server-status", serverStatusCallback)

onBeforeUnmount(() => {
  bexOffServerStatus()
})

</script>
