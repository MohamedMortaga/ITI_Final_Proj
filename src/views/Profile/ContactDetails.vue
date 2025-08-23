<template>
  <div class="max-w-6xl mx-auto py-10 px-4">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-[var(--Color-Text-Text-Primary)] mb-2">
        {{ $t("contactDetails") }}
      </h1>
      <p class="text-[var(--Color-Text-Text-Secondary)]">
        {{ $t("renterContactInfo") }}
      </p>
    </div>

    <!-- Contact Details Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="booking in bookingsWithContactInfo"
        :key="booking.id"
        class="bg-[var(--Color-Surface-Surface-Tertiary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6"
      >
        <!-- USER IMAGE (not product) -->
        <div class="mb-4">
          <img
            :src="booking.userImage || DEFAULT_AVATAR"
            :alt="booking.userName || 'User'"
            class="w-full h-32 object-cover rounded-lg mb-3"
            @error="(e) => (e.target.src = DEFAULT_AVATAR)"
          />
          <h3 class="font-semibold text-[var(--Color-Text-Text-Primary)] mb-1">
            {{ booking.productTitle }}
          </h3>
          <p class="text-sm text-[var(--Color-Text-Text-Secondary)]">
            {{ $t("rentalPeriod") }}: {{ formatDate(booking.startDate) }} -
            {{ formatDate(booking.endDate) }}
          </p>
          <p class="text-xs text-[var(--Color-Text-Text-Secondary)] mt-1">
            {{ $t("status") }}:
            <span class="font-medium" :class="getStatusColor(booking.status)">
              {{ $t(booking.status) }}
            </span>
          </p>
        </div>

        <!-- Renter Contact Information -->
        <div class="space-y-3">
          <h4 class="font-semibold text-[var(--Color-Text-Text-Primary)] text-sm">
            {{ $t("renterContactInfo") }}
          </h4>

          <!-- Renter Name + Verified -->
          <div v-if="booking.userName" class="flex items-center gap-2">
            <i class="fas fa-user text-[var(--Color-Text-Text-Brand)] w-4"></i>
            <span class="text-sm text-[var(--Color-Text-Text-Secondary)]"
              >{{ $t("name") }}:</span
            >
            <VerificationBadge
              :userName="booking.userName"
              :isVerified="booking.userVerificationStatus"
            />
          </div>

          <!-- Renter Phone -->
          <div v-if="booking.phoneNumber" class="flex items-center gap-2">
            <i class="fas fa-phone text-[var(--Color-Text-Text-Brand)] w-4"></i>
            <span class="text-sm text-[var(--Color-Text-Text-Secondary)]"
              >{{ $t("renterPhone") }}:</span
            >
            <span class="text-sm font-medium text-[var(--Color-Text-Text-Primary)]">{{
              booking.phoneNumber
            }}</span>
          </div>

          <!-- Renter Email -->
          <div v-if="booking.userEmail" class="flex items-center gap-2">
            <i class="fas fa-envelope text-[var(--Color-Text-Text-Brand)] w-4"></i>
            <span class="text-sm text-[var(--Color-Text-Text-Secondary)]"
              >{{ $t("renterEmail") }}:</span
            >
            <span class="text-sm font-medium text-[var(--Color-Text-Text-Primary)]">{{
              booking.userEmail
            }}</span>
          </div>

          <!-- Delivery Method -->
          <div
            class="flex items-center gap-2 mt-4 pt-3 border-t border-[var(--Color-Boarder-Border-Primary)]"
          >
            <i class="fas fa-truck text-[var(--Color-Text-Text-Brand)] w-4"></i>
            <span class="text-sm text-[var(--Color-Text-Text-Secondary)]">
              {{
                booking.deliveryMethod === "pickup"
                  ? $t("pickupLocation")
                  : $t("deliveryAddress")
              }}:
            </span>
            <span class="text-sm font-medium text-[var(--Color-Text-Text-Primary)]">
              {{
                booking.deliveryMethod === "pickup"
                  ? booking.sellerContactInfo?.sellerAddress || ""
                  : booking.deliveryAddress
              }}
            </span>
          </div>

          <!-- Price Breakdown -->
          <div
            class="space-y-2 mt-4 pt-3 border-t border-[var(--Color-Boarder-Border-Primary)]"
          >
            <div class="flex justify-between items-center">
              <span class="text-sm text-[var(--Color-Text-Text-Secondary)]"
                >{{ $t("subtotal") }}:</span
              >
              <span class="text-sm font-medium text-[var(--Color-Text-Text-Primary)]">
                {{ $t("egp") }} {{ calculateSubtotal(booking) }}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-[var(--Color-Text-Text-Secondary)]"
                >{{ $t("deliveryFee") }}:</span
              >
              <span class="text-sm font-medium text-[var(--Color-Text-Text-Primary)]">
                {{ $t("egp") }} {{ calculateDeliveryFee(booking) }}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-[var(--Color-Text-Text-Secondary)]"
                >{{ $t("serviceFee") }}:</span
              >
              <span class="text-sm font-medium text-[var(--Color-Text-Text-Primary)]"
                >{{ $t("egp") }} 5.00</span
              >
            </div>
            <div
              class="flex justify-between items-center pt-2 border-t border-[var(--Color-Boarder-Border-Primary)]"
            >
              <span class="text-sm font-bold text-[var(--Color-Text-Text-Primary)]"
                >{{ $t("total") }}:</span
              >
              <span class="text-sm font-bold text-[var(--Color-Text-Text-Brand)]">
                {{ $t("egp") }} {{ getTotalPrice(booking) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-4 pt-3 border-t border-[var(--Color-Boarder-Border-Primary)]">
          <div class="mb-4">
            <h4 class="font-semibold text-[var(--Color-Text-Text-Primary)] text-sm mb-3">
              {{ $t("rentalStatusManagement") }}
            </h4>

            <div class="flex items-center gap-2 mb-3">
              <span class="text-sm text-[var(--Color-Text-Text-Secondary)]"
                >{{ $t("currentStatus") }}:</span
              >
              <span
                class="font-medium px-2 py-1 rounded text-xs"
                :class="getStatusColor(booking.status)"
              >
                {{ $t(booking.status) }}
              </span>
            </div>

            <div class="flex gap-2 flex-wrap">
              <button
                v-if="isCurrentUserSeller(booking) && booking.status === 'pending'"
                @click="updateRentalStatusWithUI(booking.id, 'active', 'seller', $t)"
                class="bg-green-500 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-green-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center gap-1"
                title="Mark as Active when handing over the item"
              >
                <i class="fas fa-check"></i>
                {{ $t("setActive") }}
              </button>

              <button
                v-if="isCurrentUserRenter(booking) && booking.status === 'pending'"
                @click="updateRentalStatusWithUI(booking.id, 'active', 'renter', $t)"
                class="bg-blue-500 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-blue-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center gap-1"
                title="Confirm Active when receiving the item"
              >
                <i class="fas fa-check-double"></i>
                {{ $t("confirmActive") }}
              </button>

              <button
                v-if="booking.status === 'active' && isCurrentUserSeller(booking)"
                @click="updateRentalStatusWithUI(booking.id, 'completed', 'seller', $t)"
                class="bg-purple-500 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-purple-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center gap-1"
                title="Confirm completion as seller"
              >
                <i class="fas fa-check-circle"></i>
                {{ $t("confirmCompletion") }}
              </button>

              <button
                v-if="booking.status === 'active' && isCurrentUserRenter(booking)"
                @click="updateRentalStatusWithUI(booking.id, 'completed', 'renter', $t)"
                class="bg-purple-500 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-purple-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center gap-1"
                title="Confirm completion as renter"
              >
                <i class="fas fa-check-circle"></i>
                {{ $t("confirmCompletion") }}
              </button>

              <button
                v-if="booking.status === 'pending'"
                @click="
                  updateRentalStatusWithUI(
                    booking.id,
                    'rejected',
                    isCurrentUserSeller(booking) ? 'seller' : 'renter',
                    $t
                  )
                "
                class="bg-red-500 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-red-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center gap-1"
                title="Reject this rental"
              >
                <i class="fas fa-times"></i>
                {{ $t("rejectRental") }}
              </button>

              <button
                v-if="booking.status === 'rejected'"
                @click="
                  updateRentalStatusWithUI(
                    booking.id,
                    'pending',
                    isCurrentUserSeller(booking) ? 'seller' : 'renter',
                    $t
                  )
                "
                class="bg-yellow-500 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-yellow-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center gap-1"
                title="Reset to Pending status"
              >
                <i class="fas fa-undo"></i>
                {{ $t("resetToPending") }}
              </button>
            </div>

            <div
              v-if="
                booking.status === 'active' &&
                (booking.sellerConfirmed || booking.renterConfirmed)
              "
              class="mt-3 pt-3 border-t border-[var(--Color-Boarder-Border-Primary)]"
            >
              <h5
                class="text-xs font-medium text-[var(--Color-Text-Text-Secondary)] mb-2"
              >
                {{ $t("completionConfirmation") }}:
              </h5>
              <div class="space-y-2">
                <div class="flex items-center gap-2 text-xs">
                  <i class="fas fa-user-tie text-blue-500"></i>
                  <span class="text-[var(--Color-Text-Text-Secondary)]"
                    >{{ $t("seller") }}:</span
                  >
                  <span
                    v-if="booking.sellerConfirmed"
                    class="text-green-600 font-medium"
                    >{{ $t("confirmed") }}</span
                  >
                  <span v-else class="text-gray-500">{{ $t("pending") }}</span>
                </div>
                <div class="flex items-center gap-2 text-xs">
                  <i class="fas fa-user text-blue-500"></i>
                  <span class="text-[var(--Color-Text-Text-Secondary)]"
                    >{{ $t("renter") }}:</span
                  >
                  <span
                    v-if="booking.renterConfirmed"
                    class="text-green-600 font-medium"
                    >{{ $t("confirmed") }}</span
                  >
                  <span v-else class="text-gray-500">{{ $t("pending") }}</span>
                </div>
                <div
                  v-if="booking.fullyCompleted"
                  class="flex items-center gap-2 text-xs"
                >
                  <i class="fas fa-check-circle text-green-500"></i>
                  <span class="text-green-600 font-medium">{{
                    $t("rentalCompleted")
                  }}</span>
                </div>
              </div>
            </div>

            <div
              v-if="booking.statusHistory && booking.statusHistory.length > 0"
              class="mt-3 pt-3 border-t border-[var(--Color-Boarder-Border-Primary)]"
            >
              <h5
                class="text-xs font-medium text-[var(--Color-Text-Text-Secondary)] mb-2"
              >
                {{ $t("statusHistory") }}:
              </h5>
              <div class="space-y-1">
                <div
                  v-for="(history, index) in booking.statusHistory.slice(-3)"
                  :key="index"
                  class="flex items-center gap-2 text-xs"
                >
                  <span class="text-[var(--Color-Text-Text-Secondary)]"
                    >{{ formatDate(history.timestamp) }}:</span
                  >
                  <span class="font-medium" :class="getStatusColor(history.status)">{{
                    $t(history.status)
                  }}</span>
                  <span class="text-[var(--Color-Text-Text-Secondary)]"
                    >({{ history.updatedBy }})</span
                  >
                </div>
              </div>
            </div>
          </div>

          <div class="flex gap-2">
            <button
              @click="
                messageUser(
                  booking.userId,
                  booking.userName,
                  booking.productId,
                  booking.productTitle
                )
              "
              class="flex-1 bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] py-3 px-4 rounded-lg text-sm font-medium hover:bg-[var(--Colors-Primary-600)] transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
              title="Start a conversation with this user"
            >
              <i class="fas fa-comments"></i>
              {{ $t("messageUser") }}
            </button>
            <button
              @click="callContact(booking.phoneNumber)"
              class="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center"
              title="Call this contact"
            >
              <i class="fas fa-phone-volume"></i>
            </button>
            <button
              @click="deleteContactDetails(booking.id)"
              class="bg-[var(--Colors-Error-400)] text-white p-3 rounded-lg hover:bg-[var(--Colors-Error-500)] transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center"
              title="Delete this contact details entry"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="bookingsWithContactInfo.length === 0" class="text-center py-12">
      <i
        class="fas fa-address-book text-6xl text-[var(--Color-Text-Text-Secondary)] mb-4 opacity-50"
      ></i>
      <h3 class="text-xl font-semibold text-[var(--Color-Text-Text-Primary)] mb-2">
        {{ $t("noContactDetails") }}
      </h3>
      <p class="text-[var(--Color-Text-Text-Secondary)]">
        {{ $t("noContactDetailsDesc") }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { db, auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useGlobalRealTime } from "@/composables/useGlobalRealTime";
import { useRentalStatus } from "@/composables/useRentalStatus";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import Swal from "sweetalert2";
import VerificationBadge from "@/components/VerificationBadge.vue";

const { t } = useI18n();
const router = useRouter();
const { bookings } = useGlobalRealTime();
const { updateRentalStatusWithUI } = useRentalStatus();

const userId = ref(null);
const userVerificationStatuses = ref({});
const productDetails = ref({});
const calculatedPrices = ref({});

/* --- NEW: renter profiles cache (imageUrl, displayName, etc.) --- */
const renterProfiles = ref({}); // { [userId]: { imageUrl?: string, displayName?: string } }

/* Built-in neutral avatar (SVG data URL) so you don’t need an asset file */
const DEFAULT_AVATAR =
  'data:image/svg+xml;utf8,\
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="240" viewBox="0 0 600 240">\
  <rect width="600" height="240" rx="16" fill="#D1D5DB"/>\
  <circle cx="300" cy="100" r="55" fill="#F3F4F6"/><path d="M120 240c20-45 70-75 180-75s160 30 180 75" fill="#F3F4F6"/>\
</svg>';

/* ---------------- user + product helpers ---------------- */
const getUserVerificationStatus = async (uid) => {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() ? !!snap.data().isVerified : false;
  } catch (e) {
    console.error("getUserVerificationStatus error:", e);
    return false;
  }
};

const getProductDetails = async (pid) => {
  if (!pid) return null;
  if (productDetails.value[pid]) return productDetails.value[pid];
  try {
    const snap = await getDoc(doc(db, "products", pid));
    if (snap.exists()) {
      productDetails.value[pid] = snap.data();
      return snap.data();
    }
  } catch (e) {
    console.error("getProductDetails error:", e);
  }
  return null;
};

/* --- NEW: load renter profile (for imageUrl) --- */
const loadRenterProfile = async (uid) => {
  if (!uid) return;
  if (renterProfiles.value[uid]) return; // cached

  try {
    const snap = await getDoc(doc(db, "users", uid));
    if (snap.exists()) {
      const data = snap.data();
      renterProfiles.value[uid] = {
        imageUrl: data.imageUrl || data.photoURL || "",
        displayName: data.displayName || "",
      };
    } else {
      renterProfiles.value[uid] = { imageUrl: "", displayName: "" };
    }
  } catch (e) {
    console.error("loadRenterProfile error:", e);
    renterProfiles.value[uid] = { imageUrl: "", displayName: "" };
  }
};

/* ---------------- computed (inject user image) ---------------- */
const bookingsWithContactInfo = computed(() => {
  if (!userId.value || !bookings.value) return [];
  const sellerBookings = bookings.value.filter((b) => b.sellerId === userId.value);
  const withRenterInfo = sellerBookings.filter(
    (b) =>
      b.userName &&
      b.phoneNumber &&
      ["pending", "active", "completed", "rejected"].includes(b.status)
  );
  const visible = withRenterInfo.filter((b) => b.hiddenForSeller !== true);

  return visible.map((b) => {
    const profile = renterProfiles.value[b.userId] || {};
    return {
      ...b,
      userVerificationStatus: userVerificationStatuses.value[b.userId] || false,
      /* Prefer booking.userImage, then profile.imageUrl, then default */
      userImage: b.userImage || profile.imageUrl || "",
    };
  });
});

/* ---------------- bulk loaders ---------------- */
const loadUserVerificationStatuses = async () => {
  if (!bookings.value) return;
  const uids = [...new Set(bookings.value.map((b) => b.userId).filter(Boolean))];
  for (const uid of uids) {
    if (!userVerificationStatuses.value[uid]) {
      userVerificationStatuses.value[uid] = await getUserVerificationStatus(uid);
    }
  }
};

const loadProductDetailsAll = async () => {
  if (!bookings.value) return;
  const pids = [...new Set(bookings.value.map((b) => b.productId).filter(Boolean))];
  for (const pid of pids) {
    if (!productDetails.value[pid]) await getProductDetails(pid);
  }
};

/* --- NEW: bulk load renter images for cards --- */
const loadRenterProfilesAll = async () => {
  if (!bookings.value) return;
  const uids = [...new Set(bookings.value.map((b) => b.userId).filter(Boolean))];
  await Promise.all(uids.map((uid) => loadRenterProfile(uid)));
};

/* ---------------- utilities (kept from your version) ---------------- */
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return isNaN(d) ? "" : d.toLocaleDateString();
};

const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "text-yellow-600";
    case "active":
      return "text-green-600";
    case "completed":
      return "text-blue-600";
    case "cancelled":
    case "rejected":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

const calculateSubtotal = (booking) => {
  if (!booking.startDate || !booking.endDate) return 0;
  const start = new Date(booking.startDate);
  const end = new Date(booking.endDate);
  const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  let pricePerDay = booking.productPrice || booking.price || booking.dailyPrice || 0;
  if (
    (!pricePerDay || pricePerDay <= 0) &&
    booking.productId &&
    productDetails.value[booking.productId]
  ) {
    pricePerDay = productDetails.value[booking.productId].price || 0;
  }
  if (!pricePerDay || pricePerDay <= 0) pricePerDay = 50;

  return diffDays * pricePerDay;
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const calculateDeliveryFee = (booking) => {
  if (booking.deliveryMethod === "pickup") return 0;

  if (booking.deliveryMethod === "delivery") {
    if (
      booking.renterLat &&
      booking.renterLng &&
      booking.lenderLat &&
      booking.lenderLng
    ) {
      const distance = calculateDistance(
        booking.lenderLat,
        booking.lenderLng,
        booking.renterLat,
        booking.renterLng
      );
      const base = 25;
      const distanceFee = Math.min(distance * 5, 200);
      return base + distanceFee;
    }
    const address = (booking.deliveryAddress || "").toLowerCase();
    const base = 25;
    let df = 0;
    if (address.includes("cairo") || address.includes("القاهرة")) df = 15;
    else if (address.includes("giza") || address.includes("الجيزة")) df = 25;
    else if (address.includes("alexandria") || address.includes("الإسكندرية")) df = 80;
    else if (address.includes("sharm") || address.includes("شرم")) df = 150;
    else if (address.includes("hurghada") || address.includes("الغردقة")) df = 120;
    else df = 35;
    return base + df;
  }
  return 0;
};

const calculateTotalPrice = async (booking) => {
  if (booking.totalPrice && booking.totalPrice > 0)
    return parseFloat(booking.totalPrice).toFixed(2);
  const subtotal = calculateSubtotal(booking);
  const deliveryFee = calculateDeliveryFee(booking);
  const serviceFee = 5;
  return (subtotal + deliveryFee + serviceFee).toFixed(2);
};

const getTotalPrice = (booking) => {
  if (calculatedPrices.value[booking.id]) return calculatedPrices.value[booking.id];
  if (booking.totalPrice && booking.totalPrice > 0)
    return parseFloat(booking.totalPrice).toFixed(2);

  const subtotal = calculateSubtotal(booking);
  const deliveryFee = calculateDeliveryFee(booking);
  const serviceFee = 5;
  const total = (subtotal + deliveryFee + serviceFee).toFixed(2);
  calculatedPrices.value[booking.id] = total;
  calculateTotalPrice(booking).then((v) => (calculatedPrices.value[booking.id] = v));
  return total;
};

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    showToast(t("contactInfoCopied"), "success");
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    showToast(t("contactInfoCopied"), "success");
  }
};

