<template>
  <GoogleMap
      :api-key="apiKey"
      style="width: 100%; height: 500px"
      :center="center"
      :zoom="15"
  >
    <Marker
        :options="markerOptions"
        @dragend="onMarkerDragEnd"
    />
  </GoogleMap>
</template>
<script setup>
import { ref, defineEmits } from "vue";
import { GoogleMap, Marker } from "vue3-google-map";

const emit = defineEmits("update:modelValue");
const props = defineProps({
  apiKey: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Object,
    required: true,
  },
});

const center = ref({
  lat: props.modelValue.lat || 40.180438,
  lng: props.modelValue.lng || 44.488690,
});

const markerOptions = ref({
  position: props.modelValue,
  draggable: true,
  title: "Drag me to select a location",
});

const onMarkerDragEnd = (event) => {
  const lat = event.latLng.lat();
  const lng = event.latLng.lng();
  emit("update:modelValue", { lat, lng });
};
</script>
