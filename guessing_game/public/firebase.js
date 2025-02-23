// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyDmN7FLRKv0XBQfW6vsjQu0oQgK4zmS3BE",
    authDomain: "guessing-game-d385c.firebaseapp.com",
    projectId: "guessing-game-d385c",
    storageBucket: "guessing-game-d385c.firebasestorage.app",
    messagingSenderId: "1051691476467",
    appId: "1:1051691476467:web:ba53f004a1dfc1d6c99e86",
    measurementId: "G-2TFRG377NT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Make them globally available
window.auth = auth;
window.db = db;
window.createUserWithEmailAndPassword = createUserWithEmailAndPassword;
window.signInWithEmailAndPassword = signInWithEmailAndPassword;
window.signOut = signOut;
window.setDoc = setDoc;
window.doc = doc;
