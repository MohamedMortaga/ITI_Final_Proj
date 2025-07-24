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
            <button @click.stop="deleteChat(chat.id)" class="delete-btn">×</button>
          </li>
        </ul>
        <div class="sidebar-footer">
          <button id="save-chat" @click="saveCurrentChatToHistory">Save Chat</button>
          <button id="use-history" @click="showHistory">Use History</button>
          <button id="clear-chat" @click="clearCurrentChat">Clear Chat</button>
        </div>
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
        <form id="chat-form" class="chat-form" @submit.prevent="sendMessage">
          <input
            v-model="chatInput"
            type="text"
            id="chat-input"
            placeholder="Type your message..."
            autocomplete="off"
            required
          />
          <!-- Add ref for image upload -->
          <input
            type="file"
            id="image-upload"
            ref="imageUpload"
            accept="image/*"
            @change="handleImageUpload"
            style="display: none"
          />
          <button type="button" @click="$refs.imageUpload.click()">Upload Image</button>
          <button type="button" @click="captureImage" v-if="isCameraSupported">
            Camera
          </button>
          <button type="submit">Send</button>
          <button type="button" id="generate-image" @click="handleGenerateImage">
            Generate Image
          </button>
        </form>
      </main>
    </div>
    <div
      v-if="showHistoryModal"
      id="history-modal"
      style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.3);
        z-index: 1000;
        align-items: center;
        justify-content: center;
      "
    >
      <div
        style="
          background: #fff;
          padding: 24px;
          border-radius: 8px;
          min-width: 320px;
          max-width: 90vw;
          max-height: 80vh;
          overflow: auto;
        "
      >
        <h3>Choose a Saved Chat</h3>
        <ul id="history-list" style="list-style: none; padding: 0; margin: 0 0 16px 0">
          <li
            v-for="saved in savedChats"
            :key="saved.key"
            style="cursor: pointer; padding: 8px 0; border-bottom: 1px solid #eee"
            @click="loadSavedChat(saved.chat)"
          >
            {{ saved.title }}
          </li>
          <li v-if="savedChats.length === 0">No saved chats.</li>
        </ul>
        <button id="close-history-modal" @click="showHistoryModal = false">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/config";

const emit = defineEmits(["close", "user-action"]);

const API_KEY = "fw_3ZeTAgD3p68MjXVtTt9zPWVd";
const API_URL = "https://api.fireworks.ai/inference/v1/chat/completions";
const MODEL_NAME = "accounts/fireworks/models/llama-v3p1-8b-instruct";
const IMAGE_API_URL =
  "https://api.fireworks.ai/inference/v1/workflows/accounts/fireworks/models/flux-1-schnell-fp8/text_to_image";

const chats = ref([]);
const currentChatId = ref(null);
const chatInput = ref("");
const showHistoryModal = ref(false);
const chatHistory = ref(null);
const imageUpload = ref(null);
const isCameraSupported = ref(
  navigator.mediaDevices && navigator.mediaDevices.getUserMedia
);
const user = ref(null);
const unsubscribe = ref(null);

const currentChatMessages = computed(() => {
  const chat = chats.value.find((c) => c.id === currentChatId.value);
  return chat ? chat.messages : [];
});

const savedChats = computed(() => {
  const saved = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("chatbot_history_")) {
      try {
        const chat = JSON.parse(localStorage.getItem(key));
        let title = "Saved Chat";
        const firstUserMsg = chat.messages?.find(
          (m) => m.role === "user" && m.type === "text"
        );
        if (firstUserMsg?.content) {
          title =
            firstUserMsg.content.length > 30
              ? firstUserMsg.content.slice(0, 30) + "..."
              : firstUserMsg.content;
        } else {
          title = new Date(
            parseInt(key.replace("chatbot_history_", ""))
          ).toLocaleString();
        }
        saved.push({ key, chat, title });
      } catch (e) {
        console.error(`Error parsing chat history ${key}:`, e);
      }
    }
  }
  return saved.sort((a, b) => b.key.localeCompare(a.key));
});

function createNewChat() {
  const chatId = "chat_" + Date.now();
  chats.value.push({ id: chatId, title: "New Chat", messages: [] });
  currentChatId.value = chatId;
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
  if (!message) return;
  const chat = chats.value.find((c) => c.id === currentChatId.value);
  if (!chat) return;
  const timestamp = Date.now();
  chat.messages.push({ role: "user", content: message, type: "text", timestamp });
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
  const aiResponse = await sendMessageToAI(message);
  chat.messages.pop();
  chat.messages.push({
    role: "bot",
    content: aiResponse,
    type: "text",
    timestamp: Date.now(),
  });
  scrollToBottom();
  emit("user-action", { action: "message", content: message });
}

async function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const chat = chats.value.find((c) => c.id === currentChatId.value);
  if (!chat) return;
  const timestamp = Date.now();
  const url = URL.createObjectURL(file);
  chat.messages.push({ role: "user", content: url, type: "image", timestamp });
  updateChatTitle(chat);
  scrollToBottom();
  const aiResponse = await sendMessageToAI("User uploaded an image", url);
  chat.messages.push({
    role: "bot",
    content: aiResponse,
    type: "text",
    timestamp: Date.now(),
  });
  scrollToBottom();
  emit("user-action", { action: "image-upload", content: url });
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
  const timestamp = Date.now();
  chat.messages.push({ role: "user", content: url, type: "image", timestamp });
  updateChatTitle(chat);
  scrollToBottom();
  const aiResponse = await sendMessageToAI("User captured an image", url);
  chat.messages.push({
    role: "bot",
    content: aiResponse,
    type: "text",
    timestamp: Date.now(),
  });
  scrollToBottom();
  emit("user-action", { action: "camera-capture", content: url });
}

