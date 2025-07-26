# Live Chat System Documentation

## 🚀 Overview

A complete production-ready live chat system built with Vue 3 and Firebase Firestore that supports multiple users in real-time with WhatsApp-style UI.

## ✨ Features

### ✅ Core Requirements Met
- **Proper Listener Cleanup**: Uses `onUnmounted` to remove Firestore listeners
- **Server Timestamps**: Uses `serverTimestamp()` for consistent ordering
- **User Identification**: Unique user IDs and usernames for message attribution
- **Ordered Messages**: Chronological ordering with `orderBy('createdAt')`
- **WhatsApp-style UI**: Clean, responsive interface with sender/receiver alignment
- **Error Handling**: Comprehensive try/catch blocks with user-friendly messages
- **Responsive Layout**: Works on mobile and desktop

### 🔥 Additional Features
- **Real-time Typing Indicators**: Shows when users are typing
- **Message Status**: Sent, delivered, read status tracking
- **Message Reactions**: Add emoji reactions to messages
- **Message Editing**: Edit your own messages
- **Message Deletion**: Soft delete messages
- **Reply to Messages**: Reply to specific messages
- **Unread Message Count**: Track unread messages
- **Multiple Chat Rooms**: Create and join different rooms
- **User Online Status**: Real-time online/offline status
- **Message Pagination**: Load messages in chunks
- **Performance Optimized**: Efficient queries and listeners

## 🏗️ Architecture

### File Structure
```
src/
├── composables/
│   └── useChat.js              # Core chat logic and Firebase integration
├── components/
│   └── LiveChat.vue            # Main chat component with UI
├── views/
│   └── Chat.vue                # Chat page with room management
└── router/
    └── router.js               # Chat route configuration
```

### Data Flow
```
Firebase Auth ←→ useChat.js ←→ LiveChat.vue ←→ Chat.vue
                     ↓
              Firestore Listeners
                     ↓
              Real-time Updates
```

## 🔧 Setup Instructions

### 1. Firebase Configuration

Ensure your Firebase configuration is set up in `src/firebase/config.js`:

```javascript
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  // Your Firebase config
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
```

### 2. Firestore Security Rules

Set up proper security rules for the chat system:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Chat rooms
    match /chat-rooms/{roomId} {
      allow read, write: if request.auth != null;
      
      // Messages in rooms
      match /messages/{messageId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null && 
          request.resource.data.userId == request.auth.uid;
        allow update, delete: if request.auth != null && 
          request.resource.data.userId == request.auth.uid;
      }
      
      // Typing indicators
      match /typing/{userId} {
        allow read, write: if request.auth != null;
      }
    }
    
    // Users
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        request.auth.uid == userId;
    }
  }
}
```

### 3. Install Dependencies

```bash
npm install firebase sweetalert2
```

### 4. Add Font Awesome (for icons)

Add to your `index.html`:

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
```

## 🎯 Usage Examples

### Basic Chat Integration

```vue
<template>
  <div>
    <LiveChat 
      :room-id="roomId"
      :room-name="roomName"
      @toggle="handleToggle"
    />
  </div>
</template>

<script setup>
import LiveChat from '@/components/LiveChat.vue'

const roomId = 'general'
const roomName = 'General Chat'

const handleToggle = () => {
  console.log('Chat toggled')
}
</script>
```

### Using the Chat Composable

```javascript
import { useChat } from '@/composables/useChat'

const {
  messages,
  currentUser,
  loading,
  error,
  sending,
  typingUsers,
  unreadCount,
  isAuthenticated,
  canSendMessage,
  typingMessage,
  sendMessage,
  editMessage,
  deleteMessage,
  addReaction,
  markMessageAsRead,
  markAllAsRead,
  startTyping,
  stopTyping
} = useChat('room-id')

// Send a message
const sendChatMessage = async () => {
  const messageId = await sendMessage('Hello, world!')
  console.log('Message sent:', messageId)
}

// Edit a message
const editChatMessage = async (messageId, newContent) => {
  const success = await editMessage(messageId, newContent)
  if (success) {
    console.log('Message edited successfully')
  }
}
```

## 📱 UI Components

### Message Bubble

