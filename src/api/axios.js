import axios from 'axios'
import { getCookie, setCookie, removeCookie } from '@/utils/cookie'
import { logoutClearCookie } from '@/utils/common'
import {Message, MessageBox} from 'element-ui'

let service = axios.create({
  // withCredentials: true, // 允许携带cookie
  baseURL: process.env.BASE_API,
  timeout: 5000 // 超时时间
})

axios.defaults.retry = 4
axios.defaults.retryDelay = 20
service.interceptors.request.use(
  config => {
    // axios.get('https://www.easy-mock.com/mock/59e9b251c0c35056478ea94c/base/hello').then(res => {
    //   debugger
    // })
    const token = getCookie('x-auth-token')
    config.headers['app'] = 'operationManage'
    token && (config.headers['x-auth-token'] = token) // 让每个请求携带自定义token 请根据实际情况自行修改
    return config
  },
  err => {
    return Promise.reject(err)
  })

// http response 服务器响应拦截器，这里拦截401错误，并重新跳入登页重新获取token
service.interceptors.response.use(
  response => {
    const headers = response.headers
    const res = response.data
    headers['x-auth-token'] && setCookie('x-auth-token', headers['x-auth-token'])
    if (res.code === '-2' || res.code === '-3' || res.code === '-4' || res.code === '-8') {
      MessageBox.alert(res.msg, {
        callback: action => {
          logoutClearCookie()
          location.reload()
        }
      })
      return
    }
    if (!res.success) {
      Message({
        message: res.msg,
        type: 'error',
        duration: 3 * 1000
      })
    }
    
    return response
  },
  err => {
    // if (err.message.includes('timeout')) {
      // console.error(err)
      Message.error("请求超时")
    //   MessageBox.confirm('', '请求超时！', {
    //     confirmButtonText: '重新请求',
    //     cancelButtonText: '取消',
    //     type: 'error',
    //     center: true
    //     }).then(() => {
    //       this.$message({
    //         type: 'success',
    //         message: '删除成功!'
    //       });
    //     }).catch(() => {
    //       this.$message({
    //         type: 'info',
    //         message: '已取消删除'
    //       });
    //     });
    // }
    // err.response
    return Promise.reject(err.response)
  })
// service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

export default service
