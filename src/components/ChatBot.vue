<template>
  <div class="chatbot-container">
    <header class="header">
      <h1>AI Chat Bot</h1>
      <button class="close-btn" @click="$emit('close')" aria-label="Close chat">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </header>
    <div class="chat-app-container">
      <aside class="chat-sidebar">
        <div class="sidebar-header">
          <span>Chats</span>
          <button id="new-chat" @click="createNewChat">+ New Chat</button>
        </div>
        <ul id="chat-list">
          <li
            v-for="chat in chats"
            :key="chat.id"
            :class="{ active: chat.id === currentChatId }"
            @click="switchChat(chat.id)"
          >
            {{ chat.title }}
            <button @click.stop="closeChat(chat.id)" class="close-chat-btn">×</button>
          </li>
        </ul>
      </aside>
      <main class="chat-main">
        <div id="chat-history" class="chat-history" ref="chatHistory">
          <div
            v-for="msg in currentChatMessages"
            :key="msg.timestamp"
            class="chat-message"
            :class="msg.role"
            :style="{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              display: 'flex',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              alignItems: 'flex-end',
              gap: '8px',
            }"
          >
            <div
              class="avatar"
              :style="{
                background: msg.role === 'user' ? '#d5f5e3' : '#f7ca18',
              }"
            >
              {{ msg.role === "user" ? "🧑" : "🤖" }}
            </div>
            <div
              class="bubble"
              :style="{
                maxWidth: '400px',
                wordBreak: 'break-word',
                padding: '12px 16px',
                borderRadius:
                  msg.role === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                background: msg.role === 'user' ? '#d5f5e3' : '#f7ca18',
                color: msg.role === 'user' ? '#145a32' : '#222',
              }"
            >
              <img
                v-if="msg.type === 'image'"
                :src="msg.content"
                alt="User or Generated Image"
                style="
                  max-width: 220px;
                  max-height: 220px;
                  border-radius: 8px;
                  border: 1px solid #b2babb;
                "
              />
              <span v-else>{{ msg.content }}</span>
            </div>
            <div
              class="time"
              :style="{
                fontSize: '0.75rem',
                color: '#888',
                margin: msg.role === 'user' ? '0 8px 0 0' : '0 0 0 8px',
              }"
            >
              {{ formatTimestamp(msg.timestamp) }}
            </div>
          </div>
        </div>
        <form id="chat-input-form" class="chat-form" @submit.prevent="sendMessage">
          <div class="input-container">
            <input
              v-model="chatInput"
              type="text"
              id="chat-input"
              placeholder="Type your message..."
              autocomplete="off"
              required
              @keyup.enter="sendMessage"
            />
            <div v-if="stagedImage" class="image-preview">
              <img :src="stagedImage" alt="Staged Image" class="preview-image" />
              <button @click="deleteStagedImage" class="delete-button">×</button>
              <p class="preview-text">Image added. Send with message or solo.</p>
            </div>
          </div>
          <div class="button-container">
            <input
              type="file"
              id="image-upload"
              ref="imageUpload"
              accept="image/*"
              @change="handleImageUpload"
              style="display: none"
            />
            <button type="submit">Send</button>
            <button type="button" @click="$refs.imageUpload.click()">Upload Image</button>
            <button type="button" @click="captureImage" v-if="isCameraSupported">
              Camera
            </button>
            <button type="button" @click="clearChat">Clear Chat</button>
            <button type="button" id="generate-image" @click="handleGenerateImage">
              Generate Image
            </button>
          </div>
        </form>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, onUnmounted, watch } from "vue";
import { useRoute } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/firebase/config"; // Adjust the import path as needed

const emit = defineEmits(["close", "user-action"]);

const API_KEY = "fw_3ZeTAgD3p68MjXVtTt9zPWVd";
const API_URL = "https://api.fireworks.ai/inference/v1/chat/completions";
const MODEL_NAME = "accounts/fireworks/models/llama-v3p1-8b-instruct";
const IMAGE_API_URL =
  "https://api.fireworks.ai/inference/v1/workflows/accounts/fireworks/models/flux-1-schnell-fp8/text_to_image";

