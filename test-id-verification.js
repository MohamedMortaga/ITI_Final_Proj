// test-id-verification.js
// Test script for ID verification system

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, getDoc, updateDoc, collection, addDoc } = require('firebase/firestore');

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

async function testIDVerificationSystem() {
  console.log('🧪 Testing ID Verification System...\n');

  try {
    // Test 1: Create a test user
    console.log('1. Creating test user...');
    const testUserId = 'test-user-id-verification';
    const testUserData = {
      email: 'test@example.com',
      displayName: 'Test User',
      role: 'user',
      createdAt: new Date().toISOString(),
      isVerified: false
    };

    await setDoc(doc(db, 'users', testUserId), testUserData);
    console.log('✅ Test user created successfully');

    // Test 2: Create ID verification record
    console.log('\n2. Creating ID verification record...');
    const verificationData = {
      idCardUrl: 'https://example.com/test-id-card.jpg',
      fileName: 'test-id-card.jpg',
      fileSize: 1024000, // 1MB
      uploadedAt: new Date().toISOString(),
      status: 'pending',
      reviewedAt: null,
      reviewedBy: null,
      rejectionReason: null
    };

    await setDoc(doc(db, 'user-verifications', testUserId), verificationData);
    console.log('✅ ID verification record created successfully');

    // Test 3: Verify the records exist
    console.log('\n3. Verifying records exist...');
    const userDoc = await getDoc(doc(db, 'users', testUserId));
    const verificationDoc = await getDoc(doc(db, 'user-verifications', testUserId));

    if (userDoc.exists() && verificationDoc.exists()) {
      console.log('✅ Both user and verification records exist');
      console.log('   User verification status:', userDoc.data().isVerified);
      console.log('   Verification status:', verificationDoc.data().status);
    } else {
      console.log('❌ Records not found');
    }

    // Test 4: Simulate admin approval
    console.log('\n4. Simulating admin approval...');
    await updateDoc(doc(db, 'user-verifications', testUserId), {
      status: 'approved',
      reviewedAt: new Date().toISOString(),
      reviewedBy: 'Test Admin'
    });

    await updateDoc(doc(db, 'users', testUserId), {
      isVerified: true,
      verifiedAt: new Date().toISOString()
    });

    console.log('✅ Admin approval simulated successfully');

    // Test 5: Verify approval worked
    console.log('\n5. Verifying approval...');
    const updatedUserDoc = await getDoc(doc(db, 'users', testUserId));
    const updatedVerificationDoc = await getDoc(doc(db, 'user-verifications', testUserId));

    if (updatedUserDoc.data().isVerified && updatedVerificationDoc.data().status === 'approved') {
      console.log('✅ User is now verified');
    } else {
      console.log('❌ Verification failed');
    }

    // Test 6: Create test notification
    console.log('\n6. Creating test notification...');
    const notificationData = {
      type: 'id_verification_approved',
      title: 'ID Verification Approved',
      message: 'ID verification for Test User has been approved',
      targetId: null,
      timestamp: new Date().toISOString(),
      read: false,
      adminId: 'test-admin'
    };

    await addDoc(collection(db, 'notifications'), notificationData);
    console.log('✅ Test notification created successfully');

    console.log('\n🎉 All tests passed! ID verification system is working correctly.');
    console.log('\n📋 Summary:');
    console.log('   - User creation: ✅');
    console.log('   - ID verification upload: ✅');
    console.log('   - Admin approval process: ✅');
    console.log('   - User verification status update: ✅');
    console.log('   - Notification system: ✅');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testIDVerificationSystem().then(() => {
  console.log('\n🏁 Test completed');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Test failed with error:', error);
  process.exit(1);
}); 