import { ref } from 'vue';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '@/firebase/config';
import { FacebookAuthProvider } from 'firebase/auth';
import Swal from 'sweetalert2';

const error = ref(null);
const userName = ref(null);

const facebookProvider = new FacebookAuthProvider();

const login = async (email, password) => {
  error.value = null;
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const user = res.user;
    if (!user) throw new Error('Login failed');

    if (!user.emailVerified) {
      // Sign out unverified user
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
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    if (!user) throw new Error('Google login failed');

    // Google accounts are typically verified, but check for consistency
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
    const result = await signInWithPopup(auth, facebookProvider);
    const user = result.user;
    if (!user) throw new Error('Facebook login failed');

    // Check email verification for consistency
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