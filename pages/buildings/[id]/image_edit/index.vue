<template>
  <div class="flex">
    <div class="w-full bg-white rounded-lg max-w-[1500px] shadow-lg">
      <div class="bg-gray-500 rounded-t-lg">
        <h1 class="text-xl text-white p-4">Edit Building</h1>
      </div>
      <div v-if="loading" class="text-center text-gray-500">Loading...</div>
      <div class="mb-6" v-if="!loading">
        <label for="file" class="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
        <div v-for="(image, index) in images" :key="index" class="mb-4">
          <div
              class="relative border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer"
          >
            <input
                type="file"
                accept="image/*"
                class="absolute inset-0 opacity-0 cursor-pointer"
                @change="handleFileChange(index, $event)"
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
          <p class="text-black p-[10px]">jpeg, png, jpg, gif</p>
        </div>
        <button
            v-if="images.length < 5"
            @click="addImageInput"
            class="text-blue-500 mt-4"
        >
          Add another image
        </button>
        <button
            v-if="hasImageToUpdate"
            @click="updateBuildingImages"
            class="text-green-500 mt-4"
        >
          Update Images
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';

definePageMeta({
  layout: 'navbar'
})

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const building = ref({
  images: '',
});


const hasImageToUpdate = computed(() => {
  return building.images.value.some(function(image) {
    return image.preview || image.image;
  });
});

const getBuilding = async () => {
  try {
    const { data, error } = await useFetch('/api/buildings');
    if (error.value) {
      console.error('Error loading Building:', error.value);
      return;
    }
    const building = data.value.data[0];
    building.images.forEach((image, index) => {
      if (images.value[index]) {
        images.value[index].image = image.image;
      }
    });
    loading.value = false;
  } catch (err) {
    console.error('Unexpected error:', err);
    loading.value = false;
  }
};

const handleFileChange = (index, event) => {
  const selectedFiles = event.target.files;
  if (selectedFiles && selectedFiles[0]) {
    images.value[index].preview = URL.createObjectURL(selectedFiles[0]);
  }
};

const addImageInput = () => {
  if (images.value.length < 5) {
    images.value.push({ preview: null, image: null });
  }
};

const updateBuildingImages = async () => {
  const formData = new FormData();

  images.value.forEach((image, index) => {
    if (image.preview) {
      formData.append(`image_${index}`, image.preview);
    }
  });
  try {
    const response =  await useFetch(`/api/buildings/${route.params.id}`, {
      method: 'PUT',
      body: formData,
      headers: {'Accept': 'application/json'}
    });
    const result = await response.json();
    if (result.error) {
      console.error('Error updating images:', result.error);
    } else {
      console.log('Images updated successfully');
      await router.push('/');
    }
  } catch (err) {
    console.error('Error during image update:', err);
  }
};

onMounted(async () => {
  await nextTick();
  await getBuilding();
});
</script>
