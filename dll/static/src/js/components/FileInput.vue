<template>
  <div class="form-group">
    <label :for="props.id">{{ props.label }}:<span v-if="props.required">*</span></label>

    <div class="custom-file">
      <div class="d-flex">
        <input
          type="file"
          class="custom-file-input"
          :id="props.id"
          :disabled="props.readonly"
          :accept="props.accept"
          @change="processInput($event)" />
        <label class="custom-file-label" :class="{ 'form__field--error': props.error }" :for="props.id">
          <span v-if="fileName" v-text="fileName" />
          <span v-else v-text="props.fileLabel" />
        </label>
        <button
          v-if="props.helpText"
          class="button--neutral button--smallSquare button--help ms-1"
          type="button"
          data-bs-toggle="tooltip"
          data-placement="top"
          v-tooltip="props.helpText"></button>
      </div>
    </div>
    <small v-if="props.hintText" class="form-text text-muted" v-text="props.hintText" />
    <img v-if="imageUrl" :src="imageUrl" alt="Vorschaubild" class="img-thumbnail" />
    <ReviewInput
      :mode="props.review ? 'review' : 'edit'"
      :id="'id' + -props.review"
      :name="props.label"
      v-model="reviewValue" />
  </div>
</template>

<script setup>
import { computed } from 'vue';

import ReviewInput from './ReviewInput.vue';

//  --------------------------------------------------------------------------------------------------------------------
//  models + props
//  --------------------------------------------------------------------------------------------------------------------
const fileValue = defineModel('fileValue', { default: null });
const reviewValue = defineModel('reviewValue', { default: '' });

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  fileLabel: {
    type: String,
    required: true,
  },
  error: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  image: {
    type: Object,
    default: () => {
      return {};
    },
  },
  accept: {
    type: String,
    default: 'image/gif, image/jpeg, image/png',
  },
  helpText: {
    type: String,
    default: '',
  },
  hintText: {
    type: String,
    default: null,
  },
  review: {
    type: Boolean,
    default: false,
  },
});

//  --------------------------------------------------------------------------------------------------------------------
//  computed
//  --------------------------------------------------------------------------------------------------------------------
const imageUrl = computed(() => {
  if (fileValue.value) {
    return URL.createObjectURL(fileValue.value);
  }

  if (props.image) {
    return props.image.url;
  }

  return null;
});

const fileName = computed(() => {
  if (fileValue.value) {
    return fileValue.value.name;
  }

  if (props.image) {
    return props.image.name;
  }

  return '';
});

//  --------------------------------------------------------------------------------------------------------------------
//  component logic
//  --------------------------------------------------------------------------------------------------------------------
const processInput = (e) => {
  fileValue.value = e.target.files[0];
};
</script>

<style scoped></style>
