<!--<template>-->
<!--  <div class="min-h-screen">-->
<!--    <div class="flex justify-between">-->
<!--      <nuxt-link :to="'/create'">-->
<!--        <button-->
<!--            class="bg-blue-500 p-3 text-white rounded-lg mb-[20px] hover:bg-blue-600 transition-all duration-300 shadow-sm"-->
<!--        >-->
<!--          Create new Building-->
<!--        </button>-->
<!--      </nuxt-link>-->
<!--      <div>-->
<!--        <img-->
<!--            @click="logout"-->
<!--            src="/images/logout.png"-->
<!--            alt="Logout"-->
<!--            class="cursor-pointer w-10 h-10 dark:invert"-->
<!--        />-->
<!--      </div>-->
<!--    </div>-->
<!--    <vuedraggable-->
<!--        v-model="buildings"-->
<!--        :item-key="'id'"-->
<!--        :move="onMove"-->
<!--        @end="onDragEnd"-->
<!--    >-->
<!--      <template #item="{ element }">-->
<!--        <UTable-->
<!--            :rows="[element]"-->
<!--            :columns="columns"-->
<!--            :ui="{-->
<!--            td: { base: 'whitespace-nowrap', padding: 'px-4 py-4', color: 'text-black', size: 'text-sm' },-->
<!--            th: { base: 'text-left', padding: 'px-4 py-3.5', color: 'text-black', size: 'text-sm' },-->
<!--          }"-->
<!--        >-->
<!--          <template #actions-data="{ row }">-->
<!--            <div class="flex gap-1">-->
<!--              <NuxtLink :to="`/buildings/${row.id}/edit`">-->
<!--                <img src="/images/edit.svg" alt="Edit" class="cursor-pointer w-7 h-7"/>-->
<!--              </NuxtLink>-->
<!--              <img-->
<!--                  src="/images/delete.svg"-->
<!--                  alt="Delete"-->
<!--                  class="cursor-pointer w-7 h-7"-->
<!--                  @click="openDeleteModal(row)"-->
<!--              />-->
<!--              <NuxtLink :to="`/buildings/${row.id}/image-edit`">-->
<!--                <img src="/images/image.png" alt="Image" class="cursor-pointer w-7 h-7"/>-->
<!--              </NuxtLink>-->
<!--            </div>-->
<!--          </template>-->
<!--          <template #bg_image-data="{ row }">-->
<!--            <img-->
<!--                v-if="row.bg_image"-->
<!--                :src="`http://localhost:8000/storage/${row.bg_image}`"-->
<!--                alt="Building Image"-->
<!--                class="w-12 h-12 object-cover"-->
<!--            />-->
<!--            <span v-else>No image</span>-->
<!--          </template>-->
<!--          <template #title-data="{ row }">-->
<!--            <div v-html="row.title"></div>-->
<!--          </template>-->
<!--          <template #short_description-data="{ row }">-->
<!--            <div v-html="truncate(row.short_description, 15)"></div>-->
<!--          </template>-->
<!--        </UTable>-->
<!--      </template>-->
<!--    </vuedraggable>-->
<!--    <Modal-->
<!--        v-model="isModalOpen"-->
<!--        :building="selectedBuilding"-->
<!--        @confirm="deleteBuildingHandler"-->
<!--    />-->
<!--  </div>-->
<!--  <div class="flex justify-center gap-4 mt-4">-->
<!--    <UPagination-->
<!--        v-model="page"-->
<!--        :page-count="totalPages"-->
<!--        :total="totalItems"-->
<!--        @update:model-value="changePage"-->
<!--    />-->
<!--  </div>-->
<!--</template>-->
<!--<script setup>-->
<!--import {ref, onMounted, nextTick} from 'vue';-->
<!--import vuedraggable from 'vuedraggable';-->
<!--import Modal from "~/compoments/Modal.vue";-->

