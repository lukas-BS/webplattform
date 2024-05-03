<template>
  <a class="content-teaser" :class="contentClass" :href="props.content.url">
    <div class="content-teaser__image-container">
      <img
        v-if="props.content.image"
        class="content-teaser__image"
        :src="props.content.image"
        srcset=""
        :alt="'Vorschaubild ' + props.content.name" />
    </div>
    <div class="content-teaser__body">
      <div class="content-teaser__type">{{ props.content.type_verbose }}</div>
      <div class="content-teaser__favor" v-if="props.content.favored">
        <span class="fa fa-heart favor-icon favor-icon--active">
          <span class="sr-only">Auf dem Merkzettel</span>
        </span>
      </div>
      <div class="clearfix"></div>
      <div class="content-teaser__title">{{ props.content.name }}</div>
      <div class="content-teaser__abstract">{{ props.content.teaser }}</div>
      <div class="content-teaser__footer">
        <div class="content-teaser__competences">
          <span
            v-for="competence in props.content.competences"
            class="content-teaser__competence"
            :class="competence.icon"></span>
        </div>
      </div>
    </div>
  </a>
</template>

<script setup>
const props = defineProps({
  content: {
    type: Object,
    default() {
      return {};
    },
  },
});

import { computed } from 'vue';

const contentClass = computed(() => {
  return props.content.type ? `content-teaser--${props.content.type}` : '';
});

// TODO: tooltip missing
</script>

<style scoped></style>
