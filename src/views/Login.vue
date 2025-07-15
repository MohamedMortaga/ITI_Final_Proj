<template>
  <div>
    <div class="m-4 text-center">
      <h1 class="text-2xl font-medium text-blue-600 md:text-3xl">Login</h1>
    </div>

    <form class="mt-6 flex flex-col items-center space-y-4" @submit.prevent="handleSubmit">
      <!-- Email Field -->
      <div class="w-full max-w-xs">
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input type="email" id="email" v-model="email" required
          class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your email" />
      </div>

      <!-- Password Field -->
      <div class="w-full max-w-xs">
        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
        <input type="password" id="password" v-model="password" required
          class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your password" />
      </div>

      <!-- Submit Button -->
      <button type="submit"
        class="w-full max-w-xs rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
        Log In
      </button>
      <!-- Google login -->
      <button @click="handleGoogleLogin"
        class="mt-4 bg-white text-black border border-gray-300 py-2 px-4 rounded hover:bg-gray-100 flex items-center gap-2">
        <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="google" />
        Sign in with Google
      </button>
      <!-- Greeting After Google Login -->
      <div v-if="userName" class="mt-4 text-center text-green-600">
        👋 Welcome {{ userName }}!
        <br />
        <button @click="router.push({ name: 'HomePage' })" class="mt-2 bg-green-500 text-white px-4 py-2 rounded">
          Continue to Home
        </button>
      </div>


      <!-- Error Message -->
      <div v-if="error" class="text-red-600 text-sm mt-2">
        {{ error }}
      </div>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import useLogin from '../composables/useLogin';
import Swal from 'sweetalert2';
export default {
  name: "Login",
  setup() {
    const email = ref('');
    const password = ref('');
    const { login, loginWithGoogle, error, userName } = useLogin();
    const router = useRouter();

    const handleSubmit = async () => {
      await login(email.value, password.value);
      if (!error.value) {
        Swal.fire({
          title: "Login successful! Welcome to our community!",
          icon: "success",
          draggable: true
        });
        router.push({ name: 'HomePage' });
      }
      else {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Oops Login unsuccessful... " +err.message,
            showConfirmButton: false,
            timer: 1500
          });
      }
    };

    const handleGoogleLogin = async () => {
      await loginWithGoogle();
      if (!error.value) {
        Swal.fire({
          title: "Login using Google successful! Welcome to our community!",
          icon: "success",
          draggable: true
        });
        router.push({ name: 'HomePage' });
      }
      else{
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Oops Login unsuccessful... " +err.message,
            showConfirmButton: false,
            timer: 1500
          });
      }
    };

    return {
      email,
      password,
      handleSubmit,
      handleGoogleLogin,
      error
    };
  }
}
</script>

<style scoped></style>