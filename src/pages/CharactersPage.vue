<template>
  <q-page class="flex column q-gutter-y-md q-pa-md">
    <h3>Characters</h3>
    <q-list>
      <input
        ref="nativeFilePicker"
        type="file"
        accept=".xml"
        style="display: none;"
        @input="evt => parseImportedFile(evt.target.files[0])"
      >

      <q-expansion-item
        expand-separator
        icon="sym_r_account_circle"
        label="Eigenschaften"
        header-class="icon-md-filled text-bold"
      >
        <q-item
          v-for="(attr) in attributes"
          :key="`attr_${attr.short}`"
          :inset-level="1"
        >
          <q-item-section class="col-8">
            {{ attr.name }}:
          </q-item-section>
          <q-item-section class="col-1 text-right">
            {{ attr.value }}
          </q-item-section>
          <q-item-section class="col" />
          <q-item-section side>
            <q-btn
              dense
              flat
              round
              icon="mdi-dice-d20"
              @click="rollAttribute(attr)"
            />
          </q-item-section>
          <!--  -->
        </q-item>
      </q-expansion-item>

      <template
        v-for="group in talentGroups"
        :key="`talents_${group.name}`"
      >
        <q-item clickable @click="expandedGroups[group.name] = !expandedGroups[group.name]">
          <q-item-section avatar>
            <q-icon :name="group.icon" color="grey-8" />
          </q-item-section>
          <q-item-section class="text-bold">
            {{ group.name }}
          </q-item-section>
          <q-item-section side>
            <q-icon
              name="sym_r_expand_more"
              :class="{'rotate-180': expandedGroups[group.name]}"
              style="transition: transform 100ms"
            />
          </q-item-section>
        </q-item>

        <!-- <q-slide-transition> -->
        <!-- <div v-if="expandedGroups[group.name]"> -->
        <q-item
          v-for="talent in getItems(group.name)"
          :key="`talent_${talent.name}`"
          dense
        >
          <q-item-section
            side
            :class="{'icon-md-filled': isFav(talent.name)}"
          >
            <q-icon
              name="sym_r_favorite"
              class="talent-fav-icon cursor-pointer"
              color="primary"
              @click="toggleFav(talent.name)"
            />
          </q-item-section>
          <q-item-section class="col-8">
            {{ talent.name }}:
          </q-item-section>
          <q-item-section class="col-1 text-right">
            {{ talent.value || "n.a." }}
          </q-item-section>
          <q-item-section class="col" />
          <q-item-section side>
            <q-btn
              dense
              flat
              round
              icon="mdi-dice-d20"
              @click="rollTalent(talent)"
            />
          </q-item-section>
        </q-item>
      </template>

      <q-separator />

      <q-item
        clickable
        :inset-level="1"
        @click="showInactiveTalents = !showInactiveTalents"
      >
        <q-item-section>
          Inaktive Talente anzeigen?
        </q-item-section>
        <q-item-section side>
          <q-toggle
            v-model="showInactiveTalents"
            checked-icon="sym_r_check"
          />
        </q-item-section>
      </q-item>
      <q-item :inset-level="1">
        <q-input
          v-model="talentSearch"
          clearable
          debounce="200"
          class="full-width"
          placeholder="Suche"
          outlined
        />
      </q-item>
    </q-list>

    <!-- FAB -->
    <q-page-sticky
      position="bottom-right"
      :offset="[18, 18]"
    >
      <q-fab
        ref="fab"
        square
        vertical-actions-align="right"
        :icon="characterLoaded ? 'sym_r_sync': 'sym_r_file_upload'"
        direction="up"
        @click="handleFabClick"
      >
        <q-fab-action
          v-if="characterLoaded"
          square
          external-label
          color="white"
          text-color="primary"
          icon="sym_r_mood"
          label="Anderer Charakter"
          label-class="bg-grey-3 text-grey-8 text-caption"
          label-position="left"
        />
        <q-fab-action
          v-if="characterLoaded"
          external-label
          color="white"
          text-color="primary"
          icon="sym_r_file_upload"
          label="Importieren"
          label-class="bg-grey-3 text-grey-8 text-caption"
          label-position="left"
          @click="pickCharacterFile"
        />
      </q-fab>
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { reactive, ref, watch/* , computed */, computed } from "vue"

