import { ref } from 'vue';

import queryString from 'query-string';

import { useContentFilter } from './contentFilter';

const { updateContents } = useContentFilter();

export function usePagination() {
  const pagination = ref({
    count: 0,
    perPage: 20,
    next: null,
    prev: null,
  });

  const currentPage = ref(1);

  //  --------------------------------------------------------------------------
  //  logic
  //  --------------------------------------------------------------------------
  const updatePagination = (response) => {
    console.log('update pagination', response);
    pagination.value = {
      count: response.data.count,
      perPage: 20,
      next: response.data.next,
      prev: response.data.previous,
    };
  };

  const jumpTo = (event, page) => {
    currentPage.value = page;
    updateContents(page);
  };

  const previousPage = () => {
    updateContents(--currentPage.value);
  };

  const nextPage = () => {
    updateContents(++currentPage.value);
  };

  const query = queryString.parse(location.search, {
    parseBooleans: true,
  });

  if (query.page) {
    currentPage.value = parseInt(query.page);
  }

  return {
    pagination,
    currentPage,
    jumpTo,
    previousPage,
    nextPage,
    updatePagination,
  };
}
