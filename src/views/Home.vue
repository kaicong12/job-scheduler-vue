<template>
  <NavBar />
</template>
<script>
import { ref } from "vue";
import firebaseApp from "../firebase.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBar from "../components/NavBar.vue";

const auth = getAuth(firebaseApp);
const isLoggedIn = ref(true);

onAuthStateChanged(auth, function (user) {
  if (user) {
    isLoggedIn.value = true;
  } else {
    isLoggedIn.value = false;
  }
});

export default {
  data() {
    return {};
  },
  components: { NavBar },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#appName {
  padding-top: 50px;
  padding-bottom: 50px;
  font-family: "Gilroy-Regular", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 100%;
}
</style>
