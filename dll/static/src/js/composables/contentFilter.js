import { computed, ref, watch } from 'vue';

import axios from 'axios';
import { debounce } from 'lodash';

import { usePagination } from './pagination';
import { useQuery } from './query';

const { updateQueryString } = useQuery();

export function useContentFilter() {
  const { currentPage, updatePagination } = usePagination();
  const dataUrl = ref(null);
  const queryParams = ref({});
  const contents = ref([]);
  const loading = ref(true);
  const sorting = ref('-latest');
  const q = ref('');
  const competences = ref([]);

  const windowDom = computed(() => {
    return window;
  });

  const loggedIn = computed(() => {
    return windowDom.value.loggedIn;
  });

  const getSubjects = () => window.subjectFilter;

  const getParams = (page) => {
    return {
      q: q.value,
      sorting: sorting.value,
      competence: window.competenceSlug,
      page: Number.isInteger(page) ? page : 1,
      competences: competences.value,
      ...queryParams.value,
    };
  };

  const updateContents = (page) => {
    loading.value = true;
    if (!page || typeof page === 'object') {
      // Reset page to 1 if there is no page given or page object is an event (object)
      currentPage.value = 1;
    }
    axios
      .get(dataUrl.value, {
        params: getParams(page),
      })
      .then((response) => {
        window.scroll(0, 0);
        updateQueryString();
        contents.value = response.data.results;
        updatePagination(response);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  //  --------------------------------------------------------------------------
  //  watchers
  //  --------------------------------------------------------------------------
  watch(q, () => {
    debouncedUpdate();
  });

  watch(competences, () => {
    updateContents();
  });

  const debouncedUpdate = debounce(updateContents, 500);

  return { dataUrl, queryParams, contents, loading, sorting, q, competences, getSubjects, getParams, updateContents };
}
