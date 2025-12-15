<template>
  <UModal
    v-model:open="isOpen"
    :ui="{ width: 'max-w-6xl', bg: 'bg-white dark:bg-gray-800', rounded: 'rounded-lg', zIndex: 'z-50' }"
  >
    <template #header>
      <div class="flex items-center justify-between w-full">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
          {{ props.field ? 'Edit Form Field' : 'Create New Form Field' }}
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
        :form="formData"
        form-type="form-field-edit"
        @close="isOpen = false"
        @submit="handleSubmit"
      />
    </template>
  </UModal>
</template>

<script setup>
import DynamicForm from '~/components/emr/DynamicForm.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  field: { type: Object, default: null },
  form: { type: Object, default: null } // Selected form to get form_id
});

const emit = defineEmits(['update:open', 'submit']);

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
});

// Prepare form data for DynamicForm
const formData = computed(() => {
  if (props.field) {
    // Editing existing field
    return {
      ...props.field,
      form_id: props.field.form_id || props.form?.id || null
    }
  } else {
    // Creating new field - use selected form's data
    return {
      corporate_id: props.form?.corporate_id || 0,
      unit_id: props.form?.unit_id || 0,
      form_id: props.form?.id || null
    }
  }
});

const handleSubmit = (data) => {
  emit('submit', data)
}
</script>