const chats = ref([]);
const currentChatId = ref(null);
const chatInput = ref("");
const chatHistory = ref(null);
const imageUpload = ref(null);
const stagedImage = ref(null);
const isCameraSupported = ref(
  navigator.mediaDevices && navigator.mediaDevices.getUserMedia
);
const user = ref(null);
const unsubscribe = ref(null);
const products = ref([]);
const productsLoaded = ref(false); // Flag to track when products are loaded

const currentChatMessages = computed(() => {
  const chat = chats.value.find((c) => c.id === currentChatId.value);
  return chat ? chat.messages.filter((msg) => msg.role !== "system") : [];
});

function createNewChat() {
  const chatId = "chat_" + Date.now();
  chats.value.push({ id: chatId, title: "New Chat", messages: [] });
  currentChatId.value = chatId;
  stagedImage.value = null;
}

function updateChatTitle(chat) {
  const firstUserMsg = chat.messages.find((m) => m.role === "user" && m.type === "text");
  chat.title = firstUserMsg?.content
    ? firstUserMsg.content.length > 30
      ? firstUserMsg.content.slice(0, 30) + "..."
      : firstUserMsg.content
    : "New Chat";
}

function switchChat(chatId) {
  currentChatId.value = chatId;
  stagedImage.value = null;
  scrollToBottom();
}

function closeChat(chatId) {
  const index = chats.value.findIndex((c) => c.id === chatId);
  if (index !== -1) {
    chats.value.splice(index, 1);
    if (currentChatId.value === chatId) {
      currentChatId.value = chats.value.length > 0 ? chats.value[0].id : null;
      if (!currentChatId.value) {
        createNewChat();
      }
    }
    stagedImage.value = null;
    scrollToBottom();
  }
}

function clearChat() {
  const chat = chats.value.find((c) => c.id === currentChatId.value);
  if (!chat) return;
  chat.messages = chat.messages.filter((m) => m.role === "system");
  chat.title = "New Chat";
  stagedImage.value = null;
  scrollToBottom();
}

function formatTimestamp(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function scrollToBottom() {
  nextTick(() => {
    if (chatHistory.value) {
      chatHistory.value.scrollTop = chatHistory.value.scrollHeight;
    }
  });
}

async function sendMessageToAI(message, imageUrl = null) {
  try {
    let allMessages = [];
    chats.value.forEach((chat) => {
      allMessages = allMessages.concat(
        chat.messages
          .filter((m) => m.type === "text" || m.type === "image")
          .map((m) => ({
            role: m.role,
            content: m.type === "image" ? `Image: ${m.content}` : m.content,
          }))
      );
    });
    if (allMessages.length > 50) {
      allMessages = allMessages.slice(-50);
    }
    allMessages.push({
      role: "user",
      content: message + (imageUrl ? ` Image: ${imageUrl}` : ""),
    });
    const payload = {
      model: MODEL_NAME,
      messages: allMessages,
      max_tokens: 1024,
      temperature: 0.7,
    };
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (data.choices?.[0]?.message?.content) {
      return data.choices[0].message.content;
    }
    if (data.error?.message) {
      return "Error: " + data.error.message;
    }
    return "Sorry, I could not generate a response.";
  } catch (err) {
    console.error("Chat API error:", err);
    return "Sorry, there was an error connecting to the AI.";
  }
}

async function handleGenerateImage() {
  const prompt = chatInput.value.trim();
  if (!prompt) return;
  const chat = chats.value.find((c) => c.id === currentChatId.value);
  if (!chat) return;
  const timestamp = Date.now();
  chat.messages.push({ role: "user", content: prompt, type: "text", timestamp });
  updateChatTitle(chat);
  chatInput.value = "";
  chat.messages.push({
    role: "bot",
    content: "Generating image...",
    type: "text",
    timestamp: Date.now(),
  });
  scrollToBottom();
  try {
    const response = await fetch(IMAGE_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        Accept: "image/png",
      },
      body: JSON.stringify({ prompt }),
    });
    if (response.ok) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      chat.messages.pop();
      chat.messages.push({
        role: "bot",
        content: url,
        type: "image",
        timestamp: Date.now(),
      });
    } else {
      let errorMsg = "Unknown error";
      try {
        const data = await response.json();
        if (data?.error?.message) {
          errorMsg = data.error.message;
        }
      } catch (e) {
        errorMsg = await response.text();
      }
      chat.messages.pop();
      chat.messages.push({
        role: "bot",
        content: "❌ Image generation failed: " + errorMsg,
        type: "text",
        timestamp: Date.now(),
      });
    }
  } catch (err) {
    console.error("Image API error:", err);
    chat.messages.pop();
    chat.messages.push({
      role: "bot",
      content: "❌ Image API error: " + err.message,
      type: "text",
      timestamp: Date.now(),
    });
  }
  scrollToBottom();
}

