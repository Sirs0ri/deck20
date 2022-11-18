<template>
  <q-page class="flex column q-gutter-y-md q-pa-md">
    <q-list class="relative-position">
      <q-item class="text-h4 header-item q-mb-md">
        Charaktere
      </q-item>

      <!-- Name / Class -->
      <template v-if="currentCharacter">
        <q-item>
          <q-item-section v-if="editingCharacter">
            <q-input
              v-model="currentCharacter.generalData.name"
              debounce="200"
              autofocus
              placeholder="Suche"
              outlined
              class="full-width bg-glassed"
              clearable
              clear-icon="sym_r_undo"
              @clear="currentCharacter.generalData.name = characterNameBackup"
              @keyup.enter.ctrl="toggleEditCharacter"
            />
          </q-item-section>
          <q-item-section
            v-else
            top
            style="min-height: 56px"
          >
            <q-item-label>
              {{ currentCharacter.generalData.name }}
            </q-item-label>
            <q-item-label caption>
              {{ currentCharacter.generalData.profession }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <Transition name="fadeScale">
              <q-btn
                v-if="editingCharacter"
                icon="sym_r_task_alt"
                color="primary"
                round
                flat
                @click="toggleEditCharacter"
              />
              <q-btn
                v-else
                icon="sym_r_edit"
                round
                flat
                @click="toggleEditCharacter"
              />
            </Transition>
          </q-item-section>
        </q-item>
      </template>

      <!-- Search -->
      <q-item key="search" class="sticky-search">
        <q-input
          ref="searchBar"
          v-model="talentSearch"
          debounce="200"
          clearable
          autofocus
          placeholder="Suche"
          outlined
          class="full-width bg-glassed"
          @clear="talentSearch = ''"
        />
      </q-item>

      <TransitionGroup name="list" tag="div">
        <q-item
          key="header_attributes"
          clickable
          class="rounded-borders bg-white sticky-heading"
          :style="{top: stickyHeadingTop}"
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

        <q-item
          v-for="(attr) in expandedAttributes ? currentCharacter?.attributes : []"
          :key="`attr_${attr.short}`"
          dense
          class="rounded-borders"
        >
          <q-item-section avatar />
          <q-item-section class="col">
            {{ attr.name }}:
          </q-item-section>
          <q-item-section class="col-auto text-right q-pr-md">
            {{ attr.value }}
          </q-item-section>
          <q-item-section side>
            <q-btn
              dense
              flat
              round
              icon="mdi-dice-d20"
              @click="roll(attr)"
            />
          </q-item-section>
        </q-item>
      </TransitionGroup>

      <TransitionGroup
        v-for="group in talentGroups"
        :key="`talents_${group.name}`"
        name="list"
        tag="div"
      >
        <q-item
          :key="`header_${group.name}`"
          clickable
          class="rounded-borders bg-white sticky-heading"
          :style="{top: stickyHeadingTop}"
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
          <q-item-section class="col">
            {{ talent.name }}
            {{ talent.specializations?.length ? '*' : '' }}
            {{ talent.attributes ? ` (${talent.attributes?.join("/")})` : '' }}{{ talent.value != null ? ':' : '' }}
          </q-item-section>
          <q-item-section class="col-auto text-right q-pr-md">
            {{ talent.value }}
          </q-item-section>

          <q-item-section side>
            <q-btn
              v-if="talent.extraRolls && Object.keys(talent.extraRolls).length"
              dense
              flat
              round
              icon="mdi-dice-d20"
            >
              <q-menu
                auto-close
                anchor="top right"
                self="top right"
              >
                <q-list style="min-width: 100px">
                  <q-item
                    clickable
                    @click="roll(talent)"
                  >
                    <q-item-section>
                      {{ talent.name }}:
                    </q-item-section>
                    <q-item-section side class="text-primary">
                      {{ talent.value ?? 'n.a.' }}
                    </q-item-section>
                  </q-item>
                  <q-item
                    v-for="(value, extraRoll) in talent.extraRolls"
                    :key="extraRoll"
                    clickable
                    @click="roll({...talent, name: `${talent.name} ${extraRoll}`, value, attributes: undefined})"
                  >
                    <q-item-section>
                      {{ extraRoll }}:
                    </q-item-section>
                    <q-item-section side class="text-primary">
                      {{ value ?? 'n.a.' }}
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
            <q-btn
              v-else
              dense
              flat
              round
              icon="mdi-dice-d20"
              :disable="talent.value == null"
              @click="roll(talent)"
            />
          </q-item-section>
        </q-item>
      </TransitionGroup>

      <q-separator key="spacer" />

      <q-item
        key="show_inactive"
        clickable
        @click="showInactiveTalents = !showInactiveTalents"
      >
        <q-item-section side>
          <q-toggle
            v-model="showInactiveTalents"
            checked-icon="sym_r_check"
            style="margin: -0.5em -0.2em -0.5em -1em;"
          />
        </q-item-section>
        <q-item-section>
          Inaktive Talente anzeigen?
        </q-item-section>
      </q-item>
    </q-list>

    <!-- FAB -->
    <div class="sticky-fab">
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

      <!-- Hidden file input for import -->
      <input
        ref="nativeFilePicker"
        type="file"
        accept=".xml"
        style="display: none;"
        @input="evt => parseImportedFile(evt.target.files[0])"
      >
    </div>
  </q-page>
</template>

<script setup>
import { reactive, ref, computed } from "vue"
import { storeToRefs } from "pinia"

import { useCharacterStore } from "src/stores/characters-store"

import { readFile, parseXML } from "src/utils/fileUtils"
import {
  parseCharacter,
  talentGroups,
} from "src/utils/characterSheet"

const store = useCharacterStore()
const { currentCharacter, characters } = storeToRefs(store)

// #region ========== UI ==========

const editingCharacter = ref(false)
const characterNameBackup = ref("")
function toggleEditCharacter () {
  if (!editingCharacter.value) {
    characterNameBackup.value = currentCharacter.value.generalData.name
  }
  editingCharacter.value = !editingCharacter.value
}

const characterLoaded = computed(() => currentCharacter.value != null)

// Create an object like this: { groupName1: false, (...) }
const expandedGroups = reactive(Object.fromEntries(Object.keys(talentGroups).map(name => [name, false])))
const expandedAttributes = ref(false)

const showInactiveTalents = ref(false)
const talentSearch = ref("")
const searchBar = ref(null)

const stickyHeadingTop = computed(() => {
  const top = searchBar.value ? searchBar.value.$el.offsetHeight + searchBar.value.$el.offsetTop : 0

  return top + "px"
})

function getItems (groupName) {
  const result = {}

  if (!currentCharacter.value) return result

  const expanded = expandedGroups[groupName]
  const re = new RegExp(talentSearch.value, "i")

  const matches = Object.values(currentCharacter.value.talents)
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

// #endregion

// #region ========== HELPERS ==========
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

// #endregion

// #region ========== FILE IMPORT ==========

const fab = ref(null)
function handleFabClick (evt) {
  if (Object.keys(characters.value).length) return
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

async function parseImportedFile (newFile) {
  // console.log("parsing new charactersheet...")

  const doc = await readFile(newFile)
    .then(content => parseXML(content))

  const character = parseCharacter(doc)

  store.setCharacter(character.generalData.key, character)
}
// #endregion

// #region ========== ROLL20 ==========

function roll (props) {
  const {
    name,
    value,
    attributes = undefined,
  } = props

  if (attributes) {
    console.log("Rolling", name, "vs", value, `(${attributes})`)
    return
  }
  console.log("Rolling", name, "vs", value)
}
// #endregion
</script>

<style lang="scss">
.sticky-search {
  position: sticky;
  top: 0;
  z-index: 3;
}
.sticky-heading {
  position: sticky;
  z-index: 1;
}
.sticky-fab {
  position: fixed;
  bottom: 18px;
  right: 32px;

  z-index: 2;
  // Remove the transform applied with an active footer, don't need it since the
  // parent will not extend below the footer due to scrolling parent in Layout!
  transform: none !important;
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

.extra-roll-button {
  flex: 1;

  i {
    display: none;
  }

  &:hover {
    flex: 100;
    i {
      display: revert;
    }
  }
}

/* list-... maps to the name attribute of the TransitionGroup above */
.list-move, /* apply transition to moving elements */
.list-leave-active {
  transition: opacity 170ms ease, margin-top 200ms ease;
}
.list-enter-active{
  transition: opacity 200ms ease, margin-top 170ms ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  /* Negative margin should be approx. as big as the element is high */
  margin-top: -37px;
}

</style>
