<template>
  <div class="min-h-screen">
    <div class="flex flex-col items-center mb-[20px]">
      <div class="grid grid-cols-6 bg-gray-200 w-full max-w-[1500px] py-2 px-4 border-b border-gray-300">
        <div class="text-gray-700 font-semibold text-center">ID</div>
        <div class="text-gray-700 font-semibold text-center">Car-ID</div>
        <div class="text-gray-700 font-semibold text-center">Client-ID</div>
        <div class="text-gray-700 font-semibold text-center">Sale-Date</div>
        <div class="text-gray-700 font-semibold text-center">Price</div>
        <div class="text-gray-700 font-semibold text-center">Actions</div>
      </div>
      <div
          v-for="sale in sales"
          :key="sale.id"
          class="grid grid-cols-6 items-center bg-white w-full max-w-[1500px] py-2 px-4 border-b border-gray-200"
      >
        <p class="text-center text-gray-700">{{ sale.id }}</p>
        <p class="text-center text-gray-700">{{ sale.car_id }}</p>
        <p class="text-center text-gray-700">{{ sale.client_id }}</p>
        <p class="text-center text-gray-700">{{ sale.sale_date }}</p>
        <p class="text-center text-gray-700">{{ sale.price }}</p>
        <div class="flex space-x-2 justify-center">
          <button class="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
            Edit
          </button>
          <button class="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';

definePageMeta({
  layout: 'navbar'
});

const sales = ref([]);

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
