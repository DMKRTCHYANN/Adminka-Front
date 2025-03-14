<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
      <h1 class="text-4xl font-bold text-center text-gray-800 mb-6">Edit Client</h1>
      <div v-if="loading" class="text-center text-gray-500">Loading...</div>
      <div v-else>
        <div class="mb-4">
          <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
            Name <span class="text-red-500">*</span>
          </label>
          <input
              id="name"
              v-model="client.name"
              class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              placeholder="Enter name"
          />
        </div>
        <div class="mb-4">
          <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
            Phone <span class="text-red-500">*</span>
          </label>
          <input
              id="phone"
              v-model="client.phone"
              @input="validatePhone"
              class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              placeholder="Enter phone"
          />
        </div>
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Email <span class="text-red-500">*</span>
          </label>
          <div class="flex">
            <input
                id="email"
                v-model="emailUsername"
                @input="updateEmail"
                class="flex-grow p-3 border border-gray-300 rounded-l-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                placeholder="Enter email username"
            />
            <select
                v-model="emailDomain"
                @change="updateEmail"
                class="p-3 border border-gray-300 rounded-r-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
            >
              <option value="@gmail.com">@gmail.com</option>
              <option value="@mail.ru">@mail.ru</option>
              <option value="@yahoo.com">@yahoo.com</option>
            </select>
          </div>
        </div>
        <div class="flex justify-center">
          <button
              @click="updateClient"
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

const emailUsername = ref('');
const emailDomain = ref('@gmail.com');
const loading = ref(true);
const route = useRoute();
const router = useRouter();
const client = ref({
  name: '',
  phone: '',
  email: '',
});


const getClientById = async () => {
  try {
    const response = await fetch(`/api/clients/${route.params.id}`);
    if (!response.ok) throw new Error('Failed to fetch client data');
    const data = await response.json();
    client.value = data;
    const [username, domain] = client.value.email.split('@');
    emailUsername.value = username;
    emailDomain.value = '@' + domain;
  } catch (error) {
    console.error('Error fetching client:', error);
  } finally {
    loading.value = false;
  }
};

const validatePhone = () => {
  client.value.phone = client.value.phone.replace(/\D/g, '').slice(0  , 9);
};

const updateEmail = () => {
  client.value.email = emailUsername.value + emailDomain.value;
};

const updateClient = async () => {
  try {
    const response = await fetch(`/api/clients/${route.params.id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(client.value),
    });
    if (!response.ok) throw new Error('Failed to update client');
    await router.push('/clients');
  } catch (error) {
    console.error('Error updating client:', error);
  }
};

onMounted(async () => {
  await getClientById();
});
</script>