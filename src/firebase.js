import { initializeApp } from 'firebase/app';
import {getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyBwT7mzK-SZdOHvvx2ECPqd7f_iLnHOej0",
  authDomain: "bt3103-job-scheduler.firebaseapp.com",
  projectId: "bt3103-job-scheduler",
  storageBucket: "bt3103-job-scheduler.appspot.com",
  messagingSenderId: "649357689559",
  appId: "1:649357689559:web:c793e04be2bcc7ac15e692",
  measurementId: "G-W9PLYBCNKC"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export { auth, db };