// src/composables/useAdminProducts.js
import { ref } from "vue";
import {
  collection, addDoc, deleteDoc, updateDoc, doc,
  query, where, getDocs, serverTimestamp
} from "firebase/firestore";
import {
  ref as storageRef, uploadBytes, getDownloadURL, deleteObject
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
  image: null,
  imagePath: "",
  location: ""
});
const isEdit = ref(false);
const editId = ref(null);
const currentUser  = ref(null);
const searchQuery = ref("");
const selectedCategory = ref("");
const uploading = ref(false);
const allProducts = ref([])
// Define the commission rate
const commissionRate = 0.15;

const loadCategories = async () => {
  try {
    const snapshot = await getDocs(collection(db, "categories"));
    categories.value = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((cat) => cat.status !== 'inactive'); // Only show active categories
    if (categories.value.length === 0) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "No categories found in Firestore.",
      });
    }
  } catch (err) {
    Swal.fire({
      position: "center",
      icon: "error",
      title: `Failed to load categories: ${err.message}`,
    });
  }
};
const disapproveProduct = async (productId) => {
  try {
    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, { isApproved: false }); 
    alert("disapproved successfully");

 
    await fetchProducts();
  } catch (error) {
    console.error("error ", error);
  }
};
const loadProducts = async () => {
  try {
    if (!currentUser .value) throw new Error("No user is logged in.");
    const q = query(collection(db, "products"), where("userId", "==", currentUser .value.uid));
    const snapshot = await getDocs(q);
    // Show all products (both approved and pending) for the current user
    products.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  } catch (err) {
    Swal.fire({
      position: "center",
      icon: "error",
      title: `Failed to load products: ${err.message}`,
    });
  }
};

onAuthStateChanged(auth, (user) => {
  currentUser .value = user;
  if (user) {
    loadProducts();
    loadCategories();
  } else {
    products.value = [];
    categories.value = [];
  }
});

const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  uploading.value = true;

  try {
    const reader = new FileReader();
    reader.onload = (e) => {
      form.value.image = e.target.result;
    };
    reader.readAsDataURL(file);

    const storagePath = `products/${Date.now()}_${file.name}`;
    const imageRef = storageRef(storage, storagePath);
    const snapshot = await uploadBytes(imageRef, file);
    const imageUrl = await getDownloadURL(snapshot.ref);

    form.value.image = imageUrl;
    form.value.imagePath = storagePath;
  } catch (err) {
    Swal.fire({ icon: "error", title: "Image upload failed", text: err.message });
  } finally {
    uploading.value = false;
  }
};

const submitForm = async () => {
  try {
    if (!currentUser .value) {
      Swal.fire({ icon: "error", title: "Please log in first." });
      return;
    }

    if (!form.value.title || !form.value.category || !form.value.price || !form.value.location) {
      Swal.fire({ icon: "error", title: "Please fill all required fields." });
      return;
    }

    // Calculate net profit
    const netProfit = form.value.price - form.value.price * commissionRate;

    if (isEdit.value) {
      const docRef = doc(db, "products", editId.value);
      await updateDoc(docRef, {
        title: form.value.title,
        category: form.value.category,
        price: Number(form.value.price),
        details: form.value.details,
        img: form.value.image || "",
        imagePath: form.value.imagePath || "",
        location: form.value.location,
        userId: currentUser .value.uid,
        netProfit: netProfit, // Include net profit in the update
      });
      Swal.fire({ icon: "success", title: "Updated successfully", timer: 1500, showConfirmButton: false });
    } else {
      await addDoc(collection(db, "products"), {
        title: form.value.title,
        category: form.value.category,
        price: Number(form.value.price),
        details: form.value.details,
        img: form.value.image || "",
        imagePath: form.value.imagePath || "",
        location: form.value.location,
        userId: currentUser .value.uid,
        ownerName: currentUser .value.displayName || currentUser .value.email,
        createdAt: serverTimestamp(),
        netProfit: netProfit, // Include net profit in the new product
          isApproved: false
      });
      Swal.fire({ icon: "success", title: "Added successfully", timer: 1500, showConfirmButton: false });
    }

    resetForm();
    await loadProducts();
  } catch (err) {
    Swal.fire({ icon: "error", title: `Error: ${err.message}` });
  }
};

const deleteProduct = async (id) => {
  try {
    const product = products.value.find((p) => p.id === id);
    if (product.imagePath) {
      const imageRef = storageRef(storage, product.imagePath);
      await deleteObject(imageRef).catch((err) => console.warn("Failed to delete image:", err.message));
    }
    await deleteDoc(doc(db, "products", id));
    Swal.fire({ icon: "success", title: "Deleted", timer: 1500, showConfirmButton: false });
    await loadProducts();
  } catch (err) {
    Swal.fire({ icon: "error", title: `Delete failed: ${err.message}` });
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
    location: product.location || "",
  };
  isEdit.value = true;
  editId.value = product.id;
};

const resetForm = () => {
  form.value = {
    title: "",
    category: "",
    price: "",
    details: "",
    image: null,
    imagePath: "",
    location: "",
  };
  isEdit.value = false;
  editId.value = null;
};

const highlightText = (text) => {
  if (!searchQuery.value || !text) return text;
  const query = searchQuery.value.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&");
  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(regex, '<span class=\"text-blue-600 dark:text-blue-400\">$1</span>');
};

export default function useAdminProducts() {
  return {
    form,
    products,
    categories,
    isEdit,
    uploading,
    currentUser ,
    searchQuery,
    selectedCategory,
    loadProducts,
    loadCategories,
    submitForm,
    handleImageUpload,
    editProduct,
    deleteProduct,
    highlightText,
    disapproveProduct,
    resetForm
  };
}
