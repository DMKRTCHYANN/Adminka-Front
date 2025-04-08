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
import { ref } from 'vue'
import { GoogleMap, Marker } from 'vue3-google-map'

const apiKey = 'AIzaSyAkVQ9GmgG4F6VNlg-xRe4vy6MOS1IWDPI'

const center = ref({ lat: 40.689247, lng: -74.044502 })

const markerOptions = ref({
  position: center.value,
  draggable: true,
  label: '',
  title: 'Drag me to select a location',
})

const onMarkerDragEnd = (event) => {
  const newPosition = event.latLng
  center.value = { lat: newPosition.lat(), lng: newPosition.lng() }
  markerOptions.value.position = center.value
  console.log('New coordinates:', center.value)
}
</script>
