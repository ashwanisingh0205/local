<template>
 
    <!-- Loading State -->
    <div v-if="loadingForm" class="flex items-center justify-center py-12">
      <UIcon name="lucide:loader-2" class="w-6 h-6 animate-spin text-gray-400 dark:text-gray-500" />
      <span class="ml-3 text-gray-600 dark:text-gray-400">Loading form...</span>
    </div>

    <!-- Form -->
    <UForm v-else-if="internalFormConfig" class="space-y-6" @submit.prevent="handleSubmit">
      <div class="grid gap-6 md:grid-cols-2">
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
        <UButton 
            type="submit" 
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
  formParam: { type: Object, default: null },
  form: { type: Object, default: null },
  formType: { type: String, default: null }
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

/* ------------------- Form Edit Configuration ------------------- */
const getFormEditConfig = () => {
  return {
    fields: [
      { 
        id: 'formTitle', 
        label: 'Form Type', 
        type: 'select',
        required: true,
        placeholder: 'Enter Form Type',
        options: [
          'FORM',
          'SURVEY',
          'WORKFLOW'
          
        ],
      },
      { 
        id: 'formCode', 
        label: 'Form Code', 
        type: 'text',
        required: true,
        placeholder: 'Enter form code'
      },
      {
        id: 'template',
        label: 'Template',
        type: 'select',
        options: [
          'PRESCRIPTION',
          'DS'
          
        ],
        placeholder: 'Select template'
      },
      {
        id: 'email template',
        label: 'Email Template',
        type: 'select',
        options: [
          'REGISTRATION',
        ],
        placeholder: 'Select CSS'
      },
      {
        id: 'header',
        label: 'Header',
        type: 'select',
        options: [
          'IPD',
          'OPD',
          'STAFF'
          
        ],
        placeholder: 'Select header'
      },
      {
        id: 'footer',
        label: 'Footer',
        type: 'select',
        options: [
          'LAB'
         
        ],
        placeholder: 'Select footer'
      },
      {
        id: 'WHATSAPP TEMPLATE',
        label: 'Whatsapp Template',
        type: 'select',
        options: [
          'PAYMENT',
          'NEW SERVICE'
         
        ],
        placeholder: 'Select letterhead'
      },
      {
        id: 'SMS TEMPLATE',
        label: 'Sms Template',
        type: 'select',
        options: [
          'PAYMENT',
         
        ],
        placeholder: 'Select document type'
      },
      {
        id:'Button Theme',
        label: 'Button Theme',
        type: 'select',
        options: [
          'PRIMARY',
          'SECONDARY',
          'SUCCESS',
          'DANGER',
          'WARNING',
          'INFO',
         
        ],
        placeholder: 'Select button theme'
      }
    ]
  }
}

const getFormEditInitialData = () => {
  if (!props.form) return {};
  
  return {
    formTitle: props.form.title || '',
    formCode: props.form.formCode || '',
    template: props.form.template || null,
    css: props.form.css || null,
    header: props.form.header || null,
    footer: props.form.footer || null,
    letterhead: props.form.letterhead || null,
    documentType: props.form.documentType || null
  };
}

/* ------------------- Load Form Data ------------------- */
onMounted(async () => {
  try {
    // Handle form-edit type
    if (props.formType === 'form-edit') {
      internalFormConfig.value = getFormEditConfig()
      const source = getFormEditInitialData()
      formData.value = Object.fromEntries(
        internalFormConfig.value.fields.map(f => [f.id, getValue(f, source)])
      )
      return
    }
    
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

// Watch for form prop changes (for form-edit type)
watch(() => props.form, () => {
  if (props.formType === 'form-edit' && internalFormConfig.value) {
    const source = getFormEditInitialData()
    formData.value = Object.fromEntries(
      internalFormConfig.value.fields.map(f => [f.id, getValue(f, source)])
    )
  }
}, { deep: true })
</script>




/// event --- click , change , focus,blur 
// submit -- which url 