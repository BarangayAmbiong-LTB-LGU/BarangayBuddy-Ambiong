import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

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

// Global variable to store all announcements
let allAnnouncements = [];

// Function to fetch all announcements from the database
function getAllAnnouncements() {
  const announcementsRef = ref(database, 'announcements');
  onValue(announcementsRef, (snapshot) => {
    if (snapshot.exists()) {
      allAnnouncements = Object.values(snapshot.val());
    } else {
      console.log('No announcements found');
    }
  });
}

// Call the function to fetch all announcements when the page loads
getAllAnnouncements();

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

    // Display category
    const category = document.createElement('p');
    category.textContent = `Category: ${announcement.category}`;
    card.appendChild(category);

    // Display timestamp
    const timestamp = document.createElement('p');
    timestamp.className = 'timestamp';
    timestamp.textContent = `Published on: ${new Date(announcement.timestamp).toLocaleString()}`;
    card.appendChild(timestamp);

    // Append the card to the main container
    mainCards.appendChild(card);
  });
}

// Function to filter announcements by category locally
function filterAnnouncementsByCategoryLocally(category) {
  return allAnnouncements.filter(announcement => announcement.category === category);
}

// Add event listeners to category links in the dropdown menu
document.getElementById('allCategory').addEventListener('click', function() {
  displayAnnouncements(allAnnouncements);
});

document.getElementById('Projects').addEventListener('click', function() {
  const category = 'Projects';
  const filteredAnnouncements = filterAnnouncementsByCategoryLocally(category);
  displayAnnouncements(filteredAnnouncements);
});

document.getElementById('Programs').addEventListener('click', function() {
  const category = 'Programs';
  const filteredAnnouncements = filterAnnouncementsByCategoryLocally(category);
  displayAnnouncements(filteredAnnouncements);
});

document.getElementById('Activities').addEventListener('click', function() {
  const category = 'Activities';
  const filteredAnnouncements = filterAnnouncementsByCategoryLocally(category);
  displayAnnouncements(filteredAnnouncements);
});
