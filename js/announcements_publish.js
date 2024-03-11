import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref as databaseRef, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

document.addEventListener("DOMContentLoaded", function () {
  const announcementList = document.getElementById('announcementList');
  const imageInput = document.getElementById('image');
  const imagePreview = document.getElementById('imagePreview');
  const announcementForm = document.getElementById('announcementForm');
  const categorySelect = document.getElementById('categorySelect');
  const selectedCategoryInput = document.getElementById('selectedCategory');

  categorySelect.addEventListener('change', () => {
    const selectedCategory = categorySelect.value;
    selectedCategoryInput.value = selectedCategory;
    console.log('Selected category:', selectedCategory);
  });

  imageInput.addEventListener('change', previewImage);

  const announcementsRef = databaseRef(database, 'announcements');

  onValue(announcementsRef, (snapshot) => {
    const announcements = snapshot.val();
    if (announcements) {
      Object.keys(announcements).forEach((key) => {
        const announcement = announcements[key];
        displayAnnouncement(announcementList, announcement);
      });
    }
  });

  function displayAnnouncement(container, announcement) {
    const announcementCard = document.createElement('div');
    announcementCard.classList.add('announcement-card');

    const title = document.createElement('h2');
    title.textContent = announcement.title;

    const description = document.createElement('p');
    description.textContent = announcement.description;

    announcementCard.appendChild(title);
    announcementCard.appendChild(description);

    container.appendChild(announcementCard);
  }

  function previewImage() {
    if (imageInput.files && imageInput.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
        imagePreview.src = e.target.result;
        imagePreview.style.display = 'block';
      };

      reader.readAsDataURL(imageInput.files[0]);
    }
  }

  announcementForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form submission
    
    // Get form input values
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const category = selectedCategoryInput.value; // Get the selected category
    console.log('Title:', title);
    console.log('Description:', description);
    console.log('Category:', category);

    // Create a new announcement object with the category included
    const newAnnouncement = {
        title: title,
        description: description,
        category: category
    };
    console.log('New announcement:', newAnnouncement);

    // Push the new announcement data to Firebase under the specified category
    const newAnnouncementRef = push(databaseRef(database, 'announcements/' + category), newAnnouncement);
    const announcementId = newAnnouncementRef.key; // Get the generated key for the new announcement
    console.log('Announcement ID:', announcementId);

    showSuccessToast(); // Assuming this function shows a success message
});




  

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
});
