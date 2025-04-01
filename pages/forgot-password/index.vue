<template>
  <div class="flex items-center justify-center min-h-screen bg-[#323a40]">
    <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
      <h1 class="text-3xl font-extrabold text-center mb-6 text-black">Password Reset</h1>
      <p v-if="message" class="text-green-500">{{ message }}</p>
      <p v-if="error" class="text-red-500">{{ error }}</p>
      <input
          v-model="email"
          type="email"
          placeholder="Enter your email"
          class="w-full p-2 border text-black mb-[20px] rounded-lg"
      />
      <button @click="sendResetCode" class="w-full bg-blue-500 text-white py-2 rounded">
        Send Code
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useFetch } from '#app'
import { useRouter } from '#vue-router'

const email = ref('')
const message = ref('')
const error = ref('')
const router = useRouter()

const sendResetCode = async () => {
  message.value = ''
  error.value = ''
  if (!email.value) {
    error.value = 'Error: Email is required'
    return
  }
  const { data, error: fetchError } = await useFetch('/api/password/request-reset', {
    method: 'POST',
    body: {email: email.value}
  })
  if (fetchError.value) {
    error.value = fetchError.value.data.error
  } else {
    message.value = data.value.message
    await router.push({
      name: 'code-verify',
      query: {email: email.value}
    })
  }
}
</script>
