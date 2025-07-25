// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration
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
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // Export Storage instance
export const googleProvider = new GoogleAuthProvider();

// Updated RecaptchaVerifier initializer (kept as provided)
export const initializeRecaptchaVerifier = (containerId, authInstance = auth, options = {}) => {
  try {
    console.log('Initializing RecaptchaVerifier with container:', containerId, 'auth:', authInstance);
    if (!containerId) throw new Error('Container ID is required');
    if (!document.getElementById(containerId)) throw new Error(`Element #${containerId} not found`);
    if (!authInstance) throw new Error('Auth instance is required');

    return new RecaptchaVerifier(authInstance, containerId, {
      size: options.size || 'invisible',
      callback: (response) => {
        console.log('reCAPTCHA solved:', response);
        if (options.callback) options.callback(response);
      },
      'expired-callback': () => {
        console.warn('reCAPTCHA expired, resetting');
        if (options['expired-callback']) options['expired-callback']();
      },
    });
  } catch (error) {
    console.error('Error initializing RecaptchaVerifier:', error);
    throw error;
  }
};