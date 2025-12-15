<template>
  <div>
    <UCard
      :ui="cardUi"
      @click="$emit('view', form)"
      :variant="isSelected ? 'outline' : 'soft'"
    >
      <div class="flex items-start justify-between gap-2">
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-3">
            {{ form.title }}
          </h3>

         
        </div>

        <div class="flex items-center gap-2 shrink-0">
         
          <UButton
            @click.stop="$emit('edit', form)"
            variant="outline"
            size="sm"
            icon="i-lucide:pencil"
            color="neutral"
          />
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup>
const props = defineProps({
  form: { type: Object, required: true },
  isSelected: { type: Boolean, default: false }
})

defineEmits(['edit', 'view'])

const cardUi = computed(() => ({
  base: 'cursor-pointer transition-all hover:shadow-md',
  body: { padding: 'p-4' }
}))

const formFields = computed(() => [
  { key: 'template', label: 'Template', value: props.form.template || 'Template Name' },
  { key: 'css', label: 'CSS', value: props.form.css || 'CSS' },
  { key: 'header', label: 'Header', value: props.form.header || 'Header' },
  { key: 'footer', label: 'Footer', value: props.form.footer || 'Footer' },
  { key: 'letterhead', label: 'Letterhead', value: props.form.letterhead || 'Letterhead' }
])
</script>
