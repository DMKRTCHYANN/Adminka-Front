<template>
  <GoogleMap
<<<<<<< HEAD
      :api-key="''"
=======
      :api-key="apiKey"
>>>>>>> dff5108171d36e2ef86f73c7ac9f717b0e4d8541
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
<<<<<<< HEAD
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
=======
import { ref } from 'vue'
import { GoogleMap, Marker } from 'vue3-google-map'

const apiKey = 'AIzaSyAkVQ9GmgG4F6VNlg-xRe4vy6MOS1IWDPI'

const center = ref({ lat: 40.689247, lng: -74.044502 })

>>>>>>> dff5108171d36e2ef86f73c7ac9f717b0e4d8541
const markerOptions = ref({
  position: center.value,
  draggable: true,
  label: '',
  title: 'Drag me to select a location',
<<<<<<< HEAD
});

const onMarkerDragEnd = (event) => {
  const newPosition = event.latLng;
  emit('update:modelValue', { lat: newPosition.lat(), lng: newPosition.lng() })
};
=======
})

const onMarkerDragEnd = (event) => {
  const newPosition = event.latLng
  center.value = { lat: newPosition.lat(), lng: newPosition.lng() }
  markerOptions.value.position = center.value
  console.log('New coordinates:', center.value)
}
>>>>>>> dff5108171d36e2ef86f73c7ac9f717b0e4d8541
</script>
