<template>
  <div class="main">
    <div class="navbar">
      <div class="navBar">
        <div v-if="!admin">
          <button
            id="homeButton"
            type="button"
            @click="$router.push('/availability')"
            style="font-size: 18px"
          >
            <font-awesome-icon icon="fa-home" />&nbsp; &nbsp; Home</button
          ><br /><br />
          <button
            id="availButton"
            type="button"
            @click="$router.push('/availability')"
            style="font-size: 18px"
          >
            <font-awesome-icon icon="fa-briefcase" />&nbsp; &nbsp; Availability</button
          ><br /><br />
          <button
            id="timetableButton"
            type="button"
            @click="$router.push('/employeeCalendar')"
            style="font-size: 18px"
          >
            <font-awesome-icon icon="fa-calendar" />&nbsp; &nbsp; Timetable</button
          ><br /><br />
          <button
            id="settingsButton"
            type="button"
            @click="$router.push('/setting')"
            style="font-size: 18px"
          >
            <font-awesome-icon icon="fa-cog" />&nbsp; &nbsp; Settings
          </button>
        </div>
        <div v-if="admin">
          <button
            id="dashboard"
            type="button"
            @click="$router.push('/employerdashboard')"
            style="font-size: 18px"
          >
            <font-awesome-icon icon="fa-home" />&nbsp; &nbsp; Dashboard</button
          ><br /><br />

          <button
            id="shiftManagement"
            type="button"
            @click="$router.push('/shifts')"
            style="font-size: 18px"
          >

            <font-awesome-icon icon="fa-briefcase" />&nbsp; &nbsp; Shift
            Management</button
          ><br /><br />

          <button
            id="employee"
            type="button"
            @click="$router.push('/employee')"
            style="font-size: 18px"
          >

            <font-awesome-icon icon="fa-solid fa-users" />&nbsp; &nbsp; Employee</button
          ><br /><br />

          <button
            id="settingsButton"
            type="button"
            @click="$router.push('/setting')"
            style="font-size: 18px"
          >
            <font-awesome-icon icon="fa-cog" />&nbsp; &nbsp; Settings
          </button>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
export default {
  data() {
    return {
      uid: "",
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
};
</script>

<style>
.navbar {
  width: 300px;
  height: 100%;
  float: left;
  padding-left: 30px;
  padding-right: 30px;
  font-family: "Gilroy-Light", sans-serif;
  font-weight: 800;
  font-size: 18px;
  line-height: 18px;
  background-color: white;
  min-height: 600px;
  margin-right: 1px;
}

#homeButton,
#availButton,
#timetableButton,
#settingsButton,
#dashboard,
#employee,
#shiftManagement {
  background-color: white;
  text-align: left;
  height: 45px;
  width: 100%;
  border: none;
  background: none;
  border-radius: 12px;
  transition-duration: 0.4s;
  cursor: pointer;
}

#homeButton:hover,
#availButton:hover,
#timetableButton:hover,
#settingsButton:hover,
#dashboard:hover,
#shiftManagement:hover,
#employee:hover {
  background-color: #f8d57e;
  height: 45px;
  width: 80%;
}
</style>
