<template>
  <q-page ref="root" class="flex column q-gutter-y-md q-pa-md">
    <q-list>
      <q-item class="text-h4 header-item q-mb-md">
        Würfe
      </q-item>

      <q-timeline color="primary">
        <q-infinite-scroll @load="(_, done) =>loadMoreItems(false, done)">
          <template #loading>
            <div class="row justify-center q-my-md">
              <q-spinner
                color="primary"
                name="dots"
                size="40px"
              />
            </div>
          </template>

          <template v-for="(roll, index) in items" :key="roll.msgData.id">
            <div
              v-if="itemHasNewDate(index)"
              class="full-width row justify-center sticky-top"
              :style="{'margin-top': index ? '-36px' : '0px'}"
            >
              <q-chip
                color="primary"
                text-color="white"
                icon="sym_r_event"
                outline
                class="icon-md-filled bg-white"
              >
                {{ formatDate(roll.msgData.realtimestamp, "date") }}
              </q-chip>
            </div>
            <q-timeline-entry
              side="left"
              class="no-title no-subtitle"
              :style="{'padding-bottom': itemHasNewDate(index+1) ? '36px': '0px'}"
            >
              <q-item>
                <q-item-section top>
                  <q-item-label>{{ roll.talent.name }}</q-item-label>
                  <q-item-label v-if="expandedItems[roll.msgData.id]" style="word-break: break-all;">
                    <!-- eslint-disable-next-line vue/no-v-html -->
                    <div v-html="getRollHtml(roll)" />
                  </q-item-label>
                  <q-item-label v-else caption>
                    TaW: {{ roll.talent.value }}
                    TaP*: {{ roll.total }}
                    Mod: {{ roll.msgData?.original_content?.match(reModifier)?.[1] || "unbekannt" }}
                    <br>
                    {{ formatDate(roll.msgData.realtimestamp) }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-btn
                    icon="sym_r_expand_more"
                    round
                    flat
                    :class="{'rotate-180': expandedItems[roll.msgData.id]}"
                    style="transition: transform 300ms"
                    @click="toggleRollView(roll.msgData.id)"
                  />
                </q-item-section>
              </q-item>
            </q-timeline-entry>
          </template>
        </q-infinite-scroll>
      </q-timeline>

      <q-separator />
      <div class="full-width row justify-center">
        <q-chip
          color="white"
          class="text-caption q-ma-none no-pointer-events"
          style="color: rgba(0, 0, 0, 0.54); transform: translateY(-50%)"
        >
          Ende der Liste
        </q-chip>
      </div>
    </q-list>

    <!-- FAB -->
    <div
      class="sticky-fab"
      :style="fabVisible ?
        '' :
        'pointer-events: none; transform: translateY(-30%) scale(0.5, 0.8); opacity: 0;'"
    >
      <q-btn
        ref="fab"
        fab
        icon="sym_r_keyboard_arrow_up"
        @click="scrollToTop()"
      />
    </div>
  </q-page>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, computed } from "vue"
import { scroll } from "quasar"

import { dbPromise } from "src/boot/idb"
import { TABLE_NAME_ROLLS } from "src/utils/constants"
import { formatDate, sleep } from "src/utils/helpers"
import { useBridge } from "src/utils/bexBridge"

const root = ref(null)

// #region ========== IDB QUERIES ==========
const items = ref([])
const loadingItems = ref(false)
const cursorSteps = 20

const firstCursor = ref(null)
const lastCursor = ref(null)
const moreItemsAvailable = ref(true)

/** Load items from the indexedDB, inserting them into `items` in descending order.
 *
 * @param {Boolean} loadNewest load more items at the start of the list, ie the ones inserted since the last load
 */
