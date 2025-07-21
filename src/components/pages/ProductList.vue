<template>
  <div v-if="products.length" class="overflow-x-auto">
    <table class="min-w-full border border-gray-300 dark:border-gray-700">
      <thead class="bg-gray-100 dark:bg-gray-800 text-left">
        <tr>
          <th class="p-3 border-b text-[var(--Color-Text-Text-Primary)]">Image</th>
          <th class="p-3 border-b text-[var(--Color-Text-Text-Primary)]">Title</th>
          <th class="p-3 border-b dark:text-gray-200">Category</th>
          <th class="p-3 border-b dark:text-gray-200">Price</th>
          <th class="p-3 border-b dark:text-gray-200">Details</th>
          <th class="p-3 border-b dark:text-gray-200">Uploaded</th>
          <th class="p-3 border-b dark:text-gray-200">Owner</th>
          <th class="p-3 border-b dark:text-gray-200">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
          <td class="p-3 border-b">
            <img
              v-if="product.img"
              :src="product.img"
              alt="Product Image"
              class="w-16 h-16 object-cover rounded"
            />
            <span v-else class="text-red-500 text-sm dark:text-red-400">No image</span>
          </td>
          <td class="p-3 border-b text-pink-600 font-semibold dark:text-pink-400" v-html="highlightText(product.title)"></td>
          <td class="p-3 border-b">{{ product.category }}</td>
          <td class="p-3 border-b">{{ product.price }} EGP</td>
          <td class="p-3 border-b">{{ product.details }}</td>
          <td class="p-3 border-b">
            <span v-if="product.createdAt && product.createdAt.toDate">
              {{ product.createdAt.toDate().toLocaleString() }}
            </span>
          </td>
          <td class="p-3 border-b text-sm text-gray-600 dark:text-gray-300">
            {{ product.ownerName }}
          </td>
          <td class="p-3 border-b flex gap-2">
            <button @click="$emit('editProduct', product)" class="text-blue-600 dark:text-blue-400">Edit</button>
            <button @click="$emit('deleteProduct', product.id)" class="text-red-600 dark:text-red-400">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-else class="text-center text-gray-500 py-10 text-lg dark:text-gray-400">
    No products found.
  </div>
</template>

<script setup>
defineProps(['products', 'highlightText']);
defineEmits(['editProduct', 'deleteProduct']);
</script>
