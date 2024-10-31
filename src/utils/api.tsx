import axios from 'axios'
import Cookies from 'js-cookie'

// export const baseURL = 'http://192.168.102.18:8081'
export const baseURL = 'https://ems-backend.bogorkab.go.id' //https://backendkosmos.bogorkab.go.id

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
