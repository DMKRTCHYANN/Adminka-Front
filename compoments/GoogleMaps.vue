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
import { ref, watch, defineEmits } from "vue";
import { GoogleMap, Marker } from "vue3-google-map";

const props = defineProps({
  apiKey: {
    type: String,
    required: true,
  },
  building: {
    type: Object,
    required: true,
  },
  markerPosition: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits();

const center = ref({
  lat: props.building.location?.coordinates?.[0] || 0,
  lng: props.building.location?.coordinates?.[1] || 0,
});

const markerOptions = ref({
  position: center.value,
  draggable: true,
  title: "Drag me to select a location",
});

watch(
    () => props.markerPosition,
    (newVal) => {
      markerOptions.value.position = newVal;
    },
    { deep: true, immediate: true }
);

const onMarkerDragEnd = (event) => {
  const lat = event.latLng.lat();
  const lng = event.latLng.lng();
  console.log("New marker position:", { lat, lng });
  emit("update:markerPosition", { lat, lng });
};
</script>
