<template>
  <div class="information-wrapper">
    <div class="newshift-popup">
      <!-- cross icon on top right-->
      <font-awesome-icon icon="fa-solid fa-x" class="cross-icon" @click="this.$emit('toggleCreateShift')"/>

      <div class="header-wrapper">
        <div class="header">
          <h2>New Schedule</h2>
          <p v-if="repeating">A repeating schedule generates multiple shifts</p>
          <p v-else>This option generates a single shift</p>
        </div>
      </div>
      <div class="btn-group">
        <button id="onetimebtn" @click="selectOneTime">One-Time</button>
        <button id="repeatingbtn" @click="selectRepeating">Repeating</button>
      </div>
      <form id="shiftform" class="new-schedule" @submit.prevent="">
        <label for="title">Title</label>
        <input type="text" name="title" v-model="title"/>

        <label for="branch">Branch</label>
        <select v-model="branch" multiple>
          <option v-for="branch in branches" :key="branch">{{ branch }}</option>
        </select>

        <label v-if="repeating" for="repeatedDays">Repeats Every</label>
        <Multiselect
            v-if="repeating"
            v-model="selectedDays"
            mode="tags"
            placeholder="Select Days"
            track-by="value"
            label="value"
            :close-on-select="false"
            :options="days"
        />

        <label v-if="repeating" for="startDate">Starts From</label>
        <input v-if="repeating" type="date" name="startDate" v-model="startDate"/>
        <label v-if="repeating" for="endDate">Ends On</label>
        <input v-if="repeating" type="date" name="endDate" v-model="endDate"/>

        <label v-if="!repeating" for="date">Date</label>
        <input v-if="!repeating" type="date" name="date" v-model="date"/>

        <div class="multi-input">
          <div class="column">
            <label for="startTime">Time In</label>
            <input type="time" name="startTime" v-model="startTime"/>
          </div>
          <div class="column">
            <label for="endTime">Time Out</label>
            <input type="time" name="endTime" v-model="endTime"/>
          </div>
        </div>
        <label for="manpower">Manpower</label>
        <Multiselect
            v-model="selectedTags"
            mode="tags"
            placeholder="Select Manpower"
            track-by="value" label="value"
            :close-on-select="false"
            :options="tags"
        />
        <label>Manpower Detail</label>

        <div v-if="selectedTags.length === 0"><br/></div>

        <ol v-for="tag in selectedTags" :key="tag">
          <input class="manpower-qty" type="number" name="{{tag}}" v-model="manpower[tag]"/>
          <font-awesome-icon icon="fa-user" class="fa-user"/>
          <label for="{{tag}}"> x {{ tag }}</label>
        </ol>
        <div class="button-wrapper custom-action-row">
          <button class="action-button done" type="button" @click="createShift">
            Publish
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import {db} from "@/firebase";
import {collection, getDocs, addDoc} from "firebase/firestore";
import Multiselect from "@vueform/multiselect/src/Multiselect";
import dayjs from "dayjs";

const dbTags = collection(db, "tags");
const dbBranch = collection(db, "branch");

