<template>
  <q-page class="flex column q-gutter-y-md q-pa-md">
    <h3>Characters</h3>
    <q-list class="relative-position">
      <input
        ref="nativeFilePicker"
        type="file"
        accept=".xml"
        style="display: none;"
        @input="evt => parseImportedFile(evt.target.files[0])"
      >

      <q-item v-if="currentCharacter">
        <q-item-section>
          <q-item-label>
            {{ currentCharacter.generalData.name }}
          </q-item-label>
          <q-item-label caption>
            {{ currentCharacter.generalData.profession }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item key="search" style="position: sticky; top: 0; z-index: 1;">
        <q-input
          v-model="talentSearch"
          clearable
          debounce="200"
          class="full-width bg-glassed"
          placeholder="Suche"
          outlined
          @clear="talentSearch = ''"
        />
      </q-item>

      <TransitionGroup name="list">
        <q-item
          key="header_attributes"
          clickable
          class="rounded-borders"
          @click="expandedAttributes = !expandedAttributes"
        >
          <q-item-section avatar>
            <q-icon
              name="sym_r_account_circle"
              color="primary"
              class="icon-md-filled"
            />
          </q-item-section>
          <q-item-section class="text-bold">
            Eigenschaften
          </q-item-section>
          <q-item-section side>
            <q-icon
              name="sym_r_expand_more"
              :class="{'rotate-180': expandedAttributes}"
              style="transition: transform 100ms"
            />
          </q-item-section>
        </q-item>

        <template v-if="expandedAttributes">
          <q-item
            v-for="(attr) in attributes"
            :key="`attr_${attr.short}`"
            dense
            class="rounded-borders"
          >
            <q-item-section avatar />
            <q-item-section class="col-6">
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
          </q-item>
        </template>

        <template v-for="group in talentGroups" :key="`talents_${group.name}`">
          <q-item
            clickable
            @click="expandedGroups[group.name] = !expandedGroups[group.name]"
          >
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

          <q-item
            v-for="(talent) in getItems(group.name)"
            :key="`talent_${talent.name}`"
            dense
          >
            <q-item-section avatar>
              <q-icon
                name="sym_r_favorite"
                class="talent-fav-icon cursor-pointer"
                :class="{'icon-md-filled favorite': isFav(talent.name)}"
                color="primary"
                @click="toggleFav(talent.name)"
              />
            </q-item-section>
            <q-item-section class="col-6">
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

        <q-separator key="spacer" />

        <q-item
          key="show_inactive"
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
      </TransitionGroup>
    </q-list>

    <!-- FAB -->
    <q-page-sticky
      position="bottom-right"
      :offset="[32, 18]"
      style="transform: none"
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
          v-for="(c, key) in characters"
          :key="`character_switcher_${key}`"
          square
          external-label
          color="white"
          text-color="primary"
          icon="sym_r_mood"
          :label="c.generalData.name"
          label-class="bg-grey-3 text-grey-8 text-caption"
          label-position="left"
          @click="store.setCurrentCharacter(key)"
        />
        <q-fab-action
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
import { reactive, ref, /* watch, */ computed } from "vue"
import { storeToRefs } from "pinia"

import { useCharacterStore } from "src/stores/characters-store"

import { readFile, parseXML } from "src/utils/fileUtils"
import {
  parseAttributes,
  parseGeneral,
  parseTalents,
  talentGroups,
} from "src/utils/characterSheet"

// ========== CHARACTER ==========

const store = useCharacterStore()
const { characters, currentCharacter } = storeToRefs(store)

store.restored.then(success => {
  // console.log(characters.value)
  // console.log(currentCharacter)
})

const attributes = computed(() => currentCharacter.value?.attributes ?? {})
const talents = computed(() => currentCharacter.value?.talents ?? {})
// const generalData = computed(() => currentCharacter.value?.generalData ?? {})

const characterLoaded = computed(() => currentCharacter.value != null)

// { groupName1: false, (...) }
const expandedAttributes = ref(false)
const expandedGroups = reactive(Object.fromEntries(Object.keys(talentGroups).map(name => [name, false])))

const showInactiveTalents = ref(false)
const talentSearch = ref("")

function getItems (groupName) {
  const result = {}

  if (!currentCharacter.value) return result

  const expanded = expandedGroups[groupName]
  const re = new RegExp(talentSearch.value, "i")

  const matches = Object.values(talents.value)
    .filter(t => (
      t.group === groupName &&
      (expanded || isFav(t.name) ||
      (talentSearch.value !== "" && t.name.match(re)))
    ))
    .map(t => [t.name, t])

  if (showInactiveTalents.value) {
    const inactiveTalents = talentGroups[groupName].talents
      .filter(t => (
        expanded ||
        isFav(t) ||
        (talentSearch.value !== "" && t.match(re))
      ))
      .map(t => [t, { name: t }])

    Object.assign(result, Object.fromEntries(inactiveTalents))
  }
  Object.assign(result, Object.fromEntries(matches))

  return Object.values(result)
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

  const generalData = parseGeneral(doc)
  const attributes = parseAttributes(doc)
  const talents = parseTalents(doc)

  store.setCharacter(generalData.key, {
    generalData,
    attributes,
    talents,
  })
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

    &.favorite {
      opacity: 0.3;
    }
  }

  &:hover .talent-fav-icon {
    opacity: 0.3;
  }
}

/* list-... maps to the name attribute of the TransitionGroup above */
.list-move, /* apply transition to moving elements */
.list-leave-active {
  transition: opacity 170ms ease, transform 200ms ease;
}
.list-enter-active{
  transition: opacity 200ms ease, transform 170ms ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(-30px);
  /* transform: scale(0.9) translateY(-30px); */
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
  width: 100%;
}
</style>
