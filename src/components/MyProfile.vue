<template>
    <button @click="myprofile">My Profile</button>
</template>

<script>
export default {
    name: 'MyProfile',
    methods: {
        myprofile() {
            this.$router.push('/setting');
        }
    }
}
</script>

<style scoped>
button {
    -webkit-appearance: none;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    height: 30px;
    width: 90px;
    background-color: transparent;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    color: #FFB100;
}
button:hover{
    background-color: transparent;
    color: grey;
}
button:active {
    opacity: 0.6;
    transform: translateY(3px);
}
</style>