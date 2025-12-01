<template>
 
    <!-- Loading State -->
    <div v-if="loadingForm" class="flex items-center justify-center py-12">
      <UIcon name="lucide:loader-2" class="w-6 h-6 animate-spin text-gray-400 dark:text-gray-500" />
      <span class="ml-3 text-gray-600 dark:text-gray-400">Loading form...</span>
    </div>

    <!-- Form -->
    <UForm v-else-if="internalFormConfig" class="space-y-6" @submit.prevent="handleSubmit">
      <div class="grid gap-6 md:grid-cols-4">
        <div
          v-for="field in internalFormConfig.fields"
          :key="field.id"
          
        >
          <Wrapper
            :field="field"
            v-model="formData[field.id]"
           
          />
        </div>
      </div>

      <div class="flex gap-3 pt-2">
        <UButton type="submit" 
         label="Submit form"
        />
          
      
      </div>
    </UForm>

</template>

<script setup>
import Wrapper from '~/components/emr/Wrapper.vue'
import { useFormData } from '~/composables/useFormData'

const props = defineProps({
  formConfig: { type: Object, required: false, default: null },
  initialData: { type: Object, default: null },
  formCode: { type: String, default: null },
  formParam: { type: Object, default: null }
})
const emit = defineEmits(['submit'])

const { loadFormData, loading: loadingForm } = useFormData()

/* ------------------- State ------------------- */
const formData = ref({})
const loading = ref(false)
const validationErrors = ref({})
const internalFormConfig = ref(null)

/* ------------------- Helpers ------------------- */
const getDefaultValue = (field) => {
  if (field.defaultValue !== undefined) return field.defaultValue
  // Multiple checkboxes return empty array, single checkbox returns false
  if (field.type === 'checkbox') {
    return field.options ? [] : false
  }
  if (['number', 'select', 'radio'].includes(field.type)) return null
  return ''
}



const getValue = (field, source = {}) => {
  const raw = source[field.id]

  return raw ?? getDefaultValue(field)
}

/* ------------------- Init Form ------------------- */
const initForm = () => {
  const config = internalFormConfig.value || props.formConfig
  if (!config || !config.fields) return
  
  const source = props.initialData || {}
  formData.value = Object.fromEntries(
    config.fields.map(f => [f.id, getValue(f, source)])
  )
}

/* ------------------- Submit ------------------- */
const handleSubmit = () => {
  emit('submit', { ...formData.value })
  loading.value = false
}

/* ------------------- Load Form Data ------------------- */
onMounted(async () => {
  try {
    // If formConfig is provided as prop, use it; otherwise load from API
    if (props.formConfig) {
      internalFormConfig.value = props.formConfig
      initForm()
    } else {
      const { config, data } = await loadFormData()
      internalFormConfig.value = config
      // Use loaded data or initialData prop
      const source = data || props.initialData || {}
      formData.value = Object.fromEntries(
        config.fields.map(f => [f.id, getValue(f, source)])
      )
    }
  } catch (err) {
    console.error('Error loading form:', err)
  }
})
</script>




/// event --- click , change , focus,blur 
// submit -- which url 