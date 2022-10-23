<template>
  <q-layout view="lHh Lpr lFf">
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
      class="bg-grey-8 text-white"
    >
      <q-tabs indicator-color="red" class="text-white">
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

<script>
import { defineComponent, ref, onBeforeUnmount, computed } from "vue"
import EssentialLink from "components/EssentialLink.vue"
import { useQuasar } from "quasar"

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup () {
    // eslint-disable-next-line no-unused-vars
    const $q = useQuasar()

    window.bex_type = window.chrome.tabs.getCurrent().then(tab => {
      if (tab === undefined) return "bex-popup"
      else return "bex-options"
    })
    window.bex_type.then(type => { document.body.classList.add(type) })

    const leftDrawerOpen = ref(false)

    const serverActive = ref(false)
    $q.bex.send("query-server-status").then(({ data, respond }) => {
      serverActive.value = data
      respond()
    })
    const serverStatusCallback = ({ data, respond }) => {
      serverActive.value = data
      respond()
    }
    $q.bex.on("server-status", serverStatusCallback)

    onBeforeUnmount(() => {
      $q.bex.off("server-status", serverStatusCallback)
    })

    const linksList = computed(() => {
      return [
        {
          title: "Home",
          caption: "quasar.dev",
          icon: "sym_r_home",
          link: "/",
          class: "",
        },
        {
          title: "Calendar",
          caption: "quasar.dev",
          icon: "sym_r_event",
          link: "/calendar",
          class: "icon-md-filled",
        },
        {
          title: "Server",
          caption: "quasar.dev",
          icon: "sym_r_network_ping",
          link: "/server",
          class: "",
          alert: serverActive.value ? "green" : undefined,
        },
      ]
    })

    return {
      serverActive,
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
    }
  },
})
</script>
