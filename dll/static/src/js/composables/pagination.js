import { ref } from 'vue'

export function usePagination(updateContents) {
  const pagination = ref({
    count: 0,
    next: null,
    perPage: 20,
    prev: null,
  })

  const updatePagination = (response) => {
    pagination.value = {
      count: response.data.count,
      next: response.data.next,
      perPage: 20,
      prev: response.data.previous,
    }
  }

  const jumpTo = async (newPage) => {
    const response = await updateContents(newPage)
    updatePagination(response)
  }

  const previousPage = async (newPage) => {
    const response = await updateContents(newPage)
    updatePagination(response)
  }

  const nextPage = async (newPage) => {
    const response = await updateContents(newPage)
    updatePagination(response)
  }

  return {
    jumpTo,
    nextPage,
    pagination,
    previousPage,
    updatePagination,
  }
}
