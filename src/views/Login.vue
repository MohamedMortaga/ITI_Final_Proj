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

export default {
  name: "Login",
  setup() {
    const email = ref('');
    const password = ref('');
    const { login, error } = useLogin();
    const router = useRouter();

    const handleSubmit = async () => {
      await login(email.value, password.value);
      if (!error.value) {
        router.push({ name: 'HomePage' }); 
      }
    };

    return {
      email,
      password,
      handleSubmit,
      error
    };
  }
}
</script>

<style scoped>

</style>
