<template>
  <div class="w-full border-b border-[var(--Color-Surface-Surface-Tertiary)] bg-transparent ">
    <div class="container mx-auto px-4 py-4 flex flex-col gap-4">
      <div class="flex flex-row items-center gap-0 sm:gap-4 w-full">
        <div class="relative flex items-center w-[100px] sm:w-[140px]">
          <i class="fa-solid fa-location-dot absolute left-0 sm:left-4 top-1/2 -translate-y-1/2 text-[var(--Color-Text-Text-Brand)] w-5 h-5 pointer-events-none"></i>
          <select
            :value="selectedLocation"
            @change="handleLocationChange"
            class="appearance-none pl-6 sm:pl-12 pr-10 py-3 w-full border-0 sm:border rounded-lg focus:outline-none focus:ring-0 sm:focus:ring-2 focus:ring-[var(--Color-Text-Text-Brand)] text-base font-semibold text-[var(--Color-Text-Text-Primary)] bg-[var(--Color-Surface-Surface-Primary)] border-[var(--Color-Boarder-Border-Primary)] dark:border-[var(--Color-Boarder-Border-Primary)]"
            style="background-image: url('data:image/svg+xml;utf8,<svg fill=\'%23999\' height=\'16\' viewBox=\'0 0 24 24\' width=\'16\' xmlns=\'http://www.w3.org/2000/svg\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'></path></svg>'); background-repeat: no-repeat; background-position: right 1rem center;"
          >
            <option value="" class="hidden sm:block">All</option>
            <option value="cairo">{{ $t('cairo') }}</option>
            <option value="alexandria">{{ $t('alexandria') }}</option>
            <option value="mansoura">{{ $t('mansoura') }}</option>
            <option value="giza">{{ $t('giza') }}</option>
            <option value="sharmElSheikh">{{ $t('sharmElSheikh') }}</option>
            <option value="hurghada">{{ $t('hurghada') }}</option>
            <option value="luxor">{{ $t('luxor') }}</option>
            <option value="aswan">{{ $t('aswan') }}</option>
            <option value="portSaid">{{ $t('portSaid') }}</option>
            <option value="suez">{{ $t('suez') }}</option>
            <option value="ismailia">{{ $t('ismailia') }}</option>
            <option value="beniSuef">{{ $t('beniSuef') }}</option>
            <option value="minya">{{ $t('minya') }}</option>
            <option value="assiut">{{ $t('assiut') }}</option>
            <option value="sohag">{{ $t('sohag') }}</option>
            <option value="qena">{{ $t('qena') }}</option>
            <option value="redSea">{{ $t('redSea') }}</option>
            <option value="newValley">{{ $t('newValley') }}</option>
            <option value="matruh">{{ $t('matruh') }}</option>
            <option value="northSinai">{{ $t('northSinai') }}</option>
            <option value="southSinai">{{ $t('southSinai') }}</option>
            <option value="beheira">{{ $t('beheira') }}</option>
            <option value="gharbiya">{{ $t('gharbiya') }}</option>
            <option value="kafrElSheikh">{{ $t('kafrElSheikh') }}</option>
            <option value="dakahlia">{{ $t('dakahlia') }}</option>
            <option value="sharqiya">{{ $t('sharqiya') }}</option>
            <option value="qalyubiya">{{ $t('qalyubiya') }}</option>
            <option value="monufiya">{{ $t('monufiya') }}</option>
            <option value="fayoum">{{ $t('fayoum') }}</option>
          </select>
        </div>
        <div class="relative flex-1 w-full">
          <i class="fa-solid fa-magnifying-glass absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-[var(--Color-Text-Text-Brand)] w-5 h-5 pointer-events-none"></i>
          <input 
            :value="searchQuery" 
            @input="handleSearchInput" 
            @focus="showDropdown = true"
            @blur="handleBlur"
            type="text" 
            :placeholder="$t('searchPlaceholder')"
            class="pl-8 sm:pl-12 pr-4 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--Color-Text-Text-Brand)] text-base text-[var(--Color-Text-Text-Primary)] placeholder-[var(--Color-Text-Text-Secondary)] bg-[var(--Color-Surface-Surface-Primary)] border-[var(--Color-Boarder-Border-Primary)] dark:border-[var(--Color-Boarder-Border-Primary)]" 
          />
          
          <!-- Search Results Dropdown -->
          <div 
            v-if="showDropdown && filteredResults.length > 0" 
            class="absolute top-full left-0 right-0 mt-1 bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
          >
            <div 
              v-for="product in filteredResults.slice(0, 5)" 
              :key="product.id"
              @click="selectProduct(product)"
              class="flex items-center gap-3 p-3 hover:bg-gray-25 dark:hover:bg-gray-600 cursor-pointer border-b border-[var(--Color-Boarder-Border-Primary)] last:border-b-0 transition-colors"
            >
              <div class="w-12 h-12 flex-shrink-0">
                <img 
                  :src="product.image1 || require('@/assets/default.png')" 
                  :alt="product.title"
                  class="w-full h-full object-cover rounded-lg"
                  @error="$event.target.src = require('@/assets/default.png')"
                />
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-medium text-[var(--Color-Text-Text-Primary)] truncate">
                  {{ product.title }}
                </h4>
                <p class="text-xs text-[var(--Color-Text-Text-Secondary)]">
                  {{ product.category }} • {{ product.location }}
                </p>
                <p class="text-xs text-[var(--Color-Text-Text-Brand)] font-medium">
                  EGP {{ product.price }}/day
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useLocation } from '@/composables/useLocation'
import { useGlobalRealTime } from '@/composables/useGlobalRealTime'
import { useRouter } from 'vue-router'
import { getAuth } from 'firebase/auth'
import Swal from 'sweetalert2'

