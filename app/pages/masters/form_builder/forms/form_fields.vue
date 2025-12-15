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

  <FormFieldEditModal
    v-model:open="isFieldModalOpen"
    :form="selectedForm"
    @submit="handleFieldSubmit"
  />
</template>

<script setup>
import axios from 'axios';
import FormRenderer from '../../../../components/form_builder/FormRenderer.vue';
import FormFieldEditModal from '../../../../components/FormFieldEditModal.vue';

definePageMeta({ layout: 'home' });

const route = useRoute();

// Inject forms and selectedForm from parent component
const SelectedForm = inject('selectedForm', null);

const formConfig = ref(null);
const loading = ref(false);
const error = ref(null);
const isFieldModalOpen = ref(false);

// Get selected form from injected value (synced with parent)
const selectedForm = computed(() => {
  return SelectedForm?.value || null;
});

// Apply width calculation to fields (same as hr.vue)
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

// Also handle route query params for direct navigation or page refresh
const forms = inject('forms', ref([]));

// Watch for selected form changes and fetch fields
watch(selectedForm, async (newForm, oldForm) => {
  console.log('Selected form changed:', newForm, oldForm);
  // Only fetch if form changed and has form_code
  if (newForm && newForm.form_code) {
    if (newForm.form_code !== oldForm?.form_code) {
      console.log('Loading form fields for:', newForm.form_code);
      await loadFormFields(newForm.form_code);
    }
  } else if (!newForm) {
    formConfig.value = null;
  }
}, { immediate: true });

// Watch route query params as fallback
watch(() => route.query.id, async (formId) => {
  console.log('Route query id changed:', formId);
  if (formId && forms.value.length > 0) {
    const formIdNum = Number.parseInt(formId, 10);
    // If selectedForm doesn't match or is not set, try to load from forms list
    if (!selectedForm.value || selectedForm.value.id !== formIdNum) {
      const form = forms.value.find(f => f.id === formIdNum);
      if (form && form.form_code) {
        console.log('Loading form fields from route query:', form.form_code);
        await loadFormFields(form.form_code);
      }
    }
  }
}, { immediate: true });

// Watch forms list to handle case when it loads after component mount
watch(() => forms.value.length, () => {
  console.log('Forms list updated, length:', forms.value.length);
  // If we have a route query but forms weren't loaded before, try again
  if (route.query.id && forms.value.length > 0 && !formConfig.value) {
    const formIdNum = Number.parseInt(route.query.id, 10);
    const form = forms.value.find(f => f.id === formIdNum);
    if (form && form.form_code) {
      console.log('Loading form fields after forms list loaded:', form.form_code);
      loadFormFields(form.form_code);
    }
  }
});

// Fetch form fields from API
const loadFormFields = async (formCode) => {
  if (!formCode) {
    console.log('No form code provided');
    formConfig.value = null;
    return;
  }

  loading.value = true;
  error.value = null;
  
  try {
    const baseUrl = 'http://13.200.174.164:3001';
    const url = `${baseUrl}/v1/form/formdata?form_code=${formCode}`;
    
    console.log('Fetching form fields from:', url);
    const response = await axios.get(url);
    const data = response.data;
    
    console.log('API Response:', data);
    
    if (data.success && data.form && Array.isArray(data.fields)) {
      // Store form config with form, fields, and fieldMap (same structure as hr.vue)
      formConfig.value = {
        form: data.form,
        fields: data.fields,
        fieldMap: data.fieldMap || {}
      };
      // Apply width calculation to fields
      applyWidthCalculation(formConfig.value.fields);
      console.log('Form config set:', formConfig.value);
      console.log('Fields count:', formConfig.value.fields.length);
    } else {
      error.value = 'Invalid response format from API';
      formConfig.value = null;
      console.error('Invalid API response:', data);
    }
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Failed to load form fields';
    formConfig.value = null;
    console.error('Error loading form fields:', err);
  } finally {
    loading.value = false;
  }
};

const handleNewFormField = () => {
  if (!selectedForm.value) {
    error.value = 'Please select a form first';
    return;
  }
  isFieldModalOpen.value = true;
};

const handleFieldSubmit = async (submitData) => {
  console.log('Form field submitted:', submitData);
  // Reload form fields after successful submission
  if (selectedForm.value?.form_code) {
    await loadFormFields(selectedForm.value.form_code);
  }
};

const handleFormFieldEdit = (field) => {
  console.log('Edit form field:', field);
};

// Handle initial load
onMounted(() => {
  console.log('Form fields component mounted');
  console.log('Selected form:', selectedForm.value);
  console.log('Route query:', route.query);
  
  // If we have a route query id but no selectedForm, try to load it
  if (route.query.id && !selectedForm.value) {
    const formIdNum = Number.parseInt(route.query.id, 10);
    const form = forms.value.find(f => f.id === formIdNum);
    if (form && form.form_code) {
      console.log('Loading form on mount from route query:', form.form_code);
      loadFormFields(form.form_code);
    }
  } else if (selectedForm.value && selectedForm.value.form_code) {
    console.log('Loading form on mount from selectedForm:', selectedForm.value.form_code);
    loadFormFields(selectedForm.value.form_code);
  }
});
</script>

