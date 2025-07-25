<template>
  <div :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'" class="max-w-6xl mx-auto py-10 px-4">
    <div class="flex flex-col items-center md:items-start md:flex-row gap-8 mb-8">
      <img
        src="@/assets/default.png"
        alt="Profile"
        class="w-28 h-28 rounded-full object-cover border-4 border-[var(--color-primary-100)] shadow"
      />
      <div class="flex flex-col justify-center items-center md:items-start">
        <h2 class="text-2xl font-bold mb-1">
          <span class="text-[var(--color-primary-600)]">{{$t('welcome')}}</span>
          <span class="text-[var(--Color-Text-Text-Primary)]"> Julia Walt</span>
        </h2>
      </div>
    </div>
    <div class="bg-white dark:bg-[var(--color-gray-800)] rounded-xl shadow p-8">
      <h3 class="text-lg font-bold mb-6 text-[var(--Color-Text-Text-Primary)]">{{$t('personalInfo')}}</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label class="block text-sm text-[var(--Color-Text-Text-Secondary)] mb-1">{{$t('firstName')}}</label>
          <div class="relative">
            <input type="text" class="w-full border border-[var(--color-gray-200)] rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-200)] text-[var(--Color-Text-Text-Primary)]" />
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-gray-400)] cursor-pointer">
              <i class="fas fa-pen"></i>
            </span>
          </div>
        </div>
        <div>
          <label class="block text-sm text-[var(--Color-Text-Text-Secondary)] mb-1">{{$t('lastName')}}</label>
          <div class="relative">
            <input type="text" class="w-full border border-[var(--color-gray-200)] rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-200)] text-[var(--Color-Text-Text-Primary)]"  />
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-gray-400)] cursor-pointer">
              <i class="fas fa-pen"></i>
            </span>
          </div>
        </div>
        <div>
          <label class="block text-sm text-[var(--Color-Text-Text-Secondary)] mb-1">{{$t('emailAddress')}}</label>
          <input type="email" class="w-full border border-[var(--color-gray-200)] rounded-md px-4 py-2 text-[var(--Color-Text-Text-Primary)]"  />
        </div>
        <div>
          <label class="block text-sm text-[var(--Color-Text-Text-Secondary)] mb-1">{{$t('phone')}}</label>
          <div class="relative">
            <input type="text" class="w-full border border-[var(--color-gray-200)] rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-200)] text-[var(--Color-Text-Text-Primary)]" />
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-gray-400)] cursor-pointer">
              <i class="fas fa-pen"></i>
            </span>
          </div>
        </div>
      </div>
      <h3 class="text-lg font-bold mb-6 text-[var(--Color-Text-Text-Primary)]">{{$t('address')}}</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm text-[var(--Color-Text-Text-Secondary)] mb-1">{{$t('city')}}</label>
          <div class="relative">
            <input type="text" class="w-full border border-[var(--color-gray-200)] rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-200)] text-[var(--Color-Text-Text-Primary)]" />
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-gray-400)] cursor-pointer">
              <i class="fas fa-pen"></i>
            </span>
          </div>
        </div>
        <div>
          <label class="block text-sm text-[var(--Color-Text-Text-Secondary)] mb-1">{{$t('district')}}</label>
          <div class="relative">
            <input type="text" class="w-full border border-[var(--color-gray-200)] rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-200)] text-[var(--Color-Text-Text-Primary)]" />
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-gray-400)] cursor-pointer">
              <i class="fas fa-pen"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyProfile'
};
</script>

<style scoped>
</style> 