<template>
  <div
    class="min-h-screen"
    :style="{
      backgroundColor: 'var(--Color-Surface-Surface-Primary)',
      color: 'var(--Color-Text-Text-Primary)',
    }"
  >
    <!-- Simplified Header -->
    <div
      class="bg-[var(--Color-Surface-Surface-Primary)] border-b border-[var(--Color-Boarder-Border-Primary)] sticky top-0 z-10"
    >
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-[var(--Color-Surface-Surface-Brand)] rounded-lg">
              <i class="fas fa-comments text-[var(--Color-Text-Text-Invert)] text-xl"></i>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-[var(--Color-Text-Text-Primary)]">
                Messages
              </h1>
              <p class="text-sm text-[var(--Color-Text-Text-Secondary)]">
                {{ conversations.length }} conversation{{
                  conversations.length !== 1 ? "s" : ""
                }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <!-- Search Button -->
            <button
              @click="toggleSearch"
              class="p-2 text-[var(--Color-Text-Text-Secondary)] hover:text-[var(--Color-Text-Text-Brand)] hover:bg-[var(--color-primary-25)] dark:hover:bg-[var(--color-Gray-600)] rounded-lg transition-all duration-200"
              title="Search messages"
            >
              <i class="fas fa-search"></i>
            </button>
            <!-- Refresh Button -->
            <button
              @click="refreshConversations"
              :disabled="loading"
              class="p-2 text-[var(--Color-Text-Text-Secondary)] hover:text-[var(--Color-Text-Text-Brand)] hover:bg-[var(--color-primary-25)] dark:hover:bg-[var(--color-Gray-600)] rounded-lg transition-all duration-200"
              title="Refresh conversations"
            >
              <i class="fas fa-sync-alt" :class="{ 'animate-spin': loading }"></i>
            </button>
            <!-- Settings Button -->
            <button
              @click="showSettings = !showSettings"
              class="p-2 text-[var(--Color-Text-Text-Secondary)] hover:text-[var(--Color-Text-Text-Brand)] hover:bg-[var(--color-primary-25)] dark:hover:bg-[var(--color-Gray-600)] rounded-lg transition-all duration-200"
              title="Message settings"
            >
              <i class="fas fa-cog"></i>
            </button>
          </div>
        </div>

        <!-- Search Bar -->
        <div v-if="showSearch" class="mt-4">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search conversations and messages..."
              class="w-full px-4 py-3 pl-12 border border-[var(--Color-Boarder-Border-Primary)] rounded-xl focus:outline-none bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)] transition-all duration-200"
            />
            <i
              class="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--Color-Text-Text-Secondary)]"
            ></i>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-6">
      <!-- Simplified Authentication Check -->
      <div v-if="!auth.currentUser" class="text-center py-12">
        <div
          class="bg-[var(--Color-Surface-Surface-Primary)] rounded-2xl p-8 max-w-md mx-auto border border-[var(--Color-Boarder-Border-Primary)]"
        >
          <div
            class="p-4 bg-[var(--color-Gray-25)] rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center"
          >
            <i class="fas fa-lock text-3xl text-[var(--Color-Surface-Surface-Brand)]"></i>
          </div>
          <h2 class="text-2xl font-bold text-[var(--Color-Text-Text-Primary)] mb-3">
            Welcome to Messages
          </h2>
          <p class="text-[var(--Color-Text-Text-Secondary)] mb-8 leading-relaxed">
            Connect with product owners, ask questions, and manage your conversations in
            one place.
          </p>
          <div class="space-y-4">
            <button
              @click="router.push('/login')"
              class="w-full bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] py-4 px-6 rounded-xl font-semibold"
            >
              <i class="fas fa-sign-in-alt mr-2"></i>
              Login
            </button>
            <button
              @click="router.push('/signup')"
              class="w-full border-2 border-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Brand)] py-4 px-6 rounded-xl font-semibold"
            >
              <i class="fas fa-user-plus mr-2"></i>
              Sign Up
            </button>
          </div>
        </div>
      </div>

      <!-- Simplified Main Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6 main-content">
        <!-- Simplified Conversations List -->
        <div
          class="w-full bg-[var(--Color-Surface-Surface-Primary)] rounded-2xl overflow-hidden border border-[var(--Color-Boarder-Border-Primary)] conversations-list"
        >
          <div
            class="p-6 border-b border-[var(--Color-Boarder-Border-Primary)]"
          >
            <div class="flex items-center justify-between mb-2">
              <h2 class="text-xl font-bold text-[var(--Color-Text-Text-Primary)]">
                Conversations
              </h2>
              <div class="flex items-center gap-2">
                <span
                  class="px-3 py-1 bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] text-xs rounded-full font-semibold"
                >
                  {{ conversations.length }}
                </span>
              </div>
            </div>
            <p class="text-sm text-[var(--Color-Text-Text-Secondary)]">
              {{
                conversations.length === 0
                  ? "No conversations yet"
                  : `${conversations.length} conversation${
                      conversations.length !== 1 ? "s" : ""
                    }`
              }}
            </p>
          </div>

          <!-- Simplified Loading State -->
          <div v-if="loading" class="p-12 text-center">
            <div class="relative">
              <div
                class="animate-spin rounded-full h-12 w-12 border-4 border-[var(--color-Gray-25)] border-t-[var(--Color-Surface-Surface-Brand)] mx-auto mb-6"
              ></div>
            </div>
            <h3 class="text-lg font-semibold text-[var(--Color-Text-Text-Primary)] mb-2">
              Loading Conversations
            </h3>
            <p class="text-[var(--Color-Text-Text-Secondary)]">
              Fetching your messages...
            </p>
          </div>

          <!-- Simplified Empty State -->
          <div v-else-if="conversations.length === 0" class="p-12 text-center">
            <div
              class="p-6 bg-[var(--color-Gray-25)] rounded-2xl mb-6"
            >
              <i
                class="fas fa-comments text-5xl text-[var(--Color-Surface-Surface-Brand)] mb-4"
              ></i>
            </div>
            <h3 class="text-xl font-bold text-[var(--Color-Text-Text-Primary)] mb-3">
              No Conversations Yet
            </h3>
            <p class="text-[var(--Color-Text-Text-Secondary)] mb-6 leading-relaxed">
              Start chatting with product owners to ask questions, negotiate prices, or
              get more information about items you're interested in.
            </p>
            <button
              @click="router.push('/products')"
              class="inline-flex items-center gap-2 px-6 py-3 bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] rounded-xl font-semibold"
            >
              <i class="fas fa-search"></i>
              Browse Products
            </button>
          </div>

          <!-- Simplified Conversations List -->
          <div v-else class="overflow-y-auto conversations-list-content">
            <div
              v-for="conversation in conversations"
              :key="conversation.id"
              @click="selectConversation(conversation)"
              class="p-4 border-b border-[var(--Color-Boarder-Border-Primary)] cursor-pointer hover:bg-[var(--color-primary-25)] dark:hover:bg-[var(--color-Gray-600)] transition-all duration-200 group"
              :class="{
                'bg-[var(--color-Gray-25)] border-l-4 border-l-[var(--Color-Surface-Surface-Brand)]':
                  selectedConversation?.id === conversation.id,
              }"
            >
              <div class="flex items-center gap-4">
                <!-- Simplified Avatar -->
                <div class="relative">
                  <img
                    :src="conversation.otherUserImage || require('@/assets/default.png')"
                    :alt="conversation.otherUserName"
                    class="w-14 h-14 rounded-full object-cover ring-2 ring-[var(--Color-Surface-Surface-Primary)]"
                  />
                  <!-- Online Status Indicator -->
                  <div
                    class="absolute -bottom-1 -right-1 w-4 h-4 bg-[var(--Color-Surface-Surface-Brand)] rounded-full border-2 border-[var(--Color-Surface-Surface-Primary)]"
                  ></div>
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between mb-1">
                    <h3
                      class="font-bold text-[var(--Color-Text-Text-Primary)] truncate group-hover:text-[var(--Color-Text-Text-Brand)] transition-colors"
                    >
                      {{ conversation.otherUserName }}
                    </h3>
                    <div class="flex items-center gap-2">
                      <!-- Unread Badge -->
                      <span
                        v-if="conversation.unreadCount > 0"
                        class="bg-[var(--color-error-500)] text-[var(--Color-Text-Text-Invert)] text-xs rounded-full px-2 py-1 font-bold animate-pulse"
                      >
                        {{
                          conversation.unreadCount > 9 ? "9+" : conversation.unreadCount
                        }}
                      </span>
                      <!-- Time -->
                      <span class="text-xs text-[var(--Color-Text-Text-Secondary)]">
                        {{ formatTime(conversation.lastMessageTime) }}
                      </span>
                    </div>
                  </div>

                  <!-- Last Message -->
                  <p
                    class="text-sm text-[var(--Color-Text-Text-Secondary)] truncate mb-1"
                  >
                    {{ conversation.lastMessage }}
                  </p>

                  <!-- Product Info -->
                  <div v-if="conversation.productTitle" class="flex items-center gap-2">
                    <i class="fas fa-tag text-xs text-[var(--Color-Text-Text-Brand)]"></i>
                    <p
                      class="text-xs text-[var(--Color-Text-Text-Brand)] truncate font-medium"
                    >
                      {{ conversation.productTitle }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Simplified Chat Area -->
        <div
          class="lg:col-span-2 bg-[var(--Color-Surface-Surface-Primary)] rounded-2xl overflow-hidden border border-[var(--Color-Boarder-Border-Primary)] chat-area"
        >
          <!-- Simplified No Conversation Selected -->
          <div
            v-if="!selectedConversation"
            class="h-full flex items-center justify-center p-8"
          >
            <div class="text-center max-w-md">
              <div
                class="p-8 bg-[var(--color-Gray-25)] rounded-2xl mb-8 inline-block"
              >
                <i
                  class="fas fa-comments text-4xl text-[var(--Color-Surface-Surface-Brand)]"
                ></i>
              </div>
              <h3
                class="text-lg font-semibold text-[var(--Color-Text-Text-Primary)] mb-2"
              >
                Start the Conversation
              </h3>
              <p class="text-[var(--Color-Text-Text-Secondary)]">
                Send the first message to begin chatting!
              </p>
            </div>
          </div>

          <!-- Chat Interface -->
          <div v-else class="h-full flex flex-col">
            <!-- Simplified Chat Header -->
            <div
              class="p-6 border-b border-[var(--Color-Boarder-Border-Primary)] bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)]"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <!-- Simplified Avatar -->
                  <div class="relative">
                    <img
                      :src="
                        selectedConversation.otherUserImage ||
                        require('@/assets/default.png')
                      "
                      :alt="selectedConversation.otherUserName"
                      class="w-12 h-12 rounded-full object-cover ring-2 ring-[var(--Color-Text-Text-Invert)]/20"
                    />
                    <!-- Online Status -->
                    <div
                      class="absolute -bottom-1 -right-1 w-4 h-4 bg-[var(--color-success-400)] rounded-full border-2 border-[var(--Color-Text-Text-Invert)]"
                    ></div>
                  </div>
                  <div>
                    <h3 class="font-bold text-lg">
                      {{ selectedConversation.otherUserName }}
                    </h3>
                    <div
                      v-if="selectedConversation.productTitle"
                      class="flex items-center gap-2 mt-1"
                    >
                      <i class="fas fa-tag text-xs opacity-80"></i>
                      <p class="text-sm opacity-90 font-medium">
                        {{ selectedConversation.productTitle }}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <!-- Typing Indicator -->
                  <div v-if="isTyping" class="flex items-center gap-2 text-sm opacity-80">
                    <div class="flex gap-1">
                      <div class="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                      <div
                        class="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                        style="animation-delay: 0.1s"
                      ></div>
                      <div
                        class="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                        style="animation-delay: 0.2s"
                      ></div>
                    </div>
                    <span>typing...</span>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex items-center gap-2">
                    <!-- Mark as Read Indicator -->
                    <div
                      v-if="isMarkingAsRead"
                      class="flex items-center gap-2 text-sm opacity-80"
                    >
                      <div
                        class="animate-spin rounded-full h-4 w-4 border-2 border-[var(--Color-Text-Text-Invert)]/60 border-t-[var(--Color-Text-Text-Invert)]"
                      ></div>
                      <span>Marking as read...</span>
                    </div>

                    <button
                      @click="viewProduct"
                      v-if="selectedConversation.productId"
                      class="p-2 hover:bg-[var(--Color-Text-Text-Invert)]/20 rounded-lg transition-all duration-200"
                      title="View Product"
                    >
                      <i class="fas fa-external-link-alt"></i>
                    </button>
                    <button
                      @click="showChatSettings = !showChatSettings"
                      class="p-2 hover:bg-[var(--Color-Text-Text-Invert)]/20 rounded-lg transition-all duration-200"
                      title="Chat Settings"
                    >
                      <i class="fas fa-ellipsis-v"></i>
                    </button>
                    <button
                      @click="clearSelectedConversation"
                      class="p-2 hover:bg-[var(--Color-Text-Text-Invert)]/20 rounded-lg transition-all duration-200"
                      title="Close Chat"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Simplified Messages Area -->
            <div
              ref="messagesContainer"
              @scroll="markMessagesAsReadOnScroll"
              @click="markMessagesAsRead(selectedConversation.id)"
              class="flex-1 overflow-y-auto p-6 bg-[var(--Colors-Gray-25)] dark:bg-[var(--Color-Surface-Surface-Primary)] messages-container"
            >
              <!-- Simplified Loading Messages -->
              <div v-if="loadingMessages" class="flex justify-center items-center h-32">
                <div class="text-center">
                  <div
                    class="animate-spin rounded-full h-12 w-12 border-4 border-[var(--color-primary-25)] dark:border-[var(--color-Gray-600)] border-t-[var(--Color-Surface-Surface-Brand)] mx-auto mb-4"
                  ></div>
                  <p class="text-[var(--Color-Text-Text-Secondary)]">
                    Loading messages...
                  </p>
                </div>
              </div>

              <!-- Simplified No Messages -->
              <div v-else-if="currentMessages.length === 0" class="text-center p-12">
                <div
                  class="p-6 bg-[var(--color-Gray-25)] rounded-2xl mb-6 inline-block"
                >
                  <i
                    class="fas fa-comments text-4xl text-[var(--Color-Surface-Surface-Brand)]"
                  ></i>
                </div>
                <h3
                  class="text-lg font-semibold text-[var(--Color-Text-Text-Primary)] mb-2"
                >
                  Start the Conversation
                </h3>
                <p class="text-[var(--Color-Text-Text-Secondary)]">
                  Send the first message to begin chatting!
                </p>
              </div>

              <!-- Simplified Messages with Proper Margins -->
              <div v-else class="space-y-4">
                <div
                  v-for="message in currentMessages"
                  :key="message.id"
                  class="flex group"
                  :class="isOwnMessage(message) ? 'justify-end' : 'justify-start'"
                >
                  <div
                    class="message-bubble max-w-xs lg:max-w-md px-6 py-3 rounded-2xl relative transition-all duration-200"
                    :class="
                      isOwnMessage(message)
                        ? 'bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)]'
                        : 'bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)] border border-[var(--Color-Boarder-Border-Primary)]'
                    "
                    @mouseenter="
                      message.senderId !== auth.currentUser?.uid &&
                        !message.read &&
                        markMessagesAsRead(selectedConversation.id)
                    "
                  >
                    <!-- Message Header -->
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center gap-2">
                        <span class="text-xs font-medium opacity-80">{{
                          message.senderName
                        }}</span>
                        <span class="text-xs opacity-60">{{
                          formatTime(message.timestamp)
                        }}</span>
                      </div>

                      <!-- Message Status -->
                      <div class="flex items-center gap-1">
                        <!-- Read indicator for own messages -->
                        <span v-if="isOwnMessage(message)" class="text-xs">
                          <i
                            :class="
                              message.read
                                ? 'fas fa-check-double text-[var(--color-primary-300)]'
                                : 'fas fa-check text-[var(--color-gray-300)]'
                            "
                          ></i>
                        </span>
                        <!-- Unread indicator for other's messages -->
                        <span
                          v-else-if="!message.read"
                          class="w-2 h-2 bg-[var(--color-error-500)] rounded-full animate-pulse"
                        ></span>
                        <!-- Read indicator for other's messages -->
                        <span v-else class="text-xs opacity-60">
                          <i class="fas fa-check text-[var(--color-success-400)]"></i>
                        </span>
                      </div>
                    </div>

                    <!-- Message Content -->
                    <div class="relative">
                      <p class="text-sm leading-relaxed">{{ message.content }}</p>

                      <!-- Message Actions (on hover) -->
                      <div
                        class="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <div
                          class="flex items-center gap-1 bg-[var(--Color-Surface-Surface-Primary)] rounded-lg p-1"
                        >
                          <button
                            @click="reactToMessage(message.id, '👍')"
                            class="p-1 hover:bg-[var(--color-gray-100)] rounded transition-colors"
                            title="React"
                          >
                            <i class="fas fa-thumbs-up text-xs"></i>
                          </button>
                          <button
                            v-if="isOwnMessage(message)"
                            @click="editMessage(message)"
                            class="p-1 hover:bg-[var(--color-gray-100)] rounded transition-colors"
                            title="Edit"
                          >
                            <i class="fas fa-edit text-xs"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Simplified Message Input -->
            <div
              class="p-6 border-t border-[var(--Color-Boarder-Border-Primary)] bg-[var(--Color-Surface-Surface-Primary)]"
            >
              <form @submit.prevent="sendMessage" class="flex items-end gap-3">
                <!-- Attachment Button -->
                <button
                  type="button"
                  @click="showAttachmentMenu = !showAttachmentMenu"
                  class="p-3 text-[var(--Color-Text-Text-Secondary)] hover:text-[var(--Color-Text-Text-Brand)] hover:bg-[var(--color-primary-25)] dark:hover:bg-[var(--color-Gray-600)] rounded-xl transition-all duration-200"
                  title="Attach file"
                >
                  <i class="fas fa-paperclip text-lg"></i>
                </button>

                <!-- Message Input -->
                <div class="flex-1 relative">
                  <textarea
                    v-model="newMessage"
                    placeholder="Type your message..."
                    @keyup.enter.exact="sendMessage"
                    @keyup.enter.shift.exact="newMessage += '\n'"
                    @input="handleTyping"
                    rows="1"
                    class="w-full px-4 py-3 pr-12 border border-[var(--Color-Boarder-Border-Primary)] rounded-xl focus:outline-none bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)] resize-none transition-all duration-200"
                    style="min-height: 48px; max-height: 120px"
                  ></textarea>

                  <!-- Character Count -->
                  <div
                    class="absolute bottom-2 right-3 text-xs text-[var(--Color-Text-Text-Secondary)]"
                  >
                    {{ newMessage.length }}/500
                  </div>
                </div>

                <!-- Send Button -->
                <button
                  type="submit"
                  :disabled="!newMessage || !newMessage.trim() || newMessage.length > 500"
                  class="p-3 bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] rounded-xl disabled:bg-[var(--color-gray-400)] disabled:cursor-not-allowed transition-all duration-200"
                  title="Send message"
                >
                  <i class="fas fa-paper-plane"></i>
                </button>
              </form>

              <!-- Attachment Menu -->
              <div
                v-if="showAttachmentMenu"
                class="mt-3 p-3 bg-[var(--Color-Surface-Surface-Primary)] rounded-xl border border-[var(--Color-Boarder-Border-Primary)]"
              >
                <div class="grid grid-cols-3 gap-3">
                  <button
                    @click="attachFile('image')"
                    class="p-3 text-center hover:bg-[var(--color-primary-25)] dark:hover:bg-[var(--color-Gray-600)] rounded-lg transition-colors"
                  >
                    <i
                      class="fas fa-image text-2xl text-[var(--Color-Text-Text-Brand)] mb-2"
                    ></i>
                    <p class="text-xs">Image</p>
                  </button>
                  <button
                    @click="attachFile('document')"
                    class="p-3 text-center hover:bg-[var(--color-primary-25)] dark:hover:bg-[var(--color-Gray-600)] rounded-lg transition-colors"
                  >
                    <i
                      class="fas fa-file text-2xl text-[var(--Color-Text-Text-Brand)] mb-2"
                    ></i>
                    <p class="text-xs">Document</p>
                  </button>
                  <button
                    @click="attachFile('location')"
                    class="p-3 text-center hover:bg-[var(--color-primary-25)] dark:hover:bg-[var(--color-Gray-600)] rounded-lg transition-colors"
                  >
                    <i
                      class="fas fa-map-marker-alt text-2xl text-[var(--Color-Text-Text-Brand)] mb-2"
                    ></i>
                    <p class="text-xs">Location</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
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
  limit,
} from "firebase/firestore";
import { db, auth } from "@/firebase/config";
import Swal from "sweetalert2";

