import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

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
const database = getDatabase(app);

const barangayClearanceRef = ref(database, 'RequestedDocuments/Barangay Clearance');

function displayBarangayClearance() {
  onValue(barangayClearanceRef, (snapshot) => {
    const residentsTable = document.getElementById('residentsBarangayClearance').getElementsByTagName('tbody')[0];

    // Clear existing table rows
    residentsTable.innerHTML = '';

    // Check if there is data in the snapshot
    if (snapshot.exists()) {
      const residents = snapshot.val();

      // Iterate through residents
      Object.keys(residents).reverse().forEach((residentKey) => {
        const resident = residents[residentKey];
        console.log('Full Resident Object:', resident);

        // Your existing code to append cells to the table
        const dateOfRequest = resident.time ? new Date(resident.time).toLocaleDateString() : 'Invalid Date';
        const dateOfBirth = resident.dateOfBirth ? resident.dateOfBirth : 'Invalid Date';

        const row = residentsTable.insertRow();
        appendCell(row, resident.fullName || 'N/A');
        appendCell(row, resident.age || 'N/A');
        appendCell(row, dateOfBirth);
        appendCell(row, resident.gender || 'N/A');
        appendCell(row, resident.presentAddress || 'N/A');
        appendCell(row, resident.purpose || 'N/A');
        appendCell(row, dateOfRequest);
        appendCell(row, 'Pending');
      });
    } else {
      console.log('No data available');
    }
  }, (error) => {
    console.error('Error fetching data:', error.message);
  });
}

// Business Clearance
const businessClearanceRef = ref(database, 'RequestedDocuments/Business Clearance');

function displayBusinessClearance() {
  onValue(businessClearanceRef, (snapshot) => {
    const businessClearanceTable = document.getElementById('residentsBusinessClearance').getElementsByTagName('tbody')[0];

    // Clear existing table rows
    businessClearanceTable.innerHTML = '';

    // Check if there is data in the snapshot
    if (snapshot.exists()) {
      const businesses = snapshot.val();

      // Iterate through businesses
      Object.keys(businesses).reverse().forEach((businessKey) => {
        const business = businesses[businessKey];

        // Your existing code to append cells to the table
        const dateIssued = business.time ? new Date(business.time).toLocaleDateString() : 'Invalid Date';

        const row = businessClearanceTable.insertRow();
        row.setAttribute('data-business-key', businessKey);
        row.addEventListener('click', onBusinessRowClick);

    appendCell(row, business.nameOfBussiness || 'N/A');
    appendCell(row, business.fullname || 'N/A');
    appendCell(row, business.businessAddress || 'N/A');
   
    appendCell(row, dateIssued);
    appendCell(row, 'Pending');
      });
    } else {
      console.log('No data available');
    }
  }, (error) => {
    console.error('Error fetching business data:', error.message);
  });
}

function onBusinessRowClick(event) {
  const businessKey = event.currentTarget.getAttribute('data-business-key');
  console.log('Business Row clicked! Business Key:', businessKey);
  // Implement logic to show/hide additional details or navigate to a details page.
}

// Residency
const residencyRef = ref(database, 'RequestedDocuments/Residency');

function displayResidency() {
  onValue(residencyRef, (snapshot) => {
    const residencyTable = document.getElementById('residentsResidency').getElementsByTagName('tbody')[0];

    // Clear existing table rows
    residencyTable.innerHTML = '';

    // Check if there is data in the snapshot
    if (snapshot.exists()) {
      const residencies = snapshot.val();

      // Iterate through residencies
      Object.keys(residencies).reverse().forEach((residencyKey) => {
        const residency = residencies[residencyKey];

        // Your existing code to append cells to the table
        const dateOfBirth = residency.dateOfBirth ? residency.dateOfBirth : 'Invalid Date';

        const row = residencyTable.insertRow();
        row.setAttribute('data-residency-key', residencyKey);
        row.addEventListener('click', onResidencyRowClick);
    
        appendCell(row, residency.fullName || 'N/A');
        appendCell(row, residency.age || 'N/A');
        appendCell(row, residency.gender || 'N/A');
        appendCell(row, residency.dateOfBirth || 'N/A');  // Corrected to use dateOfBirth for Residency
        appendCell(row, residency.civilStatus || 'N/A');
        appendCell(row, residency.address || 'N/A');
        appendCell(row, residency.duration || 'N/A');
        appendCell(row, residency.time ? new Date(residency.time).toLocaleDateString() : 'Invalid Date');
        appendCell(row, 'Pending');
      });
    } else {
      console.log('No data available');
    }
  }, (error) => {
    console.error('Error fetching residency data:', error.message);
  });
}

function onResidencyRowClick(event) {
  const residencyKey = event.currentTarget.getAttribute('data-residency-key');
  console.log('Residency Row clicked! Residency Key:', residencyKey);
  // Implement logic to show/hide additional details or navigate to a details page.
}

// Execute the display functions when the window is loaded
window.onload = function () {
  console.log('Window loaded');
  displayBarangayClearance();
  displayBusinessClearance();
  displayResidency();
};
// Execute the display functions when the window is loaded
window.onload = function () {
  console.log('Window loaded');
  displayBarangayClearance();
  displayBusinessClearance();
  displayResidency();
};

// Execute the displayBarangayClearance function when the window is loaded
window.onload = function () {
  console.log('Window loaded');
  displayBarangayClearance();
};

function appendCell(row, text) {
  const cell = row.insertCell();
  const textNode = document.createTextNode(text);
  cell.appendChild(textNode);
}

// Execute the display functions when the window is loaded
window.onload = function () {
  console.log('Window loaded');
  displayBarangayClearance();
  displayBusinessClearance();
  displayResidency();
};