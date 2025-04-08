<template>
  <div class="flex justify-center">
    <div class="w-full bg-white rounded-lg max-w-[1500px] shadow-lg">
      <div class="bg-gray-500 rounded-t-lg">
        <h1 class="text-xl text-white p-4">Create Building</h1>
      </div>
      <div v-if="loading" class="text-center p-[10px] text-gray-500">Loading...</div>
      <div v-else class="p-4">
        <div class="mb-4">
          <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
            Title <span>*</span>
          </label>
          <input
              v-model="building.title"
              class="bg-white text-black w-full p-2 border border-gray-300"
          />
          <p v-if="errors.title" class="text-red-600 mt-1">{{ errors.title[0] }}</p>
        </div>
        <div class="mb-4">
          <label for="short_description" class="block text-sm font-medium text-gray-700 mb-2">
            Short Description <span>*</span>
          </label>
          <input
              v-model="building.short_description"
              class="bg-white text-black w-full p-2 border border-gray-300"
          />
          <p v-if="errors.short_description" class="text-red-600 mt-1">{{ errors.short_description[0] }}</p>
        </div>
        <div class="mb-4">
          <label for="long_description" class="block text-sm font-medium text-gray-700 mb-2">
            Long Description <span>*</span>
          </label>
          <rich-editor
              contentType="html"
              v-model:content="building.long_description"
              :options="editorOptions"
              class="text-black"
          />
          <p v-if="errors.long_description" class="text-red-600 mt-1">{{ errors.long_description[0] }}</p>
        </div>
        <div class="mb-6">
          <label for="file" class="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
          <div
              class="relative border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer"
          >
            <input
                type="file"
                accept="image/*"
                @change="handleFileChange"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div v-if="!imagePreview && !building.bg_image" class="text-gray-500 text-sm text-center">
              Drag and drop an image or click to select
            </div>
            <cropper
                v-if="imagePreview"
                ref="cropperRef"
                :src="imagePreview"
                class="w-full h-64"
            />
            <img
                v-if="building.bg_image && !imagePreview"
                :src="`http://localhost:8000/storage/${building.bg_image}`"
                alt="Image Preview"
                class="max-h-40 object-contain mt-4"
            />
          </div>
          <p class="text-black p-[10px]">Use only JPEG, PNG, JPG, GIF</p>
          <p v-if="errors.bg_image" class="text-red-600 mt-1">{{ errors.bg_image[0] }}</p>
        </div>
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Select Building Location
          </label>
          <GoogleMaps
              v-model="building.location"
              :api-key="$config.public.googleMapsApiKey"
              :options="mapOptions"
              style="height: 500px; width: 100%;"
          >
            <Marker
                :options="{ position: markerPosition, draggable: true }"
                @dragend="updateMarkerPosition"
            />
          </GoogleMaps>
        </div>
        <div class="flex justify-center gap-4 mb-[40px]">
          <button
              @click="router.push('/')"
              class="bg-gray-500 p-3 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 shadow-sm"
          >
            Cancel
          </button>
          <button
              @click="createBuilding"
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useFetch } from '#app';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import GoogleMaps from "~/compoments/GoogleMaps.vue";

const router = useRouter();
const errors = ref({});
const loading = ref(false);
const imagePreview = ref(null);
const cropperRef = ref(null);
const building = ref({
  title: '',
  short_description: '',
  long_description: '',
  bg_image: '',
  location: null,
});

definePageMeta({
  layout: 'navbar'
})

const markerPosition = ref({ lat: 40.73061, lng: -73.935242 });
const mapOptions = {
  center: markerPosition.value,
  zoom: 12,
};

const updateMarkerPosition = (event) => {
  markerPosition.value = {
    lat: event.latLng.lat(),
    lng: event.latLng.lng(),
  };
};

const createBuilding = async () => {
  try {
    loading.value = true;
    errors.value = {};
    if (cropperRef.value && imagePreview.value) {
      const canvas = cropperRef.value.getResult()?.canvas;
      if (canvas) {
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg'));
        if (blob) {
          const file = new File([blob], 'cropped_image.jpg', { type: blob.type });
          building.value.bg_image = file;
        }
      }
    }
    const locationData = {
      type: "Point",
      coordinates: [
        markerPosition.value.lng,
        markerPosition.value.lat
      ]
    };
    building.value.location = JSON.stringify(locationData);

    const formData = new FormData();
    formData.append('title', building.value.title);
    formData.append('short_description', building.value.short_description);
    formData.append('long_description', building.value.long_description);
    formData.append('location', building.value.location);
    if (building.value.bg_image) {
      formData.append('bg_image', building.value.bg_image);
    }
    const {data, error} = await useFetch('/api/buildings/', {
      method: 'POST',
      body: formData,
      headers: {Accept: 'application/json'},
    });
    if (error && error.value) {
      errors.value = error.value.data?.errors || {general: 'An unknown error occurred'};
      return;
    }
    if (data.value) {
      await router.push('/');
    }
  } catch (err) {
    console.error('Error creating building:', err);
    errors.value.general = 'There was an error sending your request.';
  } finally {
    loading.value = false;
  }
};
</script>