const { t } = useI18n();
const router = useRouter();

// Reactive state
const conversations = ref([]);
const selectedConversation = ref(null);
const currentMessages = ref([]);
const newMessage = ref("");
const loading = ref(false);
const loadingMessages = ref(false);
const messagesContainer = ref(null);

// Enhanced UI state
const showSearch = ref(false);
const searchQuery = ref("");
const showSettings = ref(false);
const showChatSettings = ref(false);
const showAttachmentMenu = ref(false);
const isTyping = ref(false);
const typingTimeout = ref(null);
const isMarkingAsRead = ref(false);

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
    const chatRoomsRef = collection(db, "user-chats");
    const chatRoomsQuery = query(
      chatRoomsRef,
      where("participants", "array-contains", auth.currentUser.uid)
    );

    conversationsUnsubscribe = onSnapshot(
      chatRoomsQuery,
      async (snapshot) => {
        const conversationsData = [];

        for (const doc of snapshot.docs) {
          const chatRoomData = doc.data();

          // Get the other user's ID
          const otherUserId = chatRoomData.participants.find(
            (id) => id !== auth.currentUser.uid
          );

          if (otherUserId) {
            // Get the other user's information
            const userDoc = await getDocs(
              query(collection(db, "users"), where("uid", "==", otherUserId))
            );
            const otherUserData = userDoc.docs[0]?.data() || {};

            // Get the last message
            const messagesRef = collection(db, "user-chats", doc.id, "messages");
            const messagesQuery = query(
              messagesRef,
              orderBy("timestamp", "desc"),
              limit(1)
            );
            const lastMessageSnapshot = await getDocs(messagesQuery);
            const lastMessage = lastMessageSnapshot.docs[0]?.data();

            // Count unread messages
            const unreadQuery = query(
              messagesRef,
              where("senderId", "==", otherUserId),
              where("read", "==", false)
            );
            const unreadSnapshot = await getDocs(unreadQuery);
            const unreadCount = unreadSnapshot.size;

            conversationsData.push({
              id: doc.id,
              otherUserId,
              otherUserName:
                otherUserData.displayName || otherUserData.email || "Unknown User",
              otherUserImage: otherUserData.imageUrl || otherUserData.photoURL,
              lastMessage: lastMessage?.content || "No messages yet",
              lastMessageTime: lastMessage?.timestamp?.toDate() || new Date(),
              unreadCount,
              productId: chatRoomData.productId,
              productTitle: chatRoomData.productTitle,
            });
          }
        }

        // Sort by last message time (most recent first)
        conversationsData.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
        conversations.value = conversationsData;
        loading.value = false;
      },
      (error) => {
        console.error("Error loading conversations:", error);
        loading.value = false;
      }
    );
  } catch (error) {
    console.error("Error loading conversations:", error);
    loading.value = false;
  }
};

