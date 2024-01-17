// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

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
const auth = getAuth(app);

let loginForm = document.getElementById('loginForm');

let signInUser = evt => {
    evt.preventDefault();

    // Get input values
    let email = document.getElementsByName('email')[0].value;
    let password = document.getElementsByName('password')[0].value;

    // Sign in with email and password
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Successfully signed in
            const user = userCredential.user;
            console.log('Logged in:', user);

            // Redirect to the desired page or perform additional actions
            window.location.href = 'index.html'; // Change 'index.html' to the desired page
        })
        .catch((error) => {
            // Handle login error
            alert(error.message);
            console.error('Login error:', error.code, error.message);
        });
}

loginForm.addEventListener('submit', signInUser);