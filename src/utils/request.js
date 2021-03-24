import axios from 'axios'
import { Message } from 'element-ui'

const service = axios.create({
  // baseURL: '/api'
  baseURL: 'http://127.0.0.1:9000'
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    if (sessionStorage.getItem("user")) {
      config.headers.token = "token"
    }
    return config
  },
  error => {
    // 请求出错
    Message.error("对不起，出错了！")
    console.log(error)
    Promise.reject(error)
  }
)

export default service
