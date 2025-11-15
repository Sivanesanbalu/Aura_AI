// lib/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDQkbjxu67aA7SS0yonV1t5fPAbPe4xgPM",
  authDomain: "auraai-59bc3.firebaseapp.com",
  projectId: "auraai-59bc3",
  storageBucket: "auraai-59bc3.firebasestorage.app",
  messagingSenderId: "533202262591",
  appId: "1:533202262591:web:2d9b46f9c674067f99768a",
  measurementId: "G-GV0MK554WQ"
};

// Initialize Firebase only once
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