export default {
  name: "NewShift",
  emit: ["togglePopup"],
  data() {
    return {
      repeating: false,
      title: "",
      date: "",
      startTime: "",
      endTime: "",
      days: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      selectedDays: [],
      tags: [],
      selectedTags: [],
      manpower: {},
      startDate: "",
      endDate: "",
      dayIndex: {
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
        Sunday: 0,
      },
      branches: [],
      branch: [],
    };
  },
  components: {Multiselect},
  async mounted() {
    const tagsQuery = await getDocs(dbTags);
    tagsQuery.forEach((doc) => {
      const tag = doc.data().tag;
      this.tags.push(tag);
      this.manpower[tag] = 1;
    });

    const branchQuery = await getDocs(dbBranch);
    branchQuery.forEach((doc) => {
      const branch = doc.data().name;
      this.branches.push(branch);
    });
  },

  methods: {
    async createShift() {
      // check if fields are filled up
      if (this.title === "") {
        alert("Please fill in the Title!");
        return;
      }
      if (this.branch === "") {
        alert("Please pick a Branch!");
        return;
      }
      if (this.startTime === "") {
        alert("Please fill in the Time In!");
        return;
      }
      if (this.endStart === "") {
        alert("Please fill in the Time Out!");
        return;
      }
      if (
          parseInt(this.endTime.replace(":", "")) -
          parseInt(this.startTime.replace(":", "")) <=
          0
      ) {
        alert("Your Time Out has to be after your Time In");
        return;
      }
      if (this.selectedTags.length === 0) {
        alert("Please select your Manpower!");
        return;
      }

      for (const tag of this.tags) {
        if (this.selectedTags.includes(tag) && this.manpower[tag] <= 0) {
          alert("The manpower allocated has to be more than 0");
          return;
        }
      }

      // compile manpower
      let manpower = {};
      let filledManpower = {};

      for (let i = 0; i < this.selectedTags.length; i++) {
        const tag = this.selectedTags[i];
        manpower[tag] = this.manpower[tag];
        filledManpower[tag] = 0;
      }

      if (!this.repeating) {
        // check if fields are filled up
        if (this.date === "") {
          alert("Please fill in the Date!");
          return;
        }

        // push data
        this.pushData(manpower, filledManpower);
        this.selectedTags = [];
      } else {
        // check if fields are filled up
        if (this.selectedDays.length === 0) {
          alert("Please choose the repeated days!");
          return;
        }
        if (this.startDate === "") {
          alert("Please fill in the Start Date!");
          return;
        }
        if (dayjs(this.startDate).isBefore(dayjs())) {
          alert("The Start Date has to be after today!");
          return;
        }
        if (this.endDate === "") {
          alert("Please fill in the End Date!");
          return;
        }
        if (dayjs(this.endDate).isBefore(dayjs(this.startDate))) {
          alert("The End Date has to be after the Start Date!");
          return;
        }

        // algo for repeated days
        this.selectedDays.forEach((day) => {
          const dayIndex = this.dayIndex[day];
          const startDate = this.startDate;
          const endDate = dayjs(this.endDate).add(1, "day");
          const startIndex = dayjs(startDate).day();
          let nextDay;
          if (startIndex <= dayIndex) {
            nextDay = dayjs(startDate);
          } else {
            nextDay = dayjs(startDate).add(7 - startIndex + dayIndex, "day");
          }
          while (nextDay.isBefore(endDate)) {
            this.pushRepeatedData(
                manpower,
                nextDay.format("YYYY-MM-DD"),
                filledManpower
            );
            nextDay = nextDay.add(7, "day");
          }
        });
        this.selectedTags = [];
        this.selectedDays = [];
      }
      alert("The shift has successfully been published!");
      this.$emit("toggleCreateShift");
    },

    selectOneTime() {
      const onetimebtn = document.getElementById("onetimebtn");
      onetimebtn.style.backgroundColor = "rgb(248, 213, 126)";

      const repeatingbtn = document.getElementById("repeatingbtn");
      repeatingbtn.style.backgroundColor = "white";

      this.repeating = false;
    },

    selectRepeating() {
      const onetimebtn = document.getElementById("onetimebtn");
      onetimebtn.style.backgroundColor = "white";

      const repeatingbtn = document.getElementById("repeatingbtn");
      repeatingbtn.style.backgroundColor = "rgb(248, 213, 126)";

      this.repeating = true;
    },

    async pushData(manpower, filledManpower) {
      try {
        const docRef = await addDoc(collection(db, "shifts"), {
          title: this.title,
          branch: this.branch[0],
          date: this.date,
          startTime: this.startTime.replace(":", ""),
          endTime: this.endTime.replace(":", ""),
          manpower: manpower,
          filledManpower: filledManpower,
        });
        console.log("Document written with ID: ", docRef);
      } catch (error) {
        console.error(error);
      }
    },

    async pushRepeatedData(manpower, date, filledManpower) {
      try {
        const docRef = await addDoc(collection(db, "shifts"), {
          title: this.title,
          branch: this.branch[0],
          date: date,
          startTime: this.startTime.replace(":", ""),
          endTime: this.endTime.replace(":", ""),
          manpower: manpower,
          filledManpower: filledManpower,
        });
        console.log("Document written with ID: ", docRef);
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>
.information-wrapper {
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

.newshift-popup {
  background-color: white;
  border-radius: 20px;
  width: 50%;
  min-height: 500px;
  max-height: 600px;
  flex-direction: row;
  align-items: center;
  /* gap: 20px; */
  padding: 30px;
  position: relative;
  max-width: 400px;
  min-width: 300px;
  overflow: auto;
}

.new-schedule {
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 0.6;
  padding: 0px 30px 0px 30px;
}

input {
  padding: 7px 12px 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  overflow: hidden;
}

select {
  padding: 7px 12px 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

.multi-input {
  display: flex;
}

.column {
  display: flex;
  flex-direction: column;
  width: 50%;
}

.header-wrapper {
  display: flex;
  justify-content: center;
  text-align: center;
}

.header h2 {
  font-size: 34px;
  margin-bottom: 5px;
}

.header p {
  font-size: 18px;
  margin-top: 0px;
}

.done:hover {
  background-color: var(--yellow-tone-3);
}

.draft:hover {
  background-color: #d1d5db;
}

label {
  margin-top: 20px;
}

ol {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.fa-user {
  margin: 0px 5px 0px 5px;
}

.manpower-qty {
  width: 40px;
  margin: 0px 5px 0px 5px;
}

.custom-action-row {
  margin-top: 20px;
  justify-content: flex-end;
}

.btn-group {
  margin: 0 auto;
  width: 80%;
}

#onetimebtn {
  background-color: rgb(248, 213, 126);
}

.btn-group button {
  width: 50%;
  background-color: white;
  padding: 10px 24px;
  cursor: pointer;
  float: left;
}

.btn-group button:not(:last-child) {
  border-right: none;
}

.cross-icon {
  position: absolute;
  top: 20px;
  right: 30px;
  cursor: pointer;
}
</style>