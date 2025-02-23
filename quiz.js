// ✅ Import Firebase Dependencies
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// ✅ Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDmN7FLRKv0XBQfW6vsjQu0oQgK4zmS3BE",
    authDomain: "guessing-game-d385c.firebaseapp.com",
    projectId: "guessing-game-d385c",
    storageBucket: "guessing-game-d385c.firebasestorage.app",
    messagingSenderId: "1051691476467",
    appId: "1:1051691476467:web:ba53f004a1dfc1d6c99e86",
    measurementId: "G-2TFRG377NT"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ✅ Trivia API Setup
const API_URL = "https://opentdb.com/api.php?amount=10&type=multiple";
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let current = 0;
let userLevel = 1;
let userId = null; // Store the logged-in user ID

// ✅ Check if User is Logged In & Load Previous Score
onAuthStateChanged(auth, async (user) => {
    if (user) {
        userId = user.uid;
        console.log("User logged in:", userId);
        await loadUserScore();
    } else {
        console.log("No user logged in.");
    }
});

// ✅ Fetch Questions from API
async function fetchQuestions(category, retries = 3, delay = 2000) {
    let url = `${API_URL}&category=${getCategoryId(category)}`;

    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            let response = await fetch(url);
            if (!response.ok) {
                if (response.status === 429) {
                    console.warn(`Too many requests. Retrying in ${delay / 1000} seconds...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }
                throw new Error(`API Error: ${response.status}`);
            }

            let data = await response.json();
            if (!data.results || data.results.length === 0) throw new Error("No questions found.");

            questions = data.results;
            currentQuestionIndex = 0;
            showQuestion();
            return;

        } catch (error) {
            console.error(`Error fetching questions (Attempt ${attempt + 1}):`, error);
            if (attempt === retries - 1) alert("Failed to load questions. Please try again later.");
        }
    }
}

// ✅ Map Category Names to API Categories
function getCategoryId(category) {
    const categoryMap = {
        "history": 23,
        "islam": 20,  
        "biology": 17
    };
    return categoryMap[category] || 9; // Default: General Knowledge
}

// ✅ Display Question
function showQuestion() {
    if (!questions || questions.length === 0) {
        alert("No questions available. Please try again later.");
        return;
    }

    if (currentQuestionIndex >= questions.length) {
        alert(`Game Over! Your score: ${current}`);
        saveUserScore();
        window.location.href = "category.html";
        return;
    }

    let questionData = questions[currentQuestionIndex];
    document.getElementById("question").innerHTML = decodeHtml(questionData.question);

    let answers = [...questionData.incorrect_answers, questionData.correct_answer];
    answers.sort(() => Math.random() - 0.5); // Shuffle answers

    document.getElementById("options").innerHTML = answers.map(option => 
        `<button class="option" onclick="checkAnswer(this, '${option}', '${questionData.correct_answer}')">${decodeHtml(option)}</button>`
    ).join('');

    updateProgress();
}

// ✅ Fix updateProgress() Error (Check if Element Exists)
function updateProgress() {
    let progressBar = document.getElementById("progress");
    if (progressBar) {
        let progress = ((currentQuestionIndex + 1) / questions.length) * 100;
        progressBar.style.width = `${progress}%`;
    }
}

// ✅ Decode HTML Entities in API Response
function decodeHtml(html) {
    let txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

// ✅ Check Answer and Update Score
window.checkAnswer = function(button, selected, correct) {
    let buttons = document.querySelectorAll(".option");
    buttons.forEach(btn => btn.disabled = true);

    if (selected === correct) {
        score += 1;
        current += 1;
        button.style.backgroundColor = "green";
    } else {
        button.style.backgroundColor = "red";
    }

    setTimeout(() => {
        currentQuestionIndex++;
        showQuestion();
        updateUserProgress();
        saveUserScore();
    }, 1000);
};

// ✅ Update User Progress
function updateUserProgress() {
    document.getElementById("userPoints").innerText = score;
    let newLevel = Math.floor(score / 10) + 1;
    if (newLevel > userLevel) {
        userLevel = newLevel;
        document.getElementById("userLevel").innerText = userLevel;
    }
}

// ✅ Save User Score to Firebase
async function saveUserScore() {
    if (!userId) return;

    try {
        let userRef = doc(db, "users", userId);
        await setDoc(userRef, { points: score, level: userLevel }, { merge: true });
        console.log("User score saved successfully.");
    } catch (error) {
        console.error("Error saving score:", error);
    }
}

// ✅ Load User Score from Firebase
async function loadUserScore() {
    if (!userId) return;

    try {
        let userRef = doc(db, "users", userId);
        let docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
            let data = docSnap.data();
            score = data.points || 0;
            userLevel = data.level || 1;

            document.getElementById("userPoints").innerText = score;
            document.getElementById("userLevel").innerText = userLevel;
            console.log("User score loaded:", data);
        }
    } catch (error) {
        console.error("Error loading user score:", error);
    }
}

// ✅ Start Quiz
export function startGame(category) {
    fetchQuestions(category);
}

window.nextQuestion = function () {
    currentQuestionIndex++;
    showQuestion();
};