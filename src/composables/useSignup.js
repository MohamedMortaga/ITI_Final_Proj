import { ref } from 'vue';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  sendEmailVerification,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider } from '@/firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import Swal from 'sweetalert2';

const error = ref(null);
const userName = ref(null);

const updateUserDoc = async (user, displayName, defaultRole = 'user') => {
  // Fetch existing user document to preserve role
  const userDocRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userDocRef);
  const existingRole = userDoc.exists() ? userDoc.data().role : defaultRole;

  await setDoc(userDocRef, {
    email: user.email.toLowerCase(),
    displayName: displayName || 'User',
    role: existingRole, // Preserve existing role or use defaultRole for new users
    createdAt: new Date().toISOString(),
  }, { merge: true });
};

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

    // Listen for email verification
    onAuthStateChanged(auth, async (verifiedUser) => {
      if (verifiedUser && verifiedUser.emailVerified) {
        // Store user data in Firestore with preserved role only after verification
        await updateUserDoc(verifiedUser, displayName);
        Swal.fire({
          icon: 'success',
          title: 'Email Verified!',
          text: 'Your account has been created and added to the users table. Please log in.',
          timer: 3000,
          showConfirmButton: true,
        });
        await signOut(auth); // Sign out after verification and storage
      }
    });

    // Sign out the user to prevent automatic login before verification
    await signOut(auth);

    // Update userName ref for immediate use
    userName.value = displayName;

    Swal.fire({
      icon: 'info',
      title: 'Verification Required',
      text: 'A verification email has been sent. Please verify your email to complete registration.',
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

    // Store user data in Firestore with preserved role
    await updateUserDoc(user, user.displayName || 'Google User');

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