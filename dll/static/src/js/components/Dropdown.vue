<template>
  <div class="form-group">
    <label :for="props.id">{{ props.label }}:<span v-if="props.required">*</span></label>
    <div class="d-flex">
      <Multiselect
        ref="multiselect"
        class="dll-dropdown"
        :class="{ 'form__field--error': props.error }"
        searchable
        object
        :mode="selectMode"
        :close-on-select="closeOnSelect"
        :min-chars="1"
        :delay="0"
        :options="
          async function (query) {
            return await fetchOptions(query);
          }
        "
        :disabled="props.disabled || props.readonly"
        :filter-results="false"
        :resolve-on-load="props.prefetch"
        v-model="dropdownValue"
        @open="triggerOptionFetch()">
      </Multiselect>
      <button
        v-if="props.helpText"
        class="button--neutral button--smallSquare button--help ms-1"
        type="button"
        v-tooltip="props.helpText" />
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

import Multiselect from '@vueform/multiselect';

import { useAxios } from '../composables/axios';
import ReviewInput from './ReviewInput.vue';

//  --------------------------------------------------------------------------------------------------------------------
//  models + props
//  --------------------------------------------------------------------------------------------------------------------
const dropdownValue = defineModel('dropdownValue', { default: () => {} });
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
  prefetch: {
    type: Boolean,
    default: false,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  fetchUrl: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
  params: {
    type: Object,
    default: () => {},
  },
  disabled: {
    type: Boolean,
    default: false,
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
    required: false,
  },
  review: {
    type: Boolean,
    default: false,
  },
});

//  --------------------------------------------------------------------------------------------------------------------
//  component variables
//  --------------------------------------------------------------------------------------------------------------------
const { axios } = useAxios();
const multiselect = ref();

//  --------------------------------------------------------------------------------------------------------------------
//  component logic
//  --------------------------------------------------------------------------------------------------------------------
const fetchOptions = (q) => {
  const options = axios
    .get(props.fetchUrl, {
      params: {
        q,
        ...props.params,
      },
    })
    .then((res) => {
      let options = res.data.results.map((el) => {
        return {
          label: el.username || el.name,
          value: el.pk || el.value || el.id,
          pk: el.pk || el.id,
        };
      });

      const compareObjects = (a, b) => {
        return a.pk === b.pk && a.label === b.label;
      };

      let uniqueSet = new Set(options.map(JSON.stringify));
      let uniqueArray = Array.from(uniqueSet).map(JSON.parse);

      let resultArray = uniqueArray.filter((item, index, self) => {
        return self.findIndex((obj) => compareObjects(obj, item)) === index;
      });

      return resultArray;
    })
    .catch((err) => {
      console.log(err);
    });

  return options;
};

const triggerOptionFetch = () => {
  if (multiselect.value) {
    multiselect.value.refreshOptions();
  }
};

//  --------------------------------------------------------------------------------------------------------------------
//  computed
//  --------------------------------------------------------------------------------------------------------------------
const selectMode = computed(() => {
  return props.multiple ? 'tags' : 'single';
});

const closeOnSelect = computed(() => {
  return props.multiple ? false : true;
});

//  --------------------------------------------------------------------------------------------------------------------
//  watchers
//  --------------------------------------------------------------------------------------------------------------------
// watch(
//   () => props.disabled,
//   (newState) => {
//     if (newState && multiselect.value) {
//       triggerOptionFetch();
//     }
//   },
// );

// watch(
//   () => props.params,
//   () => {
//     triggerOptionFetch();
//   },
// );
</script>

<style lang="scss" scoped>
@import '@vueform/multiselect/themes/default.css';

.dll-dropdown {
  --ms-tag-bg: #f0f0f0;
  --ms-tag-color: #333;
  --ms-tag-font-weight: 400;
  --ms-ring-color: #0d6efd40;
}
</style>
