<template>
  <div class="form-group">
    <label :for="id" class="mb-2 w-100">{{ label }}:<span v-if="required">*</span></label>
    <button class="button--neutral button--smallSquare button--help ml-1 float-right" type="button" data-toggle="tooltip" data-placement="top" :title="helpText" v-if="helpText"></button>
    <div class="form__list-inputs">
      <div class="d-flex align-items-baseline mb-2" v-for="item in list">
        <input type="text" class="form-control mr-3 form__list-input" :id="id" :placeholder="placeholder" v-model="item.text" @input="emitUpdate" :readonly="readonly" v-if="!textarea">
        <textarea type="text" class="form-control mr-3" :id="id" :placeholder="placeholder" v-model="item.text" @input="emitUpdate" :readonly="readonly" v-else></textarea>
        <button class="button--danger button--smallSquare" @click="removeItem(item)" type="button" v-if="!readonly">
          <span class="fas fa-times"></span>
        </button>
      </div>
    </div>
    <div>
      <button class="button--neutral button--smallSquare" @click="addItem" type="button" v-if="!readonly">
        <span class="fas fa-plus"></span>
      </button>
    </div>
    <app-review-input :mode="review ? 'review' : 'edit'" :id="'id'+-review" :name="label" :reviewValue.sync="ownReviewValue"></app-review-input>
  </div>
</template>

<script>
  import ReviewInput from './ReviewInput.vue'
  import { reviewMixin } from '../mixins/reviewMixin'

  export default {
    name: 'ListInput',
    components: {
      'AppReviewInput': ReviewInput
    },
    mixins: [reviewMixin],
    props: {
      id: {
        type: String,
        default: '',
        required: true
      },
      required: {
        type: Boolean,
        default: false,
        required: false
      },
      label: {
        type: String,
        default: '',
        required: true
      },
      placeholder: {
        type: String,
        default: '',
        required: false
      },
      initial: {
        type: Array,
        default: () => {
          return []
        },
        required: false
      },
      helpText: {
        type: String,
        default: '',
        required: false
      },
      readonly: {
        type: Boolean,
        default: false,
        required: false
      },
      min: {
        type: Number,
        default: 0,
        required: false
      },
      textarea: {
        type: Boolean,
        default: false,
        required: false
      }
    },
    data () {
      return {
        list: []
      }
    },
    created () {
      this.list = this.initial ? this.initial.map(x => { return {text: x}}) : []
      if (!this.list.length) {
        let i = 0;
        while (i < this.min) {
          this.addItem()
          i++
        }
      }
    },
    methods: {
      addItem () {
        this.list.push({text: ''})
      },
      removeItem (text) {
        this.list.splice(this.list.indexOf(text), 1)
      },
      emitUpdate () {
        const result = this.list.map(x => x.text)
        this.$emit('update:list', result)
      }
    },
    watch: {
      list (newValue) {
        const tempResult = newValue.map(x => x.text)
        // Remove empty fields
        const result = tempResult.filter(input => input.length !== 0)
        this.$emit('update:list', result)
      }
    }
  }
</script>

<style scoped>

</style>