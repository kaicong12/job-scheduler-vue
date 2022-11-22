<template>
  <ol class="day-of-week">
    <li
      v-for="day in days"
      :key="day"
      :class="{
        'calendar-day--today': day.fulldate === today,
      }"
    >
      <strong id="day">{{ day.day }}</strong>
      <span id="date">{{ day.date }}</span>
    </li>
  </ol>
</template>

<script>
import dayjs from "dayjs";

export default {
  name: "CalendarDays",

  props: {
    selectedDate: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      today: dayjs().format("YYYY-MM-DD"),
    };
  },

  computed: {
    days() {
      let index = (this.selectedDate.day() + 6) % 7;
      let days = [
        {
          day: "Mon",
          date: dayjs(this.selectedDate).subtract(index, "day").format("DD"),
          fulldate: dayjs(this.selectedDate)
            .subtract(index, "day")
            .format("YYYY-MM-DD"),
        },
        {
          day: "Tue",
          date: dayjs(this.selectedDate)
            .subtract(index - 1, "day")
            .format("DD"),
          fulldate: dayjs(this.selectedDate)
            .subtract(index - 1, "day")
            .format("YYYY-MM-DD"),
        },
        {
          day: "Wed",
          date: dayjs(this.selectedDate)
            .subtract(index - 2, "day")
            .format("DD"),
          fulldate: dayjs(this.selectedDate)
            .subtract(index - 2, "day")
            .format("YYYY-MM-DD"),
        },
        {
          day: "Thu",
          date: dayjs(this.selectedDate)
            .subtract(index - 3, "day")
            .format("DD"),
          fulldate: dayjs(this.selectedDate)
            .subtract(index - 3, "day")
            .format("YYYY-MM-DD"),
        },
        {
          day: "Fri",
          date: dayjs(this.selectedDate)
            .subtract(index - 4, "day")
            .format("DD"),
          fulldate: dayjs(this.selectedDate)
            .subtract(index - 4, "day")
            .format("YYYY-MM-DD"),
        },
        {
          day: "Sat",
          date: dayjs(this.selectedDate)
            .subtract(index - 5, "day")
            .format("DD"),
          fulldate: dayjs(this.selectedDate)
            .subtract(index - 5, "day")
            .format("YYYY-MM-DD"),
        },
        {
          day: "Sun",
          date: dayjs(this.selectedDate)
            .subtract(index - 6, "day")
            .format("DD"),
          fulldate: dayjs(this.selectedDate)
            .subtract(index - 6, "day")
            .format("YYYY-MM-DD"),
        },
      ];
      return days;
    },
  },
};
</script>

<style scoped>
.day-of-week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.day-of-week > * {
  text-align: left;
  padding-right: 5px;
}
.calendar-day--today {
  background-color: rgb(254, 206, 124);
}

#day {
  margin-left: 10px;
}

#date {
  font-size: 15px;
  margin-left: 10px;
}
</style>