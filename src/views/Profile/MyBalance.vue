<template>
  <div :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'" class="max-w-6xl mx-auto py-10 px-4">
    <!-- Your Balance Section -->
    <div class="bg-white dark:bg-[var(--color-gray-800)] rounded-xl shadow p-8 mb-8">
      <h3 class="text-lg font-bold mb-6 text-[var(--Color-Text-Text-Primary)]">{{$t('yourBalance')}}</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label class="block text-sm text-[var(--Color-Text-Text-Secondary)] mb-1">{{$t('yourIncome')}}</label>
          <input type="text" class="w-full border border-[var(--color-gray-200)] rounded-md px-4 py-2 text-[var(--Color-Text-Text-Primary)]" value="EGP 200" readonly />
        </div>
        <div>
          <label class="block text-sm text-[var(--Color-Text-Text-Secondary)] mb-1">{{$t('serviceFee')}}</label>
          <input type="text" class="w-full border border-[var(--color-gray-200)] rounded-md px-4 py-2 text-[var(--Color-Text-Text-Primary)]" value="EGP 20" readonly />
        </div>
        <div>
          <label class="block text-sm text-[var(--Color-Text-Text-Secondary)] mb-1">{{$t('totalProfit')}}</label>
          <input type="text" class="w-full border border-[var(--color-gray-200)] rounded-md px-4 py-2 text-[var(--Color-Text-Text-Primary)]" value="EGP 180" readonly />
        </div>
      </div>
    </div>
    <!-- Profit of Items Section -->
    <div class="bg-white dark:bg-[var(--color-gray-800)] rounded-xl shadow p-8">
      <h3 class="text-lg font-bold mb-6 text-[var(--Color-Text-Text-Primary)]">{{$t('profitOfItems')}}</h3>
      <div class="space-y-6">
        <div v-for="item in items" :key="item.id" class="flex flex-col md:flex-row items-start gap-4 p-4 border border-[var(--color-gray-200)] rounded-lg">
          <img :src="item.img" alt="Item" class="w-16 h-16 object-cover rounded" />
          <div class="flex-1">
            <h4 class="font-semibold text-[var(--Color-Text-Text-Primary)] mb-2">{{item.title}}</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm text-[var(--Color-Text-Text-Secondary)] mb-1">{{$t('pricePerDay')}}</label>
                <input type="text" class="w-full border border-[var(--color-gray-200)] rounded-md px-4 py-2 text-[var(--Color-Text-Text-Primary)]" :value="item.pricePerDay" readonly />
              </div>
              <div>
                <label class="block text-sm text-[var(--Color-Text-Text-Secondary)] mb-1">{{$t('serviceFee')}}</label>
                <input type="text" class="w-full border border-[var(--color-gray-200)] rounded-md px-4 py-2 text-[var(--Color-Text-Text-Primary)]" :value="item.serviceFee" readonly />
              </div>
              <div>
                <label class="block text-sm text-[var(--Color-Text-Text-Secondary)] mb-1">{{$t('totalProfit')}}</label>
                <input type="text" class="w-full border border-[var(--color-gray-200)] rounded-md px-4 py-2 text-[var(--Color-Text-Text-Primary)]" :value="item.totalProfit" readonly />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyBalance',
  data() {
    return {
      items: [
        {
          id: 1,
          img: require('@/assets/test.png'),
          title: 'Canon Camera',
          pricePerDay: 'EGP 100',
          serviceFee: 'EGP 20',
          totalProfit: 'EGP 90',
        },
        {
          id: 2,
          img: require('@/assets/test.png'),
          title: 'Canon Camera',
          pricePerDay: 'EGP 100',
          serviceFee: 'EGP 20',
          totalProfit: 'EGP 90',
        },
      ],
    };
  },
};
</script> 