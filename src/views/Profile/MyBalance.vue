<template>
  <div class="container mx-auto p-4">
    <h1
      class="text-2xl text-[var(--Color-Text-Text-Primary)] font-medium dark:text-[var(--Color-Text-Text-Primary)] mb-4"
    >
      {{ $t("balanceOverview") }}
    </h1>

    <!-- User Information -->
    <div
      class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-lg p-6 mb-6"
    >
      <h2 class="text-xl font-semibold text-[var(--Color-Text-Text-Primary)] mb-4">
        {{ $t("userInformation") }}
      </h2>
      <div class="flex items-center space-x-4 mb-4">
        <img
          :src="userData.imageUrl || '/src/assets/default.png'"
          alt="User Profile"
          class="w-16 h-16 rounded-full object-cover border-2 border-[var(--Color-Boarder-Border-Primary)]"
        />
        <div>
          <h3 class="text-lg font-medium text-[var(--Color-Text-Text-Primary)]">
            {{ userData.displayName || "User" }}
          </h3>
          <p class="text-[var(--Color-Text-Text-Secondary)]">
            {{ userData.email || "No email" }}
          </p>
          <p class="text-[var(--Color-Text-Text-Secondary)]">
            {{ userData.phone || "No phone" }}
          </p>
        </div>
      </div>
    </div>

    <!-- Balance Summary -->
    <div
      class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 text-[var(--Color-Text-Text-Primary)] dark:text-[var(--Color-Text-Text-Primary)]"
    >
      <div>
        <label>Total Income</label>
        <input
          class="w-full p-2 border rounded-lg bg-[var(--Color-Surface-Surface-Primary)] border-[var(--Color-Boarder-Border-Primary)] focus:outline-none"
          :value="`EGP ${totalIncome.toFixed(2)}`"
          readonly
        />
      </div>
      <div>
        <label>Total Service Fee (Our Profit)</label>
        <input
          class="w-full p-2 border rounded-lg bg-[var(--Color-Surface-Surface-Primary)] border-[var(--Color-Boarder-Border-Primary)] focus:outline-none"
          :value="`EGP ${totalServiceFee.toFixed(2)}`"
          readonly
        />
      </div>
      <div>
        <label>Total Profit (You)</label>
        <input
          class="w-full p-2 border rounded-lg bg-[var(--Color-Surface-Surface-Primary)] border-[var(--Color-Boarder-Border-Primary)] focus:outline-none"
          :value="`EGP ${totalProfit.toFixed(2)}`"
          readonly
        />
      </div>
      <div>
        <label>Total Withdrawn</label>
        <input
          class="w-full p-2 border rounded-lg bg-[var(--Color-Surface-Surface-Primary)] border-[var(--Color-Boarder-Border-Primary)] focus:outline-none"
          :value="`EGP ${totalWithdrawn.toFixed(2)}`"
          readonly
        />
      </div>
      <div>
        <label>Available Balance</label>
        <input
          class="w-full p-2 border rounded-lg bg-[var(--Color-Surface-Surface-Primary)] border-[var(--Color-Boarder-Border-Primary)] focus:outline-none"
          :value="`EGP ${remainingBalance.toFixed(2)}`"
          readonly
        />
      </div>
    </div>

    <!-- Withdrawal Section -->
    <div
      class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-lg p-6 mb-6"
    >
      <h2 class="text-xl font-semibold text-[var(--Color-Text-Text-Primary)] mb-4">
        {{ $t("withdrawal") }}
      </h2>

      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <div class="flex items-center">
          <svg
            class="w-5 h-5 text-yellow-600 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <span class="text-yellow-800 font-medium">{{ $t("testingEnvironment") }}</span>
        </div>
        <p class="text-yellow-700 mt-2 text-sm">{{ $t("testingEnvironmentDesc") }}</p>
      </div>

      <div class="mb-4">
        <label class="block text-[var(--Color-Text-Text-Primary)] font-medium mb-2">{{
          $t("availableBalance")
        }}</label>
        <div class="text-2xl font-bold text-[var(--Color-Text-Text-Brand)]">
          EGP {{ remainingBalance.toFixed(2) }}
        </div>
        <p class="text-sm text-[var(--Color-Text-Text-Secondary)] mt-1">
          {{ $t("withdrawableAmountDesc") }}
        </p>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-[var(--Color-Text-Text-Primary)] font-medium mb-2"
            >Withdrawal Amount</label
          >
          <input
            v-model="withdrawalAmount"
            type="number"
            min="0"
            :max="availableForWithdrawal"
            step="0.01"
            class="w-full p-3 border rounded-lg bg-[var(--Color-Surface-Surface-Primary)] border-[var(--Color-Boarder-Border-Primary)] focus:outline-none focus:ring-2 focus:ring-[var(--Color-Text-Text-Brand)]"
            placeholder="Enter amount to withdraw"
          />
        </div>

        <div>
          <label class="block text-[var(--Color-Text-Text-Primary)] font-medium mb-2"
            >Payment Method</label
          >
          <select
            v-model="selectedPaymentMethod"
            class="w-full p-3 border rounded-lg bg-[var(--Color-Surface-Surface-Primary)] border-[var(--Color-Boarder-Border-Primary)] focus:outline-none focus:ring-2 focus:ring-[var(--Color-Text-Text-Brand)]"
          >
            <option value="">Select payment method</option>
            <option value="vodafone_cash">Vodafone Cash</option>
            <option value="etisalat_cash">Etisalat Cash</option>
            <option value="bank_transfer">Credit Card</option>
            <option value="paypal">PayPal</option>
          </select>
        </div>

        <div
          v-if="
            selectedPaymentMethod === 'vodafone_cash' ||
            selectedPaymentMethod === 'etisalat_cash'
          "
        >
          <label class="block text-[var(--Color-Text-Text-Primary)] font-medium mb-2"
            >Phone Number</label
          >
          <input
            v-model="phoneNumber"
            type="tel"
            class="w-full p-3 border rounded-lg bg-[var(--Color-Surface-Surface-Primary)] border-[var(--Color-Boarder-Border-Primary)] focus:outline-none focus:ring-2 focus:ring-[var(--Color-Text-Text-Brand)]"
            placeholder="Enter phone number"
          />
        </div>

        <div v-if="selectedPaymentMethod === 'bank_transfer'">
          <label class="block text-[var(--Color-Text-Text-Primary)] font-medium mb-2"
            >Credit Card Details</label
          >

          <div class="mb-4">
            <label class="block text-sm text-[var(--Color-Text-Text-Secondary)] mb-1"
              >Card Number</label
            >
            <input
              v-model="cardNumber"
              type="text"
              maxlength="19"
              class="w-full p-3 border rounded-lg bg-[var(--Color-Surface-Surface-Primary)] border-[var(--Color-Boarder-Border-Primary)] focus:outline-none focus:ring-2 focus:ring-[var(--Color-Text-Text-Brand)]"
              placeholder="1234 5678 9012 3456"
              @input="formatCardNumber"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-[var(--Color-Text-Text-Secondary)] mb-1"
                >Expiry Date</label
              >
              <input
                v-model="cardExpiry"
                type="text"
                maxlength="5"
                class="w-full p-3 border rounded-lg bg-[var(--Color-Surface-Surface-Primary)] border-[var(--Color-Boarder-Border-Primary)] focus:outline-none focus:ring-2 focus:ring-[var(--Color-Text-Text-Brand)]"
                placeholder="MM/YY"
                @input="formatExpiryDate"
              />
            </div>
            <div>
              <label class="block text-sm text-[var(--Color-Text-Text-Secondary)] mb-1"
                >CVV</label
              >
              <input
                v-model="cardCvv"
                type="text"
                maxlength="4"
                class="w-full p-3 border rounded-lg bg-[var(--Color-Surface-Surface-Primary)] border-[var(--Color-Boarder-Border-Primary)] focus:outline-none focus:ring-2 focus:ring-[var(--Color-Text-Text-Brand)]"
                placeholder="123"
                @input="formatCvv"
              />
            </div>
          </div>
        </div>

        <div v-if="selectedPaymentMethod === 'paypal'">
          <label class="block text-[var(--Color-Text-Text-Primary)] font-medium mb-2"
            >PayPal Email</label
          >
          <input
            v-model="paypalEmail"
            type="email"
            class="w-full p-3 border rounded-lg bg-[var(--Color-Surface-Surface-Primary)] border-[var(--Color-Boarder-Border-Primary)] focus:outline-none focus:ring-2 focus:ring-[var(--Color-Text-Text-Brand)]"
            placeholder="Enter PayPal email"
          />
        </div>

        <div
          v-if="withdrawalAmount > 0"
          class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
        >
          <h3 class="font-medium text-[var(--Color-Text-Text-Primary)] mb-2">
            Withdrawal Summary
          </h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between border-t pt-2">
              <span class="text-[var(--Color-Text-Text-Primary)] font-medium"
                >Withdrawal Amount:</span
              >
              <span class="text-[var(--Color-Text-Text-Brand)] font-bold"
                >EGP {{ totalWithdrawalAmount.toFixed(2) }}</span
              >
            </div>
          </div>
        </div>

        <button
          @click="processWithdrawal"
          :disabled="!canWithdraw"
          class="w-full bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] py-3 px-6 rounded-lg font-semibold hover:bg-[var(--Color-Text-Text-Brand)] hover:text-white disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {{ withdrawButtonText }}
        </button>
      </div>
    </div>

    <!-- Withdrawal History -->
    <div
      class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-lg p-6"
    >
      <h2 class="text-xl font-semibold text-[var(--Color-Text-Text-Primary)] mb-4">
        {{ $t("withdrawalHistory") }}
      </h2>

      <div
        v-if="loadingWithdrawalHistory"
        class="text-center text-[var(--Color-Text-Text-Secondary)] py-8"
      >
        <svg
          class="animate-spin w-8 h-8 mx-auto mb-4 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p>Loading withdrawal history...</p>
      </div>

      <div
        v-else-if="withdrawalHistory.length === 0"
        class="text-center text-[var(--Color-Text-Text-Secondary)] py-8"
      >
        <svg
          class="w-12 h-12 mx-auto mb-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          ></path>
        </svg>
        <p>{{ $t("noWithdrawals") }}</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="transaction in withdrawalHistory"
          :key="transaction.id"
          class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
        >
          <div class="flex justify-between items-start mb-3">
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-2">
                <div
                  class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
                >
                  <svg
                    class="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900">
                    {{ formatPaymentMethod(transaction.paymentMethod) }}
                  </h3>
                  <p class="text-sm text-gray-500">
                    {{ formatDate(transaction.timestamp) }}
                  </p>
                </div>
              </div>
              <div class="text-sm text-gray-600">
                <p>
                  <span class="font-medium">Amount:</span> EGP
                  {{ transaction.amount.toFixed(2) }}
                </p>
                <p>
                  <span class="font-medium">Withdrawal Fee:</span> EGP
                  {{ (transaction.withdrawalFee || 0).toFixed(2) }}
                </p>
                <p>
                  <span class="font-medium">Date:</span>
                  {{ formatDate(transaction.timestamp) }}
                </p>
                <p>
                  <span class="font-medium">Method:</span>
                  {{ formatPaymentMethod(transaction.paymentMethod) }}
                </p>
                <p v-if="transaction.paymentDetails" class="text-xs text-gray-500 mt-1">
                  {{
                    maskPaymentDetails(
                      transaction.paymentDetails,
                      transaction.paymentMethod
                    )
                  }}
                </p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold text-green-600">
                EGP {{ transaction.amount.toFixed(2) }}
              </p>
              <span
                :class="[
                  'px-3 py-1 rounded-full text-xs font-semibold',
                  transaction.status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : transaction.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700',
                ]"
              >
                {{ transaction.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Listings (with correct images) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      <div
        v-for="item in items"
        :key="item.id"
        class="border p-4 rounded-lg bg-[var(--Color-Surface-Surface-Primary)] border-[var(--Color-Boarder-Border-Primary)]"
      >
        <img
          :src="item.img || placeholderImage"
          class="w-full h-40 object-cover mb-2"
          @error="(e) => (e.target.src = placeholderImage)"
        />
        <h2 class="text-[var(--Color-Text-Text-Primary)] font-medium">
          {{ item.title }}
        </h2>
        <p class="text-[var(--Color-Text-Text-Secondary)]">
          Price/Day: {{ item.pricePerDay }}
        </p>
        <p class="text-[var(--Color-Text-Text-Secondary)]">
          Service Fee: {{ item.serviceFee }}
        </p>
        <p class="text-[var(--Color-Text-Text-Secondary)]">
          Total Profit: {{ item.totalProfit }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { db } from "@/firebase/config";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  addDoc,
  serverTimestamp,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Swal from "sweetalert2";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/* ---------------- state ---------------- */
const items = ref([]);
const totalIncome = ref(0);
const totalServiceFee = ref(0);
const totalProfit = ref(0);
const totalWithdrawn = ref(0);
const remainingBalance = ref(0);
const userData = ref({});
const withdrawalHistory = ref([]);
const loadingWithdrawalHistory = ref(false);

/* ---------------- withdrawal form ---------------- */
const withdrawalAmount = ref(0);
const selectedPaymentMethod = ref("");
const phoneNumber = ref("");
const cardNumber = ref("");
const cardExpiry = ref("");
const cardCvv = ref("");
const paypalEmail = ref("");

/* ---------------- constants/helpers ---------------- */
const withdrawalServiceFeeRate = 0.15;
const placeholderImage = "/placeholder.png";

/** productId -> { image?: string } */
const productMeta = ref({});

const firstImageOf = (p = {}) => {
  if (typeof p.image1 === "string" && p.image1.startsWith("data:image")) return p.image1;
  return p.image1Path || (Array.isArray(p.images) && p.images[0]) || p.imageUrl || "";
};

const getProductImage = async (productId) => {
  if (!productId) return "";
  const cached = productMeta.value[productId];
  if (cached && "image" in cached) return cached.image || "";

  try {
    const pRef = doc(db, "products", productId);
    const pSnap = await getDoc(pRef);
    const image = pSnap.exists() ? firstImageOf(pSnap.data()) : "";
    productMeta.value[productId] = { ...(cached || {}), image };
    return image || "";
  } catch (e) {
    console.error("load product image failed:", e);
    productMeta.value[productId] = { ...(cached || {}), image: "" };
    return "";
  }
};

/* ---------------- computed ---------------- */
const withdrawableAmount = computed(() => remainingBalance.value);
const availableForWithdrawal = computed(() => remainingBalance.value);
const totalWithdrawalAmount = computed(() => parseFloat(withdrawalAmount.value) || 0);

const canWithdraw = computed(() => {
  const hasValidAmount =
    totalWithdrawalAmount.value > 0 &&
    totalWithdrawalAmount.value <= remainingBalance.value;
  if (!hasValidAmount || !selectedPaymentMethod.value) return false;

  switch (selectedPaymentMethod.value) {
    case "vodafone_cash":
    case "etisalat_cash":
      return !!phoneNumber.value.trim();
    case "bank_transfer":
      return (
        cardNumber.value.replace(/\s/g, "").length === 16 &&
        cardExpiry.value.length === 5 &&
        cardCvv.value.length >= 3
      );
    case "paypal":
      return !!paypalEmail.value.trim();
    default:
      return false;
  }
});

const withdrawButtonText = computed(() => {
  if (!withdrawalAmount.value) return "Enter withdrawal amount";
  if (withdrawalAmount.value > remainingBalance.value)
    return "Amount exceeds available balance";
  if (!selectedPaymentMethod.value) return "Select payment method";
  switch (selectedPaymentMethod.value) {
    case "vodafone_cash":
    case "etisalat_cash":
      if (!phoneNumber.value.trim()) return "Enter phone number";
      break;
    case "bank_transfer":
      if (cardNumber.value.replace(/\s/g, "").length !== 16)
        return "Enter valid card number (16 digits)";
      if (cardExpiry.value.length !== 5) return "Enter valid expiry date (MM/YY)";
      if (cardCvv.value.length < 3) return "Enter valid CVV (3-4 digits)";
      break;
    case "paypal":
      if (!paypalEmail.value.trim()) return "Enter PayPal email";
      break;
  }
  return "Process Withdrawal";
});

/* ---------------- format/mask helpers ---------------- */
const formatDate = (timestamp) => {
  if (!timestamp) return "";
  let date;
  if (timestamp?.toDate) date = timestamp.toDate();
  else if (timestamp?.seconds) date = new Date(timestamp.seconds * 1000);
  else if (typeof timestamp === "string") date = new Date(timestamp);
  else date = new Date(timestamp);
  if (isNaN(date.getTime())) return "Invalid Date";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
const formatPaymentMethod = (m) =>
  ({
    vodafone_cash: "Vodafone Cash",
    etisalat_cash: "Etisalat Cash",
    bank_transfer: "Credit Card",
    paypal: "PayPal",
  }[m] || m);

const formatCardNumber = (e) => {
  let v = e.target.value.replace(/\s/g, "").replace(/[^0-9]/g, "");
  if (v.length > 16) v = v.slice(0, 16);
  cardNumber.value = v.replace(/(\d{4})(?=\d)/g, "$1 ");
};
const formatExpiryDate = (e) => {
  let v = e.target.value.replace(/\s/g, "").replace(/[^0-9]/g, "");
  if (v.length > 4) v = v.slice(0, 4);
  if (v.length >= 2) v = v.slice(0, 2) + "/" + v.slice(2);
  cardExpiry.value = v;
};
const formatCvv = (e) => {
  let v = e.target.value.replace(/\s/g, "").replace(/[^0-9]/g, "");
  if (v.length > 4) v = v.slice(0, 4);
  cardCvv.value = v;
};
const maskCardNumber = (n) => {
  const c = n.replace(/\s/g, "");
  if (c.length < 4) return c;
  return c.slice(0, 4) + " **** **** " + c.slice(-4);
};
const maskPaymentDetails = (txt, method) => {
  if (!txt) return "";
  if (method === "bank_transfer") {
    const m = txt.match(/Card: (\d{4})\s\*\*\*\*\s\*\*\*\*\s(\d{4})/);
    if (m) return `Card: ${m[1]} **** **** ${m[2]} | Expiry: **/** | CVV: ***`;
    const m2 = txt.match(/Card: (\d{16})/);
    if (m2)
      return `Card: ${m2[1].slice(0, 4)} **** **** ${m2[1].slice(
        -4
      )} | Expiry: **/** | CVV: ***`;
  }
  return txt;
};
const getPaymentDetails = () => {
  switch (selectedPaymentMethod.value) {
    case "vodafone_cash":
    case "etisalat_cash":
      return `Phone: ${phoneNumber.value}`;
    case "bank_transfer":
      return `Card: ${maskCardNumber(cardNumber.value)} | Expiry: ${
        cardExpiry.value
      } | CVV: ***`;
    case "paypal":
      return `Email: ${paypalEmail.value}`;
    default:
      return "";
  }
};

/* ---------------- firestore loaders ---------------- */
const loadUserData = async (uid) => {
  try {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    if (snap.exists()) userData.value = { uid, ...snap.data() };
  } catch (e) {
    console.error("loadUserData error:", e);
  }
};

const loadWithdrawalHistory = async (uid) => {
  try {
    loadingWithdrawalHistory.value = true;
    const withdrawalsRef = collection(db, "withdrawalHistory");
    const q = query(withdrawalsRef, where("userId", "==", uid));
    const initial = await getDocs(q);

    withdrawalHistory.value = initial.docs
      .sort((a, b) => {
        const at = a.data().timestamp?.toDate?.() || a.data().timestamp || new Date(0);
        const bt = b.data().timestamp?.toDate?.() || b.data().timestamp || new Date(0);
        return bt - at;
      })
      .map((d) => {
        const x = d.data();
        return {
          id: d.id,
          amount: parseFloat(x.amount) || 0,
          paymentMethod: x.paymentMethod || "",
          paymentDetails: x.paymentDetails || "",
          status: x.status || "pending",
          timestamp: x.timestamp || x.submittedAt || new Date(),
          withdrawalFee: parseFloat(x.withdrawalFee) || 0,
          totalAmount: parseFloat(x.totalAmount) || parseFloat(x.amount) || 0,
          userDisplayName: x.userDisplayName || "",
          userEmail: x.userEmail || "",
          userPhone: x.userPhone || "",
          userId: x.userId || "",
        };
      });

    // realtime updates
    const unsub = onSnapshot(
      q,
      (snap) => {
        withdrawalHistory.value = snap.docs
          .sort((a, b) => {
            const at =
              a.data().timestamp?.toDate?.() || a.data().timestamp || new Date(0);
            const bt =
              b.data().timestamp?.toDate?.() || b.data().timestamp || new Date(0);
            return bt - at;
          })
          .map((d) => {
            const x = d.data();
            return {
              id: d.id,
              amount: parseFloat(x.amount) || 0,
              paymentMethod: x.paymentMethod || "",
              paymentDetails: x.paymentDetails || "",
              status: x.status || "pending",
              timestamp: x.timestamp || x.submittedAt || new Date(),
              withdrawalFee: parseFloat(x.withdrawalFee) || 0,
              totalAmount: parseFloat(x.totalAmount) || parseFloat(x.amount) || 0,
              userDisplayName: x.userDisplayName || "",
              userEmail: x.userEmail || "",
              userPhone: x.userPhone || "",
              userId: x.userId || "",
            };
          });
      },
      (err) => console.error("withdrawal listener error:", err)
    );
    window.withdrawalHistoryUnsubscribe = unsub;
  } catch (e) {
    console.error("loadWithdrawalHistory error:", e);
  } finally {
    loadingWithdrawalHistory.value = false;
  }
};

/* ---------------- actions ---------------- */
const processWithdrawal = async () => {
  if (!canWithdraw.value) {
    return Swal.fire({
      icon: "warning",
      title: "Invalid Withdrawal",
      text: "Please check your withdrawal details and try again.",
    });
  }
  try {
    const withdrawalData = {
      userId: userData.value.uid,
      amount: parseFloat(withdrawalAmount.value),
      totalAmount: totalWithdrawalAmount.value,
      withdrawalFee: parseFloat(withdrawalAmount.value) * withdrawalServiceFeeRate,
      paymentMethod: selectedPaymentMethod.value,
      paymentDetails: getPaymentDetails(),
      status: "pending",
      timestamp: serverTimestamp(),
      submittedAt: serverTimestamp(),
      userDisplayName: userData.value.displayName || "Unknown User",
      userEmail: userData.value.email || "",
      userPhone: userData.value.phone || "",
    };

    const ref = await addDoc(collection(db, "withdrawalHistory"), withdrawalData);

    withdrawalHistory.value.unshift({
      id: ref.id,
      ...withdrawalData,
      timestamp: new Date(),
    });

    totalWithdrawn.value += parseFloat(withdrawalAmount.value);
    const calculatedRemaining = totalProfit.value - totalWithdrawn.value;
    remainingBalance.value = calculatedRemaining * (1 - withdrawalServiceFeeRate);

    const ubRef = doc(db, "userbalance", userData.value.uid);
    await setDoc(
      ubRef,
      {
        userid: userData.value.uid,
        balance: totalIncome.value,
        profit: totalProfit.value,
        serviceFee: totalServiceFee.value,
        totalWithdrawn: totalWithdrawn.value,
        remainingBalance: remainingBalance.value,
        ...userData.value,
      },
      { merge: true }
    );

    const profitRef = doc(db, "ourprofite", userData.value.uid);
    await setDoc(
      profitRef,
      {
        balance: totalServiceFee.value,
        sellersProfit: totalProfit.value,
        totalWithdrawn: totalWithdrawn.value,
        remainingBalance: remainingBalance.value,
      },
      { merge: true }
    );

    // reset form
    withdrawalAmount.value = 0;
    selectedPaymentMethod.value = "";
    phoneNumber.value = "";
    cardNumber.value = "";
    cardExpiry.value = "";
    cardCvv.value = "";
    paypalEmail.value = "";

    Swal.fire({
      icon: "success",
      title: "Withdrawal Request Submitted",
      text: "Your request has been submitted successfully.",
      timer: 3000,
      showConfirmButton: false,
    });
  } catch (e) {
    console.error("processWithdrawal error:", e);
    Swal.fire({
      icon: "error",
      title: "Withdrawal Failed",
      text: "There was an error processing your withdrawal. Please try again.",
    });
  }
};

/* ---------------- lifecycle ---------------- */
onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, async (user) => {
    if (!user) return;
    const currentUserId = user.uid;

    await loadUserData(currentUserId);
    await loadWithdrawalHistory(currentUserId);

    // Load bookings and build items with product images
    const bookingsSnap = await getDocs(collection(db, "bookings"));
    const rows = [];
    let income = 0,
      feeSum = 0,
      profitSum = 0;

    await Promise.all(
      bookingsSnap.docs.map(async (d) => {
        const b = d.data();
        const sellerId = b.sellerId || b.userId || "unknown";
        if (sellerId !== currentUserId) return;

        const price = Number(b.productPrice ?? 0);
        const fee = Number(b.deliveryFee ?? 0);
        const sellerProfit = price - fee;

        const img = b.productImage || (await getProductImage(b.productId)) || "";

        rows.push({
          id: d.id,
          img,
          title: b.productTitle,
          pricePerDay: `EGP ${price.toFixed(2)}`,
          serviceFee: `EGP ${fee.toFixed(2)}`,
          totalProfit: `EGP ${sellerProfit.toFixed(2)}`,
        });

        income += price;
        feeSum += fee;
        profitSum += sellerProfit;
      })
    );

    items.value = rows;
    totalIncome.value = income;
    totalServiceFee.value = feeSum;
    totalProfit.value = profitSum;

    // Load or init balance
    const ubRef = doc(db, "userbalance", currentUserId);
    const ubSnap = await getDoc(ubRef);
    if (ubSnap.exists()) {
      const bal = ubSnap.data();
      totalWithdrawn.value = bal.totalWithdrawn || 0;
      const calculatedRemaining = totalProfit.value - totalWithdrawn.value;
      remainingBalance.value = calculatedRemaining * (1 - withdrawalServiceFeeRate);
    } else {
      totalWithdrawn.value = 0;
      remainingBalance.value = totalProfit.value * (1 - withdrawalServiceFeeRate);
    }

    // Persist balances
    await setDoc(
      ubRef,
      {
        userid: currentUserId,
        balance: totalIncome.value,
        profit: totalProfit.value,
        serviceFee: totalServiceFee.value,
        totalWithdrawn: totalWithdrawn.value,
        remainingBalance: remainingBalance.value,
        ...userData.value,
      },
      { merge: true }
    );

    const profitRef = doc(db, "ourprofite", currentUserId);
    await setDoc(
      profitRef,
      {
        balance: totalServiceFee.value,
        sellersProfit: totalProfit.value,
        totalWithdrawn: totalWithdrawn.value,
        remainingBalance: remainingBalance.value,
      },
      { merge: true }
    );
  });
});

onBeforeUnmount(() => {
  if (window.withdrawalHistoryUnsubscribe) {
    window.withdrawalHistoryUnsubscribe();
  }
});
</script>
