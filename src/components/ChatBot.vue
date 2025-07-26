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
import { collection, onSnapshot, doc } from "firebase/firestore";
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
const userBookings = ref([]);
const userBalance = ref({
  balance: 0,
  email: "",
  lastUpdated: "",
  name: null,
  phone: "",
  profit: 0,
  serviceFee: 0,
  userid: "",
  userimage: null,
  username: null,
});
const productsLoaded = ref(false);

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
      } catch (err) {
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
    console.error("Image generation error:", err);
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
  return keywords.some((kw) => text.toLowerCase().includes(kw.toString()));
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

// Function to update system prompt
function updateSystemPrompt() {
  const chat = chats.value[0];
  if (!chat) return;

  const initialPrompt = `
    You are an AI assistant for a website with the following structure and features:
    - If a user asks for products or a product, provide a list of products using the details provided below. Only list products from the provided list.
    - Your role is to assist users navigating the site, answering questions about products, login/signup processes, contact information, and more.
    - Track user actions (e.g., navigation, message sending, image uploads) and provide context-aware responses.
    - If a user asks for help or performs an action, suggest assistance with a message around the chatbot icon.
    - Act as a recommendation system based on the user's previous bookings.
    - Current date and time: ${new Date().toLocaleString("en-US", {
      timeZone: "Europe/Bucharest",
      hour12: false,
    })}
    ${
      user.value
        ? `
    - User Information:
      - Email: ${user.value.email}
      - Display Name: ${user.value.displayName || "User"}
      - Email Verified: ${user.value.emailVerified}
      - Login Method: ${user.value.providerData[0]?.providerId || "Email/Password"}
    `
        : "- No user is currently logged in."
    }
    - Booking Information:
      - The following list contains the user's previous bookings:
      ${userBookings.value
        .map(
          (booking) => `
        - Product: ${booking.productTitle}
        - Seller: ${booking.sellerName}
        - Start Date: ${booking.startDate}
        - Status: ${booking.status}
        - Total Price: ${booking.totalPrice} EGP`
        )
        .join("")}
    - User Balance Information:
      - The following details are from the userbalance collection for user ID ${
        userBalance.value.userid || "N/A"
      }:
        - Balance: ${userBalance.value.balance} EGP
        - Email: ${userBalance.value.email || "N/A"}
        - Last Updated: ${userBalance.value.lastUpdated || "N/A"}
        - Name: ${userBalance.value.name || "N/A"}
        - Phone: ${userBalance.value.phone || "N/A"}
        - Profit: ${userBalance.value.profit} EGP
        - Service Fee: ${userBalance.value.serviceFee} EGP
        - User ID: ${userBalance.value.userid || "N/A"}
        - User Image: ${userBalance.value.userimage || "N/A"}
        - Username: ${userBalance.value.username || "N/A"}
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
  chat.messages = chat.messages.filter((m) => m.role !== "system");
  chat.messages.push({
    role: "system",
    content: initialPrompt,
    type: "text",
    timestamp: Date.now(),
  });
  console.log("System prompt updated:", initialPrompt);
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
      productsLoaded.value = true;
    },
    (error) => {
      console.error("Error fetching products:", error);
    }
  );

  // Fetch bookings in real-time from Firestore
  const unsubscribeBookings = onSnapshot(
    collection(db, "bookings"),
    (querySnapshot) => {
      userBookings.value = querySnapshot.docs
        .filter((doc) => doc.data().userId === (user.value ? user.value.uid : null))
        .map((doc) => ({
          productTitle: doc.data().productTitle || "Unknown",
          sellerName: doc.data().sellerName || "Unknown",
          startDate: doc.data().startDate || "Unknown",
          status: doc.data().status || "Unknown",
          totalPrice: doc.data().totalPrice || 0,
        }));
      console.log("Current bookings for user:", userBookings.value);
      productsLoaded.value = true;
    },
    (error) => {
      console.error("Error fetching bookings:", error);
    }
  );

  // Watch authentication state and fetch user balance dynamically
  unsubscribe.value = onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser;
    let unsubscribeUserBalance = null;
    if (currentUser) {
      // Fetch user balance for the logged-in user
      unsubscribeUserBalance = onSnapshot(
        doc(db, "userbalance", currentUser.uid),
        (docSnap) => {
          if (docSnap.exists()) {
            const userBalanceData = docSnap.data();
            userBalance.value = {
              balance: userBalanceData.balance || 0,
              email: userBalanceData.email || "",
              lastUpdated: userBalanceData.lastUpdated
                ? new Date(userBalanceData.lastUpdated).toLocaleString("en-US", {
                    timeZone: "UTC+3",
                    hour12: true,
                  })
                : "",
              name: userBalanceData.name || null,
              phone: userBalanceData.phone || "",
              profit: userBalanceData.profit || 0,
              serviceFee: userBalanceData.serviceFee || 0,
              userid: userBalanceData.userid || currentUser.uid,
              userimage: userBalanceData.userimage || null,
              username: userBalanceData.username || null,
            };
          } else {
            userBalance.value = {
              balance: 0,
              email: currentUser.email || "",
              lastUpdated: "",
              name: null,
              phone: "",
              profit: 0,
              serviceFee: 0,
              userid: currentUser.uid,
              userimage: null,
              username: null,
            };
          }
          productsLoaded.value = true;
          updateSystemPrompt(); // Update system prompt after balance is fetched
        },
        (error) => {
          console.error("Error fetching user balance:", error);
          userBalance.value = {
            balance: 0,
            email: currentUser.email || "",
            lastUpdated: "",
            name: null,
            phone: "",
            profit: 0,
            serviceFee: 0,
            userid: currentUser.uid,
            userimage: null,
            username: null,
          };
          productsLoaded.value = true;
          updateSystemPrompt(); // Update system prompt even on error
        }
      );
    } else {
      // Handle no user logged in
      userBalance.value = {
        balance: 0,
        email: "",
        lastUpdated: "",
        name: null,
        phone: "",
        profit: 0,
        serviceFee: 0,
        userid: "",
        userimage: null,
        username: null,
      };
      productsLoaded.value = true;
      updateSystemPrompt(); // Update system prompt for no user
    }

    // Clean up balance subscription when user changes
    onUnmounted(() => {
      if (unsubscribeUserBalance) unsubscribeUserBalance();
    });
  });

  // Watch for changes in userBalance and update system prompt
  watch(
    () => [userBalance.value, productsLoaded.value, userBookings.value.length],
    () => {
      if (productsLoaded.value) {
        updateSystemPrompt();
      }
    },
    { deep: true }
  );

  onUnmounted(() => {
    if (unsubscribe.value) unsubscribe.value();
    if (unsubscribeProducts) unsubscribeProducts();
    if (unsubscribeBookings) unsubscribeBookings();
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
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
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
  -webkit-overflow-scrolling: touch;
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
    height: 100%;
  }

  .chat-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--Color-Boarder-Border-Primary);
    max-height: 20vh;
    overflow-y: auto;
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
    height: 70vh;
  }

  .chat-history {
    flex: 1;
    padding: 10px;
    max-height: 60vh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
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
}

@media screen and (max-width: 480px) {
  .chatbot-container {
    height: 85vh;
    max-height: 85vh;
  }

  .chat-main {
    height: 65vh;
  }

  .chat-history {
    max-height: 55vh;
    padding: 8px;
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
}
</style>
