import queryString from 'query-string';
import { useContentFilter } from './contentFilter';
import { usePagination } from './pagination';

export function useQuery() {
  const { getParams } = useContentFilter();
  const { currentPage } = usePagination();
  //  --------------------------------------------------------------------------
  //  logic
  //  --------------------------------------------------------------------------
  const updateQueryString = (params) => {
    Object.keys(params).forEach((key) => (params[key] === null || params[key] === '') && delete params[key]);

    if (params) {
      window.history.pushState({}, '', location.pathname + '?' + queryString.stringify(params));
    }
  };

  return { updateQueryString };
}

const query = queryString.parse(location.search, {
  parseBooleans: true,
});

let keys = Object.keys(query);

for (let i = 0; i < keys.length; i++) {
  const value = query[keys[i]];

  if (value) {
    if (query[keys[i]] === 'false') {
      query[keys[i]] = false;
    }
    if (query[keys[i]] === 'true') {
      query[keys[i]] = true;
    }
    if ([keys[i]] && Array.isArray([keys[i]]) && !Array.isArray(query[keys[i]])) {
      [keys[i]] = [query[keys[i]]];
    } else {
      [keys[i]] = query[keys[i]];
    }
  }
}
