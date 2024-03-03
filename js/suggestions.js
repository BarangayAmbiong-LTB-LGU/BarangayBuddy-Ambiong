import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut  } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";


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

// Function to display all suggestions in a table
function displaySuggestionsAsTable() {
    onValue(suggestionsRef, (snapshot) => {
        const suggestionsTable = document.getElementById('suggestionsTable');
        const tbody = suggestionsTable.getElementsByTagName('tbody')[0];
        tbody.innerHTML = ''; // Clear existing table body

        // Convert the snapshot to an array and reverse it
        const reversedSuggestions = Object.values(snapshot.val()).reverse();

        // Iterate through the reversed suggestions and add them to the table
        reversedSuggestions.forEach((suggestion) => {
            const sugName = suggestion.sugName.trim() ? suggestion.sugName : 'Anonymous';
            const timestamp = suggestion.timeStamp ? new Date(suggestion.timeStamp).toLocaleString() : '';
            const category = (
                (suggestion.healthChecked ? 'Health' : '') +
                (suggestion.educationChecked ? (suggestion.healthChecked ? ', Education' : 'Education') : '') +
                (suggestion.sportsChecked ? (suggestion.healthChecked || suggestion.educationChecked ? ', Sports' : 'Sports') : '') +
                (suggestion.barangayImprovementsChecked ? (suggestion.healthChecked || suggestion.educationChecked || suggestion.sportsChecked ? ', Barangay Improvements' : 'Barangay Improvements') : '') +
                (suggestion.othersChecked ? (suggestion.healthChecked || suggestion.educationChecked || suggestion.sportsChecked || suggestion.barangayImprovementsChecked ? ', Others' : 'Others') : '')
            );

            // Check if the suggestion text is long
            const suggestionText = suggestion.suggest;
            const isLongSuggestion = suggestionText.length > 100;

            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${category}</td>
                <td>${sugName}</td>
                <td>${isLongSuggestion ? truncateText(suggestionText).shortText : suggestionText}</td>
                <td>${timestamp}</td>
            `;

            if (isLongSuggestion) {
                // Add "See More" button if the suggestion is long
// Add "See More" button if the suggestion is long
const cell = row.cells[2];
const { fullText, shortText } = truncateText(suggestionText);
cell.innerHTML = shortText + ' <span class="publish-btn see-more">See More</span>';
// Store full and short texts as data attributes
cell.dataset.fullText = fullText;
cell.dataset.shortText = shortText;

            }
        });
    });
}

// Event listener for "See More" functionality
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('see-more')) {
        const suggestionDescription = event.target.parentNode;
        const fullText = suggestionDescription.dataset.fullText;
        suggestionDescription.innerHTML = fullText + ' <span class="publish-btn see-less">Show Less</span>';
    } else if (event.target.classList.contains('see-less')) {
        const suggestionDescription = event.target.parentNode;
        const shortText = suggestionDescription.dataset.shortText;
        suggestionDescription.innerHTML = shortText + ' <span class="publish-btn see-more">See More</span>';
    }
});




// Function to filter suggestions based on selected category
function filterSuggestionsByCategory(snapshot, category) {
    const suggestionsTable = document.getElementById('suggestionsTable');
    const tbody = suggestionsTable.getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // Clear existing table body

    // Convert the snapshot to an array and reverse it
    const reversedSuggestions = Object.values(snapshot.val()).reverse();

    // Iterate through the reversed suggestions and add them to the table
    reversedSuggestions.forEach((suggestion) => {
        // Check if the suggestion matches the selected category
        if (suggestion[category]) {
            const sugName = suggestion.sugName.trim() ? suggestion.sugName : 'Anonymous';
            const timestamp = suggestion.timeStamp ? new Date(suggestion.timeStamp).toLocaleString() : '';
            const categoryText = (
                (suggestion.healthChecked ? 'Health' : '') +
                (suggestion.educationChecked ? (suggestion.healthChecked ? ', Education' : 'Education') : '') +
                (suggestion.sportsChecked ? (suggestion.healthChecked || suggestion.educationChecked ? ', Sports' : 'Sports') : '') +
                (suggestion.barangayImprovementsChecked ? (suggestion.healthChecked || suggestion.educationChecked || suggestion.sportsChecked ? ', Barangay Improvements' : 'Barangay Improvements') : '') +
                (suggestion.othersChecked ? (suggestion.healthChecked || suggestion.educationChecked || suggestion.sportsChecked || suggestion.barangayImprovementsChecked ? ', Others' : 'Others') : '')
            );

            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${categoryText}</td>
                <td>${sugName}</td>
                <td>${suggestion.suggest}</td>
                <td>${timestamp}</td>
            `;
        }
    });
}

// Function to display suggestions based on selected category
function displaySuggestionsByCategory(category) {
    onValue(suggestionsRef, (snapshot) => {
        filterSuggestionsByCategory(snapshot, category);
    });
}


// Function to truncate text and add "See More" functionality
function truncateText(text) {
    const maxLength = 100;
    if (text.length <= maxLength) return { fullText: text, shortText: text };
    const truncatedText = text.slice(0, maxLength) + '...';
    return { fullText: text, shortText: truncatedText };
}


// Event listener for "See More" functionality
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('see-more')) {
        const suggestionDescription = event.target.parentNode;
        const fullText = suggestionDescription.textContent.replace('See More', '');
        suggestionDescription.innerHTML = fullText;
    }
});


// Execute the displaySuggestionsAsTable function when the window is loaded
window.onload = function () {
    console.log('Window loaded');
    
    // Add event listeners to category links
    document.getElementById('allCategory').addEventListener('click', () => {
        displaySuggestionsAsTable();
    });
    document.getElementById('healthCategory').addEventListener('click', () => {
        displaySuggestionsByCategory('healthChecked');
    });
    document.getElementById('educationCategory').addEventListener('click', () => {
        displaySuggestionsByCategory('educationChecked');
    });
    document.getElementById('sportsCategory').addEventListener('click', () => {
        displaySuggestionsByCategory('sportsChecked');
    });
    document.getElementById('barangayImprovementsCategory').addEventListener('click', () => {
        displaySuggestionsByCategory('barangayImprovementsChecked');
    });
    document.getElementById('othersCategory').addEventListener('click', () => {
        displaySuggestionsByCategory('othersChecked');
    });
    
    // Display all suggestions by default
    displaySuggestionsAsTable();
};



// Initialize Firebase Authentication
const auth = getAuth();

// Listen for changes in authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        console.log('User is signed in');
    } else {
        // User is signed out
        console.log('User is signed out');
        // Clear any session tokens or flags
        sessionStorage.setItem('isLoggedIn', 'false');
        // Redirect the user to the login page
        window.location.href = 'login.html';
    }
});

// Logout function
document.querySelector('.logout').addEventListener('click', function() {
    signOut(auth).then(() => {
        // User successfully signed out
    }).catch((error) => {
        // An error occurred while signing out
        console.error('Error signing out:', error);
    });
});