import axios from 'axios'
import { Config } from '../../config'
// 创建axios实例
const service = axios.create({
  baseURL: Config.APP_BASE_API,
  timeout: 5000 // 请求超时时间
})

// 真机获取
axios.defaults.adapter = function (config) {
  return new Promise((resolve, reject) => {
    const settle = require('axios/lib/core/settle')
    const buildURL = require('axios/lib/helpers/buildURL')
    uni.request({
      method: config.method.toUpperCase(),
      url: buildURL(Config.APP_BASE_API + config.url, config.params, config.paramsSerializer),
      header: config.headers,
      data: config.data,
      dataType: config.dataType,
      responseType: config.responseType,
      sslVerify: config.sslVerify,
      complete: function complete (response) {
        const res = {
          data: response.data,
          errMsg: response.errMsg,
          header: response.header,
          config: config
        }
        if (response.statusCode !== 200) {
          res.data = {}
          res.data.code = 99
          res.data.msg = response.errMsg
        }
        settle(resolve, reject, res)
      }
    })
  })
}

// request拦截器
service.interceptors.request.use(
  req => {
    req.headers.Authorization = 'getToken()' // 让每个请求携带自定义token 请根据实际情况自行修改
    req.headers['Content-Type'] = 'application/json'
    return req
  },
  error => {
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  res => {
    if (res.data.code < 100) {
      uni.showToast({
        title: res.data.msg,
        icon: 'loading',
        duration: 1500
      })
    } else {
      return res.data
    }
  },
  error => {
    uni.showToast({
      title: error.message,
      icon: 'loading',
      duration: 1500
    })
    // // 兼容blob下载出错json提示
    // if (error.response.data instanceof Blob && error.response.data.type.toLowerCase().indexOf('json') !== -1) {
    //   const reader = new FileReader()
    //   reader.readAsText(error.response.data, 'utf-8')
    //   reader.onload = function (e) {
    //     const errorMsg = JSON.parse(reader.result).message
    //     // Notification.error({
    //     //   title: errorMsg,
    //     //   duration: 5000
    //     // })
    //   }
    // } else {
    //   let code = 0
    //   try {
    //     code = error.response.data.status
    //   } catch (e) {
    //     if (error.toString().indexOf('Error: timeout') !== -1) {
    //       // Notification.error({
    //       //   title: '网络请求超时',
    //       //   duration: 5000
    //       // })
    //       return Promise.reject(error)
    //     }
    //   }
    //   console.log(code)
    //   if (code) {

    //   } else {
    //     // Notification.error({
    //     //   title: '接口请求失败',
    //     //   duration: 5000
    //     // })
    //   }
    // }
    // return Promise.reject(error)
  }
)
export { service as request }
