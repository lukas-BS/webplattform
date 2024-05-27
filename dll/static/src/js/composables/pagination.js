import { ref, watch } from 'vue';

export function usePagination(updateContents, currentResponse) {
  const pagination = ref({
    count: 0,
    next: null,
    perPage: 20,
    prev: null
  });

  const updatePagination = (response) => {
    pagination.value = {
      count: response.data.count,
      next: response.data.next,
      perPage: 20,
      prev: response.data.previous
    };
  };

  const jumpTo = (newPage) => {
    updateContents(newPage);
  };

  const previousPage = (newPage) => {
    updateContents(newPage);
  };

  const nextPage = async (newPage) => {
    updateContents(newPage);
  };

  watch(currentResponse, (newResponse) => {
    if (newResponse) {
      updatePagination(newResponse);
    }
  });

  return {
    jumpTo,
    nextPage,
    pagination,
    previousPage,
    updatePagination
  };
}
