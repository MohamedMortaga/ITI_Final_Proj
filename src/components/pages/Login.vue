<template>
    <div>
        <div class="m-4 text-center">
            <h1 class="text-2xl font-medium text-blue-600 md:text-3xl">Login</h1>  
        </div>     
        <form class="mt-6 flex flex-col items-center space-y-4">
            <div class="w-full max-w-xs">
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" name="email" required
                    class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email">
            </div>
            <div class="w-full max-w-xs">
                <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" id="password" name="password" required
                    class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus: ring-2 focus:ring-blue-500"
                    placeholder="Enter your password">
            </div>
            <button type="submit"
                    class="w-full max-w-xs rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Log In
            </button>
        </form>
    </div>
</template>
<script>
    export default {
        name: "Login", 
        data() {
            return {
            }
        },
        methods:{
          
        },
        created() {
        },
    }
   
</script>

<style lang="less" scoped>

</style>