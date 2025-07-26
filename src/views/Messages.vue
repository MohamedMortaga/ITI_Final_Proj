<template>
  <div class="min-h-screen bg-[var(--color-gray-25)] dark:bg-[var(--color-gray-800)]">
    <!-- Header -->
    <div class="bg-white dark:bg-[var(--color-gray-700)] shadow-sm border-b border-gray-200 dark:border-gray-600">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]">
            Messages
          </h1>
          <div class="flex items-center gap-4">
            <button
              @click="refreshConversations"
              :disabled="loading"
              class="p-2 text-[var(--color-gray-600)] hover:text-[var(--color-success-500)] transition-colors"
              title="Refresh conversations"
            >
              <i class="fas fa-sync-alt" :class="{ 'animate-spin': loading }"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-6">
      <!-- Authentication Check -->
      <div v-if="!auth.currentUser" class="text-center py-12">
        <div class="bg-white dark:bg-[var(--color-gray-700)] rounded-xl shadow-lg p-8 max-w-md mx-auto">
          <i class="fas fa-lock text-4xl text-[var(--color-gray-400)] mb-4"></i>
          <h2 class="text-xl font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)] mb-2">
            Login Required
          </h2>
          <p class="text-[var(--color-gray-600)] dark:text-[var(--color-gray-400)] mb-6">
            Please log in to view your messages and conversations.
          </p>
          <div class="space-y-3">
            <button
              @click="router.push('/login')"
              class="w-full bg-[var(--color-success-500)] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[var(--color-success-600)] transition-colors"
            >
              Login
            </button>
            <button
              @click="router.push('/signup')"
              class="w-full border border-[var(--color-success-500)] text-[var(--color-success-500)] py-3 px-6 rounded-lg font-semibold hover:bg-[var(--color-success-50)] transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        <!-- Conversations List -->
        <div class="bg-white dark:bg-[var(--color-gray-700)] rounded-xl shadow-lg overflow-hidden">
          <div class="p-4 border-b border-gray-200 dark:border-gray-600">
            <h2 class="text-lg font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]">
              Conversations
            </h2>
            <p class="text-sm text-[var(--color-gray-600)] dark:text-[var(--color-gray-400)]">
              {{ conversations.length }} conversation{{ conversations.length !== 1 ? 's' : '' }}
            </p>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="p-8 text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-success-500)] mx-auto mb-4"></div>
            <p class="text-[var(--color-gray-600)] dark:text-[var(--color-gray-400)]">Loading conversations...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="conversations.length === 0" class="p-8 text-center">
            <i class="fas fa-comments text-4xl text-[var(--color-gray-400)] mb-4"></i>
            <p class="text-[var(--color-gray-600)] dark:text-[var(--color-gray-400)]">
              No conversations yet. Start chatting with product owners!
            </p>
          </div>

          <!-- Conversations List -->
          <div v-else class="overflow-y-auto h-[calc(100vh-300px)]">
            <div
              v-for="conversation in conversations"
              :key="conversation.id"
              @click="selectConversation(conversation)"
              class="p-4 border-b border-gray-100 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-[var(--color-gray-600)] transition-colors"
              :class="{ 'bg-[var(--color-success-50)] dark:bg-[var(--color-success-900)]': selectedConversation?.id === conversation.id }"
            >
              <div class="flex items-center gap-3">
                <img
                  :src="conversation.otherUserImage || require('@/assets/default.png')"
                  :alt="conversation.otherUserName"
                  class="w-12 h-12 rounded-full object-cover"
                />
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <h3 class="font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)] truncate">
                      {{ conversation.otherUserName }}
                    </h3>
                    <span v-if="conversation.unreadCount > 0" class="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {{ conversation.unreadCount > 9 ? '9+' : conversation.unreadCount }}
                    </span>
                  </div>
                  <p class="text-sm text-[var(--color-gray-600)] dark:text-[var(--color-gray-400)] truncate">
                    {{ conversation.lastMessage }}
                  </p>
                  <p class="text-xs text-[var(--color-gray-500)] dark:text-[var(--color-gray-500)]">
                    {{ formatTime(conversation.lastMessageTime) }}
                  </p>
                  <p v-if="conversation.productTitle" class="text-xs text-[var(--color-success-500)] truncate">
                    {{ conversation.productTitle }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Area -->
        <div class="lg:col-span-2 bg-white dark:bg-[var(--color-gray-700)] rounded-xl shadow-lg overflow-hidden">
          <!-- No Conversation Selected -->
          <div v-if="!selectedConversation" class="h-full flex items-center justify-center">
            <div class="text-center">
              <i class="fas fa-comments text-6xl text-[var(--color-gray-400)] mb-4"></i>
              <h3 class="text-xl font-semibold text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)] mb-2">
                Select a Conversation
              </h3>
              <p class="text-[var(--color-gray-600)] dark:text-[var(--color-gray-400)]">
                Choose a conversation from the list to start messaging
              </p>
            </div>
          </div>

          <!-- Chat Interface -->
          <div v-else class="h-full flex flex-col">
            <!-- Chat Header -->
            <div class="p-4 border-b border-gray-200 dark:border-gray-600 bg-[var(--color-success-500)] text-white">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <img
                    :src="selectedConversation.otherUserImage || require('@/assets/default.png')"
                    :alt="selectedConversation.otherUserName"
                    class="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 class="font-semibold">{{ selectedConversation.otherUserName }}</h3>
                    <p v-if="selectedConversation.productTitle" class="text-sm opacity-90">
                      {{ selectedConversation.productTitle }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    @click="viewProduct"
                    v-if="selectedConversation.productId"
                    class="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="View Product"
                  >
                    <i class="fas fa-external-link-alt"></i>
                  </button>
                  <button
                    @click="clearSelectedConversation"
                    class="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Close Chat"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Messages Area -->
            <div
              ref="messagesContainer"
              class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-[var(--color-gray-600)]"
            >
              <!-- Loading Messages -->
              <div v-if="loadingMessages" class="flex justify-center items-center h-32">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-success-500)]"></div>
              </div>

              <!-- No Messages -->
              <div v-else-if="currentMessages.length === 0" class="text-center text-gray-500 p-8">
                <i class="fas fa-comments text-4xl mb-4 opacity-50"></i>
                <p>No messages yet. Start the conversation!</p>
              </div>

              <!-- Messages -->
              <div v-else>
                <div
                  v-for="message in currentMessages"
                  :key="message.id"
                  class="flex"
                  :class="isOwnMessage(message) ? 'justify-end' : 'justify-start'"
                >
                  <div
                    class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg relative"
                    :class="
                      isOwnMessage(message)
                        ? 'bg-[var(--color-success-500)] text-white'
                        : 'bg-white dark:bg-[var(--color-gray-700)] text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]'
                    "
                  >
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-xs opacity-75">{{ message.senderName }}</span>
                      <span class="text-xs opacity-75">{{ formatTime(message.timestamp) }}</span>
                      <!-- Read indicator for own messages -->
                      <span v-if="isOwnMessage(message)" class="text-xs opacity-75">
                        <i :class="message.read ? 'fas fa-check-double text-blue-300' : 'fas fa-check text-gray-300'"></i>
                      </span>
                      <!-- Unread indicator for other's messages -->
                      <span v-else-if="!message.read" class="w-2 h-2 bg-red-500 rounded-full"></span>
                    </div>
                    <p class="text-sm">{{ message.content }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Message Input -->
            <div class="p-4 border-t border-gray-200 dark:border-gray-600 bg-white dark:bg-[var(--color-gray-700)]">
              <form @submit.prevent="sendMessage" class="flex gap-2">
                <input
                  v-model="newMessage"
                  type="text"
                  placeholder="Type your message..."
                  @keyup.enter="sendMessage"
                  class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-success-500)] bg-white dark:bg-[var(--color-gray-700)] text-[var(--color-gray-800)] dark:text-[var(--color-gray-200)]"
                />
                <button
                  type="submit"
                  :disabled="!newMessage.value || !newMessage.value.trim()"
                  class="px-6 py-2 bg-[var(--color-success-500)] text-white rounded-lg hover:bg-[var(--color-success-600)] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <i class="fas fa-paper-plane"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  getDocs,
  limit
} from 'firebase/firestore';
import { db, auth } from '@/firebase/config';
import Swal from 'sweetalert2';

