<template>
    <UFormField :label="field.label">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 border border-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                v-for="colField in columnFields"
                :key="colField.field_code"
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {{ colField.label }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(row, rowIndex) in tableRows" :key="rowIndex">
              <td
                v-for="colField in columnFields"
                :key="colField.field_code"
                class="px-4 py-3 whitespace-nowrap"
              >
                <FormWrapper :field="getCellField(colField, row)" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UFormField>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import FormWrapper from '../FormWrapper.vue'
  
  const props = defineProps({
    field: {
      type: Object,
      required: true,
    },
  })
  
  const tableRows = ref([])
  const columnFields = ref([])
  
  onMounted(() => {
    // Get row data from field.values (table.json structure) or field.data (test.json structure)
    const data = props.field.values || props.field.data || []
    
    // Ensure data is an array
    if (Array.isArray(data)) {
      tableRows.value = data
    } else if (data && typeof data === 'object') {
      tableRows.value = [data]
    } else {
      tableRows.value = []
    }
    
    // Get column definitions from field.fields
    if (props.field.fields && Array.isArray(props.field.fields)) {
   
      columnFields.value = [...props.field.fields]
    } 
    
  })
  
  // Create field object for each cell with value from row data
  function getCellField(colField, row) {
    const cellValue = row[colField.field_code] || ''
    
    return {
      ...colField,
      value: cellValue,
      label: '', 
    }
  }
  </script>
  
  
  