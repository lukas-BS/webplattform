<template>
  <div class="form-group">
    <label :for="props.id">{{ props.label }}:<span v-if="props.required">*</span></label>
    <div class="d-flex">
      <textarea
        class="form-control"
        :class="{ 'form__field--error': props.error }"
        :id="props.id"
        :placeholder="props.placeholder"
        :readonly="props.readonly"
        :maxlength="props.maximalChars"
        :rows="props.rows"
        v-model="textAreaValue" />
      <button
        v-if="props.helpText"
        class="button--neutral button--smallSquare button--help ms-1"
        type="button"
        v-tooltip="props.helpText"></button>
    </div>
    <small v-if="props.characterCounter" class="form-text text-muted float-end">
      {{ charactersLeft }} Zeichen verbleibend
    </small>
    <div class="clearfix"></div>
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
const textAreaValue = defineModel('inputValue', { default: '' });
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
  readonly: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: '',
  },
  characterCounter: {
    type: Boolean,
    default: false,
  },
  maximalChars: {
    type: Number,
    default: null,
  },
  required: {
    type: Boolean,
    default: false,
  },
  rows: {
    type: Number,
    default: 10,
  },
  helpText: {
    type: String,
    default: '',
  },
  error: {
    type: Boolean,
    default: false,
  },
  review: {
    type: Boolean,
    default: false,
  },
});

//  --------------------------------------------------------------------------------------------------------------------
//  computed
//  --------------------------------------------------------------------------------------------------------------------
const charactersLeft = computed(() => {
  return textAreaValue.value ? props.maximalChars - textAreaValue.value.length : props.maximalChars;
});
</script>

<style scoped></style>
