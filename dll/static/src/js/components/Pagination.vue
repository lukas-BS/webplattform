<template>
  <div class="pagination" v-if="props.pagination && props.pagination.count > 0">
    <button
      class="pagination__button pagination__previous"
      @click="emitOnPrevClick"
      :disabled="props.pagination.prev === null">
      <span><</span>
    </button>
    <div v-for="(page, index) in pages" class="pagination__number">
      <button class="pagination__button" disabled v-if="pages[index - 1] !== page - 1 && page > 1">...</button>
      <button
        class="pagination__button"
        :disabled="page === '...'"
        :class="{ 'pagination__button--active': page === props.currentPage }"
        @click="emitOnJumpClick($event, page)">
        {{ page }}
      </button>
      <button
        class="pagination__button"
        disabled
        v-if="pages.length < 4 && pages[index + 1] !== page + 1 && page < pages.length - 1">
        ...
      </button>
    </div>
    <button
      class="pagination__button pagination__next"
      @click="emitOnNextClick"
      :disabled="props.pagination.next === null">
      <span>></span>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    default: 1,
  },
  pagination: {
    type: Object,
    default() {
      return {};
    },
  },
  paginateBy: {
    type: Number,
    default: 20,
    required: false,
  },
  margin: {
    type: Number,
    default: 2,
    required: false,
  },
});

const pages = computed(() => {
  if (props.pagination.count) {
    let counter = props.pagination.count;
    let pages = [];
    let page = 1;

    while (counter > 0) {
      if (
        page === 1 ||
        page === Math.ceil(counter / props.paginateBy) ||
        (page >= props.currentPage - props.margin && page <= props.currentPage + props.margin)
      ) {
        pages.push(page);
      }
      page++;
      counter -= props.paginateBy;
    }
    return pages;
  }
});

//  --------------------------------------------------------------------------------------------------------------------
//  emits
//  --------------------------------------------------------------------------------------------------------------------
const emits = defineEmits(['next', 'prev', 'jump']);

const emitOnPrevClick = () => {
  emits('prev');
};

const emitOnNextClick = () => {
  emits('next');
};

const emitOnJumpClick = (event, page) => {
  emits('jump', event, page);
};
</script>

<style scoped></style>
