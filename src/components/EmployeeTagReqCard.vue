<template>
  <div v-if="show" class="req-card-wrapper">
    <div class="worker-information">
      <p class="name">{{ firstName }} {{ lastName }}</p>
      <p :class="tagName" class="user-tag">{{ tagName }}</p>
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
import { deleteDoc, doc, collection, addDoc } from "@firebase/firestore";
const dbTagRequest = collection(db, "tagRequest");

export default {
  data() {
    return {
      show: true,
    };
  },
  props: ["firstName", "lastName", "tagName", "id", "employeeID"],
  methods: {
    async rejectTagReq() {
      await deleteDoc(doc(dbTagRequest, this.id));
      alert("Tag request has been rejected!");
      this.show = false;
      this.$forceUpdate;
    },
    async approveTagReq() {
      try {
        const docRef = await addDoc(collection(db, "employeeTag"), {
          employeeID: this.employeeID,
          tagName: this.tagName,
        });
        console.log("Document written with ID: ", docRef);
        await deleteDoc(doc(dbTagRequest, this.id));
        alert("Tag request has been approved!");
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
</style>