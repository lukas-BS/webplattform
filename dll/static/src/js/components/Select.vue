<template>
  <div class="form-group">
    <label :for="props.id" v-text="props.label" />
    <div class="d-flex">
      <select
        :name="props.id"
        :id="props.id"
        class="form-control"
        :class="{ 'form__field--error': props.error }"
        v-model="selectValue"
        :disabled="props.readonly">
        <option
          v-for="(option, index) in props.options"
          :key="index"
          :value="option.value"
          :selected="option.value === defaultVal"
          v-text="option.label" />
      </select>
      <!-- TODO: Tooltip -->
      <button
        v-if="props.helpText"
        class="button--neutral button--smallSquare button--help ms-1"
        type="button"
        data-bs-toggle="tooltip"
        data-placement="top"
        :title="props.helpText"></button>
    </div>
    <ReviewInput
      :mode="props.review ? 'review' : 'edit'"
      :id="'id' + -props.review"
      :name="props.label"
      v-model="reviewValue" />
  </div>
</template>

<script setup>
import ReviewInput from './ReviewInput.vue';

//  --------------------------------------------------------------------------------------------------------------------
//  models + props
//  --------------------------------------------------------------------------------------------------------------------
const selectValue = defineModel('inputValue', { default: '' });
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
  options: {
    type: Array,
    required: true,
  },
  defaultVal: {
    type: String,
    default: '',
  },
  helpText: {
    type: String,
    default: '',
  },
  readonly: {
    type: Boolean,
    default: false,
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
//  lifecycle
//  --------------------------------------------------------------------------------------------------------------------
selectValue.value = props.defaultVal;
</script>

<style scoped></style>
