<template>
  <q-page class="flex flex-center column q-gutter-y-md q-pa-md" style="min-width: 250px; min-height: 300px">
    <span>Index</span>
    <span>This is {{ isPopup ? "" : "not" }} a popup</span>
  </q-page>
</template>

<script>
import {
  defineComponent,
  ref,
  onBeforeUnmount,
} from "vue"
import { useQuasar } from "quasar"
import { useRoute } from "vue-router"

const log = (...args) => console.log("[bex] ui", ...args)

export default defineComponent({
  name: "IndexPage",

  setup () {
    const $q = useQuasar()

    // eslint-disable-next-line no-unused-vars
    const $route = useRoute()

    // This can talk to background
    // There is no locally running content script, since it's not an allowlisted origin
    // There is no access to other content scripts.
    // There is no access to dom scripts
    function sendBexMessage (msg) {
      $q.bex.send(msg)
    }

    // Set up BEX Bridge comms
    const serverActive = ref(false)
    $q.bex.send("query-server-status").then(({ data, respond }) => {
      serverActive.value = data
      respond()
    })
    const connectedTabs = ref(0)
    $q.bex.send("query-connected-tabs").then(({ data, respond }) => {
      connectedTabs.value = data
      respond()
    })

    const serverStatusCallback = ({ data, respond }) => {
      log("got server status update", data)
      serverActive.value = data
      respond()
    }
    $q.bex.on("server-status", serverStatusCallback)

    const isPopup = ref(false)
    window.bex_type.then(type => { isPopup.value = type === "bex-popup" })

    onBeforeUnmount(() => {
      $q.bex.off("server-status", serverStatusCallback)
    })

    return {
      sendBexMessage,
      serverActive,
      connectedTabs,
      isPopup,
    }
  },

})
</script>
