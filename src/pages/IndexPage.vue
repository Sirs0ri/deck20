<template>
  <q-page ref="root" class="flex column q-gutter-y-md q-pa-md">
    <q-list>
      <q-item class="text-h4 header-item q-mb-md">
        Test Page
      </q-item>

      <q-item>
        This is {{ isPopup ? "" : "not" }} a popup
      </q-item>
      <q-item>
        <q-btn
          label="Enter something in the DB"
          flat
          @click="writeDb()"
        />
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

          <q-timeline-entry
            v-for="item in items"
            :key="item.msgData.id"
            side="left"
            class="no-title no-subtitle"
          >
            <q-expansion-item
              :label="`${item.msgData.id} ${item.msgData.realtimestamp}`"
              :caption="`${new Date(item.msgData.realtimestamp)}`"
              header-class="rounded-borders"
            >
              <div>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </div>
            </q-expansion-item>
          </q-timeline-entry>
        </q-infinite-scroll>
      </q-timeline>
      <q-item-label
        v-if="!moreItemsAvailable"
        caption
        class="text-center q-mb-lg q-mt-md"
      >
        Du bist am Ende der Liste angekommen!
      </q-item-label>
    </q-list>

    <!-- FAB -->
    <div class="sticky-fab" :style="fabVisible ? '' : 'scale: 0.9; opacity: 0; pointer-events: none;'">
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
import { onBeforeUnmount, onMounted, ref } from "vue"
import { scroll, uid } from "quasar"

import { dbPromise } from "src/boot/idb"
import { TABLE_NAME_ROLLS } from "src/utils/constants"
import { sleep } from "src/utils/helpers"

const root = ref(null)

const isPopup = ref(false)
if ("bex_type" in window) window.bex_type.then(type => { isPopup.value = type === "bex-popup" })

// #region ========== IDB QUERIES ==========
const items = ref([])
const loadingItems = ref(false)
const cursorSteps = 10

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
    newItems.push(cursor.value)
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

        // The last attempt to get a cursor failed, so loading more items wouldn't make sense
        if (!cursor) moreItemsAvailable.value = false

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

async function writeDb () {
  const id = uid()
  await dbPromise.then(db => db.put(TABLE_NAME_ROLLS, {
    msgData: {
      id,
      message: `Lorem Ipsum ${id}`,
      realtimestamp: Date.now(),
    },
  }))

  // reload items from IDB
  loadMoreItems(true)
}
// #endregion

// #region ========== IDB HELPERS ==========

// const tx = (await dbPromise).transaction(TABLE_NAME_ROLLS, "readwrite")

// // Store translations in IDB for the next time
// tx.store.put({ id, message: `Lorem Ipsum ${id}` })
// await tx.done

// async function get (key) {
//   return (await dbPromise).get(dbTable, key)
// }
// async function set (val) {
//   return (await dbPromise).put(dbTable, val)
// }
// async function delete (key) {
//   return (await dbPromise).delete(dbTable, key)
// }
// async function clear () {
//   return (await dbPromise).clear(dbTable)
// }
// async function keys () {
//   return (await dbPromise).getAllKeys(dbTable)
// }
// async function values () {
//   return (await dbPromise).getAll(dbTable)
// }

// #endregion

// #region ========== Scroll-To-Top Handling ==========

const { getScrollTarget, setVerticalScrollPosition } = scroll

const fabVisible = ref(false)

// this doesn't need to be reactive, it's enough to get it once
let scrollTarget

onMounted(() => {
  scrollTarget = getScrollTarget(root.value.$el)
  scrollTarget.addEventListener("scroll", onScroll)
})
onBeforeUnmount(() => {
  scrollTarget.removeEventListener("scroll", onScroll)
})
function onScroll (evt) {
  if (evt.target.scrollTop && fabVisible.value) return
  fabVisible.value = evt.target.scrollTop > 0
}

function scrollToTop () {
  setVerticalScrollPosition(scrollTarget, 0, 100)
}

// #endregion

</script>

<style lang="scss">
.sticky-fab {
  position: fixed;
  bottom: 18px;
  right: 32px;

  z-index: 2;
  // Remove the transform applied with an active footer, don't need it since the
  // parent will not extend below the footer due to scrolling parent in Layout!
  transform: none !important;

  scale: 1;
  opacity: 1;

  transition: scale 200ms, opacity 170ms;
}
</style>
