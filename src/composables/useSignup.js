// src/composables/useSignup.js
import { ref } from 'vue';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/firebase/config';

const error = ref(null);
const userName = ref(null);

const signup = async (email, password) => {
  error.value = null;
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    if (!res.user) throw Error('Signup failed');
    console.log('Signed up:', res.user);
  } catch (err) {
    console.log(err.message);
    error.value = err.message;
  }
};

const signupWithGoogle = async () => {
  error.value = null;
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    userName.value = user.displayName;
    console.log('Signed up with Google:', user.displayName);
  } catch (err) {
    error.value = err.message;
    console.error('Google signup error:', err.message);
  }
};

const useSignup = () => {
  return { signup, signupWithGoogle, error, userName };
};

export default useSignup;
