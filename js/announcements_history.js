import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref as databaseRef, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCGeVx4ZmZPMXjeBR71lHbxVy8i-4gD9uQ",
    authDomain: "barangaybuddy.firebaseapp.com",
    databaseURL: "https://barangaybuddy-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "barangaybuddy",
    storageBucket: "barangaybuddy.appspot.com",
    messagingSenderId: "107104492368",
    appId: "1:107104492368:web:8896aec25ca1838cefaa55"
  };
  
  const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

document.addEventListener("DOMContentLoaded", function () {
  // Fetch and display past announcements
  const announcementList = document.getElementById('announcementList');
  const announcementsRef = databaseRef(database, 'announcements');

  onValue(announcementsRef, (snapshot) => {
    const announcements = snapshot.val();
    if (announcements) {
      // Iterate through announcements and display them
      Object.keys(announcements).forEach((key) => {
        const announcement = announcements[key];
        displayAnnouncement(announcementList, announcement);
      });
    }
  });
});

function displayAnnouncement(container, announcement) {
  const announcementCard = document.createElement('div');
  announcementCard.classList.add('card');

  const title = document.createElement('h2');
  title.textContent = announcement.title;

  const description = document.createElement('p');
  description.textContent = announcement.description;

  // You can add more elements based on your announcement structure

  announcementCard.appendChild(title);
  announcementCard.appendChild(description);

  container.appendChild(announcementCard);
}