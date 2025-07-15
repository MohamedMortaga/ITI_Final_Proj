<template>
    <div class="m-4 text-center">
        <h1 class="text-2xl font-medium text-blue-600 md:text-3xl">Home</h1>
    </div>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
  <div
    v-for="product in products"
    :key="product.id"
    class="bg-white rounded-2xl shadow-lg p-5 hover:shadow-2xl transition-all duration-300 border border-pink-200"
  >
    <h2 class="text-xl font-bold text-pink-600 mb-2">{{ product.title }}</h2>
    <p class="text-gray-700 text-sm mb-1"><span class="font-medium">Type:</span> {{ product.type }}</p>
    <p class="text-pink-500 font-semibold mb-1"><span class="font-medium">Price:</span> {{ product.price }} EGP</p>
    <p class="text-gray-600 text-sm"><span class="font-medium">Details:</span> {{ product.details }}</p>
  </div>
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