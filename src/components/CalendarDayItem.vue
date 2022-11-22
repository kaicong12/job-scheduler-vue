<template>
  <li class="calendar-day">
    <ol class="cards-grid" v-if="shifts">
      <CalendarCards v-for="shift in shifts" :key="shift" :shift="shift" />
    </ol>
    <span id="no-shifts" v-else>There are no shifts allocated on this date</span>
  </li>
</template>

<script>
import dayjs from "dayjs";
import CalendarCards from "./CalendarCards.vue";

export default {
  name: "CalendarDayItem",
  props: {
    day: {
      type: Object,
      required: true,
    },
    shifts: {
      type: Object,
    },
  },
  computed: {
    label() {
      return dayjs(this.day.date).format("D");
    },
  },
  components: { CalendarCards },
};
</script>

<style scoped>
.calendar-day {
  position: relative;
  min-height: 100px;
  font-size: 16px;
  background-color: #fff;
  color: var(--grey-800);
  padding: 5px;
}

.calendar-day span {
  padding: 10px 0px 10px 0px;
}

.cards-grid {
  display: grid;
  height: 100%;
  position: relative;
  grid-column-gap: var(--grid-gap);
  grid-row-gap: var(--grid-gap);
}

#no-shifts {
  display: flex;
  text-align: center;
  justify-content: center;
}
</style>