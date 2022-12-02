<template>
  <q-page class="flex column q-pa-md" style="max-width: 100vw;">
    <q-item class="text-h4 header-item ">
      Charaktere
    </q-item>
    <div ref="overlayContainer" class="character-content-wrapper q-mt-md">
      <!-- #region ATTRIBUTES / TALENTS -->
      <q-list
        class="relative-position"
        style="--negative-margin: -44px"
        :class="{'hidden': mainContentHidden}"
      >
        <!-- Name / Class -->
        <template v-if="currentCharacter">
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
        <q-item key="search" class="sticky-search q-px-none">
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

        <TransitionGroup
          name="list"
          tag="div"
          style="--negative-margin: -37px"
        >
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
            <q-item-section class="text-body1">
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
            @click="toggleGroupExpanded(group.name)"
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
            <q-item-section class="text-body1">
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
                  :class="{'icon-md-filled favorite': favoriteTalents[talent.name]}"
                  color="primary"
                  @click="toggleFav(talent.name)"
                />
              </q-avatar>
            </q-item-section>
            <q-item-section class="col">
              <q-item-label>
                {{ talent.name }}
                {{ talent.specializations?.length ? '*' : '' }}
              </q-item-label>
              <q-item-label caption>
                {{ talent.attributes ? ` (${talent.attributes?.join("/")})` : '' }}
              </q-item-label>
            </q-item-section>
            <q-item-section class="col-auto text-right q-pr-md" style="font-size: 1.15em">
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
      <Transition
        name="overlay"
        @after-enter="mainContentHidden = true"
        @before-leave="mainContentHidden = false"
      >
        <!-- v-show="editOverlayOpen" -->
        <q-list
          v-if="currentCharacter && editOverlayOpen"
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

          <q-item class="q-px-none">
            <q-item-section>
              <q-input
                v-model="currentCharacter.generalData.name"
                debounce="200"
                autofocus
                label="Name"
                outlined
                class="full-width bg-active-primary"
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
              style="--negative-margin: -44px"
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
              <Transition name="fab">
                <q-btn
                  v-if="deleteEnabled"
                  color="negative"
                  flat
                  rounded
                  label="Löschen bestätigen"
                  @click="deleteCharacter"
                />
              </Transition>
            </q-item-section>
          </q-item>
        </q-list>
      </Transition>
      <!-- #endregion -->
    </div>

    <!-- FAB -->
    <div class="sticky-fab">
      <Transition name="fab" appear>
        <q-fab
          v-if="!editOverlayOpen"
          id="papers-fab"
          ref="fab"
          square
          vertical-actions-align="right"
          direction="up"
          text-color="white"
          @click="handleFabClick"
        >
          <template #icon>
            <q-icon :name="characterLoaded ? 'sym_r_sync': 'sym_r_file_upload'" />
          </template>

          <template #active-icon>
            <q-icon name="sym_r_close" />
          </template>

          <q-fab-action
            v-for="(c, key) in characters"
            :key="`character_switcher_${key}`"
            square
            external-label
            color="white"
            icon="sym_r_mood"
            :label="c.generalData.name"
            label-class="bg-grey-3 text-grey-8 text-caption"
            label-position="left"
            @click="store.setCurrentCharacter(key)"
          />
          <q-fab-action
            external-label
            color="white"
            icon="sym_r_upload_file"
            label="Importieren"
            label-class="bg-grey-3 text-grey-8 text-caption icon-md-filled"
            label-position="left"
            @click="pickCharacterFile"
          />
        </q-fab>
      </Transition>

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
const editOpenBtn = ref(null) // q-btn
const editCloseBtn = ref(null) // q-btn
const characterNameBackup = ref("")

const editOverlayOpen = ref(false)
const mainContentHidden = ref(false)

const animX = ref("0px")
const animY = ref("0px")

function toggleEditCharacter (clickEvt) {
  roll20Unavailable.value = false

  if (!editOverlayOpen.value) { // switching to edit mode
    characterNameBackup.value = currentCharacter.value.generalData.name

    const scrollTarget = getScrollTarget(overlayContainer.value)
    setVerticalScrollPosition(scrollTarget, 0, 200)
  }

  if (clickEvt instanceof PointerEvent) {
    // overlayContainer is a div, so .value has the HTML element
    const { offsetLeft, offsetTop } = overlayContainer.value
    animX.value = clickEvt.pageX - offsetLeft
    animY.value = clickEvt.pageY - offsetTop
  } else {
    const newBtn = editOverlayOpen.value
      ? editCloseBtn.value.$el
      : editOpenBtn.value.$el

    animX.value = newBtn.offsetLeft + (0.5 * newBtn.offsetWidth)
    animY.value = newBtn.offsetTop + (0.5 * newBtn.offsetHeight)
  }

  animX.value += "px"
  animY.value += "px"

  editOverlayOpen.value = !editOverlayOpen.value
}

