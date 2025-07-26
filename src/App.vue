<script setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import ChatBot from "@/components/ChatBot.vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";

const route = useRoute();
const router = useRouter();
const isChatOpen = ref(false);
const layout = computed(() => {
  if (route.meta.layout === "admin" && !isPasswordVerified.value) return null;
  return route.meta.layout === "admin" ? AdminLayout : DefaultLayout;
});
const showPasswordModal = ref(false);
const passwordInput = ref("");
const isPasswordVerified = ref(false);

const checkPassword = () => {
  if (route.meta.layout === "admin" && !isPasswordVerified.value) {
    showPasswordModal.value = true;
  }
};

const verifyPassword = () => {
  if (passwordInput.value === "123321") {
    isPasswordVerified.value = true;
    showPasswordModal.value = false;
    passwordInput.value = ""; // Clear the input
  } else {
    alert("Incorrect password. Please try again.");
    passwordInput.value = ""; // Clear the input on wrong password
  }
};

// Check password on initial load and when route changes to admin
const checkPasswordOnRouteChange = () => {
  if (route.meta.layout === "admin" && !isPasswordVerified.value) {
    showPasswordModal.value = true;
  }
};

// Watch for route changes to admin layout
watch(
  () => route.meta.layout,
  (newLayout) => {
    if (newLayout === "admin" && !isPasswordVerified.value) {
      showPasswordModal.value = true;
    }
  }
);

// Check password on initial load
checkPasswordOnRouteChange();

function toggleChat() {
  isChatOpen.value = !isChatOpen.value;
}
</script>

<template>
  <div>
    <component :is="layout" v-if="layout">
      <router-view />
    </component>
    <button
      class="chat-toggle-btn"
      @click="toggleChat"
      :aria-label="isChatOpen ? 'Close chat' : 'Open chat'"
    >
      <svg
        v-if="!isChatOpen"
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
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <svg
        v-else
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
    <ChatBot v-if="isChatOpen" @close="toggleChat" @user-action="handleUserAction" />
    <div v-if="showPasswordModal" class="modal">
      <div class="modal-content">
        <h2>Enter Admin Password</h2>
        <input v-model="passwordInput" type="password" placeholder="Password" />
        <button @click="verifyPassword">Submit</button>
        <button
          @click="
            showPasswordModal = false;
            router.push('/');
          "
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-toggle-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--Color-Surface-Surface-Primary);
  color: var(--Color-Text-Text-Brand);
  border: 2px solid var(--Color-Text-Text-Brand);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: background 0.2s, color 0.2s, border 0.2s;
}
.chat-toggle-btn svg {
  stroke: var(--Color-Text-Text-Brand);
  transition: stroke 0.2s;
}
.chat-toggle-btn:hover {
  background: var(--Color-Text-Text-Brand);
  color: var(--Color-Text-Text-Invert);
  border-color: var(--Color-Text-Text-Brand);
}
.chat-toggle-btn:hover svg {
  stroke: var(--Color-Text-Text-Invert);
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}
.modal-content {
  background: var(--Color-Surface-Surface-Primary);
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}
.modal-content input {
  margin: 10px 0;
  padding: 5px;
}
.modal-content button {
  margin: 0 5px;
  padding: 5px 10px;
}
</style>