const selectConversation = async (conversation) => {
  selectedConversation.value = conversation;
  await loadMessages(conversation.id);

  // Mark messages as read immediately when entering chat
  await markMessagesAsRead(conversation.id);

  // Update conversation unread count in the list
  const conversationIndex = conversations.value.findIndex(
    (c) => c.id === conversation.id
  );
  if (conversationIndex !== -1) {
    conversations.value[conversationIndex].unreadCount = 0;
  }
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

    const messagesRef = collection(db, "user-chats", chatRoomId, "messages");
    const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));

    messagesUnsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        const messages = [];
        let hasNewMessages = false;

        snapshot.forEach((doc) => {
          const messageData = {
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || new Date(),
          };

          // Check if this is a new message from another user
          if (messageData.senderId !== auth.currentUser?.uid && !messageData.read) {
            hasNewMessages = true;
          }

          messages.push(messageData);
        });

        currentMessages.value = messages;
        loadingMessages.value = false;

        // Scroll to bottom after messages load
        nextTick(() => {
          scrollToBottom();

          // Mark messages as read if user is actively viewing the chat
          if (hasNewMessages && document.hasFocus()) {
            markMessagesAsRead(chatRoomId);
          }
        });
      },
      (error) => {
        console.error("Error loading messages:", error);
        loadingMessages.value = false;
      }
    );
  } catch (error) {
    console.error("Error loading messages:", error);
    loadingMessages.value = false;
  }
};

