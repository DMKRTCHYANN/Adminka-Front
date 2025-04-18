<!--<template>-->
<!--  <div class="min-h-screen">-->
<!--    <div class="flex justify-between items-center mb-6">-->
<!--      <nuxt-link :to="'/create'">-->
<!--        <button-->
<!--            class="bg-blue-500 p-3 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-sm"-->
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
<!--    <div class="relative overflow-x-auto shadow-md rounded-lg">-->
<!--      <table class="w-full text-sm text-left text-gray-500">-->
<!--        <thead class="text-xs text-gray-700 uppercase bg-gray-50">-->
<!--        <tr>-->
<!--          <th v-for="column in columns" :key="column.key" class="px-4 py-3">-->
<!--            <div v-if="column.key === 'id'" class="flex items-center gap-2">-->
<!--              {{ column.label }}-->
<!--              <img-->
<!--                  src="/images/sort.png"-->
<!--                  alt="Sort"-->
<!--                  class="cursor-pointer w-4 h-4 drag-handle hover:opacity-75"-->
<!--                  @click="toggleSortOrder"-->
<!--              />-->
<!--            </div>-->
<!--            <span v-else>{{ column.label }}</span>-->
<!--          </th>-->
<!--        </tr>-->
<!--        </thead>-->
<!--        <vuedraggable-->
<!--            v-model="buildings"-->
<!--            tag="tbody"-->
<!--            :item-key="'id'"-->
<!--            :handle="'.drag-handle'"-->
<!--            @end="onDragEnd"-->
<!--        >-->
<!--          <template #item="{ element }">-->
<!--            <tr class="bg-white border-b hover:bg-gray-50">-->
<!--              <td class="px-4 py-4">{{ element.id }}</td>-->
<!--              <td class="px-4 py-4" v-html="element.title"></td>-->
<!--              <td class="px-4 py-4">-->
<!--                <img-->
<!--                    v-if="element.bg_image"-->
<!--                    :src="`http://localhost:8000/storage/${element.bg_image}`"-->
<!--                    alt="Building Image"-->
<!--                    class="w-[70px] h-[70px] object-cover rounded"-->
<!--                />-->
<!--                <span v-else class="text-gray-400">No image</span>-->
<!--              </td>-->
<!--              <td class="px-4 py-4">-->
<!--                <div class="flex gap-3 items-center">-->
<!--                  <NuxtLink :to="`/buildings/${element.id}/edit`">-->
<!--                    <img src="/images/edit.svg" alt="Edit" class="cursor-pointer w-7 h-7 hover:opacity-75"/>-->
<!--                  </NuxtLink>-->
<!--                  <img-->
<!--                      src="/images/delete.svg"-->
<!--                      alt="Delete"-->
<!--                      class="cursor-pointer w-7 h-7 hover:opacity-75"-->
<!--                      @click="openDeleteModal(element)"-->
<!--                  />-->
<!--                  <NuxtLink :to="`/buildings/${element.id}/image-edit`">-->
<!--                    <img src="/images/image.png" alt="Image" class="cursor-pointer w-7 h-7 hover:opacity-75"/>-->
<!--                  </NuxtLink>-->
<!--                  <img-->
<!--                      src="/images/move.png"-->
<!--                      alt="Move"-->
<!--                      class="cursor-pointer w-7 h-7 drag-handle hover:opacity-75"-->
<!--                  >-->
<!--                </div>-->
<!--              </td>-->
<!--            </tr>-->
<!--          </template>-->
<!--        </vuedraggable>-->
<!--      </table>-->
<!--    </div>-->
<!--    <Modal-->
<!--        v-model="isModalOpen"-->
<!--        :building="selectedBuilding"-->
<!--        @confirm="deleteBuildingHandler"-->
<!--    />-->
<!--    <div class="flex justify-center gap-4 mt-6 pb-6">-->
<!--      <UPagination-->
<!--          v-model="page"-->
<!--          :page-count="totalPages"-->
<!--          :total="totalItems"-->
<!--          @update:model-value="changePage"-->
<!--      />-->
<!--    </div>-->
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

