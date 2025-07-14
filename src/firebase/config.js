import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDzUUKgvADh2XtOatPYcWt2umQbZSyiNF4",
  authDomain: "test-7b62c.firebaseapp.com",
  projectId: "test-7b62c",
  storageBucket: "test-7b62c.appspot.com",
  messagingSenderId: "402993824560",
  appId: "1:402993824560:web:78f65da4e841a4446b3ef5"
}

// prevent re-initialization
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

const db = getFirestore(app)
const auth = getAuth(app)

export { db, auth }
