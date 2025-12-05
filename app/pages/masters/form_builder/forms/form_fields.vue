<template>
  <div class="w-full flex flex-col">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">
            Form Field
            <span v-if="selectedForm" class="text-sm text-gray-500 font-normal">
              - {{ selectedForm.title }}
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
        <div v-if="selectedForm && selectedFormFields.length > 0" class="p-4 space-y-2">
          <UCard
            v-for="(field, index) in selectedFormFields"
            :key="field.id || index"
            class="cursor-pointer"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <UBadge :label="field.type" color="error" size="xs" />
                  <span class="text-xs text-gray-500">{{ field.id }}</span>
                </div>
                <p class="text-sm mb-1 font-medium">{{ field.description }}</p>
                <code class="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{{ field.key }}</code>
              </div>
              <UButton
                @click.stop="handleFormFieldEdit(field)"
                size="xs"
                icon="i-lucide:pencil"
                variant="outline"
                color="neutral"
              />
            </div>
          </UCard>
        </div>
        <div v-else-if="selectedForm && selectedFormFields.length === 0" class="p-8 text-center">
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
definePageMeta({ layout: 'home' });

const route = useRoute();

// Inject forms and selectedForm from parent component
const SelectedForm = inject('selectedForm', null);

// Mock form fields data - in production, this would come from an API
const formFieldsData = {
  1: [
    { type: 'TEXT', id: 101, description: 'Patient chief complaint', key: 'CHIEF-COMPLAINT' },
    { type: 'TEXTAREA', id: 102, description: 'Detailed complaint description', key: 'COMPLAINT-DETAIL' },
    { type: 'TEXT', id: 201, description: 'Onset of symptoms', key: 'ONSET' },
    { type: 'TEXT', id: 202, description: 'Duration of illness', key: 'DURATION' },
    { type: 'RADIO', id: 301, description: 'Smoking status', key: 'SMOKING-STATUS' },
    { type: 'TEXT', id: 401, description: 'Medication name', key: 'MEDICATION-NAME' }
  ],
  2: [
    { type: 'TEXT', id: 101, description: 'Patient chief complaint', key: 'CHIEF-COMPLAINT' },
    { type: 'TEXTAREA', id: 102, description: 'Detailed complaint description', key: 'COMPLAINT-DETAIL' },
    { type: 'TEXT', id: 201, description: 'Onset of symptoms', key: 'ONSET' },
    { type: 'RADIO', id: 301, description: 'Smoking status', key: 'SMOKING-STATUS' },
    { type: 'TEXT', id: 401, description: 'Medication name', key: 'MEDICATION-NAME' }
  ],
  3: [
    { type: 'RADIO', id: 696, description: '1. Identified the patient and checked doctor\'s order', key: 'DOCTORS-ORDER' },
    { type: 'RADIO', id: 380, description: 'Given dorsal recumbent position and draped patient.', key: 'DORSAL-RECUMBENT' },
    { type: 'RADIO', id: 384, description: 'Applied sterile drape and applied sterile gloves', key: 'APPLIED-STERILE' },
    { type: 'TEXT', id: 377, description: 'State the reason for catheterization', key: 'STATE' },
    { type: 'RADIO', id: 381, description: 'The urethral meatus was cleaned with sterile saline and betadine.', key: 'URETHRAL-MEATUS' },
    { type: 'TEXT', id: 382, description: 'Foley\'s size', key: 'FOLEYS-SIZE' },
    { type: 'TEXT', id: 383, description: 'Foley\'s Type', key: 'TYPE' },
    { type: 'RADIO', id: 379, description: 'Provided privacy for the patient and explained the patient about the procedure', key: 'PRIVACY' },
    { type: 'RADIO', id: 385, description: 'Removed plastic covering from catheter and Use sterile lubricant: Lubricated catheter.', key: 'LUBRICATED' }
  ],
  4: [
    { type: 'TEXT', id: 601, description: 'Blood Pressure', key: 'BP' },
    { type: 'TEXT', id: 602, description: 'Heart Rate', key: 'HR' },
    { type: 'TEXT', id: 603, description: 'Temperature', key: 'TEMP' },
    { type: 'TEXT', id: 604, description: 'Respiratory Rate', key: 'RR' }
  ],
  5: [
    { type: 'TEXT', id: 801, description: 'Systolic BP', key: 'SYS-BP' },
    { type: 'TEXT', id: 802, description: 'Diastolic BP', key: 'DIA-BP' },
    { type: 'TEXT', id: 803, description: 'Pulse', key: 'PULSE' }
  ]
};

// Get selected form from injected value (synced with parent)
const selectedForm = computed(() => {
  return SelectedForm?.value || null;
});

// Get form fields for selected form
const selectedFormFields = computed(() => {
  if (!selectedForm.value || !selectedForm.value.id) return [];
  const fields = formFieldsData[selectedForm.value.id];
  return Array.isArray(fields) ? fields : [];
});

const handleNewFormField = () => {
  console.log('New form field for:', selectedForm.value);
};

const handleFormFieldEdit = (field) => {
  console.log('Edit form field:', field);
};
</script>

