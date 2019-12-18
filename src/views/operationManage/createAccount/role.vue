<template>
	<section class="app-container" id="role_allocate">
    <div v-if="!secShow">
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true">
          <div class="process_btns">
            <el-button type="primary" @click="handleAdd">添加角色</el-button>
          </div>
        </el-form>
      </el-col>
      <!--列表-->
      <record-count :total="total"></record-count>
      <el-table :data="users" highlight-current-row style="width: 100%;">
        <el-table-column prop="id" label="角色ID">
        </el-table-column>
        <el-table-column prop="name" label="角色名">
        </el-table-column>
        <el-table-column prop="desc" label="角色描述">
        </el-table-column>
        <el-table-column prop="updateTime" label="创建时间" :formatter="formatTime">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="small" type="primary" plain @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="success" plain size="small" v-if="scope.row.status === 3" @click="setStallStatus(scope.row, 1)">启用</el-button>
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
    <Secondary :title="textMap[dialogStatus]" v-model="secShow" @close="goback">
      <el-steps :active="activeStep" simple>
        <el-step title="角色信息" icon="el-icon-edit"></el-step>
        <el-step title="分配权限" icon="el-icon-upload"></el-step>
      </el-steps>
      <template v-if="activeStep === 1 && secShow">
        <el-form :model="editForm" style="width:400px; height:500px; margin: auto; margin-top: 20px" label-width="150px" :rules="editFormRules" ref="editForm">
          <el-form-item label="角色名" prop="name">
            <el-input v-model.trim="editForm.name" placeholder="30个字符以内"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="desc" class="no_star">
            <el-input v-model.trim="editForm.desc" type="textarea" placeholder="200个字符以内"></el-input>
          </el-form-item>
        </el-form>
        <div class="btns">
          <el-button @click="goback">取消</el-button>
          <el-button type="primary" @click="goStep(1)">下一步</el-button>
        </div>
      </template>
      <template v-if="activeStep === 2 && secShow">
        <rights-allocate ref="rights" :curItem="editForm"></rights-allocate>
        <div class="btns">
          <el-button type="primary" @click="goStep(-1)">上一步</el-button>
          <el-button type="primary" @click="createData">保存</el-button>
        </div>
      </template>
    </Secondary>
	</section>
</template>

<script>
import RightsAllocate from './rightsAllocate'
export default {
  data() {
    return {
      // 用户级别类型
      secShow: false, // 是否展示二级编辑页面
      dialogStatus: '',
      fullscreenLoading: false,
      textMap: {
        update: '编辑角色',
        create: '新增角色'
      },
      users: [],
      activeStep: 1,
      total: 0,
      pageNum: 1,
      pageSize: 10,
      editFormRules: {
        name: [
          { required: true, validator: this.noEmpty, message: '角色名不能为空', trigger: 'blur' },
          { required: true, validator: this.noLessThan30, message: '不超过30个字符', trigger: 'blur' }
        ],
        desc: [{ required: true, validator: this.noLessThan200, message: '不超过200个字符', trigger: 'blur' }],
      },
      // 编辑界面数据
      editForm: {
        name: '',
        desc: ''
      }
    }
  },
  components: {RightsAllocate},
  created () {
    this.getUsers()
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
    noLessThan200(rule, value, callback) {
      if (this._isHasVal(value) && value.length > 200) {
        callback(new Error(rule.message))
      } else {
        callback()
      }
    },
    noLessThan30(rule, value, callback) {
      if (this._isHasVal(value) && value.length > 30) {
        callback(new Error(rule.message))
      } else {
        callback()
      }
    },
    formatTime(row) {
      return this._formatTime(row.updateTime, true) || '—'
    },
    formatStatus(row) {
      return row.status === 1 ? '启用' : '禁用'
     },
    // 获取用户列表
    getUsers() {
      const para = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      }
      this.$postJson(this._basePath.ajaxOperationRoleByPage, para).then(res => {
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
    },
    // 显示新增界面
    handleAdd() {
      this.dialogStatus = 'create'
      this.secShow = true
      this.editForm = {
        userName: '',
        phone: '',
        password: '',
        status: 1
      }
    },
    createData: function() {
      const menuList = this.$refs.rights.getParams()
      if (!menuList) return false
      let param = {
        name: this.editForm.name,
        menuList: menuList,
        id: this.editForm.id,
        desc: this.editForm.desc
      }
      this.$post(this._basePath.ajaxOperationRoleSave, param).then(res => {
        if (res.success) {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          this.queryDate()
          this.goback()
        }
      })
    },
    // 新增
    goStep(num) {
      if (this.activeStep === 1) {
        this.editForm.type === 1 && this.$set(this.editFormRules, 'routePath', [])
        this.$refs.editForm.validate(valid => {
          if (valid) {
            this.activeStep = 2
          }
        })
      } else {
        this.activeStep = 1
      }
    },
    goback() {
      this.activeStep = 1
      this.secShow = false
    }
  }
}
</script>

<style lang="stylus">
  @import '~@/assets/css/index'
  #role_allocate
    .toolbar_process 
      margin-top:20px
    .el-steps
      width:80%
      margin:20px auto
    .btns
      mt(30px)
      setMiddle()
    .no_star
      .el-form-item__label:before
        content: ''
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