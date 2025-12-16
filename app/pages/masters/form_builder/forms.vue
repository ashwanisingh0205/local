<template>
  <div class="flex gap-2 h-[calc(103vh-8rem)]">
    <!-- Form List Column (Left) -->
    <div class="w-1/3 min-w-0 flex flex-col h-full">
      <UCard class="h-full flex flex-col">
        <template #header>
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold">Form List</h2>
            <UButton
              @click="handleNewForm"
              icon="i-lucide:plus"
              label="New"
              color="info"
            />
          </div>
          <!-- Search Input -->
          <div class="mt-4">
            <UInput
              v-model="searchQuery"
              placeholder="Search forms..."
              icon="i-lucide:search"
              class="w-full"
              @input="handleSearch"
            />
          </div>
        </template>

        <template #default>
          <div class="overflow-y-auto h-full" style="max-height: calc(110vh - 20rem);">
            <div v-if="loading" class="p-4 text-center text-gray-500">
              Loading forms...
            </div>
            <div v-else-if="error" class="p-4 text-center text-red-500">
              {{ error }}
            </div>
            <div v-else-if="filteredForms.length === 0" class="p-4 text-center text-gray-500">
              No forms found
            </div>
            <div v-else class="p-4 space-y-4">
              <FormCard
                v-for="form in filteredForms"
                :key="form.id"
                :form="form"
                :is-selected="selectedForm?.id === form.id"
                @view="handleFormView"
                @edit="handleFormEdit"
              />
            </div>
          </div>
        </template>
      </UCard>
    </div>

    <!-- Form Fields Column (Right) -->
    <div class="flex-1 min-w-0 flex flex-col h-full">
      <NuxtPage />
    </div>
  </div>

  <FormEditModal
    v-model:open="isModalOpen"
    :form="formForModal"
    
  />
</template>

<script setup>
import axios from 'axios';

definePageMeta({ layout: 'home' });

const isModalOpen = ref(false);
const selectedForm = ref(null);
const formForModal = ref(null);
const forms = ref([]);
const loading = ref(false);
const error = ref(null);
const searchQuery = ref('');

const route = useRoute();

// Map API response to component format
const mapFormData = (apiForm) => {
  return {
    id: apiForm.id,
    title: apiForm.form_name || '',
    template: apiForm.template_id ? `Template ${apiForm.template_id}` : 'Template Name',
    css: apiForm.css_id ? `CSS ${apiForm.css_id}` : 'CSS',
    header: apiForm.header_id ? `Header ${apiForm.header_id}` : 'Header',
    footer: apiForm.footer_id ? `Footer ${apiForm.footer_id}` : 'Footer',
    letterhead: apiForm.letterhead_id ? `Letterhead ${apiForm.letterhead_id}` : 'Letterhead',
    formCode: apiForm.form_code || '',
    documentType: apiForm.category_id ? `Category ${apiForm.category_id}` : '',
    // Keep original API data for reference
    ...apiForm
  };
};

// Fetch forms from API
const loadForms = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get('http://13.200.174.164:3001/v1/masters/forms/form');
    const data = response.data;
    if (data.success && Array.isArray(data.forms)) {
      forms.value = data.forms.map(mapFormData);
    } else {
      error.value = 'Invalid response format from API';
    }
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Failed to load forms';
  } finally {
    loading.value = false;
  }
};

// Filter forms based on search query
const filteredForms = computed(() => {
  if (!searchQuery.value.trim()) {
    return forms.value;
  }
  const query = searchQuery.value.toLowerCase();
  return forms.value.filter(form => 
    form.title?.toLowerCase().includes(query) ||
    form.formCode?.toLowerCase().includes(query) ||
    form.form_code?.toLowerCase().includes(query)
  );
});

const handleSearch = () => {
  // Search is handled by computed property
};

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

  formForModal.value = null;
  isModalOpen.value = true;
};

// Load forms on mount
onMounted(() => {
  loadForms();
});

</script>
