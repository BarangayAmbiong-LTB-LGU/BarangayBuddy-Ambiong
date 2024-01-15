import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";


const firebaseConfig = {
  apiKey: "AIzaSyCGeVx4ZmZPMXjeBR71lHbxVy8i-4gD9uQ",
  authDomain: "barangaybuddy.firebaseapp.com",
  databaseURL: "https://barangaybuddy-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "barangaybuddy",
  storageBucket: "barangaybuddy.appspot.com",
  messagingSenderId: "107104492368",
  appId: "1:107104492368:web:8896aec25ca1838cefaa55"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Reference to the 'Suggestions' node
const suggestionsRef = ref(database, 'Suggestions');

// Function to display suggestions
function displaySuggestions() {
    onValue(suggestionsRef, (snapshot) => {
        const suggestionsContainer = document.getElementById('suggestionsContainer');

        // Clear existing suggestions
        suggestionsContainer.innerHTML = '';

        // Iterate through the suggestions and display them
        snapshot.forEach((childSnapshot) => {
            const suggestion = childSnapshot.val();
            const suggestionHtml = `
    
<div class="main-card">
<div class="card">
    <div class="card-inner">
        <a>
        <div class="text-primary"><strong>From: ${suggestion.sugName}</strong></div>
        <br> 
            <div>${suggestion.suggest}</div>
            </a>
    </div>
    </div>
</div>
`;
            suggestionsContainer.innerHTML += suggestionHtml;
        });
    });
}

// Execute the displaySuggestions function when the window is loaded
window.onload = function () {
    console.log('Window loaded');
    displaySuggestions();
};