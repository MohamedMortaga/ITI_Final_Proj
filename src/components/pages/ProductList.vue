<template>
  <div v-if="products.length" class="space-y-4">
    <!-- Header Row -->
    <div class="grid grid-cols-8 gap-4 px-6 py-3 bg-[var(--Color-Surface-Surface-Primary)] dark:bg-[var(--Color-Surface-Surface-Primary)] rounded-xl font-semibold text-[var(--Color-Text-Text-Primary)] text-base">
      <div>{{$t('image') || 'Image'}}</div>
      <div>{{$t('productTitlePlaceholder')}}</div>
      <div>{{$t('category') || 'Category'}}</div>
      <div>{{$t('price')}}</div>
      <div>{{$t('details')}}</div>
      <div>{{$t('uploaded') || 'Uploaded'}}</div>
      <div>{{$t('owner')}}</div>
      <div>{{$t('actions')}}</div>
    </div>
    <!-- Product Cards -->
    <div
      v-for="product in products"
      :key="product.id"
      class="grid grid-cols-8 gap-4 items-center bg-white dark:bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl shadow-sm px-6 py-4"
    >
      <!-- Image -->
      <div>
        <img
          v-if="product.img"
          :src="product.img"
          alt="Product Image"
          class="w-16 h-16 object-cover rounded"
        />
        <span v-else class="text-red-500 text-sm dark:text-red-400">{{$t('noImage')}}</span>
      </div>
      <!-- Title -->
      <div class="text-[var(--Color-Text-Text-Primary)] dark:text-[var(--Color-Text-Text-Primary)] font-semibold font-nunito" v-html="highlightText(product.title)"></div>
      <!-- Category -->
      <div class="text-[var(--Color-Text-Text-Primary)] dark:text-[var(--Color-Text-Text-Primary)]  font-nunito">{{ product.category }}</div>
      <!-- Price -->
     <!-- Price -->
<div class="text-[var(--Color-Text-Text-Primary)] dark:text-[var(--Color-Text-Text-Primary)] font-nunito">
  {{ product.price }} EGP <br>
  <span class="text-xs text-[var(--Color-Text-Text-Secondary)] dark:text-[var(--Color-Text-Text-Secondary)] font-nunito">
    {{$t('perDay')}}
  </span>
  <br>
  <span class="text-sm text-green-600 dark:text-green-400 font-medium">
    {{$t('afterCommission')}}: {{ (product.price - product.price * 0.15).toFixed(2) }} EGP
  </span>
</div>

      <!-- Details -->
      <div class="text-[var(--Color-Text-Text-Primary)] dark:text-[var(--Color-Text-Text-Primary)]  font-nunito">{{ product.details }}</div>
      <!-- Uploaded -->
      <div>
        <span class="text-[var(--Color-Text-Text-Primary)] dark:text-[var(--Color-Text-Text-Primary)]  font-nunito" v-if="product.createdAt && product.createdAt.toDate">
          {{ product.createdAt.toDate().toLocaleString() }}
        </span>
      </div>
      <!-- Owner -->
      <div class="text-sm text-[var(--Color-Text-Text-Secondary)] dark:text-[var(--Color-Text-Text-Secondary)] font-nunito">
        {{ product.ownerName }}
      </div>
      <!-- Actions -->
      <div class="flex flex-col gap-2 items-center">
        <button
          @click="$emit('editProduct', product)"
          class="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--Color-Surface-Surface-Brand)] text-white hover:bg-[var(--Colors-Primary-600)] transition"
          title="Edit"
        >
          <i class="fa-solid fa-pen"></i>
        </button>
        <button
          @click="$emit('deleteProduct', product.id)"
          class="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--Colors-Error-400)] text-white hover:bg-red-700 transition"
          title="Delete"
        >
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>
  </div>
  <div v-else class="text-center text-gray-500 py-10 text-lg dark:text-gray-400">
    {{$t('noProductsFound')}}
  </div>
  <div class="flex justify-center mt-16  ">
    <button class="w-[400px] bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] hover:bg-[var(--Colors-Primary-600)] px-4 py-2 rounded-lg">Add Item</button>
  </div>
</template>

<script setup>
defineProps(['products', 'highlightText']);
defineEmits(['editProduct', 'deleteProduct']);
</script>