const copyAllContactInfo = (b) => {
  const lines = [
    `Renter Name: ${b.userName || ""}`,
    `Phone: ${b.phoneNumber || ""}`,
    `Email: ${b.userEmail || ""}`,
    `Product: ${b.productTitle || ""}`,
    `Rental Period: ${formatDate(b.startDate)} - ${formatDate(b.endDate)}`,
    `Total Price: ${t("egp")} ${getTotalPrice(b)}`,
    `Delivery Method: ${b.deliveryMethod || ""}`,
  ].filter((x) => x.split(": ")[1]);
  copyToClipboard(lines.join("\n"));
};

const getDirections = (address) => {
  window.open(
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`,
    "_blank"
  );
};

const showToast = (message, type = "success") => {
  const event = new CustomEvent("show-toast", { detail: { message, type } });
  window.dispatchEvent(event);
};

/* messaging / calls / delete kept as-is */
const messageUser = async (uid, name, productId = null, productTitle = null) => {
  try {
    if (!auth.currentUser) {
      return Swal.fire({
        icon: "warning",
        title: "Authentication Required",
        text: "Please log in to send messages.",
      });
    }
    if (uid === auth.currentUser.uid) {
      return Swal.fire({
        icon: "warning",
        title: "Cannot Message Yourself",
        text: "You cannot send a message to yourself.",
      });
    }
    const confirm = await Swal.fire({
      title: "Start Conversation?",
      text: `Do you want to start a conversation with ${name}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Start Chat",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });
    if (!confirm.isConfirmed) return;

    Swal.fire({
      title: "Creating Chat...",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading(),
    });

    const chatsRef = collection(db, "user-chats");
    const q = query(
      chatsRef,
      where("participants", "array-contains", auth.currentUser.uid)
    );
    const existing = await getDocs(q);
    let room = null;
    existing.forEach((d) => {
      const data = d.data();
      if (data.participants.includes(uid)) room = { id: d.id, ...data };
    });

    let roomId = room?.id;
    if (!roomId) {
      const newRoom = await addDoc(chatsRef, {
        participants: [auth.currentUser.uid, uid],
        createdAt: serverTimestamp(),
        lastMessage: null,
        lastMessageTime: null,
        productId,
        productTitle,
      });
      roomId = newRoom.id;
    }

    localStorage.setItem(
      "selectedConversation",
      JSON.stringify({
        id: roomId,
        otherUserId: uid,
        otherUserName: name,
        productId,
        productTitle,
        timestamp: Date.now(),
      })
    );

    Swal.close();
    router.push("/messages");
    Swal.fire({
      icon: "success",
      title: "Chat Started",
      text: `Opening chat with ${name}`,
      timer: 2000,
      showConfirmButton: false,
      position: "top-end",
    });
  } catch (e) {
    console.error("create chat error:", e);
    Swal.close();
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to start chat. Please try again.",
    });
  }
};

