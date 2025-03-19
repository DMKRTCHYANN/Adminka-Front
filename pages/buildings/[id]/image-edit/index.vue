<template>
  <div class="flex">
    <div class="w-full bg-white rounded-lg max-w-[1500px] shadow-lg">
      <div class="bg-gray-500 rounded-t-lg">
        <h1 class="text-xl text-white p-4">Edit Building</h1>
      </div>
      <div v-if="loading" class="text-center text-gray-500">Loading...</div>
      <div class="p-4" v-if="!loading">
        <label for="file" class="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
        <div class="mb-4">
          <div
              class="relative border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer"
          >
            <input
                type="file"
                accept="image/*"
                class="absolute inset-0 opacity-0 cursor-pointer"
                @change="handleFileChange"
            />
            <div v-if="!image.preview && !image.image" class="text-gray-500 text-sm text-center">
              Drag and drop an image or click to select
            </div>
            <img
                v-if="image.preview || image.image"
                :src="image.preview || `http://localhost:8000/storage/${image.image}`"
                alt="Image Preview"
                class="max-h-40 object-contain mt-4"
            />
          </div>
          <p class="text-black p-[10px]">Use only JPEG, PNG, JPG, GIF</p>
        </div>
        <div class="flex justify-center gap-4">
          <button
              @click="cancelUpdate"
              class="bg-gray-500 p-3 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 shadow-sm"
          >
            Cancel
          </button>
          <button
              v-if="hasImageToUpdate"
              @click="updateBuildingImages"
              class="bg-blue-500 p-3 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-sm"
          >
            Update Images
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, nextTick} from 'vue';
import {useRouter, useRoute} from 'vue-router';

definePageMeta({
  layout: 'navbar',
});

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const image = ref({
  preview: null,
  image: null
});
const building = ref({
  image: [],
});

const hasImageToUpdate = computed(() => {
  return image.value.preview || image.value.image;
});

const getBuilding = async () => {
  try {
    const {data, error} = await useFetch(`/api/buildings/${route.params.id}`);
    if (error.value) {
      console.error('Error loading Building:', error.value);
      return;
    }
    building.value = data.value.data;
    if (building.value.images && building.value.images.length > 0) {
      image.value.image = building.value.images[0];
    }
    loading.value = false;
  } catch (err) {
    console.error('Unexpected error:', err);
    loading.value = false;
  }
};

const handleFileChange = (event) => {
  const selectedFiles = event.target.files;
  if (selectedFiles && selectedFiles[0]) {
    const file = selectedFiles[0];
    image.value.preview = URL.createObjectURL(file);
    image.value.image = file;
  }
};

const updateBuildingImages = async () => {
  const formData = new FormData();
  if (image.value.image) {
    formData.append('image', image.value.image);
    formData.append('building_id', route.params.id);
  }
  try {
    const response = await $fetch(`/api/images/${route.params.id}`, {
      method: 'POST',
      body: formData,
      headers: {Accept: 'application/json'},
    });
    if (response.error) {
      console.error('Error updating images:', response.error);
    } else {
      console.log('Images updated successfully');
      await router.push('/');
    }
  } catch (err) {
    console.error('Error during image update:', err);
  }
};


const cancelUpdate = () => {
  router.push('/');
};

onMounted(async () => {
  await nextTick();
  await getBuilding();
});
</script>

