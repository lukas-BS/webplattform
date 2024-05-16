<template>
  <div class="form-group">
    <label :for="props.id" class="mb-2 w-100">
      <span class="icon--dlt me-3" :class="iconClass" v-if="props.icon"></span> {{ props.label }}:<span
        v-if="props.required"
        >*</span
      >
    </label>
    <button
      v-if="helpText"
      class="button--neutral button--smallSquare button--help ms-1 float-end"
      type="button"
      v-tooltip="props.helpText"></button>
    <div class="form__links-input">
      <div class="d-flex align-items-baseline">
        <select class="form-control me-3" name="types" v-model="compliance" @change="updateText">
          <option value="compliant">Erfüllt</option>
          <option value="not_compliant">Nicht erfüllt</option>
          <option value="unknown">Unbekannt</option>
        </select>
        <input
          type="text"
          class="form-control me-3"
          :class="{ 'form__field--error': props.error }"
          :id="props.id"
          placeholder="Anmerkungen"
          v-model="complianceText"
          :readonly="props.readonly" />
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
import { computed, ref } from 'vue';

import ReviewInput from './ReviewInput.vue';

//  --------------------------------------------------------------------------------------------------------------------
//  models + props
//  --------------------------------------------------------------------------------------------------------------------
const complianceText = defineModel('complianceText', { default: '' });
const compliance = defineModel('compliance', { default: 'unknown' });
const reviewValue = defineModel('reviewValue', { default: '' });

const props = defineProps({
  id: {
    type: String,
    default: '',
    required: true,
  },
  label: {
    type: String,
    default: '',
    required: true,
  },
  required: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: '',
  },
  error: {
    type: Boolean,
    default: false,
  },
  helpText: {
    type: String,
    default: '',
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

const defaultTextCompliant = ref('');
const defaultTextNotCompliant = ref('');
const defaultTextUnknown = ref('');

//  --------------------------------------------------------------------------------------------------------------------
//  computed
//  --------------------------------------------------------------------------------------------------------------------
const iconClass = computed(() => {
  if (props.icon) {
    const icon = props.icon ? 'icon-' + props.icon : '';
    if (compliance.value === 'compliant') {
      return icon + '--green';
    } else if (compliance.value === 'not_compliant') {
      return icon + '--red';
    } else {
      return icon + '--grey';
    }
  }
  return '';
});

//  --------------------------------------------------------------------------------------------------------------------
//  component logic
//  --------------------------------------------------------------------------------------------------------------------
const isDefaultText = (s) => {
  return (
    s === defaultTextCompliant.value ||
    s === defaultTextNotCompliant.value ||
    s === defaultTextUnknown.value ||
    s === ''
  );
};

const updateText = (event) => {
  if (event.target.value === 'compliant') {
    if (isDefaultText(complianceText.value)) {
      complianceText.value = defaultTextCompliant.value;
    }
  } else if (event.target.value === 'not_compliant') {
    if (isDefaultText(complianceText.value)) {
      complianceText.value = defaultTextNotCompliant.value;
    }
  } else {
    if (isDefaultText(complianceText.value)) {
      complianceText.value = defaultTextUnknown.value;
    }
  }
};

//  --------------------------------------------------------------------------------------------------------------------
//  lifecycle
//  --------------------------------------------------------------------------------------------------------------------
defaultTextCompliant.value = window.compliance[props.id].compliant;
defaultTextNotCompliant.value = window.compliance[props.id].not_compliant;
defaultTextUnknown.value = window.compliance[props.id].unknown;
</script>

<style scoped></style>