async function loadMoreItems (loadNewest = false, done = null) {
  const markerInit = "marker_init"
  const markerFinished = "marker_finish"
  const measureLoadingName = "measure loading"
  performance.mark(markerInit)
  // Set button state to loading, and prepare a minTimeout after which the loadign state will be reverted
  loadingItems.value = true
  const minTimeout = sleep(300)
  if (!moreItemsAvailable.value && !loadNewest) return

  // get Db
  const db = await dbPromise

  // Set Cursor constraints
  let keyRangeValue = null
  let cursorDirection = "prev"

  // The cursor iterates over timestamps
  if (loadNewest) {
    if (firstCursor.value) {
      // start at firstCursor.value, go towards increasing values
      keyRangeValue = IDBKeyRange.lowerBound(firstCursor.value, true)
      cursorDirection = "next"
    }
  } else {
    if (lastCursor.value) {
      // go backwards from lastCursor.value towards older values
      keyRangeValue = IDBKeyRange.upperBound(lastCursor.value, true)
    }
  }

  // Get the Cursor
  let cursor = await db
    .transaction(TABLE_NAME_ROLLS, "readonly")
    .store.index("date")
    .openCursor(keyRangeValue, cursorDirection)

  const newItems = []

  while (cursor) {
    // get the new item
    if (process.env.DEBUGGING) {
      newItems.push(cursor.value)
    } else {
      if (!cursor.value.debug) newItems.push(cursor.value)
    }
    // Update last/first cursor value
    if (firstCursor.value == null) firstCursor.value = cursor.key
    else firstCursor.value = Math.max(firstCursor.value, cursor.key)
    if (lastCursor.value == null) lastCursor.value = cursor.key
    else lastCursor.value = Math.min(lastCursor.value, cursor.key)

    // Try and get the next cursor
    try {
      cursor = await cursor.continue()
    } catch (error) {
      cursor = null
    }

    // break after a certain amount of steps, or if there's no new cursor
    if (newItems.length >= cursorSteps || !cursor) {
      if (cursorDirection === "prev") {
        // we were going towards older entries, and reached the limit of steps,
        // or there's no next step - just stop here
        items.value = [...items.value, ...newItems]

        break // the while loop
      }
      // We're going from the newest previously loaded item towards the most recent onein the IDB
      // store the current values, then keep going
      // since we're going from the previously newest timestamp
      // to the newest timestamp in the IDB, we can flip newItems,
      // and prepend it to items
      newItems.reverse()
      items.value = [...newItems, ...items.value]

      // no newer item found
      if (!cursor) break // the while loop

      // reset steps taken and newItems, and let the whiole loop go
      // unil we reach the newest item in the IDB
      newItems.length = 0
    }
  }
  // The last attempt to get a cursor failed, so loading more items wouldn't make sense
  if (!cursor) moreItemsAvailable.value = false
  performance.mark(markerFinished)

  performance.measure(measureLoadingName, markerInit, markerFinished)
  console.log("Loading done in", performance.getEntriesByName(measureLoadingName)[0].duration, "ms")
  performance.clearMarks(markerInit)
  performance.clearMarks(markerFinished)
  performance.clearMeasures(measureLoadingName)

  minTimeout.then(() => {
    if (done) done(!moreItemsAvailable.value)
    loadingItems.value = false
  })
}
const { bexOn } = useBridge()

bexOn("roll-persisted", () => {
  loadMoreItems(true)
})
// #endregion

// #region ========== Scroll-To-Top ==========

const { getScrollTarget, setVerticalScrollPosition } = scroll

// this doesn't need to be reactive, it's enough to get it once
let scrollTarget

const scrollPos = ref(0)
const scrolling = ref(false)
const fabVisible = computed(() => !(scrolling.value || scrollPos.value <= 10))

// event listeners to get the current scroll position
onMounted(() => {
  scrollTarget = getScrollTarget(root.value.$el)
  scrollTarget.addEventListener("scroll", onScroll)
})
onBeforeUnmount(() => {
  scrollTarget.removeEventListener("scroll", onScroll)
})
function onScroll (evt) {
  scrollPos.value = evt.target.scrollTop
}

// Do the scroll-to-top.
// scrolling is part of the calculation to see if the FAB should be hidden,
// by setting it to true right away, the FAB will hide right away, which
// gives it a snappy feel.
function scrollToTop () {
  scrolling.value = true
  /** in ms */
  const scrollDuration = 100
  setVerticalScrollPosition(scrollTarget, 0, scrollDuration)
  setTimeout(() => {
    scrolling.value = false
  }, scrollDuration)
}

// #endregion

// #region ========== Roll Items ==========
const expandedItems = ref({})
function toggleRollView (id) {
  if (expandedItems.value[id]) delete expandedItems.value[id]
  else expandedItems.value[id] = true
}

const reInlineRoll = /\$\[\[(?<name>\d)]]/g
const reModifier = /{{\s*mod\s*=\s*(-?\d+)\s*}}/i

function getRollHtml (roll) {
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

function itemHasNewDate (index) {
  if (!index) return true
  if (index >= items.value.length) return false

  const currentItem = items.value[index]
  const previousItem = items.value[index - 1]

  const isDifferent = formatDate(currentItem.msgData.realtimestamp, "date") !== formatDate(previousItem.msgData.realtimestamp, "date")

  return isDifferent
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

.sticky-fab {
  position: fixed;
  bottom: 18px;
  right: 32px;

  z-index: 2;
  // Remove the transform applied with an active footer, don't need it since the
  // parent will not extend below the footer due to scrolling parent in Layout!
  transform: translateY(0) scale(1) opacity(1);

  /* scale: 1; */
  opacity: 1;

  transition: opacity 170ms, transform 200ms;
}
</style>
