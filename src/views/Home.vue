<template>
  <div class="min-h-screen flex flex-col"
    :style="{ backgroundColor: 'var(--Color-Surface-Surface-Primary)', color: 'var(--Color-Text-Text-Primary)' }">
    <!-- Header/Navbar is assumed to be in a layout component -->

    <!-- Search Bar Section -->
    <div class="w-full border-b border-[var(--Color-Surface-Surface-Tertiary)] bg-transparent">
      <div class="container mx-auto px-4 py-6 flex flex-col gap-4">
        <div class="flex flex-col sm:flex-row items-center gap-4 w-full">
          <!-- Location Select -->
          <div class="relative flex items-center w-full sm:w-auto">
            <i
              class="fa-solid fa-location-dot absolute left-4 top-1/2 -translate-y-1/2 text-[var(--Color-Text-Text-Brand)] w-5 h-5 pointer-events-none"></i>
            <select
              class="appearance-none pl-12 pr-8 py-3 w-full sm:w-[180px] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--Color-Text-Text-Brand)] text-base font-semibold text-[var(--Color-Text-Text-Primary)] bg-[var(--Color-Surface-Surface-Primary)] border-[var(--Color-Boarder-Border-Primary)] dark:border-[var(--Color-Boarder-Border-Primary)]"
              style="background-image: url('data:image/svg+xml;utf8,<svg fill=\'%23666\' height=\'20\' viewBox=\'0 0 20 20\' width=\'20\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 7l3-3 3 3\'/></svg>'); background-repeat: no-repeat; background-position: right 1rem center;">
              <option>Cairo</option>
            </select>
          </div>
          <!-- Search Input -->
          <div class="relative flex-1 w-full">
            <i
              class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[var(--Color-Text-Text-Brand)] w-5 h-5 pointer-events-none"></i>
            <input v-model="searchQuery" type="text" placeholder="Search for product to rent?"
              class="pl-12 pr-4 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--Color-Text-Text-Brand)] text-base text-[var(--Color-Text-Text-Primary)] placeholder-[var(--Color-Text-Text-Secondary)] bg-[var(--Color-Surface-Surface-Primary)] border-[var(--Color-Boarder-Border-Primary)] dark:border-[var(--Color-Boarder-Border-Primary)]" />
          </div>
        </div>
      </div>
    </div>

    <!-- Category Section -->
    <div class="container mx-auto px-4 mt-4">
      <div class="flex flex-wrap gap-2">
        <button @click="selectedCategory = ''"
          class="flex items-center gap-2 px-4 py-2 rounded-full text-base font-medium border border-[var(--Color-Boarder-Border-Primary)] bg-white dark:bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)] hover:bg-[var(--Color-Surface-Surface-Brand)] hover:text-[var(--Color-Text-Text-Invert)] transition"
          :class="selectedCategory === '' ? 'bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)]' : ''">
          <i class="fa-solid fa-layer-group"></i>
          All
        </button>
        <button v-for="cat in categories" :key="cat" @click="selectedCategory = cat"
          class="flex items-center gap-2 px-4 py-2 rounded-full text-base font-medium border border-[var(--Color-Boarder-Border-Primary)] bg-white dark:bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)] hover:bg-[var(--Color-Surface-Surface-Brand)] hover:text-[var(--Color-Text-Text-Invert)] transition"
          :class="selectedCategory === cat ? 'bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)]' : ''">
          <i v-if="cat === 'Home Tools'" class="fa-solid fa-screwdriver-wrench"></i>
          <i v-else-if="cat === 'Photography & Videography'" class="fa-solid fa-camera"></i>
          <i v-else-if="cat === 'Outdoor & Camping'" class="fa-solid fa-campground"></i>
          <i v-else-if="cat === 'Events & Decorations'" class="fa-solid fa-champagne-glasses"></i>
          <i v-else-if="cat === 'Cleaning & Maintenance'" class="fa-solid fa-broom"></i>
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- Banner/Image Section -->
    <div class="container mx-auto px-4 mt-6">
      <div class="relative rounded-xl overflow-hidden w-full">
        <img src="@/assets/Rectangle 10.png" alt="Featured Products" class="w-full h-auto object-cover"
          style="max-height: 220px;" />
      </div>
    </div>

    <!-- Recommended Section -->
    <div class="container mx-auto px-4 mt-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-[var(--Color-Text-Text-Brand)]">Recommended for you</h2>
        <router-link to="/all-products" class="text-[var(--Color-Text-Text-Brand)] font-medium hover:underline">View All</router-link>
      </div>
      <div v-if="filteredProducts.length === 0" class="text-center text-gray-400 text-xl py-12">
        No products found.
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="product in filteredProducts.slice(0, 8)" :key="product.id"
          class="bg-[var(--Color-Surface-Surface-Tertiary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl shadow-sm flex flex-col transition hover:shadow-lg">
          <img :src="product.img || require('@/assets/test.png')" alt="product image"
            class="w-full h-40 object-cover rounded-t-xl" />
          <div class="p-4 flex flex-col flex-1">
            <h2 class="text-base font-bold mb-1 text-[var(--Color-Text-Text-Brand)] truncate">
              {{ product.title }}
            </h2>

            <div class="flex items-center text-xs text-[var(--Color-Text-Text-Secondary)] mb-1">
              <i class="fa-solid fa-location-dot mr-1"></i>
              {{ product.location || "Naar City" }}
              <span class="ml-auto flex items-center">
                <span class="mr-1">{{ product.rating || '4.5' }}</span>
                <i class="fa-solid fa-star text-yellow-400"></i>
              </span>
            </div>

            <div class="flex items-center justify-between mt-auto">
              <div>
                <div class="text-sm font-semibold text-[var(--Color-Text-Text-Primary)]">
                  EGP {{ product.price }}
                </div>
                <div class="text-xs text-[var(--Color-Text-Text-Secondary)]">Per Day</div>
              </div>

              <button v-if="!isAuthenticated" @click="promptLogin"
                class="bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] px-4 py-2 rounded font-semibold text-sm transition hover:bg-[var(--Color-Text-Text-Brand)] hover:text-white"
                aria-label="Log in to rent this product">
                Rent Item
              </button>

              <router-link v-else :to="{ name: 'ProductDetails', params: { id: product.id } }"
                class="bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] px-4 py-2 rounded font-semibold text-sm transition hover:bg-[var(--Color-Text-Text-Brand)] hover:text-white"
                :aria-label="`View details for ${product.title}`">
                Rent Item
              </router-link>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Customer Reviews Section -->
    <div class="container mx-auto px-4 mt-12">
      <h3 class="text-center text-xl font-bold mb-6">
        What Our <span class="text-[var(--Color-Text-Text-Brand)]">Customer Say</span>
      </h3>
      <div class="flex flex-col lg:flex-row gap-6 justify-center">
        <div
          class="bg-[var(--Color-Surface-Surface-Tertiary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6 flex-1 max-w-md mx-auto">
          <div class="flex items-center mb-2">
            <span class="text-yellow-400 text-lg mr-2">4.5</span>
            <i class="fa-solid fa-star text-yellow-400"></i>
            <i class="fa-solid fa-star text-yellow-400"></i>
            <i class="fa-solid fa-star text-yellow-400"></i>
            <i class="fa-solid fa-star text-yellow-400"></i>
            <i class="fa-solid fa-star-half-stroke text-yellow-400"></i>
          </div>
          <p class="text-sm mb-4">"The drill was clean and fully charged. I used it to install shelves at home and it
            worked flawlessly. Highly recommended!"</p>
          <div class="flex items-center gap-2">
            <img src="@/assets/logo.png" alt="user" class="w-8 h-8 rounded-full object-cover" />
            <div>
              <div class="font-semibold text-xs">Karim H.</div>
              <div class="text-xs text-[var(--Color-Text-Text-Secondary)]">Jul 10, 2025</div>
            </div>
          </div>
        </div>
        <div
          class="bg-[var(--Color-Surface-Surface-Tertiary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6 flex-1 max-w-md mx-auto">
          <div class="flex items-center mb-2">
            <span class="text-yellow-400 text-lg mr-2">4.5</span>
            <i class="fa-solid fa-star text-yellow-400"></i>
            <i class="fa-solid fa-star text-yellow-400"></i>
            <i class="fa-solid fa-star text-yellow-400"></i>
            <i class="fa-solid fa-star text-yellow-400"></i>
            <i class="fa-solid fa-star-half-stroke text-yellow-400"></i>
          </div>
          <p class="text-sm mb-4">"Honestly, I didn't expect it to be this powerful! I used it to drill into concrete
            walls for curtain rods, and it handled it like a pro."</p>
          <div class="flex items-center gap-2">
            <img src="@/assets/logo.png" alt="user" class="w-8 h-8 rounded-full object-cover" />
            <div>
              <div class="font-semibold text-xs">Youssef R.</div>
              <div class="text-xs text-[var(--Color-Text-Text-Secondary)]">Jul 10, 2025</div>
            </div>
          </div>
        </div>
        <div
          class="bg-[var(--Color-Surface-Surface-Tertiary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6 flex-1 max-w-md mx-auto">
          <div class="flex items-center mb-2">
            <span class="text-yellow-400 text-lg mr-2">4.5</span>
            <i class="fa-solid fa-star text-yellow-400"></i>
            <i class="fa-solid fa-star text-yellow-400"></i>
            <i class="fa-solid fa-star text-yellow-400"></i>
            <i class="fa-solid fa-star text-yellow-400"></i>
            <i class="fa-solid fa-star-half-stroke text-yellow-400"></i>
          </div>
          <p class="text-sm mb-4">"Great tool, easy to use even for someone with no experience. I used it to assemble my
            IKEA wardrobe and it saved me hours!"</p>
          <div class="flex items-center gap-2">
            <img src="@/assets/logo.png" alt="user" class="w-8 h-8 rounded-full object-cover" />
            <div>
              <div class="font-semibold text-xs">Mariam M.</div>
              <div class="text-xs text-[var(--Color-Text-Text-Secondary)]">Jul 10, 2025</div>
            </div>
          </div>
        </div>
      </div>
      <!-- Carousel Controls -->
      <div class="flex justify-center mt-6 gap-2">
        <button
          class="w-8 h-8 rounded-full border border-[var(--Color-Boarder-Border-Primary)] flex items-center justify-center text-[var(--Color-Text-Text-Brand)] hover:bg-[var(--Color-Surface-Surface-Brand]">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <button
          class="w-8 h-8 rounded-full border border-[var(--Color-Boarder-Border-Primary)] flex items-center justify-center text-[var(--Color-Text-Text-Brand)] hover:bg-[var(--Color-Surface-Surface-Brand]">
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>

    <!-- Why Rento Section -->
    <div class="container mx-auto px-4 mt-12 flex flex-col lg:flex-row gap-8 items-center">
      <div class="flex-1">
        <h3 class="text-xl font-bold mb-4 text-[var(--Color-Text-Text-Brand]">Why <span
            class="text-[var(--Color-Text-Text-Primary)]">Rento?</span></h3>
        <div class="flex flex-col gap-4">
          <div class="flex items-start gap-3">
            <i class="fa-solid fa-layer-group text-2xl text-[var(--Color-Text-Text-Brand)]"></i>
            <div>
              <div class="font-semibold">Wide Variety of Rental Categories</div>
              <div class="text-sm text-[var(--Color-Text-Text-Secondary)]">Find everything from cameras to cleaning
                tools — all in one place.</div>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <i class="fa-solid fa-layer-group text-2xl text-[var(--Color-Text-Text-Brand)]"></i>
            <div>
              <div class="font-semibold">Wide Variety of Rental Categories</div>
              <div class="text-sm text-[var(--Color-Text-Text-Secondary)]">Find everything from cameras to cleaning
                tools — all in one place.</div>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <i class="fa-solid fa-layer-group text-2xl text-[var(--Color-Text-Text-Brand)]"></i>
            <div>
              <div class="font-semibold">Wide Variety of Rental Categories</div>
              <div class="text-sm text-[var(--Color-Text-Text-Secondary)]">Find everything from cameras to cleaning
                tools — all in one place.</div>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <i class="fa-solid fa-layer-group text-2xl text-[var(--Color-Text-Text-Brand)]"></i>
            <div>
              <div class="font-semibold">Wide Variety of Rental Categories</div>
              <div class="text-sm text-[var(--Color-Text-Text-Secondary)]">Find everything from cameras to cleaning
                tools — all in one place.</div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-1 flex justify-center">
        <img src="@/assets/logo.png" alt="Why Rento" class="rounded-xl w-full max-w-md object-cover" />
      </div>
    </div>

    <!-- Mission, Vision, Values Section -->
    <div class="container mx-auto px-4 mt-12 flex flex-col lg:flex-row gap-8 items-start">
      <div class="flex-1 flex flex-col items-center text-center">
        <img src="@/assets/logo.png" alt="Mission" class="w-24 h-24 mb-4" />
        <h4 class="text-lg font-bold mb-2 text-[var(--Color-Text-Text-Brand)]">Our Mission</h4>
        <p class="text-sm text-[var(--Color-Text-Text-Primary)]">
          To make everyday tools and equipment accessible and affordable for everyone, empowering smarter living through
          simple and secure rentals.
        </p>
      </div>
      <div class="flex-1 flex flex-col items-center text-center">
        <img src="@/assets/logo.png" alt="Vision" class="w-24 h-24 mb-4" />
        <h4 class="text-lg font-bold mb-2 text-[var(--Color-Text-Text-Brand)]">Our Vision</h4>
        <p class="text-sm text-[var(--Color-Text-Text-Primary)]">
          To become the leading rental platform in the region, transforming how people access items they need — without
          the need to own them.
        </p>
      </div>
      <div class="flex-1 flex flex-col items-center text-center">
        <img src="@/assets/logo.png" alt="Core Values" class="w-24 h-24 mb-4" />
        <h4 class="text-lg font-bold mb-2 text-[var(--Color-Text-Text-Brand)]">Our Core Values</h4>
        <p class="text-sm text-[var(--Color-Text-Text-Primary)]">
          We value trust, simplicity, and affordability — making rentals easy, safe, and sustainable through a connected
          community.
        </p>
      </div>
    </div>

    <!-- Footer Section -->
    <footer class="mt-16 bg-transparent border-t border-[var(--Color-Boarder-Border-Primary)]">
      <div class="container mx-auto px-4 py-10 flex flex-col md:flex-row md:justify-between gap-8">
        <div>
          <div class="text-2xl font-bold text-[var(--Color-Text-Text-Brand)] mb-4">Rento</div>
          <div class="flex flex-wrap gap-4 text-sm text-[var(--Color-Text-Text-Primary)]">
            <a href="#" class="hover:underline">Overview</a>
            <a href="#" class="hover:underline">Features</a>
            <a href="#" class="hover:underline">Pricing</a>
            <a href="#" class="hover:underline">Careers</a>
            <a href="#" class="hover:underline">Help</a>
            <a href="#" class="hover:underline">Privacy</a>
          </div>
        </div>
        <div class="flex-1 max-w-xs">
          <div class="mb-2 font-semibold">Stay up to date</div>
          <div class="flex gap-2">
            <input type="email" placeholder="Enter your email"
              class="flex-1 px-3 py-2 rounded border border-[var(--Color-Boarder-Border-Primary)] bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)] focus:outline-none" />
            <button
              class="px-4 py-2 rounded bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] font-semibold hover:bg-[var(--Color-Text-Text-Brand)] transition">Subscribe</button>
          </div>
          <div class="flex gap-2 mt-2 text-xs text-[var(--Color-Text-Text-Secondary)]">
            <a href="#" class="hover:underline">Terms</a>
            <a href="#" class="hover:underline">Privacy</a>
            <a href="#" class="hover:underline">Cookies</a>
          </div>
          <div class="mt-4 text-xs text-[var(--Color-Text-Text-Secondary)]">© 2077 Rento All rights reserved.</div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "vue-router";
