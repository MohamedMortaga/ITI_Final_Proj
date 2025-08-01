// Test file to diagnose rental status update issues
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

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
const auth = getAuth(app);
const db = getFirestore(app);

// Test Firebase connectivity
async function testFirebaseConnectivity() {
  try {
    console.log('Testing Firebase connectivity...');
    
    // Test reading a document
    const testDoc = doc(db, 'bookings', 'test-connection');
    const docSnap = await getDoc(testDoc);
    
    console.log('Firebase connectivity test passed');
    return true;
  } catch (error) {
    console.error('Firebase connectivity test failed:', error);
    return false;
  }
}

// Test booking document access
async function testBookingAccess(bookingId) {
  try {
    console.log(`Testing access to booking: ${bookingId}`);
    
    const bookingDoc = doc(db, 'bookings', bookingId);
    const bookingSnap = await getDoc(bookingDoc);
    
    if (!bookingSnap.exists()) {
      console.error('Booking document does not exist');
      return false;
    }
    
    const bookingData = bookingSnap.data();
    console.log('Booking data:', bookingData);
    
    return true;
  } catch (error) {
    console.error('Error accessing booking:', error);
    return false;
  }
}

// Test status update
async function testStatusUpdate(bookingId, newStatus, userId) {
  try {
    console.log(`Testing status update for booking: ${bookingId}`);
    
    const bookingDoc = doc(db, 'bookings', bookingId);
    
    // Get current booking data
    const bookingSnap = await getDoc(bookingDoc);
    if (!bookingSnap.exists()) {
      console.error('Booking not found');
      return false;
    }
    
    const bookingData = bookingSnap.data();
    console.log('Current booking data:', bookingData);
    
    // Check permissions
    const isSeller = bookingData.sellerId === userId;
    const isRenter = bookingData.userId === userId;
    
    if (!isSeller && !isRenter) {
      console.error('User does not have permission to update this booking');
      return false;
    }
    
    // Prepare update data
    const updateData = {
      status: newStatus,
      lastUpdated: serverTimestamp(),
      lastUpdatedBy: userId
    };
    
    // Update the document
    await updateDoc(bookingDoc, updateData);
    
    console.log('Status update successful');
    return true;
  } catch (error) {
    console.error('Error updating status:', error);
    return false;
  }
}

// Main test function
async function runTests() {
  console.log('Starting rental status update tests...');
  
  // Test 1: Firebase connectivity
  const connectivityTest = await testFirebaseConnectivity();
  if (!connectivityTest) {
    console.error('Firebase connectivity test failed. Check your internet connection and Firebase configuration.');
    return;
  }
  
  // Test 2: Authentication
  const currentUser = auth.currentUser;
  if (!currentUser) {
    console.error('No authenticated user found. Please log in first.');
    return;
  }
  
  console.log('Authenticated user:', currentUser.uid);
  
  // Test 3: Sample booking access (you'll need to provide a real booking ID)
  const sampleBookingId = 'your-booking-id-here'; // Replace with actual booking ID
  const bookingAccessTest = await testBookingAccess(sampleBookingId);
  
  if (bookingAccessTest) {
    // Test 4: Status update
    const statusUpdateTest = await testStatusUpdate(sampleBookingId, 'active', currentUser.uid);
    
    if (statusUpdateTest) {
      console.log('All tests passed! Rental status update should work correctly.');
    } else {
      console.error('Status update test failed. Check permissions and booking data.');
    }
  } else {
    console.error('Booking access test failed. Check if the booking exists and you have permission.');
  }
}

// Export functions for use in the main application
export {
  testFirebaseConnectivity,
  testBookingAccess,
  testStatusUpdate,
  runTests
};

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  runTests().catch(console.error);
} 