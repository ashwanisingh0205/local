<template>


  <!-- Dynamic Form -->
  <DynamicForm formCode="REGISTRATION" :formParam="{ userId: 12345 }" @submit="handleSubmit" />

  <Form />
</template>

<script setup>
definePageMeta({
  layout: 'home'
})

import DynamicForm from '~/components/emr/DynamicForm.vue'
import Form from '~/components/form_builder/Form.vue'
// Handle form submission
const handleSubmit = (data) => {
  console.log('Form submitted:', data)

  alert('Form submitted successfully!')
}
</script>
