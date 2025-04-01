<template>
  <div class="flex items-center justify-center min-h-screen bg-[#323a40] ">
    <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-lg ">
      <h1 class="text-3xl font-extrabold text-center mb-6  text-black">Welcome back!</h1>
      <div class="space-y-4">
        <form action="" @submit.prevent="login">
          <div>
            <p class="text-black">Email</p>
            <input
                v-model="email"
                class="w-full p-2 border mb-[20px] text-black rounded-lg"
                type="text"
                placeholder="Enter email"
            />
          </div>
          <div>
            <div class="flex justify-between">
              <p class="text-black">Password</p>
              <nuxt-link  to="/forgot-password">
                <span
                    class="text-blue-700"
                >
                  forgot password
                </span>
              </nuxt-link>
            </div>
            <div>
              <label class="block text-sm text-black font-medium"></label>
              <PasswordInput
                  class="mb-[20px]"
                  v-model="password"
              />
            </div>
          </div>
          <div class="flex justify-center">
            <button
                class="bg-gray-200 p-3 flex  justify-center w-full max-w-[250px] text-gray-800 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 transition-all duration-300 shadow-sm"
                type="submit"
            >
              Login
            </button>
          </div>
        </form>
        <p v-if="errorMessage" class="text-red-500 text-center mt-4">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import { useCookie } from '#app';
import PasswordInput from "~/compoments/PasswordInput.vue";

definePageMeta({
  middleware: ["auth"]
});

const email = ref('');
const password = ref('');
const errorMessage = ref(null);
const router = useRouter();


const login = async () => {
  errorMessage.value = null;
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email: email.value, password: password.value}),
      credentials: 'include',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to login');
    }
    const data = await response.json();
    console.log('Login successful, redirecting...');
    const tokenCookie = useCookie('auth_token');
    tokenCookie.value = data.access_token;
    await router.push('/');
  } catch (err) {
    errorMessage.value = err.message || 'Invalid email or password';
    console.error('Login failed:', err.message);
  }
};
</script>