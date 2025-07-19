<template>
  <div
    class="min-h-screen bg-[var(--color-gray-25)] dark:bg-[var(--color-gray-800)] text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)]"
  >
    <div
      v-if="product"
      class="max-w-4xl mx-auto p-6 bg-[var(--color-gray-25)] dark:bg-[var(--color-gray-800)] rounded-2xl shadow-xl border border-[var(--color-success-200)] flex flex-col md:flex-row gap-6"
    >
      <!-- Product Image and Calendar -->
      <div class="md:w-1/2">
        <img
          :src="product.img || require('@/assets/logo.png')"
          alt="Product Image"
          class="w-full h-auto rounded-lg object-cover mb-4"
        />
        <div
          class="bg-[var(--color-gray-100)] p-4 rounded-lg dark:bg-[var(--color-gray-700)]"
        >
          <h3
            class="text-lg font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]"
          >
            July 2025
          </h3>
          <div class="grid grid-cols-7 gap-1 mt-2">
            <span
              v-for="day in 31"
              :key="day"
              class="text-center p-1 text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)]"
              >{{ day }}</span
            >
          </div>
        </div>
      </div>

      <!-- Product Info and Owner Details -->
      <div class="md:w-1/2 flex flex-col gap-4">
        <div>
          <h1
            class="text-2xl font-bold text-[var(--color-success-500)] dark:text-[var(--color-success-300)] mb-2"
          >
            {{ product.title }}
          </h1>
          <p class="text-[var(--color-gray-600)] mb-2 dark:text-[var(--color-gray-400)]">
            <span
              class="font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]"
              >Description:</span
            >
            {{ product.details }}
          </p>
          <div
            class="bg-[var(--color-gray-100)] p-4 rounded-lg dark:bg-[var(--color-gray-700)]"
          >
            <p class="text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)]">
              <span
                class="font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]"
                >Category:</span
              >
              {{ product.category || product.type }}
            </p>
            <p class="text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)]">
              <span
                class="font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]"
                >Model:</span
              >
              {{ product.model || "GSR 18V-50 Professional" }}
            </p>
            <p
              class="text-[var(--color-success-500)] font-bold dark:text-[var(--color-success-300)]"
            >
              <span
                class="font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]"
                >Price per day:</span
              >
              {{ product.price || "15" }} EGP
            </p>
            <button
              class="w-full bg-[var(--color-success-500)] text-[var(--color-gray-25)] py-2 rounded-lg mt-2 hover:bg-[var(--color-success-600)] dark:bg-[var(--color-success-300)] dark:hover:bg-[var(--color-success-400)]"
            >
              Rent this tool
            </button>
          </div>
        </div>

        <!-- Owner Details -->
        <div
          class="bg-[var(--color-gray-100)] p-4 rounded-lg dark:bg-[var(--color-gray-700)]"
        >
          <h3
            class="text-lg font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]"
          >
            Owner details
          </h3>
          <div class="flex items-center gap-4 mt-2">
            <img
              src="https://via.placeholder.com/40"
              alt="Owner"
              class="w-10 h-10 rounded-full"
            />
            <div>
              <p class="text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]">
                Lendo T. Caputo
              </p>
              <p
                class="text-sm text-[var(--color-gray-500)] dark:text-[var(--color-gray-400)]"
              >
                Member since March 2024
              </p>
              <p
                class="text-sm text-[var(--color-success-500)] dark:text-[var(--color-success-300)]"
              >
                55 successful rentals
              </p>
              <button
                class="mt-1 text-[var(--color-success-500)] text-sm dark:text-[var(--color-success-300)]"
              >
                Send a message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tool Reviews -->
    <div
      v-if="product"
      class="mt-6 max-w-4xl mx-auto p-6 bg-[var(--color-gray-25)] dark:bg-[var(--color-gray-800)] rounded-2xl shadow-xl border border-[var(--color-success-200)]"
    >
      <h3
        class="text-lg font-semibold text-[var(--color-gray-800)] mb-4 dark:text-[var(--color-gray-200)]"
      >
        Tool reviews
      </h3>
      <div class="space-y-4">
        <div>
          <p class="text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)]">
            "Great tool, highly recommend!" - Ahmed R.
          </p>
          <div class="flex items-center gap-1 text-[var(--color-warning-500)]">
            <span>★★★★★</span>
            <span
              class="text-[var(--color-gray-600)] dark:text-[var(--color-gray-400)] ml-2"
              >4.5 ★★★★☆</span
            >
          </div>
        </div>
        <div>
          <p class="text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)]">
            "Works well for small projects." - Sara K.
          </p>
          <div class="flex items-center gap-1 text-[var(--color-warning-500)]">
            <span>★★★★☆</span>
            <span
              class="text-[var(--color-gray-600)] dark:text-[var(--color-gray-400)] ml-2"
              >4.5 ★★★★☆</span
            >
          </div>
        </div>
      </div>
      <button
        class="mt-4 text-[var(--color-success-500)] text-sm dark:text-[var(--color-success-300)]"
      >
        view all reviews
      </button>
    </div>

    <!-- More from Owner -->
    <div
      v-if="product"
      class="mt-6 max-w-4xl mx-auto p-6 bg-[var(--color-gray-25)] dark:bg-[var(--color-gray-800)] rounded-2xl shadow-xl border border-[var(--color-success-200)]"
    >
      <h3
        class="text-lg font-semibold text-[var(--color-gray-800)] mb-4 dark:text-[var(--color-gray-200)]"
      >
        More from Lendo
      </h3>
      <div class="grid grid-cols-2 gap-4">
        <div
          class="bg-[var(--color-gray-100)] p-4 rounded-lg dark:bg-[var(--color-gray-700)]"
        >
          <img
            src="https://via.placeholder.com/100"
            alt="Camera"
            class="w-full h-24 object-cover rounded-lg"
          />
          <p class="text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)] mt-2">
            Canon EOS R5
          </p>
          <p
            class="text-[var(--color-success-500)] font-bold dark:text-[var(--color-success-300)]"
          >
            500 EGP
          </p>
          <div class="flex items-center gap-2 text-[var(--color-warning-500)]">
            <span>★★★★☆</span>
            <span
              class="text-sm text-[var(--color-gray-600)] dark:text-[var(--color-gray-400)]"
              >4.5</span
            >
          </div>
          <button
            class="w-full bg-[var(--color-success-500)] text-[var(--color-gray-25)] py-2 rounded-lg mt-2 hover:bg-[var(--color-success-600)] dark:bg-[var(--color-success-300)] dark:hover:bg-[var(--color-success-400)]"
          >
            Rent now
          </button>
        </div>
        <div
          class="bg-[var(--color-gray-100)] p-4 rounded-lg dark:bg-[var(--color-gray-700)]"
        >
          <img
            src="https://via.placeholder.com/100"
            alt="Camera"
            class="w-full h-24 object-cover rounded-lg"
          />
          <p class="text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)] mt-2">
            Canon EOS R6
          </p>
          <p
            class="text-[var(--color-success-500)] font-bold dark:text-[var(--color-success-300)]"
          >
            600 EGP
          </p>
          <div class="flex items-center gap-2 text-[var(--color-warning-500)]">
            <span>★★★★☆</span>
            <span
              class="text-sm text-[var(--color-gray-600)] dark:text-[var(--color-gray-400)]"
              >4.5</span
            >
          </div>
          <button
            class="w-full bg-[var(--color-success-500)] text-[var(--color-gray-25)] py-2 rounded-lg mt-2 hover:bg-[var(--color-success-600)] dark:bg-[var(--color-success-300)] dark:hover:bg-[var(--color-success-400)]"
          >
            Rent now
          </button>
        </div>
      </div>
      <button
        class="mt-4 text-[var(--color-success-500)] text-sm dark:text-[var(--color-success-300)]"
      >
        view all items
      </button>
    </div>

    <div
      v-else
      class="text-center text-[var(--color-gray-500)] py-10 text-lg dark:text-[var(--color-gray-400)]"
    >
      Loading product...
    </div>
    <router-link
      to="/home"
      class="mt-6 inline-block text-[var(--color-success-500)] hover:underline text-sm dark:text-[var(--color-success-300)]"
      >← Back to Products</router-link
    >
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

const route = useRoute();
const product = ref(null);

const loadProduct = async () => {
  const id = route.params.id;
  const docRef = doc(db, "products", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    product.value = docSnap.data();
  }
};

onMounted(loadProduct);
</script>
