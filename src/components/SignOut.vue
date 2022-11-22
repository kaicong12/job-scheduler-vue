<template>
    <button @click="signout">Sign Out</button>
</template>

<script>
import firebaseApp from '../firebase.js';
import { getAuth, signOut } from "firebase/auth";

const auth = getAuth(firebaseApp);

export default {
    name: 'SignOut',
    methods: {
        signout() {
            signOut(auth).then(() => {
                this.$router.push('/');
            })
            .catch((error) => {
                alert(error);
            });
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
    width: 80px;
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