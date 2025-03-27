<template>
  <div class="flex">
    <div class="w-full bg-white rounded-lg max-w-[1500px] shadow-lg">
      <div class="bg-gray-500 rounded-t-lg">
        <h1 class="text-xl text-white p-4">Edit Building</h1>
      </div>
      <div v-if="loading" class="text-center p-[10px] text-gray-500">Loading...</div>
      <div class="p-4" v-if="!loading">
        <div class="grid grid-cols-5">
          <div v-for="(image, index) in buildingImages" :key="index" class="relative group">
            <div class="relative">
              <img
                  :src="`http://localhost:8000${image.url}`"
                  alt="Existing Image"
                  class="max-h-40 object-contain m-[10px] border-2 border-gray-500 transition-opacity duration-300 group-hover:opacity-50"
              />
              <img
                  src="/images/delete.svg"
                  alt="Delete Image"
                  class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 cursor-pointer"
                  @click="deleteImage(image.id)"
              />
            </div>
          </div>
        </div>
        <label for="files" class="block text-sm font-medium text-gray-700 mb-2">Upload Images</label>
        <div class="mb-4">
          <div
              class="relative border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer"
          >
            <input
                type="file"
                accept="image/*"
                multiple
                class="absolute inset-0 opacity-0 cursor-pointer"
                @change="handleFileChange"
            />
            <div v-if="!images.length" class="text-gray-500 text-sm text-center">
              Drag and drop images or click to select
            </div>
            <div v-else class="grid grid-cols-5 gap-4 mt-4 w-full">
              <div
                  v-for="(img, index) in images"
                  :key="index"
                  class="relative group"
              >
                <img
                    :src="img.preview"
                    alt="Image Preview"
                    class="max-h-40 object-contain transition-opacity duration-300 group-hover:opacity-60"
                />
                <img
                    src="/images/delete.svg"
                    alt="Delete Image"
                    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-110 cursor-pointer"
                    @click="removeImage(index)"
                />
              </div>
            </div>
          </div>
          <p class="text-black p-[10px]">Use only JPEG, PNG, JPG, GIF</p>
          <div class="flex justify-center gap-4">
            <button
                @click="cancelUpdate"
                class="bg-gray-500 p-3 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 shadow-sm"
            >
              Cancel
            </button>
            <button
                v-if="images.length"
                @click="updateBuildingImages"
                class="bg-blue-500 p-3 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-sm"
            >
              Update Images
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {nextTick, onMounted, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';

definePageMeta({
  layout: 'navbar',
});

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const images = ref([]);
const building = ref({});
const buildingImages = ref([]);

const cancelUpdate = () => {
  router.push('/');
};

const getBuilding = async () => {
  try {
    const {data: buildingData, error: buildingError} = await useFetch(`/api/buildings/${route.params.id}`);
    const {data: imageData, error: imageError} = await useFetch(`/api/buildings/${route.params.id}/images`);
    if (buildingError.value || imageError.value) {
      console.error('Error loading data:', buildingError.value || imageError.value);
      return;
    }
    building.value = buildingData.value?.data || {};
    buildingImages.value = imageData.value?.images || [];
    loading.value = false;
  } catch (err) {
    console.error('Unexpected error:', err);
    loading.value = false;
  }
};

const deleteImage = async (index) => {
  try {
    const { data, error } = await useFetch(`/api/images/${index}`, {
      method: 'DELETE',
    });
    if (error.value) {
      console.error('Error deleting image:', error.value);
      return;
    }
    buildingImages.value = buildingImages.value.filter(image => image.id !== index);
  } catch (err) {
    console.error('Unexpected error deleting image:', err);
  }
};



const handleFileChange = (event) => {
  const selectedFiles = Array.from(event.target.files);
  selectedFiles.forEach((file) => {
    images.value.push({
      preview: URL.createObjectURL(file),
      file,
    });
  });
};

const removeImage = (index) => {
  images.value.splice(index, 1);
};

const updateBuildingImages = async () => {
  const formData = new FormData();
  images.value.forEach(({file}) => {
    formData.append('images[]', file);
  });
  formData.append('building_id', route.params.id);
  try {
    await useFetch(`/api/images/${route.params.id}`, {
      method: 'POST',
      body: formData,
    });
    await router.push('/');
  } catch (err) {
    console.error('Error updating images:', err);
  }
};

onMounted(async () => {
  await nextTick();
  await getBuilding();
});
</script>
