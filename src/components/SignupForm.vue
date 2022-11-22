<template>
        <p class="login">Have an account? Sign in <router-link to="/">here</router-link>!</p>
        <h1 class="signup">Sign Up</h1>
        <br>
        <form id="signup" @submit.prevent="signup()">
            <label for="profilePic">Profile Picture</label><br>
            <UploadImage /><br>
            <label for="email">Email Address</label><br>
            <input 
                type="email"
                name="email"
                id="email"
                v-model="email"
                placeholder="someone@example.com" required 
            />
            <br><br>
            <label for="fullname">Full Name</label><br>
            <input 
                type="text"
                name="fname"
                id="fname"
                v-model="fname"
                placeholder="First Name"
                required
            />
            <input 
                type="text"
                name="lname"
                id="lname"
                v-model="lname"
                placeholder="Last Name"
                required
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
            <br><br>
            <label for="password">Confirm Password</label><br>
            <input 
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                v-model="confirmPassword"
                placeholder="Re-enter your password"
                required
            />
            <br><br>

            <button type="submit">Sign Up</button><br>
        </form>
</template>

<script>
import { auth, db } from '@/firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import UploadImage from './UploadImage.vue'
import { doc, setDoc } from "firebase/firestore";

export default {
    data() {
        return {
            email: "",
            fname: "",
            lname: "",
            password: "",
            confirmPassword: ""
        }
    },
    methods: {
        signup() {
            if (this.password.length < 6) {
                alert(
                    "Password must contain at least 6 characters. Please check your password and try again."
                    );
            } else if (this.password !== this.confirmPassword) {
                alert(
                    "Passwords do not match. Please check your password and try again."
                    );
            } else {
                createUserWithEmailAndPassword(auth, this.email, this.password)
                .then((cred) => {
                    if (this.password !== this.confirmPassword) {
                        throw new Error();
                    } else {
                        alert("Successfully signed up!");
                        this.registerUser(cred.user.uid);
                        this.$router.push({path: '/'});
                    }
                })
                .catch((error) => {
                    if (error.code === "auth/invalid-email") {
                    alert(
                        "The email you entered is invalid. Please check your email and try again."
                        );
                    } else if (error.code === "auth/email-already-in-use") {
                    alert(
                        "Email already exists. Please enter a different email and try again."
                        );
                    }
                });
            }
        },
        async registerUser(userID) {
          await setDoc(doc(db, "employee", userID), {
              employeeID: auth.currentUser.uid,
              firstName: this.fname,
              lastName: this.lname,
              emailAddress: this.email,
              hasProfileImage: false,
            });
        }
    },
    components: {
        UploadImage
    }
}
</script>

<style scoped>
h1 {
    font-family: sans-serif;
    margin-bottom: 0;
}
p {
    font-family: sans-serif;
    font-size: 16px;
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
#fname {
    height: 30px;
    width: 135px;
    margin-right: 10px;
}
#lname {
    height: 30px;
    width: 135px;
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