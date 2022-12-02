<template>
  <div
    class="date-cell"
    :class="{
      today: today,
      'previous-month': previousMonth,
      'next-month': nextMonth,
    }"
  >
    {{ date.day }}
    <q-tooltip
      class="text-center text-body2"
      transition-show="jump-down"
      transition-hide="fade"
    >
      <!-- eslint-disable-next-line vue/no-v-html -->
      <span v-html="getDayPopupString(date)" />
    </q-tooltip>
  </div>
</template>

<script setup>

import { getDayPopupString } from "src/utils/calendar"

defineProps({
  date: {
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

.date-cell {
  display: flex;
  justify-content: center;
  align-items: center;

  position: relative;

  z-index: 10;

  padding: 0.5em;

  border-width: 2px;
  border-style: solid;
  border-color: transparent;
  border-radius: 0.5em;

  cursor: pointer;

  --transition-duration: 200ms;
  transition:
    border-color var(--transition-duration),
    background-color var(--transition-duration),
    opacity var(--transition-duration);

  &:hover {
    background-color: hsla(var(--color-hsl) / 0.2);
  }

  &.today {
    background-color: hsla(var(--color-hsl) / 0.5);
  }
  &.today:hover{
    border-color: hsla(var(--color-hsl) / 0.7);
  }

  &.previous-month,
  &.next-month {
    opacity: 0.5;

    :hover {
      opacity: 0.75;
    }

    .today{
      border-color: hsla(var(--color-hsl) / 0.35);
    }
  }
}
</style>
