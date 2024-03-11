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

            // Iterate over each user
            Object.keys(users).forEach((userId) => {
                const userReports = users[userId];

                // Iterate over each report for the current user
                Object.values(userReports).forEach((report) => {
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
            });
        } else {
            // Display a message if there are no reports
            reportsTable.innerHTML += '<tr><td colspan="6">No reports available</td></tr>';
        }
    });
}



// Execute the countReports and displayReports functions when the window is loaded
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