const callContact = (phone) => {
  if (!phone)
    return Swal.fire({
      icon: "warning",
      title: "No Phone Number",
      text: "This contact does not have a phone number available.",
    });
  Swal.fire({
    title: "Make Phone Call?",
    text: `Do you want to call ${phone}?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, Call",
    cancelButtonText: "Cancel",
    reverseButtons: true,
  }).then((r) => {
    if (r.isConfirmed) window.open(`tel:${phone}`, "_self");
  });
};

const deleteContactDetails = async (bookingId) => {
  const confirm = await Swal.fire({
    title: "Delete Contact Details?",
    text:
      "Are you sure you want to delete this contact details entry? This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Delete",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    reverseButtons: true,
  });
  if (!confirm.isConfirmed) return;

  Swal.fire({
    title: "Deleting...",
    allowOutsideClick: false,
    showConfirmButton: false,
    didOpen: () => Swal.showLoading(),
  });
  await updateDoc(doc(db, "bookings", bookingId), { hiddenForSeller: true });
  Swal.close();
  Swal.fire({
    icon: "success",
    title: "Deleted Successfully",
    text: "Contact details entry has been removed",
    timer: 2000,
    showConfirmButton: false,
    position: "top-end",
  });
};

/* permissions + status updates (kept) */
const validateBookingData = (b, currentUid) => {
  const errors = [];
  if (!b) errors.push("Booking data is missing");
  if (!b?.status) errors.push("Booking status is missing");
  if (!b?.sellerId && !b?.userId)
    errors.push("Booking does not have valid user information");
  const isSeller = b?.sellerId === currentUid;
  const isRenter = b?.userId === currentUid;
  if (!isSeller && !isRenter)
    errors.push("You do not have permission to update this booking");
  return errors;
};

const checkFirebaseConnectivity = async () => {
  try {
    await getDoc(doc(db, "bookings", "test-connection"));
    return true;
  } catch {
    return false;
  }
};

const updateRentalStatus = async (bookingId, newStatus, updatedBy, retryCount = 0) => {
  const maxRetries = 3;
  try {
    if (!auth.currentUser) {
      return Swal.fire({
        icon: "error",
        title: "Authentication Required",
        text: "Please log in to update rental status.",
      });
    }
    if (!bookingId || !newStatus || !updatedBy) {
      return Swal.fire({
        icon: "error",
        title: "Invalid Parameters",
        text: "Missing required information for status update.",
      });
    }
    if (!navigator.onLine) {
      return Swal.fire({
        icon: "error",
        title: "No Internet Connection",
        text: "Please check your internet connection and try again.",
      });
    }
    if (retryCount === 0) {
      const ok = await checkFirebaseConnectivity();
      if (!ok)
        return Swal.fire({
          icon: "error",
          title: "Service Unavailable",
          text: "Unable to connect to the service. Please try again later.",
        });
    }
    if (retryCount === 0) {
      const ask = await Swal.fire({
        title: "Confirm Status Change?",
        text: `Are you sure you want to change the status to "${t(newStatus)}"?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, Change Status",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      });
      if (!ask.isConfirmed) return;
    }

    Swal.fire({
      title: retryCount ? "Retrying Update..." : "Updating...",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading(),
    });

    const ref = doc(db, "bookings", bookingId);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      Swal.close();
      return Swal.fire({
        icon: "error",
        title: "Booking Not Found",
        text: "The booking you are trying to update does not exist.",
      });
    }

    const data = snap.data();
    const currentUid = auth.currentUser.uid;
    const errs = validateBookingData(data, currentUid);
    if (errs.length) {
      Swal.close();
      return Swal.fire({
        icon: "error",
        title: "Invalid Booking Data",
        text: errs.join(". "),
      });
    }

    const isSeller = data.sellerId === currentUid;
    const isRenter = data.userId === currentUid;
    if (!isSeller && !isRenter) {
      Swal.close();
      return Swal.fire({
        icon: "error",
        title: "Permission Denied",
        text: "You do not have permission to update this rental status.",
      });
    }

    const valid = {
      pending: ["active", "rejected"],
      active: ["completed"],
      rejected: ["pending"],
      completed: [],
    };
    if (!valid[data.status]?.includes(newStatus)) {
      Swal.close();
      return Swal.fire({
        icon: "error",
        title: "Invalid Status Transition",
        text: `Cannot change status from "${t(data.status)}" to "${t(newStatus)}".`,
      });
    }

    const newHistory = [
      ...(data.statusHistory || []),
      {
        status: newStatus,
        timestamp: serverTimestamp(),
        updatedBy,
        updatedByUserId: currentUid,
        previousStatus: data.status,
        reason: `Status changed from ${data.status} to ${newStatus}`,
        retryCount,
      },
    ];

    await updateDoc(ref, {
      status: newStatus,
      statusHistory: newHistory,
      lastUpdated: serverTimestamp(),
      lastUpdatedBy: currentUid,
    });

    Swal.close();
    Swal.fire({
      icon: "success",
      title: "Status Updated Successfully",
      text: `Rental status changed to ${t(newStatus)}`,
      timer: 2000,
      showConfirmButton: false,
      position: "top-end",
    });
  } catch (error) {
    Swal.close();
    if (
      retryCount < 3 &&
      (/unavailable|deadline-exceeded/i.test(error.code || "") ||
        /network|timeout/i.test(error.message || ""))
    ) {
      await new Promise((r) => setTimeout(r, Math.pow(2, retryCount) * 1000));
      return updateRentalStatus(bookingId, newStatus, updatedBy, retryCount + 1);
    }
    Swal.fire({
      icon: "error",
      title: "Update Failed",
      text: error?.message || "Failed to update rental status.",
    });
  }
};

const isCurrentUserSeller = (b) => b.sellerId === userId.value;
const isCurrentUserRenter = (b) => b.userId === userId.value;

/* ---------------- watchers & init ---------------- */
watch(
  bookings,
  async (list) => {
    if (!list || !userId.value) return;
    await Promise.all([
      loadRenterProfilesAll(),
      loadUserVerificationStatuses(),
      loadProductDetailsAll(),
    ]);
  },
  { immediate: true }
);

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      userId.value = user.uid;
      await Promise.all([
        loadRenterProfilesAll(),
        loadUserVerificationStatuses(),
        loadProductDetailsAll(),
      ]);
    }
  });
});
</script>