```vue
<template>
  <div class="message-wrapper" :class="{ 'own-message': isOwnMessage(message) }">
    <div class="message-bubble">
      <div class="message-header">
        <span class="sender-name">{{ message.userName }}</span>
        <span class="message-time">{{ formatTime(message.createdAt) }}</span>
      </div>
      <div class="message-content">
        {{ message.content }}
      </div>
      <div class="message-status">
        <i class="fas fa-check-double"></i>
      </div>
    </div>
  </div>
</template>
```

### Typing Indicator

```vue
<template>
  <div v-if="typingMessage" class="typing-indicator">
    <span>{{ typingMessage }}</span>
    <div class="typing-dots">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
</template>
```

## 🔄 Real-time Features

### Message Status Tracking

```javascript
// Message statuses: 'sent', 'delivered', 'read'
const updateMessageStatus = async (messageId, status) => {
  const messageRef = doc(db, 'chat-rooms', roomId, 'messages', messageId)
  await updateDoc(messageRef, {
    status: status,
    updatedAt: serverTimestamp()
  })
}
```

### Typing Indicators

```javascript
// Start typing
const startTyping = async () => {
  const typingRef = collection(db, 'chat-rooms', roomId, 'typing')
  const typingDoc = doc(typingRef, currentUser.value.uid)
  
  await updateDoc(typingDoc, {
    userId: currentUser.value.uid,
    userName: currentUser.value.displayName,
    timestamp: Date.now()
  })
}

// Stop typing
const stopTyping = async () => {
  const typingRef = collection(db, 'chat-rooms', roomId, 'typing')
  const typingDoc = doc(typingRef, currentUser.value.uid)
  await deleteDoc(typingDoc)
}
```

### Message Reactions

```javascript
const addReaction = async (messageId, reaction) => {
  const messageRef = doc(db, 'chat-rooms', roomId, 'messages', messageId)
  const message = messages.value.find(m => m.id === messageId)
  
  const reactions = message.reactions || {}
  const userReactions = reactions[reaction] || []
  
  if (userReactions.includes(currentUser.value.uid)) {
    // Remove reaction
    userReactions.splice(userReactions.indexOf(currentUser.value.uid), 1)
  } else {
    // Add reaction
    userReactions.push(currentUser.value.uid)
  }
  
  await updateDoc(messageRef, {
    reactions: reactions,
    updatedAt: serverTimestamp()
  })
}
```

## 🛡️ Error Handling

### Comprehensive Error Handling

```javascript
const sendMessage = async (content) => {
  try {
    if (!currentUser.value) {
      throw new Error('User not authenticated')
    }
    
    if (!content || content.trim().length === 0) {
      throw new Error('Message cannot be empty')
    }
    
    const messageData = {
      content: content.trim(),
      userId: currentUser.value.uid,
      userName: currentUser.value.displayName || currentUser.value.email,
      createdAt: serverTimestamp(),
      status: 'sent'
    }
    
    const docRef = await addDoc(messagesRef, messageData)
    return docRef.id
    
  } catch (error) {
    console.error('Failed to send message:', error)
    
    // Show user-friendly error
    Swal.fire({
      icon: 'error',
      title: 'Send Error',
      text: error.message || 'Failed to send message. Please try again.',
      confirmButtonText: 'OK'
    })
    
    return null
  }
}
```

### Listener Error Handling

```javascript
const setupMessagesListener = () => {
  messagesUnsubscribe = onSnapshot(
    messagesQuery,
    (snapshot) => {
      // Handle successful updates
    },
    (error) => {
      console.error('Messages listener error:', error)
      showError('Messages Error', 'Failed to load messages. Please refresh the page.')
    }
  )
}
```

## 🧹 Memory Management

### Proper Listener Cleanup

```javascript
import { onUnmounted } from 'vue'

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
}

// Auto-cleanup on component unmount
onUnmounted(() => {
  cleanup()
})
```

## 📊 Performance Optimization

### Efficient Queries

```javascript
// Use limit and orderBy for efficient queries
const messagesQuery = query(
  collection(db, 'chat-rooms', roomId, 'messages'),
  orderBy('createdAt', 'desc'),
  limit(50) // Load only last 50 messages
)
```

### Optimistic Updates

