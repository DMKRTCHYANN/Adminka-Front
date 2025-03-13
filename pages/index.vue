<template>
  <div class="min-h-screen">
    <UTable
        :rows="cars"
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
            <img src="/images/edit.svg" alt="Edit" class="cursor-pointer w-7 h-7" />
          </NuxtLink>
          <img
              src="/images/delete.svg"
              alt="Delete"
              class="cursor-pointer w-7 h-7"
              @click="openDeleteModal(row)"
          />
          <UModal
              v-model="isModalOpen"
              :car="selectedCar"
              @confirm="deleteCarHandler"
          />
        </div>
      </template>
    </UTable>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';

definePageMeta({
  layout: 'navbar',
});

const isModalOpen = ref(false);
const selectedCar = ref(null);
const cars = ref([]);
const columns = ref([
  { key: 'id', label: 'ID' },
  { key: 'brand', label: 'Brand' },
  { key: 'model', label: 'Model' },
  { key: 'year', label: 'Year' },
  { key: 'price', label: 'Price' },
  { key: 'mileage', label: 'Mileage' },
  { key: 'condition', label: 'Condition' },
  { key: 'actions', label: 'Actions' },
  { key: 'status', label: 'Status' },
]);

const openDeleteModal = (car) => {
  selectedCar.value = car;
  isModalOpen.value = true;
};

const deleteCarHandler = async () => {
  if (!selectedCar.value) return;

  try {
    const { error } = await useFetch(`/api/cars/${selectedCar.value.id}`, {
      method: 'DELETE',
    });

    if (error.value) throw error.value;

    cars.value = cars.value.filter(car => car.id !== selectedCar.value.id);
    console.log(`Car deleted successfully.`);
  } catch (err) {
    console.error('Error deleting car:', err);
  } finally {
    isModalOpen.value = false;
    selectedCar.value = null;
  }
};



const getCars = async () => {
  try {
    const { data, error } = await useFetch('/api/cars', {
      method: 'GET',
      immediate: true,
    });


    if (error.value) {
      console.error('Error loading cars:', error.value);
    } else if (data.value) {
      cars.value = data.value.data || []; // или просто data.value в зависимости от структуры API
      cars.value = cars.value.map((car) => ({
        ...car,
        condition: car.mileage > 40 ? 'used' : 'new',
      }));
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
};


onMounted(async () => {
  await nextTick();
  await getCars();
});
</script>

