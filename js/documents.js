import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, onValue, set, remove  } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";


const firebaseConfig = {
  apiKey: "AIzaSyCGeVx4ZmZPMXjeBR71lHbxVy8i-4gD9uQ",
  authDomain: "barangaybuddy.firebaseapp.com",
  databaseURL: "https://barangaybuddy-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "barangaybuddy",
  storageBucket: "barangaybuddy.appspot.com",
  messagingSenderId: "107104492368",
  appId: "1:107104492368:web:8896aec25ca1838cefaa55"
};

function moveDoneRowsToFinishedDocuments(docType) {
  if (typeof docType !== 'string') {
    console.error('Invalid document type:', docType);
    return;
  }

  const tables = document.querySelectorAll(`#residents${docType.replace(/\s/g, '')} tbody`);

  tables.forEach(tbody => {
    // Get all rows in the table body
    const rows = Array.from(tbody.querySelectorAll('tr'));

    // Separate done rows from the rest
    const doneRows = rows.filter(row => row.cells[row.cells.length - 1].textContent.trim() === 'Done');

    // Move done rows to the "Finished documents" table
    const doneTable = document.getElementById('doneDocumentsTable').getElementsByTagName('tbody')[0];
    doneRows.forEach(row => {
      // Append done row to the "Finished documents" table
      doneTable.appendChild(row);
    });
  });
}


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export function updateDocumentStatus(docType, outerDocKey, innerDocKey, status) {
  if (status === 'Done') {
    // Get a reference to the document that is marked as done
    const documentRef = ref(database, `RequestedDocuments/${docType}/${outerDocKey}/${innerDocKey}`);

    // Retrieve the document data
    onValue(documentRef, (snapshot) => {
      if (snapshot.exists()) {
        const documentData = snapshot.val();
        
        // Move the document data to "Finished Documents"
        const finishedDocumentsRef = ref(database, `FinishedDocuments/${outerDocKey}/${innerDocKey}`);
        set(finishedDocumentsRef, documentData)
          .then(() => console.log(`Document moved to Finished Documents`))
          .catch((error) => console.error("Error moving document to Finished Documents:", error.message));
        
        // Remove the document from the original location
        remove(documentRef)
          .then(() => console.log(`Document removed from Requested Documents`))
          .catch((error) => console.error("Error removing document from Requested Documents:", error.message));
      } else {
        console.error(`Document does not exist`);
      }
    }, (error) => {
      console.error(`Error fetching document:`, error.message);
    });
  } else {
    // Update document status in the original location
    const documentStatusRef = ref(database, `RequestedDocuments/${docType}/${outerDocKey}/${innerDocKey}/status`);
    set(documentStatusRef, status)
      .then(() => console.log(`Document status updated to: ${status}`))
      .catch((error) => console.error("Error updating document status:", error.message));
  }
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

      // Reverse the order of document keys
      const reversedDocEntries = Object.entries(documents).reverse();

     // Inside the displayDocuments function
reversedDocEntries.forEach(([outerDocKey, outerDoc]) => {
  // Now iterate through inner documents in reversed order
  Object.entries(outerDoc).reverse().forEach(([innerDocKey, innerDoc]) => {
    // Append a new row to the table
    const row = table.insertRow();
    
    // Append cells to the row based on the document type
    if (docType === 'Barangay Clearance') {
      appendBarangayClearanceCells(row, innerDoc);
    } else if (docType === 'Business Clearance') {
      appendBusinessClearanceCells(row, innerDoc);
    } else if (docType === 'Residency') {
      appendResidencyCells(row, innerDoc);
    } else if (docType === 'Others') {
      appendOthersCells(row, innerDoc);
    } else {
      console.error("Unknown document type:", docType);
      return;
    }

    // Call the function to create buttons and append them to the row
    appendButtonsToRow(row, docType, outerDocKey, innerDocKey);
  });
});

// Move done rows to the bottom after loading the documents
moveDoneRowsToFinishedDocuments(table);

    } else {
      console.log(`No ${docType} data available`);
    }
  }, (error) => {
    console.error(`Error fetching ${docType} data:`, error.message);
  });
}


function appendBarangayClearanceCells(row, doc) {
  // Append cells to the row based on the document type
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
  // Append cells to the row based on the document type
  appendCell(row, doc.nameOfBussiness || 'N/A');
  appendCell(row, doc.fullname || 'N/A');
  appendCell(row, doc.businessAddress || 'N/A');
  appendCell(row, doc.typeOfBusiness || 'N/A');
  appendCell(row, doc.time ? new Date(doc.time).toLocaleDateString() : 'Invalid Date');
  appendCell(row, doc.status || 'N/A');
}

