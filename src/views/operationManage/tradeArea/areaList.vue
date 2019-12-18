<template>
	<section class="app-container" id="areaList">
    <div v-show="!secShow">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <!-- <el-form :inline="true" :model="filters" @submit.native.prevent>
          <el-form-item>
            <el-input style="width: 300px" v-model="filters.phone" placeholder="用户名/商户ID/商户名称/手机号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="getUsers">查询</el-button>
          </el-form-item>
        </el-form> -->
        <div class="process_btns">
          <!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
          <el-button type="primary" v-on:click="showAddBusiness">新增大楼</el-button>
        </div>
      </el-col>

      <!--列表-->
      <record-count :total="total"></record-count>
      <el-table :data="users" highlight-current-row @selection-change="selsChange" style="width: 100%;">
        <el-table-column type="selection" width="45px">
        </el-table-column>
        <el-table-column prop="id" label="大楼ID">
        </el-table-column>
        <el-table-column prop="updateTime" label="创建时间" :formatter="formatCreateTime">
        </el-table-column>
        <el-table-column prop="name" label="名称">
        </el-table-column>
        <el-table-column prop="status" label="状态" :formatter="formatStatus">
        </el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" plain size="mini" @click="getFloors(scope.row.id, scope.row.name)">设置楼层</el-button>
            <el-button type="primary" plain size="mini" @click="getBusinessDetail(scope.row)">编辑</el-button>
            <el-button type="danger" plain size="mini" @click="disabledArea(scope.row)" v-if="scope.row.status === 'on'">禁用</el-button>
            <el-button type="success" plain size="mini" @click="disabledArea(scope.row)" v-if="scope.row.status === 'off'">启用</el-button>
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
    <!--大楼操作-->
    <Secondary :title="secTitle" v-model="secShow">
      <template v-if="showStalls">
        <div class="building_title"><i>大楼名称: {{buildingData.name}}</i></div>
        <div class="process_btns">
          <el-button type="danger" @click="batchRemoveFloor" :disabled="this.selectArr.length===0">批量删除</el-button>
          <el-button type="primary" v-on:click="showAddStall">新增楼层</el-button>
        </div>
        <record-count :total="totalFloor"></record-count>
        <el-table :data="stallList" highlight-current-row @selection-change="floorChange" style="width: 100%;">
          <el-table-column type="selection" width="45px">
          </el-table-column>
          <el-table-column prop="id" label="楼层ID">
          </el-table-column>
          <el-table-column prop="updateTime" label="创建时间" :formatter="formatCreateTime">
          </el-table-column>
          <el-table-column prop="name" label="楼层名称">
          </el-table-column>
          <el-table-column prop="floor" label="楼层序号">
          </el-table-column>
          <el-table-column prop="status" label="状态" :formatter="formatStatus">
          </el-table-column>
          <el-table-column label="操作" width="250px">
            <template slot-scope="scope">
              <el-button type="primary" plain size="mini" @click="getStallDetail(scope.row)">编辑</el-button>
              <el-button type="danger" plain size="mini" @click="disabledFloor(scope.row)" v-if="scope.row.status === 'on'">禁用</el-button>
              <el-button type="success" plain size="mini" @click="disabledFloor(scope.row)" v-if="scope.row.status === 'off'">启用</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page_toolbar">
          <el-pagination layout="prev, pager, next, jumper" prev-text="上一页" next-text="下一页" background 
            @current-change="handleCurrentChangeFloor" :current-page="pageNumFloor" :page-size="pageSizeFloor" :total="totalFloor">
          </el-pagination>
        </div>
        <!-- <el-col :span="24" class="toolbar_process">
          <el-button type="danger" @click="batchRemoveFloor" :disabled="this.selectArr.length===0">批量删除</el-button>
          <el-pagination layout="prev, pager, next" @current-change="handleCurrentChangeFloor" 
            :page-size="pageSizeFloor" :total="totalFloor" style="float:right;">
          </el-pagination>
        </el-col> -->
      </template>
      <template v-if="showBusiness">
        <el-form class="secondary_form" :model="businessForm" label-width="100px" :rules="businessFormRules" ref="businessForm">
          <el-form-item label="大楼名称" prop="name">
            <el-input v-model="businessForm.name" placeholder="请输入大楼名称"></el-input>
          </el-form-item>
          <el-form-item label="所在地区" prop="city">
            <el-cascader
              expand-trigger="hover"
              :options="citys"
              :props="cascaderProps"
              v-model="businessForm.city">
            </el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="detailAddress">
            <el-input v-model="businessForm.detailAddress" placeholder="请输入详细地址"></el-input>
          </el-form-item>
          <el-form-item label="经度" prop="lat">
            <el-input v-model="businessForm.lat" placeholder="请输入大楼经度"></el-input>
          </el-form-item>
          <el-form-item label="纬度" prop="lng">
            <el-input v-model="businessForm.lng" placeholder="请输入大楼纬度"></el-input>
          </el-form-item>
          <el-form-item label="开启状态">
            <el-switch
              v-model="businessForm.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="on"
              inactive-value="off">
            </el-switch>
          </el-form-item>
          <el-form-item>
            <el-button @click.native="secShow=false">取消</el-button>
            <el-button type="primary" @click="tradeAreaEdit">保存</el-button>
          </el-form-item>
        </el-form>
      </template>
    </Secondary>
    <!--档口详情-->
    <Drawer v-model="showDrawer" title="楼层操作" :showFooter="true">
      <el-form :model="editForm" class="secondary_form" label-width="150px" :rules="editFormRules" ref="editForm">
        <el-form-item label="所属大楼" prop="buildingName">
          {{buildingData && buildingData.name}}
        </el-form-item>
        <el-form-item label="楼层名称" prop="name">
          <el-input v-model="editForm.name" placeholder="如: 一层"></el-input>
        </el-form-item>
        <el-form-item label="楼层序号" prop="floor">
          <el-input v-model="editForm.floor" placeholder="如: 一楼则填写‘1’"></el-input>
          <span>(请按照实际所在楼层填写)</span>
        </el-form-item>
        <el-form-item label="开启状态">
          <el-switch
            v-model="editForm.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="on"
            inactive-value="off">
          </el-switch>
        </el-form-item>
			</el-form>
      <el-button slot="footer" type="primary" @click="createData">保存</el-button>
    </Drawer>
	</section>