function saveCurrentChatToHistory() {
  const chat = chats.value.find((c) => c.id === currentChatId.value);
  if (!chat) return;
  const key = "chatbot_history_" + Date.now();
  localStorage.setItem(key, JSON.stringify(chat));
  alert("Chat saved to history!");
}

function showHistory() {
  showHistoryModal.value = true;
}

function loadSavedChat(chat) {
  const chatIdx = chats.value.findIndex((c) => c.id === currentChatId.value);
  if (chatIdx !== -1) {
    chats.value[chatIdx].messages = chat.messages;
    updateChatTitle(chats.value[chatIdx]);
    scrollToBottom();
  }
  showHistoryModal.value = false;
}

function clearCurrentChat() {
  const chat = chats.value.find((c) => c.id === currentChatId.value);
  if (chat) {
    chat.messages = [];
    updateChatTitle(chat);
    scrollToBottom();
  }
}

function deleteChat(chatId) {
  const chatIdx = chats.value.findIndex((c) => c.id === chatId);
  if (chatIdx !== -1) {
    chats.value.splice(chatIdx, 1);
    if (currentChatId.value === chatId) {
      currentChatId.value = chats.value.length > 0 ? chats.value[0].id : null;
    }
    if (chats.value.length === 0) {
      createNewChat();
    }
    scrollToBottom();
  }
}

onMounted(() => {
  if (chats.value.length === 0) {
    createNewChat();
  }
  unsubscribe.value = onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser;
    const initialPrompt = `
      You are an AI assistant for a website with the following structure and features:
      - Routes: admin, AddProduct, AllProducts, Contact, Home, Login, Logout, ProductDetails, Signup
      - Layouts: AdminLayout and DefaultLayout
      - The website includes an event bus (eventBus.js) and i18n.js for internationalization
      - Your role is to assist users navigating the site, answering questions about products, login/signup processes, contact information, and more
      - Track user actions (e.g., navigation, message sending, image uploads) and provide context-aware responses
      - If a user asks for help or performs an action, suggest assistance with a message around the chatbot icon
      - Current date and time: 09:47 AM EEST on Thursday, July 24, 2025
      ${
        user.value
          ? `
      - User Information: 
        - UID: ${user.value.uid}
        - Email: ${user.value.email}
        - Display Name: ${user.value.displayName || "User"}
        - Email Verified: ${user.value.emailVerified}
        - Login Method: ${user.value.providerData[0]?.providerId || "Email/Password"}
      `
          : "- No user is currently logged in."
      }
    `;
    const chat = chats.value[0];
    chat.messages = chat.messages.filter((m) => m.role !== "system"); // Clear existing system messages
    chat.messages.push({
      role: "system",
      content: initialPrompt,
      type: "text",
      timestamp: Date.now(),
    });
  });
});

onUnmounted(() => {
  if (unsubscribe.value) {
    unsubscribe.value();
  }
});
</script>

<style scoped>
.chatbot-container {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 700px;
  height: 500px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  background: #145a32;
  color: #f7ca18;
  padding: 10px 20px;
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 1px;
  border-bottom: 4px solid #0b3d1c;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: none;
  border: none;
  color: #f7ca18;
  cursor: pointer;
  padding: 0;
}

.chat-app-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.chat-sidebar {
  width: 200px;
  background: #eafaf1;
  border-right: 1px solid #b2babb;
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
  border-bottom: 1px solid #b2babb;
}

#new-chat {
  background: none;
  border: none;
  color: #145a32;
  font-size: 1rem;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 3px;
}

#new-chat:hover {
  background: #f7ca18;
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
  border-bottom: 1px solid #d5f5e3;
  transition: background 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#chat-list li.active,
#chat-list li:hover {
  background: #f7ca18;
  color: #222;
}

.delete-btn {
  background: none;
  border: none;
  color: #ff4444;
  font-size: 1rem;
  cursor: pointer;
  padding: 0 4px;
}

.sidebar-footer {
  padding: 8px 12px;
  border-top: 1px solid #b2babb;
  display: flex;
  gap: 6px;
}

.sidebar-footer button {
  flex: 1;
  padding: 6px 0;
  font-size: 0.9rem;
  border: 1px solid #145a32;
  background: #d5f5e3;
  color: #145a32;
  border-radius: 3px;
  cursor: pointer;
  transition: background 0.2s;
}

.sidebar-footer button:hover {
  background: #f7ca18;
  color: #222;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
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
}

.chat-form {
  display: flex;
  gap: 6px;
  padding: 12px 16px;
  border-top: 1px solid #b2babb;
  background: #eafaf1;
}

#chat-input {
  flex: 1;
  padding: 8px 12px;
  font-size: 0.9rem;
  border: 1px solid #b2babb;
  border-radius: 4px;
  outline: none;
}

.chat-form button {
  padding: 8px 12px;
  font-size: 0.9rem;
  border: 1px solid #145a32;
  background: #d5f5e3;
  color: #145a32;
  border-radius: 3px;
  cursor: pointer;
  transition: background 0.2s;
}

.chat-form button:hover {
  background: #f7ca18;
  color: #222;
}

@media screen and (max-width: 768px) {
  .chatbot-container {
    position: fixed;
    bottom: 20px;
    right: 10px;
    width: 90vw;
    height: 80vh;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .chat-app-container {
    flex-direction: column;
  }
  .chat-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #b2babb;
  }
  .chat-main {
    flex: 1;
  }
  .chat-history .chat-message {
    max-width: 90%;
  }
  .bubble img {
    max-width: 100%;
    max-height: 150px;
  }
}
</style>
