import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import {
  getDatabase,
  ref as databaseRef,
  push
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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
const firebaseApp = initializeApp(firebaseConfig);

// Remove 'app' parameter here
const storage = getStorage(firebaseApp);
const database = getDatabase(firebaseApp);

// Function to upload announcement
function uploadAnnouncement(title, description, imageFile) {
  // Create a unique key for the announcement
  const newAnnouncementKey = push(databaseRef(database, 'announcements')).key;

  // Upload image to Firebase Storage
  const imageRef = storageRef(storage, `Announcements/${newAnnouncementKey}`);
  uploadBytes(imageRef, imageFile).then(() => {
    // Get the download URL of the uploaded image
    getDownloadURL(imageRef).then((imageUrl) => {
      // Save announcement details to Realtime Database
      const newAnnouncement = {
        title: title,
        description: description,
        imageUrl: imageUrl,
      };

      // Push the new announcement to the database
      push(databaseRef(database, `announcements/${newAnnouncementKey}`), newAnnouncement);

      console.log('Announcement uploaded successfully!');
    }).catch((error) => {
      console.error('Error getting download URL:', error);
    });
  }).catch((error) => {
    console.error('Error uploading image:', error);
  });
}

// Event listener for form submission
document.getElementById('announcementForm').addEventListener('submit', function (event) {
  event.preventDefault();

  // Get input values
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const imageFile = document.getElementById('image').files[0];

  // Upload announcement
  uploadAnnouncement(title, description, imageFile);
});
