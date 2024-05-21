<template>
  <div class="form-group">
    <label
      :for="id"
      class="mb-2 w-100"
    >{{ label }}:<span v-if="required">*</span></label>
    <button
      v-if="helpText"
      class="button--neutral button--smallSquare button--help ms-1 float-end"
      type="button"
      data-bs-toggle="tooltip"
      data-placement="top"
      :title="helpText"
    />
    <div class="form__links-input">
      <div class="d-flex align-items-baseline">
        <input
          :id="id"
          v-model="internalLink.url_name"
          type="text"
          class="form-control me-3"
          :class="{ 'form__field--error': error }"
          placeholder="Linktext"
          :readonly="readonly"
        >
        <input
          :id="id"
          v-model="internalLink.url"
          type="text"
          class="form-control me-3"
          :class="{ 'form__field--error': !internalLink.validUrl || error }"
          placeholder="https://example.org"
          :readonly="readonly"
          @blur="checkLinkValid(internalLink)"
        >
        <select
          v-if="types"
          v-model="internalLink.type"
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
      </div>
    </div>
    <div
      v-if="!internalLink.validUrl"
      class="alert alert-danger mt-1"
    >
      Bitte geben Sie eine valide URL ein. Die URL muss mit http:// bzw. https:// beginnen.
    </div>
    <div
      v-if="incomplete"
      class="alert alert-danger mt-1"
    >
      Bitte geben Sie sowohl eine Bezeichnung (z.B. Webseite X) und eine URL an.
    </div>
    <app-review-input
      :id="'id' + -review"
      v-model:review-value="ownReviewValue"
      :mode="review ? 'review' : 'edit'"
      :name="label"
    />
  </div>
</template>

<script>
import { reviewMixin } from '../mixins/reviewMixin'
import ReviewInput from './ReviewInput.vue'
export default {
  name: 'LinkInput',
  components: {
    AppReviewInput: ReviewInput,
  },
  created() {
    if (this.link) {
      this.internalLink = this.link
      this.internalLink.validUrl = true
    } else {
      this.internalLink = { url: '', url_name: '', validUrl: true }
    }
  },
  data() {
    return {
      internalLink: [],
      incomplete: false,
    }
  },
  methods: {
    isValidUrl(url) {
      var pattern = new RegExp(/^(ftp|http|https):\/\/[^ "]+$/, 'i')
      return !!pattern.test(url)
    },
    checkLinkValid(link) {
      link.validUrl = this.isValidUrl(link.url)
      this.incomplete = !link.url || !link.url_name
      this.$forceUpdate()
    },
  },
  mixins: [reviewMixin],
  props: {
    error: {
      default: false,
      required: false,
      type: Boolean,
    },
    helpText: {
      default: '',
      required: false,
      type: String,
    },
    id: {
      default: '',
      required: true,
      type: String,
    },
    label: {
      default: '',
      required: true,
      type: String,
    },
    link: {
      default: () => {
        return { url: '', url_name: '', validUrl: true }
      },
      required: false,
      type: Object,
    },
    readonly: {
      default: false,
      required: false,
      type: Boolean,
    },
    required: {
      default: false,
      required: false,
      type: Boolean,
    },
    type: {
      default: 'href',
      required: false,
      type: String,
    },
    types: {
      default: false,
      required: false,
      type: Boolean,
    },
  },
  watch: {
    internalLink: {
      deep: true,
      handler: function (newValue) {
        this.$emit('update:link', newValue)
      },
    },
  },
}
</script>

<style scoped></style>
