<template>
  <div class="min-h-screen">
    <UTable
        :rows="clients"
        :columns="columns"
        :ui="{
        td: {
          base: 'whitespace-nowrap',
          padding: 'px-4 py-4',
          color: 'text-black',
          font: '',
          size: 'text-sm'
        },
        th: {
          base: 'text-left rtl:text-right',
          padding: 'px-4 py-3.5',
          color: 'text-black',
          font: 'font-semibold',
          size: 'text-sm'
        },
      }"
    >
      <template #actions-data="{ row }">
        <div class="flex gap-4">
          <NuxtLink :to="`/clients/${row.id}/edit`">
            <img src="/images/edit.svg" alt="Edit" class="cursor-pointer w-7 h-7"/>
          </NuxtLink>
          <img
              src="/images/delete.svg"
              alt="Delete"
              class="cursor-pointer w-7 h-7"
              @click="openDeleteModal(row)"
          />
          <UModal
              v-model:is-open="isModalOpen"
              :title="'Confirm Delete'"
              :content="'Are you sure you want to delete this car?'"
              @confirm="deleteCarHandler"
          />
        </div>
      </template>
    </UTable>
  </div>
</template>
<script setup>
import {ref} from "vue";

definePageMeta({
  layout: 'navbar'
})

const isModalOpen = ref(false);
const selectedCar = ref(null);
const clients = ref([]);
const columns = [
  {key: 'id', label: 'ID'},
  {key: 'name', label: 'Name'},
  {key: 'phone', label: 'Phone'},
  {key: 'email', label: 'Email'},
  {key: 'actions', label: 'Actions'}
];

const openDeleteModal = (car) => {
  selectedCar.value = car;
  isModalOpen.value = true;
};

const getClients = async () => {
  try {
    const {data, error} = await useFetch("/api/clients");
    if (error.value) {
      console.error('Error loading clients:', error.value);
    } else if (data.value) {
      clients.value = data.value.data || [];
    }
  } catch (error) {
    console.log('Error loading clients', error)
  }
}

onMounted(async () => {
  await nextTick();
  await getClients();
});
</script>
