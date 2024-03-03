import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, get, query, orderByChild, onValue } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut  } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";


// Your web app's Firebase configuration
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

// Firebase Realtime Database
const database = getDatabase(app);




// Function to display announcements
function displayAnnouncements(announcements) {
  const mainCards = document.querySelector('.main-cards');

  // Clear previous announcements
  mainCards.innerHTML = '';

  // Loop through each announcement and display it
  announcements.forEach((announcement) => {
    const card = document.createElement('div');
    card.className = 'card';

    // Display title
    const title = document.createElement('h1');
    title.className = 'text-primary';
    title.textContent = announcement.title;
    // Make the title bold
    title.style.fontWeight = 'bold';
    card.appendChild(title);

    const imageContainer = document.createElement('div');
    imageContainer.className = 'image-container';

    const image = document.createElement('img');
    image.src = announcement.imageUrl;
    image.alt = 'Announcement Image';
    image.className = 'announcement-image';
    imageContainer.appendChild(image);

    card.appendChild(imageContainer);

    // Display description
    const description = document.createElement('h4');
    description.textContent = announcement.description;
    card.appendChild(description);

    // Add two line breaks for extra space
    const lineBreak1 = document.createElement('br');
    const lineBreak2 = document.createElement('br');
    card.appendChild(lineBreak1);
    card.appendChild(lineBreak2);

    // Display timestamp
    const timestamp = document.createElement('p');
    timestamp.className = 'timestamp';
    timestamp.textContent = `Published on: ${new Date(announcement.timestamp).toLocaleString()}`;
    card.appendChild(timestamp);

    // Append the card to the main container
    mainCards.appendChild(card);
  });
}

// Function to fetch announcements from the database and listen for real-time updates
function listenForAnnouncements() {
  const announcementsRef = ref(database, 'announcements');
  const orderedAnnouncements = query(announcementsRef, orderByChild('timestamp'));

  // Listen for changes in the data
  onValue(orderedAnnouncements, (snapshot) => {
    if (snapshot.exists()) {
      const announcements = Object.values(snapshot.val());
      // Reverse the order of announcements to display newest first
      displayAnnouncements(announcements.reverse());
    } else {
      console.log('No announcements found');
    }
  });
}

// Fetch and display announcements on page load
listenForAnnouncements();





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