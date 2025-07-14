<template>
    <div>
        <div class="m-4 text-center">
            <h1 class="text-2xl font-medium text-blue-600 md:text-3xl">Signup</h1>  
        </div>     
        <form class="mt-6 flex flex-col items-center space-y-4" @submit.prevent="handleSubmit">
            <div class="w-full max-w-xs">
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" name="email" required v-model="email"
                    class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email">
            </div>
            <div class="w-full max-w-xs">
                <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" id="password" name="password" required v-model="password"
                    class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your password">
            </div>
            <button type="submit"
                    class="w-full max-w-xs rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Sign UP
            </button>
            <div v-if="error">
                {{ error }}
            </div>
        </form>
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
        const { signup , error } = useSignup();
        const router = useRouter();
        const handleSubmit = async () => {
            await signup(email.value, password.value);
            if(!error.value){
                router.push({ name: 'Home' });
            }
            console.log(email.value, password.value);
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

<style lang="less" scoped>
</style>