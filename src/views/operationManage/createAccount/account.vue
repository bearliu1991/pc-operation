<template>
	<section class="app-container" id="shop_staff">
    <div>
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true">
          <div class="process_btns">
            <!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
            <el-button type="primary" @click="handleAdd">添加账号</el-button>
          </div>
        </el-form>
      </el-col>
      <!--列表-->
      <record-count :total="total"></record-count>
      <el-table :data="users" highlight-current-row @selection-change="selsChange" style="width: 100%;">
        <el-table-column type="selection" width="45">
        </el-table-column>
        <el-table-column prop="phone" label="账号/手机号">
        </el-table-column>
        <el-table-column prop="userName" label="用户名称">
        </el-table-column>
        <el-table-column prop="name" label="用户角色" :formatter="formatRole">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" :formatter="formatTime">
        </el-table-column>
        <el-table-column prop="status" label="账号状态" :formatter="formatStatus">
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="180px">
          <template slot-scope="scope">
            <el-button size="small" type="primary" plain @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="danger" plain size="small" v-if="scope.row.status === 1" @click="setStallStatus(scope.row, 2)">禁用</el-button>
            <el-button type="success" plain size="small" v-if="scope.row.status === 2" @click="setStallStatus(scope.row, 1)">启用</el-button>
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

		<!--编辑界面-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="secShow"
      center
      width="600px">
      <div class="set_start">
        <el-form :model="editForm" label-width="120px" v-if="secShow" style="margin:0 auto" :rules="editFormRules" ref="editForm">
          <el-form-item label="账号/手机号" prop="phone">
            <el-input v-model="editForm.phone" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="用户姓名" prop="userName">
            <el-input v-model.trim="editForm.userName" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" :class="[_isHasVal(editForm.roleId) && 'no_star']">
            <el-input type="password" auto-complete="new-password" v-model="editForm.password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="roleId" placeholder="请选择角色">
            <el-select v-model="editForm.roleId">
              <el-option v-for="(item,index) in rolesArr" :label="item.name" :value="item.id" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户状态">
            <el-switch
              v-model="editForm.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0">
            </el-switch>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="set_middle">
          <el-button @click="secShow = false">取 消</el-button>
          <el-button type="primary" @click="createData" v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
        </span>
    </el-dialog>
	</section>
</template>

<script>
export default {
  data() {
    return {
      // 用户级别类型
      secShow: false, // 是否展示二级编辑页面
      dialogStatus: '',
      fullscreenLoading: false,
      textMap: {
        update: '编辑用户',
        create: '新增用户'
      },
      rolesArr: [],
      users: [],
      sels: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      editFormRules: {
        userName: [{ required: true, validator: this.noEmpty, message: '用户名不能为空', trigger: 'blur' }],
        phone: [{ required: true, validator: this.noEmpty, message: '手机号不能为空', trigger: 'blur' }],
        roleId: [{ required: true, validator: this.noEmpty, message: '角色不能为空', trigger: 'blur' }],
        password: [{ required: true, validator: this.noEmpty, message: '密码不能为空', trigger: 'blur' }]
      },
      // 编辑界面数据
      editForm: {
        userName: '',
        phone: '',
        password: '',
        status: 1,
        roleId: null
      }
    }
  },
  created () {
    this.getUsers()
    this.getAllRoles()
  },
  methods: {
    queryDate() {
      this.pageNum = 1
      this.getUsers()
    },
    // 页脚显示转换
    handleCurrentChange(val) {
      this.pageNum = val
      this.getUsers()
    },
    formatRole(row) {
      if (this.rolesArr && this.rolesArr.length) {
        const obj = this.rolesArr.find(item => item.id === row.roleId)
        if (obj) return obj.name
      }
      return ''
    },
    formatTime(row) {
      return this._formatTime(row.createTime, true) || '—'
    },
    formatStatus(row) {
      return row.status === 1 ? '启用' : row.status === 2 ? '禁用' : '—'
     },
    // 获取用户列表
    getUsers() {
      const para = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      }
      this.$postJson(this._basePath.ajaxOperationAccountByPage, para).then(res => {
        if (res.success) { // 37BE6E2FA7F070076480DE778498F94E
          this.total = res.data.count
          this.users = res.data.datas
        }
      })
    },
    // 显示编辑界面
    handleEdit(index, row) {
      this.dialogStatus = 'update'
      this.secShow = true
      this.editForm = Object.assign({}, row)
      this.editFormRules = {
        userName: [{ required: true, validator: this.noEmpty, message: '用户名不能为空', trigger: 'blur' }],
        phone: [{ required: true, validator: this.noEmpty, message: '手机号不能为空', trigger: 'blur' }],
        roleId: [{ required: true, validator: this.noEmpty, message: '角色不能为空', trigger: 'blur' }]
      }
    },
    // 显示新增界面
    handleAdd() {
      this.dialogStatus = 'create'
      this.secShow = true
      this.editForm = {
        userName: '',
        phone: '',
        password: '',
        status: 1,
        roleId: null
      }
      this.editFormRules = {
        userName: [{ required: true, validator: this.noEmpty, message: '用户名不能为空', trigger: 'blur' }],
        phone: [{ required: true, validator: this.noEmpty, message: '手机号不能为空', trigger: 'blur' }],
        roleId: [{ required: true, validator: this.noEmpty, message: '角色不能为空', trigger: 'blur' }],
        password: [{ required: true, validator: this.noEmpty, message: '密码不能为空', trigger: 'blur' }]
      }
      this.$nextTick(() => {
        this.$refs.editForm.resetFields()
      })
    },
    getAllRoles() {
      this.$post(this._basePath.ajaxOperationRoleGetAll).then(res => {
        if (res.success) {
          this.rolesArr = res.data || []
        }
      })
    },
    setStallStatus(row, status) {
      if (status === 2) {
        this.$confirm('确定禁用该账号吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$postJson(this._basePath.ajaxOperationAccountEnable, {userId: row.id, status: 2}).then(res => {
            if (res.success) {
              this.$message.success('禁用成功！')
              this.getUsers()
            }
          })
        })
      } else if (status === 1) {
        this.$postJson(this._basePath.ajaxOperationAccountEnable, {userId: row.id, status: 1}).then(res => {
          if (res.success) {
            this.$message.success('启用成功！')
            this.getUsers()
          }
        })
      }
    },
    // 新增
    createData: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          let para = Object.assign({}, this.editForm)
          para.password = this.editForm.password
          this.$post(this._basePath.ajaxOperationSave, para).then(res => {
            if (res.success) {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$refs['editForm'].resetFields()
              this.secShow = false
              this.queryDate()
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
      let ids = row ? [row.id] : this.sels.map(item => item.id)
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          const para = { idList: ids.toString() }
          this.$postJson(this._basePath.ajaxClerkDel, para).then(res => {
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
  }
}
</script>

<style lang="stylus" scoped>
  @import '~@/assets/css/index'
  #shop_staff
    .toolbar_process 
      margin-top:20px
    .order_detail
      border_()
      padding:20px
      height:200px
      overflow-y:auto
      li
        vertical(24px)
        setStart()
        span
          width:150px
          color(text_color)
          cursor()
</style>