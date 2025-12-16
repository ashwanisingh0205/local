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
            @click="isFieldModalOpen = true"
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
        <div v-else-if="formConfig?.fields?.length" class="p-4">
          <UForm>
            <FormRenderer :fields="formConfig.fields" />
          </UForm>
        </div>
        <div v-else-if="selectedForm" class="p-8 text-center">
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
const selectedForm = inject('selectedForm', ref(null));
const forms = inject('forms', ref([]));

const formConfig = ref(null);
const loading = ref(false);
const error = ref(null);
const isFieldModalOpen = ref(false);
const currentFormCode = ref(null);

const applyWidthCalculation = (fields) => {
  fields.forEach(f => {
    let labelWidth = typeof f.label_width === "string" && f.label_width.includes('%')
      ? parseInt(f.label_width.replace('%', ''), 10)
      : f.label_width || 30;
    
    f.label_width = labelWidth;
    f.value_width = 100 - labelWidth;
    
    if (Array.isArray(f.fields)) applyWidthCalculation(f.fields);
  });
};

const loadFormFields = async (formCode) => {
  if (!formCode || currentFormCode.value === formCode) return;
  
  currentFormCode.value = formCode;
  loading.value = true;
  error.value = null;
  
  try {
    const { data } = await axios.get(`http://13.200.174.164:3001/v1/form/formdata?form_code=${formCode}`);
    
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

const checkAndLoadForm = () => {
  let formCode = selectedForm.value?.form_code;
  
  if (!formCode && route.query.id && forms.value.length) {
    const form = forms.value.find(f => f.id === parseInt(route.query.id, 10));
    formCode = form?.form_code;
  }
  
  if (formCode) {
    loadFormFields(formCode);
  } else {
    formConfig.value = null;
    currentFormCode.value = null;
  }
};

const handleFieldSubmit = async () => {
  if (selectedForm.value?.form_code) {
    currentFormCode.value = null;
    await loadFormFields(selectedForm.value.form_code);
  }
};

onMounted(() => {
  checkAndLoadForm();
});

onUpdated(() => {
  checkAndLoadForm();
});
</script>