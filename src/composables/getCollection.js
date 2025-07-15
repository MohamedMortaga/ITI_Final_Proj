import { ref, watchEffect } from 'vue'
import { db } from '../firebase/config'
import { collection, onSnapshot } from 'firebase/firestore'
import Swal from 'sweetalert2';
const getCollection = (collectionName) => {
  const documents = ref(null)
  const error = ref(null)


  let unsub

 
  try {
    const colRef = collection(db, collectionName)

    unsub = onSnapshot(
      colRef,
      (snapshot) => {
        let results = []
        snapshot.docs.forEach(doc => {
          results.push({ ...doc.data(), id: doc.id })
        })
        documents.value = results
        error.value = null
      },
      (err) => {
        console.log(err.message)
        documents.value = null
        error.value = 'Could not fetch data'
      }
    )
  } catch (err) {
     Swal.fire({
              position: "top-end",
              icon: "error",
              title: "Oops... " +err.message,
              showConfirmButton: false,
              timer: 1500
        });
    console.log('Firestore error:', err.message)
    error.value = 'Failed to connect to collection'
  }

  
  watchEffect((onInvalidate) => {
    if (typeof unsub === 'function') {
      onInvalidate(() => unsub())
    }
  })

  return { documents, error }
}

export default getCollection
