<template>
  <div class="card" :class="branch">
    <li>
      <b>{{ shift.branch }}</b> <br />
      <span>{{ shift.startTime }}hrs - {{ shift.endTime }}hrs</span>
    </li>
  </div>
</template>

<script>
export default {
  data() {
    return {
      branch: this.shift.branch.replace(/\s/g, '')
    }
  },
  props: {
    shift: {
      type: Object,
    },
  },
};
</script>

<style scoped>
.card {
  background-color: rgb(254, 206, 124);
  padding: 10px;
  border-radius: 5px;
  margin: 10px 0px 10px 0px;
  text-align: center;
  height: 50px;
  overflow: hidden;
}

.card span {
  font-size: 13px;
}

.AngMoKioHub {
  background-color: rgb(244, 182, 187);
  padding: 10px;
  border-radius: 5px;
  margin: 10px 0px 10px 0px;
}

.Junction8 {
  background-color: rgb(250, 224, 191);
  padding: 10px;
  border-radius: 5px;
  margin: 10px 0px 10px 0px;
}

.BedokMall {
  background-color: rgb(255,255,193);
  padding: 10px;
  border-radius: 5px;
  margin: 10px 0px 10px 0px;
}

.ClementiMall {
  background-color: rgb(201,253,205);
  padding: 10px;
  border-radius: 5px;
  margin: 10px 0px 10px 0px;
}

.TampinesHub {
  background-color: rgb(194,224,252);
  padding: 10px;
  border-radius: 5px;
  margin: 10px 0px 10px 0px;
}

.Westgate {
  background-color: rgb(180, 211, 178);
  padding: 10px;
  border-radius: 5px;
  margin: 10px 0px 10px 0px;
}

</style>