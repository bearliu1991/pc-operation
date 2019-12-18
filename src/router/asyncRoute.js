function getComp() {
  return import('@/views/layout/Layout')
}
export const asyncRoute = {
  /* 
   *权限管理后台 
   */
  '/tree' : () => getComp(),
  'menuTree' : () => import('@/views/permissionManage/tree/menuTree'),
  
  /* 
   *运营管理 
   */
  '/home' : () => getComp(),
  'index' : () => import('@/views/operationManage/index'),
  '/business' : () => getComp(),
  'businessList' : () => import('@/views/operationManage/business/businessList'),
  '/tradeArea' : () => getComp(),
  'areaList' : () => import('@/views/operationManage/tradeArea/areaList'),
  'category' : () => import('@/views/operationManage/tradeArea/category'),
  'color' : () => import('@/views/operationManage/tradeArea/color'),
  'size' : () => import('@/views/operationManage/tradeArea/size'),
  'activity': () => import('@/views/operationManage/tradeArea/activity'),
  'device': () => import('@/views/operationManage/tradeArea/device'),
  '/operateFinance' : () => getComp(),
  'withdraw' : () => import('@/views/operationManage/finance/withdraw'),
  'withdrawSetting' : () => import('@/views/operationManage/finance/withdrawSetting'),
  '/logistics' : () => getComp(),
  'logistics' : () => import('@/views/operationManage/logistics/logistics'),
  '/createAccount' : () => getComp(),
  'account' : () => import('@/views/operationManage/createAccount/account'),
  'roleManage' : () => import('@/views/operationManage/createAccount/role'),
  '/editor' : () => getComp(),
  'editorFrame' : () => import('@/views/operationManage/editor/editorFrame'),
  '/rights' : () => getComp(),
  'rights' : () => import('@/views/operationManage/rights/rights'),
  '/rankRecommend' : () => getComp(),
  'superiorGood' : () => import('@/views/operationManage/rankRecommend/superiorGood'),
  'tailGoods' : () => import('@/views/operationManage/rankRecommend/tailGoods'),
  'superiorStall' : () => import('@/views/operationManage/rankRecommend/superiorStall'),
  'singleGoodRecommend' : () => import('@/views/operationManage/rankRecommend/singleGoodRecommend'),
  'homePageRecommend' : () => import('@/views/operationManage/rankRecommend/homePageRecommend'),
  '/operationOrder' : () => getComp(),
  'orderList' : () => import('@/views/operationManage/order/orderList')
}
export const asyncIcon = {
  // '/permission': '&#xe617;',
  '/tree' : '&#xe609;',
  '/operationOrder' : '&#xe62b;',
  '/finance' : '&#xe625;',
  '/customer' : '&#xe632;',
  '/shop' : '&#xe63f;',
  '/user' : '&#xe6fe;',
  '/goods' : '&#xe630;',
  '/business' : '&#xe665;',
  '/tradeArea' : '&#xe6d9;',
  '/setting' : '&#xe646;',
  '/operateFinance': '&#xe625;',
  '/logistics': '&#xe607;',
  '/createAccount': '&#xe8a8;',
  '/editor': '&#xe62a;',
  '/childAccount': '&#xe622;',
  '/rankRecommend': '&#xe715;',
  '/printSettings': '&#xe662;',
  '/marketing': '&#xe765;',
}
export const defaultRoute = [
  { path: '*', redirect: '/welcome/index'}
]