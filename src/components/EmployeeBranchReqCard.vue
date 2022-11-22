<template>
  <div v-if="show" class="req-card-wrapper">
    <div class="worker-information">
      <p class="name">{{ firstName }} {{ lastName }}</p>
      <p :class="branchClass" class="user-tag">{{ branch }}</p>
    </div>
    <div class="button-wrapper custom-action-row">
      <button
        class="action-button approve"
        type="button"
        @click="approveTagReq"
      >
        Approve
      </button>
      <button class="action-button reject" type="button" @click="rejectTagReq">
        Reject
      </button>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase";
import {
  deleteDoc,
  doc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "@firebase/firestore";
const dbBranchRequest = collection(db, "branchRequest");

export default {
  data() {
    return {
      show: true,
      branchID: "",
      branchClass: this.branch.replace(/\s/g, ''),
    };
  },
  props: ["firstName", "lastName", "branch", "id", "employeeID"],

  async mounted() {
    const q = query(collection(db, "branch"), where("name", "==", this.branch));
    getDocs(q).then((querySnap) => {
      querySnap.forEach((doc) => {
        this.branchID = doc.id;
      });
    });
  },

  methods: {
    async rejectTagReq() {
      await deleteDoc(doc(dbBranchRequest, this.id));
      alert("Tag request has been rejected!");
      this.show = false;
      this.$forceUpdate;
    },
    async approveTagReq() {
      try {
        const docRef = await addDoc(collection(db, "branchEmployee"), {
          employeeID: this.employeeID,
          branchID: this.branchID,
        });
        console.log("Document written with ID: ", docRef);
        await deleteDoc(doc(dbBranchRequest, this.id));
        alert("Branch request has been approved!");
        this.show = false;
        this.$forceUpdate;
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>
.req-card-wrapper {
  display: flex;
  flex-direction: column;
  background-color: #fbfbfd;
  border-radius: 10px;
  width: 300px;
  height: 150px;
  padding: 5px;
}

.shift-card-wrapper:hover {
  cursor: pointer;
}

h2 {
  margin-bottom: 0px;
}

.employee-card-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fbfbfd;
  border-radius: 10px;
  padding-top: 20px;
}

.name {
    font-weight: bold;
  }

.worker-information {
  text-align: center;
  width: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.worker-information p {
  margin: 5px;
}

.user-tag {
  border-radius: 5px;
  font-weight: bold;
  padding: 3px;
  width: 200px;
}

.approve {
  background-color: var(--yellow-tone-2);
}

.approve:hover {
  background-color: var(--yellow-tone-3);
}

.reject {
  background-color: #fbfbfd;
}

.reject:hover {
  background-color: antiquewhite;
}

.custom-action-row {
  margin-top: 20px;
  justify-content: center;
}

.AngMoKioHub {
  background-color: rgb(244, 182, 187);
}

.Junction8 {
  background-color: rgb(250, 224, 191);
}

.BedokMall {
  background-color: rgb(255, 255, 193);
}

.ClementiMall {
  background-color: rgb(201, 253, 205);
}

.TampinesHub {
  background-color: rgb(194, 224, 252);
}

.Westgate {
  background-color: rgb(180, 211, 178);
}
</style>