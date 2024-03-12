
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

    // Function to filter documents based on status
    function filterDocumentsByStatus(snapshot, status) {
        console.log('Snapshot:', snapshot.val());
        const documentsTable = document.getElementById('doneDocumentsTable');
        const tbody = documentsTable.getElementsByTagName('tbody')[0];
        tbody.innerHTML = ''; // Clear existing table body

        // Convert the snapshot to an array
        const documents = snapshot.val();

        // Iterate through the documents
        for (const userId in documents) {
            if (documents.hasOwnProperty(userId)) {
                const userDocuments = documents[userId];
                for (const docId in userDocuments) {
                    if (userDocuments.hasOwnProperty(docId)) {
                        const document = userDocuments[docId];
                        console.log('Document:', document);
                        // Check if the document matches the selected status
                        if (status === 'All' || document.documentType === status) {
                            const fullName = document.fullName || 'N/A';
                            const age = document.age || 'N/A';
                            const dateOfBirth = document.dateOfBirth || 'N/A';
                            const gender = document.gender || 'N/A';
                            const presentAddress = document.presentAddress || 'N/A';
                            const purpose = document.purpose || 'N/A';
                            const timestamp = document.time ? new Date(document.time).toLocaleDateString() : 'Invalid Date';

                            const row = tbody.insertRow();
                            row.innerHTML = `
                                <td>${document.documentType}</td>
                                <td>${fullName}</td>
                                <td>${age}</td>
                                <td>${dateOfBirth}</td>
                                <td>${gender}</td>
                                <td>${presentAddress}</td>
                                <td>${purpose}</td>
                                <td>${hasCedula}</td>
                                <td>${timestamp}</td>
                                <td class="status-cell">Claimed</td>
                            `;
                            row.classList.add('document-row');
                            row.id = docId; // Set the row ID to the document ID
                        }
                    }
                }
            }
        }
    }


    // Function to append cells for finished documents
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


    // Function to display documents based on selected status
    function displayDocumentsByStatus(status) {
        const documentsRef = ref(database, 'FinishedDocuments');

        onValue(documentsRef, (snapshot) => {
            filterDocumentsByStatus(snapshot, status);
        });
    }

    // Add event listeners to category links in the dropdown menu
    document.getElementById('allCategory').addEventListener('click', function() {
        displayDocumentsByStatus('All');
    });

    document.getElementById('barangayClearanceCategory').addEventListener('click', function() {
        displayDocumentsByStatus('Barangay Clearance');
    });

    document.getElementById('businessClearanceCategory').addEventListener('click', function() {
        displayDocumentsByStatus('Business Clearance');
    });

    document.getElementById('IndegencyCategory').addEventListener('click', function() {
        displayDocumentsByStatus('Certificate of Indigency');
    });

    document.getElementById('residencyCategory').addEventListener('click', function() {
        displayDocumentsByStatus('Certificate of Residency');
    });

    document.getElementById('othersCategory').addEventListener('click', function() {
        displayDocumentsByStatus('Other Document');
    });


    function filterDocumentsByMonth(snapshot, monthIndex) {
        const documentsTable = document.getElementById('doneDocumentsTable');
        const tbody = documentsTable.getElementsByTagName('tbody')[0];
        tbody.innerHTML = ''; // Clear existing table body

        // Convert the snapshot to an array
        const documents = snapshot.val();

        // Iterate through the documents
        for (const userId in documents) {
            if (documents.hasOwnProperty(userId)) {
                const userDocuments = documents[userId];
                for (const docId in userDocuments) {
                    if (userDocuments.hasOwnProperty(docId)) {
                        const document = userDocuments[docId];
                        const date = new Date(document.time);
                        // Check if the document was requested in the selected month
                        if (monthIndex === -1 || date.getMonth() === monthIndex) {
                            const fullName = document.fullName || 'N/A';
                            const age = document.age || 'N/A';
                            const dateOfBirth = document.dateOfBirth || 'N/A';
                            const gender = document.gender || 'N/A';
                            const presentAddress = document.presentAddress || 'N/A';
                            const purpose = document.purpose || 'N/A';
                            const hasCedula = document.hasCedula || 'N/A';
                            const timestamp = document.time ? date.toLocaleDateString() : 'Invalid Date';

                            const row = tbody.insertRow();
                            row.innerHTML = `
                                <td>${document.documentType || 'N/A'}</td>
                                <td>${fullName}</td>
                                <td>${age}</td>
                                <td>${dateOfBirth}</td>
                                <td>${gender}</td>
                                <td>${presentAddress}</td>
                                <td>${purpose}</td>
                                <td>${timestamp}</td>
                                <td class="status-cell">Claimed</td>
                            `;
                            row.classList.add('document-row');
                            row.id = docId; // Set the row ID to the document ID
                        }
                    }
                }
            }
        }
    }

    // Function to display documents based on selected month
    function displayDocumentsByMonth(month) {
        const documentsRef = ref(database, 'FinishedDocuments');

        onValue(documentsRef, (snapshot) => {
            filterDocumentsByMonth(snapshot, month);
        });
    }

    // Function to display all documents
    function displayAllDocuments() {
        const documentsRef = ref(database, 'FinishedDocuments');

        onValue(documentsRef, (snapshot) => {
            filterDocumentsByMonth(snapshot, -1); // Pass -1 to indicate all time
        });
    }

    document.getElementById('ALL').addEventListener('click', function() {
        displayAllDocuments(); // Display all documents
    });

    document.getElementById('januaryMonth').addEventListener('click', function() {
        displayDocumentsByMonth(0); // January is 0-indexed
    });

    document.getElementById('februaryMonth').addEventListener('click', function() {
        displayDocumentsByMonth(1); // February is 1-indexed
    });
    document.getElementById('marchMonth').addEventListener('click', function() {
        displayDocumentsByMonth(2); // March is 2-indexed
    });

    document.getElementById('aprilMonth').addEventListener('click', function() {
        displayDocumentsByMonth(3); // April is 3-indexed
    });

    document.getElementById('mayMonth').addEventListener('click', function() {
        displayDocumentsByMonth(4); // May is 4-indexed
    });

    document.getElementById('juneMonth').addEventListener('click', function() {
        displayDocumentsByMonth(5); // June is 5-indexed
    });

    document.getElementById('julyMonth').addEventListener('click', function() {
        displayDocumentsByMonth(6); // July is 6-indexed
    });

    document.getElementById('augustMonth').addEventListener('click', function() {
        displayDocumentsByMonth(7); // August is 7-indexed
    });

    document.getElementById('septemberMonth').addEventListener('click', function() {
        displayDocumentsByMonth(8); // September is 8-indexed
    });

    document.getElementById('octoberMonth').addEventListener('click', function() {
        displayDocumentsByMonth(9); // October is 9-indexed
    });

    document.getElementById('novemberMonth').addEventListener('click', function() {
        displayDocumentsByMonth(10); // November is 10-indexed
    });

    document.getElementById('decemberMonth').addEventListener('click', function() {
        displayDocumentsByMonth(11); // December is 11-indexed
    });
