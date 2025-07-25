<template>
  <div class="max-w-6xl mx-auto py-10 px-4">
    <!-- Search Bar and Title -->
    <div class="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <p class="text-xl md:text-2xl text-[var(--Color-Text-Text-Primary)] font-medium mb-2 md:mb-0">
        {{ $t('Your Items') }}
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
    <!-- Product List -->
    <ProductList
      :products="filteredProducts"
      :highlightText="highlightText"
      @editProduct="editProduct"
      @deleteProduct="deleteProduct"
      @addItem="addItem"
    />
  </div>
</template>

<script>
import ProductList from '@/components/pages/ProductList.vue';

export default {
  name: 'MyListings',
  components: { ProductList },
  data() {
    return {
      searchQuery: '',
      products: [
        {
          id: 1,
          img: require('@/assets/test.png'),
          title: 'Canon EOS R5 Camera',
          category: 'profficional Camera',
          price: 300,
        },
        {
          id: 2,
          img: require('@/assets/test.png'),
          title: 'Canon EOS R5 Camera',
          category: 'profficional Camera',
          price: 300,
        },
        {
          id: 3,
          img: require('@/assets/test.png'),
          title: 'Canon EOS R5 Camera',
          category: 'profficional Camera',
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
  methods: {
    highlightText(text) {
      if (!this.searchQuery) return text;
      const regex = new RegExp(`(${this.searchQuery})`, 'gi');
      return text.replace(regex, '<span class="bg-yellow-200">$1</span>');
    },
    editProduct(product) {
      // Placeholder for edit action
      alert('Edit: ' + product.title);
    },
    deleteProduct(productId) {
      // Placeholder for delete action
      this.products = this.products.filter(p => p.id !== productId);
    },
    addItem() {
      // Placeholder for add item action
      alert('Add new item');
    },
  },
};
</script> 