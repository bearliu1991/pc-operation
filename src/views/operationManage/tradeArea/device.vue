<template>
	<section class="app-container" id="equpment">
    <el-tabs v-model="activeName" class="switch_btn" @tab-click="switchPane">
      <el-tab-pane label="设备管理" name="stall"></el-tab-pane>
      <!-- <el-tab-pane label="登陆记录" name="buyer"></el-tab-pane> -->
    </el-tabs>
    <div>
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters" @submit.native.prevent>
          <el-form-item label="设备号">
            <el-input v-model="filters.imei" placeholder="请输入设备号"></el-input>
          </el-form-item>
          <el-form-item label="创建时间">
            <date-pick ref="dateFilter" v-model="reset"></date-pick>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryData">查询</el-button>
            <el-button type="text" @click="clearSearch">清空筛选条件</el-button>
          </el-form-item>
        </el-form>
        <filter-list :filterList="filterList" @filterChange="queryData" ref="statusBtn" title="设备状态"></filter-list>
        <filter-list :filterList="typeList" @filterChange="queryData" ref="typeBtn" title="设备类别"></filter-list>
        <div class="process_btns">
          <el-button type="primary" @click="showEdit">添加设备号</el-button>
        </div>
      </el-col>

      <!--列表-->
      <record-count :total="total">
      </record-count>
      <el-table :data="users" highlight-current-row style="width: 100%;" v-loading="loading">
        <el-table-column prop="imei" label="设备号">
        </el-table-column>
        <el-table-column prop="type" label="设备类型" :formatter="formatType">
        </el-table-column>
        <el-table-column prop="version" label="版本号">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" :formatter="formateModifyTime">
        </el-table-column>
        <el-table-column prop="stallName" label="目前所在档口">
        </el-table-column>
        <el-table-column prop="status" label="设备启用状态">
          <template slot-scope="scope">
            <span :class="[formatStatus(scope.row, true)]">{{formatStatus(scope.row)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="danger" plain size="mini" @click="disabledArea(scope.row)" v-if="scope.row.status === 1">禁用</el-button>
            <el-button type="success" plain size="mini" @click="disabledArea(scope.row)" v-if="scope.row.status === 0">启用</el-button>
            <el-button type="danger" plain size="mini" @click="batchRemove(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--工具条-->
      <div class="page_toolbar">
        <el-pagination layout="prev, pager, next, jumper" prev-text="上一页" next-text="下一页" background 
          @current-change="handleCurrentChange" :current-page="pageNum" :page-size="pageSize" :total="total">
        </el-pagination>
      </div>
      <Drawer title="添加设备" v-model="showDrawer">
        <el-form class="secondary_form" :model="editForm" label-width="120px" :rules="editFormFormRules" ref="editForm">
          <el-form-item label="设备号" prop="imei">
            <el-input style="width:250px" v-model="editForm.imei" placeholder="请输入设备号"></el-input>
          </el-form-item>
          <el-form-item label="设备类型" prop="type">
            <el-select v-model="editForm.type" style="width:250px">
              <el-option v-for="(item, idx) in typeList.slice(1)" :label="item.name" :key="idx" :value="item.filterVal.type"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="启用状态">
            <el-switch
              v-model="editForm.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0">
            </el-switch>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveData">保存</el-button>
          </el-form-item>
        </el-form>
      </Drawer>
    </div>
	</section>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      reset: false,
      loading:false,
      total: 0,
      activeName: 'stall',
      pageNum: 1,
      showDrawer: false,
      pageSize: 10,
      filters: {
        imei: ''
      },
      filterList: [
        {name: '全部', filterVal: {status: null}},
        {name: '启用', filterVal: {status: 1}},
        {name: '禁用', filterVal: {status: 0}}
      ],
      typeList: [
        {name: '全部', filterVal: {type: null}},
        {name: '收银机T2', filterVal: {type: 1}},
        {name: '手持设备L2', filterVal: {type: 2}},
        {name: '手持设备V2PRO', filterVal: {type: 3}},
        {name: '收银机T2_MINI', filterVal: {type: 4}}
      ],
      users: [], // 用户列表
      editForm: {
        imei: '',
        type: 1,
        status: 1
      },
      editFormFormRules: {
        imei: [{ required: true, validator: this.noEmpty, message: '设备号不能为空', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.getUsers()
    this.queryData = this._debounce(this.queryData)
    this.disabledArea = this._debounce(this.disabledArea)
    this.saveData = this._debounce(this.saveData)
  },
  methods: {
    clearSearch() {
      this.reset = true
      this.$set(this.filters, 'imei', '')
    },
    queryData() {
      this.pageNum = 1
      this.getUsers()
    },
    showEdit() {
      this.showDrawer = true
      this.editForm = {
        imei: '',
        type: 1,
        status: 1
      }
    },
    // 禁用启用设备
    disabledArea(row) {
      const imeis = [row.imei].toString()
      if (row.status === 1) {
        const self = this
        this.$confirm('确定禁用该设备吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$postJson(this._basePath.ajaxDeviceEnable, {imeis: imeis, status: 0}).then(res => {
            if (res.success) {
              this.$message.success('禁用成功！')
              self.getUsers()
            }
          })
        })
      } else {
        this.$postJson(this._basePath.ajaxDeviceEnable, {imeis: imeis, status: 1}).then(res => {
          if (res.success) {
            this.$message.success('启用成功！')
            this.getUsers()
          }
        })
      }
    },
    batchRemove(row) {
      const imeis = [row.imei].toString()
      const self = this
      this.$confirm('确定删除该设备吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$postJson(this._basePath.ajaxDeviceDel, {imeis: imeis}).then(res => {
          if (res.success) {
            this.$message.success('删除成功！')
            self.getUsers()
          }
        })
      })
    },
    // 保存信息
    saveData() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          const param = Object.assign({}, this.editForm)
          this.$postJson(this._basePath.ajaxDeviceSave, param).then(res => {
            if (res.success) {
              this.$message.success('保存成功')
              this.queryData()
              this.showDrawer = false
            }
          })
        }
      })
    },
    formatType(row) {
      const obj = this.typeList.find(item => item.filterVal.type === row.type)
      return obj ? obj.name : '—'
      // return row.type === 1 ? '收银机' : row.type === 2 ? '手持设备L2' : row.type === 3 ? '手持设备V2PRO' : '—'
    },
    formatStatus(row, isClass) {
      if (isClass) return row.status === 1 ? 'success_color' : 'err_color'
      return row.status === 1 ? '启用' : row.status === 0 ? '禁用' : '—'
    },
    formateModifyTime(row) {
      return this._formatTime(row.createTime, true) || '—'
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
      const statusFilter = this.$refs['statusBtn'] ? this.$refs['statusBtn'].getParams() : {}
      const typeFilter = this.$refs['typeBtn'] ? this.$refs['typeBtn'].getParams() : {}
      para.startTime = timeArr[0]
      para.endTime = timeArr[1]
      para.status = statusFilter.status
      para.type = typeFilter.type
      para.imei = this.filters.imei
      this.loading = true
      this.$postJson(this._basePath.ajaxGetDeviceByPage, para).then(res => {
        this.loading = false
        if (res.success) {
          this.total = res.data.count
          this.users = res.data.datas
        }
      })
    }
  }
}
</script>

<style lang="stylus">
  @import '~@/assets/css/index'
  #equpment
    #filter_list
      mb(0)
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