<template>
  <div class="flex gap-4">
    <!-- Form List Column (Left) -->
    <div class="w-1/3 min-w-0 flex flex-col">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold">Form List</h2>
            <UButton
              @click="handleNewForm"
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
              @edit="handleFormEdit"
            />
          </div>
        </template>
      </UCard>
    </div>

    <!-- Form Fields Column (Right) -->
    <div class="flex-1 min-w-0 flex flex-col">
      <NuxtPage />
    </div>
  </div>

  <FormEditModal
    v-model:open="isModalOpen"
    :form="formForModal"
    
  />
</template>

<script setup>
definePageMeta({ layout: 'home' });

const isModalOpen = ref(false);
const selectedForm = ref(null);
const formForModal = ref(null);

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

const handleFormEdit = (form) => {
  selectedForm.value = form;
  formForModal.value = form;
  isModalOpen.value = true;
};

const handleNewForm = () => {
  // Don't unselect the current form, just open the modal for creating a new form
  // Set formForModal to null to indicate it's a new form (not editing existing)
  formForModal.value = null;
  isModalOpen.value = true;
};

// Handle form submission from modal

</script>
