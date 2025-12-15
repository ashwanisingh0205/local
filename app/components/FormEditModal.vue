<template>
  <UModal
    v-model:open="isOpen"
    :ui="{ width: 'max-w-4xl', bg: 'bg-white dark:bg-gray-800', rounded: 'rounded-lg', zIndex: 'z-50' }"
  >
    <template #header>
      <div class="flex items-center justify-between w-full">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
          {{ props.form ? 'Edit Form' : 'Create New Form' }}
        </h2>
        <UButton
          @click="isOpen = false"
          variant="ghost"
          size="sm"
          icon="i-lucide:x"
          color='neutral'
        />
      </div>
    </template>
    <template #body>
      <DynamicForm
        :form="props.form"
        form-type="form-edit"
        @close="isOpen = false"
      />
    </template>
  </UModal>
</template>

<script setup>
import DynamicForm from '~/components/emr/DynamicForm.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  form: { type: Object, default: null }
});

const emit = defineEmits(['update:open', 'submit']);

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
});


</script>