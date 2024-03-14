import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Reference to the 'Resident_Reports' node
const reportsRef = ref(database, 'Resident_Reports');

// Map of property names to their corresponding titles
const propertyTitles = {
  resCurLoc: 'Current Location',
  resName: 'Name of Resident',
  resReport: 'Report',
  reportType: 'Report Type',
  phoneNumber: 'Phone number'
};
function displayReports() {
    onValue(reportsRef, (snapshot) => {
        const reportsTable = document.getElementById('reports');

        // Clear existing reports and headers
        reportsTable.innerHTML = '';

        // Add column titles
        const tableHeaders = `
            <tr>
                <th>Name of Resident</th>
                <th>Current Location</th>
                <th>Report</th>
                <th>Report Type</th>
                <th>Phone Number</th>
                <th>Date and Time of Incident</th>
            </tr>
        `;
        reportsTable.innerHTML += tableHeaders;

        // Check if snapshot exists and has data
        if (snapshot.exists() && snapshot.val()) {
            // Convert the snapshot to an object containing user IDs as keys
            const users = snapshot.val();

            // Create an array to store all reports
            const allReports = [];

            // Iterate over each user
            Object.keys(users).forEach((userId) => {
                const userReports = users[userId];
                
                // Iterate over each report for the current user
                Object.values(userReports).forEach((report) => {
                    allReports.push(report);
                });
            });

            // Sort the reports by timestamp in descending order
            allReports.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));

            // Iterate over sorted reports and display them
            allReports.forEach((report) => {
                // Format timestamp
                const timestamp = new Date(report.timeStamp).toLocaleString();

                // Create table row for the report
                const reportHtml = `
                    <tr>
                        <td>${report.resName}</td>
                        <td>${report.resCurLoc}</td>
                        <td>${report.resReport}</td>
                        <td>${report.reportType}</td>
                        <td>${report.phoneNumber}</td>
                        <td>${timestamp}</td>
                    </tr>
                `;
                reportsTable.innerHTML += reportHtml;
            });
        } else {
            // Display a message if there are no reports
            reportsTable.innerHTML += '<tr><td colspan="6">No reports available</td></tr>';
        }
    });
}

// Execute the displayReports function when the window is loaded
window.onload = function () {
    console.log('Window loaded');
    displayReports();
};



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







 // JavaScript code to handle printing when the button is clicked
document.getElementById('printButton').addEventListener('click', function() {
    waitForTableData().then(function() {
        // Load the content of printable.html
        fetch('printable_reports.html') // Make sure the path is correct
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
                const tableRows = document.querySelectorAll('#reports tbody tr');
                tableRows.forEach(row => {
                    tableBody.appendChild(row.cloneNode(true));
                });

                iframeDocument.close();

                // Print the content of the iframe
                iframe.onload = function() {
                    // Use window.print() inside the iframe to trigger the print dialog
                    iframe.contentWindow.print();
                    setTimeout(function() {
                        document.body.removeChild(iframe);
                    }, 1000);
                };
            });
    });
});


function waitForTableData() {
    return new Promise(function(resolve) {
        const tableRows = document.querySelectorAll('#reports tbody tr');
        const tableVisible = document.getElementById('reports').offsetHeight > 0;
        if (tableRows.length > 0 && tableVisible) {
            resolve();
        } else {
            setTimeout(function() {
                waitForTableData().then(resolve);
            }, 100);
        }
    });
}








// Function to clear the table
function clearTable() {
    const reportsTable = document.getElementById('reports');
    const tbody = reportsTable.getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // Clear existing table body
}

// Function to filter reports based on category
function filterReportsByCategory(snapshot, category) {
    console.log('Snapshot:', snapshot.val());

    // Function to format date
    function formatDate(date) {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    }

    // Clear the table before displaying filtered data
    clearTable(); 

    // Convert the snapshot to an array
    const reports = snapshot.val();

    // Get the table body
    const tbody = document.getElementById('reports').getElementsByTagName('tbody')[0];

    // Iterate through the reports in reverse order
    for (const userId in reports) {
        if (reports.hasOwnProperty(userId)) {
            const userReports = reports[userId];
            const reportIds = Object.keys(userReports).reverse(); // Reverse the order of report IDs
            for (const reportId of reportIds) {
                const report = userReports[reportId];
                console.log('Report:', report);
                // Check if the report matches the selected category
                if (category === 'All' || report.reportType === category) {
                    const resName = report.resName || 'N/A';
                    const resCurLoc = report.resCurLoc || 'N/A';
                    const resReport = report.resReport || 'N/A';
                    const phoneNumber = report.phoneNumber || 'N/A';
                    const timestamp = report.timeStamp ? formatDate(new Date(report.timeStamp)) : 'Invalid Date';

                    // Create a new row in the table
                    const row = tbody.insertRow();
                    row.innerHTML = `
                        <td>${resName}</td>
                        <td>${phoneNumber}</td>
                        <td>${resReport}</td>
                        <td>${report.reportType}</td>
                        <td>${resCurLoc}</td>
                        <td>${timestamp}</td>
                    `;
                }
            }
        }
    }
}

// Function to display reports based on selected category
function displayReportsByCategory(category) {
    onValue(reportsRef, (snapshot) => {
        filterReportsByCategory(snapshot, category);
    });
}

// Execute the displayReportsByCategory function when the window is loaded
window.onload = function () {
    displayReportsByCategory('All');
};

// Add event listeners to category links in the dropdown menu
document.getElementById('allCategory').addEventListener('click', function() {
    displayReportsByCategory('All');
});

document.getElementById('IncidentCategory').addEventListener('click', function() {
    displayReportsByCategory('Incident Report');
});

document.getElementById('NoiseCategory').addEventListener('click', function() {
    displayReportsByCategory('Noise Complaint');
});

document.getElementById('LostCategory').addEventListener('click', function() {
    displayReportsByCategory('Lost and Found Report');
});

document.getElementById('CommunitysCategory').addEventListener('click', function() {
    displayReportsByCategory('Community Report');
});

document.getElementById('NaturalCategory').addEventListener('click', function() {
    displayReportsByCategory('Natural Disaster Incident Report');
});