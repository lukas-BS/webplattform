import queryString from 'query-string';

import { useContentFilter } from './contentFilter';
import { usePagination } from './pagination';

export function useQuery() {
  const { getParams } = useContentFilter();
  const { currentPage } = usePagination();
  //  --------------------------------------------------------------------------
  //  logic
  //  --------------------------------------------------------------------------
  const updateQueryString = () => {
    let params = getParams(currentPage.value);
    console.log('update query params', params);

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
console.log(keys);

// for (let i = 0; i < keys.length; i++) {
//   const value = query[keys[i]];
//   console.log('value', value);

//   if (value) {
//     console.log('query', query);

//     if (query[keys[i]] === 'false') {
//       query[keys[i]] = false;
//     }
//     if (query[keys[i]] === 'true') {
//       query[keys[i]] = true;
//     }
//     if (this[keys[i]] && Array.isArray(this[keys[i]]) && !Array.isArray(query[keys[i]])) {
//       this[keys[i]] = [query[keys[i]]];
//     } else {
//       this[keys[i]] = query[keys[i]];
//     }
//   }
// }