<!--const router = useRouter();-->
<!--const page = ref(1);-->
<!--const limit = ref(10);-->
<!--const totalItems = ref(0);-->
<!--const totalPages = ref(1);-->
<!--const buildings = ref([]);-->
<!--const sortBy = ref(null);-->
<!--const isModalOpen = ref(false);-->
<!--const selectedBuilding = ref(null);-->
<!--const sortOrder = ref('asc');-->
<!--const columns = [-->
<!--  {key: 'id', label: 'ID', sortable: true },-->
<!--  {key: 'title', label: 'Title'},-->
<!--  {key: 'bg_image', label: 'BG Image'},-->
<!--  {key: 'actions', label: 'Actions'},-->
<!--];-->

<!--const toggleSortOrder = () => {-->
<!--  sortOrder.value = sortOrder.value === 'asc' ? 'id' : 'asc';-->
<!--  getBuildings();-->
<!--};-->

<!--const getBuildings = async () => {-->
<!--  try {-->
<!--    const params = {page: page.value, limit: limit.value, order: sortOrder.value};-->
<!--    if (sortBy.value === 'id') {-->
<!--      params.order = 'id';-->
<!--      params.direction = sortOrder.value;-->
<!--    }-->
<!--    const response = await $fetch("/api/buildings", {params});-->
<!--    buildings.value = response.data || [];-->
<!--    totalItems.value = response.total;-->
<!--    limit.value = response.per_page || limit.value;-->
<!--    totalPages.value = response.per_page-->
<!--  } catch (err) {-->
<!--    console.error("Error loading buildings:", err);-->
<!--  }-->
<!--};-->

<!--const onDragEnd = async (event) => {-->
<!--  try {-->
<!--    const {oldIndex, newIndex} = event;-->
<!--    if (oldIndex === newIndex) return;-->
<!--    let url = '';-->
<!--    if (newIndex > oldIndex) {-->
<!--      url = `/api/buildings/${buildings.value[newIndex].id}/moveAfter/${buildings.value[newIndex - 1].id}`;-->
<!--    } else {-->
<!--      url = `/api/buildings/${buildings.value[newIndex].id}/moveBefore/${buildings.value[newIndex + 1].id}`;-->
<!--    }-->
<!--    const response = await useFetch(url, {-->
<!--      method: 'PUT',-->
<!--      headers: {Accept: "application/json"},-->
<!--    });-->
<!--    if (response.error) {-->
<!--      console.error('Error moving building:', response.error);-->
<!--    } else {-->
<!--      await getBuildings();-->
<!--    }-->
<!--  } catch (err) {-->
<!--    console.error('Unexpected error:', err);-->
<!--  }-->
<!--};-->

<!--const changePage = async (newPage) => {-->
<!--  page.value = newPage;-->
<!--  await getBuildings();-->
<!--};-->

<!--const logout = () => {-->
<!--  const authToken = useCookie('auth_token');-->
<!--  authToken.value = null;-->
<!--  router.push('/login');-->
<!--};-->

<!--const openDeleteModal = (building) => {-->
<!--  selectedBuilding.value = building;-->
<!--  isModalOpen.value = true;-->
<!--};-->

