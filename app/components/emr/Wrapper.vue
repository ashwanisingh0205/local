<template>
  <div class="space-y-2">
    <!-- Field Label -->
    <div v-if="field.label" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
      {{ field.label }}
      <span v-if="field.required" class="text-red-500">*</span>
    </div>

    <!-- Text Input Types -->
    <UInput
      v-if="['text', 'email', 'number', 'password', 'tel', 'url','date'].includes(field.type)"
      v-model="localValue"
      :type="field.type"
      :placeholder="field.placeholder"
      :icon="field.icon"
      class="w-full"
      
    />

    <!-- Select -->
    <USelectMenu
      v-else-if="field.type === 'select'"
      v-model="localValue"
      :items="fieldItems"
      :placeholder="field.placeholder"
      searchable
      :icon="field.icon"
      class="w-full"
    />

    <!-- Textarea -->
    <UTextarea
      v-else-if="field.type === 'textarea'"
      v-model="localValue"
      :placeholder="field.placeholder"
      :rows="field.rows || 4"
    
    />

    <!-- Single Checkbox (no options) -->
    <UCheckbox
      v-else-if="field.type === 'checkbox' && !field.options"
      v-model="localValue"
      :label="field.checkboxLabel || field.label"
    />

    <!-- Multiple Checkboxes (with options) -->
    <div v-else-if="field.type === 'checkbox' && field.options" class="space-y-2">
      <UCheckbox
        v-for="option in fieldOptions"
        :key="option.value || option"
        :model-value="isCheckboxSelected(option.value || option)"
        @update:model-value="toggleCheckbox(option.value || option, $event)"
        :label="option.label || option"
      />
    </div>

    <!-- Radio -->
    <div v-else-if="field.type === 'radio'" class="flex gap-4">
      <label
        v-for="option in fieldOptions"
        :key="option.value || option"
        class="flex items-center gap-2 cursor-pointer"
      >
        <input
          type="radio"
          :name="field.id"
          :value="option.value || option"
          :checked="localValue === (option.value || option)"
          @change="localValue = option.value || option"
          class="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
        <span class="text-sm text-gray-700 dark:text-gray-300">{{ option.label || option }}</span>
      </label>
    </div>

    <!-- Date -->
    <UInput
      v-else-if="field.type === 'date'"
      v-model="localValue"
      type="date"
      
    />

    <!-- Nested Fields (Recursive) -->
    <div
      v-else-if="field.type === 'group' && field.fields"
      class="rounded-lg border border-gray-200 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-gray-900/40"
    >
      <p v-if="field.label" class="font-semibold text-gray-900 dark:text-white mb-4">
        {{ field.label }}
      </p>
      <div class="grid gap-4 md:grid-cols-2">
        <Wrapper
          v-for="subField in field.fields"
          :key="subField.id"
          :field="subField"
          v-model="nestedValues[subField.id]"
          
          @update:model-value="updateNestedValue(subField.id, $event)"
        />
      </div>
    </div>

   
  </div>
</template>

<script setup>
const props = defineProps({
  field: { type: Object, required: true },
  modelValue: { type: [String, Number, Boolean, Object, Array], default: '' },
  error: { type: [String, Object], default: null }
})

const emit = defineEmits(['update:modelValue'])

/* ------------------ Main v-model Handler ------------------ */
const localValue = computed({
  get: () => {
    if (props.field.type === 'group') return nestedValues.value
    return props.modelValue
  },

  set: val => {
    if (props.field.type === 'group') return // groups handled separately

    if (props.field.type === 'number') {
      emit('update:modelValue', val === '' ? null : Number(val))
    } else {
      emit('update:modelValue', val)
    }
  }
})

/* ------------------ Items for USelectMenu ------------------ */
const fieldItems = computed(() => {
  const options = props.field.options || []
  // Return simple array of strings for USelectMenu items prop
  return options.map(opt => typeof opt === 'object' ? opt.value || opt.label : opt)
})

/* ------------------ Options (for other field types) ------------------ */
const fieldOptions = computed(() =>
  (props.field.options || []).map(opt =>
    typeof opt === 'object' ? opt : { label: opt, value: opt }
  )
)

/* ------------------ Multiple Checkbox Helpers ------------------ */
// Check if a checkbox option is selected (for multiple checkboxes)
const isCheckboxSelected = (value) => {
  if (!Array.isArray(localValue.value)) return false
  return localValue.value.includes(value)
}

// Toggle checkbox value in array (for multiple checkboxes)
const toggleCheckbox = (value, checked) => {
  const currentValue = Array.isArray(localValue.value) ? [...localValue.value] : []
  
  if (checked) {
    // Add value if not already present
    if (!currentValue.includes(value)) {
      currentValue.push(value)
      emit('update:modelValue', currentValue)
    }
  } else {
    // Remove value if present
    const index = currentValue.indexOf(value)
    if (index > -1) {
      currentValue.splice(index, 1)
      emit('update:modelValue', currentValue)
    }
  }
}

/* ------------------ Nested Fields Support ------------------ */
const nestedValues = ref({})

const updateNestedValue = (id, value) => {
  nestedValues.value[id] = value
  emit('update:modelValue', { ...nestedValues.value })
}

/* ------------------ Error Message ------------------ */
const errorMessage = computed(() => {
  if (!props.error) return null
  if (typeof props.error === 'string') return props.error
  return props.error?.[props.field.id] || null
})
</script>

