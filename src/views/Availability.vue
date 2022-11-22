<template>
  <div v-if="!auth">NOT AUTHORISED</div>
  <div v-else>
    <NotifButton />
    <NavBar />

    <h1 class="section-title">
      Availability <span>{{ filteredShifts.length }} </span>
    </h1>
    <div class="date-indicator">
      <div class="date-input">
        <span>Viewing Shifts from: </span>
        <input
          type="text"
          :value="date !== null ? date[0].toDateString() : 'None'"
          disabled
        />
        <span>to</span>
        <input
          type="text"
          :value="date !== null ? date[1].toDateString() : 'None'"
          disabled
        />
      </div>
    </div>

    <div class="section-wrapper">
      <div class="shift-wrapper">
        <div class="canvas">
          <AvailabilityCard
            v-for="shift in filteredShifts"
            :key="shift.id"
            :employeeID="userID"
            :shiftObj="shift"
            :displayPicture="require('@/assets/AngMoKioHub.svg')"
          />
        </div>
      </div>
      <div class="right-wrapper">
        <Datepicker
          v-model="date"
          inline
          range
          :enableTimePicker="false"
          :action-row-component="actionRow"
        >
        </Datepicker>
        <div class="custom-action-row">
          <button class="clear-button action-button" @click="this.date = null">
            Clear Dates
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NotifButton from "@/components/NotifButton";
import NavBar from "../components/NavBar.vue";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import ActionRowCustom from "@/components/ActionRowCustom";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import AvailabilityCard from "@/components/AvailabilityCard.vue";
import {
  unsubAssignment,
  unsubAvailable,
  unsubShift,
  assignment,
  availability,
  shifts,
  filterShift,
} from "@/db/Shift";
import { fetchBranches, fetchTags, getBranchName } from "@/db/Branch";

export default {
  name: "Availability",
  components: { Datepicker, AvailabilityCard, NavBar, NotifButton },
  data() {
    return {
      unsubscribeListener: [unsubAssignment, unsubAvailable, unsubShift],
      userID: "",
      userTag: [],
      shifts: shifts,
      assignment: assignment,
      availability: availability,
      userBranchID: [],
      userBranchName: [],
      date: null,
      auth: false,
    };
  },
  async created() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.auth = true;
        this.userID = user.uid;
        const [unsubBranch, branchID] = fetchBranches(user.uid);
        const [unsubTag, userTags] = fetchTags(user.uid);
        this.unsubscribeListener.push(unsubBranch, unsubTag);
        this.userBranchID = branchID;
        this.userTag = userTags;
      } else {
        this.userID = null;
      }
    });
  },
  unmounted() {
    this.unsubscribeListener.forEach((callback) => {
      callback();
    });
  },
  watch: {
    userBranchID(newValue) {
      getBranchName(newValue).then((arr) => {
        this.userBranchName = arr;
      });
    },
  },
  computed: {
    filteredShifts() {
      return filterShift(
        this.shifts,
        this.userBranchName,
        this.userTag,
        this.date,
        this.assignment,
        this.userID
      );
    },
    actionRow() {
      return ActionRowCustom;
    },
  },
};
</script>

<style scoped>
.section-wrapper {
  display: flex;
}

.shift-wrapper {
  border-radius: 10px;
  overflow: auto;
  flex: 3;
  min-width: 500px;
}

.canvas {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
  background-color: #fbfbfd;
  border-radius: 20px;
  padding: 20px;
  height: 500px;
  overflow-y: scroll;
}

.custom-action-row {
  justify-content: flex-end;
}

.action-button {
  font-weight: 600;
}

h1 span {
  color: #808080;
  font-weight: normal;
  font-size: 20px;
  margin-left: 10px;
}

.date-input {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 0;
  margin-bottom: 20px;
}

.date-input input {
  padding: 7px 12px 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}
</style>
