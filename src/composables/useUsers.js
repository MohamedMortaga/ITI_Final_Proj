// composables/useUsers.js
import { ref, onMounted } from 'vue'
import { db } from '@/firebase'
import { collection, getDocs } from 'firebase/firestore'

export default function useUsers() {
  const users = ref([])
  const error = ref(null)

  const loadUsers = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'users'))
      users.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (err) {
      error.value = err.message
    }
  }

  onMounted(loadUsers)

  return { users, error }
}
