const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, collection, getDocs } = require('firebase/firestore');

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

async function setupUserVerificationsCollection() {
  console.log('🚀 Setting up user-verifications collection in Firebase...\n');

  try {
    // 1. Create a sample verification document
    console.log('1. Creating sample verification document...');
    
    const sampleUserId = 'sample-user-123';
    const sampleVerificationData = {
      // Image URLs (will be populated when users upload)
      frontIdCardUrl: null,
      backIdCardUrl: null,
      
      // File metadata
      frontFileName: null,
      backFileName: null,
      frontFileSize: null,
      backFileSize: null,
      
      // Timestamps
      uploadedAt: null,
      submittedAt: null,
      
      // Verification status
      status: null, // null, 'pending', 'approved', 'rejected'
      
      // Admin review data
      reviewedAt: null,
      reviewedBy: null,
      rejectionReason: null
    };

    // Create the document in user-verifications collection
    await setDoc(doc(db, 'user-verifications', sampleUserId), sampleVerificationData);
    console.log('✅ Sample verification document created successfully');

    // 2. Verify the collection exists by reading from it
    console.log('\n2. Verifying collection exists...');
    const verificationsSnapshot = await getDocs(collection(db, 'user-verifications'));
    console.log(`✅ Collection verified - Found ${verificationsSnapshot.size} document(s)`);

    // 3. Display the created document
    console.log('\n3. Sample document structure:');
    verificationsSnapshot.forEach(doc => {
      console.log(`   Document ID: ${doc.id}`);
      console.log('   Fields:', JSON.stringify(doc.data(), null, 2));
    });

    console.log('\n🎉 user-verifications collection setup completed successfully!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Set up Firebase Storage rules for id-cards folder');
    console.log('   2. Configure Firestore security rules');
    console.log('   3. Test the ID verification upload functionality');
    console.log('   4. Update your users collection to include isVerified field');

  } catch (error) {
    console.error('❌ Error setting up collection:', error);
    console.error('Stack trace:', error.stack);
  }
}

// Run the setup
setupUserVerificationsCollection().then(() => {
  console.log('\n🏁 Setup script completed');
  process.exit(0);
}).catch(error => {
  console.error('💥 Setup script failed:', error);
  process.exit(1);
}); 