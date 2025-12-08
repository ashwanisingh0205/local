

<template>
  <UContainer>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Admission Highlights</h1>
        <UButton variant="ghost" icon="i-lucide:more-horizontal" />
      </div>

      <!-- Main Card -->
      <UCard v-if="statistics && Object.keys(statistics).length > 0">
        <div class="p-6 space-y-6">
          <!-- All Time Admissions Section -->
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">All time admissions</p>
            <div class="flex items-center gap-3 mb-4">
              <p class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ allTimeAdmissions.total?.toLocaleString() }}
              </p>
              <div class="flex items-center gap-1">
                <UIcon 
                  :name="allTimeAdmissions.trend === 'up' ? 'lucide:trending-up' : 'lucide:trending-down'" 
                  :class="[
                    'w-4 h-4',
                    allTimeAdmissions.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  ]" 
                />
                <span 
                  :class="[
                    'text-sm font-medium',
                    allTimeAdmissions.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  ]"
                >
                  {{ allTimeAdmissions.change }}%
                </span>
              </div>
            </div>

            <!-- Horizontal Bar Chart -->
            <div class="mb-4">
              <div class="flex h-8 gap-1">
                <div
                  v-for="category in categories"
                  :key="category.name"
                  :class="['rounded-lg', getCategoryColor(category.name).bg]"
                  :style="{ width: `${getCategoryPercentage(category.count)}%` }"
                />
              </div>
            </div>

           
            <div class="flex flex-wrap gap-4">
              <div
                v-for="category in categories"
                :key="category.name"
                class="flex items-center gap-2"
              >
                <div 
                  :class="['w-3 h-3 rounded-full', getCategoryColor(category.name).bg]"
                />
                <span class="text-xs text-gray-600 dark:text-gray-400">{{ category.name }}</span>
              </div>
            </div>
          </div>

          <!-- Category Cards Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatisticsCategoryCard
              v-for="category in categories"
              :key="category.name"
              :category="{ ...category, colorClasses: getCategoryColor(category.name) }"
            />
          </div>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup>
definePageMeta({
  layout: 'home'
})




const { statistics } = usePatientStatistics()


watch(statistics, (newValue) => {
  console.log('Statistics data:', newValue)
}, { immediate: true, deep: true })

const allTimeAdmissions = computed(() => statistics.value?.allTimeAdmissions || {})
const categories = computed(() => statistics.value?.categories || [])

const totalCount = computed(() => {
  return categories.value.reduce((sum, cat) => sum + (cat.count || 0), 0)
})

const getCategoryPercentage = (count) => {
  if (totalCount.value === 0) return 0
  return ((count / totalCount.value) * 100).toFixed(1)
}

const colorMap = {
  'Cash': {
    bg: 'bg-green-500',
    bgLight: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-600 dark:text-green-400'
  },
  'ECHS': {
    bg: 'bg-red-500',
    bgLight: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-600 dark:text-red-400'
  },
  'CGHS': {
    bg: 'bg-blue-500',
    bgLight: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-600 dark:text-blue-400'
  },
  'Ayushman Bharat': {
    bg: 'bg-orange-500',
    bgLight: 'bg-orange-100 dark:bg-orange-900/30',
    text: 'text-orange-600 dark:text-orange-400'
  },
  'Others': {
    bg: 'bg-purple-500',
    bgLight: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-600 dark:text-purple-400'
  }
}

const getCategoryColor = (name) => {
  return colorMap[name] || {
    bg: 'bg-gray-500',
    bgLight: 'bg-gray-100 dark:bg-gray-900/30',
    text: 'text-gray-600 dark:text-gray-400'
  }
}
</script>