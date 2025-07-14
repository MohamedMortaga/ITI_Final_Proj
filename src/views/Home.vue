<template>
    <div class="m-4 text-center">
        <h1 class="text-2xl font-medium text-blue-600 md:text-3xl">Home</h1>
    </div>
    <div class="m-4 text-center" v-for="product in products" :key="product.id">
        <p class="text-2xl font-medium text-pink-600 md:text-1xl">{{ product.title }}</p>

    </div>
</template>

<script>
import CreateProduct from '../composables/CreateProduct';
import getCollection from '../composables/getCollection';
    export default {
        name: "HomePage",
        components:{ CreateProduct },
        setup() {
            const { documents: products } = getCollection('products');
            return { products };
        }
    }
</script>

<style lang="less" scoped>

</style>