import getCollection from "../composables/getCollection";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import Swal from "sweetalert2";

export default {
  name: "HomePage",
  setup() {
    const { documents: products } = getCollection("products");
    const searchQuery = ref("");
    const selectedCategory = ref("");
    const displayName = ref("");
    const isAuthenticated = ref(false);
    const categories = ref([]);
    const auth = getAuth();
    const router = useRouter();

    const loadCategories = async () => {
      const snapshot = await getDocs(collection(db, "categories"));
      categories.value = snapshot.docs
        .map((doc) => doc.data().name)
        .sort((a, b) => a.localeCompare(b));
    };

    const promptLogin = () => {
      Swal.fire({
        position: "top-end",
        icon: "warning",
        title: "Please log in to rent products",
        showConfirmButton: true,
        confirmButtonText: "Go to Login",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push({ name: "Login" });
        }
      });
    };

    onMounted(() => {
      loadCategories();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          isAuthenticated.value = true;
          displayName.value = user.displayName || "User";
        } else {
          isAuthenticated.value = false;
          displayName.value = "Guest";
        }
      });
    });

    const filteredProducts = computed(() => {
      if (!products.value) return [];
      let filtered = products.value;
      if (selectedCategory.value) {
        filtered = filtered.filter(
          (product) => product.category === selectedCategory.value
        );
      }
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter((product) =>
          product.title?.toLowerCase().includes(query)
        );
      }
      return filtered;
    });

    const highlightText = (text) => {
      if (!searchQuery.value || !text) return text;
      const query = searchQuery.value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(${query})`, "gi");
      return text.replace(regex, '<span class="text-primary-500">$1</span>');
    };

    return {
      products,
      searchQuery,
      selectedCategory,
      filteredProducts,
      highlightText,
      displayName,
      categories,
      isAuthenticated,
      promptLogin,
    };
  },
};
</script>

<style scoped>
input {
  transition: all 0.3s ease;
}

/* Responsive tweaks for extra small screens */
@media (max-width: 400px) {
  .container {
    padding-left: 0.5rem !important;
    padding-right: 0.5rem !important;
  }
}
</style>
