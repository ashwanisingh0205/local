<template>
  <UModal
    v-model:open="isOpen"
    :ui="{ width: 'max-w-3xl', bg: 'bg-white dark:bg-gray-800', rounded: 'rounded-lg', zIndex: 'z-50' }"
  >
    <template #header>
      <div class="flex items-center justify-between w-full">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Form Edit</h2>
        <UButton
          @click="isOpen = false"
          variant="ghost"
          size="sm"
          icon="i-lucide:x"
          color='neutral'
        />
      </div>
    </template>
    <template #body>
      <UForm :state="formData" @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="field in fields" :key="field.id" class="space-y-2">
            <label :for="field.id" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ field.label }}
            </label>
            <UInput
              v-if="field.type === 'input'"
              :id="field.id"
              v-model="formData[field.id]"
              :placeholder="field.label"
              class="w-full"
            />
            <USelectMenu
              v-else
              :id="field.id"
              v-model="formData[field.id]"
              :items="field.options"
              :placeholder="field.label"
              class="w-full"
            />
          </div>
        </div>
        <div class="flex justify-end gap-3 pt-4">
          <UButton type="submit" variant="solid" label="Submit" color="primary" />
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup>
const props = defineProps({
  open: { type: Boolean, default: false },
  form: { type: Object, default: null }
});

const emit = defineEmits(['update:open', 'submit']);

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
});

const fields = [
  { id: 'formTitle', label: 'Form Title', type: 'input' },
  { id: 'formCode', label: 'Form Code', type: 'input' },
  {
    id: 'template',
    label: 'Template',
    type: 'select',
    options: ['Template Name', 'Standard Template', 'Medical Template', 'Clinical Template', 'Patient Record Template', 'Assessment Template', 'Treatment Template', 'Discharge Template', 'Custom Template 1', 'Custom Template 2']
  },
  {
    id: 'css',
    label: 'CSS',
    type: 'select',
    options: ['CSS', 'Default CSS', 'Medical CSS', 'Clinical CSS', 'Minimal CSS', 'Modern CSS', 'Classic CSS', 'Custom CSS 1', 'Custom CSS 2', 'Custom CSS 3']
  },
  {
    id: 'header',
    label: 'Header',
    type: 'select',
    options: ['Header', 'Standard Header', 'Medical Header', 'Hospital Header', 'Clinic Header', 'Department Header', 'Custom Header 1', 'Custom Header 2', 'No Header', 'Minimal Header']
  },
  {
    id: 'footer',
    label: 'Footer',
    type: 'select',
    options: ['Footer', 'Standard Footer', 'Medical Footer', 'Hospital Footer', 'Clinic Footer', 'Department Footer', 'Custom Footer 1', 'Custom Footer 2', 'No Footer', 'Minimal Footer']
  },
  {
    id: 'letterhead',
    label: 'Letter Head',
    type: 'select',
    options: ['Letterhead', 'Hospital Letterhead', 'Clinic Letterhead', 'Department Letterhead', 'Medical Letterhead', 'Standard Letterhead', 'Custom Letterhead 1', 'Custom Letterhead 2', 'No Letterhead', 'Minimal Letterhead']
  },
  {
    id: 'documentType',
    label: 'Document Type',
    type: 'select',
    options: ['Document Type 1', 'Medical Report', 'Patient Assessment', 'Treatment Plan', 'Discharge Summary', 'Prescription', 'Lab Report', 'Clinical Note', 'Progress Note', 'Consultation Report', 'Emergency Report', 'Surgical Report']
  }
];

const initialFormData = {
  formTitle: '',
  formCode: '',
  template: null,
  css: null,
  header: null,
  footer: null,
  letterhead: null,
  documentType: null
};

const formData = ref({ ...initialFormData });

const updateFormData = (form) => {
  formData.value = {
    formTitle: form?.title || '',
    formCode: form?.formCode || '',
    template: form?.template || null,
    css: form?.css || null,
    header: form?.header || null,
    footer: form?.footer || null,
    letterhead: form?.letterhead || null,
    documentType: form?.documentType || null
  };
};

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    updateFormData(props.form);
  } else {
    formData.value = { ...initialFormData };
  }
});

watch(() => props.form, (newForm) => {
  if (props.open && newForm) updateFormData(newForm);
});

const handleSubmit = () => {
  emit('submit', { ...formData.value, id: props.form?.id });
  isOpen.value = false;
};
</script>