<template>
  <div class="flex items-center justify-center min-h-screen bg-[#323a40] ">
    <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-lg ">
      <h1 class="text-3xl font-extrabold text-center mb-6 text-black">Reset password</h1>
      <div class="space-y-4">
        <form @submit.prevent="sendResetLink">
          <div class="mb-4">
            <label for="email" class="block text-gray-700 font-medium mb-1">Ваш email</label>
            <input
                v-model="email"
                type="email"
                id="email"
                required
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-white bg-black focus:ring-blue-500"
            />
          </div>
          <button
              type="submit"
              class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Отправить ссылку для сброса пароля
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {useFetch} from '#app'

const email = ref('')
const router = useRouter()

const sendResetLink = async () => {
  const response = await useFetch('/api/forgot-password', {
    method: 'POST',
    body: {email: email.value},
  })
  if (response.status) {
    console.log(response)
    await router.push('/reset-password')
  } else {
    alert('Что-то пошло не так!')
  }
}
</script>
