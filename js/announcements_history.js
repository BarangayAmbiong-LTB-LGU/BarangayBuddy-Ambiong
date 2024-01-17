import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

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
      const title = document.createElement('p');
      title.className = 'text-primary';
      title.textContent = announcement.title;
      card.appendChild(title);
  
      // Display image
      const image = document.createElement('img');
      image.src = announcement.imageUrl;
      image.alt = 'Announcement Image';
      image.className = 'announcement-image'; 
      card.appendChild(image);
  
      // Display description
      const description = document.createElement('p');
      description.textContent = announcement.description;
      card.appendChild(description);
  
      // Display timestamp (you may want to format it to a more readable format)
      const timestamp = document.createElement('p');
      timestamp.textContent = `Published on: ${new Date(announcement.timestamp).toLocaleString()}`;
      card.appendChild(timestamp);
  
      // Append the card to the main container
      mainCards.appendChild(card);
    });
  }

// Function to fetch announcements from the database
async function getAnnouncements() {
  const announcementsRef = ref(database, 'announcements');
  const snapshot = await get(announcementsRef);

  if (snapshot.exists()) {
    const announcements = Object.values(snapshot.val());
    displayAnnouncements(announcements);
  } else {
    console.log('No announcements found');
  }
}


// Assuming each card has an image with the class 'announcement-image'


// Fetch and display announcements on page load
getAnnouncements();
