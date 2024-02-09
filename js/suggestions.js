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

        // Convert the snapshot to an array and reverse it
        const reversedSuggestions = Object.values(snapshot.val()).reverse();

        // Iterate through the reversed suggestions and display them
        reversedSuggestions.forEach((suggestion) => {
            const timestamp = suggestion.timestamp ? new Date(suggestion.timestamp).toLocaleString() : '';
            let shortDescription = suggestion.suggest;
            let showButton = false;
            if (suggestion.suggest.length > 100) {
                shortDescription = suggestion.suggest.slice(0, 100) + '...';
                showButton = true;
            }
            const suggestionHtml = `
                <div class="main-card">
                    <div class="card">
                        <div class="card-inner">
                            <a>
                                <div class="text-primary"><strong>From: ${suggestion.sugName}</strong></div>
                                <div><small>Added on: ${timestamp}</small></div>
                                <br> 
                                <div class="suggestion-description">${shortDescription}</div>
                                ${showButton ? `<button type="submit" class="submit expand-button" data-description="${suggestion.suggest}">Read More</button>` : ''}
                            </a>
                        </div>
                    </div>
                </div>
            `;
            suggestionsContainer.innerHTML += suggestionHtml;
        });

        // Add event listeners to expand buttons
        const expandButtons = document.querySelectorAll('.expand-button');
        expandButtons.forEach((button) => {
            button.addEventListener('click', function() {
                const description = this.dataset.description;
                const suggestionDescription = this.parentElement.querySelector('.suggestion-description');
                if (suggestionDescription.textContent === description) {
                    suggestionDescription.textContent = description.slice(0, 100) + '...';
                    this.textContent = 'Read More';
                } else {
                    suggestionDescription.textContent = description;
                    this.textContent = 'Show Less';
                }
            });
        });
    });
}
// Execute the displaySuggestions function when the window is loaded
window.onload = function () {
    console.log('Window loaded');
    displaySuggestions();
};
