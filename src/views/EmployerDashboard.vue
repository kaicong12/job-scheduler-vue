<template>
  <div v-if="!admin">NOT AUTHORISED</div>
  <div v-else>
    <NotifButton />
    <div class="column left">
      <NavBar />
      <h1>Shifts Requiring Attention</h1>
      <div class="shift-wrapper">
        <ShiftCard
          v-for="shift in shifts"
          :key="shift"
          :branch="shift.branch"
          :title="shift.title"
          :date="shift.date"
          :startTime="shift.startTime"
          :endTime="shift.endTime"
        />
      </div>
    </div>
    <div class="column right">
      <h1>Employee Requests</h1>
      <div class="request-wrapper">
        <EmployeeTagReqCard
          v-for="req in tagRequests"
          :key="req.tagName"
          :firstName="req.firstName"
          :lastName="req.lastName"
          :tagName="req.tagName"
          :id="req.id"
          :employeeID="req.employeeID"
        />
        <EmployeeBranchReqCard
          v-for="req in branchRequests"
          :key="req.tagName"
          :firstName="req.firstName"
          :lastName="req.lastName"
          :branch="req.branch"
          :id="req.id"
          :employeeID="req.employeeID"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ShiftCard from "../components/ShiftCard.vue";
import NotifButton from "@/components/NotifButton";
import EmployeeTagReqCard from "../components/EmployeeTagReqCard.vue";
import EmployeeBranchReqCard from "../components/EmployeeBranchReqCard.vue";
import { db } from "@/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import NavBar from "../components/NavBar.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import dayjs from "dayjs";
const dbShifts = collection(db, "shifts");
const dbTagRequest = collection(db, "tagRequest");
const dbBranchRequest = collection(db, "branchRequest");

export default {
  data() {
    return {
      shifts: [],
      tagRequests: [],
      branchRequests: [],
      count: 0,
      admin: false,
      adminid: "42vuID5nKWMVL1mODCKyqaoVL7s1",
    };
  },
  components: {
    NotifButton,
    ShiftCard,
    EmployeeTagReqCard,
    EmployeeBranchReqCard,
    NavBar,
  },
  async mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.uid = user.uid;
        if (user.uid === this.adminid) {
          this.admin = true;
        }
      }
    });

    for (let i = 0; i < 7; i++) {
      let date = dayjs().add(i, "day").format("YYYY-MM-DD");

      const q = await query(dbShifts, where("date", "==", date));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const filledManpower = data.filledManpower;
        const manpower = data.manpower;
        if (filledManpower != undefined) {
          let filled = true;
          for (const [key, value] of Object.entries(filledManpower)) {
            if (manpower[key] != value) {
              filled = false;
              break;
            }
          }
          if (!filled) {
            this.shifts.push({
              branch: data.branch,
              title: data.title,
              date: data.date,
              startTime: data.startTime,
              endTime: data.endTime,
            });
          }
        }
      });
    }

    // tag requests

    const qTag = await query(dbTagRequest);
    const tagQuerySnapshot = await getDocs(qTag);

    tagQuerySnapshot.forEach((d) => {
      const data = d.data();
      const reqTag = data.tagName;
      const employeeID = data.employeeID;
      const employeeRef = doc(db, "employee", employeeID);
      getDoc(employeeRef).then((docSnap) => {
        const employee = docSnap.data();
        this.tagRequests.push({
          firstName: employee.firstName,
          lastName: employee.lastName,
          tagName: reqTag,
          id: d.id,
          employeeID: employeeID,
        });
      });
    });

    // branch requests

    const qBranch = await query(dbBranchRequest);
    const branchQuerySnapshot = await getDocs(qBranch);

    branchQuerySnapshot.forEach((d) => {
      const data = d.data();
      const reqBranch = data.branch;
      const employeeID = data.employeeID;
      const employeeRef = doc(db, "employee", employeeID);
      getDoc(employeeRef).then((docSnap) => {
        const employee = docSnap.data();
        this.branchRequests.push({
          firstName: employee.firstName,
          lastName: employee.lastName,
          branch: reqBranch,
          id: d.id,
          employeeID: employeeID,
        });
      });
    });
  },
  methods: {
    forceUpdate() {
      this.$forceUpdate;
    },
  },
};
</script>

<style scoped>
.column {
  float: left;
  text-align: left;
}

.left {
  width: 65%;
  padding-right: 5%;
}

.right {
  width: 30%;
}

.shift-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 30px;
}

.request-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 30px;
}
</style>
