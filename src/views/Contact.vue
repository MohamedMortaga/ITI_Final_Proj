<template>
  <div class="min-h-screen flex items-center justify-center bg-white px-[88px] overflow-y-hidden dark:bg-gray-900">
    <div class="max-w-6xl w-full flex flex-col lg:flex-row items-center justify-between xl:max-w-7xl 2xl:max-w-[1500px]">
      <!-- Form Section -->
      <div class="w-full lg:w-1/2 p-6 lg:p-10 xl:p-12 dark:bg-gray-800 dark:text-gray-200">
        <form class="space-y-4 xl:space-y-4 border border-gray-200 rounded-lg p-6">
          <h2 class="text-2xl font-semibold mb-4 lg:text-2xl xl:text-3xl">Send Us a Message</h2>
          <p class="font-semibold mb-1 lg:text-base xl:text-lg dark:text-gray-300">Got a question or feedback? We're listening.</p>
          <p class="text-gray-600 mb-6 lg:text-base xl:text-lg dark:text-gray-300">
            Fill out the form and we'll get back to you as soon as possible.
          </p>

          <!-- Name -->
          <div>
            <label for="name" class="block text-sm font-bold text-gray-900 mb-1 lg:text-sm xl:text-base dark:text-gray-200">Name</label>
            <input
              id="name"
              type="text"
              placeholder="Enter your Name"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm lg:text-sm xl:text-base bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
          </div>
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-bold text-gray-900 mb-1 lg:text-sm xl:text-base dark:text-gray-200">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email address"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm lg:text-sm xl:text-base bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
          </div>
          <!-- Message -->
          <div>
            <label for="message" class="block text-sm font-bold text-gray-900 mb-1 lg:text-sm xl:text-base dark:text-gray-200">Your Message</label>
            <textarea
              id="message"
              placeholder="Enter your message Details"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm lg:text-sm xl:text-base bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              rows="4"
            ></textarea>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            class="w-full bg-teal-600 text-white rounded-md py-3 font-semibold hover:bg-teal-700 lg:py-3 xl:py-4 xl:text-lg"
          >
            Send Message
          </button>
        </form>
      </div>

      <!-- Map Image -->
      <div class="hidden lg:flex w-full lg:w-1/2 mt-8 lg:mt-0 items-stretch">
        <img
          src="../assets/map.jpg"
          alt="Map Illustration"
          class="w-full h-full object-cover rounded-lg"
          style="min-height: 100%; min-width: 100%;"
          loading="lazy"
        />
      </div>

      
    </div>
    <!-- Get in Touch Section -->
  </div>
  <div class="w-full mt-10 text-center flex flex-col items-center justify-center">
    <h2 class="text-2xl font-semibold mb-4 lg:text-2xl xl:text-3xl">Get in Touch</h2>
    <p class="text-gray-600 mb-6 lg:text-base xl:text-lg dark:text-gray-300 max-w-2xl mx-auto">
      Here are other ways to contact us — whether by phone, email, or visiting us in person. We're always happy to connect.
    </p>
    <div class="flex flex-col md:flex-row justify-center items-center md:space-x-10 space-y-6 md:space-y-0">
      <div class="flex flex-col items-center">
        <span class="inline-flex items-center justify-center w-12 h-12 mb-2 rounded-full bg-white border border-gray-300">
          <svg class="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 12v1a4 4 0 01-8 0v-1m8 0V8a4 4 0 00-8 0v4m8 0H8"></path></svg>
        </span>
        <p class="text-gray-600">Email</p>
        <p class="font-bold text-teal-600">support@example.com</p>
      </div>
      <div class="flex flex-col items-center">
        <span class="inline-flex items-center justify-center w-12 h-12 mb-2 rounded-full bg-white border border-gray-300">
          <svg class="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm0 8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2zm8-8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
        </span>
        <p class="text-gray-600">Phone</p>
        <p class="font-bold text-teal-600">+1 234 567 890</p>
      </div>
      <div class="flex flex-col items-center">
        <span class="inline-flex items-center justify-center w-12 h-12 mb-2 rounded-full bg-white border border-gray-300">
          <svg class="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 12.414a2 2 0 00-2.828 0l-4.243 4.243a8 8 0 1111.314 0z"></path><circle cx="12" cy="8" r="4"></circle></svg>
        </span>
        <p class="text-gray-600">Location</p>
        <p class="font-bold text-teal-600">123 Main Street, Cairo, Egypt</p>
      </div>
    </div>
  </div>
   <!-- Footer -->
  <AppFooter class="mt-16" />
</template>

<script>
import AppFooter from '../components/pages/AppFooter.vue';

export default {
  components: {
    AppFooter
  }
};
</script>

<style scoped>
input:-webkit-autofill {
  box-shadow: 0 0 0px 1000px #ffffff inset !important;
  -webkit-text-fill-color: #000 !important;
  border: 1px solid #737373 !important;
  transition: background-color 5000s ease-in-out 0s;
}
.dark input:-webkit-autofill {
  box-shadow: 0 0 0px 1000px #1a1a1a inset !important;
  -webkit-text-fill-color: #d1d5db !important;
  border: 1px solid #4b5563 !important;
}
</style>