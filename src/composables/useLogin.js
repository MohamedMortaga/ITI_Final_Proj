import { ref } from 'vue';
import { getAuth, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/firebase/config';
import Swal from 'sweetalert2';
const error = ref(null);
const userName = ref(null);  
import { FacebookAuthProvider } from 'firebase/auth';

const facebookProvider = new FacebookAuthProvider();


const login = async (email, password) => {
  error.value = null;
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    if (!res.user) throw Error('Login failed');
    console.log("Logged in:", res.user);
  } catch (err) {
    Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Oops Login unsuccessful... " +err.message,
          showConfirmButton: false,
          timer: 1500
    });
    console.log(err.message);
    error.value = err.message;
  }
};

const loginWithGoogle = async () => {
  error.value = null;
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    userName.value = user.displayName; 
    console.log('Signed in as:', user.displayName);
  } catch (err) {
     Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Oops Login unsuccessful... " +err.message,
          showConfirmButton: false,
          timer: 1500
    });
    console.error('Google sign-in error:', err.message);
    error.value = err.message;
  }
};
const loginWithFacebook = async () => {
  error.value = null;
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    const user = result.user;
    console.log('Logged in with Facebook:', user.displayName);
  } catch (err) {
    console.error('Facebook login error:', err.message);
    error.value = err.message;
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Facebook login failed: ' + err.message,
    });
  }
};
const useLogin = () => {
  return {  loginWithFacebook, login, loginWithGoogle, error, userName };
};

export default useLogin;
