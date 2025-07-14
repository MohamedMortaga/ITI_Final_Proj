<template>
  <div class="m-4 text-center">
    <h1 class="text-2xl font-medium text-blue-600 md:text-3xl">Logging out...</h1>
  </div>
</template>

<script>
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';

export default {
  name: "Logout",
  setup() {
    const router = useRouter();
    const auth = getAuth();

    signOut(auth).then(() => {
      console.log('User signed out');
      router.push({ name: 'Login' }); 
    }).catch((error) => {
      console.error('Logout error:', error);
    });

    return {};
  }
}
</script>

<style scoped>
</style>
