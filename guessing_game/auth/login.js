// Import Firebase
import { auth, db } from "../firebase.js";

// Register User
function registerUser() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const age = document.getElementById("age").value;

    if (!name || !email || !age) {
        alert("All fields are required!");
        return;
    }

    auth.createUserWithEmailAndPassword(email, "password123")
        .then((userCredential) => {
            const user = userCredential.user;
            return db.collection("users").doc(user.uid).set({
                name: name,
                email: email,
                age: age,
            });
        })
        .then(() => {
            alert("Registration successful!");
            window.location.href = "category.html"; // Redirect to category selection
        })
        .catch((error) => {
            alert(error.message);
        });
}

// Login User
function signIn() {
    const email = document.getElementById("email").value;
    const password = "password123"; // For now, use a default password

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            alert("Login successful!");
            window.location.href = "category.html"; // Redirect to category selection
        })
        .catch((error) => {
            alert(error.message);
        });
}

// Logout User
function logout() {
    auth.signOut()
        .then(() => {
            alert("Logged out!");
            window.location.href = "index.html";
        })
        .catch((error) => {
            alert(error.message);
        });
}

// Check Auth State
auth.onAuthStateChanged((user) => {
    if (!user) {
        window.location.href = "index.html"; // Redirect if not logged in
    }
});
