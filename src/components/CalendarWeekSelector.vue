<template>
  <div class="top-bar">
    <div class="left-column">
      <span id="today" @click="selectCurr">Go To Today</span>
    </div>

    <div class="week-selector">
      <span id="arrow" @click="selectPrev"> &lt; </span>
      <CalendarWeekIndicator :selected-date="selectedDate" />
      <span id="arrow" @click="selectNext"> > </span>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import CalendarWeekIndicator from "./CalendarWeekIndicator.vue";

export default {
  name: "CalendarWeekSelector",

  components: {
    CalendarWeekIndicator,
  },

  props: {
    currentDate: {
      type: String,
      required: true,
    },

    selectedDate: {
      type: Object,
      required: true,
    },
  },

  methods: {
    selectPrev() {
      let newSelectedDate = dayjs(this.selectedDate).subtract(1, "week");
      this.$emit("dateSelected", newSelectedDate);
    },
    selectCurr() {
      let newSelectedDate = dayjs(this.currentDate);
      this.$emit("dateSelected", newSelectedDate);
    },

    selectNext() {
      let newSelectedDate = dayjs(this.selectedDate).add(1, "week");
      this.$emit("dateSelected", newSelectedDate);
    },
  },
};
</script>

<style scoped>
.top-bar {
  margin-bottom: -25px;
}

.left-column {
  float: left;
  width: 30%;
}

#today {
  position: absolute;
  background-color: rgb(254, 206, 124);
  padding: 0px 10px 0px 10px;
  border: 5px;
  border-style: solid;
  border-color: rgb(254, 206, 124);
  border-radius: 10%;
  cursor: pointer;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  margin-left: 5%;
}

.week-selector {
  margin: auto;
  display: flex;
  justify-content: space-between;
  color: var(--grey-800);             
  max-width: 30%;
  align-items: center;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}

#arrow {
  font-size: 30px;
  cursor: pointer;
  user-select: none;
}
</style>
