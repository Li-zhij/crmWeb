import axios from 'axios'

const service = axios.create({
  // baseURL: '/api'
  baseURL: 'http://127.0.0.1:9000'
})

export default service
