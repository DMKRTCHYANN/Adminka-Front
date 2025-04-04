<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-[500px] p-[30px]  bg-white rounded-lg shadow-lg overflow-hidden">
      <h1 class="text-3xl font-extrabold text-center mb-6 text-black">Reset Password</h1>
      <p v-if="message" class="text-green-500">{{ message }}</p>
      <p v-if="error" class="text-red-500">{{ error }}</p>
      <input
          v-model="password"
          type="password"
          placeholder="New password"
          class="w-full p-3 border border-gray-300 rounded-lg mb-[20px] text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
      />
      <input
          v-model="password_confirmation"
          type="password"
          placeholder="Confirm password"
          class="w-full p-3 border border-gray-300 rounded-lg mb-[20px] text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
      />
      <button @click="resetPassword" class="w-full bg-blue-500 text-white py-2 rounded">
        Reset Password
      </button>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {useFetch} from '#app'
import {useRouter, useRoute} from '#vue-router'

const route = useRoute()
const router = useRouter()
const password = ref('')
const password_confirmation = ref('')
const message = ref('')
const error = ref('')
const email = ref(route.query.email || '')
const token = ref(route.query.token || '')

const resetPassword = async () => {
  message.value = ''
  error.value = ''
  if (!email.value || !token.value) {
    error.value = 'Error: Not enough data to reset'
    return
  }
  const {data, error: fetchError} = await useFetch('/api/password/reset', {
    method: 'POST',
    body: {
      email: email.value,
      token: token.value,
      password: password.value,
      password_confirmation: password_confirmation.value
    }
  })
  if (fetchError.value) {
    error.value = fetchError.value.data.message || 'Error resetting password'
  } else {
    message.value = 'Password successfully reset!'
    setTimeout(() => router.push('/login'), 2000)
  }
}
</script>
