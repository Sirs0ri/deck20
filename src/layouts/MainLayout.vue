<template>
  <q-layout view="lHh Lpr lFf" style="min-width: 360px; min-height: 520px">
    <q-header v-if="$q.screen.gt.xs" elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="$q.screen.gt.xs"
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Essential Links
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
          :class="link.class"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer
      v-if="!$q.screen.gt.xs"
      elevated
      class="bg-primary text-white"
    >
      <q-tabs
        class="text-white"
        no-caps
        narrow-indicator
        switch-indicator
      >
        <q-route-tab
          v-for="link in essentialLinks"
          :key="link.title"
          :icon="link.icon"
          :to="link.link"
          :class="link.class"
          :alert="link.alert ?? false"
          exact
        />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, onBeforeUnmount, computed } from "vue"
import { useQuasar } from "quasar"
import EssentialLink from "components/EssentialLink.vue"

import { isBex, useBridge } from "src/utils/bexBridge"

// eslint-disable-next-line no-unused-vars
const $q = useQuasar()

const leftDrawerOpen = ref(false)

const {
  bexSend,
  bexOn,
  bexOff,
} = useBridge($q.bex)

// Set body class depending on what this is - bex, pwa, spa, etc.
if (isBex) {
  // TODO: This fails if it's not a BEX
  window.bex_type = window.chrome.tabs.getCurrent().then(tab => {
    if (tab === undefined) return "bex-popup"
    else return "bex-options"
  })
  window.bex_type.then(type => { document.body.classList.add(type) })
} else {
  document.body.classList.add(process.env.MODE)
}

// Handle server state
const serverActive = ref(false)
bexSend("query-server-status").then(({ data }) => {
  if (!data) return
  serverActive.value = data
})

const serverStatusCallback = ({ data, respond }) => {
  serverActive.value = data
  respond()
}
bexOn("server-status", serverStatusCallback)
onBeforeUnmount(() => {
  bexOff("server-status", serverStatusCallback)
})

const essentialLinks = computed(() => {
  const l = []
  l.push({
    title: "Übersicht",
    caption: "quasar.dev",
    icon: "sym_r_home",
    link: "/",
    class: "",
  })
  l.push({
    title: "Würfe",
    icon: "sym_r_casino",
    link: "/rolls",
    class: "",
  })
  l.push({
    title: "Kalender",
    icon: "sym_r_event",
    link: "/calendar",
    class: "icon-md-filled",
  })
  l.push({
    title: "Charaktere",
    icon: "sym_r_emoji_people",
    link: "/characters",
    class: "",
  })
  isBex && l.push({
    title: "Server",
    icon: "sym_r_terminal",
    link: "/server",
    class: "",
    alert: serverActive.value ? "white" : undefined,
  })
  return l
})

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style lang="scss">
.q-tab {
  margin: 4px 0;
  border-radius: 4px;
}

.q-tab__indicator {
  inset: 6px -10px;
  height: auto;
  z-index: -1;
  /* Very large Border Radius in px, for pil shape */
  border-radius: 60px;
  /* aspect-ratio: 1/1; */
  /* margin: auto 0px; */
  opacity: 0;

  .q-tab--active & {
    opacity: 0.3;
  }
}
</style>
