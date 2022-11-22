<template>
  <div v-if="!admin">NOT AUTHORISED</div>
  <div v-else>
    <div class="container" v-if="show">
      <!--  display picture on the right-->
      <NotifButton />
      <NavBar />

      <h1 class="section-title">Shifts Information</h1>

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
          <div class="shift-canvas">
            <div
              class="shift-card"
              v-for="shift in filteredShifts"
              :key="shift"
              @click="this.selectedShift = shift"
            >
              <h3>{{ shift.title }}</h3>
              <p>
                <font-awesome-icon icon="fa-calendar" class="fa-calendar" />
                {{ shift.date }}
              </p>
              <p>
                <span><font-awesome-icon icon="fa-regular fa-clock" /></span>
                {{ shift.startTime }} - {{ shift.endTime }}
              </p>
            </div>
          </div>
        </div>

        <div class="right-wrapper">
          <button
            class="create-button action-button"
            @click="toggleCreateShiftPopup"
          >
            Create Shift
          </button>
          <div class="custom-action-row">
            <button
              class="clear-button action-button"
              @click="this.date = null"
            >
              Clear Dates
            </button>
          </div>
          <Datepicker
            v-model="date"
            inline
            range
            :enableTimePicker="false"
            :action-row-component="actionRow"
          >
          </Datepicker>
        </div>

        <NewShift
          v-if="toggleCreateShift"
          @toggleCreateShift="toggleCreateShift = false"
        />
      </div>
    </div>

    <!--  Modal Component-->
    <ShiftDetails
      v-if="selectedShift"
      @closePopup="this.selectedShift = null"
      :shift-id="selectedShift.id"
    />
  </div>
</template>

<script>
import { branches } from "@/db/Employee";
import { unsubShift, shifts } from "@/db/Shift";
import ShiftDetails from "@/modals/ShiftDetails";
import NewShift from "../modals/NewShift.vue";
import NotifButton from "@/components/NotifButton";
import NavBar from "../components/NavBar.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import ActionRowCustom from "@/components/ActionRowCustom";

export default {
  name: "EmployerShift",
  components: {
    ShiftDetails,
    Datepicker,
    NewShift,
    NotifButton,
    NavBar,
  },
  data() {
    return {
      unsubscribeListener: [unsubShift],
      shifts: shifts,
      branches: branches,
      selectedBranch: null,
      selectedShift: null,
      date: null,
      toggleCreateShift: false,
      show: true,
      admin: false,
      adminid: "42vuID5nKWMVL1mODCKyqaoVL7s1",
    };
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.uid = user.uid;
        if (user.uid === this.adminid) {
          this.admin = true;
        }
      }
    });
  },
  unmounted() {
    this.unsubscribeListener.forEach((callback) => {
      callback();
    });
  },
  computed: {
    actionRow() {
      return ActionRowCustom;
    },
    filteredShifts() {
      let result = null;
      if (this.date === null) {
        result = this.shifts;
      } else {
        result = this.shifts.filter((shift) => {
          const startDate = this.date[0].toISOString().substring(0, 10);
          const endDate = this.date[1].toISOString().substring(0, 10);
          if (endDate !== null) {
            return shift.date >= startDate && shift.date <= endDate;
          } else {
            return shift.date >= startDate;
          }
        });
      }

      // sort shifts by start time
      return result.sort((a, b) => {
        var keyA = a.startTime,
          keyB = b.endTime;
        // Compare the 2 times
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      });
    },
  },
  methods: {
    toggleCreateShiftPopup() {
      this.toggleCreateShift = true;
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

.right-wrapper {
  flex: 1;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.custom-action-row {
  justify-content: flex-start;
}

.action-button {
  width: 250px;
  font-weight: 600;
}

.create-button {
  background-color: var(--yellow-tone-2);
}

.shift-canvas {
  background-color: #fbfbfd;
  border-radius: 20px;
  padding: 20px;
  height: 500px;
  overflow-y: scroll;
}

.shift-card {
  border-radius: inherit;
  background-color: white;
  padding: 1px 20px;
  margin-top: 20px;
}

.shift-card:hover {
  background-color: var(--yellow-tone-1);
}
</style>
