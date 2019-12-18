import service from '@/api/service'
import paths from '@/api/basePath'
import components from './components'
import * as common from './common'
import * as Cookie from './cookie'
import {Const} from './const'

export default {
  install(Vue, options) {
    // 全局监听click事件，用于全局点击的时候隐藏内容
    Vue.prototype._globalClick = function(callback) {
      document.getElementById('app').onclick = function() {
        callback()
      }
    }
    Vue.prototype.$bus = new Vue()
    Vue.prototype.Const = Const
    // 将common下面所有的公共方法注册为公用方法
    for (let key of Object.keys(common)) {
      Vue.prototype[key] = common[key]
    }
    // 将Cookie下面所有的公共方法注册为公用方法
    for (let key in Cookie) {
      Vue.prototype[key] = Cookie[key]
    }
    // 将service下面所有的公共方法注册为公用方法
    for (const key of Object.keys(service)) {
      Vue.prototype[key] = service[key]
    }
    // 将plugins下面所有的vue组件注册为全局组件
    for (let key in components) {
      Vue.component(key, components[key])
    }
    Vue.prototype._basePath = {}
    for (let key in paths) {
      Vue.prototype._basePath[key] = paths[key]
    }
    Vue.directive('auth', {
      inserted: (el, binding, vNode) => {
        const arr = ['boss']
        if (!arr.includes(binding.value)) {
          el.parentNode.removeChild(el)
        }
      }
    })
  }
}
