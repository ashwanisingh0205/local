<template>
  <!-- Loading State -->
  <div v-if="loadingForm" class="flex items-center justify-center py-12">
    <UIcon name="lucide:loader-2" class="w-6 h-6 animate-spin text-gray-400 dark:text-gray-500" />
    <span class="ml-3 text-gray-600 dark:text-gray-400">Loading form...</span>
  </div>

  <!-- Form -->
  <UForm v-else-if="internalFormConfig" class="space-y-6" @submit.prevent="handleSubmit">
    <div class="grid gap-6 md:grid-cols-2">
      <div v-for="field in internalFormConfig.fields" :key="field.id">
        <Wrapper :field="field" v-model="formData[field.id]" />
      </div>
    </div>

    <div class="flex gap-3 pt-2">
      <UButton type="submit" label="Submit form" :loading="loading" :disabled="loading" />
    </div>
    
    <!-- Success/Error Messages -->
    <UAlert
      v-if="submitMessage"
      :color="submitSuccess ? 'green' : 'red'"
      variant="soft"
      :title="submitMessage"
    />
  </UForm>
</template>

<script setup>
import axios from 'axios'
import Wrapper from '~/components/emr/Wrapper.vue'
import { useFormData } from '~/composables/useFormData'

const props = defineProps({
  formConfig: { type: Object, default: null },
  initialData: { type: Object, default: null },
  form: { type: Object, default: null },
  formType: { type: String, default: null }
})
const emit = defineEmits(['submit', 'close'])

const { loadFormData, loading: loadingForm } = useFormData()

const formData = ref({})
const loading = ref(false)
const internalFormConfig = ref(null)
const submitMessage = ref('')
const submitSuccess = ref(false)

const NUMERIC_FIELDS = new Set([
  'corporate_id', 'unit_id', 'category_id', 'template_id', 'header_id', 'footer_id', 
  'css_id', 'pdf_id', 'letterhead_id', 'whatsapp_template_id', 'sms_template_id', 
  'email_template_id', 'form_id', 'min_value', 'max_value', 'standard_value', 
  'standard_value_level2', 'standard_value_level3', 'label_width', 'component_id', 'col', 'priority'
])

const BOOLEAN_FIELDS = new Set([
  'status_pdf', 'status_universal', 'status', 'lock_value_consultant', 
  'status_required', 'status_readonly'
])

const getDefaultValue = (field) => {
  if (field.defaultValue !== undefined) return field.defaultValue
  if (field.type === 'checkbox') return field.options ? [] : false
  if (['number', 'select', 'radio'].includes(field.type)) return null
  return ''
}

const initFormData = (fields, source = {}) => {
  formData.value = Object.fromEntries(
    fields.map(f => [f.id, source[f.id] ?? getDefaultValue(f)])
  )
}

const transformPayload = (raw) => {
  const payload = {}
  
  Object.keys(raw).forEach(key => {
    const value = raw[key]
    
    if (value === null || value === undefined) {
      if (NUMERIC_FIELDS.has(key)) payload[key] = 0
      else if (BOOLEAN_FIELDS.has(key)) payload[key] = false
      return
    }
    
    if (NUMERIC_FIELDS.has(key)) {
      const num = Number(value)
      payload[key] = Number.isNaN(num) ? 0 : num
    } else if (BOOLEAN_FIELDS.has(key)) {
      payload[key] = Boolean(value)
    } else {
      payload[key] = value
    }
  })
  
  if (payload.status === undefined) payload.status = true
  return payload
}

const validateRequired = (payload, requiredFields) => {
  const missing = []
  
  Object.keys(requiredFields).forEach(field => {
    const value = payload[field]
    if (value === undefined || value === null || value === '' || 
        (typeof value === 'number' && value === 0 && field !== 'status' && field !== 'form_id')) {
      missing.push(requiredFields[field])
    }
  })
  
  return missing
}

