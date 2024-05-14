import axios from 'axios';

export function useAxios() {
  const token = window.dllData?.csrfToken || null;

  const axiosInstance = axios.create({
    headers: {
      'X-CSRFToken': token,
    },
  });

  return {
    axios: axiosInstance,
  };
}
