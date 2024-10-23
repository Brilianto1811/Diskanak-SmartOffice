import axios from 'axios'
import Cookies from 'js-cookie'

// export const baseURL = 'http://8.222.186.80:8081'
export const baseURL = 'https://backendkosmos.bogorkab.go.id'

// Create an Axios instance with custom configurations
const token = Cookies.get('token')

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'multipart/form-data', // Set default headers (optional)
    'Authorization': `Bearer ${token}`,
  }
})

export default api
