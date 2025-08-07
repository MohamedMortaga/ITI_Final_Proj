<template>
  <div
    class="bg-[var(--Color-Surface-Surface-Primary)] dark:bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Border-Primary)] rounded-xl shadow-sm px-4 md:px-6 py-4 mx-auto mt-8 space-y-4"
  >
    <h2
      class="text-xl md:text-2xl font-medium text-center text-[var(--Color-Text-Text-Primary)] mb-4 font-nunito"
    >
      {{ isEdit ? $t("edit") : $t("addTool") }}
    </h2>
    <!-- Title -->
    <div class="mb-4">
      <label
        class="block text-sm font-medium text-[var(--Color-Text-Text-Primary)] dark:text-[var(--Color-Text-Text-Primary)] mb-1 font-nunito"
        >{{ $t("productTitle") }}</label
      >
      <input
        v-model="form.title"
        type="text"
        :placeholder="$t('productTitle')"
        class="w-full px-3 md:px-4 py-2 rounded-lg text-[var(--Color-Text-Text-Secondary)] dark:text-[var(--Color-Text-Text-Secondary)] border border-[var(--Color-Boarder-Border-Primary)] dark:border-[var(--Color-Boarder-Border-Primary)] bg-[var(--Color-Surface-Surface-Primary)] dark:bg-[var(--Color-Surface-Surface-Primary)] focus:outline-none focus:ring-2 focus:ring-[var(--Colors-Primary-500)] font-nunito"
        required
      />
    </div>

    <!-- Image Uploads -->
    <div class="mb-4">
      <label
        class="block text-sm font-medium text-[var(--Color-Text-Text-Primary)] dark:text-[var(--Color-Text-Text-Primary)] mb-3 font-nunito"
        >{{ $t("productImages") }} ({{ $t("upTo3Images") }})</label
      >

      <!-- Image 1 -->
      <div class="mb-4">
        <label
          class="block text-xs text-[var(--Color-Text-Text-Secondary)] mb-2 font-nunito font-medium"
          >{{ $t("image1") }} ({{ $t("required") }})</label
        >
        <div class="relative">
          <input
            type="file"
            @change="$emit('imageUpload', $event, 1)"
            accept="image/*"
            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            :disabled="uploading1"
            required
          />
          <div
            class="border-2 border-dashed border-[var(--Color-Boarder-Border-Primary)] dark:border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6 text-center hover:border-[var(--Colors-Primary-500)] hover:bg-[var(--Color-Surface-Surface-Secondary)] dark:hover:bg-[var(--Color-Surface-Surface-Secondary)] transition-all duration-300 bg-[var(--Color-Surface-Surface-Primary)] dark:bg-[var(--Color-Surface-Surface-Primary)] shadow-sm hover:shadow-md"
          >
            <div v-if="uploading1" class="space-y-3">
              <div
                class="mx-auto w-16 h-16 bg-[var(--Colors-Primary-100)] dark:bg-[var(--Colors-Primary-900)] rounded-full flex items-center justify-center"
              >
                <svg
                  class="h-8 w-8 text-[var(--Colors-Primary-500)] animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 12a8 8 0 0116 0 8 8 0 01-16 0"
                  ></path>
                </svg>
              </div>
              <p
                class="text-sm font-medium text-[var(--Color-Text-Text-Primary)] dark:text-[var(--Color-Text-Text-Primary)] font-nunito"
              >
                {{ $t("uploading") || "Uploading..." }}
              </p>
            </div>
            <div v-else-if="!form.image1" class="space-y-3">
              <div
                class="mx-auto w-16 h-16 bg-[var(--Colors-Primary-100)] dark:bg-[var(--Colors-Primary-900)] rounded-full flex items-center justify-center"
              >
                <svg
                  class="h-8 w-8 text-[var(--Colors-Primary-500)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
              </div>
              <div>
                <p
                  class="text-sm font-medium text-[var(--Color-Text-Text-Primary)] dark:text-[var(--Color-Text-Text-Primary)] font-nunito"
                >
                  {{ $t("clickToUpload") || "Click to upload" }}
                </p>
                <p
                  class="text-xs text-[var(--Color-Text-Text-Secondary)] font-nunito mt-1"
                >
                  {{ $t("orDragAndDrop") || "or drag and drop" }}
                </p>
              </div>
            </div>
            <div v-else class="space-y-3">
              <div
                class="mx-auto w-16 h-16 bg-[var(--Colors-Success-100)] dark:bg-[var(--Colors-Success-900)] rounded-full flex items-center justify-center"
              >
                <svg
                  class="h-8 w-8 text-[var(--Colors-Success-500)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <div>
                <p
                  class="text-sm font-medium text-[var(--Colors-Success-500)] font-nunito"
                >
                  {{ $t("imageUploaded") || "Image uploaded" }}
                </p>
                <p
                  class="text-xs text-[var(--Color-Text-Text-Secondary)] font-nunito mt-1"
                >
                  {{ $t("imageReady") || "Image ready" }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div v-if="form.image1" class="mt-4 relative group">
          <div
            class="relative overflow-hidden rounded-xl border border-[var(--Color-Boarder-Border-Primary)] dark:border-[var(--Color-Boarder-Border-Primary)] shadow-lg"
          >
            <img
              :key="form.image1"
              :src="form.image1"
              :alt="$t('image1')"
              class="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div
              class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"
            ></div>
            <button
              type="button"
              @click="$emit('removeImage', 1)"
              class="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-all duration-200 shadow-lg hover:shadow-xl opacity-0 group-hover:opacity-100"
              title="Remove image"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Image 2 -->
      <div class="mb-4">
        <label
          class="block text-xs text-[var(--Color-Text-Text-Secondary)] mb-2 font-nunito font-medium"
          >{{ $t("image2") }} ({{ $t("optional") }})</label
        >
        <div class="relative">
          <input
            type="file"
            @change="$emit('imageUpload', $event, 2)"
            accept="image/*"
            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            :disabled="uploading2"
          />
          <div
            class="border-2 border-dashed border-[var(--Color-Boarder-Border-Primary)] dark:border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6 text-center hover:border-[var(--Colors-Primary-500)] hover:bg-[var(--Color-Surface-Surface-Secondary)] dark:hover:bg-[var(--Color-Surface-Surface-Secondary)] transition-all duration-300 bg-[var(--Color-Surface-Surface-Primary)] dark:bg-[var(--Color-Surface-Surface-Primary)] shadow-sm hover:shadow-md"
          >
            <div v-if="uploading2" class="space-y-3">
              <div
                class="mx-auto w-16 h-16 bg-[var(--Colors-Primary-100)] dark:bg-[var(--Colors-Primary-900)] rounded-full flex items-center justify-center"
              >
                <svg
                  class="h-8 w-8 text-[var(--Colors-Primary-500)] animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 12a8 8 0 0116 0 8 8 0 01-16 0"
                  ></path>
                </svg>
              </div>
              <p
                class="text-sm font-medium text-[var(--Color-Text-Text-Primary)] dark:text-[var(--Color-Text-Text-Primary)] font-nunito"
              >
                {{ $t("uploading") || "Uploading..." }}
              </p>
            </div>
            <div v-else-if="!form.image2" class="space-y-3">
              <div
                class="mx-auto w-16 h-16 bg-[var(--Colors-Primary-100)] dark:bg-[var(--Colors-Primary-900)] rounded-full flex items-center justify-center"
              >
                <svg
                  class="h-8 w-8 text-[var(--Colors-Primary-500)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
              </div>
              <div>
                <p
                  class="text-sm font-medium text-[var(--Color-Text-Text-Primary)] dark:text-[var(--Color-Text-Text-Primary)] font-nunito"
                >
                  {{ $t("clickToUpload") || "Click to upload" }}
                </p>
                <p
                  class="text-xs text-[var(--Color-Text-Text-Secondary)] font-nunito mt-1"
                >
                  {{ $t("orDragAndDrop") || "or drag and drop" }}
                </p>
              </div>
            </div>
            <div v-else class="space-y-3">
              <div
                class="mx-auto w-16 h-16 bg-[var(--Colors-Success-100)] dark:bg-[var(--Colors-Success-900)] rounded-full flex items-center justify-center"
              >
                <svg
                  class="h-8 w-8 text-[var(--Colors-Success-500)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <div>
                <p
                  class="text-sm font-medium text-[var(--Colors-Success-500)] font-nunito"
                >
                  {{ $t("imageUploaded") || "Image uploaded" }}
                </p>
                <p
                  class="text-xs text-[var(--Color-Text-Text-Secondary)] font-nunito mt-1"
                >
                  {{ $t("imageReady") || "Image ready" }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div v-if="form.image2" class="mt-4 relative group">
          <div
            class="relative overflow-hidden rounded-xl border border-[var(--Color-Boarder-Border-Primary)] dark:border-[var(--Color-Boarder-Border-Primary)] shadow-lg"
          >
            <img
              :key="form.image2"
              :src="form.image2"
              :alt="$t('image2')"
              class="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div
              class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"
            ></div>
            <button
              type="button"
              @click="$emit('removeImage', 2)"
              class="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-all duration-200 shadow-lg hover:shadow-xl opacity-0 group-hover:opacity-100"
              title="Remove image"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Image 3 -->
      <div class="mb-4">
        <label
          class="block text-xs text-[var(--Color-Text-Text-Secondary)] mb-2 font-nunito font-medium"
          >{{ $t("image3") }} ({{ $t("optional") }})</label
        >
        <div class="relative">
          <input
            type="file"
            @change="$emit('imageUpload', $event, 3)"
            accept="image/*"
            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            :disabled="uploading3"
          />
          <div
            class="border-2 border-dashed border-[var(--Color-Boarder-Border-Primary)] dark:border-[var(--Color-Boarder-Border-Primary)] rounded-xl p-6 text-center hover:border-[var(--Colors-Primary-500)] hover:bg-[var(--Color-Surface-Surface-Secondary)] dark:hover:bg-[var(--Color-Surface-Surface-Secondary)] transition-all duration-300 bg-[var(--Color-Surface-Surface-Primary)] dark:bg-[var(--Color-Surface-Surface-Primary)] shadow-sm hover:shadow-md"
          >
            <div v-if="uploading3" class="space-y-3">
              <div
                class="mx-auto w-16 h-16 bg-[var(--Colors-Primary-100)] dark:bg-[var(--Colors-Primary-900)] rounded-full flex items-center justify-center"
              >
                <svg
                  class="h-8 w-8 text-[var(--Colors-Primary-500)] animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 12a8 8 0 0116 0 8 8 0 01-16 0"
                  ></path>
                </svg>
              </div>
              <p
                class="text-sm font-medium text-[var(--Color-Text-Text-Primary)] dark:text-[var(--Color-Text-Text-Primary)] font-nunito"
              >
                {{ $t("uploading") || "Uploading..." }}
              </p>
            </div>
            <div v-else-if="!form.image3" class="space-y-3">
              <div
                class="mx-auto w-16 h-16 bg-[var(--Colors-Primary-100)] dark:bg-[var(--Colors-Primary-900)] rounded-full flex items-center justify-center"
              >
                <svg
                  class="h-8 w-8 text-[var(--Colors-Primary-500)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
              </div>
              <div>
                <p
                  class="text-sm font-medium text-[var(--Color-Text-Text-Primary)] dark:text-[var(--Color-Text-Text-Primary)] font-nunito"
                >
                  {{ $t("clickToUpload") || "Click to upload" }}
                </p>
                <p
                  class="text-xs text-[var(--Color-Text-Text-Secondary)] font-nunito mt-1"
                >
                  {{ $t("orDragAndDrop") || "or drag and drop" }}
                </p>
              </div>
            </div>
            <div v-else class="space-y-3">
              <div
                class="mx-auto w-16 h-16 bg-[var(--Colors-Success-100)] dark:bg-[var(--Colors-Success-900)] rounded-full flex items-center justify-center"
              >
                <svg
                  class="h-8 w-8 text-[var(--Colors-Success-500)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <div>
                <p
                  class="text-sm font-medium text-[var(--Colors-Success-500)] font-nunito"
                >
                  {{ $t("imageUploaded") || "Image uploaded" }}
                </p>
                <p
                  class="text-xs text-[var(--Color-Text-Text-Secondary)] font-nunito mt-1"
                >
                  {{ $t("imageReady") || "Image ready" }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div v-if="form.image3" class="mt-4 relative group">
          <div
            class="relative overflow-hidden rounded-xl border border-[var(--Color-Boarder-Border-Primary)] dark:border-[var(--Color-Boarder-Border-Primary)] shadow-lg"
          >
            <img
              :key="form.image3"
              :src="form.image3"
              :alt="$t('image3')"
              class="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div
              class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"
            ></div>
            <button
              type="button"
              @click="$emit('removeImage', 3)"
              class="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-all duration-200 shadow-lg hover:shadow-xl opacity-0 group-hover:opacity-100"
              title="Remove image"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Category -->
    <div class="mb-4">
      <label
        class="block text-sm font-medium text-[var(--Color-Text-Text-Primary)] dark:text-[var(--Color-Text-Text-Primary)] mb-1 font-nunito"
        >{{ $t("selectCategory") }}</label
      >
      <select
        v-model="form.category"
        class="w-full px-3 md:px-4 py-2 rounded-lg border border-[var(--Color-Boarder-Border-Primary)] dark:border-[var(--Color-Boarder-Border-Primary)] bg-[var(--Color-Surface-Surface-Primary)] dark:bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Secondary)] dark:text-[var(--Color-Text-Text-Secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--Colors-Primary-500)] font-nunito"
        required
      >
        <option disabled value="">{{ $t("selectCategory") }}</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.name">
          {{ cat.name }}
        </option>
      </select>
    </div>
    <!-- Price -->
    <div class="mb-4">
      <label
        class="block text-sm font-medium text-[var(--Color-Text-Text-Primary)] dark:text-[var(--Color-Text-Text-Primary)] mb-1 font-nunito"
        >{{ $t("price") }}</label
      >
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
      <label
        class="block text-sm font-medium text-[var(--Color-Text-Text-Primary)] dark:text-[var(--Color-Text-Text-Primary)] mb-1 font-nunito"
        >{{ $t("selectLocation") }}</label
      >
      <select
        v-model="form.location"
        class="w-full px-3 md:px-4 py-2 rounded-lg border border-[var(--Color-Boarder-Border-Primary)] dark:border-[var(--Color-Boarder-Border-Primary)] bg-[var(--Color-Surface-Surface-Primary)] dark:bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Secondary)] dark:text-[var(--Color-Text-Text-Secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--Colors-Primary-500)] font-nunito"
        required
      >
        <option disabled value="">{{ $t("selectLocation") }}</option>
        <option value="cairo">{{ $t("cairo") }}</option>
        <option value="alexandria">{{ $t("alexandria") }}</option>
        <option value="mansoura">{{ $t("mansoura") }}</option>
        <option value="giza">{{ $t("giza") }}</option>
        <option value="sharmElSheikh">{{ $t("sharmElSheikh") }}</option>
        <option value="hurghada">{{ $t("hurghada") }}</option>
        <option value="luxor">{{ $t("luxor") }}</option>
        <option value="aswan">{{ $t("aswan") }}</option>
        <option value="portSaid">{{ $t("portSaid") }}</option>
        <option value="suez">{{ $t("suez") }}</option>
        <option value="ismailia">{{ $t("ismailia") }}</option>
        <option value="beniSuef">{{ $t("beniSuef") }}</option>
        <option value="minya">{{ $t("minya") }}</option>
        <option value="assiut">{{ $t("assiut") }}</option>
        <option value="sohag">{{ $t("sohag") }}</option>
        <option value="qena">{{ $t("qena") }}</option>
        <option value="redSea">{{ $t("redSea") }}</option>
        <option value="newValley">{{ $t("newValley") }}</option>
        <option value="matruh">{{ $t("matruh") }}</option>
        <option value="northSinai">{{ $t("northSinai") }}</option>
        <option value="southSinai">{{ $t("southSinai") }}</option>
        <option value="beheira">{{ $t("beheira") }}</option>
        <option value="gharbiya">{{ $t("gharbiya") }}</option>
        <option value="kafrElSheikh">{{ $t("kafrElSheikh") }}</option>
        <option value="dakahlia">{{ $t("dakahlia") }}</option>
        <option value="sharqiya">{{ $t("sharqiya") }}</option>
        <option value="qalyubiya">{{ $t("qalyubiya") }}</option>
        <option value="monufiya">{{ $t("monufiya") }}</option>
        <option value="fayoum">{{ $t("fayoum") }}</option>
      </select>
    </div>
    <!-- Net Profit -->
    <div class="mb-4">
      <label
        class="block text-sm font-medium text-[var(--Color-Text-Text-Primary)] dark:text-[var(--Color-Text-Text-Primary)] mb-1 font-nunito"
        >{{ $t("netProfit") }}</label
      >
      <input
        :value="netProfit"
        type="number"
        readonly
        class="w-full px-3 md:px-4 py-2 bg-gray-25 dark:bg-gray-600 rounded-lg border border-[var(--Color-Boarder-Border-Primary)] dark:border-[var(--Color-Boarder-Border-Primary)] dark:text-gray-200 focus:outline-none font-nunito"
      />
    </div>
    <!-- Details -->
    <div class="mb-6">
      <label
        class="block text-sm font-medium text-[var(--Color-Text-Text-Primary)] dark:text-[var(--Color-Text-Text-Primary)] mb-1 font-nunito"
        >{{ $t("details") }}</label
      >
      <textarea
        v-model="form.details"
        :placeholder="$t('productDetailsPlaceholder')"
        rows="4"
        class="w-full px-3 md:px-4 py-2 rounded-lg border border-[var(--Color-Boarder-Border-Primary)] dark:border-[var(--Color-Boarder-Border-Primary)] bg-[var(--Color-Surface-Surface-Primary)] dark:bg-[var(--Color-Surface-Surface-Primary)] text-[var(--Color-Text-Text-Secondary)] dark:text-[var(--Color-Text-Text-Secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--Colors-Primary-500)] font-nunito"
      ></textarea>
    </div>
    <!-- Submit Button -->
    <button
      type="button"
      @click="$emit('submitForm')"
      class="w-full bg-[var(--Color-Surface-Surface-Brand)] hover:bg-[var(--Colors-Primary-600)] transition text-white font-semibold py-3 px-6 rounded-lg font-nunito"
    >
      {{ isEdit ? $t("edit") : $t("addTool") }}
    </button>
    <button
      type="button"
      class="w-full bg-[var(--Color-Surface-Surface-Primary)] border border-[var(--Color-Boarder-Surface-Brand)] dark:bg-[var(--Color-Surface-Surface-Primary)] transition text-[var(--Color-Text-Text-Brand)] font-semibold py-3 px-6 rounded-lg mt-2 font-nunito"
      @click="$emit('cancelForm')"
    >
      {{ $t("cancel") || "Cancel" }}
    </button>
  </div>
</template>

<script setup>
import { computed } from "vue";

const { form, categories, isEdit, uploading1, uploading2, uploading3 } = defineProps({
  form: Object,
  categories: Array,
  isEdit: Boolean,
  uploading1: Boolean,
  uploading2: Boolean,
  uploading3: Boolean,
});

const commissionRate = 0.15;

const netProfit = computed(() => {
  try {
    if (!form.price) return 0;
    return form.price - form.price * commissionRate;
  } catch (e) {
    console.error("Error in netProfit computed:", e);
    return 0;
  }
});

defineEmits(["submitForm", "imageUpload", "removeImage"]);
</script>

<style>
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
