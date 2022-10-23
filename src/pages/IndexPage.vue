<template>
  <q-page class="flex flex-center column q-gutter-y-md q-pa-md" style="min-width: 250px; min-height: 300px">
    <span>Index</span>
    <span>This is {{ isPopup ? "" : "not" }} a popup</span>
  </q-page>
</template>

<script setup>
import { ref } from "vue"

const isPopup = ref(false)
if ("bex_type" in window) window.bex_type.then(type => { isPopup.value = type === "bex-popup" })

</script>