<!--definePageMeta({-->
<!--  layout: 'navbar',-->
<!--  middleware: ['auth'],-->
<!--});-->

<!--const page = ref(1);-->
<!--const limit = ref(10);-->
<!--const buildings = ref([]);-->
<!--const totalItems = ref(0);-->
<!--const totalPages = ref(1);-->
<!--const isModalOpen = ref(false);-->
<!--const selectedBuilding = ref(null);-->
<!--const columns = [-->
<!--  {key: 'id', label: 'ID'},-->
<!--  {key: 'title', label: 'Title'},-->
<!--  {key: 'short_description', label: 'Short Description'},-->
<!--  {key: 'bg_image', label: 'BG Image'},-->
<!--  {key: 'actions', label: 'Actions'},-->
<!--];-->

<!--const getBuildings = async () => {-->
<!--  try {-->
<!--    const response = await $fetch("/api/buildings", {-->
<!--      params: { page: page.value, limit: limit.value },-->
<!--      headers: {-->
<!--        Accept: 'application/json',-->
<!--        'Content-Type': 'application/json',-->
<!--      },-->
<!--    });-->
<!--    if (response) {-->
<!--       console.log(response.total)-->
<!--      buildings.value = response.data || [];-->
<!--      totalItems.value = response.total;-->
<!--      limit.value = response.per_page || limit.value;-->
<!--      totalPages.value = response.per_page-->
<!--    } else {-->
<!--      buildings.value = [];-->
<!--      totalItems.value = 0;-->
<!--      totalPages.value = 1;-->
<!--    }-->
<!--  } catch (err) {-->
<!--    console.error("Unexpected error:", err);-->
<!--    buildings.value = [];-->
<!--    totalItems.value = 0;-->
<!--    totalPages.value = 1;-->
<!--  }-->
<!--};-->


<!--const onDragEnd = async () => {-->
<!--  try {-->
<!--    const order = buildings.value.map((building) => building.id);-->
<!--    const {error} = await useFetch('/api/buildings/reorder', {-->
<!--      method: 'POST',-->
<!--      body: {order},-->
<!--    });-->
<!--    if (error) {-->
<!--      console.error('Error reordering buildings:', error);-->
<!--    } else {-->
<!--      console.log('Buildings reordered successfully');-->
<!--    }-->
<!--  } catch (err) {-->
<!--    console.error('Unexpected error:', err);-->
<!--  }-->
<!--};-->

<!--const changePage = async (newPage) => {-->
<!--  page.value = newPage;-->
<!--  await getBuildings();-->
<!--};-->

<!--const truncate = (text, length) => {-->
<!--  return text?.length > length ? `${text.slice(0, length)}...` : text;-->
<!--};-->

<!--const logout = () => {-->
<!--  const authToken = useCookie('auth_token');-->
<!--  authToken.value = null;-->
<!--  useRouter().push('/login');-->
<!--};-->

<!--const openDeleteModal = (building) => {-->
<!--  selectedBuilding.value = building;-->
<!--  isModalOpen.value = true;-->
<!--};-->

<!--const deleteBuildingHandler = async () => {-->
<!--  if (!selectedBuilding.value) return;-->

<!--  try {-->
<!--    const {error} = await useFetch(`/api/buildings/${selectedBuilding.value.id}`, {-->
<!--      method: 'DELETE',-->
<!--    });-->
<!--    if (error) throw error;-->
<!--    buildings.value = buildings.value.filter(-->
<!--        (building) => building.id !== selectedBuilding.value.id-->
<!--    );-->
<!--  } catch (err) {-->
<!--    console.error('Error deleting building:', err);-->
<!--  } finally {-->
<!--    isModalOpen.value = false;-->
<!--    selectedBuilding.value = null;-->
<!--  }-->
<!--};-->

<!--onMounted(async () => {-->
<!--  await nextTick();-->
<!--  await getBuildings();-->
<!--});-->
<!--</script>-->

