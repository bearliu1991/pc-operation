import { filterNull, httpPost, httpGet, httpPostJson } from '@/utils/common'

export default {
  httpGet: (url, params, options) => {
    return options ? httpGet(url, params, options) : httpGet(url, params)
  },
  httpPost: (url, params, options) => {
    return options ? httpPost(url, params, options) : httpPost(url, params)
  },
  $get: (url, params, options) => {
    return options ? httpGet(url, params, options) : httpGet(url, params)
  },
  $post: (url, params, options) => {
    return options ? httpPost(url, params, options) : httpPost(url, params)
  },
  $postJson: (url, params, options) => {
    return options ? httpPostJson(url, params, options) : httpPostJson(url, params)
  }
}
