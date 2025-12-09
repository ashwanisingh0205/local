** List of compoents >> Text, Number, Date, Select, Checkbox, Radio

<template>
    <Text v-if="
        field.data_type === 'TEXT' ||
        field.data_type === 'NUMBER' ||
        field.data_type === 'DATE' ||
        field.data_type === 'DATETIME'
    " :field="field" class="mb-4" />
    <TextArea v-if="field.data_type === 'TEXTAREA'" :field="field" class="mb-4" />
    <Switch v-if="field.data_type === 'SWITCH'" :field="field" class="mb-4" />
    <Checkbox v-if="field.data_type === 'CHECKBOX'" :field="field" class="mb-4" />
    <Dropdown v-if="field.data_type === 'DROPDOWN'" :field="field" class="mb-4" />
    <DropdownSearch v-if="field.data_type === 'DROPDOWN_SEARCH'" :field="field" class="mb-4" />

</template>

<script setup>
import Text from "./components/Text.vue";
import TextArea from "./components/TextArea.vue";
import Switch from "./components/Switch.vue";
import Checkbox from "./components/Checkbox.vue";
import Dropdown from "./components/Dropdown.vue";
import DropdownSearch from "./components/DropdownSearch.vue";


const props = defineProps({
    field: {
        type: Object,
        required: true,
    },
});
</script>
