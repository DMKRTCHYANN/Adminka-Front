<template>
  <div class="relative">
    <input
        :type="isPasswordVisible ? 'text' : 'password'"
        class="w-full p-2 border text-black rounded-lg"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
    />
    <button
        type="button"
        @click="togglePassword"
        class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent border-none cursor-pointer"
    >
      <img
          :src="isPasswordVisible ? '/images/visibility_off.png' : '/images/visibility.png'"
          :alt="isPasswordVisible ? 'Hide password' : 'Show password'"
          class="w-5 h-5 opacity-70 hover:opacity-100"
      />
    </button>
    <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
  </div>
</template>
<script setup>
import { ref } from 'vue';

defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: 'Enter password',
  },
  error: {
    type: String,
    default: '',
  },
});

const isPasswordVisible = ref(false);

const togglePassword = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};
</script>

<style scoped>
</style>
