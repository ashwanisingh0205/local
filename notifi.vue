<template>
  <div class="w-full flex flex-col">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">
            Form Field
            <span v-if="selectedForm" class="text-sm text-gray-500 font-normal">
              - {{ selectedForm.title || selectedForm.form_name }}
            </span>
          </h2>
          <UButton
            v-if="selectedForm"
            @click="handleNewFormField"
            icon="i-lucide:plus"
            label="New"
            color="info"
          />
        </div>
      </template>

      <template #default>
        <div v-if="loading" class="p-8 text-center text-gray-500">
          <UIcon name="lucide:loader-2" class="w-8 h-8 mx-auto mb-2 animate-spin" />
          <p>Loading form fields...</p>
        </div>
        <div v-else-if="error" class="p-8 text-center text-red-500">
          <UIcon name="lucide:alert-circle" class="w-8 h-8 mx-auto mb-2" />
          <p>{{ error }}</p>
        </div>
        <div v-else-if="selectedForm && formConfig && formConfig.fields && formConfig.fields.length > 0" class="p-4">
          <!-- Debug info - temporarily enabled to help debug -->
          
          <UForm>
            <FormRenderer :fields="formConfig.fields" />
          </UForm>
        </div>
        <div v-else-if="selectedForm && !loading && (!formConfig || !formConfig.fields || formConfig.fields.length === 0)" class="p-8 text-center">
          <UIcon name="lucide:file-text" class="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
          <p class="text-gray-600 dark:text-gray-400 mb-2">No form fields found</p>
          <p class="text-sm text-gray-500 dark:text-gray-500">Click "New" to add a form field</p>
        </div>
        <div v-else class="p-8 text-center">
          <UIcon name="lucide:file-search" class="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
          <p class="text-gray-600 dark:text-gray-400 mb-2">No form selected</p>
          <p class="text-sm text-gray-500 dark:text-gray-500">Select a form from the list to view its fields</p>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup>
import axios from 'axios';
import FormRenderer from '../../../../components/form_builder/FormRenderer.vue';

definePageMeta({ layout: 'home' });

const route = useRoute();
const SelectedForm = inject('selectedForm', null);
const forms = inject('forms', ref([]));

const formConfig = ref(null);
const loading = ref(false);
const error = ref(null);

const selectedForm = computed(() => SelectedForm?.value || null);

// Apply width calculation to fields
const applyWidthCalculation = (fields) => {
  fields.forEach(f => {
    let labelWidth = f.label_width;
    if (typeof labelWidth === "string" && labelWidth.includes('%')) {
      labelWidth = Number.parseInt(labelWidth.replace('%', ''), 10);
    }
    if (!labelWidth || labelWidth === 0) {
      labelWidth = 30;
    }
    f.value_width = 100 - labelWidth;
    f.label_width = labelWidth;
    if (Array.isArray(f.fields)) {
      applyWidthCalculation(f.fields);
    }
  });
};

// Fetch form fields from API
const loadFormFields = async (formCode) => {
  if (!formCode) {
    formConfig.value = null;
    return;
  }

  loading.value = true;
  error.value = null;
  
  try {
    const response = await axios.get(`http://13.200.174.164:3001/v1/form/formdata?form_code=${formCode}`);
    const data = response.data;
    
    if (data.success && data.form && Array.isArray(data.fields)) {
      formConfig.value = {
        form: data.form,
        fields: data.fields,
        fieldMap: data.fieldMap || {}
      };
      applyWidthCalculation(formConfig.value.fields);
    } else {
      error.value = 'Invalid response format from API';
      formConfig.value = null;
    }
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Failed to load form fields';
    formConfig.value = null;
  } finally {
    loading.value = false;
  }
};

const handleNewFormField = () => {
  // Handle new form field
};

const handleFormFieldEdit = (field) => {
  // Handle edit form field
};

// Load form fields on mount
onMounted(() => {
  if (selectedForm.value?.form_code) {
    loadFormFields(selectedForm.value.form_code);
  } else if (route.query.id) {
    const form = forms.value.find(f => f.id === Number.parseInt(route.query.id, 10));
    if (form?.form_code) {
      loadFormFields(form.form_code);
    }
  }
});
</script>

