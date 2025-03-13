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
              v-model.number="client.name"
              id="price"
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
              v-model.number="client.phone"
              id="mileage"
              class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              placeholder="Enter mileage"
          />
        </div>
        <div class="mb-6">
          <label for="condition" class="block text-sm font-medium text-gray-700 mb-2">
            condition <span class="text-red-500">*</span>
          </label>
          <select
              v-model="client.email"
              class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
          >
            <option value="available">new</option>
            <option value="sold">used</option>
          </select>
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

const loading = ref(true)
const client = ref({
  name: '',
  phone: '+374',
  email: ''
})
</script>