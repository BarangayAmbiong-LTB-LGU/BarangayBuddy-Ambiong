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
  push,
  set,
  serverTimestamp  // Import serverTimestamp here
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

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);
const database = getDatabase(firebaseApp);

function uploadAnnouncement(title, description, imageFile) {
  const newAnnouncementKey = push(databaseRef(database, 'announcements')).key;
  const timestamp = serverTimestamp();  // Use serverTimestamp here

  const imageRef = storageRef(storage, `Announcements/${newAnnouncementKey}`);
  uploadBytes(imageRef, imageFile).then(() => {
    getDownloadURL(imageRef).then((imageUrl) => {
      const newAnnouncement = {
        title: title,
        description: description,
        imageUrl: imageUrl,
        timestamp: timestamp,
      };

      // Use set instead of push to set the data at the specified path
      set(databaseRef(database, `announcements/${newAnnouncementKey}`), newAnnouncement);

      console.log('Announcement uploaded successfully!');
    }).catch((error) => {
      console.error('Error getting download URL:', error);
    });
  }).catch((error) => {
    console.error('Error uploading image:', error);
  });
}

document.getElementById('announcementForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const imageFile = document.getElementById('image').files[0];

  uploadAnnouncement(title, description, imageFile);
});