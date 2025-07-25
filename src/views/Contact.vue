<template>
  <div
    class="min-h-screen flex items-center justify-center bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)] px-[88px] overflow-y-hidden"
  >
    <div
      class="max-w-6xl w-full flex flex-col lg:flex-row items-center justify-between xl:max-w-7xl 2xl:max-w-[1500px] bg-[var(--Color-Surface-Surface-Primary)]"
    >
      <!-- Form Section -->
      <div
        class="w-full p-0 md:p-6 lg:w-1/2 lg:p-10 xl:p-12 bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)]"
      >
        <form
          class="space-y-4 xl:space-y-4 border border-[var(--Color-Boarder-Border-Primary)] rounded-lg p-6 bg-[var(--Color-Surface-Surface-Primary)]"
        >
          <h2
            class="text-2xl font-semibold mb-4 lg:text-2xl xl:text-3xl text-[var(--Color-Text-Text-Primary)]"
          >
            Send Us a Message
          </h2>
          <p
            class="font-semibold mb-1 lg:text-base xl:text-lg text-[var(--Color-Text-Text-Secondary)]"
          >
            Got a question or feedback? We're listening.
          </p>
          <p class="text-[var(--Color-Text-Text-Secondary)] mb-6 lg:text-base xl:text-lg">
            Fill out the form and we'll get back to you as soon as possible.
          </p>

          <!-- Name -->
          <div>
            <label
              for="name"
              class="block text-sm font-bold text-[var(--Color-Text-Text-Primary)] mb-1 lg:text-sm xl:text-base"
              >Name</label
            >
            <input
              id="name"
              type="text"
              placeholder="Enter your Name"
              class="w-full px-3 py-2 border border-[var(--Color-Boarder-Border-Primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--Color-Text-Text-Brand)] text-sm lg:text-sm xl:text-base bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)]"
            />
          </div>
          <!-- Email -->
          <div>
            <label
              for="email"
              class="block text-sm font-bold text-[var(--Color-Text-Text-Primary)] mb-1 lg:text-sm xl:text-base"
              >Email</label
            >
            <input
              id="email"
              type="email"
              placeholder="Enter your email address"
              class="w-full px-3 py-2 border border-[var(--Color-Boarder-Border-Primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--Color-Text-Text-Brand)] text-sm lg:text-sm xl:text-base bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)]"
            />
          </div>
          <!-- Message -->
          <div>
            <label
              for="message"
              class="block text-sm font-bold text-[var(--Color-Text-Text-Primary)] mb-1 lg:text-sm xl:text-base"
              >Your Message</label
            >
            <textarea
              id="message"
              placeholder="Enter your message Details"
              class="w-full px-3 py-2 border border-[var(--Color-Boarder-Border-Primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--Color-Text-Text-Brand)] text-sm lg:text-sm xl:text-base bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Primary)]"
              rows="4"
            ></textarea>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            class="w-full bg-[var(--Color-Surface-Surface-Brand)] text-[var(--Color-Text-Text-Invert)] rounded-md py-3 font-semibold hover:bg-[var(--Color-Text-Text-Brand)] hover:text-[var(--Color-Text-Text-Invert)] lg:py-3 xl:py-4 xl:text-lg"
          >
            Send Message
          </button>
        </form>
      </div>

      <!-- Map Image -->
      <div class="hidden lg:flex w-full lg:w-1/2 mt-8 lg:mt-0 items-stretch">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3454.021964024052!2d31.23571131511663!3d30.04441998187909!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145841f6e2b2e7e3%3A0x7e1e8b4a3e8e8e8e!2sCairo%2C%20Egypt!5e0!3m2!1sen!2seg!4v1681234567890!5m2!1sen!2seg"
          style="
            border: 0;
            border-radius: 0.5rem;
            width: 100%;
            height: 100%;
            aspect-ratio: 8/7;
          "
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          class="rounded-lg border border-[var(--Color-Boarder-Border-Primary)]"
        ></iframe>
      </div>
    </div>
    <!-- Get in Touch Section -->
  </div>
  <div
    class="w-full text-center flex flex-col items-center justify-center dark:bg-[var(--Color-Surface-Surface-Primary)] p-6"
  >
    <h2
      class="text-2xl font-semibold b-4 lg:text-2xl xl:text-3xl text-[var(--Color-Text-Text-Brand)]"
    >
      Get in Touch
    </h2>
    <p
      class="text-[var(--Color-Text-Text-Secondary)] mb-6 lg:text-base xl:text-lg max-w-2xl mx-auto"
    >
      Here are other ways to contact us — whether by phone, email, or visiting us in
      person. We're always happy to connect.
    </p>
    <div
      class="flex flex-col md:flex-row justify-center items-center md:space-x-10 space-y-6 md:space-y-0"
    >
      <div class="flex flex-col items-center">
        <span
          class="inline-flex items-center justify-center w-12 h-12 mb-2 rounded-full bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)]"
        >
          <img src="@/assets/Message.svg" alt="Email" class="w-6 h-6" />
        </span>
        <p class="text-[var(--Color-Text-Text-Secondary)]">Email</p>
        <p class="font-bold text-[var(--Color-Text-Text-Brand)]">support@example.com</p>
      </div>
      <div class="flex flex-col items-center">
        <span
          class="inline-flex items-center justify-center w-12 h-12 mb-2 rounded-full bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)]"
        >
          <img src="@/assets/Phone.svg" alt="Phone" class="w-6 h-6" />
        </span>
        <p class="text-[var(--Color-Text-Text-Secondary)]">Phone</p>
        <p class="font-bold text-[var(--Color-Text-Text-Brand)]">+1 234 567 890</p>
      </div>
      <div class="flex flex-col items-center">
        <span
          class="inline-flex items-center justify-center w-12 h-12 mb-2 rounded-full bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)]"
        >
          <img src="@/assets/Pin_alt.svg" alt="Location" class="w-6 h-6" />
        </span>
        <p class="text-[var(--Color-Text-Text-Secondary)]">Location</p>
        <p class="font-bold text-[var(--Color-Text-Text-Brand)]">
          123 Main Street, Cairo, Egypt
        </p>
      </div>
    </div>
  </div>
  <!-- Footer -->
  <AppFooter />
</template>

<script>
import AppFooter from "../components/pages/AppFooter.vue";

export default {
  components: {
    AppFooter,
  },
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
