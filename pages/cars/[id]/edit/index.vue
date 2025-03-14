<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
      <h1 class="text-4xl font-bold text-center text-gray-800 mb-6">Edit Car</h1>
      <div v-if="loading" class="text-center text-gray-500">Loading...</div>
      <div v-else>
        <div class="mb-4">
          <label for="price" class="block text-sm font-medium text-gray-700 mb-2">
            Price <span class="text-red-500">*</span>
          </label>
          <input
              type="number"
              v-model.number="car.price"
              class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              placeholder="Enter price"
          />
        </div>
        <div class="mb-4">
          <label for="mileage" class="block text-sm font-medium text-gray-700 mb-2">
            Mileage <span class="text-red-500">*</span>
          </label>
          <input
              type="number"
              v-model.number="car.mileage"
              @input="updateCondition"
              class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              placeholder="Enter mileage"
          />
        </div>
        <div class="mb-4">
          <label for="condition" class="block text-sm font-medium text-gray-700 mb-2">
            Condition
          </label>
          <input
              type="text"
              :value="car.condition"
              class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              disabled
          />
        </div>
        <div class="flex justify-center">
          <button
              @click="updateCar"
              class="bg-blue-500 p-3 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-sm focus:ring-2 focus:ring-blue-400"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const toast = useToast();
const loading = ref(true);
const route = useRoute();
const router = useRouter();
const car = ref({
  price: '',
  mileage: '',
  condition: '',
});

const getCarById = async () => {
  try {
    const response = await fetch(`/api/cars/${route.params.id}`);
    if (!response.ok) throw new Error('Failed to fetch car data');
    const data = await response.json();
    car.value = {
      ...data,
      condition: data.mileage > 40 ? 'used' : 'new',
    };
  } catch (error) {
    console.error('Error fetching car:', error);
  } finally {
    loading.value = false;
  }
};

const updateCondition = () => {
  car.value.condition = car.value.mileage > 40 ? 'used' : 'new';
};

const updateCar = async () => {
  try {
    const payload = {
      ...car.value,
      condition: car.value.mileage > 40 ? 'used' : 'new',
    };
    const response = await fetch(`/api/cars/${route.params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Failed to update car');
    await router.push('/');
  } catch (error) {
    console.error('Error updating car:', error);
  }
};

onMounted(async () => {
  await getCarById();
});
</script>