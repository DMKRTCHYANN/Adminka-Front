<script setup>
import { StencilPreview, BoundingBox, DraggableArea } from 'vue-advanced-cropper';
import { defineProps, computed, defineEmits } from 'vue';

const props = defineProps({
  image: Object,
  coordinates: Object,
  stencilCoordinates: Object,
  aspectRatio: [Number, String],
  minAspectRatio: [Number, String],
  maxAspectRatio: [Number, String],
  transitions: Object,
});

const emit = defineEmits([
  'move',
  'moveEnd',
  'resize',
  'resizeEnd',
]);

const style = computed(() => {
  const { height, width, left, top } = props.stencilCoordinates;
  const style = {
    position: 'absolute',
    width: `${width}px`,
    height: `${height}px`,
    transform: `translate(${left}px, ${top}px)`,
  };
  if (props.transitions && props.transitions.enabled) {
    style.transition = `${props.transitions.time}ms ${props.transitions.timingFunction}`;
  }
  return style;
});

const aspectRatios = computed(() => ({
  minimum: props.aspectRatio || props.minAspectRatio,
  maximum: props.aspectRatio || props.maxAspectRatio,
}));

const onMove = (moveEvent) => emit('move', moveEvent);
const onMoveEnd = () => emit('moveEnd');
const onResize = (resizeEvent) => emit('resize', resizeEvent);
const onResizeEnd = () => emit('resizeEnd');
</script>

<template>
  <div :style="style">
    <bounding-box @resize="onResize" @resize-end="onResizeEnd">
      <draggable-area @move="onMove" @move-end="onMoveEnd">
        <stencil-preview
            :image="image"
            :width="stencilCoordinates.width"
            :height="stencilCoordinates.height"
            :coordinates="coordinates"
            :transitions="transitions"
        />
      </draggable-area>
    </bounding-box>
  </div>
</template>
