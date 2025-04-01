<template>
  <div class="flex items-center justify-center min-h-screen bg-[#323a40]">
    <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
      <h1 class="text-3xl font-extrabold text-center mb-6 text-black">Code Verification</h1>
      <p v-if="message" class="text-green-500">{{ message }}</p>
      <p v-if="error" class="text-red-500">{{ error }}</p>
      <input
          v-model="code"
          type="text"
          placeholder="Enter the code from the email"
          class="w-full p-2 border text-black mb-[20px] rounded-lg"
      />
      <button @click="verifyCode" class="w-full bg-blue-500 text-white py-2 rounded">
        Verify Code
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

const code = ref('')
const message = ref('')
const error = ref('')
const email = ref(route.query.email || '')

const verifyCode = async () => {
  message.value = ''
  error.value = ''
  if (!email.value) {
    error.value = 'Error: Email is missing'
    return
  }

  const {data, error: fetchError} = await useFetch('/api/password/verify-code', {
    method: 'POST',
    body: {
      email: email.value,
      code: code.value
    }
  })

  if (fetchError.value) {
    error.value = fetchError.value.data.message || 'Error verifying the code'
  } else {
    message.value = data.value.message
    await router.push({
      name: 'reset-password',
      query: {
        email: email.value,
        token: code.value
      }
    })
  }
}
</script>
