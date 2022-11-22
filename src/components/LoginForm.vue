<template>
        <h1 class="signin">Sign In</h1>
        <br>
        <p class="register1">If you don't have an account registered,</p>
        <br>
        <p class="register2">you can register <router-link to="/signup">here</router-link>!</p>
        <br>
        <form id="login" @submit.prevent="login()">
            <label for="email">Email Address</label><br>
            <input 
                type="email"
                name="email"
                id="email"
                v-model="email"
                placeholder="someone@example.com" required 
            />
            <br><br>
            <label for="password">Password</label><br>
            <input 
                type="password"
                name="password"
                id="password"
                v-model="password"
                placeholder="Enter your password"
                required
            />
            <br>
            <p class="forgotPassword"><router-link to="/forgotpassword">Forgot Password?</router-link></p>
            <button type="submit">Sign In</button><br>
        </form>
</template>

<script>
import { auth } from '@/firebase.js';
import { signInWithEmailAndPassword } from "firebase/auth";

export default {
    data() {
        return {
            email: "",
            password: "",
        }
    },
    methods: {
        login() {
            signInWithEmailAndPassword(auth, this.email, this.password)
            .then(() => {
                if (auth.currentUser.uid === '42vuID5nKWMVL1mODCKyqaoVL7s1') {
                    console.log("Employer Login")
                    this.$router.push('/employerdashboard');
                } else {
                    console.log("Employee Login")
                    this.$router.push('/availability');
                }
            })
            .catch((error) => {
                if (error.code === "auth/invalid-email") {
                    alert(
                    "The email you entered is invalid. Please check your email and try again."
                    );
                } else if (error.code === "auth/user-not-found") {
                    alert(
                    "The email you entered does not appear to belong to an account. Please check your email and try again."
                    );
                } else if (error.code == "auth/wrong-password") {
                    alert(
                    "Incorrect password. Please check your password and try again."
                    );
                }
            })
        },
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
.register1 {
    margin-top: -10px;
}
.register2 {
    margin-top: -30px;
    margin-bottom: 10px;
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
    margin-top: 7px;
    width: 280px;
    box-sizing: border-box;
    padding: 7px 12px 6px 12px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    overflow: hidden;
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
a {
  color: black;
}
a:hover {
  color: grey;
}
</style>