<template>

    <div :class="['INLINE-WITH-TITLE', 'INLINE-WITHOUT-TITLE'].includes(field.label_position) ? 'flex' : ''">
        <span :style="{ width: field.label_width + '%' }" v-if="
            [
                'INLINE-WITH-TITLE',
                'INLINE-WITHOUT-TITLE',
                ,
            ].includes(field.label_position)
        ">
            <template v-if="field.label_position === 'INLINE-WITH-TITLE'">
                <span :style="field.label_style">{{ field.label }}</span>
            </template>

            <!-- INLINE-WITHOUT-TITLE -->
            <template v-else-if="field.label_position === 'INLINE-WITHOUT-TITLE'">

            </template>
        </span>

        <div class="border border-gray-200 rounded-lg p-5 bg-white" :style="{ width: field.value_width + '%' }">
            <div v-if="['BLOCK-WITH-TITLE', 'BLOCK-WITHOUT-TITLE'].includes(field.label_position)">

                <template v-if="field.label_position === 'BLOCK-WITH-TITLE'">
                    <span :style="field.label_style" class="mb-1">
                        {{ field.label }}
                    </span>
                </template>

            </div>
            <FormRenderer :fields="field.fields" />
        </div>
    </div>
</template>

<script setup>
import FormRenderer from "../FormRenderer.vue";

const props = defineProps({
    field: {
        type: Object,
        required: true,
    },
});
</script>
