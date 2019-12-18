<template>
	<section class="app-container" id="order_list">
    <div v-show="!secShow">
      <a id="tag" href="" download=""></a>
      <!--查询条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters" @submit.native.prevent>
          <el-form-item label="订单号">
            <el-input v-model="filters.orderCode" placeholder="订单号"></el-input>
          </el-form-item>
          <el-form-item label="客户名">
            <el-input v-model="filters.customerName" placeholder="客户名"></el-input>
          </el-form-item>
          <el-form-item label="档口名称">
            <el-input v-model="filters.stallName" placeholder="档口名称"></el-input>
          </el-form-item>
          <el-form-item label="开单时间">
            <date-pick ref="dateFilter" isLimit :maxDays="dateMaxDays" isAccurate
              size="mini" defaultIndex="1" :showArr="['today', 'yesterday', 'last30']"></date-pick>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryData">查询</el-button>
            <el-button type="text" @click="clearSearch">清空筛选条件</el-button>
            <el-button type="danger" @click="downloadExcel">导出查询结果</el-button>
          </el-form-item>
        </el-form>
        <filter-list key="0" title="客户类型" size="mini" :filterList="customerTypes" style="margin-bottom:0" @filterChange="queryData" ref="customerTypes"></filter-list>
        <filter-list key="1" title="订单类型" size="mini" :filterList="orderTypeList" style="margin-bottom:0" @filterChange="orderTypeChange" ref="orderTypeList"></filter-list>
        <filter-list key="2" title="结算类型" size="mini" style="margin-bottom:0" :filterList="allSettleType" @filterChange="queryData" ref="allSettleType"></filter-list>
        <filter-list key="3" title="配送方式" size="mini" style="margin-bottom:0" :filterList="distributionTypes" @filterChange="queryData" ref="distributionTypes"></filter-list>
        <filter-list key="4" title="订单状态" size="mini" :filterList="statusList" style="margin-bottom:0" @filterChange="queryData" ref="statusList"></filter-list>
      </el-col>

      <!--表格-->
      <record-count :total="total"></record-count>
      <el-table :data="users" highlight-current-row v-loading="loading" style="width: 100%;">
        <el-table-column :key="Math.random()" prop="stallName" label="档口名称">
        </el-table-column>
        <el-table-column :key="Math.random()" prop="orderCode" label="订单编号" min-width="110px">
        </el-table-column>
        <el-table-column :key="Math.random()" prop="createTime" width="100px" label="开单时间" :formatter="formatCreateTime">
        </el-table-column>
        <el-table-column :key="Math.random()" prop="orderType" label="订单类型" :formatter="formatOrderType">
          <template slot-scope="scope">
            <span :class="[formatOrderType(scope.row, true)]">{{formatOrderType(scope.row)}}</span>
          </template>
        </el-table-column>
        <el-table-column :key="Math.random()" prop="customerName" label="客户名">
          <template slot-scope="scope">
            {{scope.row.customerName || '散客'}}
          </template>
        </el-table-column>
        <el-table-column :key="Math.random()" prop="settleType" label="结算类型" :formatter="formatSettleType">
        </el-table-column>
        <el-table-column :key="Math.random()" prop="distributionType" label="配送方式" :formatter="formatDelivery">
        </el-table-column>
        <el-table-column :key="Math.random()" prop="actualFee" label="订单金额(元)">
          <template slot-scope="scope">
            <span :class="[scope.row.orderType === 2 && 'err_color']">{{scope.row.actualFee}}</span>
          </template>
        </el-table-column>
        <el-table-column :key="Math.random()" prop="status" label="订单状态">
          <template slot-scope="scope">
            <span :class="formatStatus(scope.row, true)">{{formatStatus(scope.row)}}</span>
          </template>
        </el-table-column>
        <!-- 销售补货订单 -->
        <el-table-column label="操作" :width="processWidth" fixed="right">
          <template slot-scope="scope">
            <div class="process_td">
              <el-button type="primary" plain size="small" @click="getDetail(scope.row)">查看</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--工具条-->
      <div class="page_toolbar">
        <el-pagination layout="prev, pager, next, jumper" prev-text="上一页" next-text="下一页" background 
          @current-change="handleCurrentChange" :page-size="pageSize" :current-page="pageNum" :total="total">
        </el-pagination>
      </div>
    </div>
    <Secondary :title="formatOrderType(details)" v-model="secShow">
      <OrderDetail :details="details" @showDrawerDetail="showDrawerDetail" v-if="secShow"></OrderDetail>
    </Secondary>
    <Drawer v-model="showDrawer" title="订单详情" width="800px">
      <OrderDetail :details="drawerDetail"></OrderDetail>
    </Drawer>
	</section>