const handleSubmit = async () => {
  loading.value = true
  submitMessage.value = ''
  submitSuccess.value = false

  try {
    const payload = transformPayload(formData.value)
    
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
    
    const missingFields = validateRequired(payload, requiredFields)
    if (missingFields.length > 0) {
      submitMessage.value = `Please fill in: ${missingFields.join(', ')}`
      submitSuccess.value = false
      return
    }

    const response = await axios.post(apiEndpoint, payload, {
      headers: { 'Content-Type': 'application/json' }
    })

    if (response.data) {
      submitSuccess.value = true
      submitMessage.value = response.data.message || 'Form submitted successfully!'
      emit('submit', { data: formData.value, response: response.data })
      setTimeout(() => emit('close'), 500)
    }
  } catch (err) {
    submitSuccess.value = false
    
    if (err.response?.status === 422 && err.response?.data?.errors) {
      submitMessage.value = 'Please fix the validation errors'
    } else if (err.response?.status >= 500) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Server error occurred'
      submitMessage.value = `Error: ${errorMsg}`
    } else {
      submitMessage.value = err.response?.data?.message || err.message || 'Failed to submit form'
    }
    
    emit('submit', { data: formData.value, error: err.response?.data || err.message })
  } finally {
    loading.value = false
  }
}

const formConfigs = {
  'form-edit': {
    fields: [
      { id: 'corporate_id', label: 'Corporate', type: 'select', required: true, placeholder: 'Select corporate', options: [1,2,3,4] },
      { id: 'unit_id', label: 'Unit', type: 'select', required: true, placeholder: 'Select unit', options: [1,2,3,4] },
      { id: 'category_id', label: 'Category', type: 'select', required: true, placeholder: 'Select category', options: [1,2,3,4] },
      { id: 'form_type', label: 'Form Type', type: 'select', required: true, placeholder: 'Select form type', options: ['FORM'] },
      { id: 'form_code', label: 'Form Code', type: 'text', required: true, placeholder: 'Enter form code' },
      { id: 'form_name', label: 'Form Name', type: 'text', required: true, placeholder: 'Enter form name' },
      { id: 'button_theme', label: 'Button Theme', type: 'select', placeholder: 'Select button theme', options: ['PRIMARY','SECONDARY','SUCCESS','DANGER','WARNING','INFO'] },
      { id: 'template_id', label: 'Template', type: 'select', placeholder: 'Select template', options: [] },
      { id: 'header_id', label: 'Header', type: 'select', placeholder: 'Select header', options: [] },
      { id: 'footer_id', label: 'Footer', type: 'select', placeholder: 'Select footer', options: [] },
      { id: 'css_id', label: 'CSS', type: 'select', placeholder: 'Select CSS', options: [] },
      { id: 'letterhead_id', label: 'Letterhead', type: 'select', placeholder: 'Select letterhead', options: [] },
      { id: 'whatsapp_template_id', label: 'Whatsapp Template', type: 'select', placeholder: 'Select whatsapp template', options: [] },
      { id: 'sms_template_id', label: 'SMS Template', type: 'select', placeholder: 'Select SMS template', options: [] },
      { id: 'email_template_id', label: 'Email Template', type: 'select', placeholder: 'Select email template', options: [] },
      { id: 'save_endpoint', label: 'Save Endpoint', type: 'text', placeholder: 'Enter API endpoint URL' },
      { id: 'workflow_ids', label: 'Workflow IDs', type: 'select', placeholder: 'Enter workflow IDs', options: [1,2,3,4] },
      { id: 'frequency', label: 'Frequency', type: 'select', placeholder: 'Enter frequency', options: ['DAILY','WEEKLY','MONTHLY','YEARLY'] },
      { id: 'icon', label: 'Icon', type: 'select', placeholder: 'Enter icon', options: ['lucide:file','lucide:file-signal','lucide:archive-x','lucide:annoyed'] },
      { id: 'status_pdf', label: 'Enable PDF', type: 'checkbox' },
      { id: 'status_universal', label: 'Universal Status', type: 'checkbox' }
    ]
  },
  'form-field-edit': {
    fields: [
      { id: 'corporate_id', label: 'Corporate ID', type: 'select', placeholder: 'Select corporate', options: [1,2,3,4] },
      { id: 'unit_id', label: 'Unit ID', type: 'select', placeholder: 'Select unit', options: [1,2,3,4] },
      { id: 'form_id', label: 'Form ID', type: 'number', required: true, placeholder: 'Form ID', readonly: true },
      { id: 'data_type', label: 'Data Type', type: 'select', required: true, placeholder: 'Select data type', options: ['TEXT','NUMBER','DATE','DROPDOWN','CHECKBOX','RADIO','FILE','CARD','GROUP','TAB','SECTION','TABLE'] },
      { id: 'data_type_config', label: 'Data Type Config', type: 'textarea', placeholder: 'Enter JSON config' },
      { id: 'min_value', label: 'Min Value', type: 'number', placeholder: 'Enter minimum value' },
      { id: 'max_value', label: 'Max Value', type: 'number', placeholder: 'Enter maximum value' },
      { id: 'standard_value', label: 'Standard Value', type: 'number', placeholder: 'Enter standard value' },
      { id: 'standard_value_level2', label: 'Standard Value Level 2', type: 'number', placeholder: 'Enter level 2' },
      { id: 'standard_value_level3', label: 'Standard Value Level 3', type: 'number', placeholder: 'Enter level 3' },
      { id: 'standard_config', label: 'Standard Config', type: 'textarea', placeholder: 'Enter JSON config' },
      { id: 'field_code', label: 'Field Code', type: 'text', required: true, placeholder: 'Enter field code' },
      { id: 'parent_field_code', label: 'Parent Field Code', type: 'text', placeholder: 'Enter parent field code' },
      { id: 'label', label: 'Label', type: 'text', required: true, placeholder: 'Enter field label' },
      { id: 'label_position', label: 'Label Position', type: 'select', placeholder: 'Select position', options: ['TOP','LEFT','RIGHT','BOTTOM'] },
      { id: 'label_style', label: 'Label Style', type: 'select', placeholder: 'Select style', options: ['T1','T2','H1','H2','H3'] },
      { id: 'label_width', label: 'Label Width', type: 'number', placeholder: 'Enter width (0-100)' },
      { id: 'value', label: 'Value', type: 'textarea', placeholder: 'Enter default value' },
      { id: 'choice_code', label: 'Choice Code', type: 'text', placeholder: 'Enter choice code' },
      { id: 'templates', label: 'Templates', type: 'textarea', placeholder: 'Enter templates JSON' },
      { id: 'template_id', label: 'Template ID', type: 'select', placeholder: 'Select template', options: [0,1,2,3,4] },
      { id: 'server_trigger', label: 'Server Trigger', type: 'select', placeholder: 'Select trigger', options: ['click','blur','change','focus'] },
      { id: 'server_function', label: 'Server Function', type: 'textarea', placeholder: 'Enter function' },
      { id: 'server_function_fields', label: 'Server Function Fields', type: 'textarea', placeholder: 'Enter fields (JSON)' },
      { id: 'data_endpoint', label: 'Data Endpoint', type: 'text', placeholder: 'Enter endpoint URL' },
      { id: 'component_id', label: 'Component ID', type: 'select', placeholder: 'Select component', options: [0,1,2,3,4] },
      { id: 'col', label: 'Column', type: 'number', placeholder: 'Enter column number' },
      { id: 'bind_to', label: 'Bind To', type: 'text', placeholder: 'Enter bind to field' },
      { id: 'bind_value', label: 'Bind Value', type: 'text', placeholder: 'Enter bind value' },
      { id: 'text_prefix', label: 'Text Prefix', type: 'text', placeholder: 'Enter prefix' },
      { id: 'text_suffix', label: 'Text Suffix', type: 'text', placeholder: 'Enter suffix' },
      { id: 'lock_value_with', label: 'Lock Value With', type: 'select', placeholder: 'Select lock', options: ['NA','PT','VISIT'] },
      { id: 'lock_value_consultant', label: 'Lock Value Consultant', type: 'checkbox' },
      { id: 'data', label: 'Data', type: 'textarea', placeholder: 'Enter data JSON' },
      { id: 'priority', label: 'Priority', type: 'number', placeholder: 'Enter priority' },
      { id: 'status_required', label: 'Status Required', type: 'checkbox' },
      { id: 'status_readonly', label: 'Status Readonly', type: 'checkbox' },
      { id: 'status_universal', label: 'Status Universal', type: 'checkbox' }
    ]
  }
}

onMounted(async () => {
  try {
    if (props.formType && formConfigs[props.formType]) {
      internalFormConfig.value = formConfigs[props.formType]
      const source = props.form || {}
      initFormData(internalFormConfig.value.fields, source)
    } else if (props.formConfig) {
      internalFormConfig.value = props.formConfig
      initFormData(internalFormConfig.value.fields, props.initialData)
    } else {
      const { config, data } = await loadFormData()
      internalFormConfig.value = config
      initFormData(config.fields, data || props.initialData)
    }
  } catch (err) {
    console.error('Error loading form:', err)
  }
})
</script>