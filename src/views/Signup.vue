<template>
  <div class="p-6 max-w-md mx-auto">
    <h1 class="text-2xl font-bold text-center text-pink-600 mb-6">Sign Up</h1>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <input v-model="email" type="email" placeholder="Email" class="input" />
      <input v-model="password" type="password" placeholder="Password" class="input" />
      <button type="submit" class="btn">Sign Up</button>
    </form>

    <div class="text-center my-4 text-gray-500">— OR —</div>

    <button @click="handleGoogleSignup" class="google-btn">
      <img src="https://img.icons8.com/color/16/000000/google-logo.png" />
      Sign Up with Google
    </button>

    <div v-if="userName" class="mt-4 text-green-600 text-center">
      👋 Welcome {{ userName }}!
      <button @click="router.push({ name: 'HomePage' })" class="btn mt-2 bg-green-600">
        Continue to Home
      </button>
    </div>

    <p v-if="error" class="text-red-600 mt-2 text-sm text-center">{{ error }}</p>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import useSignup from '../composables/useSignup';

export default {
  name: "Signup",
  setup() {
    const email = ref('');
    const password = ref('');
    const { signup, signupWithGoogle, error, userName } = useSignup();
    const router = useRouter();

    const handleSubmit = async () => {
      await signup(email.value, password.value);
      if (!error.value) {
        router.push({ name: 'HomePage' });
      }
    };

  const handleGoogleSignup = async () => {
  await signupWithGoogle();
  if (!error.value) {
    router.push({ name: 'HomePage' }); 
  }
};


    return {
      email,
      password,
      handleSubmit,
      handleGoogleSignup,
      error,
      userName,
      router
    };
  }
}
</script>

<style scoped>
.input {
  @apply block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500;
}
.btn {
  @apply w-full py-2 bg-pink-600 text-white rounded hover:bg-pink-700;
}
.google-btn {
  @apply flex items-center justify-center gap-2 w-full py-2 border border-gray-300 rounded hover:bg-gray-100;
}
</style>