const sendMessage = async () => {
  if (!newMessage.value || !newMessage.value.trim() || !selectedConversation.value)
    return;

  try {
    const messagesRef = collection(
      db,
      "user-chats",
      selectedConversation.value.id,
      "messages"
    );

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
      read: false,
    };

    await addDoc(messagesRef, messageData);
    newMessage.value = "";

    // Scroll to bottom after sending
    await nextTick();
    scrollToBottom();
  } catch (error) {
    console.error("Error sending message:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to send message. Please try again.",
      confirmButtonText: "OK",
    });
  }
};

const markMessagesAsRead = async (chatRoomId) => {
  if (!auth.currentUser || !chatRoomId) return;

  try {
    isMarkingAsRead.value = true;

    const messagesRef = collection(db, "user-chats", chatRoomId, "messages");

    // Get unread messages from other user
    const unreadMessages = currentMessages.value.filter(
      (message) => message.senderId !== auth.currentUser.uid && !message.read
    );

    if (unreadMessages.length === 0) {
      isMarkingAsRead.value = false;
      return;
    }

    console.log(`📖 Marking ${unreadMessages.length} messages as read`);

    // Mark them as read with enhanced status
    const updatePromises = unreadMessages.map((message) => {
      const messageRef = doc(db, "user-chats", chatRoomId, "messages", message.id);
      return updateDoc(messageRef, {
        read: true,
        readAt: serverTimestamp(),
        readBy: [auth.currentUser.uid],
      });
    });

    await Promise.all(updatePromises);

    // Update local message state to reflect read status
    unreadMessages.forEach((message) => {
      message.read = true;
      message.readAt = new Date();
      message.readBy = [auth.currentUser.uid];
    });

    console.log("✅ Messages marked as read successfully");

    // Show success notification if messages were marked as read
    if (unreadMessages.length > 0) {
      Swal.fire({
        icon: "success",
        title: "Messages Read",
        text: `${unreadMessages.length} message${
          unreadMessages.length > 1 ? "s" : ""
        } marked as read`,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  } catch (error) {
    console.error("❌ Error marking messages as read:", error);
  } finally {
    isMarkingAsRead.value = false;
  }
};

const isOwnMessage = (message) => {
  return message.senderId === auth.currentUser?.uid;
};

const formatTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: "short" });
  } else {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  }
};

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