function isImagePrompt(text) {
  const keywords = ["image", "draw", "picture", "photo", "generate"];
  return keywords.some((word) => text.toLowerCase().includes(word));
}

async function sendMessage() {
  const message = chatInput.value.trim();
  const chat = chats.value.find((c) => c.id === currentChatId.value);
  if (!chat) return;
  const timestamp = Date.now();

  if (!message && stagedImage.value) {
    chat.messages.push({
      role: "user",
      content: stagedImage.value,
      type: "image",
      timestamp,
    });
    updateChatTitle(chat);
    const aiResponse = await sendMessageToAI("User uploaded an image", stagedImage.value);
    chat.messages.push({
      role: "bot",
      content: aiResponse,
      type: "text",
      timestamp: Date.now(),
    });
    stagedImage.value = null;
    scrollToBottom();
    emit("user-action", { action: "image-upload", content: stagedImage.value });
    return;
  }

  if (message) {
    chat.messages.push({ role: "user", content: message, type: "text", timestamp });
    if (stagedImage.value) {
      chat.messages.push({
        role: "user",
        content: stagedImage.value,
        type: "image",
        timestamp,
      });
    }
    updateChatTitle(chat);
    chatInput.value = "";
    scrollToBottom();
    if (isImagePrompt(message)) {
      chat.messages.push({
        role: "bot",
        content:
          "💡 Tip: To generate an image, type your prompt and click the 'Generate Image' button.",
        type: "text",
        timestamp: Date.now(),
      });
      stagedImage.value = null;
      scrollToBottom();
      return;
    }
    chat.messages.push({
      role: "bot",
      content: "...",
      type: "text",
      timestamp: Date.now(),
    });
    scrollToBottom();
    const aiResponse = await sendMessageToAI(message, stagedImage.value);
    chat.messages.pop();
    chat.messages.push({
      role: "bot",
      content: aiResponse,
      type: "text",
      timestamp: Date.now(),
    });
    stagedImage.value = null;
    scrollToBottom();
    emit("user-action", { action: "message", content: message });
  }
}

async function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const chat = chats.value.find((c) => c.id === currentChatId.value);
  if (!chat) return;
  stagedImage.value = URL.createObjectURL(file);
  scrollToBottom();
}

async function captureImage() {
  if (!isCameraSupported.value) return;
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  const video = document.createElement("video");
  document.body.appendChild(video);
  video.srcObject = stream;
  await video.play();
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);
  const url = canvas.toDataURL("image/png");
  stream.getTracks().forEach((track) => track.stop());
  document.body.removeChild(video);
  const chat = chats.value.find((c) => c.id === currentChatId.value);
  if (!chat) return;
  stagedImage.value = url;
  scrollToBottom();
}

function deleteStagedImage() {
  stagedImage.value = null;
  scrollToBottom();
}

