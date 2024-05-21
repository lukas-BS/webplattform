<template>
  <div class="form-group">
    <label
      :for="props.id"
      class="mb-2 w-100"
    >{{ props.label }}:<span v-if="props.required">*</span></label>
    <button
      v-if="props.helpText"
      v-tooltip="props.helpText"
      class="button--neutral button--smallSquare button--help ms-1 float-end"
      type="button"
    />
    <div class="form__list-inputs">
      <div
        v-for="(link, index) in linksValue"
        :key="index"
        class="mb-2"
      >
        <div class="d-flex align-items-baseline">
          <input
            :id="props.id"
            v-model="link.name"
            type="text"
            class="form-control me-3"
            :placeholder="props.namePlaceholder"
            :readonly="props.readonly"
          >
          <input
            :id="props.id"
            v-model="link.url"
            type="text"
            class="form-control me-3"
            :class="{ 'form__field--error': !link.validUrl }"
            :placeholder="props.linkPlaceholder"
            :readonly="props.readonly"
            @blur="checkLinkValid(link)"
          >
          <select
            v-if="props.types"
            v-model="link.type"
            class="form-control me-3"
            name="types"
          >
            <option value="video">
              Video / Audio
            </option>
            <option value="href">
              Text
            </option>
          </select>
          <button
            v-if="!props.readonly"
            class="button--danger button--smallSquare"
            type="button"
            @click="removeLink(link)"
          >
            <span class="fas fa-times" />
          </button>
        </div>
        <div
          v-if="!link.validUrl"
          class="alert alert-danger mt-1"
        >
          Bitte geben Sie eine valide URL ein. Die URL muss mit http:// bzw. https:// beginnen.
        </div>
      </div>
    </div>
    <div v-if="!props.readonly">
      <button
        class="button--neutral button--smallSquare"
        type="button"
        @click="addLink()"
      >
        <span class="fas fa-plus" />
      </button>
    </div>
    <ReviewInput
      :id="'id' + -props.review"
      v-model="reviewValue"
      :mode="props.review ? 'review' : 'edit'"
      :name="props.label"
    />
  </div>
</template>

<script setup>
import { watch } from 'vue'

import ReviewInput from './ReviewInput.vue'

//  --------------------------------------------------------------------------------------------------------------------
//  models + props
//  --------------------------------------------------------------------------------------------------------------------
const linksValue = defineModel('linksValue', { default: [] })
const reviewValue = defineModel('reviewValue', { default: '' })

const props = defineProps({
  error: {
    default: false,
    type: Boolean,
  },
  helpText: {
    default: '',
    type: String,
  },
  id: {
    required: true,
    type: String,
  },
  label: {
    required: true,
    type: String,
  },
  linkPlaceholder: {
    default: 'https://example.org',
    type: String,
  },
  namePlaceholder: {
    default: 'Linktext',
    type: String,
  },
  readonly: {
    default: false,
    type: Boolean,
  },
  required: {
    default: false,
    type: Boolean,
  },
  review: {
    default: false,
    type: Boolean,
  },
  type: {
    default: 'href',
    type: String,
  },
  types: {
    default: false,
    type: Boolean,
  },
})

//  --------------------------------------------------------------------------------------------------------------------
//  component logic
//  --------------------------------------------------------------------------------------------------------------------
const addLink = () => {
  linksValue.value.push({ name: '', type: props.type, url: '', validUrl: true })
}

const removeLink = (link) => {
  linksValue.value.splice(linksValue.value.indexOf(link), 1)
}

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
  )
  return !!pattern.test(url)
}

const checkLinkValid = (link) => {
  link.validUrl = isValidUrl(link.url)
}

//  --------------------------------------------------------------------------------------------------------------------
//  watchers
//  --------------------------------------------------------------------------------------------------------------------
watch(
  () => props.error,
  () => {
    for (let i = 0; i < linksValue.value.length; i++) {
      console.log('checking link')
      checkLinkValid(linksValue.value[i])
    }
  },
)

//  --------------------------------------------------------------------------------------------------------------------
//  lifecycle
//  --------------------------------------------------------------------------------------------------------------------
for (let i = 0; i < linksValue.value.length; i++) {
  linksValue.value[i].validUrl = true
}
</script>

<style scoped></style>