</template>
<script>
import OrderDetail from './orderDetail'
const maxDays = 31
export default {
  data() {
    return {
      orderType: null,
      dateMaxDays: 366,
      isShowHangupOrder: false,
      processWidth: 80,
      showDrawer:false,
      loading: false,
      drawerDetail: {},
      placeholder: '',
      settleStatusList: [
        {label: '未结算', value: 0},
        {label: '已结算', value: 1},
      ],
      secShow: false,
      filters: {
        orderCode: '',
        customerName: '',
        stallName: ''
      },
      users: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      ids: [],
      details: {},
      // 正在操作的row
      curRow: {},
      // 弹框 设置未出货为出货
      // outSendConfirm: false,
      // outSendVisible: false,
      // 弹窗 设置未发货为发货
      shipVisible: false,
      // 物流公司
      shipForm: {
        expressCode: '',
        expressNo: ''
      },
      settleConfirm: false,
      logistics: [],
      shipFormRules: {
        expressCode: [{ required: true, validator: this.noEmpty, message: '请选择物流公司', trigger: 'blur'}],
        expressNo: [{ required: true, validator: this.noEmpty, message: '请输入快递单号', trigger: 'blur'}]
      },
      // 未结算弹窗
      // settleVisible: false,
      settleForm: {
        settleAmount: ''
      },
      settleFormRules: {
        settleAmount: [{ validator: this.mustNumber, message: '必须为数字', trigger: 'blur'}]
      },
      settleStatus: -1,
      settleType: null,
      filterNum: {
        unSettleCoun: '',
        unStockCount: '',
        unOutCount: '',
        unDistribeCount: '',
        unSignCount: '',
      },
      // 1, 平台存在用户；2，手机号开单，待注册用户；3.散客; 4.VIP客户
      customerTypes: [
        {name: '全部', filterVal: {}},
        {name: 'VIP客户', filterVal: {customerType: 4}},
        {name: '平台客户', filterVal: {customerType: 1}}
      ],
      orderTypeList: [
        {name: '全部', filterVal: {}},
        {name: '销售单', filterVal: {orderType: 1}},
        {name: '退货单', filterVal: {orderType: 2}}
      ],
      statusList: [
        {name: '全部', filterVal: {}},
        {name: '待确认', filterVal: {status: 0}}, // , num: 0
        {name: '待付款', filterVal: {status: 3}}, // , num: 0
        {name: '待发货', filterVal: {status: 5}}, // , num: 0
        {name: '待出货', filterVal: {status: 4}}, // , num: 0
        {name: '待签收', filterVal: {status: 6}}, // , num: 0
        {name: '交易完成', filterVal: {status: 7}},
        {name: '交易关闭-档口退单', filterVal: {status: 8}},
        {name: '交易关闭-支付超时', filterVal: {status: 9}},
        {name: '交易关闭-退货作废', filterVal: {status: 10}},
        {name: '订单驳回', filterVal: {status: 2}}
      ],
      allSettleType: [
        {name: '全部', filterVal: {settleType: ''}},
        {name: '现结', filterVal: {settleType: 1}},
        {name: '挂账', filterVal: {settleType: 2}},
        {name: '赊账', filterVal: {settleType: 3}}
      ],
      // distributionType 1，自提；2，现取；3，物流
      distributionTypes: [
        {name: '全部', filterVal: {}},
        {name: '自提', filterVal: {distributionType: 1}},
        {name: '现取', filterVal: {distributionType: 2}},
        {name: '物流', filterVal: {distributionType: 3}}
      ]
    }
  },
  mounted() {
    this.getUsers(true)
    // this.getFiltersNum()
    this.queryData = this._debounce(this.queryData)
    this.remindCustomerFn = this._debounce(this.remindCustomerFn)
  },
  components: {OrderDetail},
  methods: {
    orderTypeChange() {
      this.$nextTick(() => {
        this.orderType = this.$refs.orderTypeList.getParams() && this.$refs.orderTypeList.getParams().orderType
        this.queryData()
      })
    },
    // 是否可以退单
    isAvailRetreat(row) {
      return this._isWithout(row.orderType, [1]) && (this._isHave(row.status, [0,3,4,5]) || (row.status === 7 && row.distributionType === 2))
    },
    getLogisticsCom(logisticsNo) {
      if (!this._isHasVal(logisticsNo)) return false
      this.$postJson(this._basePath.ajaxLogisticsCom, {expressNo: logisticsNo}).then(res => {
        if (res.success) {
          this.logistics = res.data
        }
      })
    },
    showDrawerDetail(row) {
      this.getDetail(row, true)
    },
    // 获取订单详情
    getDetail(row, isDrawer) {
      this.$postJson(this._basePath.ajaxOperationOrderGetDetail, {orderCode: row.orderCode}).then((res) => {
        if (res.success) {
          if (!isDrawer) {
            this.details = res.data || {}
          } else {
            this.showDrawer = true
            this.drawerDetail = res.data || {}
          }
          this.secShow = true
        }
      })
    },
    downFile (content, fileName) {
      var a = document.getElementById('tag')
      a.download = fileName
      var blob = new Blob([content])
      var url = window.URL.createObjectURL(blob)
      a.href = content
      a.click()
      window.URL.revokeObjectURL(url)
    },
    // 导出查询结果
    downloadExcel() {
      this.dateMaxDays = 92
      this.$nextTick(() => {
        const arr = this.$refs.dateFilter.getParams()
        if (!arr) return false
        const customerType = this.$refs['customerTypes'] && this.$refs['customerTypes'].getParams()
        const allSettleType = this.$refs['allSettleType'] && this.$refs['allSettleType'].getParams()
        const statusObj = this.$refs['statusList'] && this.$refs['statusList'].getParams()
        const distributionTypes = this.$refs['distributionTypes'] && this.$refs['distributionTypes'].getParams()
        let param = {
          orderType: this.orderType
        }
        param = {...{}, ...this.filters, ...param, ...allSettleType, ...customerType, ...statusObj, ...distributionTypes}
        param.startTime = arr[0]
        param.endTime = arr[1]
        this.$postJson(this._basePath.ajaxOperationOrderExportQuery, param).then(res => {
          if (res.success) {
            param.token = res.data.token
            this.downFile(this._basePath.ajaxOptimizeExportExcel + '?' +  this.serializeParam(param), res.data.fileName)
          }
        })
      })
    },
    formatStatus(row, isClass) {
      // 订单状态：-1, 订单异常 0，未确认；1，进行中（已确认）；2，驳回；3，待付款；4，待出货（自提单才有）；" 
      // "5，待发货（物流单才有）；6，待签收（物流单才有）；7，交易完成；8，交易关闭（档口退单） 9，交易关闭（支付超时）; 10,交易关闭（作废关闭）
      const status = row.status
      if (isClass) {
        return (status === -1 ? 'warn_color' : status === 0 ? 'warn_color' : status === 1 ? '' : status === 2 ? 'err_color' 
        : status === 3 ? '' : status === 4 ? 'text_color' : status === 5 ? 'text_color'
        : status === 6 ? '' : status === 7 ? 'success_color' : status === 8 ? 'err_color' : status === 9 ? 'err_color' : status === 10 ? 'err_color' : '—')
      }

      return (status === -1 ? '订单异常' : status === 0 ? '待确认' : status === 1 ? '已确认' : status === 2 ? '订单驳回' 
        : status === 3 ? '待付款' : status === 4 ? '待出货' : status === 5 ? '待发货' 
        : status === 6 ? '待签收' : status === 7 ? '交易完成' : status === 8 ? '交易关闭-档口退单' : status === 9 ? '交易关闭-支付超时' : status === 10 ? '交易关闭-退货作废' : '—')
    },
    formatReturnType(row) {
      // 1 线上退款 2 线下退款
      const returnType = row.returnType
      return returnType === 1 ? '账户余额退款' : returnType === 2 ? '线下退款' : '—'
    },
    formatDelivery(val) {
      if (this._isHave(val.customerType, [1,2]) && val.orderType === 2) return '—'
      // 配送方式 1，自提；2，现取；3，物流
      return val.distributionType === 1 ? '自提' : val.distributionType === 2 ? '现取' : val.distributionType === 3 ? '物流' : '—'
    },
    formatDistributionStatus(row, isClass) {
      const status = row.distributionStatus
      if (isClass) return status === 1 ? 'text_color' : status === 2 ? 'text_color' : status === 3 ? "err_color" : ''
      // 1，未出货、2，未发货、3，待签收、4，已签收
      return status === 1 ? '未出货' : status === 2 ? '未发货' : status === 3 ? "待签收" : status === 4 ? '已签收' : '—'
    },
    formatPayWay(row) {
      const val = row.payType
      // 支付方式：0--未选择，1--现金，2--微信，3--支付宝，4--赊账
      return val === 0 ? '未选择' : val === 1 ? '现金' : val === 2 ? '微信' : val === 3 ? '支付宝' : '—'
    },
    formatStockStatus(row, isClass) {
      // 0--无 1--未备货，2 已备货
      const val = row.stockStatus
      if (isClass && (val === 2)) return 'success_color'
      return val === 0 ? '无' : val === 1 ? '未备货' : val === 2 ? '已备货' : '—'
    },
    formatCreateTime(val) {
      return this.$dateFns.format(val.createTime, 'YYYY-MM-DD HH:mm:ss')
    },
    formatOrderType(val, isClass) {
      // 订单类型 1，销售订单；2，补货单；3，退货单 4 零售单
      if (isClass && val.orderType === 2) return 'err_color'
      return val.orderType === 1 ? '销售单' : val.orderType === 2 ?  '退货单' : ''
    },
    formatSettleType(val) {
      const settleType = val.settleType
      if (this._isHave(val.customerType, [1,2]) && val.orderType === 2) return '—'
      // 结算类型：1 现结；2 挂账; 3 赊账；4--周结，5--月结，6--季结， 7--无
      // return status === 1 ? '现结' : status === 2 ? '跳过' : status === 3 ? '赊账' : status === 4 ? '周结' : status === 5 ? '月结' : status === 6 ? '季结' : '——'
      return settleType === 1 ? '现结' : settleType === 2 ? '挂账' : settleType === 3 ? '赊账' : '—'
    },
    formatCustomerName(row) {
      const name = row.customerName
      const type = row.customerType
      // 1, 平台存在用户；2，手机号开单，待注册用户；3.散客; 4.VIP客户
      return type === 1 ? row.customerName : type === 3 ? '散客' : '—'
    },
    formatSettleStatus(row, isClass) {
      // 0未结算; 1 已结算 
      const status = row.settleStatus
      if (isClass) return status === 0 ? 'text_color cursor' : ''
      return status === 0 ? '未结算' : '已结算'
    },
    formatBool(row, column) {
      return row.isShow === true ? '是' : '否'
    },
    queryData(filterData) {
      if (filterData && filterData.hasOwnProperty('settleType')) {
        this.isShowHangupOrder = filterData.settleType === 2 
      }
      this.pageNum = 1
      this.getUsers(true)
    },
    // 设置订单状态
    setShipmentStatus(row, bool) {
      this.curRow = row
      this.shipVisible = true
      // bool && (this.outSendVisible = true)
      if (!bool) {
        this.$nextTick(() => {
          this.$refs.shipForm.resetFields()
        })
      }
    },
    // 页脚显示转换
    handleCurrentChange(val) {
      this.pageNum = val
      this.getUsers()
    },
    clearSearch() {
      this.filters = {
        orderCode: '',
        customerName: '',
        stallName: ''
      }
    },
    // 获取用户列表
    getUsers(isRefreshCount) {
      let para = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      this.dateMaxDays = 366
      this.$nextTick(() => {
        const timeArr = this.$refs['dateFilter'] && this.$refs['dateFilter'].getParams()
        if (!timeArr) return false
        para.orderType = this.orderType
        const statusList = this.$refs['statusList'] && this.$refs['statusList'].getParams()
        const customerType = this.$refs['customerTypes'] && this.$refs['customerTypes'].getParams()
        const allSettleType = this.$refs['allSettleType'] && this.$refs['allSettleType'].getParams()
        const distributionTypes = this.$refs['distributionTypes'] && this.$refs['distributionTypes'].getParams()
        this.$set(this.filters, 'startTime', timeArr[0])
        this.$set(this.filters, 'endTime', timeArr[1])
        para = {...para, ...this.filters, ...allSettleType, ...statusList, ...distributionTypes, ...customerType}
        this.loading = true
        this.$postJson(this._basePath.ajaxOperationOrderByPage, para).then(res => {
          this.loading = false
          if (res.success) {
            this.total = res.data ? res.data.count : 0
            this.users = res.data ? res.data.datas : []
          }
        })
      })
    }
  }
}
</script>

<style lang="stylus">
  @import '~@/assets/css/index';
  #order_list
    .in_debt
      center()
      bold()
      mt(20px)
    .settle_h3
      line-height:20px
    .confirm_checkbox
      margin:20px 0
    .process_td
      .el-button
        margin:3px
    .big_btn
      display:block
      label
        margin:10px
        display:block
        .el-radio-button__inner
          display:block
          radius(4px)
          ml(-1px)
          border-left:1px solid #dcdfe6
        &.is-active
          .el-radio-button__inner
            border-left:0
</style>