// Mark messages as read when they come into view
const markMessagesAsReadOnScroll = () => {
  if (!selectedConversation.value || !auth.currentUser) return;

  const container = messagesContainer.value;
  if (!container) return;

  const containerRect = container.getBoundingClientRect();
  const containerBottom = containerRect.bottom;

  // Check which messages are visible
  const messageElements = container.querySelectorAll(".message-bubble");
  const visibleMessages = [];

  messageElements.forEach((element, index) => {
    const elementRect = element.getBoundingClientRect();
    const elementBottom = elementRect.bottom;

    // If message is visible in the container
    if (elementBottom <= containerBottom && elementBottom >= containerRect.top) {
      const message = currentMessages.value[index];
      if (message && message.senderId !== auth.currentUser.uid && !message.read) {
        visibleMessages.push(message);
      }
    }
  });

  // Mark visible unread messages as read
  if (visibleMessages.length > 0) {
    markMessagesAsRead(selectedConversation.value.id);
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

// Enhanced UI methods
const toggleSearch = () => {
  showSearch.value = !showSearch.value;
  if (!showSearch.value) {
    searchQuery.value = "";
  }
};

const handleTyping = () => {
  if (!selectedConversation.value) return;

  // Clear existing timeout
  if (typingTimeout.value) {
    clearTimeout(typingTimeout.value);
  }

  // Set typing indicator
  isTyping.value = true;

  // Mark messages as read when user starts typing (indicating they're engaged)
  if (auth.currentUser) {
    markMessagesAsRead(selectedConversation.value.id);
  }

  // Clear typing indicator after 3 seconds
  typingTimeout.value = setTimeout(() => {
    isTyping.value = false;
  }, 3000);
};

const reactToMessage = (messageId, reaction) => {
  // TODO: Implement message reactions
  console.log("React to message:", messageId, reaction);
};

const editMessage = (message) => {
  // TODO: Implement message editing
  console.log("Edit message:", message);
};

const attachFile = (type) => {
  showAttachmentMenu.value = false;

  switch (type) {
    case "image":
      // TODO: Implement image attachment
      console.log("Attach image");
      break;
    case "document":
      // TODO: Implement document attachment
      console.log("Attach document");
      break;
    case "location":
      // TODO: Implement location sharing
      console.log("Share location");
      break;
  }
};

// Watch for authentication changes
watch(
  () => auth.currentUser,
  (user) => {
    if (user) {
      loadConversations();
    } else {
      conversations.value = [];
      selectedConversation.value = null;
      currentMessages.value = [];
    }
  }
);

// Watch for selected conversation changes to mark messages as read
watch(
  () => selectedConversation.value,
  async (newConversation) => {
    if (newConversation && auth.currentUser) {
      // Mark messages as read when conversation is selected
      await markMessagesAsRead(newConversation.id);
    }
  }
);

// Watch for conversations to load and auto-select stored conversation
watch(
  () => conversations.value,
  (newConversations) => {
    if (newConversations.length > 0) {
      const storedConversation = localStorage.getItem("selectedConversation");
      if (storedConversation) {
        try {
          const conversationInfo = JSON.parse(storedConversation);
          const now = Date.now();
          const timeDiff = now - conversationInfo.timestamp;

          // Only auto-select if the conversation was created within the last 5 seconds
          if (timeDiff < 5000) {
            const targetConversation = newConversations.find(
              (conv) => conv.id === conversationInfo.id
            );
            if (targetConversation && !selectedConversation.value) {
              selectConversation(targetConversation);
              console.log("Auto-selected conversation from watch:", targetConversation);
              localStorage.removeItem("selectedConversation");
            }
          } else {
            localStorage.removeItem("selectedConversation");
          }
        } catch (error) {
          console.error("Error parsing stored conversation in watch:", error);
          localStorage.removeItem("selectedConversation");
        }
      }
    }
  }
);

// Lifecycle
onMounted(() => {
  if (auth.currentUser) {
    loadConversations();
  }

  // Check for stored conversation selection
  const storedConversation = localStorage.getItem("selectedConversation");
  if (storedConversation) {
    try {
      const conversationInfo = JSON.parse(storedConversation);
      const now = Date.now();
      const timeDiff = now - conversationInfo.timestamp;

      // Only auto-select if the conversation was created within the last 5 seconds
      if (timeDiff < 5000) {
        // Wait for conversations to load, then select the stored conversation
        const checkAndSelectConversation = () => {
          if (conversations.value.length > 0) {
            const targetConversation = conversations.value.find(
              (conv) => conv.id === conversationInfo.id
            );
            if (targetConversation) {
              selectConversation(targetConversation);
              console.log("Auto-selected conversation:", targetConversation);
            }
            // Clear the stored conversation
            localStorage.removeItem("selectedConversation");
          } else {
            // If conversations haven't loaded yet, try again in 500ms
            setTimeout(checkAndSelectConversation, 500);
          }
        };

        // Start checking after a short delay to allow conversations to load
        setTimeout(checkAndSelectConversation, 1000);
      } else {
        // Clear old stored conversation
        localStorage.removeItem("selectedConversation");
      }
    } catch (error) {
      console.error("Error parsing stored conversation:", error);
      localStorage.removeItem("selectedConversation");
    }
  }

  // Mark messages as read when window gains focus
  const handleWindowFocus = () => {
    if (selectedConversation.value && auth.currentUser) {
      markMessagesAsRead(selectedConversation.value.id);
    }
  };

  window.addEventListener("focus", handleWindowFocus);

  // Cleanup event listener
  onUnmounted(() => {
    window.removeEventListener("focus", handleWindowFocus);
  });
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
/* Scrollbar styles for messages container */
.messages-container::-webkit-scrollbar {
  width: 8px;
}

.messages-container::-webkit-scrollbar-track {
  background: transparent;
}

.messages-container::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  transition: background 0.2s ease;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

.dark .messages-container::-webkit-scrollbar-thumb {
  background:  'var(--Color-Surface-Surface-Primary)';
}

.dark .messages-container::-webkit-scrollbar-thumb:hover {
  background:'var(--Color-Surface-Surface-Primary)';
}

/* Scrollbar styles for conversations list */
.conversations-list::-webkit-scrollbar {
  width: 6px;
}

.conversations-list::-webkit-scrollbar-track {
  background: transparent;
}

.conversations-list::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  transition: background 0.2s ease;
}

.conversations-list::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
}

.dark .conversations-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
}

.dark .conversations-list::-webkit-scrollbar-thumb:hover {
  background: 'var(--Color-Surface-Surface-Primary)';
}

/* Desktop-specific styles */
.main-content {
  height: calc(100vh - 120px); /* Account for header (~80px) and padding (~40px) */
  display: grid;
  gap: 24px; /* Match the gap-6 (1.5rem = 24px) */
}

.conversations-list {
  max-height: calc(100vh - 120px); /* Full viewport height minus header and padding */
  overflow-y: auto; /* Enable scrolling for overflow */
}

.conversations-list-content {
  max-height: calc(100vh - 200px); /* Adjust for conversation header (~80px) */
  overflow-y: auto;
}

.chat-area {
  max-height: calc(100vh - 120px); /* Full viewport height minus header and padding */
  overflow-y: auto; /* Enable scrolling for overflow */
}

.chat-area .h-full {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.messages-container {
  max-height: calc(
    100vh - 260px
  ); /* Adjust for chat header (~80px), input (~60px), and padding */
  overflow-y: auto; /* Ensure scrolling */
}

/* Animations */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.message-enter-active {
  animation: slideIn 0.3s ease-out;
}

.message-leave-active {
  animation: fadeIn 0.2s ease-in reverse;
}

.typing-dots {
  animation: typing 1.4s infinite;
}

@keyframes typing {
  0%,
  20% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-4px);
  }
  60% {
    transform: translateY(0);
  }
  80%,
  100% {
    transform: translateY(0);
  }
}

