<template>
  <div>
    <div class="mb-5" v-if="props.mode === 'review'">
      <button class="button--neutral button--smallSquare mt-3" @click="show = true" type="button" v-if="!show">
        <span class="fas fa-plus"></span>
      </button>
      <div class="form-group mt-4" v-if="inputValue || show">
        <div class="d-flex">
          <input
            type="text"
            class="form-control me-2"
            :id="props.id"
            v-model="inputValue"
            :placeholder="'Kommentar zum Feld \'' + props.name + '\''" />
          <button class="button--danger button--smallSquare" @click="remove()" type="button">
            <span class="fas fa-times"></span>
          </button>
        </div>
      </div>
    </div>
    <div class="form-comment mb-5" v-if="props.mode === 'edit' && reviewValue">
      Anmerkung: <br />
      {{ reviewValue }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

//  --------------------------------------------------------------------------------------------------------------------
//  models + props
//  --------------------------------------------------------------------------------------------------------------------
const reviewValue = defineModel({ default: '' });

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  mode: {
    type: String,
    default: '',
  },
});

//  --------------------------------------------------------------------------------------------------------------------
//  component variables
//  --------------------------------------------------------------------------------------------------------------------
const show = ref(false);
const inputValue = ref(reviewValue);

//  --------------------------------------------------------------------------------------------------------------------
//  component logic
//  --------------------------------------------------------------------------------------------------------------------
const remove = () => {
  show.value = false;
  inputValue.value = '';
};
</script>

<style scoped></style>
