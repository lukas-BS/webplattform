<template>
  <div class="form-group">
    <label :for="props.id" class="mb-2 w-100">{{ props.label }}:<span v-if="props.required">*</span></label>
    <button
      v-if="props.helpText"
      class="button--neutral button--smallSquare button--help ms-1 float-end"
      type="button"
      v-tooltip="props.helpText"></button>
    <div class="form__list-inputs">
      <div class="d-flex align-items-baseline mb-2" v-for="(item, index) in internalList" :key="index">
        <input
          v-if="!props.textarea"
          type="text"
          class="form-control me-3 form__list-input"
          :id="props.id"
          :placeholder="props.placeholder"
          :readonly="props.readonly"
          v-model="internalList[index]" />
        <textarea
          v-else
          type="text"
          class="form-control me-3"
          :id="props.id"
          :placeholder="props.placeholder"
          :readonly="props.readonly"
          v-model="internalList[index]" />
        <button
          v-if="!props.readonly"
          class="button--danger button--smallSquare"
          @click="removeItem(item)"
          type="button">
          <span class="fas fa-times"></span>
        </button>
      </div>
    </div>
    <div>
      <button v-if="!props.readonly" class="button--neutral button--smallSquare" @click="addItem()" type="button">
        <span class="fas fa-plus"></span>
      </button>
    </div>
    <ReviewInput
      :mode="props.review ? 'review' : 'edit'"
      :id="'id' + -props.review"
      :name="props.label"
      v-model="reviewValue" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

import ReviewInput from './ReviewInput.vue';

//  --------------------------------------------------------------------------------------------------------------------
//  models + props
//  --------------------------------------------------------------------------------------------------------------------
const listValue = defineModel('listValue', { default: [] });
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
  required: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: '',
  },
  initial: {
    type: Array,
    default: () => [],
  },
  helpText: {
    type: String,
    default: '',
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  min: {
    type: Number,
    default: 0,
  },
  textarea: {
    type: Boolean,
    default: false,
  },
  review: {
    type: Boolean,
    default: false,
  },
});

const internalList = ref(props.initial);

//  --------------------------------------------------------------------------------------------------------------------
//  component logic
//  --------------------------------------------------------------------------------------------------------------------
const addItem = () => {
  internalList.value.push('');
};

const removeItem = (text) => {
  internalList.value.splice(internalList.value.indexOf(text), 1);
};

//  --------------------------------------------------------------------------------------------------------------------
//  watchers
//  --------------------------------------------------------------------------------------------------------------------
watch(internalList, (newListValue) => {
  const result = newListValue.filter((input) => input.length !== 0);
  listValue.value = result;
});

//  --------------------------------------------------------------------------------------------------------------------
//  lifecycle
//  --------------------------------------------------------------------------------------------------------------------
if (!internalList.value.length) {
  listValue.value = [];
  for (let i = 0; i < props.min; i++) {
    addItem();
  }
}
</script>

<style scoped></style>
