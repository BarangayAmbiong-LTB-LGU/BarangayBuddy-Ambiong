import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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
  resReport: 'Report'
};


function displayReports() {
    onValue(reportsRef, (snapshot) => {
        const reportsTable = document.getElementById('reports');

        // Clear existing reports and headers
        reportsTable.innerHTML = '';

        // Convert the snapshot to an array
        const reportsArray = Object.values(snapshot.val());

        // Reverse the order of the reports array
        reportsArray.reverse();

        // Check if there are reports
        if (reportsArray.length > 0) {
            // Get the properties of the first report
            const reportKeys = Object.keys(reportsArray[0]);

            // Remove the 'resId' and 'timeStamp' properties from the keys
            const filteredReportKeys = reportKeys.filter(key => key !== 'resId' && key !== 'timeStamp');

            // Create table headers based on filtered report properties
            const tableHeaders = `
                <tr>
                    ${filteredReportKeys.map(key => `<th>${propertyTitles[key]}</th>`).join('')}
                    <th>Date and Time of Incident</th>
                </tr>
            `;
            reportsTable.innerHTML += tableHeaders;

            // Iterate through the reversed reports and display them
            reportsArray.forEach((report, index) => {
                // Remove the 'resId' property from the report object
                delete report.resId;
                
                // Format timestamp
                const timestamp = new Date(report.timeStamp).toLocaleString();

                const reportHtml = `
                    <tr${index === 0 ? ' class="new-report"' : ''}>
                        ${filteredReportKeys.map(key => `<td>${report[key]}</td>`).join('')}
                        <td>${timestamp}</td>
                    </tr>
                `;
                reportsTable.innerHTML += reportHtml;
            });
        } else {
            // Display a message if there are no reports
            reportsTable.innerHTML = '<tr><td colspan="4">No reports available</td></tr>';
        }
    });
}



// Execute the countReports and displayReports functions when the window is loaded
window.onload = function () {
    console.log('Window loaded');
    displayReports();
};
