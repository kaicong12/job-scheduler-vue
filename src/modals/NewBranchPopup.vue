<template>
<div class="information-wrapper">
    <div class="new-branch-popup">
    <h1 class="new-branch">New Branch</h1>
    <br>
    <form id="new-branch" @submit.prevent="signup()">
        <label for="name">Name</label><br>
        <input 
            type="text"
            name="name"
            id="name"
            v-model="name"
            placeholder="Branch Name" required
        />
        <br><br>
        <label for="address">Address</label><br>
        <input 
            type="text"
            name="address1"
            id="address1"
            v-model="address1"
            placeholder="Address Line 1" required
        /><br>
        <input 
            type="text"
            name="address2"
            id="address2"
            v-model="address2"
            placeholder="Address Line 2" required
        /><br>
        <input 
            type="text"
            name="address3"
            id="address3"
            v-model="address3"
            placeholder="Address Line 3" required
        />
        <br><br>
        <button class="cancel" @click="this.$emit('toggleNewBranchPopup')">Cancel</button>
        <button type="submit" class="publish">Publish</button><br>
    </form>
    </div>
</div>
</template>

<script>
export default {
    name:'NewBranch',
    emits: ["toggleNewBranchPopup"],
    data() {
        return {
            name: "",
            address1: "",
            address2: "",
            address3: ""
        }
    },
}
</script>

<style scoped>
.information-wrapper {
    z-index: 99;
    background-color: rgb(0, 0, 0, 0.2);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}
.new-branch-popup { 
    background-color: white;
    border-radius: 20px;
    width: 50%;
    height: 300px;
    gap: 20px;
    padding: 30px;
    width: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
}
h1 {
    margin-bottom: 0px;
}
label {
    font-size: 14px;
    font-weight: bold;
}
#address1 {
    margin-bottom: 10px;
}
#address2 {
    margin-bottom: 10px;
}
input {
    -webkit-appearance: none;
    font-size: 14px;
    height: 30px;
    width: 280px;
    box-sizing: border-box;
    border-color: lightgray;
    border-radius: 8px;
    border-width: 1px;
}
input:focus {
    border-color: black;
}
.cancel:hover{
    background-color: #cfd7e3;
}
.publish:hover{
    background-color: #fcca4c;
}
button:active {
    opacity: 0.6;
    transform: translateY(3px);
}
.cancel {
    height: 30px;
    width: 135px;
    margin-right: 10px;
    -webkit-appearance: none;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    background-color: white;
    border-radius: 8px;
    border-color: black;
    border-width: 1px;
    cursor: pointer;
}
.publish {
    height: 30px;
    width: 135px;
    -webkit-appearance: none;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    background-color: #F8D57E;
    border-radius: 8px;
    border: none;
    cursor: pointer;
}
</style>