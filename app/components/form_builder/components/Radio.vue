<template>
    <UFormField :label="field.label">
        <URadioGroup v-model="field.value" :items="field.items" :icon="field.icon" :label="field.label" />
    </UFormField>
</template>
<script setup>
const props = defineProps({
    field: { type: Object, required: true },
});
</script>
