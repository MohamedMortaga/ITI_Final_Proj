import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyDzUUKgvADh2XtOatPYcWt2umQbZSyiNF4",
  authDomain: "test-7b62c.firebaseapp.com",
  projectId: "test-7b62c",
  storageBucket: "test-7b62c.firebasestorage.app",
  messagingSenderId: "402993824560",
  appId: "1:402993824560:web:78f65da4e841a4446b3ef5"
};

initializeApp(firebaseConfig);

const db = getFirestore();
const auth = getAuth();

export { db , auth };