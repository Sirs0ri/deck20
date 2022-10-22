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
          exact
        />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue"
import EssentialLink from "components/EssentialLink.vue"
import { useQuasar } from "quasar"

const linksList = [
  {
    title: "Home",
    caption: "quasar.dev",
    icon: "sym_o_home",
    link: "/",
  },
  {
    title: "Calendar",
    caption: "quasar.dev",
    icon: "sym_o_today",
    link: "/calendar",
  },
  {
    title: "Server",
    caption: "quasar.dev",
    icon: "sym_o_dns",
    link: "/server",
  },
]

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup () {
    // eslint-disable-next-line no-unused-vars
    const $q = useQuasar()

    const leftDrawerOpen = ref(false)

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
    }
  },
})
</script>
