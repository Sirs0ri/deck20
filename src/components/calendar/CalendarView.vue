<template>
  <div class="calendar">
    <div class="season-icon">
      <q-icon size="12em" :name="seasonIcon" />
    </div>
    <div class="season-icon">
      <q-icon size="12em" :name="seasonIcon" />
    </div>

    <div v-if="stateReady" class="header">
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
      v-if="stateReady"
      class="footer grid-button"
      @click="showToday"
    >
      {{ getFormattedDate(store.today, 'short') }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useCalendarStore } from "src/stores/calendar-store"

import DayBackground from "./CalendarDayBackground.vue"
import DayCell from "./CalendarDayItem.vue"

import {
  substractDays,
  addDays,
  getWeekday,
  getMonth,
  months,
  dateEquals,
  getFormattedDate,
} from "./calendar"

const store = useCalendarStore()

// ========== UI TOOLS ==========
const stateReady = ref(false)
const currentView = ref({ ...store.today, day: 1 })

const slide = ref("bf")
const carousel = ref(null)
function carouselNext () {
  carousel.value.next()
}
function carouselPrev () {
  carousel.value.previous()
}

const currentViewDays = computed(() => {
  if (!stateReady.value) return []

  const firstOfThisMonth = { ...currentView.value, day: 1 }
  const lastOfThisMonth = { ...currentView.value, day: getMonth(currentView.value).days }

  // Offsets because not every month starts on a "monday"
  const daysBeforeCount = getWeekday(firstOfThisMonth).index - 1
  // Days of this month
  const daysCount = getMonth(currentView.value).days
  // Days to fill the remaining cells of the 6x7 grid
  const daysAfterCount = (6 * 7) - daysBeforeCount - daysCount

  const days = []

  for (let i = daysBeforeCount; i > 0; i--) {
    const date = substractDays(firstOfThisMonth, i)
    days.push({
      bind: {
        date,
        previousMonth: true,
        nextMonth: false,
        today: isToday(date),
      },
    },
    )
  }
  for (let i = 1; i <= daysCount; i++) {
    const date = { ...currentView.value, day: i }
    days.push({
      bind: {
        date,
        previousMonth: false,
        nextMonth: false,
        today: isToday(date),
      },
    },
    )
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
    },
    )
  }

  return days.map((day, i) => ({
    ...day,
    gridArea: `week ${Math.floor(i / 7) + 1} / day ${(i % 7) + 1}`,
  }))
})

function isToday ({ day, month, year }) {
  return dateEquals(store.today, { day, month, year })
}

const seasonIcon = computed(() => {
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
      return "sym_r_sunny"
  }
})

// ========== NAVIGATION ==========
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
function showToday () {
  currentView.value = { ...store.today, day: 1 }
}

let doubleClick = false
function handleDayClick (day, clickEvt) {
  // if CTRL is held, a doubleclick changes "today"
  if (clickEvt.ctrlKey) {
    if (doubleClick) {
      store.today = day.bind.date
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

store.restored.then(success => {
  showToday()
  stateReady.value = true
})

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
    top: -1.5em;
    left: -3.5em;

    opacity: 0.07;

    transform: rotate(-20deg);

  }
  .season-icon + .season-icon {
    color: $primary;
    z-index: 5;
    opacity: 0.05;
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
