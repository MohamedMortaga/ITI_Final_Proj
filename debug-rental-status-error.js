// Debug script for rental status update error
// This script will help identify the exact cause of the "Failed to update rental status" error

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, updateDoc, getDoc, collection, addDoc, serverTimestamp } = require('firebase/firestore');

// Firebase configuration (replace with your actual config)
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

async function debugRentalStatusError() {
  console.log('🔍 Debugging Rental Status Update Error...\n');

  try {
    // Step 1: Check if we can access the bookings collection
    console.log('📝 Step 1: Testing basic Firestore access...');
    
    // Try to create a test document
    const testDoc = await addDoc(collection(db, 'test-debug'), {
      test: true,
      timestamp: serverTimestamp()
    });
    console.log('✅ Can create documents in Firestore');
    
    // Clean up test document
    // await deleteDoc(doc(db, 'test-debug', testDoc.id));
    // console.log('✅ Can delete documents in Firestore');

    // Step 2: Check if bookings collection exists and has documents
    console.log('\n📝 Step 2: Checking bookings collection...');
    
    // Try to get a sample booking document
    const bookingsRef = collection(db, 'bookings');
    console.log('✅ Bookings collection reference created');

    // Step 3: Test the exact update operation that's failing
    console.log('\n📝 Step 3: Testing the exact update operation...');
    
    // Create a test booking with the expected structure
    const testBooking = {
      productId: 'debug-test-product',
      userId: 'debug-test-renter',
      sellerId: 'debug-test-seller',
      status: 'pending',
      productTitle: 'Debug Test Camera',
      startDate: '2024-01-15',
      endDate: '2024-01-17',
      totalPrice: 150,
      statusHistory: [{
        status: 'pending',
        timestamp: serverTimestamp(),
        updatedBy: 'system'
      }]
    };

    console.log('📊 Creating test booking with structure:', JSON.stringify(testBooking, null, 2));
    
    const bookingRef = await addDoc(bookingsRef, testBooking);
    console.log('✅ Test booking created with ID:', bookingRef.id);

    // Step 4: Test the exact update operation from ContactDetails.vue
    console.log('\n📝 Step 4: Testing the exact updateRentalStatus operation...');
    
    const bookingId = bookingRef.id;
    const newStatus = 'active';
    const updatedBy = 'seller';

    // Get the current booking document (same as in ContactDetails.vue)
    const bookingDoc = doc(db, "bookings", bookingId);
    console.log('✅ Booking document reference created');

    const bookingSnap = await getDoc(bookingDoc);
    console.log('✅ Booking document retrieved');

    if (!bookingSnap.exists()) {
      console.log('❌ Booking not found - this would cause the error');
      return;
    }

    console.log('✅ Booking document exists');

    const bookingData = bookingSnap.data();
    console.log('📊 Current booking data:', JSON.stringify(bookingData, null, 2));

    // Check if statusHistory exists
    if (!bookingData.statusHistory) {
      console.log('⚠️  Warning: statusHistory field is missing, initializing it');
      bookingData.statusHistory = [];
    }

    // Add new status to history (same logic as ContactDetails.vue)
    const newStatusHistory = [...bookingData.statusHistory || [], {
      status: newStatus,
      timestamp: serverTimestamp(),
      updatedBy: updatedBy
    }];

    console.log('📊 New status history:', JSON.stringify(newStatusHistory, null, 2));

    // Update the booking document (same as ContactDetails.vue)
    console.log('🔄 Attempting to update booking document...');
    
    await updateDoc(bookingDoc, {
      status: newStatus,
      statusHistory: newStatusHistory
    });

    console.log('✅ Booking document updated successfully!');

    // Step 5: Verify the update worked
    console.log('\n📝 Step 5: Verifying the update...');
    
    const updatedBookingSnap = await getDoc(bookingDoc);
    const updatedBookingData = updatedBookingSnap.data();
    
    console.log('📊 Updated booking data:', JSON.stringify(updatedBookingData, null, 2));

    // Step 6: Test with a real booking ID from the database
    console.log('\n📝 Step 6: Testing with a real booking ID...');
    
    // Get a real booking from the database
    const realBookings = await getDocs(bookingsRef);
    const realBooking = realBookings.docs[0];
    
    if (realBooking) {
      console.log('📊 Found real booking with ID:', realBooking.id);
      console.log('📊 Real booking data:', JSON.stringify(realBooking.data(), null, 2));
      
      // Test update on real booking
      const realBookingDoc = doc(db, "bookings", realBooking.id);
      const realBookingSnap = await getDoc(realBookingDoc);
      
      if (realBookingSnap.exists()) {
        const realBookingData = realBookingSnap.data();
        
        // Check if this booking has the required fields
        console.log('📊 Real booking status:', realBookingData.status);
        console.log('📊 Real booking has statusHistory:', !!realBookingData.statusHistory);
        
        if (realBookingData.statusHistory) {
          console.log('📊 Real booking statusHistory length:', realBookingData.statusHistory.length);
        }
      }
    }

    console.log('\n🎉 Debug completed successfully!');
    console.log('\n📋 Possible causes of the original error:');
    console.log('   1. Firestore security rules blocking write operations');
    console.log('   2. Booking document missing required fields');
    console.log('   3. Network connectivity issues');
    console.log('   4. Firebase configuration issues');
    console.log('   5. User authentication issues');

  } catch (error) {
    console.error('❌ Debug failed with error:', error);
    console.error('❌ Error code:', error.code);
    console.error('❌ Error message:', error.message);
    
    if (error.code === 'permission-denied') {
      console.log('\n🔒 This is a Firestore security rules issue!');
      console.log('   Check your Firestore security rules for the "bookings" collection.');
    } else if (error.code === 'not-found') {
      console.log('\n📄 This is a document not found issue!');
      console.log('   The booking document might not exist or be accessible.');
    } else if (error.code === 'unavailable') {
      console.log('\n🌐 This is a network connectivity issue!');
      console.log('   Check your internet connection and Firebase project status.');
    }
  }
}

// Run the debug
debugRentalStatusError(); 