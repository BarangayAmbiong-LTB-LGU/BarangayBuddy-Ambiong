import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

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
const database = getDatabase(app);

function updateDocumentStatus(docType, docKey, status) {
  const documentRef = ref(database, `RequestedDocuments/${docType}/${docKey}/status`);
  set(documentRef, status)
    .then(() => console.log(`${docType} document status updated to: ${status}`))
    .catch((error) => console.error("Error updating document status:", error.message));
}
function displayDocuments(docType, tableId) {
  const documentsRef = ref(database, `RequestedDocuments/${docType}`);

  onValue(documentsRef, (snapshot) => {
    const table = document.getElementById(tableId).getElementsByTagName('tbody')[0];

    // Clear existing table rows
    table.innerHTML = '';

    // Check if there is data in the snapshot
    if (snapshot.exists()) {
      const documents = snapshot.val();

      // Iterate through documents
      Object.keys(documents).reverse().forEach((docKey) => {
        const doc = documents[docKey];

        // Append a new row to the table
        const row = table.insertRow();

        // Append cells to the row based on the document type
        if (docType === 'Barangay Clearance') {
          appendBarangayClearanceCells(row, doc);
        } else if (docType === 'Business Clearance') {
          appendBusinessClearanceCells(row, doc);
        } else if (docType === 'Residency') {
          appendResidencyCells(row, doc);
        } else {
          // Handle other document types here
        }

        // Create the actions cell and append buttons
        const actionCell = row.insertCell();
        const actionsBar = document.createElement('div');
        actionsBar.classList.add('actions-bar');
        const pendingButton = createStatusButton(docType, docKey, 'Pending');
        const workingButton = createStatusButton(docType, docKey, 'Working on it');
        const finishedButton = createStatusButton(docType, docKey, 'Finished');
        actionsBar.appendChild(pendingButton);
        actionsBar.appendChild(workingButton);
        actionsBar.appendChild(finishedButton);
        actionCell.appendChild(actionsBar);
      });
    } else {
      console.log(`No ${docType} data available`);
    }
  }, (error) => {
    console.error(`Error fetching ${docType} data:`, error.message);
  });
}

function appendBarangayClearanceCells(row, doc) {
  appendCell(row, doc.fullName || 'N/A');
  appendCell(row, doc.age || 'N/A');
  appendCell(row, doc.dateOfBirth || 'N/A');
  appendCell(row, doc.gender || 'N/A');
  appendCell(row, doc.presentAddress || 'N/A');
  appendCell(row, doc.purpose || 'N/A');
  appendCell(row, doc.time ? new Date(doc.time).toLocaleDateString() : 'Invalid Date');
  appendCell(row, doc.status || 'N/A');
}

function appendBusinessClearanceCells(row, doc) {
  appendCell(row, doc.nameOfBussiness || 'N/A');
  appendCell(row, doc.fullname || 'N/A');
  appendCell(row, doc.businessAddress || 'N/A');
  appendCell(row, doc.time ? new Date(doc.time).toLocaleDateString() : 'Invalid Date');
  appendCell(row, doc.status || 'N/A');
 
}

function appendResidencyCells(row, doc) {
  appendCell(row, doc.fullName || 'N/A');
  appendCell(row, doc.age || 'N/A');
  appendCell(row, doc.gender || 'N/A');
  appendCell(row, doc.dateOfBirth || 'N/A');
  appendCell(row, doc.civilStatus || 'N/A');
  appendCell(row, doc.address || 'N/A');
  appendCell(row, doc.duration || 'N/A');
  appendCell(row, doc.time ? new Date(doc.time).toLocaleDateString() : 'Invalid Date');
  appendCell(row, doc.status || 'N/A');
}
function createStatusButton(docType, docKey, status) {
  const button = document.createElement('button');
  button.textContent = status;
  button.classList.add('publish-btn');
  button.addEventListener('click', () => updateDocumentStatus(docType, docKey, status));
  return button;
}

function appendCell(row, text) {
  const cell = row.insertCell();
  const textNode = document.createTextNode(text);
  cell.appendChild(textNode);
}


// Execute the display functions when the window is loaded
window.onload = function () {
  console.log('Window loaded');
  displayDocuments('Barangay Clearance', 'residentsBarangayClearance');
  displayDocuments('Business Clearance', 'residentsBusinessClearance');
  displayDocuments('Residency', 'residentsResidency');
};
