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
  </q-page>
</template>

<script setup>
import { ref } from "vue"
import { useBridge } from "src/utils/bexBridge"

const roll20Available = ref(false)

const { bexSend } = useBridge()

// Query connected tabs
console.log("querying connected Tabs")
bexSend("query-connected-tabs").then(({ data }) => {
  console.log("connected tabs:", data)
  if (data == null) return
  if (data > 0) roll20Available.value = true
})

function roll20HelloWorld () {
  bexSend("ui-called-action", {
    command: "do-message",
    data: "/w Max Hello World",
  })
}
</script>
