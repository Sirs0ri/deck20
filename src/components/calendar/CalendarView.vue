<template>
  <div
    class="calendar"
    @wheel="onWheel"
    @click.middle="showToday()"
  >
    <q-icon
      v-for="icon in seasonIcons"
      :key="`si_${icon}`"
      class="season-icon"
      size="12em"
      :name="icon"
      :style="icon === seasonIcon ? '' : 'scale: 0.9; opacity: 0'"
    />
    <q-icon
      v-for="icon in seasonIcons"
      :key="`si_${icon}`"
      class="season-icon season-icon-top"
      size="12em"
      :name="icon"
      :style="icon === seasonIcon ? '' : 'scale: 0.9; opacity: 0'"
    />

    <div v-if="store.restored" class="header">
      <q-carousel
        ref="carousel"
        v-model="slide"
        vertical
        class="bg-transparent fit"
        animated
        transition-prev="jump-down"
        transition-next="jump-up"
        transition-duration="100"
        @mouseenter="carouselNext"
        @mouseleave="carouselPrev"
      >
        <q-carousel-slide
          name="bf"
          style="padding: 0"
          class="flex flex-center"
        >
          {{ getMonth(currentView).name }} {{ currentView.year }} BF
        </q-carousel-slide>
        <q-carousel-slide
          name="hal"
          style="padding: 0"
          class="flex flex-center"
        >
          {{ getMonth(currentView).name }} {{ currentView.year - 993 }} Hal
        </q-carousel-slide>
      </q-carousel>
    </div>

    <div
      class="grid-button"
      style="grid-area: hdr / day 6"
      @click="showPreviousMonth"
    >
      <q-icon
        size="sm"
        color="primary"
        name="sym_r_navigate_before"
      />
    </div>

    <div
      class="grid-button"
      style="grid-area: hdr / day 7"
      @click="showNextMonth"
    >
      <q-icon
        size="sm"
        color="primary"
        name="sym_r_navigate_next"
      />
    </div>

    <div class="days-background" />

    <div style="display: contents;">
      <DayBackground
        v-for="(day, i) in currentViewDays"
        :key="`day_${i}`"
        v-bind="day.bind"
        :style="{gridArea: day.gridArea}"
      />
    </div>
    <div style="display: contents;">
      <DayCell
        v-for="(day, i) in currentViewDays"
        :key="`day_${i}`"
        v-bind="day.bind"
        :style="{gridArea: day.gridArea}"
        @click="evt => handleDayClick(day, evt)"
      />
    </div>

    <div
      v-if="store.restored"
      class="footer grid-button"
      @click="showToday"
    >
      {{ getFormattedDate(store.today, 'short') }}
    </div>
  </div>
</template>

<script setup>
import { ref, unref, computed } from "vue"
import { storeToRefs } from "pinia"
import { useCalendarStore } from "src/stores/calendar-store"

import {
  substractDays,
  addDays,
  getWeekday,
  getMonth,
  months,
  dateEquals,
  getFormattedDate,
} from "src/utils/calendar"

import DayBackground from "./CalendarDayBackground.vue"
import DayCell from "./CalendarDayItem.vue"

const store = useCalendarStore()
const { today } = storeToRefs(store)

store.restoration.then(() => showToday())

// ========== UI TOOLS ==========
const currentView = ref({ ...today.value, day: 1 })

const slide = ref("bf")
const carousel = ref(null)
function carouselNext () {
  carousel.value.next()
}
function carouselPrev () {
  carousel.value.previous()
}

const currentViewDays = computed(() => {
  if (!store.restored) return []

  const view = unref(currentView)

  const firstOfThisMonth = { ...view, day: 1 }
  const lastOfThisMonth = { ...view, day: getMonth(view).days }

  // Offsets because not every month starts on a "monday"
  const daysBeforeCount = getWeekday(firstOfThisMonth).index - 1
  // Days of this month
  const daysCount = getMonth(view).days
  // Days to fill the remaining cells of the 6x7 grid
  const daysAfterCount = (6 * 7) - daysBeforeCount - daysCount

  const days = []

  let dayIndex = 0

  for (let i = daysBeforeCount; i > 0; i--) {
    const date = substractDays(firstOfThisMonth, i)
    days.push({
      bind: {
        date,
        previousMonth: true,
        nextMonth: false,
        today: isToday(date),
      },
      gridArea: `week ${Math.floor(dayIndex / 7) + 1} / day ${(dayIndex % 7) + 1}`,
    })
    dayIndex++
  }
  for (let i = 1; i <= daysCount; i++) {
    const date = { ...view, day: i }
    days.push({
      bind: {
        date,
        previousMonth: false,
        nextMonth: false,
        today: isToday(date),
      },
      gridArea: `week ${Math.floor(dayIndex / 7) + 1} / day ${(dayIndex % 7) + 1}`,
    })
    dayIndex++
  }
  for (let i = 1; i <= daysAfterCount; i++) {
    const date = addDays(lastOfThisMonth, i)
    days.push({
      bind: {
        date,
        previousMonth: false,
        nextMonth: true,
        today: isToday(date),
      },
      gridArea: `week ${Math.floor(dayIndex / 7) + 1} / day ${(dayIndex % 7) + 1}`,
    })
    dayIndex++
  }

  return days
})

