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
        </div>
      </template>
    </UTable>
    <client-modal
      v-model="isModalOpen"
      :client="selectedClient"
      @confirm="deleteClientHandler"
    />
  </div>
</template>
<script setup>
import {ref} from "vue";
import ClientModal from "~/compoments/ClientModal.vue";

definePageMeta({
  layout: 'navbar'
})

const isModalOpen = ref(false);
const selectedClient = ref(null);
const clients = ref([]);
const columns = [
  {key: 'id', label: 'ID'},
  {key: 'name', label: 'Name'},
  {key: 'phone', label: 'Phone'},
  {key: 'email', label: 'Email'},
  {key: 'actions', label: 'Actions'}
];

const openDeleteModal = (client) => {
  selectedClient.value = client;
  isModalOpen.value = true;
};

const deleteClientHandler = async () => {
  if (!selectedClient.value) return;

  try {
    const { error } = await useFetch(`/api/clients/${selectedClient.value.id}`, {
      method: 'DELETE',
    });
    if (error.value) throw error.value;
    clients.value = clients.value.filter((client) => client.id !== selectedClient.value.id);
    console.log('Car deleted successfully.');
  } catch (err) {
    console.error('Error deleting car:', err);
  } finally {
    isModalOpen.value = false;
    selectedClient.value = null;
  }
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
