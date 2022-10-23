<template>
  <q-page class="flex flex-center column q-gutter-y-md q-pa-md" style="min-width: 250px; min-height: 300px">
    <q-btn
      outline
      label="roll20 Hello World"
      class="full-width"
      @click="roll20HelloWorld"
    />
    <q-btn
      outline
      :label="`Turn Server ${serverActive ? 'off' : 'on'}`"
      class="full-width"
      @click="toggleServer"
    />

    <span>
      Connected Tabs: {{ connectedTabs }}
    </span>
    <!-- <pre>{{ JSON.stringify($q.screen, null, 4) }}</pre>
    <pre>{{ JSON.stringify($route, null, 4) }}</pre> -->
  </q-page>
</template>

<script>
import { defineComponent, ref, onBeforeUnmount } from "vue"
import { useQuasar } from "quasar"
import { useRoute } from "vue-router"

const log = (...args) => console.log("[bex] ui", ...args)

export default defineComponent({
  name: "IndexPage",

  setup () {
    const $q = useQuasar()

    // eslint-disable-next-line no-unused-vars
    const $route = useRoute()

    const serverActive = ref(false)
    const connectedTabs = ref(0)

    // This can talk to background
    // There is no locally running content script, since it's not an allowlisted origin
    // There is no access to other content scripts.
    // There is no access to dom scripts
    function toggleServer () {
      $q.bex.send("toggle-server")
    }
    function roll20HelloWorld () {
      $q.bex.send("ui-called-action", {
        command: "do-message",
        data: "/w Max Hello World",
      })
    }

    // Set up BEX Bridge comms
    $q.bex.send("query-server-status").then(({ data, respond }) => {
      serverActive.value = data
      respond()
    })
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

    onBeforeUnmount(() => {
      $q.bex.off("server-status", serverStatusCallback)
    })

    return {
      toggleServer,
      roll20HelloWorld,
      serverActive,
      connectedTabs,
    }
  },

})
</script>
