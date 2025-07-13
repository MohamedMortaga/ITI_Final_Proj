<template>
    <div>
        <h1 class="alert alert-danger">Error</h1>
        <button class="btn btn-warning" @click="back">Go to Home</button>
    </div>
</template>

<script>
    export default {
        name: "ErrorPage", 
        methods: {
            back() {
                this.$router.push('/');
            }
        }, 
    }
</script>

<style lang="less" scoped>

</style>