<template>
  <div class="min-h-screen">
    <div class="flex justify-between">
      <nuxt-link :to="'/create'">
        <button
            class="bg-blue-500 p-3 text-white rounded-lg mb-[20px] hover:bg-blue-600 transition-all duration-300 shadow-sm"
        >
          Create new Building
        </button>
      </nuxt-link>
      <div>
        <img
            @click="logout"
            src="/images/logout.png"
            alt="Logout"
            class="cursor-pointer w-10 h-10 dark:invert"
        />
      </div>
    </div>
    <div class="flex justify-start mb-4">
      <button
          class="bg-gray-300 p-2 rounded hover:bg-gray-400 transition-all duration-300"
          @click="toggleSortOrder"
      >
        Sort by ID ({{ sortOrder === 'asc' ? 'ascending' : 'descending' }})
      </button>
    </div>
    <vuedraggable
        v-model="buildings"
        :item-key="'id'"
        :move="onMove"
        @end="onDragEnd"
    >
      <template #item="{ element }">
        <UTable
            :rows="[element]"
            :columns="columns"
            :ui="{
            td: { base: 'whitespace-nowrap', padding: 'px-4 py-4', color: 'text-black', size: 'text-sm' },
            th: { base: 'text-left', padding: 'px-4 py-3.5', color: 'text-black', size: 'text-sm' },
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
                alt="Building Image"
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
      </template>
    </vuedraggable>
    <Modal
        v-model="isModalOpen"
        :building="selectedBuilding"
        @confirm="deleteBuildingHandler"
    />
  </div>
  <div class="flex justify-center gap-4 mt-4">
    <UPagination
        v-model="page"
        :page-count="totalPages"
        :total="totalItems"
        @update:model-value="changePage"
    />
  </div>
</template>
<script setup>
import {ref, onMounted, nextTick} from 'vue';
import vuedraggable from 'vuedraggable';
import Modal from "~/compoments/Modal.vue";

definePageMeta({
  layout: 'navbar',
  middleware: ['auth'],
});

const page = ref(1);
const limit = ref(10);
const router = useRouter();
const buildings = ref([]);
const totalItems = ref(0);
const totalPages = ref(1);
const isModalOpen = ref(false);
const selectedBuilding = ref(null);
const sortOrder = ref('asc');
const columns = [
  {key: 'id', label: 'ID'},
  {key: 'title', label: 'Title'},
  {key: 'short_description', label: 'Short Description'},
  {key: 'bg_image', label: 'BG Image'},
  {key: 'actions', label: 'Actions'},
];

const getBuildings = async () => {
  try {
    const response = await $fetch("/api/buildings", {
      params: {page: page.value, limit: limit.value, order: 'id', direction: sortOrder.value},
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    if (response) {
      buildings.value = response.data || [];
      totalItems.value = response.total;
      limit.value = response.per_page || limit.value;
      totalPages.value = response.per_page
    } else {
      buildings.value = [];
      totalItems.value = 0;
      totalPages.value = 1;
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    buildings.value = [];
    totalItems.value = 0;
    totalPages.value = 1;
  }
};

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  getBuildings();
};

const onDragEnd = async () => {
  try {
    const order = buildings.value.map((building) => building.id);
    const {error} = await useFetch('/api/buildings/reorder', {
      method: 'POST',
      body: {order},
    });
    if (error) {
      console.error('Error reordering buildings:', error);
    } else {
      console.log('Buildings reordered successfully');
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
};

const changePage = async (newPage) => {
  page.value = newPage;
  await getBuildings();
};

const truncate = (text, length) => {
  return text?.length > length ? `${text.slice(0, length)}...` : text;
};

const logout = () => {
  const authToken = useCookie('auth_token');
  authToken.value = null;
  router.push('/login');
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
    if (error) throw error;
    buildings.value = buildings.value.filter(
        (building) => building.id !== selectedBuilding.value.id
    );
  } catch (err) {
    console.error('Error deleting building:', err);
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
