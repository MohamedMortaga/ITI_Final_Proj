<template>
  <form @submit.prevent="$emit('submitForm')" class="bg-white p-6 rounded-2xl shadow-lg mb-8 dark:bg-gray-800">
    <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 text-center">
      {{ isEdit ? $t('edit') : $t('addTool') }}
    </h2>

    <!-- Title -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{$t('productTitlePlaceholder')}}</label>
      <input
        v-model="form.title"
        type="text"
        :placeholder="$t('productTitlePlaceholder')"
        class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-pink-500"
        required
      />
    </div>

    <!-- Image Upload -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{$t('productImage')}}</label>
      <input
        type="file"
        @change="$emit('imageUpload', $event)"
        accept="image/*"
        class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
      />
      <div v-if="form.image" class="mt-3">
        <img :key="form.image" :src="form.image" :alt="$t('productImage')" class="h-36 w-full object-cover rounded-lg border border-gray-300 dark:border-gray-600" />
      </div>
      <p v-else class="text-sm text-red-500 mt-2 dark:text-red-400">{{$t('noImageUploaded')}}</p>
      <p v-if="uploading" class="text-sm text-pink-500 mt-2">{{$t('uploadingImage')}}</p>
    </div>

    <!-- Category -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{$t('selectCategory')}}</label>
      <select
        v-model="form.category"
        class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-pink-500"
        required
      >
        <option disabled value="">{{$t('selectCategory')}}</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.name">
          {{ cat.name }}
        </option>
      </select>
    </div>

    <!-- Price -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{$t('price')}}</label>
      <input
        v-model.number="form.price"
        type="number"
        :placeholder="$t('productPricePlaceholder')"
        class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-pink-500"
        required
      />
    </div>

    <!-- Details -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{$t('details')}}</label>
      <textarea
        v-model="form.details"
        :placeholder="$t('productDetailsPlaceholder')"
        rows="4"
        class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-pink-500"
      ></textarea>
    </div>

    <!-- Submit Button -->
    <button
      type="submit"
      class="w-full bg-pink-600 hover:bg-pink-700 transition-colors text-white font-semibold py-3 px-6 rounded-lg"
    >
      {{ isEdit ? $t('edit') : $t('addTool') }}
    </button>
  </form>
</template>

<script setup>
defineProps(['form', 'categories', 'isEdit', 'uploading']);
defineEmits(['submitForm', 'imageUpload']);
</script>
