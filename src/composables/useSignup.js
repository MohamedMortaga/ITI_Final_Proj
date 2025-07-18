import { ref } from 'vue';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  sendEmailVerification,
  signOut,
} from 'firebase/auth';
import { auth, googleProvider } from '@/firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import Swal from 'sweetalert2';

const error = ref(null);
const userName = ref(null);

const signup = async (email, password, displayName) => {
  error.value = null;
  userName.value = null;

  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    if (!user) throw new Error('Could not complete signup');

    // Update user profile with displayName
    await updateProfile(user, { displayName });

    // Send email verification
    await sendEmailVerification(user, {
      url: `${window.location.origin}/login`, // Redirect to login page after verification
    });

    // Store user data in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      displayName: displayName,
      createdAt: new Date(),
    });

    // Sign out the user to prevent automatic login
    await signOut(auth);

    // Update userName ref for immediate use
    userName.value = displayName;

    Swal.fire({
      icon: 'success',
      title: 'Account Created!',
      text: 'A verification email has been sent to your inbox. Please verify your email before logging in.',
      timer: 3000,
      showConfirmButton: true,
    });

    return user;
  } catch (err) {
    error.value = err.message;
    Swal.fire({
      icon: 'error',
      title: 'Signup Failed',
      text: `Registration unsuccessful: ${err.message}`,
      showConfirmButton: true,
    });
    console.error('Signup error:', err.message);
    return null;
  }
};

const signupWithGoogle = async () => {
  error.value = null;
  userName.value = null;

  try {
    // Sign in with Google
    const userCredential = await signInWithPopup(auth, googleProvider);
    const user = userCredential.user;
    if (!user) throw new Error('Could not complete Google signup');

    // Store user data in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      displayName: user.displayName || 'Google User',
      createdAt: new Date(),
    });

    // Sign out the user to enforce manual login
    await signOut(auth);

    // Update userName ref
    userName.value = user.displayName || 'Google User';

    Swal.fire({
      icon: 'success',
      title: 'Signed Up with Google!',
      text: `Please log in to continue, ${user.displayName || 'User'}!`,
      timer: 1500,
      showConfirmButton: false,
    });

    return user;
  } catch (err) {
    error.value = err.message;
    Swal.fire({
      icon: 'error',
      title: 'Google Signup Failed',
      text: `Registration unsuccessful: ${err.message}`,
      showConfirmButton: true,
    });
    console.error('Google signup error:', err.message);
    return null;
  }
};

const useSignup = () => {
  return { signup, signupWithGoogle, error, userName };
};

export default useSignup;