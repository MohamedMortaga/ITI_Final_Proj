import { ref } from 'vue'
import { auth } from '../firebase/config'
import { createUserWithEmailAndPassword } from 'firebase/auth'

const error = ref(null) // Fixed typo from 'erro' to 'error'
const isPending = ref(false)

const signup = async (email, password) => {
    error.value = null // Reset error
    isPending.value = true

    try {
        const res = await createUserWithEmailAndPassword(auth, email, password)
        if (!res) {
            throw new Error('Could not complete signup')
        }
        // No need to set error.value = null here, as it's already handled
        isPending.value = false
    } catch (err) {
        error.value = err.message
        console.log(error.value)
        isPending.value = false
    }
}

const useSignup = () => {
    return { error, isPending, signup } // Now 'error' matches the defined variable
}

export default useSignup