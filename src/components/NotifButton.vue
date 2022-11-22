<template>
  <div class="wrapper">
    <p>{{ this.fname }}</p>
    <div class="profile"><MyProfile /></div>
    <div class="signout"><SignOut /></div>
  </div>
</template>

<script>
import { firebaseApp } from "../firebase.js";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import MyProfile from "@/components/MyProfile.vue";
import SignOut from "@/components/SignOut.vue";

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export default {
  name: "NotifButton",
  components: {
    MyProfile,
    SignOut,
  },
  data() {
    return {
      fname: "",
    };
  },
  created() {
    this.fetchItems();
  },
  methods: {
    async fetchItems() {
      const docSnap = await getDoc(doc(db, "employee", auth.currentUser.uid));
      if (docSnap.exists()) {
        this.fname = docSnap.data().firstName;
      } else {
        console.log("Document does not exist");
      }
    },
  },
};
</script>

<style scoped>
.wrapper {
  position: relative;
  right: 15px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  height: 100px;
  margin-top: 30px;
}

p {
  font-weight: bold;
  margin: 0 12px;
}

.profile {
  margin-bottom: -10px;
}
</style>
