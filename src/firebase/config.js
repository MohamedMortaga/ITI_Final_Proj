import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDzUUKgvADh2XtOatPYcWt2umQbZSyiNF4",
  authDomain: "test-7b62c.firebaseapp.com",
  projectId: "test-7b62c",
  storageBucket: "test-7b62c.firebasestorage.app",
  messagingSenderId: "402993824560",
  appId: "1:402993824560:web:78f65da4e841a4446b3ef5"
};

let db;
try {
  // Initialize Firebase only if no apps are initialized
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  // Initialize Firestore
  db = getFirestore(app);
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

export { db };