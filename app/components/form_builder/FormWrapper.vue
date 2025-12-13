<!-- List of compoents >> Text, Number, Date, Select, Checkbox, Radio -->

<template>
    <div class="mb-4">
        
        <Text v-if="['TEXT', 'NUMBER', 'DATE', 'DATETIME'].includes(field.data_type)" :field="field" />
        <TextArea v-if="field.data_type === 'TEXTAREA'" :field="field" />
        <Switch v-if="field.data_type === 'SWITCH'" :field="field" />
        <Checkbox v-if="field.data_type === 'CHECKBOX'" :field="field" />
        <Radio v-if="field.data_type === 'RADIO'" :field="field" />
        <Dropdown v-if="field.data_type === 'DROPDOWN'" :field="field" />
        <DropdownSearch v-if="field.data_type === 'DROPDOWN_SEARCH'" :field="field" />
        
    </div>
</template>

<script setup>
import Text from "./components/Text.vue";
import Radio from "./components/Radio.vue";
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
