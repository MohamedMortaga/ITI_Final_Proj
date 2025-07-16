import { ref } from 'vue';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification
} from 'firebase/auth';
import { auth, googleProvider } from '@/firebase/config';
import Swal from 'sweetalert2';

const error = ref(null);
const userName = ref(null);

// Email/Password Signup + Email Verification
const signup = async (email, password) => {
  error.value = null;

  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    if (!res.user) throw new Error('Signup failed');

    // Send the verification email
    await sendEmailVerification(res.user);

    Swal.fire({
      icon: 'success',
      title: 'Account created!',
      text: 'A verification email has been sent. Please check your inbox before logging in.',
    });

  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Registration unsuccessful! ' + err.message,
    });
    console.error(err);
    error.value = err.message;
  }
};

// Google Signup (No email verification needed; Google handles it)
const signupWithGoogle = async () => {
  error.value = null;
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    userName.value = user.displayName;
    console.log('Signed up with Google:', user.displayName);
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Registration unsuccessful! ' + err.message,
    });
    error.value = err.message;
    console.error('Google signup error:', err.message);
  }
};

const useSignup = () => {
  return { signup, signupWithGoogle, error, userName };
};

export default useSignup;