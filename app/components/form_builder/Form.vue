** Main Form Control
Params:
form_code: REG
params: Parameters



Life Cycle
OnMount:
Load(form_code, params)


Functions:
handleSubmit()
handleServerFunctions();
handleOnBind();

<template>
    <div class="container mt-4">
        <h1>{{ formConfig?.form?.form_name }}</h1>
        <form v-if="formConfig">
            <FormRenderer :fields="formConfig.fields" />

        </form>




    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import FormRenderer from './FormRenderer.vue';
import testJson from '../../../test.json';

const formConfig = ref(null);

// Recursive function to add value_width to each field
const applyWidthCalculation = (fields) => {
    fields.forEach(f => {
        let labelWidth = f.label_width;

        // Handle "20%" or other string values
        if (typeof labelWidth === "string" && labelWidth.includes('%')) {
            labelWidth = parseInt(labelWidth.replace('%', ''));
        }

        // Default label width = 30 if missing or zero
        if (!labelWidth || labelWidth === 0) {
            labelWidth = 30;
        }

        // Calculate value_width
        f.value_width = 100 - labelWidth;

        // Rewrite label_width as number for consistency
        f.label_width = labelWidth;

        // Recursively handle nested fields
        if (Array.isArray(f.fields)) {
            applyWidthCalculation(f.fields);
        }
    });
};

const loadForm = () => {
    formConfig.value = testJson;
    applyWidthCalculation(formConfig.value.fields);  // mutate original JSON
};

onMounted(() => {
    loadForm();
});
</script>