export default {
  props: {
    searchQuery: {
      type: String,
      required: true
    },
    selectedLocation: {
      type: String,
      required: true,
      default: ""
    }
  },
  setup(props, { emit }) {
    const { userLocation, setLocation } = useLocation()
    const { products } = useGlobalRealTime()
    const router = useRouter()
    
    const showDropdown = ref(false)
    const searchTimeout = ref(null)

    // Filter products based on search query
    const filteredResults = computed(() => {
      if (!props.searchQuery || !products.value) return []
      
      const query = props.searchQuery.toLowerCase()
      return products.value
        .filter(product => product.isApproved === true)
        .filter(product => 
          product.title?.toLowerCase().includes(query) ||
          product.category?.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query)
        )
        .slice(0, 5) // Limit to 5 results
    })

    // Handle search input
    const handleSearchInput = (event) => {
      const value = event.target.value
      emit('update:searchQuery', value)
      
      // Clear previous timeout
      if (searchTimeout.value) {
        clearTimeout(searchTimeout.value)
      }
      
      // Show dropdown after a short delay
      searchTimeout.value = setTimeout(() => {
        showDropdown.value = value.length > 0
      }, 300)
    }

    // Handle blur event
    const handleBlur = () => {
      // Delay hiding dropdown to allow for clicks
      setTimeout(() => {
        showDropdown.value = false
      }, 200)
    }

    // Select a product from dropdown
    const selectProduct = (product) => {
      emit('update:searchQuery', product.title)
      showDropdown.value = false
      
      // Check if user is authenticated
      const auth = getAuth()
      if (auth.currentUser) {
        // User is authenticated, navigate to product details
        router.push({ name: 'ProductDetails', params: { id: product.id } })
      } else {
        // User is not authenticated, show login prompt
        Swal.fire({
          position: "top-end",
          icon: "warning",
          title: "Please log in to view product details",
          showConfirmButton: true,
          confirmButtonText: "Go to Login",
        }).then((result) => {
          if (result.isConfirmed) {
            router.push({ name: 'Login' })
          }
        })
      }
    }

    // Watch for changes in the selectedLocation prop and update global state
    const handleLocationChange = (event) => {
      const newLocation = event.target.value
      setLocation(newLocation)
      emit('update:selectedLocation', newLocation)
    }

    // Initialize with global location if no prop is provided
    if (!props.selectedLocation && userLocation.value) {
      emit('update:selectedLocation', userLocation.value)
    }

    // Watch for search query changes
    watch(() => props.searchQuery, (newQuery) => {
      if (!newQuery) {
        showDropdown.value = false
      }
    })

    return {
      handleLocationChange,
      handleSearchInput,
      handleBlur,
      selectProduct,
      showDropdown,
      filteredResults
    }
  }
}
</script>

<style scoped>
input {
  transition: all 0.3s ease;
}
</style>