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
            :loading="loading"
            :disabled="loading"
        />
      </div>
      
      <!-- Success/Error Messages -->
      <div v-if="submitMessage" class="mt-4">
        <UAlert
          v-if="submitSuccess"
          color="green"
          variant="soft"
          :title="submitMessage"
        />
        <UAlert
          v-else
          color="red"
          variant="soft"
          :title="submitMessage"
        />
      </div>
    </UForm>

</template>

<script setup>
import axios from 'axios'
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
const emit = defineEmits(['submit', 'close'])

const { loadFormData, loading: loadingForm } = useFormData()

/* ------------------- State ------------------- */
const formData = ref({})
const loading = ref(false)
const validationErrors = ref({})
const internalFormConfig = ref(null)
const submitMessage = ref('')
const submitSuccess = ref(false)

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
const handleSubmit = async () => {
  loading.value = true
  submitMessage.value = ''
  submitSuccess.value = false
  validationErrors.value = {}

  try {
    // Prepare form data for submission - transform to match API format
    const rawData = { ...formData.value }
    
    // Define numeric fields that should be converted to numbers
    const numericFields = new Set([
      'corporate_id', 'unit_id', 'category_id', 'template_id', 
      'header_id', 'footer_id', 'css_id', 'pdf_id', 'letterhead_id',
      'whatsapp_template_id', 'sms_template_id', 'email_template_id',
      'form_id', 'min_value', 'max_value', 'standard_value', 'standard_value_level2',
      'standard_value_level3', 'label_width', 'template_id', 'component_id', 'col', 'priority'
    ])
    
    // Define boolean fields
    const booleanFields = new Set([
      'status_pdf', 'status_universal', 'status', 
      'lock_value_consultant', 'status_required', 'status_readonly'
    ])
    
    // Transform the payload with proper data types
    const payload = {}
    
    Object.keys(rawData).forEach(key => {
      const value = rawData[key]
      
      // Skip null/undefined
      if (value === null || value === undefined) {
        if (numericFields.has(key)) {
          payload[key] = 0
        } else if (booleanFields.has(key)) {
          payload[key] = false
        }
        return
      }
      
      // Convert numeric fields to numbers
      if (numericFields.has(key)) {
        const numValue = Number(value)
        payload[key] = Number.isNaN(numValue) ? 0 : numValue
      }
      // Convert boolean fields
      else if (booleanFields.has(key)) {
        payload[key] = Boolean(value)
      }
      // Keep string fields as is
      else {
        payload[key] = value
      }
    })
    
    // Ensure status is true by default
    if (payload.status === undefined) {
      payload.status = true
    }

    // Validate required fields before submission based on form type
    let requiredFields = {}
    let apiEndpoint = 'http://13.200.174.164:3001/v1/masters/forms/form'
    
    if (props.formType === 'form-field-edit') {
      requiredFields = {
        form_id: 'Form ID',
        data_type: 'Data Type',
        field_code: 'Field Code',
        label: 'Label'
      }
      apiEndpoint = 'http://13.200.174.164:3001/v1/masters/forms/form/field'
    } else if (props.formType === 'form-edit') {
      requiredFields = {
        corporate_id: 'Corporate ID',
        unit_id: 'Unit ID',
        category_id: 'Category ID',
        form_code: 'Form Code',
        form_name: 'Form Name'
      }
    }
    
    const missingFields = []
    Object.keys(requiredFields).forEach(field => {
      const value = payload[field]
      // Check if field is missing, empty, or zero (for numeric fields, except form_id which can be 0)
      if (value === undefined || value === null || value === '' || 
          (typeof value === 'number' && value === 0 && field !== 'status' && field !== 'form_id')) {
        missingFields.push(requiredFields[field])
      }
    })
    
    if (missingFields.length > 0) {
      submitMessage.value = `Please fill in the required fields: ${missingFields.join(', ')}`
      submitSuccess.value = false
      loading.value = false
      return
    }

    console.log('payload', payload)
    
    // POST to API endpoint
    const response = await axios.post(
      apiEndpoint,
      payload,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    // Handle successful response
    if (response.data) {
      submitSuccess.value = true
      submitMessage.value = response.data.message || 'Form submitted successfully!'
      
      // Emit submit event with response data
      emit('submit', { 
        data: formData.value,
        response: response.data 
      })

      console.log('formData', formData.value)
      
      // Clear form after successful submission (optional)
      // formData.value = {}
      
      // Close the modal quickly after successful submission
      setTimeout(() => {
        emit('close')
      }, 500)
    }
  } catch (err) {
    submitSuccess.value = false
    
    // Log full error for debugging
    console.error('Submit error:', err)
    console.error('Error response:', err.response?.data)
    console.error('Error status:', err.response?.status)
    
    // Handle validation errors
    if (err.response?.status === 422 && err.response?.data?.errors) {
      validationErrors.value = err.response.data.errors
      submitMessage.value = 'Please fix the validation errors'
    } 
    // Handle server errors (500, etc.)
    else if (err.response?.status >= 500) {
      const errorData = err.response?.data
      let errorMsg = 'Server error occurred'
      
      if (errorData?.message) {
        // Format the error message to be more readable
        errorMsg = errorData.message
          .replaceAll('corporate_id: corporate_id required', 'Corporate ID is required')
          .replaceAll('unit_id: unit_id required', 'Unit ID is required')
          .replaceAll('category_id: category_id required', 'Category ID is required')
          .replaceAll('form_code: form_code required', 'Form Code is required')
          .replaceAll('form_name: form_name required', 'Form Name is required')
      } else if (errorData?.error) {
        errorMsg = errorData.error
      }
      
      submitMessage.value = `Error: ${errorMsg}`
      console.error('Server error details:', errorData)
    }
    // Handle other errors
    else {
      submitMessage.value = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to submit form. Please try again.'
    }
    
    // Emit submit event with error
    emit('submit', { 
      data: formData.value,
      error: err.response?.data || err.message 
    })
  } finally {
    loading.value = false
  }
}

/* ------------------- Form Edit Configuration ------------------- */
const getFormEditConfig = () => {
  return {
    fields: [
  {
    id: 'corporate_id',
    label: 'Corporate',
    type: 'select',
    required: true,
    placeholder: 'Select corporate',
    options: [
      1,2,3,4
      
    ] // populate from API
  },
  {
    id: 'unit_id',
    label: 'Unit',
    type: 'select',
    required: true,
    placeholder: 'Select unit',
    options: [
       1,2,3,4
    ] // populate from API
  },
  {
    id: 'category_id',
    label: 'Category',
    type: 'select',
    required: true,
    placeholder: 'Select category',
    options: [ 1,2,3,4] // populate from API
  },
  {
    id: 'form_type',
    label: 'Form Type',
    type: 'select',
    required: true,
    placeholder: 'Select form type',
    options: [
      'FORM',
      
    ]
  },
  {
    id: 'form_code',
    label: 'Form Code',
    type: 'text',
    required: true,
    placeholder: 'Enter form code'
  },
  {
    id: 'form_name',
    label: 'Form Name',
    type: 'text',
    required: true,
    placeholder: 'Enter form name'
  },
  {
    id: 'button_theme',
    label: 'Button Theme',
    type: 'select',
    placeholder: 'Select button theme',
    options: [
      'PRIMARY',
      'SECONDARY',
      'SUCCESS',
      'DANGER',
      'WARNING',
      'INFO'
    ]
  },
  {
    id: 'template_id',
    label: 'Template',
    type: 'select',
    placeholder: 'Select template',
    options: [] // template master
  },
  {
    id: 'header_id',
    label: 'Header',
    type: 'select',
    placeholder: 'Select header',
    options: [] // header master
  },
  {
    id: 'footer_id',
    label: 'Footer',
    type: 'select',
    placeholder: 'Select footer',
    options: [] // footer master
  },
  {
    id: 'css_id',
    label: 'CSS',
    type: 'select',
    placeholder: 'Select CSS',
    options: [] // css master
  },
  {
    id: 'letterhead_id',
    label: 'Letterhead',
    type: 'select',
    placeholder: 'Select letterhead',
    options: [] // letterhead master
  },
  {
    id: 'whatsapp_template_id',
    label: 'Whatsapp Template',
    type: 'select',
    placeholder: 'Select whatsapp template',
    options: [] // whatsapp template master
  },
  {
    id: 'sms_template_id',
    label: 'SMS Template',
    type: 'select',
    placeholder: 'Select SMS template',
    options: [] // sms template master
  },
  {
    id: 'email_template_id',
    label: 'Email Template',
    type: 'select',
    placeholder: 'Select email template',
    options: [] // email template master
  },
  {
    id: 'save_endpoint',
    label: 'Save Endpoint',
    type: 'text',
    placeholder: 'Enter API endpoint URL'
  },
  {
    id: 'workflow_ids',
    label: 'Workflow IDs',
    type: 'select',
    placeholder: 'Enter workflow IDs (JSON)',
    options: [
      1,2,3,4
    ]
  },
  {
    id: 'frequency',
    label: 'Frequency',
    type: 'select',
    placeholder: 'Enter frequency JSON',
    options: [
      'DAILY',
      'WEEKLY',
      'MONTHLY',
      'YEARLY'
    ]
  },
  {
    id: 'icon',
    label: 'Icon',
    type: 'select',
    placeholder: 'Enter icon class or URL',
    options: [
      'lucide:file',
      'lucide:file-signal',
      'lucide:archive-x' ,
      'lucide:annoyed' 
      ]

  },
  {
    id: 'status_pdf',
    label: 'Enable PDF',
    type: 'checkbox'
  },
  {
    id: 'status_universal',
    label: 'Universal Status',
    type: 'checkbox'
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

/* ------------------- Form Field Edit Configuration ------------------- */
const getFormFieldEditConfig = () => {
  return {
    fields: [
      {
        id: 'corporate_id',
        label: 'Corporate ID',
        type: 'select',
        placeholder: 'Select corporate',
        options: [1, 2, 3, 4]
      },
      {
        id: 'unit_id',
        label: 'Unit ID',
        type: 'select',
        placeholder: 'Select unit',
        options: [1, 2, 3, 4]
      },
      {
        id: 'form_id',
        label: 'Form ID',
        type: 'number',
        required: true,
        placeholder: 'Form ID (auto-filled)',
        readonly: true
      },
      {
        id: 'data_type',
        label: 'Data Type',
        type: 'select',
        required: true,
        placeholder: 'Select data type',
        options: ['TEXT', 'NUMBER', 'DATE', 'DROPDOWN', 'CHECKBOX', 'RADIO', 'FILE', 'CARD', 'GROUP', 'TAB', 'SECTION', 'TABLE']
      },
      {
        id: 'data_type_config',
        label: 'Data Type Config',
        type: 'textarea',
        placeholder: 'Enter JSON config'
      },
      {
        id: 'min_value',
        label: 'Min Value',
        type: 'number',
        placeholder: 'Enter minimum value'
      },
      {
        id: 'max_value',
        label: 'Max Value',
        type: 'number',
        placeholder: 'Enter maximum value'
      },
      {
        id: 'standard_value',
        label: 'Standard Value',
        type: 'number',
        placeholder: 'Enter standard value'
      },
      {
        id: 'standard_value_level2',
        label: 'Standard Value Level 2',
        type: 'number',
        placeholder: 'Enter standard value level 2'
      },
      {
        id: 'standard_value_level3',
        label: 'Standard Value Level 3',
        type: 'number',
        placeholder: 'Enter standard value level 3'
      },
      {
        id: 'standard_config',
        label: 'Standard Config',
        type: 'textarea',
        placeholder: 'Enter JSON config'
      },
      {
        id: 'field_code',
        label: 'Field Code',
        type: 'text',
        required: true,
        placeholder: 'Enter field code'
      },
      {
        id: 'parent_field_code',
        label: 'Parent Field Code',
        type: 'text',
        placeholder: 'Enter parent field code (optional)'
      },
      {
        id: 'label',
        label: 'Label',
        type: 'text',
        required: true,
        placeholder: 'Enter field label'
      },
      {
        id: 'label_position',
        label: 'Label Position',
        type: 'select',
        placeholder: 'Select label position',
        options: ['TOP', 'LEFT', 'RIGHT', 'BOTTOM']
      },
      {
        id: 'label_style',
        label: 'Label Style',
        type: 'select',
        placeholder: 'Select label style',
        options: ['T1', 'T2', 'H1', 'H2', 'H3']
      },
      {
        id: 'label_width',
        label: 'Label Width',
        type: 'number',
        placeholder: 'Enter label width (0-100)'
      },
      {
        id: 'value',
        label: 'Value',
        type: 'textarea',
        placeholder: 'Enter default value'
      },
      {
        id: 'choice_code',
        label: 'Choice Code',
        type: 'text',
        placeholder: 'Enter choice code (e.g., hr.departments)'
      },
      {
        id: 'templates',
        label: 'Templates',
        type: 'textarea',
        placeholder: 'Enter templates JSON'
      },
      {
        id: 'template_id',
        label: 'Template ID',
        type: 'select',
        placeholder: 'Select template',
        options: [0, 1, 2, 3, 4]
      },
      {
        id: 'server_trigger',
        label: 'Server Trigger',
        type: 'select',
        placeholder: 'Select server trigger',
        options: ['click', 'blur', 'change', 'focus']
      },
      {
        id: 'server_function',
        label: 'Server Function',
        type: 'textarea',
        placeholder: 'Enter server function'
      },
      {
        id: 'server_function_fields',
        label: 'Server Function Fields',
        type: 'textarea',
        placeholder: 'Enter server function fields (JSON array)'
      },
      {
        id: 'data_endpoint',
        label: 'Data Endpoint',
        type: 'text',
        placeholder: 'Enter data endpoint URL'
      },
      {
        id: 'component_id',
        label: 'Component ID',
        type: 'select',
        placeholder: 'Select component',
        options: [0, 1, 2, 3, 4]
      },
      {
        id: 'col',
        label: 'Column',
        type: 'number',
        placeholder: 'Enter column number'
      },
      {
        id: 'bind_to',
        label: 'Bind To',
        type: 'text',
        placeholder: 'Enter bind to field'
      },
      {
        id: 'bind_value',
        label: 'Bind Value',
        type: 'text',
        placeholder: 'Enter bind value'
      },
      {
        id: 'text_prefix',
        label: 'Text Prefix',
        type: 'text',
        placeholder: 'Enter text prefix'
      },
      {
        id: 'text_suffix',
        label: 'Text Suffix',
        type: 'text',
        placeholder: 'Enter text suffix'
      },
      {
        id: 'lock_value_with',
        label: 'Lock Value With',
        type: 'select',
        placeholder: 'Select lock value with',
        options: ['NA', 'PT', 'VISIT']
      },
      {
        id: 'lock_value_consultant',
        label: 'Lock Value Consultant',
        type: 'checkbox'
      },
      {
        id: 'data',
        label: 'Data',
        type: 'textarea',
        placeholder: 'Enter data JSON'
      },
      {
        id: 'priority',
        label: 'Priority',
        type: 'number',
        placeholder: 'Enter priority'
      },
      {
        id: 'status_required',
        label: 'Status Required',
        type: 'checkbox'
      },
      {
        id: 'status_readonly',
        label: 'Status Readonly',
        type: 'checkbox'
      },
      {
        id: 'status_universal',
        label: 'Status Universal',
        type: 'checkbox'
      }
    ]
  }
}

const getFormFieldEditInitialData = () => {
  if (!props.form) return {};
  
  return {
    corporate_id: props.form.corporate_id || 0,
    unit_id: props.form.unit_id || 0,
    form_id: props.form.form_id || props.form.id || null
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
    
    // Handle form-field-edit type
    if (props.formType === 'form-field-edit') {
      internalFormConfig.value = getFormFieldEditConfig()
      const source = getFormFieldEditInitialData()
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

// Watch for form prop changes (for form-edit and form-field-edit types)
watch(() => props.form, () => {
  if (props.formType === 'form-edit' && internalFormConfig.value) {
    const source = getFormEditInitialData()
    formData.value = Object.fromEntries(
      internalFormConfig.value.fields.map(f => [f.id, getValue(f, source)])
    )
  } else if (props.formType === 'form-field-edit' && internalFormConfig.value) {
    const source = getFormFieldEditInitialData()
    formData.value = Object.fromEntries(
      internalFormConfig.value.fields.map(f => [f.id, getValue(f, source)])
    )
  }
}, { deep: true })
</script>




/// event --- click , change , focus,blur 
// submit -- which url 