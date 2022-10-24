<template>
  <div class="calendar">
    <transition-group
      appear
      enter-active-class="animated fadeIn"
      duration="1000"
    >
      <div
        v-if="stateReady"
        key="header"
        class="header"
      >
        {{ getMonth(currentView).name }} {{ currentView.year }}
      </div>
      <q-btn
        key="btn_back"
        padding="none"
        icon="sym_r_navigate_before"
        class="fit"
        flat
        @click="showPreviousMonth"
      />
      <q-btn
        key="btn_forward"
        padding="none"
        icon="sym_r_navigate_next"
        class="fit"
        flat
        @click="showNextMonth"
      />

      <!-- one div to store all 42 days, inserting them into the grid via display: contents -->
      <div
        v-if="stateReady"
        key="days"
        style="display: contents"
      >
        <!-- Offsets because not every month starts on a "monday" -->
        <DayCell
          v-for="i in getWeekday({...currentView, day: 1}).index - 1"
          :key="`day_prev${i}`"
          :day="getPreviousMonthDay(i)"
          :today="isToday(getPreviousMonthDay(i))"
          previous-month
          @click="showPreviousMonth"
        />

        <!-- Days of this month -->
        <DayCell
          v-for="i in getMonth(currentView).days"
          :key="`day_${i}`"
          :day="{...currentView, day: i}"
          :today="isToday({...currentView, day: i})"
          @click.ctrl="handleDayClick({...currentView, day: i})"
        />

        <!-- Offsets because not every month ends on a "sunday" -->
        <DayCell
          v-for="i in (6*7) - (getWeekday({...currentView, day: 1}).index - 1) - getMonth(currentView).days"
          :key="`day_next_${i}`"
          :day="getNextMonthDay(i)"
          :today="isToday(getNextMonthDay(i))"
          next-month
          @click="showNextMonth"
        />
      </div>

      <q-btn
        v-if="stateReady"
        key="footer"
        class="footer fit text-weight-regular"
        padding="none"
        :label="getFormattedDate(store.today, 'short')"
        no-caps
        flat
        @click="showToday"
      />
    </transition-group>
  </div>
</template>

<script setup>
import { ref } from "vue"
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
} from "./calendar"

const store = useCalendarStore()

// ========== UI TOOLS ==========
const currentView = ref({ ...store.today, day: 1 })
const stateReady = ref(false)

function isToday ({ day, month, year }) {
  return dateEquals(store.today, { day, month, year })
}

function getPreviousMonthDay (i) {
  return substractDays({ ...currentView.value, day: 1 }, (getWeekday({ ...currentView.value, day: 1 }).index - i))
}

function getNextMonthDay (i) {
  return addDays({ ...currentView.value, day: getMonth(currentView.value).days }, i)
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

function showToday () {
  currentView.value = { ...store.today, day: 1 }
}

let doubleClick = false
function handleDayClick (day) {
  if (doubleClick) {
    store.today = day
  } else {
    doubleClick = true
    setTimeout(() => {
      doubleClick = false
    }, 200)
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
  --gap: 1px;
  --cell-size: 45px;

  display: grid;
  gap: var(--gap);
  grid-template-columns: repeat(var(--columns), var(--cell-size));
  grid-auto-rows: var(--cell-size);

  grid-template-areas:
    "hdr hdr hdr hdr hdr btn btn"
    "day day day day day day day"
    "day day day day day day day"
    "day day day day day day day"
    "day day day day day day day"
    "day day day day day day day"
    "day day day day day day day"
    "ftr ftr ftr ftr ftr ftr ftr";

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

  $border-color-default: black;
  $border-color-today: $primary;

  .date-cell {
    width: var(--cell-size);
    aspect-ratio: 1;
    border: 1px solid;
    border-color: rgba($border-color-default, 0.25);
    border-radius: 0.5em;
    padding: 0.5em;
    display: flex;
    justify-content: center;
    align-items: center;

    transition: border-width 100ms, border-color 100ms, opacity 100ms;

    &:hover {
      border-color: rgba($border-color-default, 0.5);
      border-width: 3px;
    }

    &.today {
      border-color: $border-color-today;
      background-color: rgba($border-color-today, 0.5);
    }

    &.previous-month,
    &.next-month {
      opacity: 0.5;
      border-color: rgba($border-color-default, 0.25);

      &:hover {
        opacity: 0.75;
      }

      &.today{
        border-color: rgba($border-color-today, 0.35);
      }
    }

  }
}

</style>
