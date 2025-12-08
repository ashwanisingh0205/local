<template>
  <UContainer>
    <div class="space-y-6 py-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Patient List</h1>
          <p class="text-sm text-gray-600 dark:text-gray-400">Manage and view all patient records</p>
        </div>
      </div>

      <!-- Patient Table -->
      <UCard :ui="{ body: { padding: 'p-0' }, ring: 'ring-1 ring-gray-200 dark:ring-gray-800' }" class="shadow-sm">
        <div class="overflow-x-auto">
          <UTable 
            :data="patientsData" 
            class="w-full"
            :ui="{
              th: { base: 'text-left rtl:text-right', padding: 'px-4 py-3.5', font: 'font-semibold', color: 'text-gray-900 dark:text-white', background: 'bg-gray-50 dark:bg-gray-800/50' },
              td: { base: 'whitespace-nowrap', padding: 'px-4 py-4' },
              tbody: 'divide-y divide-gray-200 dark:divide-gray-800'
            }"
          >
            <!-- Patient Info -->
            <template #name-data="{ row }">
              <div class="flex items-center gap-3 min-w-[200px]">
                <UAvatar 
                  :text="row.initials" 
                  size="md" 
                  color="primary"
                />
                <div class="min-w-0 flex-1">
                  <div class="font-semibold text-gray-900 dark:text-white truncate">{{ row.name }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">{{ row.age }} • {{ row.gender }}</div>
                </div>
              </div>
            </template>

            <!-- MRN -->
            <template #mrn-data="{ row }">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300 font-mono">
                {{ row.mrn }}
              </span>
            </template>

            <!-- Room -->
            <template #room-data="{ row }">
              <div class="min-w-[120px]">
                <div class="font-semibold text-gray-900 dark:text-white">{{ row.room }}</div>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {{ row.ward }}
                </span>
              </div>
            </template>

            <!-- Diagnosis -->
            <template #diagnosis-data="{ row }">
              <span class="text-sm text-gray-700 dark:text-gray-300">
                {{ row.diagnosis }}
              </span>
            </template>

            <!-- Doctor -->
            <template #doctor-data="{ row }">
              <span class="text-sm text-gray-700 dark:text-gray-300">
                {{ row.doctor }}
              </span>
            </template>

            <!-- Days -->
            <template #days-data="{ row }">
              <div class="text-center">
                <div class="font-semibold text-gray-900 dark:text-white text-lg">{{ row.days }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{{ row.days === 1 ? 'day' : 'days' }}</div>
              </div>
            </template>

            <!-- Actions -->
            <template #actions-data="{ row }">
              <div class="flex items-center gap-1">
                <UButton
                  icon="i-lucide:eye"
                  color="gray"
                  variant="ghost"
                  size="sm"
                  @click="viewPatient(row)"
                />
                <UButton
                  icon="i-lucide:pencil"
                  color="gray"
                  variant="ghost"
                  size="sm"
                  @click="editPatient(row)"
                />
                <UButton
                  icon="i-lucide:more-horizontal"
                  color="gray"
                  variant="ghost"
                  size="sm"
                  @click="showMoreOptions(row)"
                />
              </div>
            </template>
          </UTable>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>
<script setup>
const { patients } = usePatient()

const patientsData = ref([])

watchEffect(() => {
  if (patients.value && patients.value.length > 0) {
    patientsData.value = patients.value.map(({ statusBgColor, statusColor, ...patient }) => patient)
  }
})

const viewPatient = (patient) => {
  console.log('View patient:', patient)
}

const editPatient = (patient) => {
  console.log('Edit patient:', patient)
}

const showMoreOptions = (patient) => {
  console.log('More options for patient:', patient)
}

definePageMeta({
  layout: 'home'
})
</script>
