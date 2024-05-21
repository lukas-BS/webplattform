import axios from 'axios'

export function useAxios() {
  const token = window.dllData?.csrfToken || null
  const axiosHeaders = {
    'X-CSRFToken': token,
  }

  const axiosInstance = axios.create({
    headers: axiosHeaders,
  })

  return {
    axios: axiosInstance,
    axiosHeaders,
  }
}
