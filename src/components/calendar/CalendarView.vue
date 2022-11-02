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
    <q-btn
      key="btn_back"
      padding="none"
      icon="sym_r_navigate_before"
      class="fit"
      flat
      style="grid-area: btp"
      @click="showPreviousMonth"
    />
    <q-btn
      key="btn_forward"
      padding="none"
      icon="sym_r_navigate_next"
      class="fit"
      flat
      style="grid-area: btn"
      @click="showNextMonth"
    />

    <DayCell
      v-for="(day, i) in currentViewDays"
      :key="`day_${i}`"
      v-bind="day"
      @click="evt => handleDayClick(day, evt)"
    />

    <q-btn
      v-if="stateReady"
      class="footer fit text-weight-regular"
      padding="none"
      :label="getFormattedDate(store.today, 'short')"
      no-caps
      flat
      @click="showToday"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useCalendarStore } from "src/stores/calendar-store"

import DayCell from "./CalendarDayItem.vue"

import {
  substractDays,
  addDays,
  getWeekday,
  getMonth,
  months,
  dateEquals,
  getFormattedDate,
  days,
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
    const day = substractDays(firstOfThisMonth, i)
    days.push({
      day,
      previousMonth: true,
      nextMonth: false,
      today: isToday(day),
    },
    )
  }
  for (let i = 1; i <= daysCount; i++) {
    const day = { ...currentView.value, day: i }
    days.push({
      day,
      previousMonth: false,
      nextMonth: false,
      today: isToday(day),
      class: getCorners(i),
    },
    )
  }
  for (let i = 1; i <= daysAfterCount; i++) {
    const day = addDays(lastOfThisMonth, i)
    days.push({
      day,
      previousMonth: false,
      nextMonth: true,
      today: isToday(day),
    },
    )
  }

  return days
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
      store.today = day.day
    } else {
      doubleClick = true
      setTimeout(() => {
        doubleClick = false
      }, 200)
    }

    return
  }

  // On a normal click, navigate to the clicked month
  if (day.previousMonth || day.nextMonth) {
    currentView.value = { ...day.day, day: 1 }
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
  --gap: 2px;
  --gap-negative: calc(-1 * var(--gap));
  --cell-size: 45px;
  --cell-border-radius: 0.5em;
  --month-border-color: rgb(95, 95, 95);
  --month-border: var(--gap) solid var(--month-border-color);
  --month-border-radius: calc(var(--cell-border-radius) + var(--gap));

  $month-color: rgba($primary, 0.1);

  --month-color: $month-color;
  --month-color: red;

  display: grid;
  gap: var(--gap);
  grid-template-columns: repeat(var(--columns), var(--cell-size));
  grid-auto-rows: var(--cell-size);

  grid-template-areas:
    "hdr hdr hdr hdr hdr btp btn"
    "day day day day day day day"
    "day day day day day day day"
    "day day day day day day day"
    "day day day day day day day"
    "day day day day day day day"
    "day day day day day day day"
    "ftr ftr ftr ftr ftr ftr ftr";

  position: relative;

  filter:
    sepia(1)
    hue-rotate(165deg)
    saturate(1.3)
    /* drop-shadow(1px 2px 3px rgba(0, 0, 0, 0.3)) */
    ;

  .header {
    grid-area: hdr;
    padding: 0.5em;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .footer {
    grid-area: ftr;
    padding: 0.5em;
  }

  .date-cell {
    width: var(--cell-size);
    aspect-ratio: 1;
    padding: 0.5em;
    display: flex;
    justify-content: center;
    align-items: center;

    position: relative;

    &:not(:is(.previous-month, .next-month)):before{
      content: "";
      position: absolute;
      inset: calc(-0.5 * var(--gap));
      z-index: -2;
      background: $month-color;

      background: white;
    }
    &.border-1:before {
      border-top: var(--month-border);
      top: calc(-1 * var(--gap));
    }
    &.border-2:before {
      border-right: var(--month-border);
      right: calc(-1 * var(--gap));
    }
    &.border-3:before {
      border-bottom: var(--month-border);
      bottom: calc(-1 * var(--gap));
    }
    &.border-4:before {
      border-left: var(--month-border);
      left: calc(-1 * var(--gap));
    }
    &.border-1.border-4:before {
      border-top-left-radius: var(--month-border-radius);
    }
    &.border-1.border-2:before {
      border-top-right-radius: var(--month-border-radius);
    }
    &.border-2.border-3:before {
      border-bottom-right-radius: var(--month-border-radius);
    }
    &.border-3.border-4:before {
      border-bottom-left-radius: var(--month-border-radius);
    }

    &.corner--1::after,
    &.corner--3::after {
      content: "";
      position: absolute;
      z-index: -1;
      border: none;
      width: calc(2 * var(--month-border-radius));
      height: calc(2 * calc(var(--cell-border-radius) + var(--gap)));
      outline: var(--gap) solid var(--month-border-color);
      box-shadow: 0 0 0 2em white;

    }
    &.corner--1::after {
      top: 0;
      right: calc(-1 * var(--gap));
      border-right: none;
      border-bottom: none;
      transform: translateX(100%);
      border-radius: 50% 0 0 0;
      clip-path: inset(-3px 1px 1px -3px);
    }

    &.corner--3::after {
      border-left: none;
      border-top: none;
      /* bottom: calc(-1 * var(--gap));
      left: 0; */
      bottom: 0;
      left: calc(-1 * var(--gap));
      transform: translateX(-100%);
      border-radius: 0 0 50% 0;
      clip-path: inset(1px -3px -3px 1px);
    }

  }
}

</style>
