// Demo script to add notification data to Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

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
      await addNotificationToDatabase(notification);
      console.log(`Added notification for ${notification.issue}`);
    } catch (error) {
      console.error(`Failed to add notification for ${notification.issue}:`, error);
    }
  }
};

// Export functions for use in other files
export { addNotificationToDatabase, addMultipleNotifications };

// If running directly, add the notification
if (typeof window === 'undefined') {
  // Node.js environment
  addNotificationToDatabase()
    .then(() => {
      console.log('Demo notification added successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed to add demo notification:', error);
      process.exit(1);
    });
} 