onMounted(() => {
  if (chats.value.length === 0) {
    createNewChat();
  }

  // Fetch products in real-time from Firestore
  const unsubscribeProducts = onSnapshot(
    collection(db, "products"),
    (querySnapshot) => {
      products.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title || "Untitled",
        price: doc.data().price || 0,
        category: doc.data().category || "Uncategorized",
        ownerName: doc.data().ownerName || "Unknown",
      }));
      productsLoaded.value = true; // Set flag when products are loaded
    },
    (error) => {
      console.error("Error fetching products:", error);
    }
  );

  // Watch for products to be loaded before setting the prompt
  watch(productsLoaded, (loaded) => {
    if (loaded) {
      try {
        unsubscribe.value = onAuthStateChanged(auth, (currentUser) => {
          user.value = currentUser;
          const initialPrompt = `
            You are an AI assistant for a website with the following structure and features:
            - If a user asks for products or a product, provide a list of products using the details provided below. Only list products from the provided list.
            - Your role is to assist users navigating the site, answering questions about products, login/signup processes, contact information, and more.
            - Track user actions (e.g., navigation, message sending, image uploads) and provide context-aware responses.
            - If a user asks for help or performs an action, suggest assistance with a message around the chatbot icon.
            - Current date and time: 11:55 AM EEST on Thursday, July 24, 2025
            ${
              user.value
                ? `
            - User Information: 
              - Email: ${user.value.email}
              - Display Name: ${user.value.displayName || "User"}
              - Email Verified: ${user.value.emailVerified}
              - Login Method: ${
                user.value.providerData[0]?.providerId || "Email/Password"
              }
            `
                : "- No user is currently logged in."
            }
            - Website Features:
              - You can view detailed product information, including pictures, available dates, owner details, booking options, reviews, and similar items.
              - The main page allows searching and filtering products based on preferences.
              - Users can interact through booking options, reviews, and feedback.
              - The site supports multiple languages for global access.
              - An account is required for certain features, like renting products.
              - Contact support is available via a form, email, phone, or location details.
              - The design is modern with options for different viewing styles.
              - The web name is Rento.
            - Product Information:
              - The following list contains all products currently available in the database:
              ${products.value
                .map(
                  (product) => `
                  - Title: ${product.title}
                  - Price: ${product.price}
                  - Category: ${product.category}
                  - Owner Name: ${product.ownerName}`
                )
                .join("")}
          `;
          const chat = chats.value[0];
          chat.messages = chat.messages.filter((m) => m.role !== "system");
          chat.messages.push({
            role: "system",
            content: initialPrompt,
            type: "text",
            timestamp: Date.now(),
          });
          console.log("Chat initialized with system prompt:", initialPrompt);
        });
      } catch (err) {
        console.error("Firebase auth error:", err);
        const chat = chats.value[0];
        chat.messages = chat.messages.filter((m) => m.role !== "system");
        chat.messages.push({
          role: "system",
          content: `
            You are an AI assistant for a website with the following structure and features:
            - If a user asks for products or a product, provide a list of products using the details provided below. Only list products from the provided list.
            - Your role is to assist users navigating the site, answering questions about products, login/signup processes, contact information, and more.
            - Track user actions (e.g., navigation, message sending, image uploads) and provide context-aware responses.
            - If a user asks for help or performs an action, suggest assistance with a message around the chatbot icon.
            - Current date and time: 11:55 AM EEST on Thursday, July 24, 2025
            - No user is currently logged in (authentication issue).
            - Website Features:
              - You can view detailed product information, including pictures, available dates, owner details, booking options, reviews, and similar items.
              - The main page allows searching and filtering products based on preferences.
              - Users can interact through booking options, reviews, and feedback.
              - The site supports multiple languages for global access.
              - An account is required for certain features, like renting products.
              - Contact support is available via a form, email, phone, or location details.
              - The design is modern with options for different viewing styles.
              - The web name is Rento.
            - Product Information:
              - The following list contains all products currently available in the database:
              ${products.value
                .map(
                  (product) => `
                - Product ${product.id}: 
                  - Title: ${product.title}
                  - Price: ${product.price}
                  - Category: ${product.category}
                  - Owner Name: ${product.ownerName}`
                )
                .join("")}
          `,
          type: "text",
          timestamp: Date.now(),
        });
      }
    }
  });

  // Cleanup subscriptions on unmount
  onUnmounted(() => {
    if (unsubscribe.value) unsubscribe.value();
    if (unsubscribeProducts) unsubscribeProducts();
  });
});
</script>

