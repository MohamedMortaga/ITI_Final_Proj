<template>
    <div class="p-6 max-w-6xl mx-auto bg-default">
        <h1 class="text-2xl font-bold mb-6 text-default">{{ $t('manageCustomerReviews') }}</h1>

        <!-- WEB REVIEWS (After Booking) - NOW FIRST -->
        <section class="mb-12">
            <h2 class="text-xl font-semibold text-default mb-4">{{ $t('reviewsAfterBooking') }}</h2>
            <div v-if="loadingWeb" class="text-default">Loading web reviews...</div>
            <div v-else class="grid gap-4">
                <div v-for="review in webReviews.slice().reverse()" :key="review.id"
                    class="bg-default border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div class="flex gap-4">
                        <div v-if="review.userImage" class="flex-shrink-0">
                            <img :src="review.userImage" alt="User Image" class="w-16 h-16 rounded-full object-cover border-2 border-gray-200" />
                        </div>

                        <div class="flex-1">
                            <p class="text-sm text-default mb-2">{{ review.review }}</p>
                            <div class="flex items-center gap-4 text-sm">
                                <span class="text-yellow-500 font-medium">{{ $t('rating') }}: {{ review.rate }} ★</span>
                                <span class="text-gray-500">{{ $t('by') }}: {{ review.userName }}</span>
                                <span class="text-gray-400">{{ $t('at') }}: {{ formatDate(review.timestamp) }}</span>
                            </div>
                        </div>
                        
                        <div class="flex flex-col gap-2 items-end">
                            <button @click="startEdit(review, 'web-reviews')"
                                class="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors duration-200">
                                <i class="fas fa-edit mr-2"></i>{{ $t('edit') }}
                            </button>
                            <button @click="deleteReview(review.id, 'web-reviews')"
                                class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200">
                                <i class="fas fa-trash mr-2"></i>{{ $t('delete') }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- USER REVIEWS (Without Booking) - NOW SECOND -->
        <section class="mb-12">
            <h2 class="text-xl font-semibold text-default mb-4">{{ $t('webReviewsWithoutBooking') }}</h2>
            <div v-if="loadingUser" class="text-default">Loading user reviews...</div>
            <div v-else class="grid gap-4">
                <div v-for="review in userReviews.slice().reverse()" :key="review.id"
                    class="bg-default border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div class="flex gap-4">
                        <div class="flex-1">
                            <p class="font-semibold text-default mb-1">{{ review.productName }}</p>
                            <p class="text-sm text-default mb-2">{{ review.review }}</p>
                            <div class="flex items-center gap-4 text-sm">
                                <span class="text-yellow-500 font-medium">{{ $t('rating') }}: {{ review.rate }} ★</span>
                                <span class="text-gray-500">{{ $t('by') }}: {{ review.userName }}</span>
                                <span class="text-gray-400">{{ $t('at') }}: {{ formatDate(review.timestamp) }}</span>
                            </div>
                        </div>
                        
                        <div class="flex flex-col gap-2 items-end">
                            <button @click="startEdit(review, 'user-reviews')"
                                class="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors duration-200">
                                <i class="fas fa-edit mr-2"></i>{{ $t('edit') }}
                            </button>
                            <button @click="deleteReview(review.id, 'user-reviews')"
                                class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200">
                                <i class="fas fa-trash mr-2"></i>{{ $t('delete') }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Edit Form -->
        <div v-if="editing" class="border-t border-gray-200 pt-6 mt-8">
            <div class="bg-default border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 class="text-lg font-semibold mb-4 text-default">{{ $t('edit') }} {{ $t('review') }}</h2>
                <form @submit.prevent="saveReview" class="grid gap-4 max-w-md">
                    <div>
                        <label class="block text-sm font-medium text-default mb-2">{{ $t('userName') }}</label>
                        <input v-model="form.userName" 
                               placeholder="User Name" 
                               class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-default text-default" 
                               required />
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-default mb-2">{{ $t('review') }}</label>
                        <textarea v-model="form.review" 
                                  placeholder="Review" 
                                  rows="4"
                                  class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-default text-default resize-none" 
                                  required></textarea>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-default mb-2">{{ $t('rating') }}</label>
                        <input v-model.number="form.rate" 
                               type="number" 
                               min="1" 
                               max="5" 
                               class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-default text-default" 
                               required />
                    </div>
                    
                    <div class="flex gap-4">
                                                 <button type="submit" 
                                 class="bg-primary-500 text-white px-6 py-3 rounded-md hover:bg-primary-600 transition-colors duration-200 font-medium">
                             <i class="fas fa-save mr-2"></i>{{ $t('update') }}
                         </button>
                        <button type="button" 
                                @click="resetForm"
                                class="bg-gray-400 text-white px-6 py-3 rounded-md hover:bg-gray-500 transition-colors duration-200 font-medium">
                            <i class="fas fa-times mr-2"></i>{{ $t('cancel') }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue'
import {
    getDoc,
    deleteDoc,
    doc,
    updateDoc,
} from 'firebase/firestore'
import { db } from '@/firebase/config'
import { useAdminRealTime } from '@/composables/useAdminRealTime'
import { useReviewsRealTime } from '@/composables/useReviewsRealTime'

// Initialize real-time data
const { products, initializeRealTimeData, cleanup } = useAdminRealTime()
const { userReviews, webReviews, loading, initializeRealTimeReviews, cleanup: cleanupReviews } = useReviewsRealTime()

const loadingUser = computed(() => loading.value.userReviews)
const loadingWeb = computed(() => loading.value.webReviews)
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

// Update products map when products change
const updateProductsMap = () => {
    const map = {}
    products.value.forEach((product) => {
        map[product.id] = product
    })
    productsMap.value = map
}

function enrich(review) {
    const prod = productsMap.value[review.productId] || {}
    return {
        ...review,
        productName: prod.title,
        img: prod.img || '',
    }
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
        resetForm()
    }
}

function startEdit(review, source) {
    form.value = { ...review, collection: source }
    editing.value = true
    editingId.value = review.id
}

async function deleteReview(id, source) {
    if (confirm('Delete this review?')) {
        await deleteDoc(doc(db, source, id))
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

onMounted(async () => {
    initializeRealTimeData()
    initializeRealTimeReviews()
    
    // Update products map when products are loaded
    updateProductsMap()
    
    // Get user image from a specific review if needed
    const reviewId = 'P0H7uLmYXtNzPEEOKHTO' // Replace with your document ID
    const docRef = doc(db, 'web-reviews', reviewId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
        userImage.value = docSnap.data().userImage
    }
})
</script>

<style scoped>
/* Using main.css variables and styles */
</style>