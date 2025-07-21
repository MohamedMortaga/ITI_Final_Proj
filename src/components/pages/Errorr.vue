<template>
    <div>
        <h1 class="alert alert-danger">{{$t('error')}}</h1>
        <button class="btn btn-warning" @click="back">{{$t('goToHome')}}</button>
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