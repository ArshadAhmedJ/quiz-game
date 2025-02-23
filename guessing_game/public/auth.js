// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { 
    getFirestore, 
    collection, 
    doc, 
    setDoc, 
    getDoc, 
    query, 
    where, 
    getDocs, 
    orderBy 
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Firebase config (Replace with your actual credentials)
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

// ✅ Register User
async function registerUser() {
    const name = document.getElementById("name").value;
    const username = document.getElementById("username").value;
    const age = document.getElementById("age").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!name || !username || !age || !email || !password) {
        alert("All fields are required!");
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
            name: name,
            username: username,
            age: age,
            email: email,
            uid: user.uid,
            level: 1,
            points: 0
        });

        window.location.href = "category.html"; // Redirect to login page
    } catch (error) {
        alert("Error: " + error.message);
    }
}

// ✅ Login User
async function loginUser() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) {
        alert("Please enter username and password!");
        return;
    }

    try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            alert("Username not found!");
            return;
        }

        const userData = querySnapshot.docs[0].data();
        const email = userData.email;

        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "category.html"; // Redirect to profile page
    } catch (error) {
        alert("Error: " + error.message);
    }
}

// ✅ Logout
function logout() {
    signOut(auth)
        .then(() => {
            window.location.href = "index.html"; // Redirect to login page
        })
        .catch((error) => {
            alert("Error: " + error.message);
        });
}

// ✅ Load User Data (Profile, Levels, Points)
async function loadUserData() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                document.getElementById("userName").textContent = userData.username;
                document.getElementById("userLevel").textContent = "Level: " + userData.level;
                document.getElementById("userPoints").textContent = "Points: " + userData.points;
            } else {
                alert("User data not found!");
            }
        } else {
            window.location.href = "index.html"; // Redirect if not logged in
        }
    });
}

// ✅ Load Leaderboard Data
async function loadLeaderboard() {
    const leaderboardTable = document.getElementById("leaderboard");
    leaderboardTable.innerHTML = ""; // Clear existing content

    try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, orderBy("points", "desc"), orderBy("level", "desc"));
        const querySnapshot = await getDocs(q);

        let rank = 1;
        querySnapshot.forEach((doc) => {
            const userData = doc.data();
            const row = `
                <tr>
                    <td>${rank}</td>
                    <td>${userData.username}</td>
                    <td>${userData.level}</td>
                    <td>${userData.points}</td>
                </tr>
            `;
            leaderboardTable.innerHTML += row;
            rank++;
        });
    } catch (error) {
        console.error("Error loading leaderboard:", error);
    }
}
async function loadUserProfile() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();

                document.getElementById("profile-name").textContent = userData.name;
                document.getElementById("profile-username").textContent = userData.username;
                document.getElementById("profile-level").textContent = "Level: " + userData.level;
                document.getElementById("profile-points").textContent = "Points: " + userData.points;
            }
        } else {
            window.location.href = "index.html"; // Redirect if not logged in
        }
    });
}
// ✅ Attach functions to window
window.registerUser = registerUser;
window.loginUser = loginUser;
window.logout = logout;
window.loadUserProfile = loadUserProfile;
window.loadUserData = loadUserData;
window.loadLeaderboard = loadLeaderboard;
