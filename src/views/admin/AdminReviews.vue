<template>
    <div class="p-6 max-w-6xl mx-auto">
        <h1 class="text-2xl font-bold mb-6">{{ $t('manageCustomerReviews') }}</h1>

        <!-- WEB REVIEWS (After Booking) - NOW FIRST -->
        <section class="mb-12">
            <h2 class="text-xl font-semibold text-blue-700 mb-4">{{ $t('reviewsAfterBooking') }}</h2>
            <div v-if="loadingWeb">Loading web reviews...</div>
            <div v-else class="grid gap-4">
                <div v-for="review in webReviews.slice().reverse()" :key="review.id"
                    class="bg-white  border rounded-lg p-4 shadow flex justify-between items-start">
                    <div class="flex gap-4">
                        <div v-if="review.userImage">
                            <img :src="review.userImage" alt="User Image" class="w-24 h-24 rounded-full object-cover" />
                        </div>

                        <div>
                            <!-- <p class="font-semibold text-gray-800 dark:text-gray-200">
                                {{ review.productName }} (ID: {{ review.productId }})
                            </p> -->
                            <p class="text-sm text-gray-500">
                                Name: {{ productsMap[review.productId]?.title || 'Unknown Product' }}

                            </p>



                            <p class="text-sm text-gray-700 dark:text-gray-300">{{ review.review }}</p>
                            <p class="text-yellow-500 mt-1">{{ $t('rating') }}: {{ review.rate }} ★</p>
                            <p class="text-xs text-gray-500 mt-1">{{ $t('by') }}: {{ review.userName }}</p>
                            <p class="text-xs text-gray-400">{{ $t('at') }}: {{ formatDate(review.timestamp) }}</p>
                        </div>
                    </div>
                    <div class="flex flex-col gap-2 items-end">
                        <button @click="startEdit(review, 'web-reviews')"
                            class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">{{ $t('edit') }}</button>
                        <button @click="deleteReview(review.id, 'web-reviews')"
                            class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">{{ $t('delete') }}</button>
                    </div>
                </div>
            </div>
        </section>

        <!-- USER REVIEWS (Without Booking) - NOW SECOND -->
        <section class="mb-12">
            <h2 class="text-xl font-semibold text-green-700 mb-4">{{ $t('webReviewsWithoutBooking') }}</h2>
            <div v-if="loadingUser">Loading user reviews...</div>
            <div v-else class="grid gap-4">
                <div v-for="review in userReviews.slice().reverse()" :key="review.id"
                    class="bg-white  border rounded-lg p-4 shadow flex justify-between items-start">
                    <div class="flex gap-4">
                        <img v-if="review.img" :src="review.img" alt="Product" class="w-16 h-16 object-cover rounded" />
                        <div>
                            <p class="font-semibold text-gray-800 dark:text-gray-200">
                                {{ review.productName }}
                            </p>
                            <p class="text-sm text-gray-700 dark:text-gray-300">{{ review.review }}</p>
                            <p class="text-yellow-500 mt-1">{{ $t('rating') }}: {{ review.rate }} ★</p>
                            <p class="text-xs text-gray-500 mt-1">{{ $t('by') }}: {{ review.userName }}</p>
                            <p class="text-xs text-gray-400">{{ $t('at') }}: {{ formatDate(review.timestamp) }}</p>
                        </div>
                    </div>
                    <div class="flex flex-col gap-2 items-end">
                        <button @click="startEdit(review, 'user-reviews')"
                            class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">{{ $t('edit') }}</button>
                        <button @click="deleteReview(review.id, 'user-reviews')"
                            class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">{{ $t('delete') }}</button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Form Add/Edit -->
        <div class="border-t pt-6">
            <h2 class="text-lg font-semibold mb-4">{{ editing ? $t('edit') : $t('add') }} {{ $t('review') }}</h2>
            <form @submit.prevent="saveReview" class="grid gap-4 max-w-md">
                <select v-model="form.collection" class="p-2 border rounded" required>
                    <option value="user-reviews">{{ $t('userReviewsAfterBooking') }}</option>
                    <option value="web-reviews">{{ $t('webReviewsWithoutBooking') }}</option>
                </select>
                <!-- <input v-model="form.productId" placeholder="Product ID" class="p-2 border rounded" required /> -->
                <input v-model="form.userName" placeholder="User Name" class="p-2 border rounded" required />
                <textarea v-model="form.review" placeholder="Review" class="p-2 border rounded" required></textarea>
                <input v-model.number="form.rate" type="number" min="1" max="5" class="p-2 border rounded" required />
                <div class="flex gap-4">
                    <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">{{
                        editing ? $t('update') : $t('add') }}</button>
                    <button type="button" @click="resetForm" v-if="editing"
                        class="bg-gray-400 px-4 py-2 rounded text-white">{{ $t('cancel') }}</button>
                </div>
            </form>
        </div>
    </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import {
    collection,
    getDocs,
    getDoc,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
} from 'firebase/firestore'
import { db } from '@/firebase/config'
const products = ref([]);