</template>

<script>
export default {
  data() {
    return {
      editRole: {roleId: null},
      secShow: false, // 是否展示二级编辑页面
      dialogStatus: '',
      citys: [],
      cascaderProps: {value: 'name', label: 'name'},
      showStalls: false,
      showBusiness: true,
      secTitle: '',
      textMap: {
        update: '编辑用户',
        create: '创建用户'
      },
      filters: {
        userName: '',
        phone: '',
      },
      users: [], // 用户列表
      stallList: [], // 档口列表
      // 大楼分页
      total: 0,
      pageNum: 1,
      pageSize: 10,
      // 楼层分页
      totalFloor: 0,
      pageNumFloor: 1,
      pageSizeFloor: 10,
      sels: [], // 列表选中列
      showDrawer: false,
      editFormRules: {
        name: [{ required: true, validator: this.noEmpty, message: '请输入楼层名称', trigger: 'blur' }],
        floor: [{ required: true, validator: this.mustNumber, message: '楼层为数字', trigger: 'blur' }]
      },
      businessFormRules: {
        name: [
          { required: true, validator: this.noEmpty, message: '请输入大楼名称', trigger: 'blur' },
          { required: true, validator: this.lessThan10, message: '大楼名称不超过10个字符', trigger: 'blur' }
        ],
        city: [{ required: true, validator: this.noEmptyArr, message: '请选择省市区', trigger: 'blur' }],
        detailAddress: [{ required: true, validator: this.noEmpty, message: '请输入详细地址', trigger: 'blur' }],
        lat: [{ required: true, validator: this.noEmpty, message: '经度不能为空', trigger: 'blur' }],
        lng: [{ required: true, validator: this.noEmpty, message: '纬度不能为空', trigger: 'blur' }],
      },
      businessForm: {
        name: '',
        lat: '',
        lng: '',
        city: [],
        detailAddress: '',
        status: 'on',
      },
      // 编辑界面数据
      editForm: {
        floor: '',
        name: '',
        status: '',
      },
      buildingData: null,
      ids: [],
      selectArr: [],
      addFormVisible: false // 新增界面是否显示
    }
  },
  created() {
    this.init()
    this.disabledArea = this._debounce(this.disabledArea)
    this.tradeAreaEdit = this._debounce(this.tradeAreaEdit)
    this.disabledFloor = this._debounce(this.disabledFloor)
    this.createData = this._debounce(this.createData)

    window.citys ? (this.citys = window.citys) 
      : this._loadJs(`${process.env.CHILD_ROUTE}/static/js/city.js`, () => {this.citys = window.citys})
  },
  methods: {
    queryData() {
      this.pageNum = 1
      this.getUsers()
    },
    init() {
      this.getUsers()
    },
    formatCreateTime(row) {
      return this._formatTime(row.updateTime)
    },
    formatStatus(row) {
      // on 启用
      return row.status === 'on' ? '开启' : '禁用'
    },
    formatFloorStatus(row) {
      return row.status === '2' ? '开启' : '禁用'
    },
    // 页脚显示转换
    handleCurrentChange(val) {
      this.pageNum = val
      this.getUsers()
    },
    // 页脚显示转换
    handleCurrentChangeFloor(val) {
      this.pageNumFloor = val
      this.getFloors()
    },
    // 禁用大楼
    disabledArea(row) {
      if (row.status === 'on') {
        const self = this
        this.$confirm('确定禁用该大楼吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$postJson(this._basePath.ajaxTradeAreaSetStatus, {id: row.id, status: 'off'}).then(res => {
            if (res.success) {
              this.$message.success('禁用成功！')
              self.getUsers()
            }
          })
        })
      } else {
        this.$postJson(this._basePath.ajaxTradeAreaSetStatus, {id: row.id, status: 'on'}).then(res => {
          if (res.success) {
            this.$message.success('启用成功！')
            this.getUsers()
          }
        })
      }
    },
    // 新增大楼
    showAddStall() {
      this.showDrawer = true
      this.editForm = {
        floor: '',
        name: '',
        status: '',
      }
    },
    // 获取大楼列表
    getUsers() {
      const para = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      }
      let b = this.filters
      this.$postJson(this._basePath.ajaxTradeAreaByPage, {...para, ...b}).then(res => {
        if (res.success) {
          this.total = res.data.count
          this.users = res.data.datas
        }
      })
    },
    // 新增大楼
    showAddBusiness() {
      this.secShow = true
      this.showBusiness = true
      this.showStalls = false
      this.businessForm = {
        name: '',
        lat: '',
        lng: '',
        city: [],
        detailAddress: '',
        status: 'on',
      }
    },
    // 展示编辑页面
    getBusinessDetail(row) {
      this.secShow = true
      this.secTitle = '大楼操作'
      this.showStalls = false
      this.showBusiness = true
      this.businessForm = Object.assign({}, row)
      this.$set(this.businessForm, 'city', [row.provinceId, row.cityId, row.areaId])
    },
    // 保存大楼信息
    tradeAreaEdit() {
      this.$refs.businessForm.validate(valid => {
        if (valid) {
          const param = Object.assign({}, this.businessForm)
          param.provinceId = this.businessForm.city[0]
          param.cityId = this.businessForm.city[1]
          param.areaId = this.businessForm.city[2]
          this.$post(this._basePath.ajaxTradeAreaSave, param).then(res => {
            if (res.success) {
              this.secShow = false
              this.$message.success('操作成功')
              this.queryData()
              this.showStalls = false
            }
          })
        }
      })
    },
    // 获取楼层列表
    getFloors(id, name) {
      const param = {
        buildingId: id !== undefined ? id : this.buildingData.id,
        pageNum: this.pageNumFloor,
        pageSize: this.pageSizeFloor,
      }
      this.$postJson(this._basePath.ajaxFloorByPage, param).then(res => {
        if (res.success) {
          id !== undefined && (this.buildingData = {
            name: name,
            id: id
          })
          this.secTitle = '楼层列表'
          this.stallList = res.data.datas
          this.totalFloor = res.data.count
          this.secShow = true
          this.showStalls = true
          this.showBusiness = false
        }
      })
    },
    // 编辑楼层
    getStallDetail(row) {
      this.showDrawer = true
      this.editForm = Object.assign({}, row)
      // this.$set(this.editForm, 'buildingName', this.buildingData.name)
    },
    disabledFloor(row) {
      if (row.status === 'on') {
        const self = this
        this.$confirm('确定禁用楼层吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$postJson(this._basePath.ajaxFloorStatus, {id: row.id, status: 'off'}).then(res => {
            if (res.success) {
              this.$message.success('禁用成功！')
              self.getFloors()
            }
          })
        })
      } else {
        this.$postJson(this._basePath.ajaxFloorStatus, {id: row.id, status: 'on'}).then(res => {
          if (res.success) {
            this.$message.success('启用成功！')
            this.getFloors()
          }
        })
      }
    },
    // 显示编辑界面
    handleEdit(index, row) {
      this.dialogStatus = 'update'
      this.secShow = true
      this.editForm = Object.assign({}, row)
    },
    // 新增
    createData: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          const para = Object.assign({}, this.editForm)
          para.buildingId = this.buildingData.id
          this.$post(this._basePath.ajaxFloorSave, para).then(res => {
            if (res.success) {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$refs['editForm'].resetFields()
              this.showStalls = true
              this.showDrawer = false
              this.getFloors()
            }
          })
        }
      })
    },
    // 大楼全选单选多选
    selsChange(sels) {
      this.sels = sels
    },
    // 全选单选多选
    floorChange(sels) {
      this.selectArr = sels
    },
    // 删除大楼
    batchRemove(index, row) {
      let ids
      if (row) {
        ids = [row.id].toString()
      } else {
        ids = this.sels.map(item => item.id).toString()
      }
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          const para = { idList: ids }
          this.$postJson(this._basePath.ajaxTradeAreaDel, para).then(res => {
            if (res.success) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.getUsers()
            }
          })
        })
        .catch(() => {})
    },
    // 删除大楼
    batchRemoveFloor(index, row) {
      let ids
      if (row) {
        ids = [row.id].toString()
      } else {
        ids = this.selectArr.map(item => item.id).toString()
      }
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          const para = { idList: ids }
          this.$postJson(this._basePath.ajaxFloorDel, para).then(res => {
            if (res.success) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.getFloors()
            }
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="stylus" scoped>
  #areaList
    .secondary_form
      .el-cascader
        width:100%
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