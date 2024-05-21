<template>
  <div v-if="pagination && pagination.count > 0" class="pagination">
    <button
      class="pagination__button pagination__previous"
      :disabled="pagination.prev === null"
      @click="emitPreviousPage(currentPage - 1)"
    >
      <span>{{ '<' }}</span>
    </button>
    <div v-for="(page, index) in pages" :key="index" class="pagination__number">
      <button v-if="pages[index - 1] !== page - 1 && page > 1" class="pagination__button" disabled>...</button>
      <button
        class="pagination__button"
        :disabled="page === '...'"
        :class="{ 'pagination__button--active': page === currentPage }"
        @click="emitJumpTo(page)"
      >
        {{ page }}
      </button>
      <button
        v-if="pages.length < 4 && pages[index + 1] !== page + 1 && page < pages.length - 1"
        class="pagination__button"
        disabled
      >
        ...
      </button>
    </div>
    <button
      class="pagination__button pagination__next"
      :disabled="pagination.next === null"
      @click="emitNextPage(currentPage + 1)"
    >
      <span>></span>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const pagination = defineModel('pagination', { default: () => {}, type: Object });
const currentPage = defineModel('currentPage', { default: 1, type: Number });

const props = defineProps({
  margin: {
    default: 2,
    required: false,
    type: Number
  },
  paginateBy: {
    default: 20,
    required: false,
    type: Number
  }
});

const pages = computed(() => {
  if (pagination.value.count) {
    let counter = pagination.value.count;
    let pages = [];
    let page = 1;

    while (counter > 0) {
      if (
        page === 1 ||
        page === Math.ceil(counter / props.paginateBy) ||
        (page >= currentPage.value - props.margin && page <= currentPage.value + props.margin)
      ) {
        pages.push(page);
      }
      page++;
      counter -= props.paginateBy;
    }
    return pages;
  }

  return [1];
});

//  --------------------------------------------------------------------------------------------------------------------
//  emits
//  --------------------------------------------------------------------------------------------------------------------
const emits = defineEmits(['nextPage', 'previousPage', 'jumpTo']);

const emitNextPage = (page) => {
  emits('nextPage', page);
};

const emitPreviousPage = (page) => {
  emits('previousPage', page);
};

const emitJumpTo = (page) => {
  emits('jumpTo', page);
};
</script>

<style scoped></style>
