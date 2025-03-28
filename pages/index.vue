<!--<template>-->
<!--  <div class="min-h-screen">-->
<!--    <div>-->
<!--      <nuxt-link :to="'/create'">-->
<!--        <button-->
<!--            class="bg-blue-500 p-3 text-white rounded-lg mb-[20px] hover:bg-blue-600 transition-all duration-300 shadow-sm"-->
<!--        >-->
<!--          Create new Building-->
<!--        </button>-->
<!--      </nuxt-link>-->
<!--    </div>-->
<!--    <div>-->
<!--      <img-->
<!--          @click="logout"-->
<!--          src="/images/logout.png"-->
<!--          alt="Logout"-->
<!--          class="cursor-pointer w-10 h-10 dark:invert"-->
<!--      />-->
<!--    </div>-->
<!--    <UTable-->
<!--        :rows="buildings"-->
<!--        :columns="columns"-->
<!--        :ui="{-->
<!--        td: {-->
<!--          base: 'whitespace-nowrap',-->
<!--          padding: 'px-4 py-4',-->
<!--          color: 'text-black',-->
<!--          font: '',-->
<!--          size: 'text-sm'-->
<!--        },-->
<!--        th: {-->
<!--          base: 'text-left rtl:text-right',-->
<!--          padding: 'px-4 py-3.5',-->
<!--          color: 'text-black',-->
<!--          font: 'font-semibold',-->
<!--          size: 'text-sm'-->
<!--        },-->
<!--      }"-->
<!--    >-->
<!--      <template #actions-data="{ row }">-->
<!--        <div class="flex gap-1">-->
<!--          <NuxtLink :to="`/buildings/${row.id}/edit`">-->
<!--            <img src="/images/edit.svg" alt="Edit" class="cursor-pointer w-7 h-7"/>-->
<!--          </NuxtLink>-->
<!--          <img-->
<!--              src="/images/delete.svg"-->
<!--              alt="Delete"-->
<!--              class="cursor-pointer w-7 h-7"-->
<!--              @click="openDeleteModal(row)"-->
<!--          />-->
<!--          <NuxtLink :to="`/buildings/${row.id}/image-edit`">-->
<!--            <img src="/images/image.png" alt="Image" class="cursor-pointer w-7 h-7"/>-->
<!--          </NuxtLink>-->
<!--        </div>-->
<!--      </template>-->
<!--      <template #bg_image-data="{ row }">-->
<!--        <img-->
<!--            v-if="row.bg_image"-->
<!--            :src="`http://localhost:8000/storage/${row.bg_image}`"-->
<!--            alt="User Image"-->
<!--            class="w-12 h-12 object-cover"-->
<!--        />-->
<!--        <span v-else>No image</span>-->
<!--      </template>-->
<!--      <template #title-data="{ row }">-->
<!--        <div v-html="row .title"></div>-->
<!--      </template>-->
<!--      <template #short_description-data="{ row }">-->
<!--        <div v-html="truncate(row.short_description, 15)"></div>-->
<!--      </template>-->
<!--    </UTable>-->
<!--    <Modal-->
<!--        v-model="isModalOpen"-->
<!--        :building="selectedBuilding"-->
<!--        @confirm="deleteBuildingHandler"-->
<!--    />-->
<!--  </div>-->
<!--</template>-->
<!--<script setup>-->
<!--import {ref, onMounted, nextTick} from 'vue';-->
<!--import Modal from "~/compoments/Modal.vue";-->

<!--definePageMeta({-->
<!--  layout: 'navbar',-->
<!--});-->

<!--const router = useRouter();-->
<!--const isModalOpen = ref(false);-->
<!--const selectedBuilding = ref(null);-->
<!--const buildings = ref([]);-->
<!--const columns = ref([-->
<!--  {key: 'id', label: 'ID'},-->
<!--  {key: 'title', label: 'Title'},-->
<!--  {key: 'short_description', label: 'Short Description'},-->
<!--  {key: 'bg_image', label: 'BG Image'},-->
<!--  {key: 'actions', label: 'Actions'},-->
<!--]);-->

