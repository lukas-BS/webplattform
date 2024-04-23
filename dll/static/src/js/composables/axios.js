
import axios from 'axios'

export function useAxios() {
      const axiosInstance = axios.create({
        headers: {
          'X-CSRFToken': window.dllData.csrfToken
        }
      })
    
    return {
        axios: axiosInstance
    }
}