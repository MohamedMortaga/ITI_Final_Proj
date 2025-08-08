// src/composables/useAdminProducts.js
import { ref, computed } from "vue";
import {
  collection, addDoc, deleteDoc, updateDoc, doc, getDoc,
  query, where, getDocs, serverTimestamp
} from "firebase/firestore";
import { ref as storageRef, deleteObject } from "firebase/storage";
import { db, storage, auth } from "@/firebase/config";
import { useStorageUpload } from "@/composables/useStorage";
import { onAuthStateChanged } from "firebase/auth";
import Swal from "sweetalert2";

const products = ref([]);
const categories = ref([]);
const form = ref({
  title: "",
  category: "",
  price: "",
  actualPrice: "",
  details: "",
  image1: null,
  image1Path: "",
  image2: null,
  image2Path: "",
  image3: null,
  image3Path: "",
  location: ""
});
const isEdit = ref(false);
const editId = ref(null);
const currentUser = ref(null);
const searchQuery = ref("");
const selectedCategory = ref("");
const uploading = ref(false);
const uploading1 = ref(false);
const uploading2 = ref(false);
const uploading3 = ref(false);
const allProducts = ref([]);

// Define the commission rate
const commissionRate = 0.15;

const loadCategories = async () => {
  try {
    const snapshot = await getDocs(collection(db, "categories"));
    categories.value = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((cat) => cat.status !== 'inactive');
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
    if (!currentUser.value) throw new Error("No user is logged in.");
    const q = query(collection(db, "products"), where("userId", "==", currentUser.value.uid));
    const snapshot = await getDocs(q);
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
  currentUser.value = user;
  if (user) {
    loadProducts();
    loadCategories();
  } else {
    products.value = [];
    categories.value = [];
  }
});

// Initialize storage upload composable
const { uploadImage, url, error: uploadError, isPending } = useStorageUpload();

const handleImageUpload = async (event, imageNumber) => {
  const file = event.target.files[0];
  if (!file) return;

  if (imageNumber === 1) uploading1.value = true;
  else if (imageNumber === 2) uploading2.value = true;
  else if (imageNumber === 3) uploading3.value = true;

  try {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (imageNumber === 1) form.value.image1 = e.target.result;
      else if (imageNumber === 2) form.value.image2 = e.target.result;
      else if (imageNumber === 3) form.value.image3 = e.target.result;
    };
    reader.readAsDataURL(file);

    await uploadImage(file, 'products', 3);

    if (uploadError.value) {
      throw new Error(uploadError.value);
    }

    const imageUrl = url.value;
    const storagePath = `products/${Date.now()}_${file.name}`;

    if (imageNumber === 1) {
      form.value.image1 = imageUrl;
      form.value.image1Path = storagePath;
    } else if (imageNumber === 2) {
      form.value.image2 = imageUrl;
      form.value.image2Path = storagePath;
    } else if (imageNumber === 3) {
      form.value.image3 = imageUrl;
      form.value.image3Path = storagePath;
    }
  } catch (err) {
    console.error('Image upload error:', err);
    Swal.fire({ 
      icon: "error", 
      title: "Image upload failed", 
      text: err.message || "Failed to upload image. Please try again.",
      confirmButtonText: "OK"
    });
  } finally {
    if (imageNumber === 1) uploading1.value = false;
    else if (imageNumber === 2) uploading2.value = false;
    else if (imageNumber === 3) uploading3.value = false;
  }
};

const submitForm = async () => {
  try {
    if (!currentUser.value) {
      Swal.fire({ icon: "error", title: "Please log in first." });
      return;
    }

    if (!form.value.title || !form.value.category || !form.value.price || 
        !form.value.actualPrice || !form.value.location || !form.value.image1) {
      Swal.fire({ icon: "error", title: "Please fill all required fields including at least one image." });
      return;
    }

    // Calculate net profit based on actual price
    const netProfit = form.value.actualPrice - form.value.actualPrice * commissionRate;

    const productData = {
      title: form.value.title,
      category: form.value.category,
      price: Number(form.value.price),
      actualPrice: Number(form.value.actualPrice),
      details: form.value.details,
      image1: form.value.image1 || "",
      image1Path: form.value.image1Path || "",
      image2: form.value.image2 || "",
      image2Path: form.value.image2Path || "",
      image3: form.value.image3 || "",
      image3Path: form.value.image3Path || "",
      location: form.value.location,
      userId: currentUser.value.uid,
      netProfit: netProfit,
      ownerName: currentUser.value.displayName || currentUser.value.email,
      isApproved: false
    };

    if (isEdit.value) {
      await updateDoc(doc(db, "products", editId.value), productData);
      Swal.fire({ icon: "success", title: "Updated successfully", timer: 1500, showConfirmButton: false });
    } else {
      await addDoc(collection(db, "products"), {
        ...productData,
        createdAt: serverTimestamp()
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
    
    if (product.image1Path) {
      const imageRef = storageRef(storage, product.image1Path);
      await deleteObject(imageRef).catch((err) => console.warn("Failed to delete image1:", err.message));
    }
    if (product.image2Path) {
      const imageRef = storageRef(storage, product.image2Path);
      await deleteObject(imageRef).catch((err) => console.warn("Failed to delete image2:", err.message));
    }
    if (product.image3Path) {
      const imageRef = storageRef(storage, product.image3Path);
      await deleteObject(imageRef).catch((err) => console.warn("Failed to delete image3:", err.message));
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
    actualPrice: product.actualPrice || product.price, // Fallback to price if no actualPrice
    details: product.details || "",
    image1: product.image1 || "",
    image1Path: product.image1Path || "",
    image2: product.image2 || "",
    image2Path: product.image2Path || "",
    image3: product.image3 || "",
    image3Path: product.image3Path || "",
    location: product.location || ""
  };
  isEdit.value = true;
  editId.value = product.id;
};

const resetForm = () => {
  form.value = {
    title: "",
    category: "",
    price: "",
    actualPrice: "",
    details: "",
    image1: null,
    image1Path: "",
    image2: null,
    image2Path: "",
    image3: null,
    image3Path: "",
    location: ""
  };
  isEdit.value = false;
  editId.value = null;
  uploading.value = false;
  uploading1.value = false;
  uploading2.value = false;
  uploading3.value = false;
};

const highlightText = (text) => {
  if (!searchQuery.value) return text;
  const regex = new RegExp(`(${searchQuery.value})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
};

const netProfit = computed(() => {
  try {
    if (!form.value.actualPrice) return 0;
    return form.value.actualPrice - form.value.actualPrice * commissionRate;
  } catch (e) {
    console.error("Error in netProfit computed:", e);
    return 0;
  }
});

export default function useAdminProducts() {
  return {
    products,
    categories,
    form,
    isEdit,
    currentUser,
    searchQuery,
    selectedCategory,
    uploading,
    uploading1,
    uploading2,
    uploading3,
    netProfit,
    loadProducts,
    loadCategories,
    submitForm,
    handleImageUpload,
    editProduct,
    deleteProduct,
    resetForm,
    highlightText,
    disapproveProduct,
  };
}