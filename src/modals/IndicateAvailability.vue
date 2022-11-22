<template>
  <div class="button-container">
    <button class="action-button" @click="actionBtnClick">{{msg}}</button>
  </div>
</template>

<script>
import {deleteAvailability, postAvailability} from "@/db/Availability";

const ACCEPTABLE_ACTIONS = {
  INDICATE: "indicate",
  REMOVE: "remove"
}

export default {
  name: "IndicateAvailability",
  props: ["employeeID", "shiftID", "action", "msg"],
  methods: {
    actionBtnClick() {
      if (this.action === ACCEPTABLE_ACTIONS.INDICATE) {
        postAvailability(this.employeeID, this.shiftID)
      } else if (this.action === ACCEPTABLE_ACTIONS.REMOVE) {
        deleteAvailability(this.employeeID, this.shiftID)
      }
    },
  },
}
</script>

<style scoped>
  .button-container {
    position: absolute;
    top: 60px;
  }

  .button-container button {
    border-radius: 20px;
  }
</style>