// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ import storage

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlzd1kb8l9Eq64GTqPfFDowclb2YEJ084",
  authDomain: "srinivasapallapu9.firebaseapp.com",
  projectId: "srinivasapallapu9",
  storageBucket: "srinivasapallapu9.appspot.com", 
  messagingSenderId: "87359833705",
  appId: "1:87359833705:web:cc8c2f34644dc0e4b444f8"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // ✅ export storage
