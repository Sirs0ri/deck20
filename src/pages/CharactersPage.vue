<template>
  <q-page class="flex column q-pa-md" style="max-width: 100vw;">
    <q-item class="text-h4 header-item ">
      Charaktere
    </q-item>
    <div ref="overlayContainer" class="character-content-wrapper q-mt-md">
      <!-- #region ATTRIBUTES / TALENTS -->
      <q-list ref="statsOverview" class="relative-position">
        <!-- Name / Class -->
        <template v-if="currentCharacter">
          <q-item>
            <q-item-section top>
              <!-- style="min-height: 56px" -->
              <q-item-label :lines="1">
                {{ currentCharacter.generalData.name }}
              </q-item-label>
              <q-item-label caption :lines="1">
                {{ currentCharacter.generalData.profession }}
              </q-item-label>
            </q-item-section>
            <q-item-section side top>
              <q-btn
                ref="editOpenBtn"
                icon="sym_r_edit"
                round
                flat
                @click="toggleEditCharacter"
              />
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
              <q-avatar>
                <q-icon
                  size="24px"
                  name="sym_r_account_circle"
                  color="primary"
                  class="icon-md-filled"
                />
              </q-avatar>
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
              <q-avatar>
                <q-icon
                  size="24px"
                  :name="group.icon"
                  color="grey-8"
                />
              </q-avatar>
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
              <q-avatar>
                <q-icon
                  name="sym_r_favorite"
                  size="24px"
                  class="talent-fav-icon cursor-pointer"
                  :class="{'icon-md-filled favorite': isFav(talent.name)}"
                  color="primary"
                  @click="toggleFav(talent.name)"
                />
              </q-avatar>
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
              style="margin: -0.5em -0.6em -0.5em -0.6em;"
            />
          </q-item-section>
          <q-item-section>
            Inaktive Talente anzeigen?
          </q-item-section>
        </q-item>
      </q-list>
      <!-- #endregion -->

      <!-- #region EDIT MODE -->
      <q-list
        v-if="currentCharacter"
        ref="editOverlay"
        class="char-edit-list"
        style="--negative-margin: -58px"
      >
        <q-item>
          <q-item-section top>
            <q-item-label :lines="1">
              {{ currentCharacter.generalData.name }}
            </q-item-label>
            <q-item-label caption :lines="1">
              {{ currentCharacter.generalData.profession }}
            </q-item-label>
          </q-item-section>
          <q-item-section side top>
            <q-btn
              ref="editCloseBtn"
              icon="sym_r_task_alt"
              color="primary"
              round
              flat
              @click="toggleEditCharacter"
            />
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-input
              v-model="currentCharacter.generalData.name"
              debounce="200"
              autofocus
              label="Name"
              outlined
              class="full-width"
              clearable
              clear-icon="sym_r_undo"
              @clear="currentCharacter.generalData.name = characterNameBackup"
              @keyup.enter.ctrl="toggleEditCharacter"
            />
          </q-item-section>
        </q-item>

        <q-item-label header>
          Verknüpftes Token
        </q-item-label>

        <TransitionGroup name="list">
          <q-item
            v-for="t in availableTokens"
            :key="t.id"
            v-ripple
            tag="label"
            class="rounded-borders"
            @click.prevent="onTokenItemClick(t.id)"
          >
            <q-item-section avatar>
              <q-avatar
                :icon="t.avatar ? undefined : 'sym_r_question_mark'"
                color="primary"
                text-color="white"
              >
                <q-img v-if="t.avatar" :src="t.avatar" />
              </q-avatar>
            </q-item-section>
            <q-item-section>{{ t.name || "Kein verknüpftes Token" }}</q-item-section>
            <q-item-section v-if="availableTokens.length > 1" side>
              <q-radio
                v-model="selectedToken"
                :val="t.id"
                size="42px"
              />
            </q-item-section>
            <q-item-section v-else side>
              <q-btn
                round
                flat
                icon="sym_r_search"
                class="pointer-none"
                :loading="loadingTokens"
              />
            </q-item-section>
          </q-item>
          <q-item v-if="roll20Unavailable" key="connection_error">
            <q-item-section avatar>
              <q-avatar>
                <q-icon name="sym_r_link_off" color="warning" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>
                Roll20 ist nicht erreichbar
              </q-item-label>
              <q-item-label caption>
                Bitte öffne einen Tab mit der Kampagne aus der Du einen Charakter verknüpfen willst, und versuche es erneut.
              </q-item-label>
            </q-item-section>
          </q-item>
        </TransitionGroup>

        <q-item-label header>
          Sonstiges
        </q-item-label>

        <q-item v-ripple tag="label">
          <q-item-section avatar>
            <q-avatar icon="sym_r_delete" text-color="negative" />
          </q-item-section>
          <q-item-section>
            Charakter löschen
          </q-item-section>
          <q-item-section side>
            <q-checkbox v-model="deleteEnabled" color="grey-8" />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section class="content-center">
            <q-btn
              color="negative"
              flat
              rounded
              label="Löschen bestätigen"
              :style="deleteEnabled ? '' : 'scale: 0.9; opacity: 0; pointer-events: none;'"
              class="delete-character-btn"
              @click="deleteCharacter"
            />
          </q-item-section>
        </q-item>
      </q-list>
      <!-- #endregion -->
    </div>

    <!-- FAB -->
    <div class="sticky-fab" :style="editingCharacter ? 'scale: 0.9; opacity: 0; pointer-events: none;': ''">
      <q-fab
        id="papers-fab"
        ref="fab"
        square
        vertical-actions-align="right"
        direction="up"
        text-color="white"
        @click="handleFabClick"
      >
        <template #icon>
          <q-icon color="primary" :name="characterLoaded ? 'sym_r_sync': 'sym_r_file_upload'" />
        </template>

        <template #active-icon>
          <q-icon color="primary" name="sym_r_close" />
        </template>

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
import {
  ref,
  unref,
  reactive,
  toRaw,
  computed,
  watch,
  nextTick,
} from "vue"
import { storeToRefs } from "pinia"
import { scroll } from "quasar"

