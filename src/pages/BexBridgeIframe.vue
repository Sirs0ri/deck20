
<template>
  <q-avatar size="sm" class="info-avatar">
    <img src="/icons/icosahedron.png">
  </q-avatar>
</template>

<script setup>
import { useQuasar } from "quasar"
import { storeToRefs } from "pinia"
import { useCharacterStore } from "src/stores/characters-store"
import { useBridge } from "src/utils/bexBridge"

/** Wrapper for console.log that adds a "[bex] iframe" prefix infront of the logged message
 *
 * @param  {...any} args
 */
const log = (...args) => {
  if (process.env.DEBUGGING) { console.log("[bex] iframe:", ...args) }
}

log("active", Date.now())

const $q = useQuasar()

useBridge($q.bex)

const store = useCharacterStore()
const { currentCharacter, restoration } = storeToRefs(store)

$q.bex.on("query-talents", async ({ data }) => {
  log("got query-talents", data, "responding with character info")

  if (!data._pathing) return

  const { uuid, src } = data._pathing

  await (restoration.value)

  let talents = Object.values(currentCharacter.value.talents)

  // log("all talents:", talents)

  if (data.msg) {
    const re = new RegExp(data.msg, "i")
    talents = talents.filter(t => t.name.match(re))
  }

  const responseMsg = {
    command: `bridge-response.${uuid}`,
    data: {
      result: talents.map(t => ({
        label: `${t.name} (${t.attributes.join("/")}): ${t.value}`,
        value: t.name,
      })),
      _pathing: {
        uuid,
        src: "ui",
        dst: src,
        lastFwd: "ui",
      },
    },
  }
  log("returning response", responseMsg)
  $q.bex.send("bridge-forward", responseMsg)
})
</script>

<style lang="scss">
body {
  min-width: auto;
}
</style>

<style lang="scss" scoped>
.info-avatar {
  position: fixed;
  bottom: 0;
  right: 0;
}
</style>
