<template>
    <div id="order_detail">
      <ul class="big_part fn12">
        <li class="long_part unique_li">
          <i class="order_category" :class="formatStatus(true)">【{{formatStatus()}}】</i>
          <div class="detail_name" v-if="details.oldOrderCode">
            <span class="icon yellow_color">&#xe628;</span>
            <span>原销售单号: <i class="cursor" @click="showDrawerDetail">{{details.oldOrderCode}}</i></span>
          </div>
          <div class="detail_name">
            <span class="icon yellow_color">&#xe628;</span>
            <span>
              <template>订单编号:</template>
              &nbsp;&nbsp;<span> {{details.orderCode}}</span>
            </span>
          </div>
          <div class="detail_info">
            <ul class="basic_info">
              <li class="block_li">
                <span>客户名:&nbsp;&nbsp;</span><i class="bold fn14">{{formatCustomerName()}}</i>
              </li>
              <li class="block_li" v-if="details.customerType !== 3">
                <span>手机号:&nbsp;&nbsp;</span><i class="bold fn14">{{details.customerPhone}}</i>
              </li>
              <li class="block_li bold">
                <span>创建时间:&nbsp;&nbsp;</span><i class="bold">{{_formatTime(details.createTime, true)}}</i>
              </li>
              <li class="block_li bold" v-if="_isHave(details.status, [7])">
                <span>完成时间:&nbsp;&nbsp;</span><i>{{_formatTime(details.finalTime, true)}}</i>
              </li>
              <li class="block_li bold" v-if="_isHave(details.status, [2,8,9,10])">
                <span>关闭时间:&nbsp;&nbsp;</span><i>{{_formatTime(details.finalTime, true)}}</i>
              </li>
              <!-- <li class="block_li bold" v-if="_isHave(details.status, [2])">
                <span>驳回时间:&nbsp;&nbsp;</span><i>{{_formatTime(details.finalTime, true)}}</i>
              </li> -->
            </ul>
            <ul class="logistics_status column_ul">
              <li class="fn14" v-if="_isHave(details.orderType, [1])">
                <span>配送方式</span>
                <i :class="formatDelivery(true)" class="err_color fn20 bold">{{formatDelivery()}}</i>
              </li>
              <!-- <li>
                <span>出货状态</span>
                <i :class="formatDistributionStatus(true)">{{formatDistributionStatus(false)}}</i>
              </li> -->
              <li v-if="_isHave(details.orderType, [2]) && _isWithout(details.customerType, [3,4])" class="fn14">
                <span>退款方式</span>
                <i  class="err_color fn20 bold">{{formatReturnType(details.returnType)}}</i>
              </li>
            </ul>
          </div>
        </li>
        <li class="short_part">
          <p class="detail_title" v-if="details.orderType === 1">取货码</p>
          <p class="detail_title" v-else>退货码</p>
          <div class="detail_info we_code">
            <span class="fn12">{{details.fetchCode}}</span>
            <img :src="details.orderDetailVo && details.orderDetailVo.qrCodeUrl"/>
          </div>
        </li>
        <li class="long_part higher_li">
          <template v-if="_isWithout(details.customerType, [3,4]) && details.orderType === 2">
            <p class="detail_title">退货信息</p>
            <div class="detail_info sum_all">
              <div class="sum_wrap">
                <div class="good_tip">
                  <i>退</i>
                </div>
                <ul class="order_sum">
                  <li>
                    <span>退货数量: </span>
                    <i class="err_color">{{-details.returnTotalNum || 0}}</i>
                  </li>
                  <li>
                    <span>退货金额(元): </span>
                    <i class="err_color">{{details.returnAmount ? '-' + _toFixed(details.returnAmount) : 0}}</i>
                  </li>
                </ul>
              </div>
            </div>
            <p class="detail_title"></p>
            <div class="detail_info">
              <ul class="order_sum">
                <li>
                  <span>最大可退金额(元): </span>
                  <i class="err_color">{{details.originalFee ? -(_toFixed(details.originalFee)) : 0}}</i>
                </li>
                <li>
                  <span>
                    <el-tooltip class="item" effect="dark" content="给客户开退货单后向客户退款时，如果客户欠款，则退给客户的钱需扣除客户的欠款"
                     :open-delay="300" placement="top-start">
                      <span class="icon light_color tips">&#xe657;</span>
                    </el-tooltip>
                    扣除欠款(元): 
                  </span>
                  <i class="err_color">{{details.reduceDebt}}</i>
                </li>
                <li>
                  <span>实际可退金额(元): </span>
                  <i class="err_color">{{details.shouldFee ? -(_toFixed(details.shouldFee)) : 0}}</i>
                </li>
                <li>
                  <span>实退金额(元): </span>
                  <i class="err_color">{{_toFixed(details.actualFee)}}</i>
                </li>
              </ul>
            </div>
          </template>
          <template v-else>
            <p class="detail_title">订单总计</p>
            <div class="detail_info sum_all">
              <div class="sum_wrap" v-if="details.orderType === 1">
                <div class="good_tip green">
                  <i>销</i>
                </div>
                <ul class="order_sum">
                  <!--开退货单时原单信息-->
                  <li>
                    <span>销售数量: </span>
                    <i class="err_color">{{details.totalNum}}</i>
                  </li>
                  <li>
                    <span>销售金额(元): </span>
                    <i class="err_color">{{_toFixed(details.salesAmount)}}</i>
                  </li>
                </ul>
              </div>
              <div class="sum_wrap" v-if="(details.orderType === 2 && _isHave(details.customerType, [3,4]) || details.returnTotalNum)">
                <div class="good_tip">
                  <i>退</i>
                </div>
                <ul class="order_sum">
                  <li>
                    <span>退货数量: </span>
                    <i class="err_color">{{-details.returnTotalNum || 0}}</i>
                  </li>
                  <li>
                    <span>退货金额(元): </span>
                    <i class="err_color">{{details.returnAmount ? '-' + _toFixed(details.returnAmount) : 0}}</i>
                  </li>
                </ul>
              </div>
              <div class="sum_wrap">
                <ul class="order_sum sum_total">
                  <li v-if="details.expressFee">
                    <span>运费(元): </span>
                    <i class="err_color">{{_toFixed(details.expressFee)}}</i>
                  </li>
                  <li>
                    <span>减钱{{_isHasVal(details.reduceReason) ? ('-' + details.reduceReason) : ''}}(元): </span>
                    <i class="err_color">{{details.reduceFee ? '-' + _toFixed(details.reduceFee) : '—'}}</i>
                  </li>
                  <li v-if="!(_isWithout(details.customerType, [3,4]) && details.orderType === 2)">
                    <span>加钱{{_isHasVal(details.addReason) ? ('-' + details.addReason) : ''}}(元): </span>
                    <i class="err_color">{{_toFixed(details.addFee) || '—'}}</i>
                  </li>
                  <li>
                    <span>应收金额(元): </span>
                    <i class="err_color">{{_toFixed(details.shouldFee)}}</i>
                  </li>
                </ul>
              </div>
              <div class="sum_wrap">
                <ul class="order_sum sum_total">
                  <li>
                    <span>结算类型: </span>
                    <i>{{formatSettleType()}}</i>
                  </li>
                  <li>
                    <span>支付方式: </span>
                    <i>{{formatSettleWay()}}</i>
                  </li>
                  <li v-if="details.settleType === 1">
                    <span>支付时间: </span>
                    <i>{{details.settleType !== 1 ? '—' : 
                      ((details.orderType === 1 ? _formatTime(details.payTime, true) : _formatTime(details.createTime, true)) || '—')}}</i>
                  </li>
                </ul>
              </div>
            </div>
          </template>
        </li>
        <li class="short_part higher_li">
          <p class="detail_title">整单备注</p>
          <div class="detail_info with_textarea">
            <p class="remarks" v-html="details.orderDetailVo && details.orderDetailVo.memo && details.orderDetailVo.memo.replace(/\n/g, '<br>')"></p>
            <!-- <el-input type="textarea" disabled :value="details.orderDetailVo && details.orderDetailVo.memo"></el-input> -->
          </div>
        </li>
        <li class="long_part higher_li" style="width:100%; height:auto">
          <template v-if="details.distributionType === 3 && details.customerType !== 3">
            <!--物流点信息-->
            <p class="detail_title">发货/出货信息</p>
            <div class="detail_info">
              <ul class="settle_info logistic_info">
                <li>
                  <span>联系人: </span>
                  <i>{{details.orderDetailVo && details.orderDetailVo.receiverName}}</i>
                </li>
                <li>
                  <span>手机号: </span>
                  <i>{{details.orderDetailVo && details.orderDetailVo.receiverPhone}}</i>
                </li>
                <li class="big_li">
                  <span>收货地址: </span>
                  <i>{{details.orderDetailVo && details.orderDetailVo.distributionAddress}}</i>
                </li>
              </ul>
            </div>
          </template>
          <template v-if="details.distributionType === 2 && _isHave(details.customerType, [3,4])">
            <!--现取单-->
            <p class="detail_title">发货/出货信息</p>
            <div class="detail_info">
              <ul class="settle_info logistic_info">
                <li>
                  <span></span>
                  <i>现取订单1小时后不可退单</i>
                </li>
              </ul>
            </div>
          </template>
          <!--物流信息-->
          <template v-if="details.distributionType === 3 && _isHave(details.status, [6, 7])">
            <p class="detail_title">物流跟踪</p>
            <div class="detail_info logistic_detail" v-if="details.orderDetailVo && deliveryArr && deliveryArr.length">
              <div>
                <div class="set_start fn14" style="margin-bottom:20px">
                  <h3>快递公司: {{details.orderDetailVo && details.orderDetailVo.expressName}}</h3>&nbsp;&nbsp;&nbsp;&nbsp;
                  <h3>快递单号: {{details.orderDetailVo && details.orderDetailVo.expressNo}}</h3>
                </div>
                <el-steps direction="vertical" :active="1" :space="40">
                  <el-step v-for="(item, index) in deliveryArr" :description="item.AcceptTime + ' —— ' + item.AcceptStation" :key="index">
                  </el-step>
                </el-steps>
              </div>
            </div>
            <div v-else class="no_delivery_data">暂无物流信息</div>
          </template>
          <!--自提点信息-->
          <template v-if="details.distributionType === 1">
            <p class="detail_title">自提点</p>
            <div class="detail_info">
              <ul class="settle_info logistic_info">
                <li style="width:29%">
                  <span>店铺名称: </span>
                  <i>{{details.stall ? details.stall.name : '—'}}</i>
                </li>
                <li style="width:20%">
                  <span>备货状态: </span>
                  <i>{{formatStockStatus(details.stockStatus)}}</i>
                </li>
                <li style="width:49%">
                  <span>自提地址: </span>
                  <i style="line-height:16px">{{details.stall ? details.stall.location : '—'}}
                  </i>
                </li>
              </ul>
            </div>
          </template>
        </li>
      </ul>
      <el-table class="pad10 outside_table" :data="goodsData" @expand-change="expandChange">
        <el-table-column type="expand" v-if="details.mode === 2">
          <template slot-scope="scope">
            <el-table :data="transformData(scope.row)" border class="inner_table">
              <el-table-column label="" prop="color"></el-table-column>
              <el-table-column v-for="(item, index) in sizeSet" :label="item" :key="index" :prop="item"></el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="商品图片">
          <template slot-scope="scope">
            <img :src="scope.row.imgUrl_main" height="50px" width="50px">
          </template>
        </el-table-column>
        <el-table-column prop="productCode" label="商品货号">
          <template slot-scope="scope">
            <span>{{scope.row.productCode}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="商品标题">
          <template slot-scope="scope">
            <span>{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <template v-if="details.orderType !== 2 || (details.customerType !== 1)">
          <el-table-column prop="unitPrice" label="原价（元）">
            <template slot-scope="scope">
              <span class="err_color line_through">{{scope.row.unitPrice}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="realUnitPrice" label="折后价（元）">
            <template slot-scope="scope">
              <span class="err_color">{{scope.row.realUnitPrice}}</span>
            </template>
          </el-table-column>
        </template>
        <el-table-column prop="orderNum" label="数量"></el-table-column>
        <el-table-column prop="totalFee" label="总价（元）" style="position:relative">
          <template slot-scope="scope">
            <span>{{scope.row.totalFee}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="memo" label="单品备注">
          <template slot-scope="scope">
            <div style="padding-right:10px" v-html="scope.row.memo && scope.row.memo.replace(/\n/g, '<br>')"></div>
            <div class="good_tip" v-if="_isHave(scope.row.logo, [1, -1]) || details.returnTotalNum" :class="[_isHave(scope.row.logo, [0,1]) && details.returnTotalNum ? 'green' : '']">
              <i v-if="scope.row.logo === 0">销</i>
              <i v-if="scope.row.logo === -1">退</i>
              <i v-if="scope.row.logo === 1">补</i>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </template>
  <script>
    // mode  1.spu开单模式  2.sku开单模式
    import logistics from '@/utils/logistics'
    export default {
      name: 'order_detail',
      data() {
        return {
          goodsData: [],
          deliveryArr: [],
          shipItem: ''
        }
      },
      props: {
        details: {
          type: Object,
          default: () => {}
        }
      },
      created() {
        if (this.details.returnTotalNum) {
          let arr1 = this.details.productList.filter(item => item.logo === 0)
          let arr2 = this.details.productList.filter(item => item.logo === -1)
          this.goodsData = arr1.concat(arr2)
        } else {
          this.goodsData = this.details.productList
        }
        
        this.$bus.$emit('calcScrollHeight')
        this.init()
      },
      methods: {
        init() {
          if (this.details.orderDetailVo && this.details.orderDetailVo.expressInfo) {
            const obj = this.details.orderDetailVo.expressInfo
            this.shipItem = logistics.filter(item => item.initials === obj.ShipperCode)
            let arr = []
            for (let i = obj.Traces.length - 1; i >= 0; i--) {
              arr.push(obj.Traces[i])
            }
            this.deliveryArr = arr
          }
        },
        strToArr(str) {
          if (str) {
            const arr = str.split(/,|，/g)
            return arr.filter(item => item)
          }
          return []
        },
        expandChange() {
          this.$bus.$emit('calcScrollHeight')
        },
        showDrawerDetail() {
          this.$emit('showDrawerDetail', {orderCode: this.details.oldOrderCode})
        },
        formatCustomerName() {
          const type = this.details.customerType
          return type === 3 ? '散客' : this.details.customerName ? this.details.customerName : '—'
        },
        formatActualFee() {
          if (this.details.settleType === 2 || this.details.settleType === 6) return '—'
          return this.details.actualFee
        },
        formatConfirmStatus(val) {
          // 用户确认状态 ： 0，未确认；1，已确认
          return val === 0 ? '未确认' : val === 1 ? '已确认' : '—'
        },
        formatReturnType(val) {
          // 退货方式 1 线上退款 2 线下退款
          return val === 1 ? '线上退款' : val === 2 ? '线下退款' : '—'
        },
        formatStatus(isClass) {
          // 订单状态：-1, 订单异常 0，未确认；1，进行中（已确认）；2，驳回；3，待付款；4，待出货（自提单才有）；" 
          // "5，待发货（物流单才有）；6，待签收（物流单才有）；7，交易完成；8，交易关闭（档口退单） 9，交易关闭（支付超时）; 10,交易关闭（作废关闭）
          const status = this.details.status
          if (isClass) {
            return (status === -1 ? 'warn_color' : status === 0 ? 'warn_color' : status === 1 ? '' : status === 2 ? 'err_color' 
            : status === 3 ? '' : status === 4 ? 'text_color' : status === 5 ? 'text_color'
            : status === 6 ? '' : status === 7 ? 'success_color' : status === 8 ? 'err_color' : status === 9 ? 'err_color' : status === 10 ? 'err_color' : '—')
          }
  
          return (status === -1 ? '订单异常' : status === 0 ? '待确认' : status === 1 ? '已确认' : status === 2 ? '订单驳回' 
            : status === 3 ? '待付款' : status === 4 ? '待出货' : status === 5 ? '待发货' 
            : status === 6 ? '待签收' : status === 7 ? '交易完成' : status === 8 ? '交易关闭-档口退单' : status === 9 ? '交易关闭-支付超时' : status === 10 ? '交易关闭-退货作废' : '—')
        },
        formatCustomerType() {
          // 1, 平台存在用户；2，手机号开单，待注册用户；3.散客; 4.VIP客户
          return this.details.customerType
        },
        formatStockStatus(val, isClass) {
          // 0--无 1--未备货，2 已备货
          if (isClass && (val === 0)) return 'text_color cursor'
          return val === 0 ? '无' : val === 1 ? '未备货' : '已备货'
        },
        transformData(arrObj) {
          let sizeTemArr = []
          let arr = []
          if (arrObj) {
            let colorArr = arrObj.colorSet.map(item => item.colorName)
            let sizeArr = arrObj.sizeSet.map(item => item.sizeName)
            let list = arrObj.colorSkuVoList.slice(0)
            list = this.sortByArr(list, colorArr, 'color')
            arr = list.map(item => {
              let obj = {}
              obj.color = item.color
              item.skuVoList.forEach(n => {
                !sizeTemArr.includes(n.size) && sizeTemArr.push(n.size)
              })
              item.skuVoList.forEach(i => {
                obj[i.size] = i.orderNum || ''
              })
              return obj
            })
            let arrs = []
            sizeArr.forEach(n => {
              sizeTemArr.includes(n) && arrs.push(n)
            })
            this.sizeSet = arrs
          }
          return arr
        },
        formatOrderType(val) {
          // 订单类型 1，销售订单；2，补货单；3，退货单 4 零售单
          // return val.orderType === 1 ? '销售订单' : val.orderType === 2 ? '补货单' :  val.orderType === 3 ? '退货单' : val.orderType === 4 ? '零售单' : val.orderType === 5 ? '快捷退货单' : 'VIP客户单'
        },
        formatDelivery() {
          // 配送方式 1，自提；2，现取；3，物流
          const type = this.details.distributionType
          if (this._isHave(this.details.customerType, [1,2]) && this.details.orderType === 2) return '—'
          return type === 1 ? '自提' : type === 2 ? '现取' : type === 3 ? '物流' : '——'
        },
        formatDistributionStatus(isClass) {
          const status = this.details.distributionStatus - 0
          if (isClass) return status === 1 ? 'warn_color' : status === 2 ? 'warn_color' : status === 3 ? "success_color" : status === 4 ? "success_color" : ''
          // 1 未出货， 2 未发货、3 已发货（扫码录入快递单号之后）、4 已签收（采购商／档口手动确认）（物流）
          return status === 1 ? '未出货' : status === 2 ? '未发货' : status === 3 ? "待签收" : status === 4 ? '已签收' : '—'
        },
        // 转换时间
        formatCreateTime(val) {
          return this.$dateFns.format(val.updateTime, 'YYYY-MM-DD')
        },
        // 转换结算状态
        formatSettleStatus(val) {
          // 0未结算; 1 已结算
          return val === 0 ? '未结算' : val === 1 ? '已结算' : '—'
        },
        // 转换结算类型
        formatSettleType() {
          const settleType = this.details.settleType
          if (this._isHave(this.details.customerType, [1,2]) && this.details.orderType === 2) return '—'
          // 1 现结；2 跳过; 3 赊账；4--周结，5--月结，6--季结
          // return status === 1 ? '现结' : status === 2 ? '跳过' : status === 3 ? '赊账' : status === 4 ? '赊账/周结' : status === 5 ? '赊账/月结' : status === 6 ? '赊账/季结' : '—'
          return settleType === 1 ? '现结' : settleType === 2 ? '挂账' : settleType === 3 ? '赊账' : '—'
        },
        // 转换支付方式
        formatSettleWay() {
          const val = this.details.payType
          if (this._isHave(this.details.settleType, [2,3])) return '—'
          // 支付方式：0--未选择，1--现金，2--微信，3--支付宝, 4--赊账，5--余额
          return val === 0 ? '—' : val === 1 ? '现金' : val === 2 ? '微信' : val === 3 ? '支付宝' : val === 4 ? '赊账' : val === 5 ? '余额' : '—'
        }
      }
    }
  </script>
  <style lang="stylus">
    @import '~@/assets/css/index'
    #order_detail
      .el-table__expand-icon
        .el-icon-arrow-right
          fn(18px)
          bold()
      .el-table td, .el-table th
        padding-bottom:20px
      .tips_ul
        absolute()
        bottom:0
        left:10px
        fn(10px)
        color(err_color)
        white-space:nowrap
        overflow:visible
      .good_tip
        position:absolute
        right:20px
        top:0
        height: 0px
        width: 0px
        border-right: 35px solid #D81E06
        border-bottom: 35px solid transparent
        &.green
          border-right: 35px solid success_color
        i
          position:absolute
          top:-1px
          left:20px
          fn(12px)
          color()
      .no_delivery_data
        padding:20px
      .big_part
        overflow hidden
        padding:5px
        >li
          relative()
          inline()
          boxShadow()
          height:200px
          mb(20px)
          &.higher_li
            height:280px
          .detail_title
            borb(1px solid #ddd)
            padding:20px
            bold()
            fn(14px)
          .detail_name
            bold()
            mt(10px)
            fn(14px)
            mb(10px)
            .yellow_color
              color(#FFAA00)
              mr(6px)
            i
              color(text_color)
              ml(10px)
          .order_category
            absolute()
            right:0
            top:0
            fn(16px)
            width:180px
            vertical(32px)
            border-bottom-left-radius:20px
            center()
            color()
            bgColor(#FFAA00)
            &.green
              bgColor(success_color)
            &.red
              bgColor(err_color)
          &.long_part
            fl()
            width:63%
          &.unique_li
            padding:20px
          &.short_part
            fr()
            width:35%
            border_()
          .logistic_detail
            padding:20px
          .detail_info
            setBetween()
            padl(25px)
            &.sum_all
              display:block
            .sum_wrap
              relative()
              ml(-25px)
              padding: 5px 25px
              .sum_total
                bort()
                line-height:20px
            .good_tip
              left:0px
              border: 0
              border-left: 30px solid #D81E06
              border-bottom: 30px solid transparent
              &.green
                border-left: 30px solid success_color
              i
                top:2px
                left:-28px
                fn(12px)
                color()
            .remarks
              margin:auto auto
              padding:20px
              fn(14px)
            .logistic_info
              overflow:hidden
              li
                fl()
                width:33%
                &.big_li
                  width:100%
            &.we_code
              padding:10px
              setColumn()
              img
                mt(5px)
                width:100px
                height:100px
            &.with_textarea
              height:calc(100% - 55px)
              padding:0
              .el-textarea
                padding:30px
                boxSizing()
                height:100%
                textarea
                  height:100%
            .basic_info
              flex:1
              padr(20px)
              fn(0)
              li
                inline()
                width:50%
                fn(14px)
                mb(10px)
                &.block_li
                  block()
                  line-height:20px
                  width:100%
            .column_ul
              width:30%
              setBetween()
              center()
              &.no_bottom
                li
                  mb(0)
              li
                flex:1
                mr(10px)
                setColumn()
                mb(20px)
                span
                  mb(10px)
                  display:block
            .order_sum
              width:100%
              overflow:hidden
              fn(0)
              li
                inline()
                margin:10px 0
                fn(14px)
                width: 33%
            .settle_info
              fn(0)
              flex: 1
              &.logistic_info
                li
                  width:33%
              li
                inline()
                fn(14px)
                margin:10px 0
                width: 49%
                
      .big_title
        bgColor(#999)
        padding:20px
        vertical(60px)
        color()
        setBetween()
      .split_line
        border-bottom:1px solid #ddd
      .order_total
        li
          setEnd()
          height:30px
          span
            width:100px
            alignR()
          i
            ml(10px)
            width:160px
      .inner_table
        background-color:transparent
      .el-col
        padding: 5px 0
      p.order_detail_title
        vertical(40px)
        bgColor(#E4E7ED)
        padl(10px)
      .pad10
        padding: 10px
      .text20
        line-height:20px
      .code_img
        setStart()
        align-items: flex-start
      .retail_ul
        li
          line-height:20px
  </style>