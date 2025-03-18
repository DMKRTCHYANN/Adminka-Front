<template>
  <div class="flex">
    <div class="w-full bg-white rounded-lg max-w-[1500px] shadow-lg">
      <div class="bg-gray-500 rounded-t-lg">
        <h1 class="text-xl text-white p-4">Edit Building</h1>
      </div>
      <div v-if="loading" class="text-center text-gray-500">Loading...</div>
      <div v-else class="p-4">
        <div class="mb-4">
          <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
            Title <span>*</span>
          </label>
          <input
              type="text"
              v-model="building.title"
              class="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-black bg-white"
              placeholder="Enter Title"
          />
        </div>
        <div class="mb-4">
          <label for="short_description" class="block text-sm font-medium text-gray-700 mb-2">
            Short Description <span>*</span>
          </label>
          <input
              type="text"
              v-model="building.short_description"
              class="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-black bg-white"
              placeholder="Enter Short Description"
          />
        </div>
        <div class="mb-4">
          <label for="long_description" class="block text-sm font-medium text-gray-700 mb-2">
            Long Description <span>*</span>
          </label>
          <textarea
              v-model="building.long_description"
              class="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-black bg-white"
              rows="4"
              placeholder="Enter Long Description"
          ></textarea>
        </div>
        <div class="mb-6">
          <label for="file" class="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
          <div
              class="relative border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer"
          >
            <input
                id="file"
                type="file"
                accept="image/*"
                class="absolute inset-0 opacity-0 cursor-pointer"
                @change="handleFileChange"
            />
            <div v-if="!imagePreview && !building.bg_image" class="text-gray-500 text-sm text-center">
              Drag and drop an image or click to select
            </div>
            <img
                v-if="imagePreview || building.bg_image"
                :src="imagePreview || `http://localhost:8000/storage/${building.bg_image}`"
                alt="Image Preview"
                class="max-h-40 object-contain mt-4"
            />
          </div>
          <p
              class="text-black p-[10px]"
          >jpeg,png,jpg,gif</p>
        </div>
        <div class="flex justify-center gap-4">
          <button
              @click="router.push('/')"
              class="bg-gray-500 p-3 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 shadow-sm"
          >
            Cancel
          </button>
          <button
              @click="updateBuilding"
              class="bg-blue-500 p-3 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-sm"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref, nextTick } from "vue";

definePageMeta({
  layout: 'navbar',
});

const route = useRoute();
const router = useRouter();
const selectedFiles = ref(null);
const imagePreview = ref(null);
const loading = ref(true);
const building = ref({
  title: '',
  short_description: '',
  long_description: '',
  bg_image: '',
});

const getBuilding = async () => {
  const { data, error } = await useFetch(`/api/buildings/${route.params.id}`);
  if (data.value) {
    building.value = { ...data.value };
    loading.value = false;
  }
  if (error.value) {
    console.error('Error fetching building:', error.value);
    showError({ statusCode: 404, message: 'Building not found' });
  }
};

const handleFileChange = (event) => {
  selectedFiles.value = event.target.files;
  if (selectedFiles.value && selectedFiles.value[0]) {
    imagePreview.value = URL.createObjectURL(selectedFiles.value[0]);
  }
};

const updateBuilding = async () => {
  try {
    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("title", building.value.title);
    formData.append("short_description", building.value.short_description);
    formData.append("long_description", building.value.long_description);
    if (selectedFiles.value?.[0]) {
      formData.append("bg_image", selectedFiles.value[0]);
    }
    const { data, error } = await useFetch(`/api/buildings/${route.params.id}`, {
      method: 'POST',
      body: formData,
    });
    if (error.value) {
      throw new Error(error.value.message || 'Error updating building');
    }
    await router.push('/');
  } catch (error) {
    console.error('Update error:', error.message);
    alert('Failed to update building. Please check the console for details.');
  } finally {
    if (imagePreview.value) {
      URL.revokeObjectURL(imagePreview.value);
    }
  }
};

onMounted(async () => {
  await nextTick();
  await getBuilding();
});
</script>