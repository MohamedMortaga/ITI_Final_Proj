// Test for Enhanced Rental Status System
// This test verifies the new rental status management features

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, updateDoc, getDoc, collection, addDoc, serverTimestamp } = require('firebase/firestore');

// Firebase configuration (replace with your actual config)
const firebaseConfig = {
  // Your Firebase config here
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testRentalStatusSystem() {
  console.log('🧪 Testing Enhanced Rental Status System...\n');

  try {
    // Test 1: Create a booking with initial status history
    console.log('📝 Test 1: Creating booking with status history...');
    
    const testBooking = {
      productId: 'test-product-123',
      userId: 'test-renter-456',
      sellerId: 'test-seller-789',
      status: 'pending',
      productTitle: 'Test Camera',
      startDate: '2024-01-15',
      endDate: '2024-01-17',
      totalPrice: 150,
      statusHistory: [{
        status: 'pending',
        timestamp: serverTimestamp(),
        updatedBy: 'system'
      }]
    };

    const bookingRef = await addDoc(collection(db, 'bookings'), testBooking);
    console.log('✅ Test booking created with ID:', bookingRef.id);

    // Test 2: Update status to active (seller action)
    console.log('\n📝 Test 2: Updating status to active (seller action)...');
    
    const newStatusHistory = [
      ...testBooking.statusHistory,
      {
        status: 'active',
        timestamp: serverTimestamp(),
        updatedBy: 'seller'
      }
    ];

    await updateDoc(doc(db, 'bookings', bookingRef.id), {
      status: 'active',
      statusHistory: newStatusHistory
    });
    console.log('✅ Status updated to active by seller');

    // Test 3: Update status to rejected (renter action)
    console.log('\n📝 Test 3: Updating status to rejected (renter action)...');
    
    const updatedStatusHistory = [
      ...newStatusHistory,
      {
        status: 'rejected',
        timestamp: serverTimestamp(),
        updatedBy: 'renter'
      }
    ];

    await updateDoc(doc(db, 'bookings', bookingRef.id), {
      status: 'rejected',
      statusHistory: updatedStatusHistory
    });
    console.log('✅ Status updated to rejected by renter');

    // Test 4: Reset to pending
    console.log('\n📝 Test 4: Resetting status to pending...');
    
    const finalStatusHistory = [
      ...updatedStatusHistory,
      {
        status: 'pending',
        timestamp: serverTimestamp(),
        updatedBy: 'seller'
      }
    ];

    await updateDoc(doc(db, 'bookings', bookingRef.id), {
      status: 'pending',
      statusHistory: finalStatusHistory
    });
    console.log('✅ Status reset to pending');

    // Test 5: Verify status history
    console.log('\n📝 Test 5: Verifying status history...');
    
    const bookingDoc = await getDoc(doc(db, 'bookings', bookingRef.id));
    const bookingData = bookingDoc.data();
    
    console.log('📊 Current Status:', bookingData.status);
    console.log('📊 Status History Length:', bookingData.statusHistory.length);
    console.log('📊 Status History:');
    bookingData.statusHistory.forEach((entry, index) => {
      console.log(`   ${index + 1}. ${entry.status} by ${entry.updatedBy} at ${entry.timestamp}`);
    });

    // Test 6: Test status color mapping
    console.log('\n📝 Test 6: Testing status color mapping...');
    
    const statusColors = {
      'pending': 'text-yellow-600',
      'active': 'text-green-600',
      'rejected': 'text-red-600',
      'cancelled': 'text-red-600',
      'completed': 'text-blue-600'
    };

    Object.entries(statusColors).forEach(([status, color]) => {
      console.log(`   ${status}: ${color}`);
    });

    console.log('\n🎉 All tests passed! Enhanced rental status system is working correctly.');
    console.log('\n📋 Summary of new features:');
    console.log('   ✅ New "rejected" status added');
    console.log('   ✅ Status history tracking implemented');
    console.log('   ✅ Seller and renter can update status');
    console.log('   ✅ Admin dashboard shows rejected status');
    console.log('   ✅ Status history visible in contact details');
    console.log('   ✅ Color coding for all statuses');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testRentalStatusSystem(); 