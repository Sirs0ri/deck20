<template>
  <div
    class="date-cell"
    :class="{
      today: today,
      'previous-month': previousMonth,
      'next-month': nextMonth,
    }"
  >
    {{ day.day }}
    <q-tooltip class="text-center text-body2">
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