import { useCharacterStore } from "src/stores/characters-store"

import { sleep } from "src/utils/helpers"
import { readFile, parseXML } from "src/utils/fileUtils"
import { parseCharacter, talentGroups } from "src/utils/characterSheet"
import { useBridge } from "src/utils/bexBridge"

/** Wrapper for console.log that adds a "[bex] dom" prefix infront of the logged message
 *
 * @param  {...any} args
 */
const log = (...args) => {
  if (process.env.DEBUGGING) { console.log("[ui] CharactersPage:", ...args) }
}

const { getScrollTarget, setVerticalScrollPosition } = scroll
const { bexSendBridged } = useBridge()

const store = useCharacterStore()
const { currentCharacter, characters } = storeToRefs(store)

// #region ========== UI ==========

const overlayContainer = ref(null) // div
const statsOverview = ref(null) // q-list
const editOverlay = ref(null) // q-list
const editOpenBtn = ref(null) // q-btn
const editCloseBtn = ref(null) // q-btn
const editingCharacter = ref(false)
const characterNameBackup = ref("")

watch(currentCharacter, () => {
  // Let the UI refresh so that the editBtn gets drawn, then set the default
  // X/Y coordinates for the character edit popup
  nextTick(() => {
    if (!currentCharacter.value) return
    const animX = editOpenBtn.value.$el.offsetLeft + (0.5 * editOpenBtn.value.$el.offsetWidth)
    const animY = editOpenBtn.value.$el.offsetTop + (0.5 * editOpenBtn.value.$el.offsetHeight)

    editOverlay.value.$el.style.setProperty("transition", "none")
    editOverlay.value.$el.style.setProperty("--x", animX + "px")
    editOverlay.value.$el.style.setProperty("--y", animY + "px")
  })
})

function toggleEditCharacter (clickEvt) {
  let animX, animY
  let newBtn
  editingCharacter.value = !editingCharacter.value
  roll20Unavailable.value = false

  if (editingCharacter.value) { // switching to edit mode
    newBtn = editCloseBtn.value.$el
    characterNameBackup.value = currentCharacter.value.generalData.name

    const scrollTarget = getScrollTarget(overlayContainer.value)
    setVerticalScrollPosition(scrollTarget, 0, 100)
  } else { // switching from edit mode
    newBtn = editOpenBtn.value.$el
  }

  if (clickEvt instanceof PointerEvent) {
    // overlayContainer is a div, so .value has the HTML element
    const { offsetLeft, offsetTop } = overlayContainer.value
    animX = clickEvt.pageX - offsetLeft
    animY = clickEvt.pageY - offsetTop
  } else {
    animX = newBtn.offsetLeft + (0.5 * newBtn.offsetWidth)
    animY = newBtn.offsetTop + (0.5 * newBtn.offsetHeight)
  }

  // editOverlay is a quasar element, so we need .$el
  // disable transitions so that the change of x/y doesn't animate
  editOverlay.value.$el.style.setProperty("transition", undefined)
  editOverlay.value.$el.style.setProperty("--x", animX + "px")
  editOverlay.value.$el.style.setProperty("--y", animY + "px")
  statsOverview.value.$el.classList.remove("hidden")

  // Wait for the dom to update, then:
  nextTick(() => {
    if (!editOverlay.value) return
    // re-enable transitions so that the change of the % does animate
    editOverlay.value.$el.style.setProperty("transition", "clip-path 400ms ease")

    if (editingCharacter.value) {
      const animHandler = (transitionEvt) => {
        // Transition Events bubble, make sure we react to the right one
        if (transitionEvt.srcElement !== editOverlay.value.$el) return

        editOverlay.value.$el.removeEventListener("transitionend", animHandler)
        statsOverview.value.$el.classList.add("hidden")
      }

      editOverlay.value.$el.addEventListener("transitionend", animHandler)
      editOverlay.value.$el.style.setProperty("--max-heigt", editOverlay.value.$el.offsetHeight)
    }

    const newAnimPercent = editingCharacter.value ? "200vmax" : "0%"
    editOverlay.value.$el.style.setProperty("--opening-percentage", newAnimPercent)
    newBtn.focus()

    const onMouseLeave = () => {
      newBtn.blur()
      newBtn.removeEventListener("mouseleave", onMouseLeave)
    }
    newBtn.addEventListener("mouseleave", onMouseLeave)
  })
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
  const doc = await readFile(newFile)
    .then(content => parseXML(content))

  const character = parseCharacter(doc)

  store.setCharacter(character.generalData.key, character)
}

