import { ref } from 'vue';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider, db } from '@/firebase/config';
import { FacebookAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';

const error = ref(null);
const userName = ref(null);

// Initialize Facebook provider
const facebookProvider = new FacebookAuthProvider();

const updateUserDoc = async (user, defaultDisplayName, defaultImageUrl = '') => {
  // Fetch existing user document to preserve role
  const userDocRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userDocRef);
  const existingRole = userDoc.exists() ? userDoc.data().role : 'user';

  await setDoc(userDocRef, {
    email: user.email.toLowerCase(),
    displayName: user.displayName || defaultDisplayName,
    role: existingRole, // Preserve existing role or set to "user" for new users
    createdAt: new Date().toISOString(),
    imageUrl: user.photoURL || defaultImageUrl, // Use provided or default image URL
  }, { merge: true });
};

const login = async (email, password) => {
  error.value = null;
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const user = res.user;
    if (!user) throw new Error('Login failed');

    if (!user.emailVerified) {
      await signOut(auth);
      error.value = 'Email not verified. Please check your inbox for the verification email.';
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: 'Email Verification Required',
        text: error.value,
        showConfirmButton: true,
        timer: 3000,
      });
      return null;
    }

    await updateUserDoc(user, 'User', '');
    userName.value = user.displayName || 'User';
    console.log('Logged in:', user.displayName);
    return user;
  } catch (err) {
    error.value = err.message;
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'Oops, Login unsuccessful',
      text: err.message,
      showConfirmButton: false,
      timer: 1500,
    });
    console.error('Login error:', err.message);
    return null;
  }
};

const loginWithGoogle = async () => {
  error.value = null;
  try {
    if (!googleProvider) {
      throw new Error('Google Provider is not initialized. Check firebase/config.js');
    }
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    if (!user) throw new Error('Google login failed');

    if (!user.emailVerified) {
      await signOut(auth);
      error.value = 'Email not verified. Please check your inbox for the verification email.';
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: 'Email Verification Required',
        text: error.value,
        showConfirmButton: true,
        timer: 3000,
      });
      return null;
    }

    await updateUserDoc(user, 'Google User', user.photoURL || '');
    userName.value = user.displayName || 'Google User';
    console.log('Signed in as:', user.displayName);
    return user;
  } catch (err) {
    error.value = err.message;
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'Oops, Google Login unsuccessful',
      text: err.message,
      showConfirmButton: false,
      timer: 1500,
    });
    console.error('Google sign-in error:', err.message);
    return null;
  }
};

const loginWithFacebook = async () => {
  error.value = null;
  try {
    if (!facebookProvider) {
      throw new Error('Facebook Provider is not initialized. Check firebase/config.js');
    }
    const result = await signInWithPopup(auth, facebookProvider);
    const user = result.user;
    if (!user) throw new Error('Facebook login failed');

    if (!user.emailVerified) {
      await signOut(auth);
      error.value = 'Email not verified. Please check your inbox for the verification email.';
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: 'Email Verification Required',
        text: error.value,
        showConfirmButton: true,
        timer: 3000,
      });
      return null;
    }

    await updateUserDoc(user, 'Facebook User', user.photoURL || '');
    userName.value = user.displayName || 'Facebook User';
    console.log('Logged in with Facebook:', user.displayName);
    return user;
  } catch (err) {
    error.value = err.message;
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'Oops, Facebook Login unsuccessful',
      text: err.message,
      showConfirmButton: false,
      timer: 1500,
    });
    console.error('Facebook login error:', err.message);
    return null;
  }
};

const useLogin = () => {
  return { login, loginWithGoogle, loginWithFacebook, error, userName };
};

export default useLogin;