const characterLoaded = computed(() => currentCharacter.value != null)

const expandedGroups = ref({})
const expandedAttributes = ref(false)

function toggleGroupExpanded (groupName) {
  if (expandedGroups.value[groupName]) delete expandedGroups.value[groupName]
  else expandedGroups.value[groupName] = true
}

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

  const expanded = expandedGroups.value[groupName]
  const re = new RegExp(talentSearch.value, "i")

  const matches = Object.values(currentCharacter.value.talents)
    .filter(t => (
      t.group === groupName &&
      (expanded || favoriteTalents[t.name] ||
      (talentSearch.value !== "" && t.name.match(re)))
    ))
    .map(t => [t.name, t])

  if (showInactiveTalents.value) {
    const inactiveTalents = talentGroups[groupName].talents
      .filter(t => (
        expanded ||
        favoriteTalents[t] ||
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
// TODO: This doesn't survive a reload at the moment.
const favoriteTalents = reactive({})

/** @param {String} talent */
function toggleFav (talent) {
  if (favoriteTalents[talent]) delete favoriteTalents[talent]
  else favoriteTalents[talent] = true
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
  editOverlayOpen.value = false
}
// #endregion

// #region ========== ROLL20 ==========

function roll (props) {
  const {
    name,
    // value,
    attributes = undefined,
  } = props

  // This is a talent
  if (attributes) {
    bexSendBridged("dom", "send-message", { msg: `/t ${name}` })
    return
  }
  // This is an attribute
  bexSendBridged("dom", "send-message", { msg: `/ew ${name}` })
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

<style lang="scss" scoped>
@use "sass:color";

.hidden {
  position: absolute;
  height: var(--max-heigt, 0px);
  overflow: hidden;
  visibility: hidden;
}
.character-content-wrapper {
  position: relative;
  max-width: 100%;
  flex-grow: 1;
}
.sticky-search {
  position: sticky;
  top: 8px;
  z-index: 3;
}
.sticky-heading {
  position: sticky;
  z-index: 1;
}
.sticky-fab {
  position: fixed;
  bottom: 16px;
  right: 32px;

  z-index: 3;
}

#papers-fab {
  /* https://css-tricks.com/snippets/css/stack-of-paper/ */

  &.q-fab {
    position: relative;
  }

  // This is scoped SCSS, and the q-btn-fab is technically part of a child component
  // To be able to style that child component, break out of the scope via :deep
  // see: https://vue-loader.vuejs.org/guide/scoped-css.html#deep-selectors
  &:deep(.q-btn--fab) {
    border-radius: 0;
    padding: 18px 12px;
    min-width: unset;
    transform: translateX(-4px);
  }

  &::before,
  &::after {
    content: "";
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: -1;
    background-color: white;
    --primary-color-blend: 0.1;
    // Inset dropshadow without blur to blend PRIMARY onto white
    box-shadow: inset 0px 0px 100px hsla(var(--primary-hsl) / var(--primary-color-blend));
    // Actual shadow
    filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.2));
    animation-delay: -10s;
    transition: transform 200ms, box-shadow 200ms;
    // (base + [extra|0deg]) * [factor|1]
    transform: rotate(calc((var(--base-rotation) + var(--extra-rotation, 0deg)) * var(--rotation-factor, 1)))
  }
  &::before {
    right: 7px;
    top: -3px;
    transform-origin: 50% 70%;
    --base-rotation: 3deg;
    --rotation-factor: -1.3
  }
  &::after {
    top: 2px;
    right: 2px;
    transform-origin: 60% 80%;
    --base-rotation: 4deg;
  }

  &:hover, &:focus-within {
    &::before,
    &::after {
      --extra-rotation: 2deg;
      animation-delay: -20s;
      --primary-color-blend: 0.2
    }
  }

  &:focus-within {
    &::before,
    &::after {
      /* background-color: hsla(var(--primary-hsl) / 1); */
      animation-delay: -70s;
      --primary-color-blend: 1
    }
  }
  &.q-fab--opened {
    &::before,
    &::after {
      --extra-rotation: 4deg;
    }
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

.char-edit-list {
  position: absolute;
  inset: 0;
  background: white;
  z-index: 3;
}

/* #region vue transitions */
.overlay-enter-active {
  animation: overlay-reveal 300ms;
}
.overlay-leave-active {
  animation: overlay-reveal 200ms reverse;
}
@keyframes overlay-reveal {
  0% { clip-path: circle(1% at v-bind(animX) v-bind(animY)) }
  100% { clip-path: circle(200vmax at v-bind(animX) v-bind(animY)) }
}

.fab-enter-active {
  animation: fab-reveal 200ms;
}
.fab-leave-active {
  animation: fab-reveal 200ms reverse;
}
@keyframes fab-reveal {
  0% {
    transform: scale(0.7);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
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
  margin-top: var(--negative-margin, -37px);
}

/* #endregion */

</style>
