<template>
  <UModal v-model="isOpen" prevent-close>
    <div class="relative z-[9999]">
      <UCard class="min-w-[400px]">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold">
              Are you sure you want to delete {{ client?.name }}?
            </h3>
            <UButton
                icon="i-heroicons-x-mark-20-solid"
                color="gray"
                variant="ghost"
                @click="closeModal"
            />
          </div>
        </template>
        <div class="flex justify-end gap-3">
          <UButton label="Cancel" color="gray" @click="closeModal" />
          <UButton label="Confirm" color="red" @click="confirmDelete" />
        </div>
      </UCard>
    </div>
  </UModal>
</template>
<script setup>
const props = defineProps({
  client: Object,
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const closeModal = () => {
  isOpen.value = false
}

const confirmDelete = () => {
  emit('confirm')
  closeModal()
}
</script>

