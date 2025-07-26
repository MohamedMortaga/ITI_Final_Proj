<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Balance Overview</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div>
        <label>Total Income</label>
        <input
          type="text"
          class="w-full p-2 border rounded"
          :value="`EGP ${totalIncome.toFixed(2)}`"
          readonly
        />
      </div>
      <div>
        <label>Total Service Fee (Our Profit)</label>
        <input
          type="text"
          class="w-full p-2 border rounded"
          :value="`EGP ${totalServiceFee.toFixed(2)}`"
          readonly
        />
      </div>
      <div>
        <label>Total Profit (You)</label>
        <input
          type="text"
          class="w-full p-2 border rounded"
          :value="`EGP ${totalProfit.toFixed(2)}`"
          readonly
        />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div v-for="item in items" :key="item.id" class="border p-4 rounded shadow">
        <img :src="item.img" class="w-full h-40 object-cover mb-2" />
        <h2 class="font-bold">{{ item.title }}</h2>
        <p>Price/Day: {{ item.pricePerDay }}</p>
        <p>Service Fee: {{ item.serviceFee }}</p>
        <p>Total Profit: {{ item.totalProfit }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { db } from "@/firebase/config";
import { collection, getDocs, doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const items = ref([]);
const totalIncome = ref(0);
const totalServiceFee = ref(0);
const totalProfit = ref(0);

onMounted(() => {
  const auth = getAuth();

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      console.warn("User not logged in");
      return;
    }

    const currentUserId = user.uid;

    // Get bookings only
    const bookingsSnap = await getDocs(collection(db, "bookings"));

    for (const docSnap of bookingsSnap.docs) {
      const booking = docSnap.data();
      const sellerId = booking.sellerId || booking.userId || "unknown";

      // ⚠️ Only show current user's bookings
      if (sellerId !== currentUserId) continue;

      const price = Number(booking.productPrice ?? 0);
      const fee = Number(booking.deliveryFee ?? 0);
      const sellerProfit = price - fee;

      items.value.push({
        id: docSnap.id,
        img: booking.productImage,
        title: booking.productTitle,
        pricePerDay: `EGP ${price.toFixed(2)}`,
        serviceFee: `EGP ${fee.toFixed(2)}`,
        totalProfit: `EGP ${sellerProfit.toFixed(2)}`,
      });

      totalIncome.value += price;
      totalServiceFee.value += fee;
      totalProfit.value += sellerProfit;
    }

    // Get user profile (for display or saving)
    let userInfo = {};
    try {
      const userRef = doc(db, "users", currentUserId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const d = userSnap.data();
        userInfo = {
          name: d.name ?? null,
          email: d.email ?? null,
          phone: d.phone ?? null,
          username: d.username ?? null,
          userimage: d.userimage ?? null,
        };
      }
    } catch (e) {
      console.warn(`Couldn't read users/${currentUserId}`, e);
    }

    // Save balance for this user
    const userBalanceRef = doc(db, "userbalance", currentUserId);
    await setDoc(
      userBalanceRef,
      {
        userid: currentUserId,
        balance: totalIncome.value,
        profit: totalProfit.value,
        serviceFee: totalServiceFee.value,
        ...userInfo,
      },
      { merge: true }
    );

    // Save profit record
    const profitRef = doc(db, "ourprofite", currentUserId); // can change this if needed
    await setDoc(
      profitRef,
      {
        balance: totalServiceFee.value,
        sellersProfit: totalProfit.value,
      },
      { merge: true }
    );
  });
});
</script>