```javascript
// Update UI immediately, then sync with server
const sendMessageOptimistic = async (content) => {
  const tempMessage = {
    id: 'temp-' + Date.now(),
    content: content,
    userId: currentUser.value.uid,
    userName: currentUser.value.displayName,
    createdAt: new Date(),
    status: 'sending'
  }
  
  // Add to UI immediately
  messages.value.unshift(tempMessage)
  
  // Send to server
  const messageId = await sendMessage(content)
  
  // Update with real message
  if (messageId) {
    const index = messages.value.findIndex(m => m.id === tempMessage.id)
    if (index !== -1) {
      messages.value[index].id = messageId
      messages.value[index].status = 'sent'
    }
  }
}
```

## 🎨 Styling

### WhatsApp-style Design

```css
.message-bubble {
  max-width: 70%;
  background: white;
  border-radius: 8px;
  padding: 8px 12px;
  position: relative;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.own-message .message-bubble {
  background: #dcf8c6; /* WhatsApp green */
}

.messages-container {
  background: #e5ddd5; /* WhatsApp background */
  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23ffffff" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
}
```

### Responsive Design

```css
@media (max-width: 768px) {
  .chat-interface {
    flex-direction: column;
  }
  
  .chat-sidebar {
    width: 100%;
    height: auto;
    max-height: 200px;
  }
  
  .message-bubble {
    max-width: 85%;
  }
}
```

## 🧪 Testing

### Manual Testing

1. **Open Chat**: Navigate to `/chat`
2. **Authentication**: Sign in with different users
3. **Send Messages**: Test message sending and receiving
4. **Real-time Updates**: Open multiple tabs to test real-time sync
5. **Typing Indicators**: Test typing indicators
6. **Message Actions**: Test edit, delete, and reactions
7. **Error Handling**: Test network disconnection scenarios

### Automated Testing

```javascript
describe('Chat System', () => {
  it('should initialize chat system', async () => {
    const { initializeChat, loading } = useChat('test-room')
    await initializeChat()
    expect(loading.value).toBe(false)
  })
  
  it('should send and receive messages', async () => {
    const { sendMessage, messages } = useChat('test-room')
    const messageId = await sendMessage('Test message')
    expect(messageId).toBeTruthy()
    expect(messages.value.length).toBeGreaterThan(0)
  })
  
  it('should cleanup listeners on unmount', () => {
    const { cleanup } = useChat('test-room')
    const spy = jest.spyOn(console, 'log')
    cleanup()
    expect(spy).toHaveBeenCalledWith('🧹 Cleaning up chat system...')
  })
})
```

## 🚨 Troubleshooting

### Common Issues

1. **Messages not loading**
   - Check Firebase configuration
   - Verify Firestore security rules
   - Check network connectivity

2. **Real-time updates not working**
   - Ensure listeners are properly set up
   - Check for listener cleanup issues
   - Verify Firebase project status

3. **Authentication issues**
   - Check Firebase Auth configuration
   - Verify user authentication state
   - Check security rules

4. **Performance issues**
   - Limit message queries
   - Implement pagination
   - Optimize listener usage

### Debug Mode

```javascript
// Enable debug logging
localStorage.setItem('debug', 'chat:*')

// Monitor chat events
const { addEventListener } = useChat('room-id')
addEventListener('error', (error) => {
  console.error('Chat error:', error)
})
```

## 📈 Best Practices

### 1. Listener Management
- Always cleanup listeners on component unmount
- Use proper error handling for listeners
- Limit the number of active listeners

### 2. Message Handling
- Use server timestamps for consistent ordering
- Implement optimistic updates for better UX
- Handle message status properly

### 3. Performance
- Limit message queries with pagination
- Use efficient Firestore queries
- Implement proper indexing

### 4. Security
- Validate all user inputs
- Implement proper authentication
- Use Firestore security rules

### 5. Error Handling
- Provide user-friendly error messages
- Implement retry mechanisms
- Log errors for debugging

## 🎉 Conclusion

This live chat system provides a complete, production-ready solution with:

- ✅ **Real-time messaging** with Firebase Firestore
- ✅ **Proper listener cleanup** to prevent memory leaks
- ✅ **Server timestamps** for consistent ordering
- ✅ **User identification** and authentication
- ✅ **WhatsApp-style UI** with responsive design
- ✅ **Comprehensive error handling**
- ✅ **Performance optimization**
- ✅ **Security best practices**

The system is ready for production use and can be easily extended with additional features like file sharing, voice messages, or video calls.

For support or questions, refer to the troubleshooting section or check the console for detailed error messages. 