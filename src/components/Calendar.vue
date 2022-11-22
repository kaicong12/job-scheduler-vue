<template>
  <div class="datepicker">
    <Datepicker
        class="calendar-component"
        v-model="date"
        inline
        :enableTimePicker="false"
        :range="true"
        :minDate="new Date()"
        :action-row-component="actionRow"
    >
    </Datepicker>
    <button class="reset-button" @click="resetClick">Reset</button>
    <h3> Selected {{ date }} </h3>
    <h3 v-if="done">Done is clicked</h3>
  </div>
</template>

<script>
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

import ActionRowCustom from "@/components/ActionRowCustom";

export default {
  name: "Calendar",
  components: { Datepicker },
  data() {
    return {
      date: null,
      done: false,
    }
  },
  computed: {
    actionRow() {
      return ActionRowCustom
    }
  },
  methods: {
    resetClick() {
      const date = new Date();
      const newDate = new Date()
      newDate.setDate(date.getDate() + 7)

      this.date = [date, newDate]
    }
  }
}
</script>

<style>
  .datepicker {
    position: relative;
    border: 1px solid red;
  }

  .reset-button {
    position: absolute;
    bottom: 30px;
  }

  .dp__today {
    border: 1px solid var(--yellow-tone-3)
  }

  .dp__range_between {
    background-color: var(--yellow-tone-1);
  }

  .dp__range_end, .dp__range_start {
    background-color: var(--yellow-tone-2);
    color: black;
  }

  /*hacky way to remove selection from date component*/
  .dp__selection_preview {
    width: 0%;
  }

  .dp__action_buttons {
    width: 100%;
  }
</style>