<style scoped>
.chatbot-container {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 700px;
  height: 570px;
  background: var(--Color-Surface-Surface-Primary);
  color: var(--Color-Text-Text-Primary);
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.10);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--Color-Boarder-Border-Primary);
}

.header {
  background: var(--Color-Surface-Surface-Primary);
  color: var(--Color-Text-Text-Brand);
  padding: 10px 20px;
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 1px;
  border-bottom: 2px solid var(--Color-Boarder-Border-Primary);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: none;
  border: none;
  color: var(--Color-Text-Text-Secondary);
  cursor: pointer;
  padding: 0;
  font-size: 1.5rem;
}

.chat-app-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.chat-sidebar {
  width: 200px;
  background: var(--Color-Surface-Surface-Tertiary);
  border-right: 1px solid var(--Color-Boarder-Border-Primary);
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 12px;
  font-size: 1rem;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--Color-Boarder-Border-Primary);
}

#chat-list {
  flex: 1;
  list-style: none;
  margin: 0;
  padding: 0;
  overflow-y: auto;
}

#chat-list li {
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: 1px solid var(--Color-Boarder-Border-Primary);
  transition: background 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--Color-Text-Text-Primary);
}

#chat-list li.active,
#chat-list li:hover {
  background: var(--Color-Surface-Surface-Brand);
  color: var(--Color-Text-Text-Invert);
}

.close-chat-btn {
  background: none;
  border: none;
  color: var(--Color-Text-Text-Brand);
  font-size: 1rem;
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
}

.close-chat-btn:hover {
  color: var(--Color-Text-Text-Primary);
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--Color-Surface-Surface-Primary);
}

.chat-history {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chat-message {
  max-width: 70%;
  margin-bottom: 6px;
}

.avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1rem;
  background: var(--Color-Surface-Surface-Brand);
  color: var(--Color-Text-Text-Invert);
}

.chat-form {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 16px;
  border-top: 1px solid var(--Color-Boarder-Border-Primary);
  background: var(--Color-Surface-Surface-Primary);
}

.input-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

#chat-input {
  flex: 1;
  padding: 8px 12px;
  font-size: 0.9rem;
  border: 1px solid var(--Color-Boarder-Border-Primary);
  border-radius: 8px;
  outline: none;
  background: var(--Color-Surface-Surface-Primary);
  color: var(--Color-Text-Text-Primary);
}

.image-preview {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: var(--Color-Surface-Surface-Tertiary);
  border-radius: 8px;
  max-width: 100%;
}

.preview-image {
  max-width: 100px;
  max-height: 100px;
  border-radius: 8px;
  border: 1px solid var(--Color-Boarder-Border-Primary);
}

.delete-button {
  background: none;
  border: none;
  color: var(--Color-Text-Text-Brand);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.preview-text {
  font-size: 0.8rem;
  color: var(--Color-Text-Text-Secondary);
  margin: 0;
}

.button-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
}

.chat-form button {
  padding: 6px 10px;
  font-size: 0.9rem;
  border: 1px solid var(--Color-Boarder-Border-Primary);
  background: var(--Color-Surface-Surface-Brand);
  color: var(--Color-Text-Text-Invert);
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  white-space: nowrap;
}

.chat-form button:hover {
  background: var(--Color-Text-Text-Brand);
  color: var(--Color-Text-Text-Invert);
}

.history-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: var(--Color-Surface-Surface-Primary);
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.10);
  width: 400px;
  max-width: 90vw;
  max-height: 70vh;
  overflow-y: auto;
  color: var(--Color-Text-Text-Primary);
}

