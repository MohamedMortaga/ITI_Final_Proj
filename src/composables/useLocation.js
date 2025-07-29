import { ref, watch } from 'vue'

// Create a reactive location state
const userLocation = ref(localStorage.getItem('userLocation') || '')

// Watch for changes and save to localStorage
watch(userLocation, (newLocation) => {
  localStorage.setItem('userLocation', newLocation)
})

export function useLocation() {
  const setLocation = (location) => {
    userLocation.value = location
  }

  const getLocation = () => {
    return userLocation.value
  }

  const clearLocation = () => {
    userLocation.value = ''
    localStorage.removeItem('userLocation')
  }

  return {
    userLocation,
    setLocation,
    getLocation,
    clearLocation
  }
} 