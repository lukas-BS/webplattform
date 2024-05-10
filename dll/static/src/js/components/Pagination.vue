<template>
  <div class="pagination" v-if="pagination && pagination.count > 0">
    <button
      class="pagination__button pagination__previous"
      @click="previousPage()"
      :disabled="pagination.prev === null">
      <span><</span>
    </button>
    <div v-for="(page, index) in pages" class="pagination__number">
      <button class="pagination__button" disabled v-if="pages[index - 1] !== page - 1 && page > 1">...</button>
      <button
        class="pagination__button"
        :disabled="page === '...'"
        :class="{ 'pagination__button--active': page === currentPage }"
        @click="jumpTo($event, page)">
        {{ page }}
      </button>
      <button
        class="pagination__button"
        disabled
        v-if="pages.length < 4 && pages[index + 1] !== page + 1 && page < pages.length - 1">
        ...
      </button>
    </div>
    <button class="pagination__button pagination__next" @click="nextPage()" :disabled="pagination.next === null">
      <span>></span>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

import { usePagination } from '../composables/pagination';

const { pagination, currentPage, jumpTo, previousPage, nextPage } = usePagination();

const props = defineProps({
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
  console.log(pagination.value);
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
});
</script>

<style scoped></style>