const { t } = useI18n();
const router = useRouter();

// Reactive state
const conversations = ref([]);
const selectedConversation = ref(null);
const currentMessages = ref([]);
const newMessage = ref('');
const loading = ref(false);
const loadingMessages = ref(false);
const messagesContainer = ref(null);

// Firebase listeners
let conversationsUnsubscribe = null;
let messagesUnsubscribe = null;

// Computed properties
const isAuthenticated = computed(() => !!auth.currentUser);

// Methods
const loadConversations = async () => {
  if (!auth.currentUser) return;

  try {
    loading.value = true;

    // Get all chat rooms where the current user is involved
    const chatRoomsRef = collection(db, 'user-chats');
    const chatRoomsQuery = query(
      chatRoomsRef,
      where('participants', 'array-contains', auth.currentUser.uid)
    );

    conversationsUnsubscribe = onSnapshot(chatRoomsQuery, async (snapshot) => {
      const conversationsData = [];

      for (const doc of snapshot.docs) {
        const chatRoomData = doc.data();
        
        // Get the other user's ID
        const otherUserId = chatRoomData.participants.find(id => id !== auth.currentUser.uid);
        
        if (otherUserId) {
          // Get the other user's information
          const userDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', otherUserId)));
          const otherUserData = userDoc.docs[0]?.data() || {};

          // Get the last message
          const messagesRef = collection(db, 'user-chats', doc.id, 'messages');
          const messagesQuery = query(messagesRef, orderBy('timestamp', 'desc'), limit(1));
          const lastMessageSnapshot = await getDocs(messagesQuery);
          const lastMessage = lastMessageSnapshot.docs[0]?.data();

          // Count unread messages
          const unreadQuery = query(
            messagesRef,
            where('senderId', '==', otherUserId),
            where('read', '==', false)
          );
          const unreadSnapshot = await getDocs(unreadQuery);
          const unreadCount = unreadSnapshot.size;

          conversationsData.push({
            id: doc.id,
            otherUserId,
            otherUserName: otherUserData.displayName || otherUserData.email || 'Unknown User',
            otherUserImage: otherUserData.imageUrl || otherUserData.photoURL,
            lastMessage: lastMessage?.content || 'No messages yet',
            lastMessageTime: lastMessage?.timestamp?.toDate() || new Date(),
            unreadCount,
            productId: chatRoomData.productId,
            productTitle: chatRoomData.productTitle
          });
        }
      }

      // Sort by last message time (most recent first)
      conversationsData.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
      conversations.value = conversationsData;
      loading.value = false;
    }, (error) => {
      console.error('Error loading conversations:', error);
      loading.value = false;
    });

  } catch (error) {
    console.error('Error loading conversations:', error);
    loading.value = false;
  }
};

