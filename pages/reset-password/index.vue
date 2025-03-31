<template>
  <div>
    <h1>Восстановление пароля</h1>
    <form @submit.prevent="resetPassword">
      <div>
        <label for="password">Новый пароль</label>
        <input v-model="password" type="password" id="password" required />
      </div>
      <div>
        <label for="password_confirmation">Подтверждение пароля</label>
        <input v-model="password_confirmation" type="password" id="password_confirmation" required />
      </div>
      <button type="submit">Сбросить пароль</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import { useFetch } from '#app'

const password = ref('')
const password_confirmation = ref('')
const router = useRouter()
const route = useRoute()

const resetPassword = async () => {
  const response = await useFetch('/api/reset-password', {
    method: 'POST',
    body: {
      token: route.params.token,
      password: password.value,
      password_confirmation: password_confirmation.value,
    },
  })

  if (response.status === 200) {
    router.push('/login')
  } else {
    alert('Что-то пошло не так!')
  }
}
</script>
