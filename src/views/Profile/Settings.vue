<template>
  <div class="max-w-5xl mx-2 sm:mx-4 md:mx-8 py-4 sm:py-8 px-2 sm:px-4">
    <!-- Page Header -->
    <div class="mb-6 sm:mb-8">
      <h1 class="text-xl sm:text-2xl text-[var(--Color-Text-Text-Primary)] font-medium dark:text-[var(--Color-Text-Text-Primary)] mb-2">
        {{ $t('settings') }}
      </h1>
      <p class="text-sm sm:text-base text-[var(--Color-Text-Text-Secondary)] dark:text-[var(--Color-Text-Text-Secondary)]">
        {{ $t('manageYourAccount') }}
      </p>
    </div>

    <!-- Settings Sections -->
    <div class="space-y-4 sm:space-y-6">
      <!-- Profile Settings -->
      <!-- <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-4 sm:p-6">
        <div class="flex items-center mb-4">
          <div class="w-8 h-8 sm:w-10 sm:h-10 bg-[var(--Color-Surface-Surface-Brand)] rounded-lg flex items-center justify-center mr-3">
            <i class="fas fa-user text-white text-sm sm:text-base"></i>
          </div>
          <h2 class="text-lg sm:text-xl font-semibold text-[var(--Color-Text-Text-Primary)]">
            {{ $t('profileSettings') }}
          </h2>
        </div>
        
                 <div class="space-y-4">
           <div class="flex items-center space-x-3 sm:space-x-4">
             <div class="w-16 h-16 sm:w-20 sm:h-20 bg-gray-25 dark:bg-gray-600 rounded-full flex items-center justify-center">
               <i class="fas fa-user text-[var(--Color-Text-Text-Secondary)] text-xl sm:text-2xl"></i>
             </div>
             <div>
               <p class="text-[var(--Color-Text-Text-Primary)] font-medium text-sm sm:text-base">{{ $t('profilePhoto') }}</p>
               <p class="text-xs sm:text-sm text-[var(--Color-Text-Text-Secondary)]">{{ $t('yourProfilePicture') }}</p>
             </div>
           </div>
         </div>
      </div> -->

      <!-- Security Settings -->
      <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-3 sm:p-4 md:p-6">
        <div class="flex items-center mb-4">
          <div class="w-8 h-8 sm:w-10 sm:h-10 bg-[var(--Colors-Error-400)] rounded-lg flex items-center justify-center mr-3">
            <i class="fas fa-shield-alt text-white text-sm sm:text-base"></i>
          </div>
          <h2 class="text-lg sm:text-xl font-semibold text-[var(--Color-Text-Text-Primary)]">
            {{ $t('security') }}
          </h2>
        </div>
        
        <div class="space-y-4">
          <!-- Current Password -->
          <div>
            <label class="block text-xs sm:text-sm font-medium text-[var(--Color-Text-Text-Primary)] mb-2">
              {{ $t('currentPassword') }}
            </label>
            <input 
              type="password" 
              class="w-full px-3 py-2 text-sm sm:text-base border border-[var(--Color-Boarder-Border-Primary)] rounded-lg bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)] focus:outline-none focus:ring-2 focus:ring-[var(--Color-Text-Text-Brand)]"
              :placeholder="$t('enterCurrentPassword')"
            />
          </div>

          <!-- New Password -->
          <div>
            <label class="block text-xs sm:text-sm font-medium text-[var(--Color-Text-Text-Primary)] mb-2">
              {{ $t('newPassword') }}
            </label>
            <input 
              type="password" 
              class="w-full px-3 py-2 text-sm sm:text-base border border-[var(--Color-Boarder-Border-Primary)] rounded-lg bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)] focus:outline-none focus:ring-2 focus:ring-[var(--Color-Text-Text-Brand)]"
              :placeholder="$t('enterNewPassword')"
            />
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="block text-xs sm:text-sm font-medium text-[var(--Color-Text-Text-Primary)] mb-2">
              {{ $t('confirmPassword') }}
            </label>
            <input 
              type="password" 
              class="w-full px-3 py-2 text-sm sm:text-base border border-[var(--Color-Boarder-Border-Primary)] rounded-lg bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)] focus:outline-none focus:ring-2 focus:ring-[var(--Color-Text-Text-Brand)]"
              :placeholder="$t('confirmNewPassword')"
            />
          </div>

                     <!-- Two-Factor Authentication -->
           <!-- <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-25 dark:bg-gray-600 rounded-lg space-y-3 sm:space-y-0">
            <div>
              <h3 class="font-medium text-[var(--Color-Text-Text-Primary)] text-sm sm:text-base">
                {{ $t('twoFactorAuth') }}
              </h3>
              <p class="text-xs sm:text-sm text-[var(--Color-Text-Text-Secondary)]">
                {{ $t('twoFactorDesc') }}
              </p>
            </div>
            <button class="px-3 sm:px-4 py-2 bg-[var(--Color-Surface-Surface-Brand)] text-white rounded-lg hover:bg-[var(--Colors-Primary-600)] transition text-sm sm:text-base">
              {{ $t('enable') }}
            </button>
          </div> -->

          <!-- Update Password Button -->
          <div class="pt-4">
            <button class="w-full sm:w-auto px-4 sm:px-6 py-2 bg-[var(--Color-Surface-Surface-Brand)] text-white rounded-lg hover:bg-[var(--Colors-Primary-600)] transition text-sm sm:text-base">
              {{ $t('updatePassword') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Notification Settings -->
      <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-3 sm:p-4 md:p-6">
        <div class="flex items-center mb-4">
          <div class="w-8 h-8 sm:w-10 sm:h-10 bg-[var(--Colors-Warning-400)] rounded-lg flex items-center justify-center mr-3">
            <i class="fas fa-bell text-white text-sm sm:text-base"></i>
          </div>
          <h2 class="text-lg sm:text-xl font-semibold text-[var(--Color-Text-Text-Primary)]">
            {{ $t('notifications') }}
          </h2>
        </div>
        
        <div class="space-y-4">
                     <!-- Email Notifications -->
           <div class="flex items-center justify-between p-3 sm:p-4 bg-gray-25 dark:bg-gray-600 rounded-lg">
            <div class="flex-1 min-w-0">
              <h3 class="font-medium text-[var(--Color-Text-Text-Primary)] text-sm sm:text-base">
                {{ $t('emailNotifications') }}
              </h3>
              <p class="text-xs sm:text-sm text-[var(--Color-Text-Text-Secondary)]">
                {{ $t('emailNotificationsDesc') }}
              </p>
            </div>
            <div class="w-10 h-5 sm:w-12 sm:h-6 bg-[var(--Color-Surface-Surface-Brand)] rounded-full relative ml-3">
              <div class="w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
            </div>
          </div>

                     <!-- SMS Notifications -->
           <div class="flex items-center justify-between p-3 sm:p-4 bg-gray-25 dark:bg-gray-600 rounded-lg">
            <div class="flex-1 min-w-0">
              <h3 class="font-medium text-[var(--Color-Text-Text-Primary)] text-sm sm:text-base">
                {{ $t('smsNotifications') }}
              </h3>
              <p class="text-xs sm:text-sm text-[var(--Color-Text-Text-Secondary)]">
                {{ $t('smsNotificationsDesc') }}
              </p>
            </div>
            <div class="w-10 h-5 sm:w-12 sm:h-6 bg-[var(--Color-Surface-Surface-Secondary)] rounded-full relative ml-3">
              <div class="w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
            </div>
          </div>

        </div>
      </div>

      <!-- Logout Section -->
      <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-3 sm:p-4 md:p-6">
        <div class="flex items-center mb-4">
          <div class="w-8 h-8 sm:w-10 sm:h-10 bg-[var(--Colors-Error-400)] rounded-lg flex items-center justify-center mr-3">
            <i class="fas fa-sign-out-alt text-white text-sm sm:text-base"></i>
          </div>
          <h2 class="text-lg sm:text-xl font-semibold text-[var(--Color-Text-Text-Primary)]">
            {{ $t('accountActions') }}
          </h2>
        </div>
        
        <div class="space-y-4">
          <div class="p-3 sm:p-4 bg-gray-25 dark:bg-gray-600 rounded-lg">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-[var(--Color-Text-Text-Primary)] text-sm sm:text-base">
                  {{ $t('logout') }}
                </h3>
                <!-- <p class="text-xs sm:text-sm text-[var(--Color-Text-Text-Secondary)]">
                  {{ $t('logoutDesc') }}
                </p> -->
              </div>
              <button 
                @click="handleLogout"
                class="w-auto sm:w-auto px-4 sm:px-6 py-2 bg-[var(--Colors-Error-400)] text-white rounded-lg hover:bg-[var(--Colors-Error-500)] transition text-sm sm:text-base flex items-center gap-2"
                :disabled="isLoggingOut"
              >
                <i class="fas fa-sign-out-alt text-sm"></i>
                <!-- <span v-if="!isLoggingOut">{{ $t('logout') }}</span>
                <span v-else>{{ $t('loggingOut') }}</span> -->
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getAuth, signOut } from 'firebase/auth'
import Swal from 'sweetalert2'

const router = useRouter()
const { t } = useI18n()
const isLoggingOut = ref(false)

const handleLogout = async () => {
  try {
    isLoggingOut.value = true
    
    const auth = getAuth()
    await signOut(auth)
    
    // Show success message
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: t("logoutSuccessful"),
      showConfirmButton: false,
      timer: 1500,
    })
    
    // Redirect to home page
    router.push("/home")
  } catch (error) {
    console.error('Logout error:', error)
    
    // Show error message
    Swal.fire({
      position: "top-end",
      icon: "error",
      title: t("logoutFailed"),
      text: error.message || t("logoutError"),
      showConfirmButton: false,
      timer: 3000,
    })
  } finally {
    isLoggingOut.value = false
  }
}
</script>

<style scoped>
/* Custom styles for toggles */
.w-12.h-6 {
  transition: background-color 0.3s ease;
}

.w-5.h-5 {
  transition: transform 0.3s ease;
}
</style> 