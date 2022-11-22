<template>
  <div @click="this.$emit('toggleEmployee', this.workerType, this.workerID)" class="worker-wrapper">
    <div class="display-picture">
      <img class="display-picture" :src="displayPicture" alt="display-picture">
    </div>

    <div class="information-container">
      <h3> {{ fullName }} </h3>
      <div class="tag-container">
        <p v-for="tag in workerTags" :class="tag" class="user-tag" :key="tag"> {{ tag }} </p>
      </div>
    </div>

  </div>
</template>

<script>
import {getEmployee} from "@/db/Employee";
import {getTag} from "@/db/Tags";

export default {
  name: "ShiftWorkers",
  props: ["employee", "workerType"],
  emits: ["toggleEmployee"],
  data() {
    return {
      unsubscribeListener: [],
      workerID: this.employee,
      workerObj: {},
      workerTags: [],
      displayPicture: this.getProfileLink(),
    }
  },
  mounted() {
    const getDbEmployee = async () => {
      this.workerObj = await getEmployee(this.workerID)
      this.displayPicture = require(`@/assets/${this.workerObj.firstName}.svg`)
    }

    getDbEmployee()
    const [unsubTag, tags] = getTag(this.workerID)
    this.workerTags = tags
    this.unsubscribeListener.push(unsubTag)
  },
  unmounted() {
    this.unsubscribeListener.forEach((callback) => {
      callback()
    })
  },
  computed: {
    fullName() {
      return `${this.workerObj.firstName} ${this.workerObj.lastName}`
    },
  },
  methods: {
    getProfileLink() {
      if (this.employee.hasProfileImage) {
          return require(`@/assets/${this.employee.firstName}.svg`)
        } else {
          return require('@/assets/unknown.png')
        }
    }
  }
}
</script>

<style scoped>
.worker-wrapper {
  background-color: var(--grey-200);
  border-radius: 10px;
  padding: 3px 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
}

.worker-wrapper:hover {
  background-color: var(--grey-100);
}

.display-picture {
  border-radius: 100%;
  object-fit: cover;
  width: 70px;
}

.user-tag {
  border-radius: 5px;
  font-weight: bold;
  padding: 3px;
  width: 100px;
  text-align: center;
}

.tag-container {
  display: flex;
  flex-direction: row;
  gap: 10px;
}

.information-container {
  display: flex;
  flex-direction: column;
}

.information-container > * {
  margin: 0;
}
</style>