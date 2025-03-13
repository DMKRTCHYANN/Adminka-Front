<template>
  <div class="flex flex-col items-center mb-[20px]">
    <div
        class="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))]  w-full max-w-[1500px] py-2 px-4 border-b ">
      <div v-for="column in columns" :key="column.key" class="text-black font-semibold text-center">
        {{ column.label }}
      </div>
    </div>
    <div v-for="row in rows" :key="row.id" class="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] py-2 px-4 border-b ">
      <div v-for="column in columns" :key="column.key" class="text-black text-center ">
        {{ row[column.key] }}
      </div>
      <div class="flex gap-4 justify-center">
        <NuxtLink :to="`/${modelName}/${row.id}/edit`">
          <img src="/images/edit.svg" alt="Edit" class="cursor-pointer w-7 h-7 "/>
        </NuxtLink>
        <img
            src="/images/delete.svg"
            alt="Delete"
            class="cursor-pointer w-7 h-7"
            @click="handleDelete(row)"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  rows: {
    type: Array,
    required: true,
    default: () => [],
  },
  columns: {
    type: Array,
    required: true,
    default: () => [],
  },
  modelName: {
    type: String,
    required: true,
  }
});

const emit = defineEmits(['delete']);

const handleDelete = (row) => {
  emit('delete', row);
};
</script>