<!--const deleteBuildingHandler = async () => {-->
<!--  if (!selectedBuilding.value) return;-->
<!--  try {-->
<!--    const { error } = await useFetch(`/api/buildings/${selectedBuilding.value.id}`, {-->
<!--      method: 'DELETE',-->
<!--      credentials: 'include',-->
<!--    });-->
<!--    if (error.value) {-->
<!--      throw error.value;-->
<!--    }-->
<!--    buildings.value = buildings.value.filter(-->
<!--        (building) => building.id !== selectedBuilding.value.id-->
<!--    );-->
<!--    totalItems.value -= 1;-->
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
    <div class="flex justify-between items-center mb-6">
      <nuxt-link :to="'/create'">
        <button
            class="bg-blue-500 p-3 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-sm"
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
    <div class="relative overflow-x-auto shadow-md rounded-lg">
      <table class="w-full text-sm text-left text-gray-500">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th v-for="column in columns" :key="column.key" class="px-4 py-3">
            <div v-if="column.key === 'id'" class="flex items-center gap-2">
              {{ column.label }}
              <img
                  src="/images/sort.png"
                  alt="Sort"
                  class="cursor-pointer w-4 h-4 drag-handle hover:opacity-75"
                  @click="toggleSortOrder"
              />
            </div>
            <span v-else>{{ column.label }}</span>
          </th>
        </tr>
        </thead>
        <vuedraggable
            v-model="buildings"
            tag="tbody"
            :item-key="'id'"
            :handle="'.drag-handle'"
            @end="onDragEnd"
        >
          <template #item="{ element }">
            <tr class="bg-white border-b hover:bg-gray-50">
              <td class="px-4 py-4">{{ element.id }}</td>
              <td class="px-4 py-4" v-html="element.title"></td>
              <td class="px-4 py-4">
                <img
                    v-if="element.bg_image"
                    :src="`http://localhost:8000/storage/${element.bg_image}`"
                    alt="Building Image"
                    class="w-[70px] h-[70px] object-cover rounded"
                />
                <span v-else class="text-gray-400">No image</span>
              </td>
              <td class="px-4 py-4">
                <div class="flex gap-3 items-center">
                  <NuxtLink :to="`/buildings/${element.id}/edit`">
                    <img src="/images/edit.svg" alt="Edit" class="cursor-pointer w-7 h-7 hover:opacity-75"/>
                  </NuxtLink>
                  <img
                      src="/images/delete.svg"
                      alt="Delete"
                      class="cursor-pointer w-7 h-7 hover:opacity-75"
                      @click="openDeleteModal(element)"
                  />
                  <NuxtLink :to="`/buildings/${element.id}/image-edit`">
                    <img src="/images/image.png" alt="Image" class="cursor-pointer w-7 h-7 hover:opacity-75"/>
                  </NuxtLink>
                  <img
                      src="/images/move.png"
                      alt="Move"
                      class="cursor-pointer w-7 h-7 drag-handle hover:opacity-75"
                  >
                </div>
              </td>
            </tr>
          </template>
        </vuedraggable>
      </table>
    </div>
    <Modal
        v-model="isModalOpen"
        :building="selectedBuilding"
        @confirm="deleteBuildingHandler"
    />
    <div class="flex justify-center gap-4 mt-6 pb-6">
      <UPagination
          v-model="page"
          :page-count="totalPages"
          :total="totalItems"
          @update:model-value="changePage"
      />
    </div>
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

const router = useRouter();
const page = ref(1);
const limit = ref(10);
const totalItems = ref(0);
const totalPages = ref(1);
const buildings = ref([]);
const sortBy = ref(null);
const isModalOpen = ref(false);
const selectedBuilding = ref(null);
const sortOrder = ref('asc');
const columns = [
  {key: 'id', label: 'ID', sortable: true },
  {key: 'title', label: 'Title'},
  {key: 'bg_image', label: 'BG Image'},
  {key: 'actions', label: 'Actions'},
];

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'id' : 'asc';
  getBuildings();
};

const getBuildings = async () => {
  try {
    const params = {page: page.value, limit: limit.value, order: sortOrder.value};
    if (sortBy.value === 'id') {
      params.order = 'id';
      params.direction = sortOrder.value;
    }
    const response = await $fetch("/api/buildings", {params});
    buildings.value = response.data || [];
    totalItems.value = response.total;
    limit.value = response.per_page || limit.value;
    totalPages.value = response.per_page
  } catch (err) {
    console.error("Error loading buildings:", err);
  }
};

const onDragEnd = async (event) => {
  try {
    const {oldIndex, newIndex} = event;
    if (oldIndex === newIndex) return;
    let url = '';
    if (newIndex > oldIndex) {
      url = `/api/buildings/${buildings.value[newIndex].id}/moveAfter/${buildings.value[newIndex - 1].id}`;
    } else {
      url = `/api/buildings/${buildings.value[newIndex].id}/moveBefore/${buildings.value[newIndex + 1].id}`;
    }
    const response = await useFetch(url, {
      method: 'PUT',
      headers: {Accept: "application/json"},
    });
    if (response.error) {
      console.error('Error moving building:', response.error);
    } else {
      await getBuildings();
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
};

const changePage = async (newPage) => {
  page.value = newPage;
  await getBuildings();
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
    const { error } = await useFetch(`/api/buildings/${selectedBuilding.value.id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (error.value) {
      throw error.value;
    }
    buildings.value = buildings.value.filter(
        (building) => building.id !== selectedBuilding.value.id
    );
    totalItems.value -= 1;
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