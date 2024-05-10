import { onBeforeMount, ref } from 'vue';
const queryString = require('query-string');

export function usePagination() {
  const pagination = ref({
    count: 0,
    perPage: 20,
    next: null,
    prev: null,
  });

  const currentPage = ref(1);

  // function jumpTo (event, page) {
  //     currentPage.value = page
  //     updateContents(page)
  // };

  // function previousPage () {
  //     updateContents(--currentPage.value)
  // };

  // function nextPage () {
  //     updateContents(++currentPage.value)
  // };

  function updatePagination(response) {
    pagination.value = {
      count: response.data.count,
      perPage: 20,
      next: response.data.next,
      prev: response.data.previous,
    };
  }

  onBeforeMount(() => {
    const query = queryString.parse(location.search, {
      parseBooleans: true,
    });
    if (query.page) {
      currentPage.value = parseInt(query.page);
    }
  });

  return {
    pagination,
    currentPage,
    // jumpTo,
    // previousPage,
    // nextPage,
    updatePagination,
  };
}
