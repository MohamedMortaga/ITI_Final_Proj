// Browser-compatible script to add notification data
// This can be run in the browser console to add the notification data

// Import Firebase modules (assuming they're available globally)
const { initializeApp } = firebase;
const { getFirestore, collection, addDoc } = firebase.firestore;

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDzUUKgvADh2XtOatPYcWt2umQbZSyiNF4',
  authDomain: 'test-7b62c.firebaseapp.com',
  projectId: 'test-7b62c',
  storageBucket: 'test-7b62c.appspot.com',
  messagingSenderId: '402993824560',
  appId: '1:402993824560:web:78f65da4e841a4446b3ef5',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Notification data from user
const notificationData = {
  chatId: "EBFh8ZMa1KWrZxJJgqKAC3URB1A2_anM57nMOkXb9X8N0fHQTm23bY763",
  content: "01022194510\\",
  detectedAt: "2025-07-27T20:02:02.759Z",
  issue: "phone number",
  messageId: "user-1",
  timestamp: 1658971116,
  userId: "anM57nMOkXb9X8N0fHQTm23bY763"
};

// Function to add notification to database
const addNotificationToDatabase = async () => {
  try {
    const notificationsRef = collection(db, 'notifications');
    const docRef = await addDoc(notificationsRef, {
      ...notificationData,
      type: 'chat_issue',
      title: `Issue Detected: ${notificationData.issue}`,
      message: `Detected ${notificationData.issue} in chat message`,
      read: false,
      adminId: 'admin',
      createdAt: new Date().toISOString()
    });
    
    console.log('Notification added successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding notification:', error);
    throw error;
  }
};

// Function to add multiple notifications for testing
const addMultipleNotifications = async () => {
  const testNotifications = [
    {
      chatId: "EBFh8ZMa1KWrZxJJgqKAC3URB1A2_anM57nMOkXb9X8N0fHQTm23bY763",
      content: "01022194510\\",
      detectedAt: "2025-07-27T20:02:02.759Z",
      issue: "phone number",
      messageId: "user-1",
      timestamp: 1658971116,
      userId: "anM57nMOkXb9X8N0fHQTm23bY763"
    },
    {
      chatId: "EBFh8ZMa1KWrZxJJgqKAC3URB1A2_anM57nMOkXb9X8N0fHQTm23bY763",
      content: "test@example.com",
      detectedAt: "2025-07-27T19:30:00.000Z",
      issue: "email",
      messageId: "user-2",
      timestamp: 1658970600,
      userId: "anM57nMOkXb9X8N0fHQTm23bY763"
    },
    {
      chatId: "EBFh8ZMa1KWrZxJJgqKAC3URB1A2_anM57nMOkXb9X8N0fHQTm23bY763",
      content: "Hello, I need help with my rental",
      detectedAt: "2025-07-27T18:45:00.000Z",
      issue: "general",
      messageId: "user-3",
      timestamp: 1658966700,
      userId: "anM57nMOkXb9X8N0fHQTm23bY763"
    }
  ];

  for (const notification of testNotifications) {
    try {
      const notificationsRef = collection(db, 'notifications');
      const docRef = await addDoc(notificationsRef, {
        ...notification,
        type: 'chat_issue',
        title: `Issue Detected: ${notification.issue}`,
        message: `Detected ${notification.issue} in chat message`,
        read: false,
        adminId: 'admin',
        createdAt: new Date().toISOString()
      });
      console.log(`Added notification for ${notification.issue} with ID:`, docRef.id);
    } catch (error) {
      console.error(`Failed to add notification for ${notification.issue}:`, error);
    }
  }
};

// Make functions available globally
window.addNotificationToDatabase = addNotificationToDatabase;
window.addMultipleNotifications = addMultipleNotifications;

console.log('Notification functions loaded. Use addNotificationToDatabase() or addMultipleNotifications() to add data.'); 