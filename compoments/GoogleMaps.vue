<template>
  <GoogleMap
      :api-key="''"
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
import { defineProps, ref, watchEffect } from 'vue';
import { GoogleMap, Marker } from 'vue3-google-map';

defineProps({
  building: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue'])
const center = ref({ lat: 44.197996, lng: 44.477762 });
const markerOptions = ref({
  position: center.value,
  draggable: true,
  label: '',
  title: 'Drag me to select a location',
});

const onMarkerDragEnd = (event) => {
  const newPosition = event.latLng;
  emit('update:modelValue', { lat: newPosition.lat(), lng: newPosition.lng() })
};
</script>
