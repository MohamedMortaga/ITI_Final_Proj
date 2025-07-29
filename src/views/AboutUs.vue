<template>
  <div class="min-h-screen about-us-page" :style="{ backgroundColor: 'var(--Color-Surface-Surface-Primary)', color: 'var(--Color-Text-Text-Primary)' }" :dir="$t('locale') === 'ar' ? 'rtl' : 'ltr'">
    <!-- Hero Section -->
    <div class="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[678px] bg-cover bg-center" :style="{ backgroundImage: `url(${handshakeImage})` }">
      <!-- Linear gradient overlay - darker at bottom -->
      <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
      <div class="relative z-10 flex items-center justify-center h-full text-center px-4" :style="{ marginTop: '-150px' }">
        <div class="text-white">
          <h1 class="text-4xl sm:text-6xl md:text-8xl lg:text-[128px] font-bold mb-0" :style="{ height: 'auto', minHeight: '60px', lineHeight: '1.1' }">{{ $t('aboutUs') }}</h1>
          <p class="text-lg sm:text-xl md:text-2xl lg:text-[32px] font-medium mt-2">{{ $t('makingToolsAccessible') }}</p>
        </div>
      </div>
    </div>

    <!-- Vision, Mission, Values Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" :style="{ marginTop: '-100px', position: 'relative', zIndex: '20' }">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        <!-- Vision Card -->
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 text-center">
          <div class="mx-auto mb-4 sm:mb-6 w-full max-w-[328px] h-48 sm:h-56 lg:h-[219px]">
            <img src="@/assets/retinal-biometrics-technology-with-man-s-eye-digital-remix.jpg" alt="Vision" class="w-full h-full object-cover rounded-lg" />
          </div>
          <h3 class="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-4">
            <span class="text-[var(--Color-Text-Text-Primary)]">{{ $t('ourVision').split(' ')[0] }}</span>
            <span class="text-[var(--Color-Text-Text-Brand)]"> {{ $t('ourVision').split(' ').slice(1).join(' ') }}</span>
          </h3>
          <p class="text-sm sm:text-base text-[var(--Color-Text-Text-Secondary)]">
            {{ $t('visionDescription') }}
          </p>
        </div>

        <!-- Mission Card -->
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 text-center">
          <div class="mx-auto mb-4 sm:mb-6 w-full max-w-[328px] h-48 sm:h-56 lg:h-[219px]">
            <img src="@/assets/business-strategy-success-target-goals.jpg" alt="Mission" class="w-full h-full object-cover rounded-lg" />
          </div>
          <h3 class="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-4">
            <span class="text-[var(--Color-Text-Text-Primary)]">{{ $t('ourMission').split(' ')[0] }}</span>
            <span class="text-[var(--Color-Text-Text-Brand)]"> {{ $t('ourMission').split(' ').slice(1).join(' ') }}</span>
          </h3>
          <p class="text-sm sm:text-base text-[var(--Color-Text-Text-Secondary)]">
            {{ $t('missionDescription') }}
          </p>
        </div>

        <!-- Values Card -->
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 text-center md:col-span-2 lg:col-span-1">
          <div class="mx-auto mb-4 sm:mb-6 w-full max-w-[328px] h-48 sm:h-56 lg:h-[219px]">
            <img src="@/assets/businessman-touching-glowing-increasing-arrow-business-profit-investment-growth-concept.jpg" alt="Core Values" class="w-full h-full object-cover rounded-lg" />
          </div>
          <h3 class="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-4">
            <span class="text-[var(--Color-Text-Text-Primary)]">{{ $t('ourCoreValues').split(' ')[0] }}</span>
            <span class="text-[var(--Color-Text-Text-Brand)]"> {{ $t('ourCoreValues').split(' ').slice(1).join(' ') }}</span>
          </h3>
          <p class="text-sm sm:text-base text-[var(--Color-Text-Text-Secondary)]">
            {{ $t('coreValuesDescription') }}
          </p>
        </div>
      </div>
    </div>

    <!-- Who we are Section -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-4 sm:mb-6 lg:mb-8">
        <span class="text-[var(--Color-Text-Text-Primary)]">{{ $t('whoWeAre').split(' ')[0] }}</span>
        <span class="text-[var(--Color-Text-Text-Brand)]"> {{ $t('whoWeAre').split(' ').slice(1).join(' ') }}</span>
      </h2>
      <p class="text-base sm:text-lg text-[var(--Color-Text-Text-Secondary)] text-center leading-relaxed">
        {{ $t('whoWeAreDescription') }}
      </p>
    </div>

    <!-- Statistics Section -->
    <div class="bg-[var(--Color-Text-Text-Brand)] py-8 sm:py-12 lg:py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center text-white">
          <div>
            <div class="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">+1200</div>
            <div class="text-sm sm:text-base lg:text-lg">{{ $t('users') }}</div>
          </div>
          <div>
            <div class="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">+800</div>
            <div class="text-sm sm:text-base lg:text-lg">{{ $t('satisfactionRate') }}</div>
          </div>
          <div>
            <div class="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">97%</div>
            <div class="text-sm sm:text-base lg:text-lg">{{ $t('toolsListed') }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- We Rent Anything Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-2 sm:mb-4">
        <span class="text-[var(--Color-Text-Text-Primary)]">{{ $t('weRentAnything').split(' ')[0] + ' ' + $t('weRentAnything').split(' ')[1] }}</span>
        <span class="text-[var(--Color-Text-Text-Brand)]"> {{ $t('weRentAnything').split(' ').slice(2).join(' ') }}</span>
      </h2>
      <p class="text-lg sm:text-xl text-center text-[var(--Color-Text-Text-Secondary)] mb-8 sm:mb-12">{{ $t('fromDrillsToDrones') }}</p>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-x-10 lg:gap-y-6 max-w-6xl mx-auto">
        <!-- Column 1 -->
        <div class="flex flex-col gap-2">
          <div class="bg-gray-100 rounded-lg overflow-hidden shadow-sm w-full h-32 sm:h-40 lg:h-[183px]">
            <img src="@/assets/side-view-woman-with-photo-camera.jpg" alt="Woman with camera" class="w-full h-full object-cover" />
          </div>
          <div class="bg-gray-100 rounded-lg overflow-hidden shadow-sm w-full h-40 sm:h-48 lg:h-[261px]">
            <img src="@/assets/top-view-photo-camera-indoors-still-life.jpg" alt="Camera indoors" class="w-full h-full object-cover" />
          </div>
        </div>
        
        <!-- Column 2 -->
        <div class="flex flex-col gap-2">
          <div class="bg-gray-100 rounded-lg overflow-hidden shadow-sm w-full h-44 sm:h-52 lg:h-[281px]">
            <img src="@/assets/shot-tent-outside-house.jpg" alt="Tent outside house" class="w-full h-full object-cover" />
          </div>
          <div class="bg-gray-100 rounded-lg overflow-hidden shadow-sm w-full h-32 sm:h-36 lg:h-[164px]">
            <img src="@/assets/hands-woman-sewing-face-masks.jpg" alt="Woman sewing masks" class="w-full h-full object-cover" />
          </div>
        </div>
        
        <!-- Column 3 -->
        <div class="flex flex-col gap-2">
          <div class="bg-gray-100 rounded-lg overflow-hidden shadow-sm w-full h-36 sm:h-44 lg:h-[185px]">
            <img src="@/assets/man-cutting-grass-with-lawn-mover-back-yard.jpg" alt="Man cutting grass" class="w-full h-full object-cover" />
          </div>
          <div class="bg-gray-100 rounded-lg overflow-hidden shadow-sm w-full h-40 sm:h-48 lg:h-[261px]">
            <img src="@/assets/campers-relax-by-fire-enjoy-tranquil-nature-generated-by-ai.jpg" alt="Campers by fire" class="w-full h-full object-cover" />
          </div>
        </div>
        
        <!-- Column 4 -->
        <div class="flex flex-col gap-2">
          <div class="bg-gray-100 rounded-lg overflow-hidden shadow-sm w-full h-44 sm:h-52 lg:h-[258px]">
            <img src="@/assets/close-up-journalism-camera.jpg" alt="Journalism camera" class="w-full h-full object-cover" />
          </div>
          <div class="bg-gray-100 rounded-lg overflow-hidden shadow-sm w-full h-36 sm:h-40 lg:h-[190px]">
            <img src="@/assets/2147892367.jpg" alt="Rental item" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>

    <!-- Why Rento Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12">
        <span class="text-[var(--Color-Text-Text-Primary)]">{{ $t('whyRento').split(' ')[0] }}</span>
        <span class="text-[var(--Color-Text-Text-Brand)]"> {{ $t('whyRento').split(' ').slice(1).join(' ') }}</span>
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <div class="flex items-start gap-3 sm:gap-4">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-[#2EBCA5] rounded-full flex items-center justify-center flex-shrink-0">
            <i class="fas fa-shopping-cart text-white text-sm sm:text-base"></i>
          </div>
          <div>
            <h3 class="text-lg sm:text-xl font-semibold text-[var(--Color-Text-Text-Primary)] mb-1 sm:mb-2">{{ $t('varietyOfTools') }}</h3>
            <p class="text-sm sm:text-base text-[var(--Color-Text-Text-Secondary)]">
              {{ $t('varietyOfToolsDescription') }}
            </p>
          </div>
        </div>
        
        <div class="flex items-start gap-3 sm:gap-4">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-[#2EBCA5] rounded-full flex items-center justify-center flex-shrink-0">
            <i class="fas fa-lock text-white text-sm sm:text-base"></i>
          </div>
          <div>
            <h3 class="text-lg sm:text-xl font-semibold text-[var(--Color-Text-Text-Primary)] mb-1 sm:mb-2">{{ $t('secureTransactions') }}</h3>
            <p class="text-sm sm:text-base text-[var(--Color-Text-Text-Secondary)]">
              {{ $t('secureTransactionsDescription') }}
            </p>
          </div>
        </div>
        
        <div class="flex items-start gap-3 sm:gap-4">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-[#2EBCA5] rounded-full flex items-center justify-center flex-shrink-0">
            <i class="fas fa-car text-white text-sm sm:text-base"></i>
          </div>
          <div>
            <h3 class="text-lg sm:text-xl font-semibold text-[var(--Color-Text-Text-Primary)] mb-1 sm:mb-2">{{ $t('flexibleOptions') }}</h3>
            <p class="text-sm sm:text-base text-[var(--Color-Text-Text-Secondary)]">
              {{ $t('flexibleOptionsDescription') }}
            </p>
          </div>
        </div>
        
        <div class="flex items-start gap-3 sm:gap-4">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-[#2EBCA5] rounded-full flex items-center justify-center flex-shrink-0">
            <i class="fas fa-sun text-white text-sm sm:text-base"></i>
          </div>
          <div>
            <h3 class="text-lg sm:text-xl font-semibold text-[var(--Color-Text-Text-Primary)] mb-1 sm:mb-2">{{ $t('ecoConscious') }}</h3>
            <p class="text-sm sm:text-base text-[var(--Color-Text-Text-Secondary)]">
              {{ $t('ecoConsciousDescription') }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Meet our Team Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12">
        <span class="text-[var(--Color-Text-Text-Primary)]">{{ $t('meetOurTeam').split(' ')[0] + ' ' + $t('meetOurTeam').split(' ')[1] }}</span>
        <span class="text-[var(--Color-Text-Text-Brand)]"> {{ $t('meetOurTeam').split(' ').slice(2).join(' ') }}</span>
      </h2>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-8">
        <div class="text-center sm:text-left">
          <div class="mx-auto mb-4 w-full max-w-[220px] h-64 sm:h-72 lg:h-[295px] border-radius-16 overflow-hidden">
            <img src="@/assets/MTXX_ai_image_restoration_batch_1732159280181.jpg" alt="Team member" class="w-full h-full object-cover" style="object-position: center 30%;" />
          </div>
          <h4 class="font-bold text-[var(--Color-Text-Text-Primary)] text-sm sm:text-base">{{ $t('locale') === 'ar' ? 'كارين اسامه' : 'Karin Osama' }}</h4>
          <p class="text-xs sm:text-sm text-[var(--Color-Text-Text-Secondary)]">{{ $t('uiuxDeveloper') }}</p>
        </div>
        
        <div class="text-center sm:text-left">
          <div class="mx-auto mb-4 w-full max-w-[220px] h-64 sm:h-72 lg:h-[295px] border-radius-16 overflow-hidden">
            <img src="@/assets/صورة واتساب بتاريخ 1447-02-03 في 20.23.32_1d6d7289.jpg" alt="Team member" class="w-full h-full object-cover" style="object-position: center 30%;" />
          </div>
          <h4 class="font-bold text-[var(--Color-Text-Text-Primary)] text-sm sm:text-base">{{ $t('locale') === 'ar' ? 'مارينا عاطف' : 'Marina Atef' }}</h4>
          <p class="text-xs sm:text-sm text-[var(--Color-Text-Text-Secondary)]">{{ $t('uiuxDeveloper') }}</p>
        </div>
        
        <div class="text-center sm:text-left">
          <div class="mx-auto mb-4 w-full max-w-[220px] h-64 sm:h-72 lg:h-[295px] border-radius-16 overflow-hidden">
            <img src="@/assets/صورة واتساب بتاريخ 1447-02-03 في 20.32.07_8f0a4def.jpg" alt="Team member" class="w-full h-full object-cover" style="object-position: center 30%;" />
          </div>
          <h4 class="font-bold text-[var(--Color-Text-Text-Primary)] text-sm sm:text-base">{{ $t('locale') === 'ar' ? 'محمد مرتجى' : 'Mohammed Mortaga' }}</h4>
          <p class="text-xs sm:text-sm text-[var(--Color-Text-Text-Secondary)]">{{ $t('uiuxDeveloper') }}</p>
        </div>
        
        <div class="text-center sm:text-left">
          <div class="mx-auto mb-4 w-full max-w-[220px] h-64 sm:h-72 lg:h-[295px] border-radius-16 overflow-hidden">
            <img src="@/assets/صورة واتساب بتاريخ 1447-02-03 في 20.25.12_16057849.jpg" alt="Team member" class="w-full h-full object-cover" style="object-position: center 30%;" />
          </div>
          <h4 class="font-bold text-[var(--Color-Text-Text-Primary)] text-sm sm:text-base">{{ $t('locale') === 'ar' ? 'روان محمد' : 'Rawan Mohammed' }}</h4>
          <p class="text-xs sm:text-sm text-[var(--Color-Text-Text-Secondary)]">{{ $t('uiuxDeveloper') }}</p>
        </div>
        
        <div class="text-center sm:text-left">
          <div class="mx-auto mb-4 w-full max-w-[220px] h-64 sm:h-72 lg:h-[295px] border-radius-16 overflow-hidden">
            <img src="@/assets/صورة واتساب بتاريخ 1447-02-04 في 03.21.56_84be7479.jpg" alt="Team member" class="w-full h-full object-cover" style="object-position: center 30%;" />
          </div>
          <h4 class="font-bold text-[var(--Color-Text-Text-Primary)] text-sm sm:text-base">{{ $t('locale') === 'ar' ? 'سما ابراهيم' : 'Sama Ibrahim' }}</h4>
          <p class="text-xs sm:text-sm text-[var(--Color-Text-Text-Secondary)]">{{ $t('uiuxDeveloper') }}</p>
        </div>
      </div>
    </div>

    <!-- Join us now Section -->
    <div class="py-8 sm:py-12 lg:py-16" :style="{ backgroundColor: 'var(--Color-Surface-Surface-Primary)' }">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div>
            <h2 class="text-3xl sm:text-5xl md:text-7xl lg:text-[96px] font-bold mb-4 sm:mb-6">
              <div class="text-[var(--Color-Text-Text-Brand)]">{{ $t('joinUsNow').split(' ')[0] + ' ' + $t('joinUsNow').split(' ')[1] }}</div>
              <div class="text-[var(--Color-Text-Text-Primary)]">{{ $t('joinUsNow').split(' ').slice(2).join(' ') }}</div>
            </h2>
          </div>
          
          <div class="text-center lg:text-left">
            <p class="text-base sm:text-lg text-[var(--Color-Text-Text-Primary)] mb-4 sm:mb-6">
              {{ $t('createAccountFree') }}
            </p>
            <div class="space-y-3 sm:space-y-4">
              <button class="bg-[var(--Color-Text-Text-Brand)] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:bg-[var(--Color-Text-Text-Brand)] hover:opacity-90 transition-colors text-sm sm:text-base">
                {{ $t('signUpNow') }}
              </button>
              <div class="text-xs sm:text-sm text-[var(--Color-Text-Text-Secondary)]">
                {{ $t('alreadyHaveAccount') }} 
                <a href="#" class="text-[var(--Color-Text-Text-Brand)] hover:underline">{{ $t('login') }}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import handshakeImage from '@/assets/handshake-businessmen.jpg'

// Component logic can be added here if needed
</script> 