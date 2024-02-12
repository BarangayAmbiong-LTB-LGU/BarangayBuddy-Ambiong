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

function countReports() {
    const reportsCountElement = document.getElementById('totalReportsCount');
    if (reportsCountElement) {
        onValue(reportsRef, (snapshot) => {
            const reports = snapshot.val();
            const count = reports ? Object.keys(reports).length : 0;
            reportsCountElement.innerHTML = `<h2 style="font-size: 24px; text-align: right; margin-right: 20px;">Total reports: ${count}</h2>`;
        });
    } else {
        console.error("Element with ID 'totalReportsCount' not found.");
    }
}

document.addEventListener('DOMContentLoaded', function() {
    countReports();
});
