<template>
        <h1 class="reset">Reset Password</h1>
        <br>
        <form id="reset" @submit.prevent="reset()">
            <label for="email">Email Address</label><br>
            <input 
                type="email"
                name="email"
                id="email"
                v-model="email"
                placeholder="someone@example.com" required 
            />
            <br><br>
            <button type="submit">Reset</button><br>
        </form>
</template>

<script>
import { auth } from '@/firebase.js';
import { sendPasswordResetEmail } from "firebase/auth";

export default {
    data() {
        return {
            email: "",
        }
    },
    methods: {
        reset() {
            sendPasswordResetEmail(auth, this.email)
            .then(() => {
                alert(
                    'A password reset email has been sent to the email address. Please check your email for the password reset link.'
                );
                this.$router.push('/');
                console.log('Email Sent');
            })
            .catch((error) => {
                if (error.code == "auth/invalid-email") {
                    alert(
                    "The email you entered is invalid. Please check your email and try again."
                    );
                } else if (error.code == "auth/user-not-found") {
                    alert(
                    "The email you entered does not appear to belong to an account. Please check your email and try again."
                    );
                }
            })
        }
    }
}
</script>

<style scoped>
h1 {
    font-family: sans-serif;
}
p {
    font-family: sans-serif;
    font-size: 16px;
}
.forgotPassword {
    font-size: 12px;
    margin-left: 180px;
}
.forgotPassword:hover {
  color: grey;
}
form {
    font-family: sans-serif;
}
label {
    font-size: 14px;
    font-weight: bold;
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
button {
    -webkit-appearance: none;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    height: 30px;
    width: 280px;
    background-color: #F8D57E;
    border-radius: 8px;
    border: none;
    cursor: pointer;
}
button:hover{
    background-color: #fcca4c;
}
button:active {
    opacity: 0.6;
    transform: translateY(3px);
}
</style>