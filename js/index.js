import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
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

const app = initializeApp(firebaseConfig);
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