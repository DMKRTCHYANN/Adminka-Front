<template>
  <div>
    <GMapMap
        :center="center"
        :api-key="apiKey"
        :zoom="12"
        style="width: 100%; height: 500px;"
    >
      <GMapMarker
          :position="markerPosition"
          :draggable="true"
          @dragend="onMarkerDragEnd"
      />
      <div class="search-input-container">
        <GMapAutocomplete
            ref="autocomplete"
            placeholder="Search a location"
            @input="onInput"
            @place_changed="setPlace"
            class="google-search-input"
        />
      </div>
    </GMapMap>
  </div>
</template>
<script setup>
import { ref, watch } from "vue";

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  apiKey: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Object,
    required: true,
    default: () => ({ lat: 40.180438, lng: 44.488690 }),
    validator: (value) =>
        value &&
        typeof value.lat === "number" &&
        typeof value.lng === "number",
  },
});

const center = ref({ ...props.modelValue });
const markerPosition = ref({ ...props.modelValue });

watch(() => props.modelValue, (newVal) => {
  center.value = { ...newVal };
  markerPosition.value = { ...newVal };
});

const onInput = () => {

}

const onMarkerDragEnd = (event) => {
  const lat = event.latLng.lat();
  const lng = event.latLng.lng();
  updateMap({ lat, lng });
};

const setPlace = (place) => {
  if (place.geometry?.location) {
    const location = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };
    updateMap(location);
  }
};

const updateMap = (location) => {
  center.value = location;
  markerPosition.value = location;
  emit("update:modelValue", location);
};
</script>
<style>
.search-input-container {
  position: absolute;
  display: inline-block;
  z-index: 300;
  top: 17%;
  width: 100%;
  max-width: 400px;
}

.google-search-input {
  width: 100%;
  border-radius: 40px;
  background-color: white;
  color: black;
  padding: 10px 15px 10px 40px;
  font-size: 16px;
  border: 1px solid #d9d9d9;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  outline: none;
  transition: box-shadow 0.2s ease-in-out;
}

.google-search-input:focus {
  border-color: #4285f4;
  box-shadow: 0px 4px 8px rgba(66, 133, 244, 0.3);
}


.search-icon svg {
  width: 20px;
  height: 20px;
}
</style>