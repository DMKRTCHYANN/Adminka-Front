<template>
  <div>
    <ul>
      <li v-for="building in buildings" :key="building.id">{{ building.title }}</li>
    </ul>
    <UPagination
        v-model:page="internalPage"
        :page-count="pageCount"
        :total="total"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useFetch } from '@vueuse/core';

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
  buildingsPerPage: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);
const internalPage = ref(props.modelValue);

const buildings = ref([]);
const total = ref(0);
const pageCount = ref(1);

const fetchUsers = async () => {
  try {
    const {data} = await useFetch('/api/buildings', {
      params: {
        page: internalPage.value,
        limit: props.buildingsPerPage,
      },
    }).json();

    if (data.value) {
      buildings.value = data.value.users;
      total.value = data.value.total;
      pageCount.value = Math.ceil(total.value / props.buildingsPerPage);
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    buildings.value = [];
    total.value = 0;
    pageCount.value = 1;
  }
};

watch(
    () => props.modelValue,
    (newValue) => {
      internalPage.value = newValue;
    }
);

watch(
    internalPage,
    async (newValue) => {
      if (newValue > 0 && newValue <= pageCount.value) {
        emit('update:modelValue', newValue);
        await fetchUsers();
      }
    },
    {immediate: true}
);
</script>