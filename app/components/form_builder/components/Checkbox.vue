
<template>
    <UFormField :label="field.label">
      <div class="space-y-2">
        <UCheckbox
          v-for="choice in field.choices"
          :key="choice.id || choice.data"
          :model-value="isSelected(choice.data)"
          @update:model-value="toggleSelection(choice.data, $event)"
          :label="choice.label"
        />
      </div>
    </UFormField>
  </template>
  
  <script setup>
  const props = defineProps({
    field: {
      type: Object,
      required: true
    }
  })

  // Initialize value as array if it's not already
  if (!Array.isArray(props.field.value)) {
    props.field.value = []
  }

  // Check if a choice is selected
  const isSelected = (value) => {
    console.log(props.field.value)
    if (!Array.isArray(props.field.value)) {
      return false
    }
    return props.field.value.includes(value)
  }

  // Toggle selection
  const toggleSelection = (value, checked) => {
    // Ensure value is an array
    if (!Array.isArray(props.field.value)) {
      props.field.value = []
    }
    
    const currentValue = [...props.field.value]
    
    if (checked) {
      // Add value if not already present
      if (!currentValue.includes(value)) {
        currentValue.push(value)
        props.field.value = currentValue
      }
    } else {
      // Remove value if present
      const index = currentValue.indexOf(value)
      if (index > -1) {
        currentValue.splice(index, 1)
        props.field.value = currentValue
      }
    }
  }
  </script>
  