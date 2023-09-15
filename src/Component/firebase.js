import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Add this line to import getAuth
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage'; // Add this line to import getFirestore



const firebaseConfig = {
  apiKey: "AIzaSyAgf02O1ddNePNrANXGC4K-99UkmjtHd9I",
  authDomain: "inventory-management-37096.firebaseapp.com",
  projectId: "inventory-management-37096",
  storageBucket: "inventory-management-37096.appspot.com",
  messagingSenderId: "617658393212",
  appId: "1:617658393212:web:d3408e02449b453b0adff9",
  measurementId: "G-47ST510FSL"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage();

 export {app, auth, db,storage};