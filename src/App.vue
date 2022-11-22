<template>
  <router-view/>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
#app {
  font-family: 'Poppins', sans-serif;
  --yellow-tone-1: #F9EBC9;
  --yellow-tone-2: #F8D57E;
  --yellow-tone-3: #FFB100;
  --grey-100: #e4e9f0;
  --grey-200: #cfd7e3;
  --grey-300: #b5c0cd;
  --grey-800: #3e4e63;
  --grid-gap: 1px;
  --day-label-size: 20px;
}

:root {
  --ms-tag-font-weight: 500;
  --ms-tag-bg: #F8D57E;
  --ms-tag-color: black;
  --ms-option-bg-pointed: #F9EBC9;
  --ms-ring-color: #F9EBC9;
}

body {
  padding: 0;
  margin: 0;
}

/* input boxes to have the same font size */
input {
  font-family: inherit;
  font-size: inherit;
}

/* employee tags class to be used in employee card */
.Barista {
  background-color: #787161;
  color: white;
}

ol,
li {
  padding: 0;
  margin: 0;
  list-style: none;
}

.calendar-month-header {
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  padding: 10px;
}

.Cashier {
  background-color: black;
  color: white;
}

.Clerk {
  background-color: #FFB100;
  color: black;
}

/* action buttons CSS */
.custom-action-row {
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-direction: row;
}

.action-button {
    display: block;
    border-radius: 10px;
    padding: 10px 10px;
    margin: 10px;
    cursor: pointer;
    font-family: 'Poppins', sans-serif;
    /*width: 30%;*/
}

.done {
  background-color: var(--yellow-tone-2);
}
</style>
