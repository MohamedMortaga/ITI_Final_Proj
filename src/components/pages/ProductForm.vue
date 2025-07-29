<template>
  <form @submit.prevent="$emit('submitForm')"
    class="bg-[var(--Color-Surface-Surface-Primary)] dark:bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl shadow-sm px-4 md:px-6 py-4 mx-auto mt-8 space-y-4">
    <h2 class="text-xl md:text-2xl font-medium text-center text-[var(--Color-Text-Text-Primary)] mb-4 font-nunito ">
      {{ isEdit ? $t('edit') : $t('addTool') }}
    </h2>
    <!-- Title -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-[var(--Color-Text-Text-Primary)] dark:text-[var(--Color-Text-Text-Primary)] mb-1 font-nunito">{{$t('productTitlePlaceholder')}}</label>
      <input
        v-model="form.title"
        type="text"
        :placeholder="$t('productTitlePlaceholder')"
        class="w-full px-3 md:px-4 py-2 rounded-lg text-[var(--Color-Text-Text-Secondary)] dark:text-[var(--Color-Text-Text-Secondary)] border border-[var(--Color-Boarder-Border-Primary)] dark:border-[var(--Color-Boarder-Border-Primary)] bg-[var(--Color-Surface-Surface-Primary)] dark:bg-[var(--Color-Surface-Surface-Primary)] focus:outline-none focus:ring-2 focus:ring-[var(--Colors-Primary-500)] font-nunito"
        required
      />
    </div>
    <!-- Image Upload -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-[var(--Color-Text-Text-Primary)] dark:text-[var(--Color-Text-Text-Primary)] mb-1 font-nunito">{{$t('productImage')}}</label>
      <input
        type="file"
        @change="$emit('imageUpload', $event)"
        accept="image/*"
        class="w-full px-3 md:px-4 py-2 rounded-lg border border-[var(--Color-Boarder-Border-Primary)] dark:border-[var(--Color-Boarder-Border-Primary)] bg-[var(--Color-Surface-Surface-Primary)] dark:bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Secondary)] dark:text-[var(--Color-Text-Text-Secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--Colors-Primary-500)] font-nunito"
      />
      <div v-if="form.image" class="mt-3">
        <img :key="form.image" :src="form.image" :alt="$t('productImage')" class="h-32 md:h-36 w-full object-cover rounded-lg border border-[var(--Color-Boarder-Border-Primary)] dark:border-[var(--Color-Boarder-Border-Primary)]" />
      </div>
      <p v-else class="text-sm text-[var(--Colors-Error-400)] mt-2 dark:text-[var(--Colors-Error-300)] font-nunito">{{$t('noImageUploaded')}}</p>
      <p v-if="uploading" class="text-sm text-[var(--Colors-Success-500)] mt-2 font-nunito">{{$t('uploadingImage')}}</p>
    </div>
    <!-- Category -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-[var(--Color-Text-Text-Primary)] dark:text-[var(--Color-Text-Text-Primary)] mb-1 font-nunito">{{$t('selectCategory')}}</label>
      <select
        v-model="form.category"
        class="w-full px-3 md:px-4 py-2 rounded-lg border border-[var(--Color-Boarder-Border-Primary)] dark:border-[var(--Color-Boarder-Border-Primary)] bg-[var(--Color-Surface-Surface-Primary)] dark:bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Secondary)] dark:text-[var(--Color-Text-Text-Secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--Colors-Primary-500)] font-nunito"
        required
      >
        <option disabled value="">{{$t('selectCategory')}}</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.name">
          {{ cat.name }}
        </option>
      </select>
    </div>
    <!-- Price -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-[var(--Color-Text-Text-Primary)] dark:text-[var(--Color-Text-Text-Primary)] mb-1 font-nunito">{{$t('price')}}</label>
      <input
        v-model.number="form.price"
        type="number"
        :placeholder="$t('productPricePlaceholder')"
        class="w-full px-3 md:px-4 py-2 rounded-lg border border-[var(--Color-Boarder-Border-Primary)] dark:border-[var(--Color-Boarder-Border-Primary)] bg-[var(--Color-Surface-Surface-Primary)] dark:bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Secondary)] dark:text-[var(--Color-Text-Text-Secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--Colors-Primary-500)] font-nunito"
        required
      />
    </div>
    <!-- Location -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-[var(--Color-Text-Text-Primary)] dark:text-[var(--Color-Text-Text-Primary)] mb-1 font-nunito">{{$t('selectLocation')}}</label>
      <select
        v-model="form.location"
        class="w-full px-3 md:px-4 py-2 rounded-lg border border-[var(--Color-Boarder-Border-Primary)] dark:border-[var(--Color-Boarder-Border-Primary)] bg-[var(--Color-Surface-Surface-Primary)] dark:bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Secondary)] dark:text-[var(--Color-Text-Text-Secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--Colors-Primary-500)] font-nunito"
        required
      >
        <option disabled value="">{{$t('selectLocation')}}</option>
        <option value="cairo">{{$t('cairo')}}</option>
        <option value="alexandria">{{$t('alexandria')}}</option>
        <option value="mansoura">{{$t('mansoura')}}</option>
        <option value="giza">{{$t('giza')}}</option>
        <option value="sharmElSheikh">{{$t('sharmElSheikh')}}</option>
        <option value="hurghada">{{$t('hurghada')}}</option>
        <option value="luxor">{{$t('luxor')}}</option>
        <option value="aswan">{{$t('aswan')}}</option>
        <option value="portSaid">{{$t('portSaid')}}</option>
        <option value="suez">{{$t('suez')}}</option>
        <option value="ismailia">{{$t('ismailia')}}</option>
        <option value="beniSuef">{{$t('beniSuef')}}</option>
        <option value="minya">{{$t('minya')}}</option>
        <option value="assiut">{{$t('assiut')}}</option>
        <option value="sohag">{{$t('sohag')}}</option>
        <option value="qena">{{$t('qena')}}</option>
        <option value="redSea">{{$t('redSea')}}</option>
        <option value="newValley">{{$t('newValley')}}</option>
        <option value="matruh">{{$t('matruh')}}</option>
        <option value="northSinai">{{$t('northSinai')}}</option>
        <option value="southSinai">{{$t('southSinai')}}</option>
        <option value="beheira">{{$t('beheira')}}</option>
        <option value="gharbiya">{{$t('gharbiya')}}</option>
        <option value="kafrElSheikh">{{$t('kafrElSheikh')}}</option>
        <option value="dakahlia">{{$t('dakahlia')}}</option>
        <option value="sharqiya">{{$t('sharqiya')}}</option>
        <option value="qalyubiya">{{$t('qalyubiya')}}</option>
        <option value="monufiya">{{$t('monufiya')}}</option>
        <option value="fayoum">{{$t('fayoum')}}</option>
      </select>
    </div>
    <!-- Net Profit -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-[var(--Color-Text-Text-Primary)] dark:text-[var(--Color-Text-Text-Primary)] mb-1 font-nunito">{{$t('netProfit')}}</label>
      <input
        :value="netProfit"
        type="number"
        readonly
        class="w-full px-3 md:px-4 py-2 bg-gray-25 dark:bg-gray-600 rounded-lg border border-[var(--Color-Boarder-Border-Primary)] dark:border-[var(--Color-Boarder-Border-Primary)] dark:text-gray-200 focus:outline-none font-nunito"
      />
    </div>
    <!-- Details -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-[var(--Color-Text-Text-Primary)] dark:text-[var(--Color-Text-Text-Primary)] mb-1 font-nunito">{{$t('details')}}</label>
      <textarea
        v-model="form.details"
        :placeholder="$t('productDetailsPlaceholder')"
        rows="4"
        class="w-full px-3 md:px-4 py-2 rounded-lg border border-[var(--Color-Boarder-Border-Primary)] dark:border-[var(--Color-Boarder-Border-Primary)] bg-[var(--Color-Surface-Surface-Primary)] dark:bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Secondary)] dark:text-[var(--Color-Text-Text-Secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--Colors-Primary-500)] font-nunito"
      ></textarea>
    </div>
    <!-- Submit Button -->
    <button
      type="submit"
      class="w-full bg-[var(--Color-Surface-Surface-Brand)] hover:bg-[var(--Colors-Primary-600)] transition text-white font-semibold py-3 px-6 rounded-lg font-nunito"
    >
      {{ isEdit ? $t('edit') : $t('addTool') }}
    </button>
    <button
      type="button"
      class="w-full bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Surface-Brand)] dark:bg-[var(--Color-Surface-Surface-Primary)]  transition text-[var(--Color-Text-Text-Brand)] font-semibold py-3 px-6 rounded-lg mt-2 font-nunito"
      @click="$emit('cancelForm')"
    >
      {{ $t('cancel') || 'Cancel' }}
    </button>
  </form>
</template>

<script setup>
import { computed } from 'vue';

// استخراج props
const { form, categories, isEdit, uploading } = defineProps([
  'form',
  'categories',
  'isEdit',
  'uploading'
]);

// ✅ عرفي العمولة قبل استخدامها
const commissionRate = 0.15;

// ✅ بعدها احسبي صافي الربح
const netProfit = computed(() => {
  try {
    if (!form.price) return 0;
    return form.price - form.price * commissionRate;
  } catch (e) {
    console.error('Error in netProfit computed:', e);
    return 0;
  }
});

// تعريف الإيفنتات
defineEmits(['submitForm', 'imageUpload']);
</script>



