// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {getFirestore} from "firebase/firestore";
import { getAuth , GoogleAuthProvider,RecaptchaVerifier, signInWithPhoneNumber} from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBEk9ezFpipiaIAakaV6chWeUu8avEur28",
  authDomain: "mind-mirror-ce46d.firebaseapp.com",
  projectId: "mind-mirror-ce46d",
  storageBucket: "mind-mirror-ce46d.firebasestorage.app",
  messagingSenderId: "200341457865",
  appId: "1:200341457865:web:c88e0795ecd2861f28b618",
  measurementId: "G-31M73Q7GXE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const recaptchaVerifier = RecaptchaVerifier;
export const SignInWithPhoneNumber = signInWithPhoneNumber;
