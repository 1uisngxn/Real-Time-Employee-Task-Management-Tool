import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDrr9TxztX31dLlW_rj2Q50fzFKCMOn2zY",
  authDomain: "employee-management-23724.firebaseapp.com",
  projectId: "employee-management-23724",
  storageBucket: "employee-management-23724.firebasestorage.app",
  messagingSenderId: "1059122610185",
  appId: "1:1059122610185:web:3530825ccc9daac8d2b8d8",
  measurementId: "G-G2YFQF66NJ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
