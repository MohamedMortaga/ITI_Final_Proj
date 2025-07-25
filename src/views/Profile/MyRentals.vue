<template>
  <div class="max-w-6xl mx-auto py-10 px-4">
    <!-- Search Bar and Title -->
    <div class="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <p class="text-xl md:text-2xl text-[var(--Color-Text-Text-Primary)] font-medium mb-2 md:mb-0">
        {{ $t('Your Rentals') }}
      </p>
      <div class="relative w-full md:w-auto">
        <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[var(--Color-Text-Text-Brand)] w-5 h-5 pointer-events-none"></i>
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="$t('searchByTitle')"
          class="w-full md:w-[500px] pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--Color-Text-Text-Brand)] text-base text-[var(--Color-Text-Text-Primary)] placeholder-[var(--Color-Text-Text-Secondary)] bg-[var(--Color-Surface-Surface-Primary)] border-[var(--Color-Boarder-Border-Primary)] dark:border-[var(--Color-Boarder-Border-Primary)]"
        />
      </div>
    </div>
    <!-- Product Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
        :isAuthenticated="true"
        :promptLogin="() => {}"
      />
    </div>
  </div>
</template>

<script>
import ProductCard from '@/components/pages/ProductCard.vue';

export default {
  name: 'MyRentals',
  components: { ProductCard },
  data() {
    return {
      searchQuery: '',
      products: [
        {
          id: 1,
          img: require('@/assets/test.png'),
          title: 'Canon EOS R5 Camera',
          location: 'Nasr City',
          rating: '4.5',
          price: 300,
        },
        {
          id: 2,
          img: require('@/assets/test.png'),
          title: 'Canon EOS R5 Camera',
          location: 'Nasr City',
          rating: '4.5',
          price: 300,
        },
        {
          id: 3,
          img: require('@/assets/test.png'),
          title: 'Canon EOS R5 Camera',
          location: 'Nasr City',
          rating: '4.5',
          price: 300,
        },
      ],
    };
  },
  computed: {
    filteredProducts() {
      if (!this.searchQuery) return this.products;
      const q = this.searchQuery.toLowerCase();
      return this.products.filter(p => p.title.toLowerCase().includes(q));
    },
  },
};
</script> 