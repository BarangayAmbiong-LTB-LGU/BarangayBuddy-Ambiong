
import {
    getDatabase,
    ref as databaseRef,
    push,
    set,
    serverTimestamp 
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

  
// Function to check for new submissions and display notifications
function checkForNewSubmissions() {
    // Add your logic here to check for new submissions in each feature
    // If new submissions are found, display notifications
    checkRequestedDocuments();
    checkReports();
    checkSuggestions();
}

// Function to check for new submissions in the Requested Barangay Documents feature
function checkRequestedDocuments() {
    // Add logic to fetch new submissions from the database
    // For demonstration, let's assume there are new submissions
    const newDocuments = 3;

    // Display notification if there are new submissions
    if (newDocuments > 0) {
        displayNotification(`You have ${newDocuments} new document requests.`);
    }
}

// Function to check for new submissions in the Manage Reports feature
function checkReports() {
    // Add logic to fetch new submissions from the database
    // For demonstration, let's assume there are new submissions
    const newReports = 2;

    // Display notification if there are new submissions
    if (newReports > 0) {
        displayNotification(`You have ${newReports} new reports to review.`);
    }
}

// Function to check for new submissions in the Suggestions feature
function checkSuggestions() {
    // Add logic to fetch new submissions from the database
    // For demonstration, let's assume there are new submissions
    const newSuggestions = 1;

    // Display notification if there are new submissions
    if (newSuggestions > 0) {
        displayNotification(`You have ${newSuggestions} new suggestions.`);
    }
}

// Function to display notifications
function displayNotification(message) {
    // Add logic to display notifications to the user
    // For demonstration, let's log the message to the console
    console.log(message);
}


// Initialize popover
var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl);
});
