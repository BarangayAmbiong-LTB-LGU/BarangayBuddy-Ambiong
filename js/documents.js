import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get, set, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

// Get a reference to the Firebase Realtime Database
const database = getDatabase(app);

// Function to display document requests
function displayDocumentRequests(requests) {
  const mainCards = document.querySelector('.main-cards');

  // Clear previous document requests
  mainCards.innerHTML = '';

  // Loop through each document request and display it
  for (const [documentType, documentRequests] of Object.entries(requests)) {
    // Loop through each document request under the document type
    for (const [requestId, request] of Object.entries(documentRequests)) {
      const card = document.createElement('div');
      card.className = 'card';

      // Display document type as a bold title within each card
      const documentTypeTitle = document.createElement('h2');
      documentTypeTitle.style.fontWeight = 'bold';
      documentTypeTitle.textContent = documentType;
      card.appendChild(documentTypeTitle);

      // Display details of the document request with line breaks
      const details = document.createElement('p');
      details.innerHTML = `
        <b>Name:</b> ${request.firstName} ${request.lastName} <br>
        <b>Age:</b> ${request.age} <br>
        <b>Gender:</b> ${request.gender} <br>
        <b>Address:</b> ${request.presentAddress} <br>
        <b>Purpose:</b> ${request.purpose} <br>
      `;
      card.appendChild(details);

      // Display status buttons
      const workingOnItButton = document.createElement('button');
      workingOnItButton.textContent = 'Working On It';
      workingOnItButton.addEventListener('click', () => updateRequestStatus(documentType, requestId, 'Working On It'));
      card.appendChild(workingOnItButton);

      const finishButton = document.createElement('button');
      finishButton.textContent = 'Finish';
      finishButton.addEventListener('click', () => updateRequestStatus(documentType, requestId, 'Finished'));
      card.appendChild(finishButton);

      // Append the card to the main container
      mainCards.appendChild(card);
    }
  }
}

// Function to fetch document requests from the database
async function getDocumentRequests() {
  const requestsRef = ref(database, 'RequestedDocuments');
  
  // Use onValue to listen for changes in data
  onValue(requestsRef, (snapshot) => {
    if (snapshot.exists()) {
      const requests = snapshot.val();
      displayDocumentRequests(requests);
    } else {
      console.log('No document requests found');
    }
  });
}

// Function to update the status of a document request
async function updateRequestStatus(documentType, requestId, status) {
  const requestRef = ref(database, `RequestedDocuments/${documentType}/${requestId}/status`);

  try {
    await set(requestRef, status);
    // Note: Since we're using onValue, there's no need to explicitly fetch and display updated document requests
  } catch (error) {
    console.error('Error updating request status:', error);
  }
}

// Fetch and display document requests on page load
getDocumentRequests();