.history-list {
  list-style: none;
  padding: 0;
  margin: 0 0 16px 0;
}

.history-item {
  padding: 10px;
  border-bottom: 1px solid var(--Color-Boarder-Border-Primary);
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background 0.2s;
}

.history-item:hover {
  background: var(--Color-Surface-Surface-Tertiary);
}

.history-title {
  font-size: 1rem;
  color: var(--Color-Text-Text-Primary);
}

.no-chats {
  padding: 10px;
  color: var(--Color-Text-Text-Secondary);
  text-align: center;
}

.delete-btn {
  background: none;
  border: none;
  color: var(--Color-Text-Text-Brand);
  font-size: 0.9rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: background 0.2s;
}

.delete-btn:hover {
  background: var(--Color-Surface-Surface-Tertiary);
}

.close-btn-modal {
  display: block;
  width: 100%;
  padding: 8px;
  font-size: 1rem;
  border: 1px solid var(--Color-Boarder-Border-Primary);
  background: var(--Color-Surface-Surface-Brand);
  color: var(--Color-Text-Text-Invert);
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.close-btn-modal:hover {
  background: var(--Color-Text-Text-Brand);
  color: var(--Color-Text-Text-Invert);
}

@media screen and (max-width: 768px) {
  .chatbot-container {
    bottom: 20px;
    right: 10px;
    width: 90vw;
    height: 90vh;
    max-height: 90vh;
  }

  .chat-app-container {
    flex-direction: column;
  }

  .chat-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--Color-Boarder-Border-Primary);
  }

  #chat-list li {
    padding: 6px 10px;
    font-size: 0.9rem;
  }

  .sidebar-footer {
    flex-direction: row;
    padding: 6px 10px;
  }

  .sidebar-footer button {
    padding: 4px 6px;
    font-size: 0.8rem;
  }

  .chat-main {
    flex: 1;
  }

  .chat-history {
    padding: 10px;
  }

  .chat-message {
    max-width: 90%;
  }

  .bubble img {
    max-width: 100%;
    max-height: 150px;
  }

  .chat-form {
    padding: 10px;
  }

  .input-container {
    width: 100%;
  }

  #chat-input {
    width: 100%;
    padding: 6px 10px;
    font-size: 0.9rem;
  }

  .image-preview {
    flex-direction: column;
    align-items: flex-start;
    max-width: 100%;
    padding: 6px;
  }

  .preview-image {
    max-width: 80px;
    max-height: 80px;
  }

  .preview-text {
    font-size: 0.7rem;
  }

  .button-container {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .chat-form button {
    padding: 4px 8px;
    font-size: 0.8rem;
    flex: 1 1 calc(33.33% - 4px);
    min-width: 70px;
  }

  .modal-content {
    width: 80vw;
    padding: 15px;
  }

  .history-item {
    padding: 8px;
  }

  .history-title {
    font-size: 0.9rem;
  }

  .delete-btn {
    font-size: 0.8rem;
    padding: 2px 6px;
  }

  .close-btn-modal {
    padding: 6px;
    font-size: 0.9rem;
  }
}

@media screen and (max-width: 480px) {
  .chatbot-container {
    height: 85vh;
    max-height: 85vh;
  }

  .chat-form button {
    flex: 1 1 calc(50% - 4px);
    min-width: 60px;
    font-size: 0.7rem;
    padding: 3px 6px;
  }

  .image-preview {
    padding: 4px;
  }

  .preview-image {
    max-width: 60px;
    max-height: 60px;
  }

  .modal-content {
    width: 90vw;
    padding: 10px;
  }

  .history-item {
    padding: 6px;
  }

  .history-title {
    font-size: 0.8rem;
  }

  .delete-btn {
    font-size: 0.7rem;
    padding: 2px 4px;
  }

  .close-btn-modal {
    padding: 5px;
    font-size: 0.8rem;
  }
}
</style>
