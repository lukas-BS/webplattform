import { ref } from 'vue';

export function usePagination(updateContents) {
  const pagination = ref({
    count: 0,
    perPage: 20,
    next: null,
    prev: null,
  });

  const updatePagination = (response) => {
    pagination.value = {
      count: response.data.count,
      perPage: 20,
      next: response.data.next,
      prev: response.data.previous,
    };
  };

  const jumpTo = async (newPage) => {
    const response = await updateContents(newPage);
    updatePagination(response);
  };

  const previousPage = async (newPage) => {
    const response = await updateContents(newPage);
    updatePagination(response);
  };

  const nextPage = async (newPage) => {
    const response = await updateContents(newPage);
    updatePagination(response);
  };

  return {
    pagination,
    jumpTo,
    previousPage,
    nextPage,
    updatePagination,
  };
}
