<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-6 text-center text-pink-600">
      Admin Dashboard - Products
    </h1>

    <!-- Add / Edit Form -->
    <form @submit.prevent="submitForm" class="bg-white p-4 rounded-xl shadow-md mb-6">
      <h2 class="text-xl font-semibold mb-4">
        {{ isEdit ? "Edit Product" : "Add New Product" }}
      </h2>

      <input
        v-model="form.title"
        type="text"
        placeholder="Title"
        class="input"
        required
      />
      <input type="file" @change="handleImageUpload" accept="image/*" class="input" />
      <img
        v-if="form.image"
        :src="form.image"
        alt="Uploaded Image Preview"
        class="mt-2 max-w-full h-32 object-cover rounded"
      />
      <p v-if="form.image" class="text-sm text-gray-4-500 mt-2">
        Preview URL: {{ form.image }}
      </p>
      <p v-else class="text-sm text-red-500 mt-2">No image uploaded yet.</p>
      <select v-model="form.category" class="input" required>
        <option disabled value="">Select Category</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.name">
          {{ cat.name }}
        </option>
      </select>
      <input
        v-model.number="form.price"
        type="number"
        placeholder="Price"
        class="input"
        required
      />
      <textarea v-model="form.details" placeholder="Details" class="input"></textarea>

      <button type="submit" class="bg-pink-600 text-white py-2 px-4 rounded mt-2">
        {{ isEdit ? "Update Product" : "Add Product" }}
      </button>
    </form>

    <!-- Search Bar -->
    <div class="mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search products by title..."
        class="w-full max-w-md p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-blue-600"
      />
    </div>

    <!-- Category Filter Buttons -->
    <div class="flex justify-center space-x-4 mb-6">
      <button
        v-for="cat in categories"
        :key="cat.id"
        @click="selectedCategory = cat.name"
        :class="{
          'bg-pink-600 text-white': selectedCategory === cat.name,
          'bg-gray-200 text-gray-700': selectedCategory !== cat.name,
        }"
        class="px-4 py-2 rounded"
      >
        {{ cat.name }}
      </button>
      <button
        @click="selectedCategory = ''"
        :class="{
          'bg-pink-600 text-white': selectedCategory === '',
          'bg-gray-200 text-gray-700': selectedCategory !== '',
        }"
        class="px-4 py-2 rounded"
      >
        All
      </button>
    </div>

    <!-- Products List -->
    <div v-if="filteredProducts.length" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="bg-white p-4 rounded-xl shadow-md"
      >
        <h3
          class="font-bold text-pink-600 text-lg"
          v-html="highlightText(product.title)"
        ></h3>
        <p><strong>Category:</strong> {{ product.category }}</p>
        <p><strong>Price:</strong> {{ product.price }} EGP</p>
        <p><strong>Details:</strong> {{ product.details }}</p>
        <img
          v-if="product.img"
          :src="product.img"
          alt="Product Image"
          class="mt-2 max-w-full h-32 object-cover rounded"
        />
        <p v-if="product.img" class="text-sm text-gray-500 mt-2">
          Image URL: {{ product.img }}
        </p>
        <p v-else class="text-sm text-red-500 mt-2">No image available.</p>

        <div class="flex gap-2 mt-3">
          <button @click="editProduct(product)" class="text-blue-600">Edit</button>
          <button @click="deleteProduct(product.id)" class="text-red-600">Delete</button>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-gray-500 py-10 text-lg">No products found.</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage, auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import Swal from "sweetalert2";

const products = ref([]);
const categories = ref([]);
const form = ref({
  title: "",
  category: "",
  price: "",
  details: "",
  image: "",
  imagePath: "",
});
const isEdit = ref(false);
const editId = ref(null);
const currentUser = ref(null);
const searchQuery = ref("");
const selectedCategory = ref("");

const loadCategories = async () => {
  try {
    const snapshot = await getDocs(collection(db, "categories"));
    categories.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Categories loaded:", categories.value);
    if (categories.value.length === 0) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "No categories found in Firestore.",
      });
    }
  } catch (err) {
    console.error("Error loading categories:", err);
    Swal.fire({
      position: "center",
      icon: "error",
      title: `Failed to load categories: ${err.message}`,
    });
  }
};

