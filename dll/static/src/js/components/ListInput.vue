<template>
  <div class="form-group">
    <label :for="props.id" class="mb-2 w-100">{{ props.label }}:<span v-if="props.required">*</span></label>
    <!-- TODO: Tooltip -->
    <button
      v-if="props.helpText"
      class="button--neutral button--smallSquare button--help ms-1 float-end"
      type="button"
      data-bs-toggle="tooltip"
      data-placement="top"
      :title="props.helpText"></button>
    <div class="form__list-inputs">
      <div class="d-flex align-items-baseline mb-2" v-for="(item, index) in listValue" :key="index">
        <input
          v-if="!props.textarea"
          type="text"
          class="form-control me-3 form__list-input"
          :id="props.id"
          :placeholder="props.placeholder"
          :readonly="props.readonly"
          v-model="item.text" />
        <textarea
          v-else
          type="text"
          class="form-control me-3"
          :id="props.id"
          :placeholder="props.placeholder"
          :readonly="props.readonly"
          v-model="item.text" />
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
import { watch } from 'vue';

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

//  --------------------------------------------------------------------------------------------------------------------
//  component logic
//  --------------------------------------------------------------------------------------------------------------------
const addItem = () => {
  listValue.value.push({ text: '' });
};

const removeItem = (text) => {
  listValue.value.splice(listValue.value.indexOf(text), 1);
};

//  --------------------------------------------------------------------------------------------------------------------
//  watchers
//  --------------------------------------------------------------------------------------------------------------------
// watch(listValue, (newListValue) => {
//   const tempResult = newListValue.map((x) => x.text);

//   const result = tempResult.filter((input) => input.length !== 0);
//   listValue.value = result;
// });

//  --------------------------------------------------------------------------------------------------------------------
//  lifecycle
//  --------------------------------------------------------------------------------------------------------------------
listValue.value = props.initial ? props.initial.map((x) => x) : [];

for (let i = listValue.value.length; i < props.min; i++) {
  addItem();
}
</script>

<!-- <script>
export default {
  methods: {
    emitUpdate() {
      const result = this.list.map((x) => x.text);
      this.$emit('update:list', result);
    },
  },
  watch: {
    list(newValue) {
      const tempResult = newValue.map((x) => x.text);
      // Remove empty fields
      const result = tempResult.filter((input) => input.length !== 0);
      this.$emit('update:list', result);
    },
  },
};
</script> -->

<style scoped></style>
