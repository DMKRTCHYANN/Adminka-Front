<!--<template>-->
<!--  <div class="flex justify-center">-->
<!--    <div class="w-full bg-white rounded-lg max-w-[1500px] shadow-lg">-->
<!--      <div class="bg-gray-500 rounded-t-lg">-->
<!--        <h1 class="text-xl text-white p-4">Create Building</h1>-->
<!--      </div>-->
<!--      <div v-if="loading" class="text-center p-[10px] text-gray-500">Loading...</div>-->
<!--      <div v-else class="p-4">-->
<!--        <div class="mb-4">-->
<!--          <label for="title" class="block text-sm font-medium text-gray-700 mb-2">-->
<!--            Title <span>*</span>-->
<!--          </label>-->
<!--          <client-only>-->
<!--            <input-->
<!--                v-model="building.title"-->
<!--                class="bg-white text-black w-full p-2 border border-gray-300"-->
<!--            />-->
<!--          </client-only>-->
<!--          <p v-if="errors.title" class="text-red-600 mt-1">{{ errors.title[0] }}</p>-->
<!--        </div>-->
<!--        <div class="mb-4">-->
<!--          <label for="short_description" class="block text-sm font-medium text-gray-700 mb-2">-->
<!--            Short Description <span>*</span>-->
<!--          </label>-->
<!--          <client-only>-->
<!--            <input-->
<!--                v-model="building.short_description"-->
<!--                class="bg-white text-black w-full p-2 border border-gray-300"-->
<!--            />-->
<!--          </client-only>-->
<!--          <p v-if="errors.short_description" class="text-red-600 mt-1">{{ errors.short_description[0] }}</p>-->
<!--        </div>-->
<!--        <div class="mb-4">-->
<!--          <label for="long_description" class="block text-sm font-medium text-gray-700 mb-2">-->
<!--            Long Description <span>*</span>-->
<!--          </label>-->
<!--          <client-only>-->
<!--            <rich-editor-->
<!--                contentType="html"-->
<!--                v-model:content="building.long_description"-->
<!--                :options="editorOptions"-->
<!--                class="text-black"-->
<!--            />-->
<!--          </client-only>-->
<!--          <p v-if="errors.long_description" class="text-red-600 mt-1">{{ errors.long_description[0] }}</p>-->
<!--        </div>-->
<!--        <div class="mb-6">-->
<!--          <label for="file" class="block text-sm font-medium  text-gray-700 mb-2">Upload Image</label>-->
<!--          <div-->
<!--              class="relative border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col-->
<!--              items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer"-->
<!--          >-->
<!--            <input-->
<!--                id="file"-->
<!--                type="file"-->
<!--                accept="image/*"-->
<!--                class="absolute inset-0 opacity-0 cursor-pointer"-->
<!--                @change="handleFileChange"-->
<!--            />-->
<!--            <div v-if="!imagePreview && !building.bg_image" class="text-gray-500 text-sm text-center">-->
<!--              Drag and drop an image or click to select-->
<!--            </div>-->
<!--            <img-->
<!--                v-if="imagePreview || building.bg_image"-->
<!--                :src="imagePreview || `http://localhost:8000/storage/${building.bg_image}`"-->
<!--                alt="Image Preview"-->
<!--                class="max-h-40 object-contain mt-4"-->
<!--            />-->
<!--          </div>-->
<!--          <p class="text-black p-[10px]">Use only JPEG, PNG, JPG, GIF</p>-->
<!--          <p v-if="errors.bg_image" class="text-red-600 mt-1">{{ errors.bg_image[0] }}</p>-->
<!--        </div>-->
<!--        <div class="flex justify-center gap-4">-->
<!--          <button-->
<!--              @click="router.push('/')"-->
<!--              class="bg-gray-500 p-3 text-white rounded-lg hover:bg-gray-600-->
<!--                  transition-all duration-300 shadow-sm"-->
<!--          >-->
<!--            Cancel-->
<!--          </button>-->
<!--          <button-->
<!--              @click="createBuilding"-->
<!--              class="bg-blue-500 p-3 text-white rounded-lg hover:bg-blue-600-->
<!--                  transition-all duration-300 shadow-sm"-->
<!--          >-->
<!--            Save Changes-->
<!--          </button>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->
<!--<script setup>-->
<!--import {ref} from "vue";-->
<!--import {useRouter} from "vue-router";-->
<!--import {useFetch} from "#app";-->

<!--definePageMeta({-->
<!--  layout: "navbar",-->
<!--});-->

<!--const router = useRouter();-->
<!--const errors = ref({});-->
<!--const loading = ref(false);-->
<!--const imagePreview = ref(null);-->
<!--const building = ref({-->
<!--  title: "",-->
<!--  short_description: "",-->
<!--  long_description: "",-->
<!--  bg_image: "",-->
<!--});-->


