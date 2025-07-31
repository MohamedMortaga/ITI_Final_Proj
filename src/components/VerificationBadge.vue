<template>
  <div class="relative inline-flex items-center">
    <span class="font-medium text-[var(--Color-Text-Text-Primary)] relative z-10 px-1">{{ userName }}</span>
    <i v-if="isVerified" class="fas fa-check-circle text-blue-500 ml-1"></i>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineProps({
  userName: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  }
});
</script> 