function isToday ({ day, month, year }) {
  return dateEquals(today.value, { day, month, year })
}

const seasonIcons = [
  "sym_r_filter_drama",
  "sym_r_ac_unit",
  "sym_r_local_florist",
  "sym_r_sunny",
]

/** Get an icon for the meterological (not astronomical) season. */
const seasonIcon = computed(() => {
  if (!store.restored) return ""
  switch (currentView.value.month) {
    case 3: // sep
    case 4: // okt
    case 5: // nov
      return "sym_r_filter_drama"
    case 6: // dez
    case 7: // jan
    case 8: // feb
      return "sym_r_ac_unit"
    case 9: // mär
    case 10: // apr
    case 11: // mai
      return "sym_r_local_florist"
    case 12: // juni
    case 13: // Juli
    case 1: // jul
    case 2: // aug
      return "sym_r_sunny"

    default:
      return ""
  }
})

// ========== NAVIGATION ==========

function onWheel (evt) {
  const targetClassList = evt.target.classList
  if (!targetClassList.contains("date-cell") && !targetClassList.contains("days-background")) return

  const { deltaY, deltaX } = evt

  if (deltaY > 0) showNextMonth()
  else if (deltaY < 0) showPreviousMonth()

  if (deltaX > 0) showNextYear()
  else if (deltaX < 0) showPreviousYear()
}

function showNextMonth () {
  if (currentView.value.month === months.length) {
    currentView.value.month = 1
    currentView.value.year++
  } else {
    currentView.value.month++
  }
}
function showPreviousMonth () {
  if (currentView.value.month === 1) {
    currentView.value.month = months.length
    currentView.value.year--
  } else {
    currentView.value.month--
  }
}
function showNextYear () {
  currentView.value.year++
}
function showPreviousYear () {
  currentView.value.year--
}
function showToday () {
  currentView.value = { ...today.value, day: 1 }
}

let doubleClick = false
function handleDayClick (day, clickEvt) {
  // if CTRL is held, a doubleclick changes "today"
  if (clickEvt.ctrlKey) {
    if (doubleClick) {
      today.value = day.bind.date
    } else {
      doubleClick = true
      setTimeout(() => {
        doubleClick = false
      }, 200)
    }

    return
  }

  // On a normal click, navigate to the clicked month
  if (day.bind.previousMonth || day.bind.nextMonth) {
    currentView.value = { ...day.bind.date, day: 1 }
  }
}

</script>

<style lang="scss" scoped>
.calendar {
  --columns: 7;
  --rows: 6;
  --gap: 2px;
  --cell-size: 45px;
  --cell-border-radius: 0.5em;

  --border-color: rgba(25, 118, 210, 0.3);
  --bg-color: rgba(25, 118, 210, 0.1);

  display: grid;
  gap: var(--gap);
  grid-template-columns:
    [hdr-start days-start ftr-start]
    repeat(calc(var(--columns)), [day] var(--cell-size))
    [hdr-end days-end ftr-end];
  grid-template-rows:
    [hdr-start]
    var(--cell-size)
    [hdr-end days-start]
    repeat(var(--rows), [week] var(--cell-size))
    [ days-end  ftr-start]
    var(--cell-size)
    [ftr-end];
  grid-auto-rows: var(--cell-size);

  position: relative;

  .season-icon{
    pointer-events: none;
    position: absolute;
    top: -1.5rem;
    left: -3.5rem;

    transform: rotate(-20deg);
    transition: scale 200ms, opacity 170ms;

    opacity: 0.07;

    scale: 1;

    &.season-icon-top {
      color: $primary;
      z-index: 5;
      opacity: 0.05;
    }
  }

  .header {
    grid-row: hdr;
    grid-column: hdr / span 5;
    padding: 0.5em;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .footer {
    grid-area: ftr;
    padding: 0.5em;
  }

  .grid-button {
    display: flex;
    justify-content: center;
    align-items: center;

    padding: 0.5em;

    border-width: 2px;
    border-style: solid;
    border-color: white;
    border-radius: 0.5em;

    cursor: pointer;

    --transition-duration: 200ms;
    transition:
      border-color var(--transition-duration),
      background-color var(--transition-duration),
      opacity var(--transition-duration);

    &:hover {
      background-color: rgba($primary, 0.1);
    }
  }
}

</style>
