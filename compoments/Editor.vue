<template>
  <div v-if="editor">
    <ckeditor
        :editor="editor"
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted } from 'vue';
import { CKEditor } from '@ckeditor/ckeditor5-vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);
const editor = ref(null);

onMounted(async () => {
  if (process.client) {
    const ClassicEditor = await import('@ckeditor/ckeditor5-build-classic');
    editor.value = ClassicEditor.default;
  }
});
</script>