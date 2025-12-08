

<template>
  <UCard class="h-full">
    <div class="p-6">
      <div class="flex flex-col items-center text-center">
        <!-- Icon at top -->
        <div :class="['p-3 rounded-full mb-4', styles.bg]">
          <UIcon :name="item.icon" :class="['w-6 h-6', styles.icon]" />
        </div>
        <!-- Number in middle -->
        <p class="text-4xl font-bold text-gray-900 dark:text-white mb-2">{{ item.Count }}</p>
        <!-- Title at bottom -->
        <p class="text-base font-medium text-gray-600 dark:text-gray-400">{{ item.title }}</p>
      </div>
    </div>
  </UCard>
</template>






<script setup>
const props = defineProps({
  item: Object,
})

const colorMap = {
  'Total Admission': { icon: 'text-blue-600 dark:text-blue-400',  },
  'Total Discharge': { icon: 'text-green-600 dark:text-green-400' },
  'Cashless Admission': { icon: 'text-blue-600 dark:text-blue-400' },
  'Cashless Discharge': { icon: 'text-purple-600 dark:text-purple-400'}
}

const styles = computed(() => {
  const key = Object.keys(colorMap).find(k => props.item?.title?.includes(k))
  return key ? colorMap[key] : { icon: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-900/30' }
})
</script>