<!--const getBuildings = async () => {-->
<!--  try {-->
<!--    const {data, error} = await useFetch('/api/buildings');-->
<!--    if (error.value) {-->
<!--      console.error('Error loading Buildings:', error.value);-->
<!--      return;-->
<!--    }-->
<!--    buildings.value = data.value.data || [];-->
<!--  } catch (err) {-->
<!--    console.error('Unexpected error:', err);-->
<!--  }-->
<!--};-->

<!--const truncate = (text, length) => {-->
<!--  if (!text) return '';-->
<!--  return text.length > length ? text.slice(0, length) + '...' : text;-->
<!--};-->

<!--const logout = () => {-->
<!--  const authToken = useCookie("auth_token");-->
<!--  authToken.value = null;-->
<!--  router.push("/login");-->
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
<!--    if (error.value) throw error.value;-->
<!--    buildings.value = buildings.value.filter(b => b.id !== selectedBuilding.value.id);-->
<!--  } catch (err) {-->
<!--    console.error('Error deleting buildings:', err);-->
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
    <div>
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
            td: {
              base: 'whitespace-nowrap',
              padding: 'px-4 py-4',
              color: 'text-black',
              font: '',
              size: 'text-sm',
              width: 'max-content'
            },
            th: {
              base: 'text-left rtl:text-right',
              padding: 'px-4 py-3.5',
              color: 'text-black',
              font: 'font-semibold',
              size: 'text-sm',
              width: 'max-content'
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
        :total="buildings.total"
        @update:model-value="changePage"
    />
  </div>
</template>
<script setup>
import {ref, onMounted, nextTick} from 'vue';
import Modal from "~/compoments/Modal.vue";
import vuedraggable from 'vuedraggable';

definePageMeta({
  layout: 'navbar',
  middleware: ["auth"]
});

const page = ref(1);
const limit = ref(10);
const buildings = ref({data: [], total: 0});
const totalItems = ref(0);
const router = useRouter();
const isModalOpen = ref(false);
const selectedBuilding = ref(null);
const columns = [
  {key: "id", label: "ID", width: "50px"},
  {key: "title", label: "Title", width: "200px"},
  {key: "short_description", label: "Short Description", width: "300px"},
  {key: "bg_image", label: "BG Image", width: "100px"},
  {key: "actions", label: "Actions", width: "150px"},
];

// const getBuildings = async () => {
//   try {
//     const {data, error} = await useFetch('/api/buildings', {
//       query: {
//         page: page.value,
//         limit: limit.value
//       }
//     });
//     if (data.value) {
//       buildings.value = data.value.data.data;
//       totalItems.value = data.value.data.total;
//     }
//   } catch (err) {
//     console.error('Error:', err);
//   }
// };


const getBuildings = async () => {
  try {
    const response = await useFetch("/api/buildings", {
      params: {page: page.value, limit: limit.value},
    });
    if (response) {
     buildings.value.data = response.data || [];
     buildings.value.total = response.totalPages || 0;
      limit.value = response.per_page || 10;
      totalPages.value = response.totalPages || Math.ceil(buildings.value.total / limit.value);
    } else {
      buildings.value = {data: [], total: 0};
      totalPages.value = 1;
    }
  } catch (error) {
    console.error("Fetch Error:", error);
    buildings.value = {data: [], total: 0};
    totalPages.value = 1;
  }
};






watch([page, limit], getBuildings, {immediate: true});

const totalPages = computed(() => {
  return Math.ceil(totalItems.value / limit.value);
});

const onDragEnd = async () => {
  try {
    const order = buildings.value.map(building => building.id);
    const {error} = await useFetch('/api/buildings/reorder', {
      method: 'POST',
      body: {order},
    });
    if (error.value) {
      console.error('Error updating building order:', error.value);
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