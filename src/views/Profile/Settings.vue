<template>
  <div class="max-w-4xl mx-auto py-8 px-4">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-[var(--Color-Text-Text-Brand)] mb-2">
        {{ $t('settings') || 'Settings' }}
      </h1>
      <p class="text-[var(--Color-Text-Text-Secondary)]">
        {{ $t('manageYourAccount') || 'Manage your account settings and preferences' }}
      </p>
    </div>

    <!-- Settings Sections -->
    <div class="space-y-6">
      <!-- Profile Settings -->
      <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6">
        <div class="flex items-center mb-4">
          <div class="w-10 h-10 bg-[var(--Color-Surface-Surface-Brand)] rounded-lg flex items-center justify-center mr-3">
            <i class="fas fa-user text-white"></i>
          </div>
          <h2 class="text-xl font-semibold text-[var(--Color-Text-Text-Primary)]">
            {{ $t('profileSettings') || 'Profile Settings' }}
          </h2>
        </div>
        
                 <div class="space-y-4">
           <!-- Profile Picture Display Only -->
           <div class="flex items-center space-x-4">
             <div class="w-20 h-20 bg-gray-25 dark:bg-gray-600 rounded-full flex items-center justify-center">
               <i class="fas fa-user text-[var(--Color-Text-Text-Secondary)] text-2xl"></i>
             </div>
             <div>
               <p class="text-[var(--Color-Text-Text-Primary)] font-medium">Profile Photo</p>
               <p class="text-sm text-[var(--Color-Text-Text-Secondary)]">Your profile picture</p>
             </div>
           </div>
         </div>
      </div>

      <!-- Security Settings -->
      <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6">
        <div class="flex items-center mb-4">
          <div class="w-10 h-10 bg-[var(--Colors-Error-400)] rounded-lg flex items-center justify-center mr-3">
            <i class="fas fa-shield-alt text-white"></i>
          </div>
          <h2 class="text-xl font-semibold text-[var(--Color-Text-Text-Primary)]">
            {{ $t('security') || 'Security' }}
          </h2>
        </div>
        
        <div class="space-y-4">
          <!-- Current Password -->
          <div>
            <label class="block text-sm font-medium text-[var(--Color-Text-Text-Primary)] mb-2">
              {{ $t('currentPassword') || 'Current Password' }}
            </label>
            <input 
              type="password" 
              class="w-full px-3 py-2 border border-[var(--Color-Boarder-Border-Primary)] rounded-lg bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)] focus:outline-none focus:ring-2 focus:ring-[var(--Color-Text-Text-Brand)]"
              placeholder="Enter current password"
            />
          </div>

          <!-- New Password -->
          <div>
            <label class="block text-sm font-medium text-[var(--Color-Text-Text-Primary)] mb-2">
              {{ $t('newPassword') || 'New Password' }}
            </label>
            <input 
              type="password" 
              class="w-full px-3 py-2 border border-[var(--Color-Boarder-Border-Primary)] rounded-lg bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)] focus:outline-none focus:ring-2 focus:ring-[var(--Color-Text-Text-Brand)]"
              placeholder="Enter new password"
            />
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="block text-sm font-medium text-[var(--Color-Text-Text-Primary)] mb-2">
              {{ $t('confirmPassword') || 'Confirm Password' }}
            </label>
            <input 
              type="password" 
              class="w-full px-3 py-2 border border-[var(--Color-Boarder-Border-Primary)] rounded-lg bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)] focus:outline-none focus:ring-2 focus:ring-[var(--Color-Text-Text-Brand)]"
              placeholder="Confirm new password"
            />
          </div>

                     <!-- Two-Factor Authentication -->
           <div class="flex items-center justify-between p-4 bg-gray-25 dark:bg-gray-600 rounded-lg">
            <div>
              <h3 class="font-medium text-[var(--Color-Text-Text-Primary)]">
                {{ $t('twoFactorAuth') || 'Two-Factor Authentication' }}
              </h3>
              <p class="text-sm text-[var(--Color-Text-Text-Secondary)]">
                {{ $t('twoFactorDesc') || 'Add an extra layer of security to your account' }}
              </p>
            </div>
            <button class="px-4 py-2 bg-[var(--Color-Surface-Surface-Brand)] text-white rounded-lg hover:bg-[var(--Colors-Primary-600)] transition">
              {{ $t('enable') || 'Enable' }}
            </button>
          </div>

          <!-- Update Password Button -->
          <div class="pt-4">
            <button class="px-6 py-2 bg-[var(--Color-Surface-Surface-Brand)] text-white rounded-lg hover:bg-[var(--Colors-Primary-600)] transition">
              {{ $t('updatePassword') || 'Update Password' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Notification Settings -->
      <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6">
        <div class="flex items-center mb-4">
          <div class="w-10 h-10 bg-[var(--Colors-Warning-400)] rounded-lg flex items-center justify-center mr-3">
            <i class="fas fa-bell text-white"></i>
          </div>
          <h2 class="text-xl font-semibold text-[var(--Color-Text-Text-Primary)]">
            {{ $t('notifications') || 'Notifications' }}
          </h2>
        </div>
        
        <div class="space-y-4">
                     <!-- Email Notifications -->
           <div class="flex items-center justify-between p-4 bg-gray-25 dark:bg-gray-600 rounded-lg">
            <div>
              <h3 class="font-medium text-[var(--Color-Text-Text-Primary)]">
                {{ $t('emailNotifications') || 'Email Notifications' }}
              </h3>
              <p class="text-sm text-[var(--Color-Text-Text-Secondary)]">
                {{ $t('emailNotificationsDesc') || 'Receive notifications via email' }}
              </p>
            </div>
            <div class="w-12 h-6 bg-[var(--Color-Surface-Surface-Brand)] rounded-full relative">
              <div class="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
            </div>
          </div>

                     <!-- SMS Notifications -->
           <div class="flex items-center justify-between p-4 bg-gray-25 dark:bg-gray-600 rounded-lg">
            <div>
              <h3 class="font-medium text-[var(--Color-Text-Text-Primary)]">
                {{ $t('smsNotifications') || 'SMS Notifications' }}
              </h3>
              <p class="text-sm text-[var(--Color-Text-Text-Secondary)]">
                {{ $t('smsNotificationsDesc') || 'Receive notifications via SMS' }}
              </p>
            </div>
            <div class="w-12 h-6 bg-[var(--Color-Surface-Surface-Secondary)] rounded-full relative">
              <div class="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
            </div>
          </div>

                     <!-- Push Notifications -->
           <div class="flex items-center justify-between p-4 bg-gray-25 dark:bg-gray-600 rounded-lg">
            <div>
              <h3 class="font-medium text-[var(--Color-Text-Text-Primary)]">
                {{ $t('pushNotifications') || 'Push Notifications' }}
              </h3>
              <p class="text-sm text-[var(--Color-Text-Text-Secondary)]">
                {{ $t('pushNotificationsDesc') || 'Receive push notifications in browser' }}
              </p>
            </div>
            <div class="w-12 h-6 bg-[var(--Color-Surface-Surface-Brand)] rounded-full relative">
              <div class="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Privacy Settings -->
      <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6">
        <div class="flex items-center mb-4">
          <div class="w-10 h-10 bg-[var(--Colors-Success-500)] rounded-lg flex items-center justify-center mr-3">
            <i class="fas fa-lock text-white"></i>
          </div>
          <h2 class="text-xl font-semibold text-[var(--Color-Text-Text-Primary)]">
            {{ $t('privacy') || 'Privacy' }}
          </h2>
        </div>
        
        <div class="space-y-4">
                     <!-- Profile Visibility -->
           <div class="flex items-center justify-between p-4 bg-gray-25 dark:bg-gray-600 rounded-lg">
            <div>
              <h3 class="font-medium text-[var(--Color-Text-Text-Primary)]">
                {{ $t('profileVisibility') || 'Profile Visibility' }}
              </h3>
              <p class="text-sm text-[var(--Color-Text-Text-Secondary)]">
                {{ $t('profileVisibilityDesc') || 'Control who can see your profile' }}
              </p>
            </div>
            <select class="px-3 py-2 border border-[var(--Color-Boarder-Border-Primary)] rounded-lg bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)]">
              <option>{{ $t('public') || 'Public' }}</option>
              <option>{{ $t('private') || 'Private' }}</option>
              <option>{{ $t('friendsOnly') || 'Friends Only' }}</option>
            </select>
          </div>

                     <!-- Data Sharing -->
           <div class="flex items-center justify-between p-4 bg-gray-25 dark:bg-gray-600 rounded-lg">
            <div>
              <h3 class="font-medium text-[var(--Color-Text-Text-Primary)]">
                {{ $t('dataSharing') || 'Data Sharing' }}
              </h3>
              <p class="text-sm text-[var(--Color-Text-Text-Secondary)]">
                {{ $t('dataSharingDesc') || 'Allow sharing of your data for analytics' }}
              </p>
            </div>
            <div class="w-12 h-6 bg-[var(--Color-Surface-Surface-Secondary)] rounded-full relative">
              <div class="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Account Actions -->
      <div class="bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6">
        <div class="flex items-center mb-4">
          <div class="w-10 h-10 bg-[var(--Colors-Error-400)] rounded-lg flex items-center justify-center mr-3">
            <i class="fas fa-exclamation-triangle text-white"></i>
          </div>
          <h2 class="text-xl font-semibold text-[var(--Color-Text-Text-Primary)]">
            {{ $t('dangerZone') || 'Danger Zone' }}
          </h2>
        </div>
        
        <div class="space-y-4">
                     <!-- Deactivate Account -->
           <div class="p-4 bg-gray-25 dark:bg-gray-600 rounded-lg">
            <h3 class="font-medium text-[var(--Color-Text-Text-Primary)] mb-2">
              {{ $t('deactivateAccount') || 'Deactivate Account' }}
            </h3>
            <p class="text-sm text-[var(--Color-Text-Text-Secondary)] mb-3">
              {{ $t('deactivateAccountDesc') || 'Temporarily disable your account. You can reactivate it anytime.' }}
            </p>
            <button class="px-4 py-2 bg-[var(--Colors-Warning-400)] text-white rounded-lg hover:bg-[var(--Colors-Warning-500)] transition">
              {{ $t('deactivate') || 'Deactivate' }}
            </button>
          </div>

                     <!-- Delete Account -->
           <div class="p-4 bg-gray-25 dark:bg-gray-600 rounded-lg">
            <h3 class="font-medium text-[var(--Color-Text-Text-Primary)] mb-2">
              {{ $t('deleteAccount') || 'Delete Account' }}
            </h3>
            <p class="text-sm text-[var(--Color-Text-Text-Secondary)] mb-3">
              {{ $t('deleteAccountDesc') || 'Permanently delete your account and all associated data. This action cannot be undone.' }}
            </p>
            <button class="px-4 py-2 bg-[var(--Colors-Error-400)] text-white rounded-lg hover:bg-[var(--Colors-Error-500)] transition">
              {{ $t('deleteAccount') || 'Delete Account' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Component logic can be added here
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