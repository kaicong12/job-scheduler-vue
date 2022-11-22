<template>
  <div class="employee-card-wrapper">
    <div class="display-picture">
      <img :src="profileImage" :alt="fullName">
    </div>
    <div class="worker-information">
      <p class="name"> {{ fullName }} </p>
      <p v-for="tag in tags" :class="tag" class="user-tag" :key="tag"> {{ methodTag(tag) }} </p>
      <p class="email-address"> {{ employee.emailAddress }} </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "EmployeeCard",
  props: {
    employee: Object,
    fullName: String,
    tags: Array,
  },
  data() {
    return {
      profileImage: this.getProfileLink()
    }
  },
  methods: {
    methodTag(tag) {
      if (tag === "none") {
        return "Missing Tag"
      } else {
        return tag
      }
    },
    getProfileLink() {
      if (this.employee.hasProfileImage) {
          return require(`@/assets/${this.employee.firstName}.svg`)
        } else {
          return require('@/assets/unknown.png')
        }
    }
  },
}
</script>

<style scoped>
  .employee-card-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #FBFBFD;
    border-radius: 10px;
    padding: 20px 10px 10px 10px;
    width: 200px;
  }

  .worker-information {
    text-align: center;
    padding: 0 20px;
    width: inherit;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .worker-information p {
    margin: 5px;
  }

  img {
    border-radius: 100%;
    width: 100px;
    height: 100px;
  }

  .name {
    font-weight: bold;
  }

  .user-tag {
    border-radius: 5px;
    font-weight: bold;
    padding: 3px;
    width: 200px;
  }

  .none {
    background-color: #F83262;
    color: white;
  }

  .email-address {
    font-size: 15px;
    overflow-wrap: normal;
  }
</style>