const deleteEnabled = ref(false)
function deleteCharacter () {
  if (!deleteEnabled.value) return

  if (!currentCharacter) return

  log("deleting character", currentCharacter.value.generalData.key)

  store.deleteCharacter(currentCharacter.value.generalData.key)

  deleteEnabled.value = false
  toggleEditCharacter()
}
// #endregion

// #region ========== ROLL20 ==========

function roll (props) {
  const {
    name,
    value,
    attributes = undefined,
  } = props

  // This is a talent
  if (attributes) {
    bexSendBridged("dom", "send-message", { msg: `/t ${name}` })
    return
  }
  // TODO: Roll attributes
  log("Rolling", name, "vs", value)
}

// #endregion

// #region ========== TOKEN LINKING ==========

const loadingTokens = ref(false)
const availableTokens = ref([])
const defaultToken = {
  name: "",
  id: "",
}
const roll20Unavailable = ref(false)

// Set up default
availableTokens.value.push(defaultToken)

// Override default if the currentCharacter has a token
store.restoration.then(() => { updateTokenSelectionFromCurrentCharacter() })
watch(currentCharacter, () => { updateTokenSelectionFromCurrentCharacter() })

function updateTokenSelectionFromCurrentCharacter () {
  const charToken = toRaw(currentCharacter?.value?.associatedToken)
  if (!charToken) return
  availableTokens.value = [charToken]
}

const selectedToken = computed({
  get: () => currentCharacter?.value?.associatedToken?.id ?? "",
  set: (newId) => {
    log("Setting new token:", newId)
    let newToken = availableTokens.value.find(t => t.id === newId)
    newToken = unref(newToken)
    currentCharacter.value.associatedToken = newToken

    availableTokens.value = [newToken]
  },

})
async function queryTokens () {
  log("searching...")
  roll20Unavailable.value = false
  loadingTokens.value = true

  const s = sleep(500)
  const tokens = await bexSendBridged("dom", "query-tokens", {}, 2000)
    .then(data => data.tokens)
    .catch(() => { /* console.warn("request timed out") */ })

  log(tokens)

  if (!tokens) {
    roll20Unavailable.value = true
    loadingTokens.value = false
    return
  }

  availableTokens.value = [...tokens, defaultToken]

  // wait for at least 500ms before the loading spinner gets removed
  await s
  loadingTokens.value = false
}

function onTokenItemClick (id) {
  // User just selected a token
  if (id !== selectedToken.value) {
    selectedToken.value = id
    return
  }

  // user clicked the token to start search
  if (availableTokens.value.length === 1) {
    queryTokens()
    return
  }

  const charToken = toRaw(currentCharacter?.value?.associatedToken)

  if (!charToken) {
    availableTokens.value = [defaultToken]
    return
  }
  availableTokens.value = [charToken]
}
// #endregion
</script>

<style lang="scss">
.hidden {
  position: absolute;
  height: var(--max-heigt, 0px);
  overflow: hidden;
}
.character-content-wrapper {
  position: relative;
  max-width: 100%;
}
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
  bottom: 12px;
  right: 30px;

  z-index: 3;
  // Remove the transform applied with an active footer, don't need it since the
  // parent will not extend below the footer due to scrolling parent in Layout!
  transform: none !important;
}

#papers-fab {
  /* https://css-tricks.com/snippets/css/stack-of-paper/ */

  &.q-fab {
    padding: 3px;
    position: relative;
    aspect-ratio: 0.8;
  }
  &>.q-btn {
    border-radius: 0;
    padding: 16px 8px;
    min-width: 48px;
  }
  &:before, &:after {
    content: "";
    position: absolute;
    height: 95%;
    width: 95%;
    background-color: #E5F5FA;
    box-shadow: 1px 1px 1px rgb(0 0 0 / 20%);
    transition: transform 200ms;
    transform-origin: 50% 70%;
  }
  &::before {
    z-index: -1;
    right: 2px;
    top: 4px;
    transform: rotate(-3deg);
  }
  &.q-fab--opened::before {
    transform: rotate(-9deg);
  }
  &::after {
    top: 0px;
    right: 1px;
    transform: rotate(4deg);
    z-index: -2;
  }
  &.q-fab--opened::after {
    transform: rotate(9deg);
  }
}

.sticky-fab,
.delete-character-btn {
  scale: 1;
  opacity: 1;

  transition: scale 200ms, opacity 170ms;
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

.char-edit-list {
  position: absolute;
  inset: 0;
  background: white;
  z-index: 3;
  /* pointer-events: none; */

  clip-path: circle(var(--opening-percentage, 0%) at var(--x, 0) var(--y, 0));
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
  margin-top: var(--negative-margin, -37px);
}

</style>