import { readFile, parseXML } from "src/utils/fileUtils"
import {
  parseAttributes,
  parseTalents,
  flippedTalentGroups,
  talentGroups,
} from "src/utils/characterSheet"

console.log(flippedTalentGroups)

// const fabOpen = ref(false)
// function toggleFab () {
//   fabOpen.value = !fabOpen.value
// }

// const importedFile = ref(null)

// ========== CHARACTER ==========

const attributes = ref({})
const talents = ref({})

const characterLoaded = computed(() => {
  return Object.keys(talents.value).length
})

// { groupName1: false, (...) }
const expandedGroups = reactive(Object.fromEntries(talentGroups.map(({ name }) => [name, false])))

const showInactiveTalents = ref(false)
const talentSearch = ref("")

watch(talentSearch, (newVal, oldVal) => {
  if (newVal) {
    if (!oldVal) Object.keys(expandedGroups).forEach(g => { expandedGroups[g] = true })
  } else Object.keys(expandedGroups).forEach(g => { expandedGroups[g] = false })
})

function getItems (groupName) {
  const result = {}
  const expanded = expandedGroups[groupName]
  const re = new RegExp(talentSearch.value, "i")
  // console.log("Getting Items for", groupName, talentGroups, expanded)

  // console.log(Object.values(talents.value))

  const matches = Object.values(talents.value)
    .filter(t => (
      t.group === groupName &&
      (expanded || isFav(t.name)) &&
      (talentSearch.value === "" || t.name.match(re))
    ))
    .map(t => [t.name, t])

  if (showInactiveTalents.value) {
    const inactiveTalents = talentGroups
      .find(group => group.name === groupName)
      .talents
      .filter(t => (
        (expanded || isFav(t)) &&
        (talentSearch.value === "" || t.match(re))
      ))
      .map(t => [t, { name: t }])

    // console.log({ inactiveTalents, matches })
    Object.assign(result, Object.fromEntries(inactiveTalents))

    // return Object.fromEntries([...matches, ...inactiveTalents])
  }
  Object.assign(result, Object.fromEntries(matches))

  return result
}

// ========== HELPERS ==========
const favoriteTalents = reactive([])

/** @param {String} talent */
function isFav (talent) {
  const index = favoriteTalents.indexOf(talent)
  return index >= 0
}
/** @param {String} talent */
function toggleFav (talent) {
  const index = favoriteTalents.indexOf(talent)
  if (index >= 0) favoriteTalents.splice(index, 1)
  else favoriteTalents.push(talent)
}

// ========== FILE IMPORT ==========

const fab = ref(null)
function handleFabClick (evt) {
  if (characterLoaded.value) return
  pickCharacterFile(evt)

  fab.value.hide()
}

const nativeFilePicker = ref(null)

function pickCharacterFile (evt) {
  // Clear the input
  // .value.value is necessary to access the .value prop of a vue ref
  nativeFilePicker.value.value = null
  // Initiate a file picker dialog
  nativeFilePicker.value.click(evt)
}

async function parseImportedFile (newFile, ...args) {
  const doc = await readFile(newFile)
    .then(content => parseXML(content))

  attributes.value = parseAttributes(doc)

  talents.value = parseTalents(doc)
}

// ========== ROLL20 ==========

function rollAttribute (attribute) {
  console.log("Rolling", attribute.name, "vs", attribute.value)
}
function rollTalent (talent) {
  if (talent == null) return
  console.log("Rolling", talent.name, "vs", talent.value, `(${talent.attributes})`)
}

</script>

<style lang="scss">
.q-fab>.q-btn,
.q-btn--fab {
  border-radius: 16px;
  background-color: mix(white, $primary, 90%) !important;
  color: $primary;
}
.q-fab__actions>.q-btn {
  border-radius: 12px;
  /* background-color: mix(white, $primary, 90%) !important; */
}

.q-item {
  .talent-fav-icon {
    opacity: 0;
    transition: opacity 100ms;
  }
  &:hover .talent-fav-icon {
    opacity: 0.3;
  }
}
</style>
