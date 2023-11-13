import axios, { AxiosInstance } from 'axios'
import { boot } from 'quasar/wrappers'

export default boot(({ Vue }) => {
  axios.defaults.baseURL = process.env.API_URL
  Vue.prototype.$axios = axios
})
