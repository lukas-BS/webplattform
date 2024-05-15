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
      <div class="mb-2" v-for="(link, index) in linksValue" :key="index">
        <div class="d-flex align-items-baseline">
          <input
            type="text"
            class="form-control me-3"
            :id="props.id"
            :placeholder="props.namePlaceholder"
            :readonly="props.readonly"
            v-model="link.name" />
          <input
            type="text"
            class="form-control me-3"
            :class="{ 'form__field--error': !link.validUrl }"
            :id="props.id"
            :placeholder="props.linkPlaceholder"
            :readonly="props.readonly"
            v-model="link.url"
            @blur="checkLinkValid(link)" />
          <select v-if="props.types" class="form-control me-3" name="types" v-model="link.type">
            <option value="video">Video / Audio</option>
            <option value="href">Text</option>
          </select>
          <button
            v-if="!props.readonly"
            class="button--danger button--smallSquare"
            type="button"
            @click="removeLink(link)">
            <span class="fas fa-times"></span>
          </button>
        </div>
        <div class="alert alert-danger mt-1" v-if="!link.validUrl">
          Bitte geben Sie eine valide URL ein. Die URL muss mit http:// bzw. https:// beginnen.
        </div>
      </div>
    </div>
    <div v-if="!props.readonly">
      <button class="button--neutral button--smallSquare" @click="addLink()" type="button">
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
const linksValue = defineModel('linksValue', { default: [] });
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
  error: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  namePlaceholder: {
    type: String,
    default: 'Linktext',
  },
  linkPlaceholder: {
    type: String,
    default: 'https://example.org',
  },
  type: {
    type: String,
    default: 'href',
  },
  helpText: {
    type: String,
    default: '',
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  types: {
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
const addLink = () => {
  linksValue.value.push({ name: '', url: '', type: props.type, validUrl: true });
};

const removeLink = (link) => {
  linksValue.value.splice(linksValue.value.indexOf(link), 1);
};

const isValidUrl = (url) => {
  // https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
  var pattern = new RegExp(
    '^(https?:\\/\\/)' +
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
      '((\\d{1,3}\\.){3}\\d{1,3}))' +
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
      '(\\?[;&a-z\\d%_.~+=-]*)?' +
      '(\\#[-a-z\\d_]*)?$',
    'i',
  );
  return !!pattern.test(url);
};

const checkLinkValid = (link) => {
  link.validUrl = isValidUrl(link.url);
};

//  --------------------------------------------------------------------------------------------------------------------
//  watchers
//  --------------------------------------------------------------------------------------------------------------------
watch(
  () => props.error,
  () => {
    for (let i = 0; i < linksValue.value.length; i++) {
      console.log('checking link');
      checkLinkValid(linksValue.value[i]);
    }
  },
);

//  --------------------------------------------------------------------------------------------------------------------
//  lifecycle
//  --------------------------------------------------------------------------------------------------------------------
for (let i = 0; i < linksValue.value.length; i++) {
  linksValue.value[i].validUrl = true;
}
</script>

<style scoped></style>
