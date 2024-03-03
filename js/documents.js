import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, onValue, set, remove  } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut  } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

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


// Initialize Firebase Authentication
const auth = getAuth();




// Logout function
document.querySelector('.logout').addEventListener('click', function() {
    signOut(auth).then(() => {
        // User successfully signed out
    }).catch((error) => {
        // An error occurred while signing out
        console.error('Error signing out:', error);
    });
});

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
    const doneRows = rows.filter(row => row.cells[row.cells.length - 1].textContent.trim() === 'Claimed');

    // Move done rows to the "Finished documents" table
    const doneTable = document.getElementById('doneDocumentsTable').getElementsByTagName('tbody')[0];
    doneRows.forEach(row => {
      // Append done row to the "Finished documents" table
      doneTable.appendChild(row);
    });
  });
}



// Reference to the finished documents
const finishedDocumentsRef = ref(database, 'FinishedDocuments');

export function updateDocumentStatus(docType, outerDocKey, innerDocKey, status) {
  if (status === 'Claimed') {
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
  appendCell(row, 'Claimed'); 
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
  const rejectButton = createStatusButton(docType, outerDocKey, innerDocKey, 'Pending');
  const finishedButton = createStatusButton(docType, outerDocKey, innerDocKey, 'For Claiming');
  const doneButton = createStatusButton(docType, outerDocKey, innerDocKey, 'Claimed');

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
  if (status === 'Claimed') {
    button.id = `${docType}_${outerDocKey}_${innerDocKey}_DoneButton`;
  }

  // Inside the createStatusButton function
button.addEventListener('click', async () => {
  // Handle functionality for the "Done" button separately
  if (status === 'Claimed') {
    // Update document status to 'Done'
    updateDocumentStatus(docType, outerDocKey, innerDocKey, 'Claimed');
    
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







// Fetch finished documents
function fetchFinishedDocuments() {
  onValue(finishedDocumentsRef, (snapshot) => {
    const table = document.getElementById('doneDocumentsTable').getElementsByTagName('tbody')[0];
    table.innerHTML = ''; // Clear existing table rows
    if (snapshot.exists()) {
      const documents = snapshot.val();
      // Flatten the documents into an array
      const documentsArray = [];
      Object.entries(documents).forEach(([userId, userDocuments]) => {
        Object.entries(userDocuments).forEach(([docId, document]) => {
          documentsArray.push(document);
        });
      });
      // Sort documents by timestamp (latest to oldest)
      documentsArray.sort((a, b) => b.time - a.time);
      // Iterate through sorted documents
      documentsArray.forEach(document => {
        const row = table.insertRow();
        appendFinishedDocumentCells(row, document);
      });
    } else {
      console.log('No finished documents available');
    }
  }, (error) => {
    console.error('Error fetching finished documents:', error.message);
  });
}

// Call the fetchFinishedDocuments function to fetch all documents under FinishedDocuments
fetchFinishedDocuments();








// Define the button
const button = document.getElementById('doneDocumentsTable');

// Inside the event listener for the "Done" button
button.addEventListener('click', async () => {
  // Handle functionality for the "Done" button separately
  if (status === 'Claimed') {
    // Update document status to 'Done'
    updateDocumentStatus(docType, outerDocKey, innerDocKey, 'Claimed');
    
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
  if (target.classList.contains('publish-btn') && target.textContent === 'Claimed') {
    const [docType, outerDocKey, innerDocKey] = target.id.split('_');
    updateDocumentStatus(docType, outerDocKey, innerDocKey, 'Claimed');
    moveDoneRowsToFinishedDocuments(docType);
    fetchFinishedDocuments(docType); // Ensure that fetchFinishedDocuments is called after updating the document status
  }
});


// JavaScript code to handle printing when the button is clicked
document.getElementById('printButton').addEventListener('click', function() {
  // Wait for the table data to be loaded
  waitForDataToLoad().then(function() {
    // Once data is loaded, trigger the print dialog
    window.print();
  });
});


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




function waitForTableData() {
  return new Promise(function(resolve) {
    const tableRows = document.querySelectorAll('#doneDocumentsTable tbody tr');
    const tableVisible = document.getElementById('doneDocumentsTable').offsetHeight > 0;
    if (tableRows.length > 0 && tableVisible) {
      resolve();
    } else {
      setTimeout(function() {
        waitForTableData().then(resolve);
      }, 100);
    }
  });
}

document.getElementById('printButton').addEventListener('click', function() {
  waitForTableData().then(function() {
    // Load the content of printable.html
    fetch('printable.html')
      .then(response => response.text())
      .then(html => {
        // Create a hidden iframe
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        // Inject the table data into the content of printable.html
        const iframeDocument = iframe.contentWindow.document;
        iframeDocument.open();
        iframeDocument.write(html);

        // Find the table in the iframe
        const table = iframeDocument.getElementById('doneDocumentsTable');

        // Inject the table rows from the main document into the existing table
        const tableBody = table.getElementsByTagName('tbody')[0];
        const tableRows = document.querySelectorAll('#doneDocumentsTable tbody tr');
        tableRows.forEach(row => {
          tableBody.appendChild(row.cloneNode(true));
        });
        
        iframeDocument.close();

        // Print the content of the iframe
        iframe.onload = function() {
          iframe.contentWindow.print();
          setTimeout(function() {
            document.body.removeChild(iframe);
          }, 1000);
        };
      });
  });
});



// Get the "Done" button using its dynamically generated ID
const doneButton = document.getElementById(doneButtonId);

// Add event listener to the "Done" button
doneButton.addEventListener('click', async () => {
  // Handle functionality for the "Done" button separately
  if (status === 'Claimed') {
    // Update document status to 'Done'
    updateDocumentStatus(docType, outerDocKey, innerDocKey, 'Claimed');

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






