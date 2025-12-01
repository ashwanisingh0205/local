<template>
  <UModal 
    v-model:open="isOpen" 
    :ui="{ width: 'max-w-4xl', bg: 'bg-white dark:bg-gray-800', rounded: 'rounded-xl' }"
    description="Choose the role that matches your position to access the appropriate dashboard and features."
  >
    <template #body>
      <div class="space-y-6">
        <!-- Header -->
        <header>
          <p class="text-sm text-black dark:text-gray-200">
            Choose the role that matches your position to access the appropriate dashboard and features.
          </p>
        </header>

        <!-- Role Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 ">
          <div
            v-for="role in roles"
            :key="role.title"
            @click="selectRole(role.title)"
            class="bg-white dark:bg-gray-800 rounded-2xl p-3 text-center flex flex-col items-center cursor-pointer ring-1 ring-gray-200 dark:ring-gray-700 transition-all duration-200 shadow-sm hover:ring-2 hover:ring-green-500 dark:hover:ring-emerald-500 border-1"
            :class="selectedRole === role.title ? 'border-green-500 dark:border-emerald-500 ring-0 ring-green-500 dark:ring-emerald-500' : 'border-transparent'"
          >
            <div :class="['w-16 h-16 rounded-2xl flex items-center justify-center mb-4', role.bg, role.bgDark]">
              <UIcon :name="role.icon" :class="['w-8 h-8', role.color, role.colorDark]" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">{{ role.title }}</h3>
          </div>
        </div>


      </div>
    </template>
  </UModal>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  open: { type: Boolean, required: true }
});

const emit = defineEmits(["update:open", "continue", "select"]);

const selectedRole = ref(null);


const isOpen = computed({
  get: () => props.open,
  set: (value) => {
    emit("update:open", value);

    if (!value) {
      selectedRole.value = null;
    }
  },
});

const roles = [
  {
    id: 1,
    title: "Nursing Head",
    icon: "lucide:users",
    bg: "bg-blue-100",
    bgDark: "dark:bg-blue-900/30",
    color: "text-blue-600",
    colorDark: "dark:text-blue-400",
  },
  {
    id: 2,
    title: "Medical Officer",
    icon: "lucide:flask-conical",
    bg: "bg-green-100",
    bgDark: "dark:bg-green-900/30",
    color: "text-green-600",
    colorDark: "dark:text-green-400",
  },
  {
    id: 3,
    title: "Accounting Incharge",
    icon: "lucide:calculator",
    bg: "bg-purple-100",
    bgDark: "dark:bg-purple-900/30",
    color: "text-purple-600",
    colorDark: "dark:text-purple-400",
  },
];

function selectRole(title) {
  selectedRole.value = title;
  emit("select", title);
  // Navigate immediately when role is selected
  handleContinue();
}

function handleContinue() {
  if (!selectedRole.value) return;
  emit("continue", selectedRole.value);
  isOpen.value = false;
}

function closeModal() {
  isOpen.value = false;
}
</script>
