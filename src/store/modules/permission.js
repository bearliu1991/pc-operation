import { constantRouterMap } from '@/router'
import { asyncRoute, defaultRoute, asyncIcon } from '@/router/asyncRoute'
import {httpPostJson} from '@/utils/common'
import {getCookie} from '@/utils/cookie'
import Path from '@/api/basePath'
/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.indexOf(role) >= 0)
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */

function formatData(arrs) {
  for (let item of arrs) {
    const idxs = arrs.filter((val) => {
      return item.id === val.parentId
    })
    for (let idx of idxs) {
      item.children ? item.children.push(idx) : item.children = [idx]
      idx.isDelete = true
    }
  }
  for (let i = arrs.length - 1; i >= 0; i--) {
    if (arrs[i].isDelete) arrs.splice(i, 1)
  }
}

let route = ''
function firstIterator (arr, isRoot) {
  let nothing = []
  if (arr.length) {
    for (let i = 0; i < arr.length; i++) {
      route = arr[i].routePath
      let obj = {
        path: route,
        name: arr[i].name,
        component: asyncRoute[route],
        meta: { roles: [arr[i].role], title: arr[i].name }
      }
      if (arr[i].children) {
        if (isRoot) {
          obj.redirect = route + '/' + arr[i].children[0].routePath
          obj.meta.icon = asyncIcon[route]
        }
        obj.children = firstIterator(arr[i].children)
      }
      nothing.push(obj)
    }
  }
  return nothing
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        let path 
        let param
        if (getCookie('userType') === '6') {
          path = Path.ajaxAllMenu
        } else {
          path = Path.ajaxAllocateRights
          param = {systems: [getCookie('userType') - 0].toString()}
        }
        
        httpPostJson(path, param).then((res) => {
          let pathsArr = []
          if (res.success) {
            let routeArr = res.data
            // 对特别账号特别处理
            if (getCookie('phone') === '99999999' || getCookie('userType') === '6') {
              routeArr = routeArr.filter(item => item.parentId !== -1 && item.type === 1)
              formatData(routeArr)
              pathsArr = firstIterator(routeArr, true)
              commit('SET_ROUTERS', pathsArr.concat(defaultRoute))
              resolve()
              // const index = routeArr.findIndex(item => item.code === '/createAccount')
              // index > -1 && routeArr.splice(index, 1)
            } else {
              httpPostJson(Path.ajaxGetRightsMenu, {system: 5, userId: getCookie('userId') - 0}).then((result) => {
                if (result.success) {
                  // debugger
                  let filterArr = []
                  for (let n of result.data) {
                    let val = routeArr.find(item => item.id === n.menuId)
                    val && filterArr.push(val)
                  }
                  routeArr = filterArr.filter(item => item.parentId !== -1 && item.type === 1)
                  formatData(routeArr)
                  pathsArr = firstIterator(routeArr, true)
                  commit('SET_ROUTERS', pathsArr.concat(defaultRoute))
                  resolve()
                }
              })
            }
          }
        })
      })
    }
  }
}

export default permission
