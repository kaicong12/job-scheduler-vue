the
<template>
  <div class="form-popup" id="resetPW">
    <form class="setting-pw" @submit.prevent="changePw">
      <label for="oldPW"><b>Old Password</b></label><br><br>
      <input
          type="oldPW"
          id="oldPW"
          required=""
          v-model="oldPW"
          placeholder="old password"
      /><br><br>

      <label for="newPW"><b>New Password</b></label><br><br>
      <input
          type="newPW"
          id="newPW"
          required=""
          v-model="newPW"
          placeholder="new password"
      /><br><br>

      <label for="cfmPW"><b>Confirm Password</b></label><br><br>
      <input
          type="cfmPW"
          id="cfmPW"
          required=""
          v-model="cfmPW"
          placeholder="Confirm new password"
      /><br><br><br><br>

      <button id="savebutton" type="submit">Save</button>
      <button id="cancelbutton" type="button">Cancel</button>
      <br><br>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      oldPW: "",
      newPW: "",
      cfmPW: "",
    }
  },
  methods: {
    changePw() {

    }
  }
}
</script>


<style scoped>
.setting-pw {
  position: fixed;
  justify-content: center;
  align-items: center;
  width: 40%;
  height: 50%;
  border: 3px solid #f1f1f1;
  z-index: 9;
}

#cancelbutton {
  background-color: white;
  border: groove;
  height: 45px;
  width: 120px;
  font-family: 'Gilroy-Light', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 18px;
  float: right;
  border-radius: 12px;
  transition-duration: 0.4s;
}

#cancelbutton:hover {
  background-color: lightgray;
}

#savebutton {
  background-color: #F8D57E;
  border: none;
  height: 45px;
  width: 120px;
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
</style>