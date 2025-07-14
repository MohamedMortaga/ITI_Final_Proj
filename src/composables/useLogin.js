import { ref } from 'vue';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const error = ref(null);

const login = async (email, password) => {
  error.value = null;

  try {
    const auth = getAuth();
    const res = await signInWithEmailAndPassword(auth, email, password);
    if (!res.user) throw Error('Login failed');
    console.log("Logged in:", res.user);
  } catch (err) {
    console.log(err.message);
    error.value = err.message;
  }
};

const useLogin = () => {
  return { login, error };
};

export default useLogin;
