import { ref, computed, onUnmounted } from 'vue'
import { db, auth } from '@/firebase/config'
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  query, 
  orderBy, 
  serverTimestamp,
  limit,
  where,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import Swal from 'sweetalert2'

/**
 * Production-Ready Live Chat System
 * 
 * Features:
 * - Real-time messaging with Firebase Firestore
 * - Proper listener cleanup to prevent memory leaks
 * - Server timestamps for consistent ordering
 * - User identification and authentication
 * - Error handling with user-friendly messages
 * - Message ordering and pagination
 * - Typing indicators
 * - Message status (sent, delivered, read)
 */

export const useChat = (roomId = 'general') => {
  // Reactive state
  const messages = ref([])
  const currentUser = ref(null)
  const loading = ref(true)
  const error = ref(null)
  const sending = ref(false)
  const typingUsers = ref(new Set())
  const unreadCount = ref(0)
  
  // Chat configuration
  const MESSAGES_LIMIT = 50
  const TYPING_TIMEOUT = 3000 // 3 seconds
  
  // Firestore listeners
  let messagesUnsubscribe = null
  let typingUnsubscribe = null
  let userUnsubscribe = null
  
  // Typing timeout handlers
  const typingTimeouts = new Map()

  /**
   * Initialize chat system
   */
  const initializeChat = async () => {
    try {
      loading.value = true
      error.value = null
      
      // Set up authentication listener
      setupAuthListener()
      
      // Set up real-time listeners
      setupMessagesListener()
      setupTypingListener()
      
      loading.value = false
      console.log('✅ Chat system initialized successfully')
      
    } catch (err) {
      console.error('❌ Failed to initialize chat:', err)
      error.value = 'Failed to initialize chat system'
      loading.value = false
      showError('Chat Error', 'Failed to initialize chat system')
    }
  }

  /**
   * Set up authentication listener
   */
  const setupAuthListener = () => {
    userUnsubscribe = onAuthStateChanged(auth, (user) => {
      currentUser.value = user
      
      if (user) {
        console.log('👤 User authenticated:', user.email)
        // Update user's online status
        updateUserStatus('online')
      } else {
        console.log('👤 User signed out')
        // Update user's offline status
        updateUserStatus('offline')
      }
    })
  }

  /**
   * Set up real-time messages listener
   */
  const setupMessagesListener = () => {
    const messagesRef = collection(db, 'chat-rooms', roomId, 'messages')
    const messagesQuery = query(
      messagesRef,
      orderBy('createdAt', 'desc'),
      limit(MESSAGES_LIMIT)
    )
    
    messagesUnsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        const newMessages = []
        
        snapshot.docChanges().forEach((change) => {
          const messageData = {
            id: change.doc.id,
            ...change.doc.data(),
            createdAt: change.doc.data().createdAt?.toDate() || new Date()
          }
          
          if (change.type === 'added') {
            newMessages.unshift(messageData)
          } else if (change.type === 'modified') {
            const index = messages.value.findIndex(m => m.id === messageData.id)
            if (index !== -1) {
              messages.value[index] = messageData
            }
          } else if (change.type === 'removed') {
            messages.value = messages.value.filter(m => m.id !== messageData.id)
          }
        })
        
        // Add new messages
        if (newMessages.length > 0) {
          messages.value.unshift(...newMessages)
          
          // Update unread count for other users' messages
          newMessages.forEach(message => {
            if (message.userId !== currentUser.value?.uid) {
              unreadCount.value++
            }
          })
        }
        
        // Keep messages within limit
        if (messages.value.length > MESSAGES_LIMIT) {
          messages.value = messages.value.slice(0, MESSAGES_LIMIT)
        }
        
        console.log(`🔄 Messages updated: ${newMessages.length} new messages`)
      },
      (err) => {
        console.error('❌ Messages listener error:', err)
        error.value = 'Failed to load messages'
        showError('Messages Error', 'Failed to load messages. Please refresh the page.')
      }
    )
  }

  /**
   * Set up typing indicators listener
   */
  const setupTypingListener = () => {
    const typingRef = collection(db, 'chat-rooms', roomId, 'typing')
    
    typingUnsubscribe = onSnapshot(
      typingRef,
      (snapshot) => {
        const typingUsersSet = new Set()
        
        snapshot.docs.forEach((doc) => {
          const typingData = doc.data()
          const now = Date.now()
          
          // Only show typing if within timeout period
          if (now - typingData.timestamp < TYPING_TIMEOUT) {
            typingUsersSet.add(typingData.userId)
          }
        })
        
        typingUsers.value = typingUsersSet
      },
      (err) => {
        console.error('❌ Typing listener error:', err)
      }
    )
  }

  /**
   * Send a message
   */
  const sendMessage = async (content, type = 'text') => {
    if (!currentUser.value) {
      showError('Authentication Required', 'Please log in to send messages')
      return null
    }
    
    if (!content || content.trim().length === 0) {
      showError('Empty Message', 'Please enter a message')
      return null
    }
    
    try {
      sending.value = true
      
      const messagesRef = collection(db, 'chat-rooms', roomId, 'messages')
      
      const messageData = {
        content: content.trim(),
        type: type, // text, image, file, etc.
        userId: currentUser.value.uid,
        userName: currentUser.value.displayName || currentUser.value.email,
        userEmail: currentUser.value.email,
        userAvatar: currentUser.value.photoURL || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'sent', // sent, delivered, read
        readBy: [currentUser.value.uid], // Users who have read this message
        reactions: {}, // Message reactions
        replyTo: null, // Reply to another message
        edited: false,
        deleted: false
      }
      
      const docRef = await addDoc(messagesRef, messageData)
      
      // Stop typing indicator
      stopTyping()
      
      // Mark as delivered after a short delay
      setTimeout(() => {
        updateMessageStatus(docRef.id, 'delivered')
      }, 1000)
      
      sending.value = false
      console.log('✅ Message sent successfully:', docRef.id)
      
      return docRef.id
      
    } catch (err) {
      console.error('❌ Failed to send message:', err)
      sending.value = false
      error.value = 'Failed to send message'
      showError('Send Error', 'Failed to send message. Please try again.')
      return null
    }
  }

  /**
   * Update message status
   */
  const updateMessageStatus = async (messageId, status) => {
    try {
      const messageRef = doc(db, 'chat-rooms', roomId, 'messages', messageId)
      await updateDoc(messageRef, {
        status: status,
        updatedAt: serverTimestamp()
      })
    } catch (err) {
      console.error('❌ Failed to update message status:', err)
    }
  }

  /**
   * Mark message as read
   */
  const markMessageAsRead = async (messageId) => {
    if (!currentUser.value) return
    
    try {
      const messageRef = doc(db, 'chat-rooms', roomId, 'messages', messageId)
      await updateDoc(messageRef, {
        status: 'read',
        readBy: [currentUser.value.uid],
        updatedAt: serverTimestamp()
      })
    } catch (err) {
      console.error('❌ Failed to mark message as read:', err)
    }
  }

  /**
   * Mark all messages as read
   */
  const markAllAsRead = async () => {
    if (!currentUser.value) return
    
    try {
      const unreadMessages = messages.value.filter(
        message => 
          message.userId !== currentUser.value.uid && 
          !message.readBy?.includes(currentUser.value.uid)
      )
      
      const updatePromises = unreadMessages.map(message => 
        markMessageAsRead(message.id)
      )
      
      await Promise.all(updatePromises)
      unreadCount.value = 0
      
    } catch (err) {
      console.error('❌ Failed to mark all as read:', err)
    }
  }

  /**
   * Start typing indicator
   */
  const startTyping = async () => {
    if (!currentUser.value) return
    
    try {
      const typingRef = collection(db, 'chat-rooms', roomId, 'typing')
      const typingDoc = doc(typingRef, currentUser.value.uid)
      
      await updateDoc(typingDoc, {
        userId: currentUser.value.uid,
        userName: currentUser.value.displayName || currentUser.value.email,
        timestamp: Date.now()
      })
      
      // Clear existing timeout
      if (typingTimeouts.has(currentUser.value.uid)) {
        clearTimeout(typingTimeouts.get(currentUser.value.uid))
      }
      
      // Set new timeout to stop typing
      const timeout = setTimeout(() => {
        stopTyping()
      }, TYPING_TIMEOUT)
      
      typingTimeouts.set(currentUser.value.uid, timeout)
      
    } catch (err) {
      console.error('❌ Failed to start typing indicator:', err)
    }
  }

  /**
   * Stop typing indicator
   */
  const stopTyping = async () => {
    if (!currentUser.value) return
    
    try {
      const typingRef = collection(db, 'chat-rooms', roomId, 'typing')
      const typingDoc = doc(typingRef, currentUser.value.uid)
      
      await deleteDoc(typingDoc)
      
      // Clear timeout
      if (typingTimeouts.has(currentUser.value.uid)) {
        clearTimeout(typingTimeouts.get(currentUser.value.uid))
        typingTimeouts.delete(currentUser.value.uid)
      }
      
    } catch (err) {
      console.error('❌ Failed to stop typing indicator:', err)
    }
  }

  /**
   * Update user status
   */
  const updateUserStatus = async (status) => {
    if (!currentUser.value) return
    
    try {
      const userRef = doc(db, 'users', currentUser.value.uid)
      await updateDoc(userRef, {
        status: status,
        lastSeen: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
    } catch (err) {
      console.error('❌ Failed to update user status:', err)
    }
  }

  /**
   * Edit message
   */
  const editMessage = async (messageId, newContent) => {
    if (!currentUser.value) return false
    
    try {
      const messageRef = doc(db, 'chat-rooms', roomId, 'messages', messageId)
      await updateDoc(messageRef, {
        content: newContent.trim(),
        edited: true,
        updatedAt: serverTimestamp()
      })
      
      console.log('✅ Message edited successfully')
      return true
      
    } catch (err) {
      console.error('❌ Failed to edit message:', err)
      showError('Edit Error', 'Failed to edit message. Please try again.')
      return false
    }
  }

  /**
   * Delete message
   */
  const deleteMessage = async (messageId) => {
    if (!currentUser.value) return false
    
    try {
      const messageRef = doc(db, 'chat-rooms', roomId, 'messages', messageId)
      await updateDoc(messageRef, {
        deleted: true,
        content: '[Message deleted]',
        updatedAt: serverTimestamp()
      })
      
      console.log('✅ Message deleted successfully')
      return true
      
    } catch (err) {
      console.error('❌ Failed to delete message:', err)
      showError('Delete Error', 'Failed to delete message. Please try again.')
      return false
    }
  }

  /**
   * Add reaction to message
   */
  const addReaction = async (messageId, reaction) => {
    if (!currentUser.value) return false
    
    try {
      const messageRef = doc(db, 'chat-rooms', roomId, 'messages', messageId)
      const message = messages.value.find(m => m.id === messageId)
      
      if (!message) return false
      
      const reactions = message.reactions || {}
      const userReactions = reactions[reaction] || []
      
      if (userReactions.includes(currentUser.value.uid)) {
        // Remove reaction
        userReactions.splice(userReactions.indexOf(currentUser.value.uid), 1)
      } else {
        // Add reaction
        userReactions.push(currentUser.value.uid)
      }
      
      if (userReactions.length === 0) {
        delete reactions[reaction]
      } else {
        reactions[reaction] = userReactions
      }
      
      await updateDoc(messageRef, {
        reactions: reactions,
        updatedAt: serverTimestamp()
      })
      
      return true
      
    } catch (err) {
      console.error('❌ Failed to add reaction:', err)
      return false
    }
  }

  /**
   * Show error message
   */
  const showError = (title, message) => {
    Swal.fire({
      icon: 'error',
      title: title,
      text: message,
      confirmButtonText: 'OK'
    })
  }

  /**
   * Computed properties
   */
  const isAuthenticated = computed(() => !!currentUser.value)
  const canSendMessage = computed(() => isAuthenticated.value && !sending.value)
  const typingMessage = computed(() => {
    const typingUsersList = Array.from(typingUsers.value)
    if (typingUsersList.length === 0) return ''
    
    const typingUser = typingUsersList.find(userId => userId !== currentUser.value?.uid)
    if (!typingUser) return ''
    
    return `${typingUser} is typing...`
  })

  /**
   * Cleanup function
   */
  const cleanup = () => {
    console.log('🧹 Cleaning up chat system...')
    
    // Stop typing
    stopTyping()
    
    // Update user status to offline
    updateUserStatus('offline')
    
    // Clear typing timeouts
    typingTimeouts.forEach(timeout => clearTimeout(timeout))
    typingTimeouts.clear()
    
    // Unsubscribe from listeners
    if (messagesUnsubscribe) {
      messagesUnsubscribe()
      messagesUnsubscribe = null
    }
    
    if (typingUnsubscribe) {
      typingUnsubscribe()
      typingUnsubscribe = null
    }
    
    if (userUnsubscribe) {
      userUnsubscribe()
      userUnsubscribe = null
    }
    
    // Reset state
    messages.value = []
    typingUsers.value.clear()
    unreadCount.value = 0
    loading.value = false
    error.value = null
    sending.value = false
    
    console.log('✅ Chat system cleaned up')
  }

  // Auto-cleanup on component unmount
  onUnmounted(() => {
    cleanup()
  })

  return {
    // State
    messages,
    currentUser,
    loading,
    error,
    sending,
    typingUsers,
    unreadCount,
    
    // Computed
    isAuthenticated,
    canSendMessage,
    typingMessage,
    
    // Methods
    initializeChat,
    sendMessage,
    editMessage,
    deleteMessage,
    addReaction,
    markMessageAsRead,
    markAllAsRead,
    startTyping,
    stopTyping,
    cleanup
  }
} 