const userReviews = ref([])
const webReviews = ref([])
const loadingUser = ref(true)
const loadingWeb = ref(true)
const editing = ref(false)
const editingId = ref(null)
const productsMap = ref({})
const userImage = ref('')

const form = ref({
    productId: '',
    review: '',
    rate: 5,
    userName: '',
    timestamp: new Date(),
    collection: 'user-reviews',
})

const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, "products"));
    snapshot.forEach((doc) => {
        const map = {}
        snapshot.forEach((doc) => {
            map[doc.id] = doc.data()
        })
        productsMap.value = map
    });
};

function enrich(review) {
  const prod = productsMap.value[review.productId] || {}
  console.log('Product ID:', review.productId, '→ Title:', prod.title)
  return {
    ...review,
    productName: prod.title,
    img: prod.img || '',
  }
}



async function fetchUserReviews() {
    loadingUser.value = true
    const snap = await getDocs(collection(db, 'user-reviews'))
    userReviews.value = snap.docs.map(d => enrich({ id: d.id, ...d.data() }))
    loadingUser.value = false
}

async function fetchWebReviews() {
    loadingWeb.value = true
    const snap = await getDocs(collection(db, 'web-reviews'))
    webReviews.value = snap.docs.map(d => enrich({ id: d.id, ...d.data() }))
    loadingWeb.value = false
}

async function saveReview() {
    const data = {
        productId: form.value.productId,
        review: form.value.review,
        rate: form.value.rate,
        userName: form.value.userName,
        timestamp: new Date(),
    }
    if (editing.value) {
        await updateDoc(doc(db, form.value.collection, editingId.value), data)
    } else {
        await addDoc(collection(db, form.value.collection), data)
    }
    resetForm()
    fetchUserReviews()
    fetchWebReviews()
}

function startEdit(review, source) {
    form.value = { ...review, collection: source }
    editing.value = true
    editingId.value = review.id
}

async function deleteReview(id, source) {
    if (confirm('Delete this review?')) {
        await deleteDoc(doc(db, source, id))
        fetchUserReviews()
        fetchWebReviews()
    }
}

function resetForm() {
    editing.value = false
    editingId.value = null
    form.value = {
        productId: '',
        review: '',
        rate: 5,
        userName: '',
        timestamp: new Date(),
        collection: 'user-reviews',
    }
}

function formatDate(ts) {
    return ts?.toDate().toLocaleString() || ''
}

// onMounted(async () => {
//     await fetchProducts()
//     fetchUserReviews()
//     fetchWebReviews()
// })
onMounted(async () => {
    const reviewId = 'P0H7uLmYXtNzPEEOKHTO' // Replace with your document ID
    const docRef = doc(db, 'web-reviews', reviewId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
        userImage.value = docSnap.data().userImage
    }
    await fetchProducts()
    await fetchProducts()
    await fetchUserReviews()
    await fetchWebReviews()
})
</script>

<style scoped>
/* Custom styles */
</style>