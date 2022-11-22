<template>
  <div v-if="!auth">
    NOT AUTHORISED
  </div>
  <div v-else>
    <NotifButton/>
  <NavBar />
  <h1>User Profile</h1>
  <div class="setting">
    <div class="setting-item">
      <h4 class="userTitle"><b>User Information</b></h4>
      <h4 class="userDescrip">Enter your personal information below. <br> You can change it anytime you want. </h4>
      <form id="userForm" @submit.prevent="updateProfile">
        <label for="email"><b>Email Address</b></label><br><br>
        <input
            type="text"
            id="email"
            required=""
            v-model="employee.emailAddress"
        /><br>

        <label for="fullName"><b>Full Name</b> </label><br><br>
        <input
            type="text"
            id="fname"
            required=""
            v-model="employee.firstName"
            placeholder="First Name"
        /> &nbsp;&nbsp;
        <input
            type="text"
            id="lname"
            required=""
            v-model="employee.lastName"
            placeholder="Last Name"
        /><br>

        <label for="contactInfo"><b>Contact Information</b></label><br><br>
        <input
            type="text"
            id="contactNo"
            required=""
            v-model="employee.contactNo"
            placeholder="Mobile No."
        /><br>

        <label for="address"><b>Address</b></label><br><br>
        <input
            type="text"
            id="address"
            required=""
            v-model="employee.address1"
            placeholder="address1"
        />
        <input
            type="text"
            id="address"
            required=""
            v-model="employee.address2"
            placeholder="address2"
        />
        <input
            type="text"
            id="address"
            required=""
            v-model="employee.address3"
            placeholder="address3"
        /><br>
        <input type="button" @click="updateProfile" value="Save Changes" id="savebutton">
      </form>
    </div>

    <div class="setting-item">
      <div class="userCard">
        <img class="userImage" :src="getProfileLink" style="width:168px;height:168px;">
        <h1 class="userName">{{ employee.firstName }} {{ employee.lastName }}</h1>
        <div class="tagList">
          Tags:
          <div class="tag-container">
            <span :class="tag" class="user-tag" v-for="tag in assignedTag" :key="tag"> {{ tag }}</span>
          </div>
        </div>
        <div class="branchList">
          Branches:
          <div class="branch-container">
            <span :class="branch" class="user-tag" v-for="branch in assignedBranch" :key="branch"> {{ branch }}</span>
          </div>
        </div>
        <form id="cardForm">
          <button id="requestbutton" type="button" @click="this.tagRequest=true">Request Tag/Branches</button>
          <br>
          <button id="resetbutton" type="button">Reset Password</button>
          <br><br>
        </form>
      </div>
    </div>
  </div>

<!--  Modal component-->
  <TagRequest
    v-if="tagRequest"
    :employeeID="employeeID"
    @togglePopup="this.tagRequest=false"
    @sendRequest="sendRequest"
  />

  <ConfirmationMessage
    v-if="requestSent"
    msg="Your request has been sent"
    @closeMessage="this.requestSent=false"
    @confirmEdit="this.requestSent=false"
  />
  </div>
</template>
<script>
import {db} from "@/firebase"
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {doc, updateDoc} from "firebase/firestore";
import {unsubBranch, branches, fetchBranchAssignment, getEmployee} from "@/db/Employee";
import {getTag} from "@/db/Tags";

import NotifButton from "@/components/NotifButton";
import TagRequest from "@/modals/TagRequest";
import ConfirmationMessage from "@/modals/ConfirmationMessage";
import NavBar from "../components/NavBar.vue";


