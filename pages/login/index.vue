<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-[#323a40] z-50">
      <img src="/images/logo.svg" alt="Logo Image" class="animate-pulse w-60 h-60">
    </div>

    <div v-else class="flex w-full max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="w-1/2 bg-gray-600 p-8 flex items-center justify-center">
        <img src="/images/logo.svg" alt="Login Image"/>
      </div>
      <div class="w-1/2 p-8">
        <h1 class="text-3xl font-extrabold mb-6 text-black">Welcome back!</h1>
        <div class="space-y-4">
          <form action="" @submit.prevent="login">
            <div>
              <input
                  v-model="email"
                  class="w-full p-3 border border-gray-300 rounded-lg mb-[20px] text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  type="text"
                  placeholder="Enter email"
              />
            </div>
            <div class="flex justify-between">
              <nuxt-link to="/forgot-password">
                <span class="text-blue-700 mb-[7px]">forgot password?</span>
              </nuxt-link>
            </div>
            <div>
              <PasswordInput v-model="password" class="w-full mb-7"/>
            </div>
            <div class="flex justify-center">
              <button
                  class="p-3 max-w-[250px] w-full bg-blue-500 text-white py-2 rounded"
                  type="submit"
                  :disabled="isLoading"
              >
                Login
              </button>
            </div>
          </form>
          <p v-if="errorMessage" class="text-red-500 text-center mt-4">{{ errorMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCookie } from '#app';
import PasswordInput from "~/compoments/PasswordInput.vue";

definePageMeta({
  middleware: ["auth"]
});

const email = ref('');
const password = ref('');
const errorMessage = ref(null);
const isLoading = ref(false);
const router = useRouter();

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const login = async () => {
  errorMessage.value = null;
  isLoading.value = true;

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email.value, password: password.value }),
      credentials: 'include',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to login');
    }
    const data = await response.json();
    console.log('Login successful, waiting before redirect...');
    const tokenCookie = useCookie('auth_token');
    tokenCookie.value = data.access_token;
    await delay(2000);
    await router.push('/');
  } catch (err) {
    errorMessage.value = err.message || 'Invalid email or password';
    console.error('Login failed:', err.message);
  } finally {
    isLoading.value = false;
  }
};
</script>