<!--const editorOptions = ref({-->
<!--  theme: 'snow',-->
<!--  modules: {-->
<!--    toolbar: [-->
<!--      ['bold', 'italic', 'underline'],-->
<!--      [{'list': 'ordered'}, {'list': 'bullet'}, {'list': 'check'}],-->
<!--      [{'size': ['small', false, 'large', 'huge']}],-->
<!--      [{-->
<!--        'color': [-->
<!--          '#000000', '#FF0000', '#00FF00', '#0000FF', '#8A2BE2', '#A52A2A', '#5F9EA0',-->
<!--          '#FFD700', '#FF6347', '#00FFFF', '#FF1493', '#D2691E', '#228B22', '#FF4500',-->
<!--          '#2E8B57', '#8B0000', '#808000', '#BC8F8F', '#3CB371', '#B22222', '#A9A9A9',-->
<!--          '#F08080', '#C71585', '#D3D3D3', '#00FA9A', '#1E90FF', '#C0C0C0', '#FA8072',-->
<!--          '#aa8453'-->
<!--        ]-->
<!--      }],-->
<!--    ],-->
<!--  },-->
<!--  formats: ['bold', 'italic', 'underline', 'size', 'color', 'list'],-->
<!--});-->

<!--const handleFileChange = (event) => {-->
<!--  const file = event.target.files[0];-->
<!--  if (file) {-->
<!--    building.value.bg_image = file;-->
<!--    const reader = new FileReader();-->
<!--    reader.onload = (e) => {-->
<!--      imagePreview.value = e.target.result;-->
<!--    };-->
<!--    reader.readAsDataURL(file);-->
<!--  }-->
<!--};-->

<!--const createBuilding = async () => {-->
<!--  try {-->
<!--    loading.value = true;-->
<!--    errors.value = {};-->
<!--    const formData = new FormData();-->
<!--    formData.append("title", building.value.title);-->
<!--    formData.append("short_description", building.value.short_description);-->
<!--    formData.append("long_description", building.value.long_description);-->
<!--    if (building.value.bg_image) {-->
<!--      formData.append("bg_image", building.value.bg_image);-->
<!--    }-->
<!--    const {data, error} = await useFetch(`/api/buildings/`, {-->
<!--      method: "POST",-->
<!--      body: formData,-->
<!--      headers: {Accept: "application/json"},-->
<!--    });-->
<!--    if (error && error.value) {-->
<!--      errors.value = error.value.data?.errors || {-->
<!--        general: "An unknown error occurred",-->
<!--      };-->
<!--      return;-->
<!--    }-->
<!--    if (data) {-->
<!--      await router.push("/");-->
<!--    } else {-->
<!--      errors.value.general = "Failed to create building. Server response is empty.";-->
<!--    }-->
<!--  } catch (err) {-->
<!--    console.error("An error occurred:", err);-->
<!--    errors.value.general = "There was an error sending your request.";-->
<!--  } finally {-->
<!--    loading.value = false;-->
<!--  }-->
<!--};-->
<!--</script>-->
<!--<style>-->
<!--@import 'https://cdn.quilljs.com/1.3.7/quill.snow.css';-->
<!--@import url('https://fonts.googleapis.com/css2?family=Comic+Neue&display=swap');-->
<!--</style>-->
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
        <div class="flex justify-center gap-4">
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
import {ref} from "vue";
import {useRouter} from "vue-router";
import {useFetch} from "#app";
import {Cropper} from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

definePageMeta({
  layout: "navbar",
});

const router = useRouter();
const errors = ref({});
const loading = ref(false);
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
          ]
        }
      ],
    ],
  },
  formats: ["bold", "italic", "underline", "size", "color", "list"],
});

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    building.value.bg_image = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const createBuilding = async () => {
  try {
    loading.value = true;
    errors.value = {};
    if (cropperRef.value && imagePreview.value) {
      const canvas = cropperRef.value.getResult()?.canvas;
      if (canvas) {
        const blob = await new Promise((resolve) =>
            canvas.toBlob(resolve, "image/jpeg")
        );
        if (blob) {
          const file = new File([blob], "cropped_image.jpg", {type: blob.type});
          building.value.bg_image = file;
        }
      }
    }
    const formData = new FormData();
    formData.append("title", building.value.title);
    formData.append("short_description", building.value.short_description);
    formData.append("long_description", building.value.long_description);
    if (building.value.bg_image) {
      formData.append("bg_image", building.value.bg_image);
    }
    const {data, error} = await useFetch("/api/buildings/", {
      method: "POST",
      body: formData,
      headers: {Accept: "application/json"},
    });
    if (error && error.value) {
      errors.value = error.value.data?.errors || {
        general: "An unknown error occurred",
      };
      return;
    }
    if (data) {
      await router.push("/");
    } else {
      errors.value.general = "Failed to create building. Server response is empty.";
    }
  } catch (err) {
    console.error("An error occurred:", err);
    errors.value.general = "There was an error sending your request.";
  } finally {
    loading.value = false;
  }
};
</script>
<style>
@import 'https://cdn.quilljs.com/1.3.7/quill.snow.css';
@import url('https://fonts.googleapis.com/css2?family=Comic+Neue&display=swap');
</style>