export default {
  name: "SettingDefault",
  components: {NotifButton, TagRequest, ConfirmationMessage, NavBar},
  data() {
    return {
      employeeID: '',
      employee: {},
      branches: branches,
      assignedTag: [],
      assignedBranch: [],
      unsubscribeListener: [unsubBranch],
      tagRequest: false,
      requestSent: false,
      profileLink: "",
      auth: false
    }
  },
  methods: {
    async updateProfile() {
      const employeeRef = doc(db, "employee", this.employeeID);
      const updateData = {
        emailAddress: this.employee.emailAddress,
        firstName: this.employee.firstName,
        lastName: this.employee.lastName,
      }

      if (this.employee.contactNo !== undefined) {
        updateData["contactNo"] = this.employee.contactNo
      }
      if (this.employee.address1 !== undefined) {
        updateData["address1"] = this.employee.address1
      }
      if (this.employee.address2 !== undefined) {
        updateData["address2"] = this.employee.address2
      }
      if (this.employee.address3 !== undefined) {
        updateData["address3"] = this.employee.address3
      }

      await updateDoc(employeeRef, updateData);
    },
    sendRequest() {
      this.tagRequest = false
      this.requestSent=true
    }
  },
  computed: {
    getProfileLink() {
      if (this.employee.hasProfileImage) {
        return require(`@/assets/${this.employee.firstName}.svg`)
      } else {
        return require('@/assets/unknown.png')
      }
    }
  },
  unmounted() {
    this.unsubscribeListener.forEach((callback) => {
      callback()
    })
  },
  async created() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.auth = true;
      }
    });
    const user = auth.currentUser;
    this.employee = await getEmployee(user.uid)
    this.employeeID = user.uid

    const branchOptions = this.branches.map((branch) => {
      return {'id': branch.id, 'value': branch.name}
    })

    if (this.employeeID !== undefined) {
      const [unsubscribe, assignedBranch] = fetchBranchAssignment(user.uid, branchOptions)
      this.unsubscribeListener.push(unsubscribe)
      this.assignedBranch = assignedBranch
    }

    const [unsubTags, tags] = getTag(user.uid)
    this.assignedTag = tags
    this.unsubscribeListener.push(unsubTags)

    this.profileLink = `@/assets/${this.employee.firstName}.svg`
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.setting {
  display: flex;
}

h1 {
  margin-bottom: 0
}

img {
  border-radius: 100%;
}

.setting-item {
  width: 40%;
  height: 100%;
}

.userTitle {
  font-family: 'Gilroy-Regular', sans-serif;
  font-weight: 800;
  font-size: 20px;
  line-height: 18px;
  text-align: left;
}

.userDescrip {
  font-family: 'Gilroy-Regular', sans-serif;
  font-weight: 300;
  font-size: 14px;
  line-height: 18px;
  padding-bottom: 30px;
  text-align: left;
}

#userForm {
  font-family: 'Gilroy-Regular', sans-serif;
  font-weight: 800;
  font-size: 18px;
  line-height: 18px;
  padding-bottom: 50px;
  text-align: left;
}

#email, #contactNo {
  height: 45px;
  width: 380px;
  border: groove;
  margin-bottom: 30px;
  font-family: 'Gilroy-Light', sans-serif;
  font-weight: 200;
  font-size: 16px;
  border-radius: 12px;
  line-height: 18px;
}

#address {
  height: 45px;
  width: 380px;
  border: groove;
  margin-bottom: 20px;
  font-family: 'Gilroy-Light', sans-serif;
  font-weight: 200;
  font-size: 16px;
  border-radius: 12px;
  line-height: 18px;
}

#fname, #lname {
  height: 45px;
  width: 175px;
  border: groove;
  margin-bottom: 30px;
  font-family: 'Gilroy-Light', sans-serif;
  font-weight: 200;
  font-size: 16px;
  border-radius: 12px;
  line-height: 18px;
}

#savebutton {
  background-color: #F8D57E;
  border: none;
  height: 45px;
  width: 140px;
  font-family: 'Gilroy-Light', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 18px;
  float: right;
  border-radius: 12px;
  transition-duration: 0.4s;
  margin-left: 30px;
}

#savebutton:hover {
  background-color: #c1931d;
}

.userCard {
  margin-top: 60px;
  margin-left: 30px;
  background-color: #FAFAFA;
}

.userImage {
  margin-top: 25px;
  margin-bottom: 25px;
}

.userName {
  font-family: 'Gilroy-Light', sans-serif;
  font-weight: 800;
  font-size: 26px;
  line-height: 18px;
  margin-bottom: 25px;
}

p {
  font-family: 'Gilroy-Light', sans-serif;
  font-weight: 800;
  font-size: 16px;
  line-height: 18px;
}

#requestbutton {
  background-color: white;
  border: groove;
  height: 45px;
  width: 240px;
  font-family: 'Gilroy-Light', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 18px;
  border-radius: 12px;
  transition-duration: 0.4s;
  margin-top: 15px;
  margin-bottom: 15px;
  cursor: pointer;
}

#requestbutton:hover {
  background-color: lightgray;
}

#resetbutton {
  background-color: #F8D57E;
  border: none;
  height: 45px;
  width: 240px;
  font-family: 'Gilroy-Light', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 18px;
  border-radius: 12px;
  transition-duration: 0.4s;
}

#resetbutton:hover {
  background-color: #c1931d;
}

.userCard {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tagList, .branchList {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.user-tag {
  border-radius: 5px;
  font-weight: bold;
  padding: 3px 10px;
  text-align: center;
  background-color: #FFB100;
}

.branchList {
  margin-top: 10px;
}

.branch-container > *, .tag-container > * {
  margin: 0 10px
}
</style>
  