function appendResidencyCells(row, doc) {
  // Append cells to the row based on the document type
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

function appendOthersCells(row, doc) {
  // Append cells to the row based on the document type
  appendCell(row, doc.fullName || 'N/A');
  appendCell(row, doc.age || 'N/A');
  appendCell(row, doc.gender || 'N/A');
  appendCell(row, doc.address || 'N/A');
  appendCell(row, doc.civilStatus || 'N/A');
  appendCell(row, doc.dateOfBirth || 'N/A');
  appendCell(row, doc.documentType || 'N/A');
  appendCell(row, doc.duration || 'N/A');
  appendCell(row, doc.time ? new Date(doc.time).toLocaleDateString() : 'Invalid Date');
  appendCell(row, doc.status || 'N/A');
}


function appendFinishedDocumentCells(row, doc) {
  // Append cells to the row based on the document type
  appendCell(row, doc.documentType || 'N/A');
  appendCell(row, doc.fullName || 'N/A');
  appendCell(row, doc.age || 'N/A');
  appendCell(row, doc.dateOfBirth || 'N/A');
  appendCell(row, doc.gender || 'N/A');
  appendCell(row, doc.presentAddress || 'N/A');
  appendCell(row, doc.purpose || 'N/A');
  appendCell(row, doc.time ? new Date(doc.time).toLocaleDateString() : 'Invalid Date');
  appendCell(row, 'Done'); 

}


function appendCell(row, text) {
  // Append a new cell to the row
  const cell = row.insertCell();
  const textNode = document.createTextNode(text);
  cell.appendChild(textNode);
}

// Function to append buttons to the row
function appendButtonsToRow(row, docType, outerDocKey, innerDocKey, innerDoc) {
  const actionCell = row.insertCell();
  const actionsBar = document.createElement('div');
  actionsBar.classList.add('actions-bar');

  // Create buttons for different actions
  const acceptButton = createStatusButton(docType, outerDocKey, innerDocKey, 'Accept');
  const rejectButton = createStatusButton(docType, outerDocKey, innerDocKey, 'Reject');
  const finishedButton = createStatusButton(docType, outerDocKey, innerDocKey, 'Finished');
  const doneButton = createStatusButton(docType, outerDocKey, innerDocKey, 'Done');

  // Append buttons to actions bar
  actionsBar.appendChild(acceptButton);
  actionsBar.appendChild(rejectButton);
  actionsBar.appendChild(finishedButton);
  actionsBar.appendChild(doneButton);

  // Append actions bar to action cell
  actionCell.appendChild(actionsBar);
}



function createStatusButton(docType, outerDocKey, innerDocKey, status) {
  const button = document.createElement('button');
  button.textContent = status;
  button.classList.add('publish-btn');

  // Give the "Done" button a unique ID
  if (status === 'Done') {
    button.id = `${docType}_${outerDocKey}_${innerDocKey}_DoneButton`;
  }

  // Inside the createStatusButton function
button.addEventListener('click', async () => {
  // Handle functionality for the "Done" button separately
  if (status === 'Done') {
    // Update document status to 'Done'
    updateDocumentStatus(docType, outerDocKey, innerDocKey, 'Done');
    
    // Move the corresponding row to the "Finished documents" table
    const row = document.getElementById(`${outerDocKey}_${innerDocKey}`);
    if (row) {
      const doneTable = document.getElementById('doneDocumentsTable').getElementsByTagName('tbody')[0];
      doneTable.appendChild(row);
    }
    
    // Move done rows to the "Finished documents" table
    moveDoneRowsToFinishedDocuments(docType);
    
    // Log a message indicating the document has been marked as done
    console.log('Document marked as done');
    
    // Exit the event listener function
    return;
  }

  // Handle other button functionalities here (Accept, Reject, Finished)
  updateDocumentStatus(docType, outerDocKey, innerDocKey, status);
  
  // Display appropriate message based on status
  switch (status) {
    case 'Accept':
      console.log('Document accepted');
      break;
    case 'Reject':
      console.log('Document rejected');
      break;
    case 'Finished':
      console.log('Document marked as finished');
      break;
    default:
      console.error('Unknown status');
      break;
  }
});

  return button;
}

function fetchFinishedDocuments() {
  const finishedDocumentsRef = ref(database, `FinishedDocuments`);

  onValue(finishedDocumentsRef, (snapshot) => {
    const table = document.getElementById('doneDocumentsTable').getElementsByTagName('tbody')[0];

    // Clear existing table rows
    table.innerHTML = '';

    // Check if there is data in the snapshot
    if (snapshot.exists()) {
      const documentIds = Object.keys(snapshot.val());

      // Iterate through documentIds
      documentIds.forEach((docId) => {
        const innerDocKeys = Object.keys(snapshot.val()[docId]);

        // Iterate through innerDocKeys
        innerDocKeys.forEach((innerDocKey) => {
          // Append a new row to the table
          const row = table.insertRow();

          // Append cells to the row based on the document type
          appendFinishedDocumentCells(row, snapshot.val()[docId][innerDocKey]);
        });
      });
    } else {
      console.log(`No finished documents available`);
    }
  }, (error) => {
    console.error(`Error fetching finished documents:`, error.message);
  });
}

// Call the fetchFinishedDocuments function to fetch all documents under FinishedDocuments
fetchFinishedDocuments();



// Define the button
const button = document.getElementById('doneDocumentsTable');

// Inside the event listener for the "Done" button
button.addEventListener('click', async () => {
  // Handle functionality for the "Done" button separately
  if (status === 'Done') {
    // Update document status to 'Done'
    updateDocumentStatus(docType, outerDocKey, innerDocKey, 'Done');
    
    // Move the corresponding row to the "Finished documents" table
    const row = document.getElementById(`${outerDocKey}_${innerDocKey}`);
    if (row) {
      const doneTable = document.getElementById('doneDocumentsTable').getElementsByTagName('tbody')[0];
      doneTable.appendChild(row);
    }
    
    // Move done rows to the "Finished documents" table
    moveDoneRowsToFinishedDocuments(docType);
    
    // Fetch all finished documents and populate the table
    fetchFinishedDocuments(docType);
    
    // Log a message indicating the document has been marked as done
    console.log('Document marked as done');
    
    // Exit the event listener function
    return;
  }

  // Handle other button functionalities here (Accept, Reject, Finished)
  updateDocumentStatus(docType, outerDocKey, innerDocKey, status);
  
  // Display appropriate message based on status
  switch (status) {
    case 'Accept':
      console.log('Document accepted');
      break;
    case 'Reject':
      console.log('Document rejected');
      break;
    case 'Finished':
      console.log('Document marked as finished');
      break;
    default:
      console.error('Unknown status');
      break;
  }
});


// Define window onload event handler
window.onload = function () {
  console.log('Window loaded');
  // Display documents for different types
  displayDocuments('Barangay Clearance', 'residentsBarangayClearance');
  displayDocuments('Business Clearance', 'residentsBusinessClearance');
  displayDocuments('Residency', 'residentsResidency');
  displayDocuments('Others', 'residentsOthers');
};


// Define the "Done" button click event listener
document.addEventListener('click', async (event) => {
  const target = event.target;
  if (target.classList.contains('publish-btn') && target.textContent === 'Done') {
    const [docType, outerDocKey, innerDocKey] = target.id.split('_');
    updateDocumentStatus(docType, outerDocKey, innerDocKey, 'Done');
    moveDoneRowsToFinishedDocuments(docType);
    fetchFinishedDocuments(docType); // Ensure that fetchFinishedDocuments is called after updating the document status
  }
});



// Get the "Done" button using its dynamically generated ID
const doneButton = document.getElementById(doneButtonId);

// Add event listener to the "Done" button
doneButton.addEventListener('click', async () => {
  // Handle functionality for the "Done" button separately
  if (status === 'Done') {
    // Update document status to 'Done'
    updateDocumentStatus(docType, outerDocKey, innerDocKey, 'Done');

    // Move the corresponding row to the "Finished documents" table
    const row = document.getElementById(`${outerDocKey}_${innerDocKey}`);
    if (row) {
      const doneTable = document.getElementById('doneDocumentsTable').getElementsByTagName('tbody')[0];
      doneTable.appendChild(row);
    }

    // Move done rows to the "Finished documents" table
    moveDoneRowsToFinishedDocuments(docType);

    // Fetch all finished documents and populate the table
    fetchFinishedDocuments(docType);

    // Log a message indicating the document has been marked as done
    console.log('Document marked as done');

    // Exit the event listener function
    return;
  }

  // Handle other button functionalities here (Accept, Reject, Finished)
  updateDocumentStatus(docType, outerDocKey, innerDocKey, status);

  // Display appropriate message based on status
  switch (status) {
    case 'Accept':
      console.log('Document accepted');
      break;
    case 'Reject':
      console.log('Document rejected');
      break;
    case 'Finished':
      console.log('Document marked as finished');
      break;
    default:
      console.error('Unknown status');
      break;
  }
});

