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

        <div :style="{ width: field.value_width + '%' }">
            <div v-if="['BLOCK-WITH-TITLE', 'BLOCK-WITHOUT-TITLE'].includes(field.label_position)">

                <template v-if="field.label_position === 'BLOCK-WITH-TITLE'">
                    <span :style="field.label_style" class="mb-1">
                        {{ field.label }}
                    </span>
                </template>

            </div>
            <div>
                <span v-if="field.text_prefix" class="text-gray-500">
                    {{ field.text_prefix }}
                </span>

                <UInput v-model="field.value" class="" :placeholder="field.label"
                    :disabled="field.status_readonly || field.lock_value_consultant" :icon="field.icon"
                    :type="inputType" :maxlength="field.max_value" :minlength="field.min_value">
                    <template #trailing>
                        <div v-if="field.max_value" class="text-xs text-muted tabular-nums" role="status">
                            {{ field.value?.length || 0 }}/{{ field.max_value }}
                        </div>
                    </template>
                </UInput>

                <span v-if="field.text_suffix" class="text-gray-500">
                    {{ field.text_suffix }}
                </span>
            </div>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    field: { type: Object, required: true },
});


const labelStyle = computed(() => {
    const width = props.field.label_width;

    return width
        ? { width: typeof width === "number" ? width + "px" : width }
        : {};
});
const inputType = computed(() => {
    switch (props.field.data_type) {
        case "NUMBER":
            return "number";
        case "DATE":
            return "date";
        case "DATETIME":
            return "datetime-local";
        default:
            return "text";
    }
});
</script>
