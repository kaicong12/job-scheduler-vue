<template>
  <div class="available-card-wrapper" 
      :class="[isActive ? 'active' : 'inactive']"
       @mouseover="this.isActive=true"
       @mouseleave="this.isActive=false"
  >
    <div class="display-picture">
      <img :src="displayPicture" :alt="shiftObj.title">
    </div>
    <font-awesome-icon class="available-tick" v-if="isAvailableForShift" icon="fa-solid fa-check" />
    <div class="available-information">
      <p class="title"> {{ shiftObj.title }} </p>
      <p class="date"> <span><font-awesome-icon icon="fa-calendar" class="fa-calendar" /></span>{{ shiftObj.date }} </p>
      <span class="date">
        <span><font-awesome-icon icon="fa-regular fa-clock" /></span>
        {{shiftObj.startTime}} - {{ shiftObj.endTime}}
      </span>
    </div>

<!--    Modal component-->
    <IndicateAvailability
      v-if="isActive"
      :employeeID="employeeID"
      :shiftID="shiftObj.id"
      :msg="this.isAvailableForShift ? 'Remove Availability' : 'Indicate Availability'"
      :action="this.isAvailableForShift? 'remove' : 'indicate'"
    />
  </div>
</template>


<script>
import IndicateAvailability from "@/modals/IndicateAvailability";
import {availability, unsubAvailable} from "@/db/Shift";
import {isAvailable} from "@/db/Availability";

export default {
  name: "AvailabilityCard",
  components: { IndicateAvailability },
  props: {
    shiftObj: Object,
    displayPicture: String,
    employeeID: String,
  },
  data() {
    return {
      unsubscribeListener: [unsubAvailable],
      availableShifts: availability,
      isActive: false,
      isAvailableForShift: false,
      availableForShift: [],
    }
  },
  unmounted() {
    this.unsubscribeListener.forEach((callback) => {
      callback()
    })
  },
  created() {
    const [unsubAvailability, availableForShift] = isAvailable(this.employeeID, this.shiftObj.id)
    this.availableForShift = availableForShift
    this.unsubscribeListener.push(unsubAvailability)
  },
  watch: {
    availableForShift(newValue) {
      this.isAvailableForShift = newValue.length > 0
    }
  }
}
</script>

<style scoped>
  .available-card-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 10px;
    width: 150px;
    padding: 10px;
    position: relative;
    height:180px;
  }
  .inactive {
    background-color: white;
  }
  .active {
    background-color: rgb(0, 0, 0, 0.2);
  }

  .available-tick {
    position: absolute;
    top: 20px;
    right: 30px;
    cursor: pointer;
  }

  .available-information {
    text-align: center;
    padding: 0 20px;
    width: inherit;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .available-information p {
    margin: 5px;
  }

  img {
    border-radius: 100%;
  }

  .title {
    font-weight: bold;
  }

  .date {
    font-size: 15px;
    display: flex;
    gap: 10px;

  }
</style>