import Vue from 'vue'
import Router from 'vue-router'

// const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  {
    path: '/welcome',
    component: Layout,
    redirect: '/welcome/index',
    name: 'welcome',
    meta: {
      title: '欢迎',
      icon: '&#xe641;'
    },
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/welcome'),
        meta: { title: '欢迎页' }
      }
    ]
  },
  {
    path: '/',
    redirect: '/welcome/index'
  },
  { path: '/login', component: () => import('@/views/loginOperation'), name: '齐货档口', hidden: true },
  { path: '/loginAdmin', component: () => import('@/views/loginOperation'), name: '管理员', hidden: true },
]

export default new Router({
  mode: 'history', // 后端支持可开
  base: 'operationManage',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
