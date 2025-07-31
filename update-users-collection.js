const { initializeApp } = require('firebase/app');
const { getFirestore, doc, updateDoc, collection, getDocs } = require('firebase/firestore');

// Firebase configuration (same as your config.js)
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

async function updateUsersCollection() {
  console.log('🚀 Updating users collection for ID verification...\n');

  try {
    // 1. Get all existing users
    console.log('1. Fetching existing users...');
    const usersSnapshot = await getDocs(collection(db, 'users'));
    console.log(`✅ Found ${usersSnapshot.size} user(s)`);

    if (usersSnapshot.empty) {
      console.log('⚠️ No users found in the collection');
      return;
    }

    // 2. Update each user to include verification fields
    console.log('\n2. Updating users with verification fields...');
    let updatedCount = 0;
    let skippedCount = 0;

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      
      // Check if user already has verification fields
      if (userData.hasOwnProperty('isVerified')) {
        console.log(`   ⏭️ User ${userDoc.id} already has verification fields - skipping`);
        skippedCount++;
        continue;
      }

      // Add verification fields
      const updateData = {
        isVerified: false,
        verifiedAt: null
      };

      await updateDoc(doc(db, 'users', userDoc.id), updateData);
      console.log(`   ✅ Updated user ${userDoc.id} with verification fields`);
      updatedCount++;
    }

    console.log(`\n📊 Update Summary:`);
    console.log(`   - Updated: ${updatedCount} user(s)`);
    console.log(`   - Skipped: ${skippedCount} user(s) (already had fields)`);
    console.log(`   - Total: ${usersSnapshot.size} user(s)`);

    // 3. Verify the updates
    console.log('\n3. Verifying updates...');
    const verifySnapshot = await getDocs(collection(db, 'users'));
    let verifiedCount = 0;

    verifySnapshot.forEach(doc => {
      const data = doc.data();
      if (data.hasOwnProperty('isVerified')) {
        verifiedCount++;
      }
    });

    console.log(`✅ Verification complete - ${verifiedCount}/${verifySnapshot.size} users have verification fields`);

    console.log('\n🎉 Users collection update completed successfully!');
    console.log('\n📋 Verification fields added:');
    console.log('   - isVerified: boolean (default: false)');
    console.log('   - verifiedAt: timestamp (default: null)');

  } catch (error) {
    console.error('❌ Error updating users collection:', error);
    console.error('Stack trace:', error.stack);
  }
}

// Run the update
updateUsersCollection().then(() => {
  console.log('\n🏁 Update script completed');
  process.exit(0);
}).catch(error => {
  console.error('💥 Update script failed:', error);
  process.exit(1);
}); 