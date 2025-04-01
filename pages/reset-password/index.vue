<template>
  <div class="flex items-center justify-center min-h-screen bg-[#323a40]">
    <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
      <h1 class="text-3xl font-extrabold text-center mb-6 text-black">Reset Password</h1>
      <p v-if="message" class="text-green-500">{{ message }}</p>
      <p v-if="error" class="text-red-500">{{ error }}</p>
      <input
          v-model="password"
          type="password"
          placeholder="New password"
          class="w-full p-2 border text-black mb-[20px] rounded-lg"
      />
      <input
          v-model="password_confirmation"
          type="password"
          placeholder="Confirm password"
          class="w-full p-2 border text-black mb-[20px] rounded-lg"
      />
      <button @click="resetPassword" class="w-full bg-blue-500 text-white py-2 rounded">
        Reset Password
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useFetch } from '#app'
import { useRouter, useRoute } from '#vue-router'

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

  const { data, error: fetchError } = await useFetch('/api/password/reset', {
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
