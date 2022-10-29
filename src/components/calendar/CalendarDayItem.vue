<template>
  <div
    class="date-cell"
    :class="{
      today: today,
      'previous-month': previousMonth,
      'next-month': nextMonth,
    }"
  >
    <div class="day">
      {{ day.day }}
    </div>
    <q-tooltip
      class="text-center text-body2"
      transition-show="jump-down"
      transition-hide="fade"
    >
      <!-- eslint-disable-next-line vue/no-v-html -->
      <span v-html="getDayPopupString(day)" />
    </q-tooltip>
  </div>
</template>

<script setup>

import { getDayPopupString } from "./calendar"

defineProps({
  day: {
    type: Object,
    default: () => ({ day: 1, month: 1, year: 1 }),
  },
  today: {
    type: Boolean,
    default: false,
  },
  previousMonth: {
    type: Boolean,
    default: false,
  },
  nextMonth: {
    type: Boolean,
    default: false,
  },
})

</script>

<style lang="scss">
.day {
  /* SCSS vars for rgba(color, alpha) instead of rgba(r, g, b, alpha) */
  $border-color-today: $primary;
  $border-color-default: black;

  --transition-duration: 100ms;

  position: absolute;
  inset: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  border-width: 2px;
  border-style: solid;
  border-color: transparent;
  border-radius: 0.5em;

  transition:
    border-color var(--transition-duration),
    background-color var(--transition-duration),
    opacity var(--transition-duration);

  &:hover {
    background-color: rgba($border-color-default, 0.1);
    border-color: rgba($border-color-default, 0.2);
  }

  .today &{
    background-color: rgba($border-color-today, 0.5);
  }
  .today &:hover{
    /* border-color: $border-color-today; */
  }

  .previous-month &,
  .next-month & {
    opacity: 0.5;
    /* border-color: rgba($border-color-default, 0.25); */

    :hover {
      opacity: 0.75;
    }

    .today{
      border-color: rgba($border-color-today, 0.35);
    }
  }

}
</style>
