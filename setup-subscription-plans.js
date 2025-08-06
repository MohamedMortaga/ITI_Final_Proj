// setup-subscription-plans.js
// Script to initialize subscription plans in Firestore

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, collection, getDocs } = require('firebase/firestore');

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqQqQqQqQqQqQqQqQqQqQqQqQqQqQqQ",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefghijklmnop"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const subscriptionPlans = [
  {
    id: 'Magic',
    name: 'Magic',
    price: 0,
    description: 'Free plan with basic features',
    features: [
      'Access to all rental tools',
      'Standard customer support',
      'Basic email reminders',
      '24-hour rental periods'
    ],
    isActive: true,
    createdAt: new Date()
  },
  {
    id: 'Pro',
    name: 'Pro',
    price: 500, // 500 EGP per month
    description: 'Professional plan with enhanced features',
    features: [
      'Everything in Magic',
      'Priority customer support',
      'Comprehensive insurance',
      'Flexible rental periods',
      'No booking fees',
      'Early access to new tools'
    ],
    isActive: true,
    createdAt: new Date()
  },
  {
    id: 'Premium',
    name: 'Premium',
    price: 1200, // 1200 EGP per month
    description: 'Premium plan with exclusive features',
    features: [
      'Everything in Pro',
      '24/7 dedicated support',
      'Premium insurance',
      'Unlimited rental periods',
      'Priority booking',
      'Exclusive beta access',
      'Analytics dashboard'
    ],
    isActive: true,
    createdAt: new Date()
  }
];

async function setupSubscriptionPlans() {
  try {
    console.log('Setting up subscription plans...');
    
    // Check if plans already exist
    const plansSnapshot = await getDocs(collection(db, 'plans'));
    if (!plansSnapshot.empty) {
      console.log('Plans already exist. Skipping setup.');
      return;
    }

    // Create plans
    for (const plan of subscriptionPlans) {
      await setDoc(doc(db, 'plans', plan.id), plan);
      console.log(`Created plan: ${plan.name} - ${plan.price} EGP`);
    }

    console.log('Subscription plans setup completed successfully!');
  } catch (error) {
    console.error('Error setting up subscription plans:', error);
  }
}

// Run the setup
setupSubscriptionPlans(); 