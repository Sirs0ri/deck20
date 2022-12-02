<template>
  <q-layout view="lHh Lpr lFf" style="min-width: 360px; min-height: 600px">
    <q-page-container>
      <div class="page-wrapper">
        <q-scroll-area class="absolute fit">
          <router-view />
        </q-scroll-area>
      </div>
    </q-page-container>

    <q-footer elevated>
      <!-- v-if="$q.screen.gt.xs" -->
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

import { isBex, useBridge } from "src/utils/bexBridge"

const $q = useQuasar()

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
const serverAvailable = ref(true)
bexSend("query-server-status").then(({ data }) => {
  if (data == null || data.unavailable) serverAvailable.value = false
  else serverAvailable.value = true
  serverActive.value = data?.active || false
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
  // Only during DEV mode, or PROD with active --debugging flag.
  // Otherwise code will be stripped out at compile-time.
  // See https://quasar.dev/quasar-cli-vite/handling-process-env
  if (process.env.DEBUGGING) {
    l.push({
      title: "Übersicht",
      caption: "quasar.dev",
      icon: "sym_r_home",
      link: "/",
      class: "",
    })
  }
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
  // Only for Browser Extensions
  isBex && serverAvailable.value && l.push({
    title: "Server",
    icon: "sym_r_terminal",
    link: "/server",
    class: "",
    alert: serverActive.value ? "white" : undefined,
  })
  return l
})
</script>

<style lang="scss">
.q-footer {
  background: hsla(var(--primary-hsl) / 1);
  color: white;
}
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

/*
.nav-handle {
  position: fixed;
  bottom: 0;
  left: 50%;

  width: 200px;

  height: 18px;

  transform: translateX(-50%);

  border-radius: 6px 6px 0 0;

  background: $primary;

  transition: width 200ms, height 200ms;

  display: flex;
  justify-content: center;

  &::before {
    content: "";
    pointer-events: none;

    position: absolute;
    left: 0;
    right: 0;
    bottom: 6px;
    margin-left: auto;
    margin-right: auto;

    background: rgba(white, 0.2);
    width: 56px;
    height: 6px;

    border-radius: 8px;

    transition: opacity 200ms;

  }

  .q-tabs{
    opacity: 0;
    transform: scale(0);
    min-width: 360px;
    margin: 0 6px;
    transition: transform 200ms;
  }

  &:hover {
    height: 56px;
    width: 372px;

    &::before {
      opacity: 0;
    }

    .q-tabs{
      opacity: 1;
      transform: scale(1);
    }
  }
}
*/
</style>
