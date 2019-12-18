const local = process.env.BASE_API + '/qhms'
const finance = process.env.BASE_API + '/pay'
const exportExcel = process.env.EXPORT_EXCEL
export default {
  /*
  * 权限后台管理
  */
    // 权限管理相关
    ajaxDelAuth: local + '/auth/delete.do',
    ajaxAllAuth: local + '/auth/getAll.do',
    ajaxStallList: local + '/getStallList.do',
    ajaxAuthByPage: local + '/auth/getByPage.do',
    ajaxSaveAuth: local + '/auth/save.do',
    ajaxAuthAuth: local + '/auth/auth.do',
    ajaxAuthUpdate: local + '/auth/update.do',
    ajaxAuthDelArr: local + '/auth/deleteBatch.do',
    // 菜单管理相关
    ajaxGetRightsMenu: local + '/menu/getByUserid.do',
    ajaxGetChoosedMenuIds: local + '/permission/getAllByUserId.do',
    ajaxOperationGetValidRightsByRoleId: local + '/operation/menu/getByRoleId.do',
    ajaxMenuDel: local + '/menu/delete.do',
    ajaxAllMenu: local + '/menu/getAll.do',
    ajaxAllocateRights: local + '/menu/getAllForP.do',
    ajaxAllMenuForTree: local + '/menu/getAllForTree.do', // 树渲染所需接口
    ajaxMenuByPage: local + '/menu/getPage.do',
    ajaxSaveMenu: local + '/menu/save.do',
    ajaxMoveMenu: local + '/menu/moveMenu.do',
    // 角色管理相关
    ajaxRoleDel: local + '/role/delete.do',
    ajaxAllRole: local + '/role/getAll.do',
    ajaxRoleByPage: local + '/role/getByPage.do',
    ajaxSaveRole: local + '/role/save.do',

    // 用户图片上传
    ajaxUpload: `${process.env.UPLOAD_URL}/image/upload.do`, // local + '/image/upload.do',
    // 物流公司
    ajaxLogisticsCom: local + '/order/getExpressCode.do',
    // 用户相关
    ajaxUserDel: local + '/user/delete.do',
    // 登陆登出
    ajaxLogin: local + '/user/login.do',
    ajaxLogout: local + '/user/logout.do',
    ajaxLoginWithCode: local + '/user/loginWithCode.do',
  /*
  * 运营后台管理
  */
    // 档口管理
    ajaxBossListByPage: local + '/operation/getStallUserPage.do',
    ajaxOperationStallList: local + '/operation/getStallList.do',
    ajaxOperateStallDetail: local + '/operation/getStallDetail.do',
    ajaxStallSave: local + '/operation/stall/save.do',
    ajaxBossSave: local + '/operation/user/save.do',
    ajaxSelectStall: local + '/user/selectStall.do',
    ajaxUnbindDevice: local + '/operation/stall/unbindImei.do',
    ajaxBindDevice: local + '/operation/stall/bindImei.do',
    ajaxAllBuildings: local + '/stallbuilding/getAll.do',
    ajaxStallEnable: local + '/operation/stall/enable.do',
    ajaxCustomerEnable: local + '/operation/user/enable.do',
    // 设备管理
    ajaxGetDeviceByPage: local + '/operation/imei/getByPage.do',
    ajaxDeviceSave: local + '/operation/imei/addStallImei.do',
    ajaxDeviceEnable: local + '/operation/imei/setStatus.do',
    ajaxDeviceDel: local + '/operation/imei/delImes.do',
    // 大楼管理
    ajaxTradeAreaByPage: local + '/stallbuilding/getByPage.do',
    ajaxTradeAreaDel: local + '/operation/stallbuilding/delete.do',
    ajaxTradeAreaSave: local + '/operation/stallbuilding/save.do',
    ajaxTradeAreaSetStatus: local + '/operation/stallbuilding/status.do',
    ajaxFloorDel: local + '/operation/buildingfloor/delete.do',
    ajaxFloorSave: local + '/operation/buildingfloor/save.do',
    ajaxFloorByPage: local + '/buildingfloor/getByPage.do',
    ajaxFloorStatus: local + '/operation/buildingfloor/status.do',
    ajaxFloorById: local + '/buildingfloor/getAllByBuildingId.do',
    // 自定义类别
    ajaxCategoryByPage: local + '/operation/smallCategory/getByPage.do',
    ajaxCategoryEdit: local + '/operation/smallCategory/saveSmallCategory.do',
    ajaxCategorySec: local + '/operation/smallCategoryChild/getByPage.do',
    ajaxCategorySecEdit: local + '/operation/smallCategoryChild/saveSmallCategoryChild.do',
    ajaxCategoryOperationCategory1: local + '/operation/category/getAll.do',
    ajaxCategoryOperationCategory2: local + '/operation/category/getChildren.do',
    ajaxCategoryOperateStatus1: local + '/operation/smallCategory/enable.do',
    ajaxCategoryOperateStatus2: local + '/operation/smallCategoryChild/enable.do',
    ajaxOperateSkuByPage: local + '/operation/sku/getSkuByPage.do',
    ajaxOperateSkuSave: local + '/operation/sku/saveSku.do',
    ajaxOperateSkuStatus: local + '/operation/sku/skuEnable.do',
    // 财务相关
    ajaxOperateWithdrawListByPage: finance + '/operation/withdraw/getPage.do',
    ajaxOperateSetWithdrawStatus: finance + '/operation/withdraw/audit.do',
    ajaxWithdrawSettingSave: local + '/operation/withdrawConfig/save.do',
    ajaxWithdrawSettingByPage: local + '/operation/withdrawConfig/getList.do',
    ajaxOperateGetVerifyTime: finance + '/operation/paybinding/getCheckNum.do',
    ajaxOperateSetVerifyTime: finance + '/operation/sys/getSysCheckNum.do',
    ajaxOperationExport: finance + '/operation/withdraw/exportExcel.do',
    ajaxOperateUpdateRemark: finance + '/operation/withdraw/updateOperateDesc.do',
    // 物流相关
    ajaxLogisticsByPage: local + '/operation/express/getPage.do',
    ajaxLogisticsEnable: local + '/operation/express/enable.do',
    ajaxLogisticsSave: local + '/operation/express/save.do',
    // 创建运营账户
    ajaxOperationAccountByPage: local + '/operation/user/getOperateUserPage.do',
    ajaxOperationAccountEnable: local + '/operation/user/enable.do',
    ajaxOperationSave: local + '/operation/user/saveOperateUser.do',
    // 收费标准
    ajaxGetChargeStandard: finance + '/rule.do',
    ajaxChargeStandardSave: finance + '/operation/rule/save.do',
    // banner相关
    ajaxDelBanner: local + '/operation/sysBanner/delBannerList.do',
    ajaxGetBannerByPage: local + '/operation/sysBanner/getPage.do',
    ajaxEitBanner: local + '/operation/sysBanner/saveOrUpdate.do',
    ajaxFilterShop: local + '/operation/sysBanner/getAllStall.do',
    ajaxMoveBanner: local + '/operation/sysBanner/moveBanner.do',
    ajaxBannerSetToTop: local + '/operation/sysBanner/topBanner.do',
    ajaxBannerDetail: local + '/operation/sysBanner/getBannerDetail.do',
    ajaxBannerGoods:local + '/operation/sysBanner/getProductListByStall.do',
    // 排行推荐管理
    ajaxAllFilterGood: local + '/operation/product/getBoutiquePage.do',
    ajaxSetSuperiorGoodToShow: local + '/operation/product/updateBatchBoutique.do',
    ajaxSetSuperiorGoodToTop: local + '/operation/product/topBoutique.do',
    ajaxSuperiorStall: local + '/operation/stall/getExcellentPage.do',
    ajaxRecommendStall: local + '/operation/stall/updateBatchExcellent.do',
    ajaxSetStallTop: local + '/operation/stall/topStallExcellent.do',
    ajaxSingleGoodByPage: local + '/operation/product/getSingleProductPage.do',
    ajaxSingleGoodSetTop: local + '/operation/product/topSingle.do',
    ajaxRecommendSingleGood: local + '/operation/product/updateBatchSingle.do',
    ajaxGetHomePageRecommendByPage: local + '/operation/product/getIsHomePage.do',
    ajaxHomePageRecommendSetTop: local + '/operation/product/topIsHomePage.do',
    ajaxRecommendHomePage: local + '/stall/product/updateBatchIsHomePage.do',
    ajaxOperationTailGoodsByPage: local + '/product/getTailHandleProducts.do',
    ajaxOperationTailGoodsSetTop: local + '/operation/product/topTailHandle.do',
    ajaxOperationTailGoodsApplyPass: local + '/operation/product/batchCheckedTailHandle.do',
    ajaxOperationTailGoodsDel: local + '/operation/product/batchDelTailHandle.do',
    ajaxOperationTailRuleSave: local + '/operation/product/setTailHandleRule.do',
    ajaxOperationTailRuleGet: local + '/operation/product/tailHandleRule.do',
    // 订单管理
    ajaxOperationOrderByPage: local + '/operation/order/getOrderByPage.do',
    ajaxOperationOrderGetDetail: local + '/operation/order/getByOrderCode.do',
    ajaxOperationOrderExport: local + '/operation/order/exportExcelOrderData.do',
    ajaxOperationOrderExportQuery: local + '/operation/order/queryExcelOrderData.do',
    ajaxOptimizeExportExcel: exportExcel + '/operation/order/exportExcelOrderData.do',
    // 权限分配
    ajaxOperationRoleSave: local + '/operation/role/save.do',
    ajaxOperationRoleGetAll: local + '/operation/role/getAll.do',
    ajaxOperationRoleByPage: local + '/operation/role/getByPage.do'
}
