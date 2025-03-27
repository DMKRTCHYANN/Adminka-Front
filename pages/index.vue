<template>
  <div class="min-h-screen">
    <div class="">
      <nuxt-link :to="'/create'">
        <button
            class="bg-blue-500 p-3 text-white rounded-lg mb-[20px] hover:bg-blue-600 transition-all duration-300 shadow-sm"
        >
          Create new Building
        </button>
      </nuxt-link>
    </div>
    <div>
      <img
          @click="logout"
          src="/images/logout.png"
          alt="Logout"
          class="cursor-pointer w-10 h-10 dark:invert"
      />
    </div>
    <UTable
        :rows="buildings"
        :columns="columns"
        :ui="{
        td: {
          base: 'whitespace-nowrap',
          padding: 'px-4 py-4',
          color: 'text-black',
          font: '',
          size: 'text-sm'
        },
        th: {
          base: 'text-left rtl:text-right',
          padding: 'px-4 py-3.5',
          color: 'text-black',
          font: 'font-semibold',
          size: 'text-sm'
        },
      }"
    >
      <template #actions-data="{ row }">
        <div class="flex gap-1">
          <NuxtLink :to="`/buildings/${row.id}/edit`">
            <img src="/images/edit.svg" alt="Edit" class="cursor-pointer w-7 h-7"/>
          </NuxtLink>
          <img
              src="/images/delete.svg"
              alt="Delete"
              class="cursor-pointer w-7 h-7"
              @click="openDeleteModal(row)"
          />
          <NuxtLink :to="`/buildings/${row.id}/image-edit`">
            <img src="/images/image.png" alt="Image" class="cursor-pointer w-7 h-7"/>
          </NuxtLink>
        </div>
      </template>
      <template #bg_image-data="{ row }">
        <img
            v-if="row.bg_image"
            :src="`http://localhost:8000/storage/${row.bg_image}`"
            alt="User Image"
            class="w-12 h-12 object-cover"
        />
        <span v-else>No image</span>
      </template>
      <template #title-data="{ row }">
        <div v-html="row.title"></div>
      </template>
      <template #short_description-data="{ row }">
        <div v-html="truncate(row.short_description, 15)"></div>
      </template>
    </UTable>
    <Modal
        v-model="isModalOpen"
        :building="selectedBuilding"
        @confirm="deleteBuildingHandler"
    />
  </div>
</template>
<script setup>
import {ref, onMounted, nextTick} from 'vue';
import Modal from "~/compoments/Modal.vue";

definePageMeta({
  layout: 'navbar',
});


const router = useRouter();
const isModalOpen = ref(false);
const selectedBuilding = ref(null);
const buildings = ref([]);
const columns = ref([
  {key: 'id', label: 'ID'},
  {key: 'title', label: 'Title'},
  {key: 'short_description', label: 'Short Description'},
  {key: 'bg_image', label: 'BG Image'},
  {key: 'actions', label: 'Actions'},
]);

const getBuildings = async () => {
  try {
    const {data, error} = await useFetch('/api/buildings');
    if (error.value) {
      console.error('Error loading Buildings:', error.value);
      return;
    }
    buildings.value = data.value.data || [];
  } catch (err) {
    console.error('Unexpected error:', err);
  }
};

const truncate = (text, length) => {
  if (!text) return '';
  return text.length > length ? text.slice(0, length) + '...' : text;
};

const logout = () => {
  const authToken = useCookie("auth_token");
  authToken.value = null;
  router.push("/login");
};

const openDeleteModal = (building) => {
  selectedBuilding.value = building;
  isModalOpen.value = true;
};

const deleteBuildingHandler = async () => {
  if (!selectedBuilding.value) return;
  try {
    const {error} = await useFetch(`/api/buildings/${selectedBuilding.value.id}`, {
      method: 'DELETE',
    });
    if (error.value) throw error.value;
    buildings.value = buildings.value.filter(b => b.id !== selectedBuilding.value.id);
  } catch (err) {
    console.error('Error deleting buildings:', err);
  } finally {
    isModalOpen.value = false;
    selectedBuilding.value = null;
  }
};

onMounted(async () => {
  await nextTick();
  await getBuildings();
});
</script>
