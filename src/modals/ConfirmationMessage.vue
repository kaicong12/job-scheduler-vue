<template>
  <div class="popup-wrapper">
    <div class="white-background">
      <h3> {{ msg }} </h3>
      <div class="button-wrapper custom-action-row">
        <button class="action-button cancel-button" type="button" @click="$emit('closeMessage')">Cancel</button>
        <button class="action-button done" type="button" @click="$emit('confirmEdit')">Confirm</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ConfirmationMessage",
  props: ["msg"],
  emits: ["closeMessage", "confirmEdit"]
}
</script>

<style scoped>
  .popup-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 100;
    background-color: rgb(0, 0, 0, 0.2);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .white-background {
    background-color: white;
    width: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 10px;
  }

  .custom-action-row {
    justify-content: center;
    width: 300px;
  }
</style>