const selectConversation = async (conversation) => {
  selectedConversation.value = conversation;
  await loadMessages(conversation.id);
  markMessagesAsRead(conversation.id);
};

const loadMessages = async (chatRoomId) => {
  if (!chatRoomId) return;

  try {
    loadingMessages.value = true;
    currentMessages.value = [];

    // Unsubscribe from previous messages listener
    if (messagesUnsubscribe) {
      messagesUnsubscribe();
    }

    const messagesRef = collection(db, 'user-chats', chatRoomId, 'messages');
    const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));

    messagesUnsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messages = [];
      snapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || new Date()
        });
      });
      currentMessages.value = messages;
      loadingMessages.value = false;
      
      // Scroll to bottom after messages load
      nextTick(() => {
        scrollToBottom();
      });
    }, (error) => {
      console.error('Error loading messages:', error);
      loadingMessages.value = false;
    });

  } catch (error) {
    console.error('Error loading messages:', error);
    loadingMessages.value = false;
  }
};

const sendMessage = async () => {
  if (!newMessage.value || !newMessage.value.trim() || !selectedConversation.value) return;

  try {
    const messagesRef = collection(db, 'user-chats', selectedConversation.value.id, 'messages');
    
    const messageData = {
      content: newMessage.value.trim(),
      senderId: auth.currentUser.uid,
      senderName: auth.currentUser.displayName || auth.currentUser.email,
      senderImage: auth.currentUser.photoURL || null,
      receiverId: selectedConversation.value.otherUserId,
      receiverName: selectedConversation.value.otherUserName,
      productId: selectedConversation.value.productId,
      productTitle: selectedConversation.value.productTitle,
      timestamp: serverTimestamp(),
      read: false
    };

    await addDoc(messagesRef, messageData);
    newMessage.value = '';

    // Scroll to bottom after sending
    await nextTick();
    scrollToBottom();
  } catch (error) {
    console.error('Error sending message:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to send message. Please try again.',
      confirmButtonText: 'OK'
    });
  }
};

const markMessagesAsRead = async (chatRoomId) => {
  if (!auth.currentUser || !chatRoomId) return;

  try {
    const messagesRef = collection(db, 'user-chats', chatRoomId, 'messages');
    
    // Get unread messages from other user
    const unreadMessages = currentMessages.value.filter(
      message => message.senderId !== auth.currentUser.uid && !message.read
    );

    // Mark them as read
    const updatePromises = unreadMessages.map(message => {
      const messageRef = doc(db, 'user-chats', chatRoomId, 'messages', message.id);
      return updateDoc(messageRef, { read: true });
    });

    await Promise.all(updatePromises);
  } catch (error) {
    console.error('Error marking messages as read:', error);
  }
};

const isOwnMessage = (message) => {
  return message.senderId === auth.currentUser?.uid;
};

const formatTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: 'short' });
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
};

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const clearSelectedConversation = () => {
  selectedConversation.value = null;
  currentMessages.value = [];
  if (messagesUnsubscribe) {
    messagesUnsubscribe();
    messagesUnsubscribe = null;
  }
};

const viewProduct = () => {
  if (selectedConversation.value?.productId) {
    router.push(`/product/${selectedConversation.value.productId}`);
  }
};

const refreshConversations = () => {
  if (conversationsUnsubscribe) {
    conversationsUnsubscribe();
  }
  loadConversations();
};

// Watch for authentication changes
watch(() => auth.currentUser, (user) => {
  if (user) {
    loadConversations();
  } else {
    conversations.value = [];
    selectedConversation.value = null;
    currentMessages.value = [];
  }
});

// Lifecycle
onMounted(() => {
  if (auth.currentUser) {
    loadConversations();
  }
});

onUnmounted(() => {
  if (conversationsUnsubscribe) {
    conversationsUnsubscribe();
  }
  if (messagesUnsubscribe) {
    messagesUnsubscribe();
  }
});
</script>

<style scoped>
/* Custom scrollbar for messages */
.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: transparent;
}

.messages-container::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* Dark mode scrollbar */
.dark .messages-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
}

.dark .messages-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style> 