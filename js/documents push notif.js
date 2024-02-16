import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
import { getMessaging } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging.js";

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
const messaging = getMessaging(app);

// Function to send push notification using FCM
function sendPushNotification(token, title, body) {
  const message = {
    notification: {
      title: title,
      body: body
    },
    token: token
  };

  // Send the message
  messaging.send(message)
    .then(() => {
      console.log('Push notification sent successfully');
    })
    .catch((error) => {
      console.error('Error sending push notification:', error);
    });
}

// Function to fetch user token from the database based on document type
function fetchUserToken(documentType, userId) {
  return new Promise((resolve, reject) => {
    const userTokenRef = ref(database, `RequestedDocuments/${documentType}/${userId}/userToken`);
    onValue(userTokenRef, (snapshot) => {
      const userToken = snapshot.val();
      if (userToken) {
        resolve(userToken);
      } else {
        reject(new Error("User token not found."));
      }
    }, {
      onlyOnce: true // This ensures that the callback is called only once
    });
  });
}

// Function to handle button click
function handleButtonClick(userId, documentType, action) {
  // Fetch user token from the database based on document type
  fetchUserToken(documentType, userId)
    .then(token => {
      // Send push notification based on the action
      let title, body;
      switch (action) {
        case 'accept':
          title = 'Request Accepted';
          body = 'Your request has been accepted.';
          break;
        case 'reject':
          title = 'Request Rejected';
          body = 'Your request has been rejected.';
          break;
        case 'finished':
          title = 'Task Finished';
          body = 'The task has been marked as finished.';
          break;
        default:
          // Handle invalid action
          return;
      }
      sendPushNotification(token, title, body);
    })
    .catch(error => {
      console.error('Error fetching user token:', error);
    });
}

