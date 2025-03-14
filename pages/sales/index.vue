<template>
  <div class="min-h-screen">
    <UTable
        :rows="sales"
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
          <NuxtLink :to="`/cars/${row.id}/edit`">
            <img src="/images/edit.svg" alt="Edit" class="cursor-pointer w-7 h-7"/>
          </NuxtLink>
        </div>
      </template>
    </UTable>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';

definePageMeta({
  layout: 'navbar'
});

const sales = ref([]);
const columns = ref([
  { key: 'car_id', label: 'Car-ID'},
  { key: 'client_id', label: 'Client-ID'},
  { key: 'sale_date', label: 'Sale-Date'},
  { key: 'price', label: 'Price'},
]);


const getSales = async () => {
  try {
    const { data, error } = await useFetch('/api/sales');
    if (error.value) {
      console.error('Error loading sales:', error.value);
    } else if (data.value) {
      sales.value = data.value.data || [];
      console.log('Sales data:', sales.value);
    }
  } catch (err) {
    console.error('Error loading sales:', err);
  }
};

onMounted(async () => {
  await nextTick();
  await getSales();
});
</script>
