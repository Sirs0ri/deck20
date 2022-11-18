
<template>
  <q-avatar size="sm" class="info-avatar">
    <img src="/icons/icosahedron.png">
  </q-avatar>
</template>

<script setup>
import { useQuasar } from "quasar"
import { storeToRefs } from "pinia"
import { useCharacterStore } from "src/stores/characters-store"
import { useRollsStore } from "src/stores/rolls-store"
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

const { bexOn } = useBridge($q.bex)

const charStore = useCharacterStore()
const { currentCharacter } = storeToRefs(charStore)

const rollStore = useRollsStore()

bexOn("query-talents", async ({ data }) => {
  log("got query-talents", data, "responding with character info")

  if (!data._pathing) return

  const { uuid, src } = data._pathing

  await (charStore.restoration)

  let talents = []

  for (const t of Object.values(currentCharacter.value.talents)) {
    talents.push(t)

    for (const [extraname, extraValue] of Object.entries(t.extraRolls)) {
      talents.push({
        attributes: t.attributes,
        extraRolls: {},
        group: t.group,
        name: `${t.name} (${extraname})`,
        specializations: [],
        value: extraValue,
      })
    }
  }

  if (data.filter) {
    const rExpIllegals = /[.*+?^${}()|[\]\\]/g
    const rExpEscape = (word) => word.replace(rExpIllegals, "\\$&")

    const str = (data.filter instanceof Array) ? data.filter.map(word => `(${rExpEscape(word)})`).join("|") : rExpEscape(data.filter)
    const re = new RegExp(str, "i")
    log(re)
    talents = talents.filter(t => t.name.match(re))
  }

  const responseMsg = {
    command: `bridge-response.${uuid}`,
    data: {
      result: talents.map(t => ({
        label: `${t.name} (${t.attributes.join("/")}): ${t.value}`,
        value: t.name,
        talent: t,
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

bexOn("query-attributes", async ({ data }) => {
  log("got query-attributes", data, "responding with character info")

  if (!data._pathing) return

  const { uuid, src } = data._pathing

  await (charStore.restoration)

  let attributes = Object.values(currentCharacter.value.attributes)

  if (data.filter) {
    const rExpIllegals = /[.*+?^${}()|[\]\\]/g
    const rExpEscape = (word) => word.replace(rExpIllegals, "\\$&")

    const str = (data.filter instanceof Array) ? data.filter.map(word => `(${rExpEscape(word)})`).join("|") : rExpEscape(data.filter)
    const re = new RegExp(str, "i")
    attributes = attributes.filter(a => a.short.match(re))
  }

  const responseMsg = {
    command: `bridge-response.${uuid}`,
    data: {
      result: attributes.map(a => ({
        label: `${a.name}: ${a.value}`,
        value: a.name,
        attribute: a,
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

bexOn("persist-roll", ({ data }) => {
  log("I was asked to persist a roll:", data)
  if (process.env.DEBUGGING) {
    data.debug = true
  }
  if (data?.msgData?.id) rollStore.addRoll(data, data.msgData.id)
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
  inset: 0;
  margin: auto;
}
</style>
