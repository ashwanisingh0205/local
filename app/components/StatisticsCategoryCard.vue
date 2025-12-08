<script setup>
const props = defineProps({
  category: Object
})

const trendIcon = computed(() => {
  return props.category?.trend === 'up' ? 'lucide:trending-up' : 'lucide:trending-down'
})

const trendColor = computed(() => {
  return props.category?.trend === 'up' ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'
})

const colorClasses = computed(() => {
  return props.category?.colorClasses || {
    bgLight: 'bg-gray-100 dark:bg-gray-900/30',
    text: 'text-gray-600 dark:text-gray-400'
  }
})
</script>

<template>
  <UCard class="h-full">
    <div class="p-3">
      <div class="flex items-start flex-col gap-6">
        <!-- Icon -->
        <div class="flex items-center gap-3">
        <div :class="['p-2.5 rounded-lg shrink-0', colorClasses.bgLight]">
          <UIcon :name="category.icon" :class="['w-5 h-5', colorClasses.text]" />
          
        </div>
         <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {{ category.name }}
          </p>
          </div>
        
        <!-- Content -->
        <div class="flex-1 min-w-0">
          <!-- Count - Aligned with icon -->
          <p class="text-3xl font-bold text-gray-900 dark:text-white leading-none mb-1.5">
            {{ category.count?.toLocaleString() }}
          </p>
          
        
          
          <!-- Trend Indicator -->
          <div class="flex items-center gap-1">
            <UIcon :name="trendIcon" :class="['w-4 h-4', trendColor]" />
            <span :class="['text-sm font-medium', trendColor]">
              {{ category.change }}%
            </span>
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>
