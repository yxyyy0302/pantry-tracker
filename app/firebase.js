// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getFirestore} from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjcjEwNBES445BgdX1Z6JkbRRDVoKqtz4",
  authDomain: "xinyu-yang-pantry-tracker.firebaseapp.com",
  projectId: "xinyu-yang-pantry-tracker",
  storageBucket: "xinyu-yang-pantry-tracker.appspot.com",
  messagingSenderId: "327007678851",
  appId: "1:327007678851:web:6a99c8078bdf3628c806b6",
  measurementId: "G-CNTRDN83KV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);