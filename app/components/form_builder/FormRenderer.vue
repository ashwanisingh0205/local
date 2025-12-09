** Render form components

** Rows & Cols
** Table, Card, Group, Tabs
** Child components >> Text, Number, Date, Select, Checkbox, Radio


<template>

    <template v-for="field in fields" :key="field.id">

        <Group :field="field" v-if="field.data_type === 'GROUP'" class="mb-2">

        </Group>

        <div v-if="field.data_type === 'TABLE'" class="mb-2">

        </div>
        <Card v-if="field.data_type === 'CARD'" :field="field" class="mb-2">

        </Card>
        <div v-else class="mb-2">
            <FormWrapper :field="field" />
        </div>

    </template>

</template>

<script setup>

import Group from './components/Group.vue';
import FormWrapper from './FormWrapper.vue';
import Card from './components/Card.vue';
const props = defineProps({
    fields: {
        type: Array,
        required: true,
    },
});




</script>
