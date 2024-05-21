<template>
  <a class="content-teaser" :class="contentClass" :href="props.content.url">
    <div class="content-teaser__image-container">
      <img
        v-if="props.content.image"
        class="content-teaser__image"
        :src="props.content.image"
        srcset=""
        :alt="'Vorschaubild ' + props.content.name"
      />
    </div>
    <div class="content-teaser__body">
      <div class="content-teaser__type">{{ props.content.type_verbose }}</div>
      <div v-if="props.content.favored" class="content-teaser__favor">
        <span class="fa fa-heart favor-icon favor-icon--active">
          <span class="sr-only">Auf dem Merkzettel</span>
        </span>
      </div>
      <div class="clearfix" />
      <div class="content-teaser__title">{{ props.content.name }}</div>
      <div class="content-teaser__abstract">{{ props.content.teaser }}</div>
      <div class="content-teaser__footer">
        <div class="content-teaser__competences">
          <span
            v-for="(competence, index) in props.content.competences"
            :key="index"
            v-tooltip="competence.name"
            class="content-teaser__competence"
            :class="competence.icon"
          />
        </div>
      </div>
    </div>
  </a>
</template>

<script setup>
import { computed } from 'vue';

//  --------------------------------------------------------------------------------------------------------------------
//  models + props
//  --------------------------------------------------------------------------------------------------------------------
const props = defineProps({
  content: {
    default() {
      return {};
    },
    type: Object
  }
});

//  --------------------------------------------------------------------------------------------------------------------
//  computed
//  --------------------------------------------------------------------------------------------------------------------
const contentClass = computed(() => {
  return props.content.type ? `content-teaser--${props.content.type}` : '';
});
</script>

<style scoped></style>
