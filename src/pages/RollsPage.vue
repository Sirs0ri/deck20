<template>
  <q-page class="flex column q-gutter-y-md q-pa-md">
    <q-list>
      <q-item class="text-h4 header-item q-mb-md">
        Würfe
      </q-item>

      <q-item v-for="(roll, id) in rollStore.rolls" :key="id">
        <q-item-section top>
          <q-item-label>{{ roll.talent.name }}</q-item-label>
          <q-item-label v-if="getIsVisible(id)" style="word-break: break-all;">
            {{/* eslint-disable-next-line vue/no-v-html */}}
            <div v-html="getRollHtml(id)" />
          </q-item-label>
          <q-item-label v-else caption>
            TaW: {{ roll.talent.value }}
            TaP*: {{ roll.total }}
            Mod: {{ roll.msgData?.original_content?.match(reModifier)?.[1] || "unbekannt" }}
          </q-item-label>
        </q-item-section>
        <q-item-section side top>
          <q-btn
            :icon="getIsVisible(id) ? 'sym_r_expand_less' : 'sym_r_expand_more'"
            round
            flat
            @click="toggleRollView(id)"
          />
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import { ref } from "vue"
import { useRollsStore } from "src/stores/rolls-store"

const rollStore = useRollsStore()

rollStore.restoration.then(() => {
  console.log("There are", Object.keys(rollStore.rolls).length, "rolls stored")
  console.log(rollStore.rolls)
})

// #region ========== Roll Items ==========
const activeItems = ref([])
function toggleRollView (id) {
  const index = activeItems.value.indexOf(id)
  if (index >= 0) {
    activeItems.value.splice(index, 1)
    return
  }
  activeItems.value.push(id)
}
function getIsVisible (id) {
  return activeItems.value.includes(id)
}

const reInlineRoll = /\$\[\[(?<name>\d)]]/g
const reModifier = /{{\s*mod\s*=\s*(\d+)\s*}}/i

function getRollHtml (id) {
  const roll = rollStore.rolls[id]

  const getSpanWithTooltip = (textContent, tooltip) => {
    return `<span title="${tooltip}">${textContent}</span>`
  }

  const htmlStr = roll.msgData.content.replaceAll(reInlineRoll, (match, p1, offset, string, groups) => {
    const num = parseInt(p1)
    const inlineRoll = roll.msgData.inlinerolls[num]
    return getSpanWithTooltip(inlineRoll.results.total, inlineRoll.expression)
  })

  return htmlStr
}
// #endregion
</script>

<style lang="scss">
.sheet-rolltemplate-default table {
  width: 100%;
  background-color: white;
  border: 1px solid rgba(112, 32, 130, 1);
}

.sheet-rolltemplate-default caption {
  background-color: rgba(112, 32, 130, 1);
  color: white;
  font-family: "Helvetica Neue", Helvetica, sans-serif;
  font-weight: 300;
  font-size: 1.1em;
  padding: 5px;
}

.sheet-rolltemplate-default td {
  padding: 5px;
  line-height: 1.4em;
  vertical-align: top;
}

.sheet-rolltemplate-default td:first-child {
  font-weight: bold;
  text-align: right;
  min-width: 50px;
  padding-right: 10px;
}

.sheet-rolltemplate-default tr:nth-child(even) {
  background-color: #eee;
}
</style>
