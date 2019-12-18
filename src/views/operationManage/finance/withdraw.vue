<template>
	<section class="app-container" id="areaList">
    <template v-if="!secShow">
      <el-tabs v-model="activeName" class="switch_btn" @tab-click="switchPane">
        <el-tab-pane label="档口提现审核" name="stall"></el-tab-pane>
        <el-tab-pane label="采购端提现审核" name="buyer"></el-tab-pane>
      </el-tabs>
      <div>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
          <el-form :inline="true" :model="filters" @submit.native.prevent>
            <el-form-item label="下单时间">
              <date-pick @dateChange="isChange++" ref="dateFilter" v-model="reset"></date-pick>
            </el-form-item>
            <el-form-item :label="activeName === 'stall' ? '档口ID' : activeName === 'buyer' ? '采购方ID' : ''">
              <el-input v-model="filters.id" placeholder="请输入ID"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="queryData">查询</el-button>
              <el-button type="text" v-on:click="clearSearch">清空筛选条件</el-button>
            </el-form-item>
          </el-form>
          <filter-list :filterList="filterList" @filterChange="queryData" ref="filterBtn"></filter-list>
        </el-col>

        <!--列表-->
        <record-count :total="total">
          <div class="export_file">
            <h3>导出订单: </h3>
            <div class="svg_wrap">
              <a :href="downloadUrl">
                <span>
                  <svg class="icon svg-icon" aria-hidden="true">
                    <use xlink:href="#iconexcel"></use>
                  </svg>
                  <i>Excel格式</i>
                </span>
              </a>
              <!-- <span>
                <svg class="icon svg-icon" aria-hidden="true">
                  <use xlink:href="#iconTXT"></use>
                </svg>
                <i>Txt格式</i>
              </span> -->
            </div>
          </div>
        </record-count>
        <el-table :data="users" highlight-current-row style="width: 100%;" v-loading="loading">
          <el-table-column prop="createTime" label="申请时间" :formatter="formateModifyTime">
          </el-table-column>
          <el-table-column>
            <template slot="header" slot-scope="scope">
              {{activeName === 'stall' ? '档口ID' : activeName === 'buyer' ? '采购方ID' : ''}}
            </template>
            <template slot-scope="scope">
              {{activeName === 'stall' ? scope.row.stallId : activeName === 'buyer' ? scope.row.userId : ''}}
            </template>
          </el-table-column>
          <el-table-column prop="orderCode" label="提现订单号">
          </el-table-column>
          <el-table-column prop="type" label="提现渠道" :formatter="formatType">
          </el-table-column>
          <el-table-column prop="account" label="提现账号">
          </el-table-column>
          <el-table-column prop="amount" label="提现金额（元）">
          </el-table-column>
          <el-table-column prop="serviceCharge" label="提现手续费（元）">
          </el-table-column>
          <el-table-column prop="status" label="提现状态">
            <template slot-scope="scope">
              <span :class="formatStatus(scope.row, true)">{{formatStatus(scope.row)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="operateDesc" label="备注">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" plain size="mini" @click="handleCheck(scope.row)">审核</el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <!--工具条-->
        <div class="page_toolbar">
          <el-pagination layout="prev, pager, next, jumper" prev-text="上一页" next-text="下一页" background 
            @current-change="handleCurrentChange" :current-page="pageNum" :page-size="pageSize" :total="total">
          </el-pagination>
        </div>
      </div>
    </template>
    
    <Secondary title="提现详情" v-model="secShow">
      <template v-if="secShow">
        <div class="details_title">
          <h3 :class="formatStatus(editForm, true)" class="fn20">{{formatStatus(editForm)}}</h3>
          <el-tooltip v-if="editForm.status === 'RETREAT'" class="item" effect="dark" :open-delay="300" placement="top-start">
            <div slot="content">
              {{editForm.retreatTitle}}
              <br/>
              {{editForm.retreatDesc}}
            </div>
            <span class="icon light_color tips">&#xe657;</span>
          </el-tooltip>
        </div>
        <el-form :model="editForm" class="sec_el_form" :inline="true" label-width="100px" ref="editForm">
          <el-form-item label="提现商户ID: " v-if="editForm.id !== undefined">
            {{activeName === 'stall' ? editForm.stallId : activeName === 'buyer' ? editForm.userId : ''}}
          </el-form-item>
          <el-form-item label="提现订单号: ">
            {{editForm.orderCode || '—'}}
          </el-form-item>
          <el-form-item label="提现渠道: ">
            {{formatType(editForm)}}
          </el-form-item>
          <!-- 支付宝 -->
          <template v-if="editForm.type === 'zfb'">
            <!-- <el-form-item label="支付宝订单号: ">
              {{editForm.channelCode || '—'}}
            </el-form-item> -->
            <el-form-item label="提现账号: ">
              {{editForm.account || '—'}}
            </el-form-item>
            <el-form-item label="真实姓名: ">
              {{editForm.payBindingVo && editForm.payBindingVo.realName}}
            </el-form-item>
          </template>
          <!-- 微信 -->
          <template v-if="editForm.type === 'wx'">
            <!-- <el-form-item label="微信订单号: ">
              {{editForm.channelCode || '—'}}
            </el-form-item> -->
            <el-form-item label="APPID: ">
              {{editForm.APPID || '—'}}
            </el-form-item>
            <el-form-item label="OPENID: ">
              {{editForm.OPENID || '—'}}
            </el-form-item>
          </template>
          <!-- 银行 -->
          <template v-if="editForm.type === 'bank'">
            <!-- <el-form-item label="支付宝订单号: ">
              {{(editForm.payBindingVo && editForm.payBindingVo.idCardNo) || '—'}}
            </el-form-item> -->
            <el-form-item label="银行名称: ">
              {{editForm.payBindingVo && editForm.payBindingVo.bankName}}
            </el-form-item>
            <el-form-item label="开户人姓名: ">
              {{editForm.payBindingVo && editForm.payBindingVo.realName}}
            </el-form-item>
            <el-form-item label="提现银行卡号: ">
              {{editForm.payBindingVo && editForm.payBindingVo.account}}
            </el-form-item>
          </template>
          <el-form-item label="提现金额: ">
            {{editForm.amount}}
          </el-form-item>
          <el-form-item label="提现手续费: ">
            {{editForm.serviceCharge}}
          </el-form-item>
          <el-form-item label="实际到账金额: ">
            {{editForm.amount - editForm.serviceCharge || '—'}}
          </el-form-item>
          <el-form-item label="运营备注: ">
            <div>
              <el-input type="textarea" :disabled="!isEditRemark" v-model="editForm.operateDesc"></el-input>
              <el-button type="primary" v-if="!isEditRemark" plain size="mini" @click="isEditRemark = true">编辑</el-button>
              <el-button type="primary" v-if="isEditRemark" plain size="mini" @click="saveRemark">保存</el-button>
              <el-button type="primary" v-if="isEditRemark" plain size="mini" @click="isEditRemark = false">取消</el-button>
            </div>
          </el-form-item>
          <div v-if="editForm.status === 'SUBMIT'">
            <el-button type="primary" @click="disabledArea(editForm, 'PASS')">审核通过</el-button>
            <el-button type="primary" @click="openDialog">审核不通过</el-button>
          </div>
        </el-form>
      </template>
    </Secondary>
    <el-dialog
      title="审核不通过-原因说明"
      :visible.sync="dialogShow"
      width="600px"
      center>
      <div class="dialog_wrap">
        <el-select v-model="editForm.retreatTitle">
          <el-option v-for="(item, index) in reasons" :key="index" :label="item.content" :value="item.content"></el-option>
        </el-select>
        <el-input style="margin-top:30px" type="textarea" class="textarea_input" v-model="editForm.retreatDesc"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="dialogShow = false">取消</el-button>
        <el-button type="primary" @click="disabledArea(editForm, 'RETREAT')">确定</el-button>
      </div>
    </el-dialog>
    <!--二级分类操作-->
	</section>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      secShow: false, // 是否展示二级编辑页面
      reset: false,
      loading:false,
      retreatTitle: '商户号余额不足',
      isChange: 0,
      // downloadUrl: '',
      // 不通过原因列表
      reasons: [
        {content: '商户号余额不足'},
        {content: '网络繁忙'},
        {content: '银行信息有误'},
        {content: '账户存在安全隐患'},
      ],
      retreatDesc: '',
      total: 0,
      dialogShow: false,
      activeName: 'stall',
      pageNum: 1,
      pageSize: 10,
      isEditRemark: false,
      filters: {
        id: ''
      },
      filterList: [
        {name: '全部', filterVal: {status: null}},
        {name: '审核通过', filterVal: {status: 'PASS'}},
        {name: '处理中', filterVal: {status: 'SUBMIT'}},
        {name: '审核驳回', filterVal: {status: 'RETREAT'}}
      ],
      users: [], // 用户列表
      editForm: {}
    }
  },
  computed: {
    downloadUrl() {
      const bool = this.isChange
      const arr = this.$refs.dateFilter ? this.$refs.dateFilter.getParams() : []
      const btnFilter = this.$refs['filterBtn'] ? this.$refs['filterBtn'].getParams() : {}
      const param = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        userType: this.activeName
      }
      arr[0] && (param.startTime = arr[0])
      arr[1] && (param.endTime = arr[1])
      btnFilter.status && (param.status = btnFilter.status)
      this.filters.id && (this.activeName === 'stall' ? param.stallId = this.filters.id : this.activeName === 'buyer' ? param.userId = this.filters.id : '')

      return this._basePath.ajaxOperationExport + '?' + this.serializeParam(param)
    }
  },
  mounted() {
    this.getUsers()
    this.queryData = this._debounce(this.queryData)
    this.saveRemark = this._debounce(this.saveRemark)
    this.disabledArea = this._debounce(this.disabledArea)
  },
  methods: {
    clearSearch() {
      this.reset = true
      this.$set(this.filters, 'id', '')
    },
    queryData() {
      this.pageNum = 1
      this.isChange++
      this.getUsers()
    },
    handleCheck(row) {
      this.editForm = row
      this.secShow = true
    },
    // 保存备注
    saveRemark() {
      const obj = {
        id: this.editForm.id,
        operateDesc: this.editForm.operateDesc
      }
      this.$postJson(this._basePath.ajaxOperateUpdateRemark, obj).then(res => {
        if (res.success) {
          this.isEditRemark = false
        }
      })
    },
    formatType(row) {
      return row.type === 'wx' ? '微信' : row.type === 'zfb' ? '支付宝' : row.type === 'bank' ? '银行' : '—'
    },
    formatStatus(row, isClass) {
      // "SUBMIT"; // 申请提交
      // "PASS"; // 审核通过
      // "RETREAT"; // 审核驳回
      // "SUCCESS"; // 提现成功
      // "FAIL"; // 提现失败
      const status = row.status
      if (isClass) return status === 'SUBMIT' ? 'warn_color' : status === 'FAIL' ? 'err_color' : status === 'SUCCESS' ? 'success_color' : status === 'RETREAT' ? 'err_color' : status === 'PASS' ? 'success_color' : ''
      return status === 'SUBMIT' ? '处理中' : status === 'FAIL' ? '提现失败' : status === 'SUCCESS' ? '提现成功' : status === 'RETREAT' ? '审核驳回' : status === 'PASS' ? '审核通过' : '—'
    },
    formateModifyTime(row) {
      return this._formatTime(row.modifyTime, true) || '—'
    },
    switchPane() {
      this.clearSearch()
      this.queryData()
    },
    // 页脚显示转换
    handleCurrentChange(val) {
      this.pageNum = val
      this.getUsers()
    },
    // 获取交易列表
    getUsers() {
      const para = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      const timeArr = (this.$refs['dateFilter'] && this.$refs['dateFilter'].getParams()) || []
      const btnFilter = this.$refs['filterBtn'] ? this.$refs['filterBtn'].getParams() : {}
      para.startTime = timeArr[0]
      para.endTime = timeArr[1]
      para.status = btnFilter.status
      para.userType = this.activeName
      this.filters.id && (this.activeName === 'stall' ? para.stallId = this.filters.id : this.activeName === 'buyer' ? para.userId = this.filters.id : '')
      this.loading = true
      this.$postJson(this._basePath.ajaxOperateWithdrawListByPage, para).then(res => {
        this.loading = false
        if (res.success) {
          this.total = res.data.count
          this.users = res.data.datas
        }
      })
    },
    openDialog() {
      this.dialogShow = true
    },
    disabledArea(row, status) {
      if (status === 'RETREAT') {
        const param = {
          id: row.id, 
          status: status,
          retreatDesc: this.editForm.retreatDesc,
          retreatTitle: this.editForm.retreatTitle,
          operateDesc: this.editForm.operateDesc,
        }

        this.$post(this._basePath.ajaxOperateSetWithdrawStatus, param).then(res => {
          if (res.success) {
            this.getUsers()
            this.dialogShow = false
            this.secShow = false
            this.$message.success('拒绝成功！')
          }
        })
        // const self = this
        // this.$confirm('确定拒绝通过吗？', '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
          
        // })
      } else if (status === 'PASS') {
        this.$post(this._basePath.ajaxOperateSetWithdrawStatus, {id: row.id, status: status}).then(res => {
          if (res.success) {
            this.$message.success('通过成功！')
            this.secShow = false
            this.getUsers()
          }
        })
      }
    },
  }
}
</script>

<style lang="stylus">
  @import '~@/assets/css/index'
  #areaList
    .export_file
      fr()
      setEnd()
      .svg_wrap
        ml(10px)
        setStart()
        span
          cursor()
          setMiddle()
          fn(12px)
          margin:0 5px
          .svg-icon
            width:20px
            height:20px
    .withdraw_tip
      .el-form-item__content
        line-height:20px
    .textarea_input
      textarea
        height:100px
    .switch_btn
      mb(10px)
      .el-tabs__item
        fn(18px)
    .sec_el_form
      .el-form-item
        width:48%
    .details_title
      bgColor(#eee)
      padding:20px
      setStart()
      h3
        mr(10px)
    .building_title
      // text-align:center
      margin-top:10px
      margin-bottom:20px
      i
        font-size:20px
        font-weight:bold
    .toolbar_process
      margin-top:20px
</style>