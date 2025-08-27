<template>
  <div class="max-w-6xl mx-auto py-10 px-4">
    <!-- Header -->
    <div class="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <p class="text-xl md:text-2xl font-medium text-[var(--Color-Text-Text-Primary)]">
        {{ $t("Your Rentals") }}
      </p>
      <div class="relative w-full md:w-auto">
        <i
          class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[var(--Color-Text-Text-Brand)] w-5 h-5 pointer-events-none"
        ></i>
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="$t('searchByTitle')"
          class="w-full md:w-[500px] pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--Color-Text-Text-Brand)] text-base text-[var(--Color-Text-Text-Primary)] placeholder-[var(--Color-Text-Text-Secondary)] bg-[var(--Color-Surface-Surface-Primary)] border-[var(--Color-Boarder-Border-Primary)]"
        />
      </div>
    </div>

    <!-- Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="b in filteredProducts"
        :key="b.id"
        class="border rounded-lg p-4 bg-[var(--Color-Surface-Surface-Primary)] border-[var(--Color-Boarder-Border-Primary)] text-[var(--Color-Text-Text-Primary)]"
      >
        <!-- IMAGE -->
        <img
          :key="
            b.productId + ':' + (resolvedImage(b) || placeholderImage) + ':' + metaVersion
          "
          :src="resolvedImage(b) || placeholderImage"
          :alt="b.productTitle || 'Product'"
          class="w-full h-48 object-cover rounded-lg mb-3"
        />

        <h2 class="text-lg font-semibold mb-1">{{ b.productTitle }}</h2>

        <p class="text-sm text-[var(--Color-Text-Text-Secondary)] mb-2">
          {{ $t("Return in") }}:
          <span
            class="font-medium"
            :class="{
              'text-[var(--Colors-Error-400)]': remain(b.endDate) === 'Expired',
              'text-[var(--Color-Text-Text-Brand)]': remain(b.endDate) !== 'Expired',
            }"
          >
            {{ remain(b.endDate) }}
          </span>
        </p>

        <!-- Completed ribbon: ONLY when both confirmed -->
        <div
          v-if="b.status === 'completed' && b.renterConfirmed && b.sellerConfirmed"
          class="mb-3 p-3 rounded-lg border bg-green-50 border-green-200 text-green-800 text-sm"
        >
          <div class="flex items-center gap-2">
            <i class="fas fa-badge-check"></i>
            <span class="font-semibold">Both confirmed — Rental completed.</span>
          </div>
          <div class="mt-1 text-xs">
            Final penalty:
            <strong v-if="(b.penaltyPercentage || 0) === 0">Waived (0%)</strong>
            <strong v-else
              >{{ b.penaltyPercentage }}% (EGP
              {{ formatPrice((getPrice(b) * (b.penaltyPercentage || 0)) / 100) }})</strong
            >
          </div>
        </div>

        <!-- 🔴 Expired warning: show for ANY status except completed -->
        <div
          v-if="remain(b.endDate) === 'Expired' && b.status !== 'completed'"
          class="mb-3 p-3 bg-red-50 rounded-lg border border-red-100"
        >
          <div class="flex items-center text-red-600 mb-1">
            <i class="fas fa-exclamation-triangle mr-2"></i>
            <span class="font-medium">Rental Expired</span>
          </div>

          <div class="text-xs space-y-2">
            <div v-if="b.hoursExpired <= 48" class="text-yellow-700">
              <i class="fas fa-clock mr-1"></i>
              {{ b.hoursExpired }} hour(s) overdue –
              <strong>EGP {{ calcPenalty(getPrice(b), 30) }}</strong>
              (30%) penalty will apply in {{ Math.max(0, 48 - b.hoursExpired) }} hour(s)
              <div class="mt-1">
                <span class="font-medium">Actual Price:</span> EGP
                {{ formatPrice(getPrice(b)) }}
              </div>
            </div>

            <div v-else-if="b.hoursExpired <= 96" class="text-orange-600">
              <i class="fas fa-exclamation-circle mr-1"></i>
              30% penalty (<strong>EGP {{ calcPenalty(getPrice(b), 30) }}</strong
              >) applied – Additional
              <strong>EGP {{ calcPenalty(getPrice(b), 20) }}</strong> (20%) in
              {{ Math.max(0, 96 - b.hoursExpired) }} hour(s)
              <div class="text-xs mt-1">
                <span class="font-medium">Total potential penalty:</span>
                EGP {{ calcPenalty(getPrice(b), 50) }} (50%)
              </div>
            </div>

            <div v-else class="text-red-700 font-semibold">
              <i class="fas fa-gavel mr-1"></i>
              Total 50% penalty (<strong>EGP {{ calcPenalty(getPrice(b), 50) }}</strong
              >) applied – Legal action may be taken
            </div>

            <!-- If seller confirmed after expiry and we capped/adjusted -->
            <div
              v-if="b.sellerConfirmed && b.penaltyAdjustedOnSellerConfirm"
              class="p-2 rounded bg-green-50 border border-green-200 text-green-700 text-xs"
            >
              <i class="fas fa-badge-check mr-1"></i>
              Seller confirmed receipt — penalties adjusted to
              {{ b.penaltyPercentage || 0 }}%.
            </div>
          </div>
        </div>

        <!-- Rental Status Management -->
        <div class="mt-4 pt-3 border-t border-[var(--Color-Boarder-Border-Primary)]">
          <h4 class="font-semibold text-[var(--Color-Text-Text-Primary)] text-sm mb-3">
            {{ $t("rentalStatusManagement") }}
          </h4>

          <!-- Current Status -->
          <div class="flex items-center gap-2 mb-3">
            <span class="text-sm text-[var(--Color-Text-Text-Secondary)]"
              >{{ $t("currentStatus") }}:</span
            >
            <span
              class="font-medium px-2 py-1 rounded text-xs"
              :class="statusChip(b.status)"
            >
              {{ $t(b.status) }}
            </span>
          </div>

          <!-- Update buttons -->
          <div class="flex gap-2 flex-wrap">
            <button
              v-if="b.status === 'pending'"
              @click="updateStatus(b.id, 'active', 'renter')"
              class="bg-blue-500 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-blue-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center gap-1"
            >
              <i class="fas fa-check-double"></i>{{ $t("confirmReceived") }}
            </button>

            <button
              v-if="b.status === 'active'"
              @click="updateStatus(b.id, 'completed', 'renter')"
              class="bg-purple-500 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-purple-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center gap-1"
            >
              <i class="fas fa-check-circle"></i>{{ $t("confirmCompletion") }}
            </button>

            <button
              v-if="b.status === 'pending'"
              @click="updateStatus(b.id, 'rejected', 'renter')"
              class="bg-red-500 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-red-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center gap-1"
            >
              <i class="fas fa-times"></i>{{ $t("rejectRental") }}
            </button>

            <button
              v-if="b.status === 'rejected'"
              @click="updateStatus(b.id, 'pending', 'renter')"
              class="bg-yellow-500 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-yellow-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center gap-1"
            >
              <i class="fas fa-undo"></i>{{ $t("resetToPending") }}
            </button>
          </div>

          <!-- Completion Confirmation -->
          <div class="mt-4 pt-3 border-t border-[var(--Color-Boarder-Border-Primary)]">
            <h5 class="text-xs font-medium text-[var(--Color-Text-Text-Secondary)] mb-2">
              {{ $t("completionConfirmation") }}:
            </h5>

            <div class="space-y-2 text-xs">
              <div class="flex items-center gap-2">
                <i class="fas fa-user-tie text-blue-500"></i>
                <span class="text-[var(--Color-Text-Text-Secondary)] w-16">Seller:</span>
                <span
                  :class="
                    b.sellerConfirmed
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  "
                  class="px-2 py-0.5 rounded"
                >
                  {{ b.sellerConfirmed ? "Confirmed" : "Pending" }}
                </span>
                <span
                  v-if="b.sellerConfirmedAt"
                  class="text-[var(--Color-Text-Text-Secondary)] ml-2"
                >
                  {{ formatDate(b.sellerConfirmedAt) }}
                </span>
              </div>

              <div class="flex items-center gap-2">
                <i class="fas fa-user text-blue-500"></i>
                <span class="text-[var(--Color-Text-Text-Secondary)] w-16">Renter:</span>
                <span
                  :class="
                    b.renterConfirmed
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  "
                  class="px-2 py-0.5 rounded"
                >
                  {{ b.renterConfirmed ? "Confirmed" : "Pending" }}
                </span>
                <span
                  v-if="b.renterConfirmedAt"
                  class="text-[var(--Color-Text-Text-Secondary)] ml-2"
                >
                  {{ formatDate(b.renterConfirmedAt) }}
                </span>
              </div>

              <div
                v-if="b.renterConfirmed && b.sellerConfirmed"
                class="mt-2 p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-800"
              >
                <i class="fas fa-check-circle mr-1"></i>
                Both parties confirmed. Status set to <strong>completed</strong>.
                <span class="ml-2">
                  Penalty:
                  <strong v-if="(b.penaltyPercentage || 0) === 0">Waived</strong>
                  <strong v-else
                    >{{ b.penaltyPercentage }}% (EGP
                    {{
                      formatPrice((getPrice(b) * (b.penaltyPercentage || 0)) / 100)
                    }})</strong
                  >
                </span>
              </div>
            </div>
          </div>

          <!-- Status History -->
          <div
            v-if="b.statusHistory && b.statusHistory.length > 0"
            class="mt-3 pt-3 border-t border-[var(--Color-Boarder-Border-Primary)]"
          >
            <h5 class="text-xs font-medium text-[var(--Color-Text-Text-Secondary)] mb-2">
              {{ $t("statusHistory") }}:
            </h5>
            <div class="space-y-1">
              <div
                v-for="(h, i) in b.statusHistory.slice().reverse().slice(0, 6)"
                :key="i"
                class="flex items-baseline gap-2 text-xs"
              >
                <span class="text-[var(--Color-Text-Text-Secondary)] w-28">{{
                  formatDate(h.timestamp)
                }}</span>
                <span
                  :class="statusChip(h.status)"
                  class="px-2 py-0.5 rounded capitalize"
                  >{{ h.status }}</span
                >
                <span class="text-[var(--Color-Text-Text-Secondary)]"
                  >({{ h.updatedBy }})</span
                >
                <span
                  v-if="h.message"
                  class="text-[var(--Color-Text-Text-Secondary)] truncate"
                  >— {{ h.message }}</span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Hide expired -->
        <button
          v-if="remain(b.endDate) === 'Expired'"
          @click="hide(b.id)"
          class="mt-3 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Remove from My Rentals
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { db, auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import {
  updateDoc,
  doc,
  getDoc,
  setDoc,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";
import { useGlobalRealTime } from "@/composables/useGlobalRealTime";
import { useRentalStatus } from "@/composables/useRentalStatus";
import Swal from "sweetalert2";

const { t } = useI18n();
const { bookings } = useGlobalRealTime();
const { updateRentalStatusWithUI } = useRentalStatus();

const searchQuery = ref("");
const userId = ref(null);
const penaltyCheckInterval = ref(null);
const pendingPenalties = ref(Object.create(null));

/** product meta cache */
const productMeta = ref(Object.create(null));
const metaVersion = ref(0);

/** placeholder */
const placeholderImage =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='400'><rect width='100%' height='100%' rx='12' ry='12' fill='%23eee'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' fill='%23999' font-size='18'>Loading image…</text></svg>";

/* ---------- date helpers ---------- */
const endOfDay = (d) => {
  const x = new Date(d.getTime());
  x.setHours(23, 59, 59, 999);
  return x;
};
const parseDateish = (v) => {
  if (!v) return null;
  if (typeof v === "object" && v?.toDate) return v.toDate();
  if (v instanceof Date) return v;
  if (typeof v === "number") return new Date(v);
  if (typeof v === "string") {
    const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(v.trim());
    if (m) {
      const [_, y, mo, d] = m.map(Number);
      return endOfDay(new Date(y, mo - 1, d));
    }
    const p = new Date(v);
    if (!isNaN(p)) return p;
  }
  return null;
};
const hoursExpiredNow = (endDate) => {
  const e = parseDateish(endDate) || new Date();
  return Math.max(0, Math.floor((new Date() - e) / (1000 * 60 * 60)));
};

/* ---------- product meta ---------- */
watch(
  bookings,
  async (list) => {
    if (!list || !userId.value) return;
    for (const b of list.filter(
      (x) => x.userId === userId.value && x.hiddenForUser !== true
    )) {
      if (!b.productId) continue;
      if (!productMeta.value[b.productId]) {
        productMeta.value[b.productId] = {
          price: Number(b.actualPrice ?? b.productPrice ?? 0),
          image: b.productImage || "",
        };
        metaVersion.value++;
      }
      try {
        const snap = await getDoc(doc(db, "products", b.productId));
        if (!snap.exists()) continue;
        const data = snap.data();
        const img =
          (typeof data.image1 === "string" &&
            data.image1.startsWith("data:image") &&
            data.image1) ||
          data.image1Path ||
          (Array.isArray(data.images) && data.images[0]) ||
          data.imageUrl ||
          productMeta.value[b.productId]?.image ||
          "";
        const price = Number(
          data.actualPrice ?? data.price ?? productMeta.value[b.productId]?.price ?? 0
        );
        const prev = productMeta.value[b.productId] || {};
        if (prev.image !== img || prev.price !== price) {
          productMeta.value[b.productId] = { price, image: img };
          metaVersion.value++;
        }
      } catch (e) {
        console.error(e);
      }
    }
  },
  { immediate: true }
);

/* ---------- helpers ---------- */
const resolvedImage = (b) =>
  b.productImage || productMeta.value[b.productId]?.image || "";
const getPrice = (b) =>
  b.productId && productMeta.value[b.productId]
    ? productMeta.value[b.productId].price || 0
    : Number(b.actualPrice ?? b.productPrice ?? 0);

/* ---------- computed user bookings (dedup + enrich) ---------- */
const userBookings = computed(() => {
  if (!userId.value || !bookings.value) return [];
  // track meta reactivity
  // eslint-disable-next-line no-unused-vars
  const _track = productMeta.value;

  const byId = new Map();
  for (const b of bookings.value) {
    if (b.userId === userId.value && b.hiddenForUser !== true) {
      const key = b.id || `${b.productId}|${b.startDate}|${b.endDate}`;
      byId.set(key, { ...b, id: b.id ?? key });
    }
  }
  const unique = Array.from(byId.values());

  return unique.map((b) => {
    const expired = remain(b.endDate) === "Expired";
    if (!expired) return b; // only enrich if expired
    const hrs = hoursExpiredNow(b.endDate);
    return {
      ...b,
      hoursExpired: hrs,
      penaltyPhase: hrs <= 48 ? "first" : hrs <= 96 ? "second" : "final",
      penaltyPending: !!pendingPenalties.value[b.id],
      penaltyAmount: b.penaltyAmount || 0,
      penaltyPercentage: b.penaltyPercentage || 0,
    };
  });
});

const filteredProducts = computed(() => {
  if (!searchQuery.value) return userBookings.value;
  const q = searchQuery.value.toLowerCase();
  return userBookings.value.filter((p) =>
    (p.productTitle || "").toLowerCase().includes(q)
  );
});

/* ---------- remaining time ---------- */
const remain = (end) => {
  const e = parseDateish(end);
  if (!e) return "—";
  const diff = endOfDay(e) - new Date();
  if (diff <= 0) return "Expired";
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  return `${d}d ${h}h ${m}m`;
};
const formatDate = (v) => {
  const d = parseDateish(v);
  if (!d) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
const calcPenalty = (price, pct) => formatPrice((Number(price) * pct) / 100);
const formatPrice = (n) =>
  Number(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

/* ---------- chips ---------- */
const statusChip = (s) =>
  ({
    pending: "bg-yellow-100 text-yellow-800",
    active: "bg-green-100 text-green-800",
    completed: "bg-blue-100 text-blue-800",
    cancelled: "bg-red-100 text-red-800",
    rejected: "bg-red-100 text-red-800",
  }[s] || "bg-gray-100 text-gray-800");

/* ---------- completion rules ---------- */
const completeIfBothConfirmed = async (b) => {
  if (!b) return;
  if (b.status === "completed") return;
  if (b.renterConfirmed === true && b.sellerConfirmed === true) {
    const patch = {
      status: "completed",
      lastUpdated: Timestamp.now(),
      statusHistory: arrayUnion({
        status: "completed",
        message: "Both renter & seller confirmed; auto-completed.",
        timestamp: Timestamp.now(),
        updatedBy: "system",
      }),
      noFurtherPenalties: true,
    };
    if (!b.penaltyApplied) {
      Object.assign(patch, {
        penaltyPercentage: 0,
        penaltyAmount: 0,
        penaltyForgiven: true,
      });
    }
    await updateDoc(doc(db, "bookings", b.id), patch);
  }
};
const correctEarlyCompletion = async (b) => {
  if (b && b.status === "completed" && !(b.renterConfirmed && b.sellerConfirmed)) {
    await updateDoc(doc(db, "bookings", b.id), {
      status: "active",
      lastUpdated: Timestamp.now(),
      statusHistory: arrayUnion({
        status: "active",
        message: "Auto-corrected: completion requires both renter & seller confirmation.",
        timestamp: Timestamp.now(),
        updatedBy: "system",
      }),
    });
  }
};
watch(
  userBookings,
  async (list) => {
    for (const b of list) {
      await correctEarlyCompletion(b);
      await completeIfBothConfirmed(b);
    }
  },
  { deep: true }
);

/* ---------- penalties ---------- */
const applyPenalty = async (b, pct, isAdditional = false) => {
  try {
    pendingPenalties.value[b.id] = true;
    const price = getPrice(b);
    const amt = (price * pct) / 100;
    const totalPct = isAdditional ? (b.penaltyPercentage || 0) + pct : pct;
    const totalAmt = isAdditional ? (b.penaltyAmount || 0) + amt : amt;

    const wb = doc(db, "userbalance", userId.value);
    const snap = await getDoc(wb);
    const cur = snap.exists() ? Number(snap.data().remainingBalance) || 0 : 0;

    await setDoc(
      wb,
      {
        remainingBalance: cur - amt,
        lastUpdated: Timestamp.now(),
        transactions: arrayUnion({
          amount: -amt,
          type: "penalty",
          description: `Late return penalty (${pct}% of EGP ${price.toFixed(2)}) for ${
            b.productTitle
          }`,
          timestamp: Timestamp.now(),
        }),
      },
      { merge: true }
    );

    await updateDoc(doc(db, "bookings", b.id), {
      penaltyApplied: true,
      lastPenaltyApplied: Timestamp.now(),
      penaltyAmount: totalAmt,
      penaltyPercentage: totalPct,
      statusHistory: arrayUnion({
        status: "penalty_applied",
        message: `${pct}% penalty (EGP ${amt.toFixed(2)}) applied`,
        timestamp: Timestamp.now(),
        updatedBy: "system",
      }),
    });
  } finally {
    pendingPenalties.value[b.id] = false;
  }
};

/* ⚠️ Apply penalties for ANY expired booking except completed */
const checkAndApplyPenalties = async () => {
  const list = userBookings.value.filter((b) => {
    const expired = remain(b.endDate) === "Expired";
    return (
      expired &&
      b.status !== "completed" &&
      !b.penaltyPending &&
      !b.penaltyForgiven &&
      !b.noFurtherPenalties
    );
  });
  for (const b of list) {
    if (b.hoursExpired > 48 && (b.penaltyPercentage || 0) < 30) await applyPenalty(b, 30);
    else if (b.hoursExpired > 96 && (b.penaltyPercentage || 0) < 50)
      await applyPenalty(b, 20, true);
  }
};

/* ---------- actions ---------- */
const updateStatus = async (id, status, by) =>
  updateRentalStatusWithUI(id, status, by, t);
const hide = async (id) => {
  try {
    await updateDoc(doc(db, "bookings", id), { hiddenForUser: true });
    Swal.fire({ title: "Removed", icon: "success" });
  } catch (e) {
    Swal.fire({ title: "Error", text: "Failed to remove rental.", icon: "error" });
  }
};

/* ---------- init ---------- */
onMounted(() => {
  onAuthStateChanged(auth, async (u) => {
    if (u) {
      userId.value = u.uid;
      await checkAndApplyPenalties();
      penaltyCheckInterval.value = setInterval(checkAndApplyPenalties, 30 * 60 * 1000);
    }
  });
});
onUnmounted(
  () => penaltyCheckInterval.value && clearInterval(penaltyCheckInterval.value)
);

/* ---------- expose ---------- */
defineExpose({ formatPrice, calcPenalty });
</script>
