<template>
  <div
    class="date-cell-background"
    :class="cornerClasses"
  >
    <div class="background" />
  </div>
</template>

<script setup>
import { computed } from "vue"
import {
  getWeekday,
  getMonth,
  days,
} from "./calendar"

const props = defineProps({
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

const cornerClasses = computed(() => {
  if (props.previousMonth || props.nextMonth) return ""

  const day = getWeekday(props.date)
  const _month = getMonth(props.date)
  const dayIndex = props.date.day

  return Object.entries({
    "current-month": true,
    "corner--1": dayIndex === _month.days && day.index !== days.length && _month.days >= days.length,
    "corner--3": dayIndex === 1 && day.index !== 1 && _month.days >= days.length,
    "border-1": dayIndex <= days.length,
    "border-2": day.index === days.length || dayIndex === _month.days,
    "border-3": dayIndex > _month.days - days.length,
    "border-4": day.index === 1 || dayIndex === 1,
  })
    .filter(([cornerId, active]) => active)
    .map(([cornerId, active]) => cornerId)
    .join(" ")
})
</script>

<style lang="scss">
.date-cell-background.current-month {
  --gap-neg: calc(-1 * var(--gap));

  position: relative;

  .background {
    position: absolute;
    inset: calc(-0.5 * var(--gap));
    background-color: var(--bg-color);
    background-color: white;

    z-index: 4;

    &::before {
      content: "";
      background-color: var(--bg-color);
      position: absolute;
      inset: 0;
    }
  }

  &::before {
    content: "";
    position: absolute;
    inset: calc(-0.5 * var(--gap));
    background-color: var(--border-color);
  }

  /* #region borders */
  &.border-1 {
    &::before {
      top: var(--gap-neg);
    }
    .background {
      top: 0;
    }
  }

  &.border-2 {
    &::before {
      right: var(--gap-neg);
    }
    .background {
      right: 0;
    }
  }

  &.border-3 {
    &::before {
      bottom: var(--gap-neg);
    }
    .background {
      bottom: 0;
    }
  }
  &.border-4 {
    &::before {
      left: var(--gap-neg);
    }
    .background {
      left: 0;
    }
  }
  /* #endregion */

  /* #region outside corners */
  &.border-1.border-4 {
    &::before {
      border-top-left-radius: calc(var(--gap) + var(--cell-border-radius));
    }
    .background, .background::before {
      border-top-left-radius: var(--cell-border-radius);
    }
  }

  &.border-1.border-2 {
    &::before {
      border-top-right-radius: calc(var(--gap) + var(--cell-border-radius));
    }
    .background, .background::before {
      border-top-right-radius: var(--cell-border-radius);

    }
  }

  &.border-2.border-3 {
    &::before {
      border-bottom-right-radius: calc(var(--gap) + var(--cell-border-radius));
    }
    .background, .background::before {
      border-bottom-right-radius: var(--cell-border-radius);

    }
  }

  &.border-3.border-4 {
    &::before {
      border-bottom-left-radius: calc(var(--gap) + var(--cell-border-radius));
    }
    .background, .background::before {
      border-bottom-left-radius: var(--cell-border-radius);
    }
  }
  /* #endregion */

  /* #region inside corners */
  &.corner--1,
  &.corner--3 {
    &::after {
      content: "";
      position: absolute;
      z-index: 3;
      width: calc(2 * var(--cell-border-radius));
      height: calc(2 * var(--cell-border-radius));
      box-shadow: 0 0 0 calc(2 * var(--cell-border-radius)) white;
      outline: calc(2 * var(--cell-border-radius)) solid var(--border-color);
    }
    .background::after {
      content: "";
      position: absolute;
      z-index: 5;
      width: calc(2 * var(--cell-border-radius));
      height: calc(2 * var(--cell-border-radius));
      box-shadow: 0 0 0 calc(2 * var(--cell-border-radius)) white;
      outline: calc(2 * var(--cell-border-radius)) solid var(--bg-color);
    }

  }
  &.corner--1 {
    &::after {
      top: 0;
      right: calc(-2 * var(--cell-border-radius) - var(--gap));
      border-radius: var(--cell-border-radius) 0 0 0;
      clip-path: inset(-4px 1px 1px -4px);
    }
    .background::after {
      top: calc(-0.5 * var(--gap));
      right: calc(-2 * var(--cell-border-radius));
      border-radius: calc(var(--cell-border-radius) + var(--gap)) 0 0 0;
      clip-path: inset(-4px 1px 1px -4px);
    }
  }

  &.corner--3 {
    &::after {
      bottom: 0;
      left: calc(-2 * var(--cell-border-radius) - var(--gap));
      border-radius: 0 0 var(--cell-border-radius) 0;
      clip-path: inset(1px -4px -4px 1px);
    }
    .background::after {
      bottom: calc(-0.5 * var(--gap));
      left: calc(-2 * var(--cell-border-radius));
      border-radius: 0 0 calc(var(--cell-border-radius) + var(--gap)) 0;
      clip-path: inset(1px -4px -4px 1px);
    }
  }
  /* #endregion */

}
</style>
