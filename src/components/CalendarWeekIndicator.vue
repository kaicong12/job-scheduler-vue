<template>
  <div class="selected-week">
    <font-awesome-icon icon="fa-calendar" class="fa-calendar" />
    {{ startOfWeek }} &#8211; {{ endOfWeek }}
  </div>
</template>

<script>
import dayjs from "dayjs";

export default {
  props: {
    selectedDate: {
      type: Object,
      required: true,
    },
  },

  computed: {
    startOfWeek() {
      let day = (this.selectedDate.day() + 6) % 7;
      return dayjs(this.selectedDate)
        .subtract(day, "day")
        .format("DD MMM YYYY");
    },
    endOfWeek() {
      let day = (this.selectedDate.day() + 6) % 7;
      return dayjs(this.selectedDate)
        .add(6 - day, "day")
        .format("DD MMM YYYY");
    },
  },
};
</script>

<style scoped>
.selected-week {
  font-size: 24px;
  font-weight: 600;
  margin: 0px 10px 0px 10px;
  border: 1px;
  border-style: solid;
  padding: 5px;
  text-align: center;
}

.fa-calendar {
  margin: 0px 5px 0px 5px;
}
</style>