<template>
  <div class="bg-[var(--Color-Surface-Surface-Tertiary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl shadow-sm flex flex-col transition hover:shadow-lg ">
    <img :src="product.img || require('@/assets/test.png')" alt="product image"
      class="w-full h-40 object-cover rounded-t-xl" />
    <div class="p-4 flex flex-col flex-1">
      <h2 class="pb-4 text-base font-bold  text-[var(--Color-Text-Text-Brand)] truncate">
        {{ product.title }}
      </h2>
      <div class="flex items-center text-xs text-[var(--Color-Text-Text-Secondary)] mb-1 pb-2">
        <i class="fa-solid fa-location-dot mr-1"></i>
        {{ product.location || "Naar City" }}
        <span class="ml-auto flex items-center">
          <span class="mr-1">{{ product.rating || '4.5' }}</span>
          <i class="fa-solid fa-star text-yellow-400"></i>
        </span>
      </div>
     <div class="flex flex-col justify-between h-full">

  <div class=" flex items-center">
    <div class="text-sm font-semibold text-[var(--Color-Text-Text-Primary)]">
      EGP {{ product.price }}
    </div>
    <div class="text-xs text-[var(--Color-Text-Text-Secondary)] ml-auto flex items-center">
      {{$t(' Per Day')}}
    </div>
  </div>


  <div class="mt-4">
    <button
      v-if="!isAuthenticated"
      @click="promptLogin"
      class="w-full bg-[var(--Color-Surface-Surface-Brand)]
       text-[var(--Color-Text-Text-Invert)] px-4 py-2 
       font-semibold text-sm transition hover:bg-[var(--Color-Text-Text-Brand)] hover:text-white"
      aria-label="Log in to rent this product"
    >
      {{$t('rentItem')}}
    </button>
    
    <router-link
      v-else
      :to="{ name: 'ProductDetails', params: { id: product.id } }"
      class="rounded-xl block w-full text-center bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] px-4 py-2 rounded font-semibold text-sm transition hover:bg-[var(--Color-Text-Text-Brand)] hover:text-white"
      :aria-label="`View details for ${product.title}`"
    >
      {{$t('rentItem')}}
    </router-link>
  </div>
</div>

    </div>
  </div>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      required: true
    },
    isAuthenticated: {
      type: Boolean,
      required: true
    },
    promptLogin: {
      type: Function,
      required: true
    }
  }
}
</script>