const loadProducts = async () => {
  try {
    if (!currentUser.value) {
      throw new Error("No user is logged in.");
    }
    const q = query(
      collection(db, "products"),
      where("userId", "==", currentUser.value.uid)
    );
    const snapshot = await getDocs(q);
    products.value = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  } catch (err) {
    console.error("Failed to load products:", err);
    Swal.fire({
      position: "center",
      icon: "error",
      title: `Failed to load products: ${err.message}`,
    });
  }
};

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    currentUser.value = user;
    if (user) {
      loadProducts();
      loadCategories();
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Please log in to view or manage products and categories.",
      });
      products.value = [];
      categories.value = [];
    }
  });
});

const filteredProducts = computed(() => {
  if (!products.value) return [];
  let filtered = products.value;
  if (selectedCategory.value) {
    filtered = filtered.filter((product) => product.category === selectedCategory.value);
  }
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((product) => product.title?.toLowerCase().includes(query));
  }
  return filtered;
});

const highlightText = (text) => {
  if (!searchQuery.value || !text) return text;
  const query = searchQuery.value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(regex, '<span class="text-blue-600">$1</span>');
};

const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  if (file) {
    if (!file.type.match("image.*")) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Please select an image file.",
      });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Image size should not exceed 2MB.",
      });
      return;
    }

    try {
      const storagePath = `products/${Date.now()}_${file.name}`;
      const imageRef = storageRef(storage, storagePath);
      const snapshot = await uploadBytes(imageRef, file);
      const imageUrl = await getDownloadURL(snapshot.ref);
      form.value.image = imageUrl;
      form.value.imagePath = storagePath;
      console.log("Image uploaded successfully, URL:", imageUrl);
    } catch (err) {
      console.error("Image upload error:", err);
      Swal.fire({
        position: "center",
        icon: "error",
        title: `Image upload failed: ${err.message}`,
      });
    }
  }
};

const submitForm = async () => {
  try {
    if (!currentUser.value) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Please log in to add or update products.",
      });
      return;
    }
    if (!form.value.title || !form.value.category || !form.value.price) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Please fill in all required fields.",
      });
      return;
    }

    if (isEdit.value) {
      const docRef = doc(db, "products", editId.value);
      await updateDoc(docRef, {
        title: form.value.title,
        category: form.value.category,
        price: Number(form.value.price),
        details: form.value.details,
        img: form.value.image || "",
        imagePath: form.value.imagePath || "",
        userId: currentUser.value.uid,
      });
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Update operation successful...",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      await addDoc(collection(db, "products"), {
        title: form.value.title,
        category: form.value.category,
        price: Number(form.value.price),
        details: form.value.details,
        img: form.value.image || "",
        imagePath: form.value.imagePath || "",
        userId: currentUser.value.uid,
      });
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Add operation successful...",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    resetForm();
    await loadProducts();
  } catch (err) {
    console.error("Form submission error:", err);
    Swal.fire({
      position: "center",
      icon: "error",
      title: `Unsuccessful: ${err.message}`,
    });
  }
};

const editProduct = (product) => {
  form.value = {
    title: product.title,
    category: product.category,
    price: product.price,
    details: product.details || "",
    image: product.img || "",
    imagePath: product.imagePath || "",
  };
  isEdit.value = true;
  editId.value = product.id;
};

const deleteProduct = async (id) => {
  try {
    const product = products.value.find((p) => p.id === id);
    if (product.imagePath) {
      const imageRef = storageRef(storage, product.imagePath);
      await deleteObject(imageRef).catch((err) => {
        console.warn("Failed to delete image:", err.message);
      });
    }
    await deleteDoc(doc(db, "products", id));
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Delete operation successful...",
      showConfirmButton: false,
      timer: 1500,
    });
    await loadProducts();
  } catch (err) {
    console.error("Delete error:", err);
    Swal.fire({
      position: "center",
      icon: "error",
      title: `Unsuccessful: ${err.message}`,
    });
  }
};

const resetForm = () => {
  form.value = {
    title: "",
    category: "",
    price: "",
    details: "",
    image: "",
    imagePath: "",
  };
  isEdit.value = false;
  editId.value = null;
};
</script>

<style scoped>
.input {
  display: block;
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
}
input,
select,
textarea {
  transition: all 0.3s ease;
  color: #2563eb; /* Tailwind's blue-600 for input text */
}
input:focus,
select:focus,
textarea:focus {
  border-color: #ec4899; /* Tailwind's pink-500 */
  outline: none;
}
input::placeholder {
  color: #9ca3af; /* Tailwind's gray-400 for placeholder */
}
</style>
