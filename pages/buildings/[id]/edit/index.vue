<template>
  <div class="flex">
    <div class="w-full bg-white rounded-lg max-w-[1500px] shadow-lg">
      <div class="bg-gray-500 rounded-t-lg">
        <h1 class="text-xl text-white p-4">Edit Building</h1>
      </div>
      <div class="p-4">
        <div class="mb-4">
          <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
            Title <span>*</span>
          </label>
          <client-only>
            <input
                contentType="html"
                v-model="building.title"
                class="bg-white text-black w-full p-2 border border-gray-300"
            />
          </client-only>
        </div>
        <div class="mb-4">
          <label for="short_description" class="block text-sm font-medium text-gray-700 mb-2">
            Short Description <span>*</span>
          </label>
          <client-only>
            <input
                contentType="html"
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
              class="relative border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer">
            <input id="file" type="file" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer"
                   @change="handleFileChange"/>
            <div v-if="!imagePreview && !building.bg_image" class="text-gray-500 text-sm text-center">
              Drag and drop an image or click to select
            </div>
            <cropper
                v-if="imagePreview"
                ref="cropperRef"
                :src="imagePreview"
                class="w-full h-64"
            />
            <img v-if="building.bg_image && !imagePreview"
                 :src="`http://localhost:8000/storage/${building.bg_image}`" alt="Image Preview"
                 class="max-h-40 object-contain mt-4"/>
          </div>
          <p class="text-black p-[10px]">Use only JPEG, PNG, JPG, GIF</p>
        </div>
        <div class="flex justify-center gap-4">
          <button @click="router.push('/')"
                  class="bg-gray-500 p-3 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 shadow-sm">
            Cancel
          </button>
          <button @click="updateBuilding"
                  class="bg-blue-500 p-3 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-sm">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref, nextTick} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useFetch} from "#app";
import {Cropper} from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

definePageMeta({
  layout: "navbar",
});

const route = useRoute();
const router = useRouter();
const selectedFiles = ref(null);
const imagePreview = ref(null);
const cropperRef = ref(null);
const building = ref({
  title: "",
  short_description: "",
  long_description: "",
  bg_image: "",
});

const editorOptions = ref({
  theme: "snow",
  modules: {
    toolbar: [
      ["bold", "italic", "underline"],
      [{list: "ordered"}, {list: "bullet"}, {list: "check"}],
      [{size: ["small", false, "large", "huge"]}],
      [
        {
          color: [
            "#000000", "#FF0000", "#00FF00", "#0000FF", "#8A2BE2", "#A52A2A", "#5F9EA0",
            "#FFD700", "#FF6347", "#00FFFF", "#FF1493", "#D2691E", "#228B22", "#FF4500",
            "#2E8B57", "#8B0000", "#808000", "#BC8F8F", "#3CB371", "#B22222", "#A9A9A9",
            "#F08080", "#C71585", "#D3D3D3", "#00FA9A", "#1E90FF", "#C0C0C0", "#FA8072",
            "#aa8453"
          ],
        },
      ],
    ],
  },
  formats: ["bold", "italic", "underline", "size", "color", "list"],
});

const stripHtmlTags = (html) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.innerText || div.textContent || "";
};

const getBuilding = async () => {
  const {data, error} = await useFetch(`/api/buildings/${route.params.id}`);
  if (data.value) {
    building.value = {
      ...data.value,
      title: stripHtmlTags(data.value.title),
      short_description: stripHtmlTags(data.value.short_description),
    };
  }
  if (error.value) {
    console.error("Error fetching building:", error.value);
    showError({statusCode: 404, message: "Building not found"});
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
    if (cropperRef.value) {
      const canvas = cropperRef.value.getResult()?.canvas;
      if (canvas) {
        const blob = await new Promise((resolve) =>
            canvas.toBlob(resolve, "image/jpeg")
        );
        if (blob) {
          const file = new File([blob], "cropped_image.jpg", {type: blob.type});
          formData.append("bg_image", file);
        }
      }
    } else if (selectedFiles.value?.[0]) {
      formData.append("bg_image", selectedFiles.value[0]);
    }
    const {data, error} = await useFetch(`/api/buildings/${route.params.id}`, {
      method: "POST",
      body: formData,
    });
    if (error.value) {
      throw new Error(error.value.message || "Error updating building");
    }
    await router.push("/");
  } catch (error) {
    console.error("Update error:", error.message);
    alert("Failed to update building. Please check the console for details.");
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

<style>
@import url("https://fonts.googleapis.com/css2?family=Comic+Neue&display=swap");
@import "https://cdn.quilljs.com/1.3.7/quill.snow.css";
</style>
