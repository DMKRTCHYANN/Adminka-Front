<template>
  <div class="flex">
    <div class="w-full bg-white rounded-lg max-w-[1500px] shadow-lg">
      <div class="bg-gray-500 rounded-t-lg">
        <h1 class="text-xl text-white p-4">Edit Building</h1>
      </div>
      <div class="p-4">
        <!-- Title -->
        <div class="mb-4">
          <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
            Title <span>*</span>
          </label>
          <client-only>
            <input
                id="title"
                v-model="building.title"
                class="bg-white text-black w-full p-2 border"
            />
          </client-only>
        </div>
        <div class="mb-4">
          <label for="short_description" class="block text-sm font-medium text-gray-700 mb-2">
            Short Description <span>*</span>
          </label>
          <client-only>
            <input
                id="short_description"
                v-model="building.short_description"
                class="bg-white text-black w-full p-2 border border-gray-300"
            />
          </client-only>
        </div>
        <div class="mb-4">
          <label for="long_description" class="block text-sm font-medium text-gray-700 mb-2">
            Long Description <span>*</span>
          </label>
          <client-only>
            <rich-editor
                contentType="html"
                v-model:content="building.long_description"
                :options="editorOptions"
                class="text-black"
            />
          </client-only>
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
            <cropper
                v-if="imagePreview"
                ref="cropperRef"
                :src="imagePreview"
                class="w-full h-64"
                :stencil-props="{aspectRatio: 16 / 9}"
                :transformations.sync="cropperTransformations"
            />
            <img
                v-else-if="building.bg_image"
                :src="`http://localhost:8000/storage/${building.bg_image}`"
                alt="Stored Image"
                class="max-h-40 object-contain mt-4"
            />
          </div>
          <p class="text-black p-[10px]">Use only JPEG, PNG, JPG, GIF</p>
        </div>
        <div class="mb-6">
          <LocationSelector
              v-if="markerPosition"
              :api-key="$config.public.googleMapsApiKey"
              v-model="markerPosition"
              style="height: 500px; width: 100%;"
          />
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
import {ref, watch, onMounted, nextTick} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useFetch} from "#app";
import LocationSelector from "~/compoments/LocationSelector.vue";
import {Cropper} from "vue-advanced-cropper";

definePageMeta({
  layout: "navbar",
});

const route = useRoute();
const router = useRouter();
const selectedFiles = ref(null);
const imagePreview = ref(null);
const cropperTransformations = ref({});
const markerPosition = ref(null);
const cropperRef = ref(null);
const building = ref({
  title: "",
  short_description: "",
  long_description: "",
  bg_image: "",
  location: {coordinates: []},
});
const editorOptions = ref({
  theme: "snow",
  modules: {
    toolbar: [
      ["bold", "italic", "underline"],
      [{list: "ordered"}, {list: "bullet"}],
      [{size: ["small", false, "large", "huge"]}],
      [{color: ["#000000", "#FF0000", "#00FF00", "#0000FF"]}],
    ],
  },
});

watch(
    markerPosition,
    (newPosition) => {
      building.value.location.coordinates = [newPosition.lat, newPosition.lng];
    },
    {deep: true}
);

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    imagePreview.value = URL.createObjectURL(file);
    selectedFiles.value = file;
  }
};

const getBuilding = async () => {
  const {data, error} = await useFetch(`/api/buildings/${route.params.id}`);
  if (data.value) {
    building.value = data.value;
    if (building.value.location?.coordinates?.length === 2) {
      markerPosition.value = {
        lat: building.value.location.coordinates[1],
        lng: building.value.location.coordinates[0],
      };
    } else {
      markerPosition.value = {lat: 40.198425, lng: 44.479263};
    }
  }
  if (error.value) {
    console.error("Error fetching building:", error.value);
    router.push({name: "NotFound"});
  }
};

const updateBuilding = async () => {
  try {
    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("title", building.value.title);
    formData.append("short_description", building.value.short_description);
    formData.append("long_description", building.value.long_description);
    formData.append("latitude", markerPosition.value.lat);
    formData.append("longitude", markerPosition.value.lng);
    if (cropperRef.value && cropperTransformations.value) {
      const canvas = cropperRef.value.getResult()?.canvas;
      if (canvas) {
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg"));
        if (blob) {
          const croppedFile = new File([blob], "cropped_image.jpg", {type: blob.type});
          formData.append("bg_image", croppedFile);
        }
      }
    } else if (selectedFiles.value) {
      formData.append("bg_image", selectedFiles.value);
    }
    const {data, error} = await useFetch(`/api/buildings/${route.params.id}`, {
      method: "POST",
      body: formData,
    });
    if (error.value) throw new Error(error.value.message);
    router.push("/");
  } catch (error) {
    console.error("Error updating building:", error.message);
    alert("Failed to update building.");
  } finally {
    if (imagePreview.value) URL.revokeObjectURL(imagePreview.value);
  }
};

onMounted(async () => {
  await nextTick();
  await getBuilding();
});
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Comic+Neue&display=swap");
@import "https://cdn.quilljs.com/1.3.7/quill.snow.css";
</style>