.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.gradient-text {
  background: linear-gradient(135deg, var(--color-success-500), var(--color-success-600));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Enhanced responsiveness for mobile view */
@media (max-width: 1024px) {
  .main-content {
    display: flex;
    flex-direction: column;
    height: calc(140vh - 120px); /* Account for header (~80px) and padding (~40px) */
    min-height: 0; /* Prevent overflow */
  }

  .lg\:grid-cols-3 {
    grid-template-columns: 1fr;
  }

  .lg\:col-span-2 {
    grid-column: 1;
  }

  /* Conversations list styling */
  .conversations-list {
    max-height: 35vh; /* 35% of viewport height for conversations */
    overflow-y: auto; /* Enable scrolling */
    flex-shrink: 0; /* Prevent shrinking */
  }

  .conversations-list-content {
    max-height: calc(100vh - 80px); /* Adjust for conversation header (~80px) */
    overflow-y: auto;
  }

  /* Chat area styling */
  .chat-area {
    max-height: calc(100vh - 120px); /* Remaining height minus header and padding */
    overflow-y: auto; /* Enable scrolling */
    flex-grow: 1; /* Fill remaining space */
  }

  /* Ensure chat interface takes full height */
  .chat-area .h-full {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  /* Messages container within chat area */
  .messages-container {
    max-height: calc(
      100vh - 200px
    ); /* Adjust for chat header (~80px) and input (~60px) */
    overflow-y: auto; /* Ensure scrolling */
  }
}

/* Focus styles for accessibility */
button:focus,
input:focus,
textarea:focus {
  outline: 2px solid var(--color-success-500);
  outline-offset: 2px;
}

/* Loading skeleton animation */
@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
}

.dark .skeleton {
  background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
  background-size: 200px 100%;
}
</style>
