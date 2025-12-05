<template>
  <div class="flex gap-4">
    <!-- Form List Column (Left) -->
    <div class="w-1/3 min-w-0 flex flex-col">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold">Form List</h2>
            <UButton
              @click="selectedForm = null; isModalOpen = true"
              icon="i-lucide:plus"
              label="New"
              color="info"
            />
          </div>
        </template>

        <template #default>
          <div class="p-4 space-y-4">
            <FormCard
              v-for="form in forms"
              :key="form.id"
              :form="form"
              :is-selected="selectedForm?.id === form.id"
              @view="handleFormView"
              @edit="selectedForm = form; isModalOpen = true"
            />
          </div>
        </template>
      </UCard>
    </div>

    <!-- Form Fields Column (Right - NuxtPage) -->
    <div class="flex-1 min-w-0 flex flex-col">
      <NuxtPage />
    </div>
  </div>

  <FormEditModal
    v-model:open="isModalOpen"
    :form="selectedForm"
    
  />
</template>

<script setup>
definePageMeta({ layout: 'home' });

const isModalOpen = ref(false);
const selectedForm = ref(null);

const forms = ref([
  {
    id: 1,
    title: 'DIABETIC FLOW SHEET',
    template: 'Template Name',
    css: 'CSS',
    header: 'Header',
    footer: 'Footer',
    letterhead: 'Letterhead',
    formCode: 'DFS001',
    documentType: 'Document Type 1'
  },
  {
    id: 2,
    title: 'Doctor Diabetic Flow Sheet',
    template: 'Template Name',
    css: 'CSS',
    header: 'Header',
    footer: 'Footer',
    letterhead: 'Letterhead',
    formCode: 'DDFS002',
    documentType: 'Document Type 2'
  },
  {
    id: 3,
    title: 'Doctor Urinary Catheterization Checklist',
    template: 'Template Name',
    css: 'CSS',
    header: 'Header',
    footer: 'Footer',
    letterhead: 'Letterhead',
    formCode: 'DUCC003',
    documentType: 'Document Type 1'
  },
  {
    id: 4,
    title: 'EMERGENCY NURSING ASSESSMENT SHEET',
    template: 'Template Name',
    css: 'CSS',
    header: 'Header',
    footer: 'Footer',
    letterhead: 'Letterhead',
    formCode: 'ENAS004',
    documentType: 'Document Type 3'
  },
  {
    id: 5,
    title: 'PATIENT VITALS RECORD',
    template: 'Template Name',
    css: 'CSS',
    header: 'Header',
    footer: 'Footer',
    letterhead: 'Letterhead',
    formCode: 'PVR005',
    documentType: 'Document Type 2'
  }
]);

const route = useRoute();

// Provide forms data to child pages via provide/inject
provide('forms', forms);
provide('selectedForm', selectedForm);

const handleFormView = (form) => {
  selectedForm.value = form;
  // Navigate to nested route for form fields
  navigateTo({
    path: '/masters/form_builder/forms/form_fields',
    query: { id: form.id.toString() }
  });
};

// Watch route changes to sync selectedForm with URL
watch(() => route.query.id, (formId) => {
  if (formId) {
    const id = Number(formId);
    const form = forms.value.find(f => f.id === id);
    if (form) {
      selectedForm.value = form;
    }
  } else if (route.path === '/masters/form_builder/forms') {
    // Clear selection when on parent route only (no query param)
    selectedForm.value = null;
  }
}, { immediate: true });

// Handle form submission from modal
const handleFormSubmit = (formData) => {
  if (formData.id) {
    // Update existing form
    const index = forms.value.findIndex(f => f.id === formData.id);
    if (index !== -1) {
      forms.value[index] = {
        ...forms.value[index],
        title: formData.formTitle,
        formCode: formData.formCode,
        template: formData.template,
        css: formData.css,
        header: formData.header,
        footer: formData.footer,
        letterhead: formData.letterhead,
        documentType: formData.documentType
      };
    }
  } else {
    // Create new form
    forms.value.push({
      id: forms.value.length + 1,
      title: formData.formTitle,
      formCode: formData.formCode,
      template: formData.template || 'Template Name',
      css: formData.css || 'CSS',
      header: formData.header || 'Header',
      footer: formData.footer || 'Footer',
      letterhead: formData.letterhead || 'Letterhead',
      documentType: formData.documentType
    });
  }
  selectedForm.value = null;
  isModalOpen.value = false;
};
</script>
