<template>
  <div class="shift-wrapper">
    <div class="external-wrapper">
      <div class="shift-popup">
        <h1 class="title">Shift Details</h1>

        <!-- cross icon on top right-->
        <font-awesome-icon
            icon="fa-solid fa-x"
            class="cross-icon"
            @click="this.$emit('closePopup')"
        />

        <form class="personal-information">
          <label for="title">Title</label>
          <input type="text" name="title" v-model="shiftObj.title">
          <label for="date">Date</label>
          <input type="text" name="date" v-model="shiftObj.date">
          <label for="startTime">Start Time</label>
          <input type="text" name="startTime" v-model="shiftObj.startTime">
          <div class="worker-pool">
            <div class="available-workers">
              <label>Available Workers</label>
              <div class="canvas">
                <ShiftWorkers
                    v-for="workerObj in availableWorkers"
                    :key="workerObj"
                    :employee="workerObj"
                    worker-type="availableWorkers"
                    @toggleEmployee="toggleEmployee"
                />
              </div>
            </div>
            <div class="assigned-workers">
              <label>Assignees</label>
              <div class="canvas">
                <ShiftWorkers
                    v-for="workerObj in assignedWorkers"
                    :key="workerObj"
                    :employee="workerObj"
                    worker-type="assignedWorkers"
                    @toggleEmployee="toggleEmployee"
                />
              </div>
            </div>
          </div>
        </form>

        <div class="button-wrapper custom-action-row">
          <button class="action-button cancel-button" type="button" @click="$emit('closePopup')">Cancel</button>
          <button class="action-button done" type="button" @click="this.showConfirmation=true">Confirm</button>
        </div>
      </div>


      <!--  Modal component  -->
      <ConfirmationMessage
          v-if="showConfirmation"
          msg="Would you like to confirm your edits?"
          @closeMessage="this.showConfirmation=false"
          @confirmEdit="updateShift"
      />
    </div>
  </div>
</template>

<script>
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase"
import {filterShiftAssignee, filterShiftAvailability, getShift,
  createAssignment, deleteAssignment} from "@/db/Shift";

import ConfirmationMessage from "@/modals/ConfirmationMessage";
import ShiftWorkers from "@/components/ShiftWorkers";

export default {
  name: "ShiftDetails",
  emits: ["closePopup"],
  props: ["shiftId"],
  components: { ConfirmationMessage, ShiftWorkers },
  data() {
    return {
      unsubListener: [],
      shiftObj: {},
      availableWorkers: [],
      assignedWorkers: [],
      showConfirmation: false,
    }
  },
  created() {
    const [unsubAssignment, assignments] = filterShiftAssignee(this.shiftId)
    this.assignedWorkers = assignments
    this.unsubListener.push(unsubAssignment)

    const waitGetShiftDetails = async () => {
      const shiftObj = await getShift(this.shiftId)
      this.shiftObj = {
        'title': shiftObj.title,
        'date': shiftObj.date,
        'startTime': shiftObj.startTime,
        'endTime': shiftObj.endTime,
      }
    }

    const waitGetAvailability = async () => {
      const [unsubAvailability, availability] = await filterShiftAvailability(this.shiftId)
      this.unsubListener.push(unsubAvailability)
      this.availableWorkers = availability
    }
    waitGetShiftDetails()
    waitGetAvailability()
  },
  methods: {
    async updateShift() {
      const shiftRef = doc(db, "shifts", this.shiftId);
      await updateDoc(shiftRef, { ...this.shiftObj });
      this.assignedWorkers.forEach((employeeID) => {
         createAssignment(this.shiftId, employeeID)
      })

      this.availableWorkers.forEach((employeeID) => {
        deleteAssignment(this.shiftId, employeeID)
      })

      this.showConfirmation = false
      this.$emit('closePopup')
    },
    toggleEmployee(value, workerID) {
      let srcArray, dstArray
      if (value === "availableWorkers") {
        srcArray = this.availableWorkers
        dstArray = this.assignedWorkers
      } else if (value === "assignedWorkers") {
        srcArray = this.assignedWorkers
        dstArray = this.availableWorkers
      }

      // remove this from src array
      const index = srcArray.indexOf(workerID)
      if (index > -1) {
        srcArray.splice(index, 1);
      }
      // push it to dst array
      dstArray.push(workerID)
    }
  }
}
</script>

<style scoped>
.shift-wrapper {
    z-index: 99;
    background-color: rgb(0, 0, 0, 0.2);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

.external-wrapper {
    background-color: white;
    border-radius: 20px;
    max-width: 600px;
    min-width: 500px;
    height: 700px;
    overflow: hidden;
}

.shift-popup {
    border-radius: 20px;
    height: inherit;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 0 30px 0 30px;
    position: relative;
    overflow-y: auto;
  }

.cross-icon {
    position: absolute;
    top: 20px;
    right: 30px;
    cursor: pointer;
  }

.personal-information {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 85%;
}

input {
    padding: 7px 12px 6px 12px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
  }

button {
  margin: 20px auto;
}

.custom-action-row {
  width: 100%;
}

.action-button {
  width: 30%;
}

.canvas {
  border-radius: 10px;
  background-color: #FBFBFD;
  padding: 10px;
  height: 200px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: scroll;
}
</style>