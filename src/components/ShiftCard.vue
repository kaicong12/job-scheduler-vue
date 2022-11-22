<template>
  <div class="shift-card-wrapper">
    <h2 :class="branchclass">{{ branch }}</h2>
    <p>{{ title }}</p>
    {{ date }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      branchclass: this.branch.replace(/\s/g, ""),
    };
  },
  props: ["branch", "title", "date", "startTime", "endTime"],
};
</script>

<style scoped>
.shift-card-wrapper {
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  width: 250px;
  height: 150px;
  padding: 5px;
  text-align: center;
  background-color: #fbfbfd;
}

.shift-card-wrapper:hover {
  cursor: pointer;
}

h2 {
  margin-bottom: 0px;
}

.AngMoKioHub {
  background-color: rgb(244, 182, 187);
  border-radius: 10px;
}

.Junction8 {
  background-color: rgb(250, 224, 191);
  border-radius: 10px;
}

.BedokMall {
  background-color: rgb(255, 255, 193);
  border-radius: 10px;
}

.ClementiMall {
  background-color: rgb(201, 253, 205);
  border-radius: 10px;
}

.TampinesHub {
  background-color: rgb(194, 224, 252);
  border-radius: 10px;
}

.Westgate {
  background-color: rgb(180, 211, 178);
  border-radius: 10px;
}
</style>
