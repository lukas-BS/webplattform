<template>
  <div class="form-group">
    <label :for="props.id">{{ props.label }}:<span v-if="props.required">*</span></label>
    <div class="row">
      <div class="col d-flex align-items-baseline">
        <label class="me-3" :for="props.id + 'from'">{{ props.labelFrom }}:</label>
        <input
          :type="props.type"
          class="form-control"
          :id="props.id + '-from'"
          :min="props.min"
          :max="props.max"
          :readonly="readonly"
          v-model="from"
          @blur="validateFrom($event)" />
      </div>
      <div class="col d-flex align-items-baseline">
        <label class="me-3" :for="props.id + 'to'">{{ props.labelTo }}:</label>
        <input
          :type="props.type"
          class="form-control"
          :id="props.id + '-to'"
          :min="props.min"
          :max="props.max"
          :readonly="props.readonly"
          v-model="to"
          @blur="validateTo($event)" />
      </div>
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
const rangeValue = defineModel('rangeValue');
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
  labelFrom: {
    type: String,
    required: true,
  },
  labelTo: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'text',
  },
  required: {
    type: Boolean,
    default: false,
  },
  min: {
    type: Number,
    default: null,
  },
  max: {
    type: Number,
    default: null,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  review: {
    type: Boolean,
    default: false,
  },
});

//  --------------------------------------------------------------------------------------------------------------------
//  component variables
//  --------------------------------------------------------------------------------------------------------------------
const from = ref(null);
const to = ref(null);

//  --------------------------------------------------------------------------------------------------------------------
//  component logic
//  --------------------------------------------------------------------------------------------------------------------
const checkValues = () => {
  if (to.value && from.value && parseInt(from.value) >= parseInt(to.value)) {
    if (parseInt(to.value) === 1) {
      to.value = 2;
    }
    from.value = to.value - 1;
  }
};

const validateTo = (e) => {
  let newValue = e.target.value;
  if (newValue || newValue === 0) {
    if (newValue < props.min) {
      to.value = props.min;
    }
    if (newValue > props.max) {
      to.value = props.max;
    }
    checkValues();
  }
};

const validateFrom = (e) => {
  let newValue = e.target.value;
  if (newValue || newValue === 0) {
    if (newValue < props.min) {
      from.value = props.min;
    }
    if (newValue > props.max) {
      from.value = props.max;
    }
    checkValues();
  }
};

const updateRangeValue = () => {
  rangeValue.value = {
    lower: parseInt(from.value),
    upper: parseInt(to.value),
  };
};

//  --------------------------------------------------------------------------------------------------------------------
//  watchers
//  --------------------------------------------------------------------------------------------------------------------
watch([from, to], () => {
  updateRangeValue();
});

//  --------------------------------------------------------------------------------------------------------------------
//  lifecycle
//  --------------------------------------------------------------------------------------------------------------------
if (rangeValue.value) {
  from.value = rangeValue.value['lower'];
  to.value = rangeValue.value['upper'];
}
</script>

<style scoped></style>
