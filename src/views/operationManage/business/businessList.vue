<template>
	<section class="app-container">
    <div v-show="!secShow">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters" @submit.native.prevent>
          <el-form-item>
            <el-input v-model="filters.idOrNameOrPhone" placeholder="用户名/手机号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="queryData">查询</el-button>
          </el-form-item>
        </el-form>
        <div class="process_btns">
          <!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
          <el-button type="primary" v-on:click="showAddBusiness">新增客户</el-button>
        </div>
      </el-col>

      <!--列表-->
      <record-count :total="total"></record-count>
      <el-table :data="users" highlight-current-row @selection-change="selsChange" style="width: 100%;">
        <el-table-column type="selection" width="45px">
        </el-table-column>
        <!-- <el-table-column prop="id" label="客户ID">
        </el-table-column> -->
        <el-table-column prop="userName" label="用户名">
        </el-table-column>
        <el-table-column prop="phone" label="账号/手机号">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" :formatter="formatCreateTime">
        </el-table-column>
        <el-table-column prop="status" label="客户状态" :formatter="formatCustomerStatus">
        </el-table-column>
        <el-table-column label="操作" width="320px">
          <template slot-scope="scope">
            <el-button type="primary" plain size="mini" @click="openSec(scope.row)">进入档口 ({{scope.row.stallCount}})</el-button>
            <el-button type="primary" plain size="mini" @click="getBusinessDetail(scope.row)">编辑</el-button>
            <!-- <el-button type="danger" plain size="mini" v-if="scope.row.status === 1" @click="setCustomerStatus(scope.row,2)">禁用</el-button>
            <el-button type="success" plain size="mini" v-if="scope.row.status === 2" @click="setCustomerStatus(scope.row,1)">启用</el-button> -->
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
    <!--档口列表-->
    <Secondary :title="secTitle" v-model="secShow">
      <template v-if="showStalls">
        <div class="process_btns">
          <el-button type="primary" v-on:click="showAddStall">新增档口</el-button>
        </div>
        <el-table :data="stallList" highlight-current-row style="width: 100%;">
          <el-table-column prop="id" label="档口ID">
          </el-table-column>
          <el-table-column prop="code" label="档口编号">
          </el-table-column>
          <el-table-column prop="name" label="档口名称">
          </el-table-column>
          <el-table-column label="地址">
            <template slot-scope="scope">
              {{scope.row.buildingName}}{{scope.row.floorName}}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" :formatter="formatStatus">
          </el-table-column>
          <el-table-column label="操作" width="250px">
            <template slot-scope="scope">
              <el-button type="primary" plain size="mini" @click="getStallDetail(scope.row)">编辑</el-button>
              <el-button type="danger" plain size="mini" v-if="scope.row.status === 1" @click="setStallStatus(scope.row,3)">禁用</el-button>
              <el-button type="success" plain size="mini" v-if="scope.row.status === 3" @click="setStallStatus(scope.row,1)">启用</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template v-if="showBusiness">
        <el-form :model="businessForm" class="secondary_form" label-width="150px" :rules="businessFormRules" ref="editForm">
          <el-form-item label="商户ID" prop="id" v-if="businessForm.id !== undefined">
            {{businessForm.id}}
          </el-form-item>
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="businessForm.userName" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <span v-if="dialogStatus === 'update'">{{businessForm.phone}}</span>
            <el-input v-if="dialogStatus === 'create'" v-model="businessForm.phone" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="密码" v-if="dialogStatus !== 'update'" prop="password">
            <span v-if="dialogStatus === 'update'">{{businessForm.password}}</span>
            <el-input v-if="dialogStatus === 'create'" v-model="businessForm.password" placeholder="密码长度至少6位"></el-input>
          </el-form-item>
          <el-form-item label="用户状态">
            <el-switch
              v-model="businessForm.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="3">
            </el-switch>
          </el-form-item>
          <el-form-item>
            <el-button @click.native="secShow=false">取消</el-button>
            <el-button type="primary" @click="bossEdit">保存</el-button>
          </el-form-item>
        </el-form>
      </template>
    </Secondary>
    <!--档口详情-->
    <Drawer v-model="showDrawer" title="档口详情" :showFooter="true">
      <el-form :model="editForm" class="secondary_form" label-width="100px" :rules="editFormRules" ref="editForm">
        <el-form-item label="所属客户">
          {{curRow.userName}}
        </el-form-item>
        <el-form-item label="档口名称" prop="name">
          <el-input v-model="editForm.name" placeholder="用户登陆时使用, 如有重复, 可添加数字区分, 如'张三01'"></el-input>
        </el-form-item>
        <el-form-item label="店铺头像" prop="mallImage">
          <img-upload :imgUrl_main="editForm.mallImage" @uploadImg="setImgList" :isGroup="false" mainTitle="店铺头像"></img-upload>
        </el-form-item>
        <!-- <el-form-item label="绑定设备" prop="deviceList">
          <el-form :model="deviceForm" ref="deviceForm">
            <el-form-item prop="deviceName" :rules="[{required: true, validator: noEmpty, message: '设备号不能为空', trigger:'blur'}]">
              <el-input v-model="deviceForm.deviceName" size="mini" prop="" style="width:200px" placeholder="请输入设备号"></el-input>
              <el-button type="primary" plain size="mini" @click="bindDevice(editForm.id)">绑定设备</el-button>
            </el-form-item>
          </el-form>
          <ul class="device_list" v-if="editForm.deviceList.length">
            <li v-for="(item, index) in editForm.deviceList" :key="index">
              <span>{{item.imei}}</span> &nbsp;&nbsp;&nbsp;
              <el-button type="text" @click="unbindDevice(item.id, index)">解绑</el-button>
            </li>
          </ul>
        </el-form-item> -->
        <el-form-item label="所属大楼" prop="categoryId">
          <el-cascader
            :options="options"
            :props="cascaderProps"
            class="cascader_class"
            v-model="editForm.categoryId"
            @change="cascaderChange"
            @active-item-change="getCategory2" @focus="getCategory1">
          </el-cascader>
        </el-form-item>
        <el-form-item label="档口编号" prop="code">
          <el-input v-model="editForm.code" placeholder="请输入档口编号"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="editForm.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="3">
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
      curRow: {},
      editRole: {roleId: null},
      secShow: false, // 是否展示二级编辑页面
      dialogStatus: '',
      showStalls: false,
      showBusiness: true,
      deviceForm: {
        deviceName: ''
      },
      textMap: {
        update: '编辑用户',
        create: '创建用户'
      },
      filters: {
        idOrNameOrPhone: '',
      },
      users: [], // 用户列表
      stallList: [], // 档口列表
      total: 0,
      pageNum: 1,
      pageSize: 10,
      sels: [], // 列表选中列
      showDrawer: false,
      editFormRules: {
        name: [
          { required: true, validator: this.noEmpty, message: '请输入档口名', trigger: 'blur' },
          { required: true, validator: this.lessThan18, message: '档口名称不超过18个字符', trigger: 'blur' }
        ],
        mallImage: [{ required: true, validator: this.noEmpty, message: '请上传店铺头像', trigger: 'blur' }],
        allAdress: [{ required: true, validator: this.noEmpty, message: '请输入地址', trigger: 'blur' }],
        // deviceList: [{ required: true,validator: this.noEmptyArr, message: '请至少绑定一台设备', trigger: 'blur'}],
        categoryId: [{ required: true, validator: this.noEmptyArr, message: '请选择大厦', trigger: 'blur' }],
        code: [
          { required: true, validator: this.noEmpty, message: '请输入档口编号', trigger: 'blur' },
          { required: true, validator: this.lessThan10, message: '档口编号不超过10个字符', trigger: 'blur' }
        ]
      },
      businessFormRules: {
        userName: [{ required: true, validator: this.noEmpty, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, validator: this._sixOrMore, message: '6至16位字母或数字', trigger: 'blur' }],
        phone: [{ required: true, validator: this.mobileReg, message: '手机号输入有误', trigger: 'blur' }],
      },
      businessForm: {
        userName: '',
        password: '',
        phone: '',
        status: 1,
      },
      // 大楼及楼层级联
      options: [],
      cascaderProps: {value: 'id', label: 'name'},
      // 编辑界面数据
      editForm: {
        categoryId: [],
        areaId: "",
        // deviceList: [],
        buildingId: '',
        floorId: '',
        code: "",
        mallImage: '',
        name: "",
        status: 1
      },
      ids: [],
      secTitle: '',
      isFirstShow: true,
      addFormVisible: false // 新增界面是否显示
    }
  },
  created() {
    this.init()
    this.queryData = this._debounce(this.queryData)
    this.setStallStatus = this._debounce(this.setStallStatus)
    this.setCustomerStatus = this._debounce(this.setCustomerStatus)
    this.bossEdit = this._debounce(this.bossEdit)
    this.createData = this._debounce(this.createData)
  },
  methods: {
    init() {
      this.getUsers()
    },
    formatCreateTime(row) {
      return this._formatTime(row.createTime, true)
    },
    formatCustomerStatus(row) {
      // 0--未激活，1--正常，2--禁用',
      return row.status === 0 ? '未激活' : row.status === 1 ? '正常' : row.status === 2 ? '禁用' : '—'
    },
    formatStatus(row) {
      // 0：停业 1：启动 2 待审核 3,禁用
      return row.status === 0 ? '停业' : row.status === 1 ? '启动' : row.status === 3 ? '禁用' : '—'
    },
    queryData() {
      this.pageNum = 1
      this.getUsers()
    },
    setImgList(data) {
      this.$set(this.editForm, 'mallImage', data[0])
    },
    // 设置档口状态
    setStallStatus(row, status) {
      if (status === 3) {
        const self = this
        this.$confirm('确定禁用该档口吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$postJson(this._basePath.ajaxStallEnable, {userId: this.curRow.id, stallId: row.id, status: 3}).then(res => {
            if (res.success) {
              this.$message.success('禁用成功！')
              self.getStalls(this.curRow)
            }
          })
        })
      } else if (status === 1) {
        this.$postJson(this._basePath.ajaxStallEnable, {userId: this.curRow.id, stallId: row.id, status: 1}).then(res => {
          if (res.success) {
            this.$message.success('启用成功！')
            this.getStalls(this.curRow)
          }
        })
      }
    },
    // 设置老板状态
    setCustomerStatus(row, status) {
      if (status === 2) {
        const self = this
        this.$confirm('确定禁用该客户吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$postJson(this._basePath.ajaxCustomerEnable, {userId: row.id, status: 2}).then(res => {
            if (res.success) {
              this.$message.success('禁用成功！')
              self.getUsers()
            }
          })
        })
      } else if (status === 1) {
        this.$postJson(this._basePath.ajaxCustomerEnable, {userId: row.id, status: 1}).then(res => {
          if (res.success) {
            this.$message.success('启用成功！')
            this.getUsers()
          }
        })
      }
    },
    // 页脚显示转换
    handleCurrentChange(val) {
      this.pageNum = val
      this.getUsers()
    },
    cascaderChange(value) {
      if (value[1] === null) {
        this.$set(this.editForm, 'buildingId', value[0])
        this.$set(this.editForm, 'floorId', null)
        this.$set(this.editForm, 'categoryId', [value[0]])
      } else {
        this.$set(this.editForm, 'buildingId', value[0])
        this.$set(this.editForm, 'floorId', value[1])
      }
    },
    // 获取所有大楼
    // getAllBuildings() {
    //   this.$post(this._basePath.ajaxAllBuildings).then(res => {
    //     if (res.success) {
    //       this.options = res.data
    //     }
    //   })
    // },
    // 获取商品分类一级数据
    getCategory1() {
      if (this.isFirstShow) {
        this.$post(this._basePath.ajaxAllBuildings).then((res) => {
          if (res.success) {
            let arr = []
            for (let item of res.data) {
              !item.isChildren && (item.children = [])
              arr.push(item)
            }
            this.options = arr
            this.isFirstShow = false
          }
        })
      }
    },
    // 级联选择变化，获取商品分类二级数据
    getCategory2(value) {
      const obj = this.options.find(item => {
        return item.id === value[0]
      })
      if (!obj.isChildren && obj.children.length === 0) {
        this.$postJson(this._basePath.ajaxFloorById, {buildingId: value[0]}).then((res) => {
          if (res.success) {
            let item = this.iteratorCascader(value[value.length - 1], this.options)
            if (res.data.length) {
              !item.isChildren && (item.children = [])
              this.$set(item, 'children', res.data)
            } else {
              this.$set(item, 'children', [{id: null, name: '无'}])
            }
          }
        })
      }
    },
    iteratorCascader(val, arr) {
      let obj = {}
      function iterater(val, arr) {
        for (let item of arr) {
          item.id === val && (obj = item)
          item.children && iterater(val, item.children)
        }
      }
      iterater(val, arr)
      return obj
    },
    // 新增档口
    showAddStall() {
      this.dialogStatus = 'create'
      this.showDrawer = true
      this.isFirstShow = true
      this.editForm = {
        categoryId: [],
        areaId: "",
        // deviceList: [],
        buildingId: '',
        floorId: '',
        code: "",
        mallImage: '',
        name: "",
        status: 1
      }
    },
    // 解绑设备
    unbindDevice(id, index) {
      if (this.dialogStatus === 'update') {
        this.$postJson(this._basePath.ajaxUnbindDevice, {id: id}).then(res => {
          if (res.success) {
            this.$message.success('解绑成功！')
            this.editForm.deviceList.splice(index, 1)
          }
        })
      } else {
        this.editForm.deviceList.splice(index, 1)
      }
    },
    // 绑定设备
    bindDevice(id) {
      this.$refs.deviceForm.validate(valid => {
        if (valid) {
          if (this.dialogStatus === 'update') {
            this.$postJson(this._basePath.ajaxBindDevice, {stallId: id, imei: this.deviceForm.deviceName}).then(res => {
              if (res.success) {
                this.$set(this.editForm, 'deviceList', res.data || [])
                this.$set(this.deviceForm, 'deviceName', '')
              }
            })
          } else {
            this.editForm.deviceList.push({imei: this.deviceForm.deviceName})
            this.$set(this.deviceForm, 'deviceName', '')
          }
        }
      })
    },
    // 获取用户列表
    getUsers() {
      const para = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      }
      let b = this.filters
      this.$postJson(this._basePath.ajaxBossListByPage, {...para, ...b}).then(res => {
        if (res.success) {
          this.total = res.data.count
          this.users = res.data.datas
        }
      })
    },
    // 新增老板
    showAddBusiness() {
      this.secShow = true
      this.showBusiness = true
      this.showStalls = false
      this.secTitle = '客户操作'
      this.dialogStatus = 'create'
      this.businessForm = {
        userName: '',
        password: '',
        phone: '',
        status: 1,
      }
    },
    // 获取商户详情
    getBusinessDetail(row) {
      this.dialogStatus = 'update'
      this.secShow = true
      this.showStalls = false
      this.showBusiness = true
      this.businessForm = Object.assign({}, row)
      this.$set(this.businessForm, 'password', '')
    },
    // 保存商户信息
    bossEdit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          let param = Object.assign({}, this.businessForm)
          param.password && (param.password = this.businessForm.password)
          this.$post(this._basePath.ajaxBossSave, param).then(res => {
            if (res.success) {
              this.$message.success('操作成功')
              this.getUsers()
              this.secShow = false
            }
          })
        }
      })
    },
    openSec(row) {
      this.curRow = row
      this.secShow = true
      this.secTitle = '档口列表'
      this.showStalls = true
      this.showBusiness = false
      this.getStalls(row)
    },
    // 获取商家档口列表
    getStalls(row) {
      this.$postJson(this._basePath.ajaxOperationStallList, {userId: row.id}).then(res => {
        if (res.success) {
          this.stallList = res.data
        }
      })
    },
    // 获取档口详情
    getStallDetail(row) {
      this.dialogStatus = 'update'
      this.isFirstShow = true
      this.$postJson(this._basePath.ajaxOperateStallDetail, {stallId: row.id}).then(res => {
        if (res.success) {
          if (res.data) {
            this.editForm = Object.assign(this.editForm, res.data)
            if (res.data.floorName) {
              this.editForm.categoryId = [res.data.floorId]
              this.options = [{name: `${res.data.buildingName}/${res.data.floorName}`, id: res.data.floorId}]
            } else {
              this.editForm.categoryId = [res.data.buildingId]
              this.options = [{name: `${res.data.buildingName}`, id: res.data.buildingId}]
            }
            this.showDrawer = true
            this.$set(this.deviceForm, 'deviceName', '')
          }
        }
      })
      this.$set(this.editForm, 'allAdress', `${row.provinceId}${row.cityId}${row.areaId}${row.betterAddress}`)
    },
    // 新增
    createData: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          let para = Object.assign({}, this.editForm)
          para.userId = this.curRow.id
          this.$post(this._basePath.ajaxStallSave, para).then(res => {
            if (res.success) {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$refs['editForm'].resetFields()
              this.showDrawer = false
              this.getStalls(this.curRow)
              this.getUsers()
            }
          })
        }
      })
    },
    // 全选单选多选
    selsChange(sels) {
      this.sels = sels
    },
    // 删除
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
          this.$postJson(this._basePath.ajaxUserDel, para).then(res => {
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
    }
  }
}
</script>

<style lang="stylus">
  @import '~@/assets/css/index'
  .device_list
    border_()
    padding: 15px
    setColumn()
    mt(-20px)
</style>