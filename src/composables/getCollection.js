import { ref, watchEffect } from 'vue'
import { db } from '../firebase/config'
import { collection, onSnapshot } from 'firebase/firestore'
import Swal from 'sweetalert2'

const getCollection = (collectionName) => {
  const documents = ref(null)
  const error = ref(null)

  let unsub

  try {
    const colRef = collection(db, collectionName)

    unsub = onSnapshot(
      colRef,
      (snapshot) => {
        const results = snapshot.docs.map(doc => {
          const data = doc.data()
          return {
            ...data,
            id: doc.id,
            createdAt: data.createdAt || null // fallback if createdAt is missing
          }
        })

        documents.value = results
        error.value = null
      },
      (err) => {
        console.error('Snapshot error:', err.message)
        documents.value = null
        error.value = 'Failed to fetch data from Firestore'

        Swal.fire({
          icon: 'error',
          title: 'Data Load Error',
          text: 'An error occurred while fetching data from Firestore.',
          timer: 2000,
          showConfirmButton: false
        })
      }
    )
  } catch (err) {
    error.value = 'Failed to connect to Firestore collection'
    console.error('Firestore error:', err.message)

    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'Oops...',
      text: err.message,
      showConfirmButton: false,
      timer: 1500
    })
  }

  watchEffect((onInvalidate) => {
    if (typeof unsub === 'function') {
      onInvalidate(() => unsub()) // Stop listening on component unmount
    }
  })

  return { documents, error }
}

export default getCollection
