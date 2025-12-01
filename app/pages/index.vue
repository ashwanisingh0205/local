<template>
  <div class="flex flex-col min-h-screen relative z-0">
    <!-- Color Mode Toggle Button -->
    <div class="fixed top-4 right-4 sm:top-6 sm:right-6 z-50">
      <UColorModeButton />
    </div>

    <div class="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 lg:py-18 flex-1 flex items-center justify-center xl:block relative z-10">
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 w-full xl:items-start">
        <!-- Left Section -->
        <div class="hidden xl:flex flex-col justify-between">
        
          <div class="flex items-center gap-2 sm:gap-3 mt-4 mb-6 sm:mb-8 lg:mb-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-md border border-gray-100 dark:border-gray-700 w-full sm:w-80 p-2 sm:p-3">
            <div class="flex flex-col items-center shrink-0">
                <img src='/assets/images/NHS-logo.png' class="h-12 w-12 sm:h-16 sm:w-16 object-contain" alt="NHS Logo">
            </div>
            <div class="min-w-0">
              <h1 class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 dark:from-emerald-400 dark:to-emerald-500 bg-clip-text text-transparent">MARC</h1>
              <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Healthcare Excellence Platform</p>
            </div>
          </div>

      
          <div class="flex-1">
            <h2 class="text-3xl sm:text-4xl lg:text-5xl xl:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
              Empowering Healthcare Professionals
            </h2>
            <p class="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-8 sm:mb-12">
              A comprehensive platform designed to streamline hospital operations
              and enhance patient care quality.
            </p>

          
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-12">
              <div v-for="feature in features" :key="feature" class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 sm:p-4 flex items-center gap-2 sm:gap-3 shadow-md hover:shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1">
                <div class="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shrink-0">
                  <UIcon name="lucide:check" class="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <span class="text-sm sm:text-base text-gray-700 dark:text-gray-300">{{ feature }}</span>
              </div>
            </div>

           
            <div class="flex flex-wrap gap-6 sm:gap-8 lg:gap-12">
              <div v-for="stat in stats" :key="stat.label" class="flex-shrink-0">
                <p class="text-3xl sm:text-4xl font-bold bg-black dark:bg-white bg-clip-text text-transparent">{{ stat.value }}</p>
                <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">{{ stat.label }}</p>
              </div>
            </div>
          </div>
        </div>
    

        <!-- Right Section - Login Form -->
        <div class="flex flex-col justify-center items-center w-full xl:justify-end xl:items-end">
          <div class="w-full max-w-md px-4 sm:px-6 lg:py-12">
            <UCard
              :ui="{
                base: 'bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 relative overflow-hidden',
                body: {
                  base: 'relative',
                  padding: 'p-0'
                }
              }"
            >
              <template #default>
                
                <!-- Logo Icon - positioned relative to card base -->
               

                <!-- Content wrapper with padding -->
                <div class="p-4 sm:p-6 relative">
                  <!-- Logo Icon - positioned absolutely at top-right -->
                  <div class="absolute top-2 right-2 sm:top-4 sm:right-2 z-10">
                    <img src='/assets/images/NHS-logo.png' class="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded-xl" alt="NHS Logo">
                  </div>

                  <!-- Header Content -->
                  <div class="mb-2 pr-16 sm:pr-20 relative z-10">
                    <h3 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Sign In</h3>
                  </div>
                  <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 relative z-10">Access your hospital dashboard</p>
                  <!-- Form -->
                  <form @submit.prevent="handleSignIn" class="space-y-4 sm:space-y-6">
                <!-- Username Field -->
                <div>
                  <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                    Username
                  </label>
                  <UInput
                    id="username"
                    v-model="username"
                    type="text"
                    placeholder="Enter username"
                    class="w-full"
                    :ui="{
                      base: 'pl-10 pr-4 py-2.5 sm:py-3',
                      rounded: 'rounded-lg',
                      placeholder: 'placeholder-gray-500',
                      text: 'text-4xl sm:text-base',
                      
                    }"
                  >
                    <template #leading>
                      <UIcon name="lucide:user" class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    </template>
                  </UInput>
                </div>

                <!-- Password Field -->
                <div>
                  <div class="flex justify-between items-center mb-1.5 sm:mb-2 flex-wrap gap-1">
                    <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Password
                    </label>
                    <a href="#" class="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors whitespace-nowrap">
                      Forgot password?
                    </a>
                  </div>
                  <UInput
                    id="password"
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="Enter password"
                    class="w-full"
                    :ui="{
                      base: 'pl-10 pr-12 py-2.5 sm:py-3',
                      rounded: 'rounded-lg',
                      placeholder: 'placeholder-gray-500',
                     
                    }"
                  >
                    <template #leading>
                      <UIcon name="lucide:lock" class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    </template>
                    <template #trailing>
                      <UButton
                        @click="showPassword = !showPassword"
                        type="button"
                        variant="ghost"
                        color="gray"
                        class="text-gray-400 hover:text-gray-600 transition-colors !p-0"
                        :ui="{ rounded: 'rounded-none', padding: { sm: 'p-0', md: 'p-0', lg: 'p-0' } }"
                      >
                        <UIcon v-if="showPassword" name="lucide:eye-off" class="w-4 h-4 sm:w-5 sm:h-5" />
                        <UIcon v-else name="lucide:eye" class="w-4 h-4 sm:w-5 sm:h-5" />
                      </UButton>
                    </template>
                  </UInput>
                </div>

           
                <UCheckbox
                  id="keep-signed-in"
                  v-model="keepSignedIn"
                  label="Keep me signed in"
                  class="text-sm"
                  :ui="{
                    color: {
                      emerald: {
                        outline: 'text-emerald-600 dark:text-emerald-500 focus:ring-emerald-500 dark:ring-offset-gray-800 dark:focus:ring-emerald-500 focus:ring-2'
                      }
                    }
                  }"
                />

                <!-- Submit Button -->
                <UButton
                  type="submit"
                  class="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group text-sm sm:text-base"
                >
                  <span class="flex w-full items-center justify-center gap-2">
                    <span class="hidden sm:inline">Sign In to Dashboard</span>
                    <span class="sm:hidden">Sign In</span>
                    <UIcon name="lucide:arrow-right" class="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </span>
                </UButton>
                  </form>

                  <!-- Footer Content -->
                  <div class="mt-6 sm:mt-8 text-center">
                    <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      Need assistance?
                      <a href="#" class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium ml-1 transition-colors">
                        Contact
                      </a>
                      <a href="#" class="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium ml-1 transition-colors">
                        IT Support
                      </a>
                    </p>
                  </div>
                </div>
              </template>
            </UCard>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="-mt-4 sm:-mt-8 pb-4 sm:pb-6 text-center text-gray-500 dark:text-gray-400 text-xs sm:text-sm w-full relative z-0 px-4">
      <p class="font-medium">© 2025 MARC. All rights reserved.</p>
      <div class="mt-2 sm:mt-3 flex flex-wrap justify-center items-center gap-2 sm:gap-3 text-xs sm:text-sm">
        <a href="#" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">Privacy Policy</a>
        <span class="text-gray-300 dark:text-gray-600 hidden sm:inline">•</span>
        <a href="#" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">Terms of Service</a>
        <span class="text-gray-300 dark:text-gray-600 hidden sm:inline">•</span>
        <a href="#" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">Help Center</a>
      </div>
    </footer>

    <!-- Sign In Success Modal -->
    <SignInSuccessModal
      v-model:open="isModalOpen"
      title="Select Your Role"
      :class="'text-3xl font-bold text-black-900  text-center justify-center items-center'"
      @continue="handleContinue"
    />
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'login'
});

import { ref } from "vue";

const username = ref("");
const password = ref("");
const showPassword = ref(false);
const keepSignedIn = ref(false);
const isModalOpen = ref(false);

const features = [
  "Patient Record Management",
  "Appointment Scheduling",
  "Prescription Management",
  "Lab Results Integration"
];

const stats = [
  { value: "500+", label: "Hospitals" },
  { value: "50K+", label: "Users" },
  { value: "99.9%", label: "Uptime" }
];

const handleSignIn = () => {
  console.log("Sign in attempted", {
    // username: username.value,
    // keepSignedIn: keepSignedIn.value,
  });
  // Open the modal
  isModalOpen.value = true;
};

const handleContinue = async (roleTitle) => {
  console.log("Continue with role:", roleTitle);
  
  // Close the modal first
  isModalOpen.value = false;
  
  // Wait a bit for modal to close smoothly
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Get router instance
  const router = useRouter();
  
  
    console.log('Attempting navigation to /dashboard...');
    
    // Try navigateTo first (Nuxt 3 recommended)
    router.push('/dashboard');
    
    
  
  
};
</script>