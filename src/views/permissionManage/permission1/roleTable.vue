<template>
	<section class="app-container">
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters" @submit.native.prevent>
				<el-form-item>
					<el-input v-model="filters.name" placeholder="角色名"></el-input>
				</el-form-item>
        <el-form-item>
					<el-input v-model="filters.code" placeholder="角色code"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="name" label="角色名称">
			</el-table-column>
      <el-table-column prop="code" label="角色code">
			</el-table-column>
      <el-table-column prop="id" label="角色ID">
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="batchRemove(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar_process">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
				<el-form-item label="角色名" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
        <el-form-item label="角色code" prop="code">
					<el-input v-model="editForm.code" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
			 <el-button @click.native="dialogFormVisible=false">取消</el-button>
			  <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">添加</el-button>
        <el-button v-else type="primary" @click="updateData">修改</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
import util from '@/utils/table.js'
import {
  getUserListPage,
  removeUser,
  batchRemoveUser,
  editUser,
  addUser
} from '@/api/userTable'

export default {
  data() {
    return {
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogFormVisible: false,
      filters: {
        name: '',
        code: ''
      },
      users: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      sels: [], // 列表选中列
      editFormRules: {
        name: [{ required: true, validator: this.noEmpty, message: '请输入角色名', trigger: 'blur' }],
        code: [{ required: true, validator: this.noEmpty, message: '请输入角色code', trigger: 'blur' }]
      },
      // 编辑界面数据
      editForm: {
        name: '',
        code: ''
      },
      addFormVisible: false, // 新增界面是否显示
      addFormRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getUsers()
  },
  methods: {
    // 点击分页码
    handleCurrentChange(val) {
      this.pageNum = val
      this.getUsers()
    },
    // 获取用户列表
    getUsers() {
      let para = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        name: this.filters.name,
        code: this.filters.code
      }
      this.$postJson(this._basePath.ajaxRoleByPage, para).then(res => {
        if (res.success) {
          this.total = res.data.count
          this.users = res.data.datas
        }
      })
    },
    // 删除
    handleDel(index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      })
        .then(() => {
          const para = { id: row.id }
          this.$postJson(this._basePath.ajaxRoleDel, para).then(res => {
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
    // 显示编辑界面
    handleEdit(index, row) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.editForm = Object.assign({}, row)
    },
    // 显示新增界面
    handleAdd() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.editForm = {
        name: '',
        code: ''
      }
    },
    // 编辑
    updateData() {
      // this.editForm = this.trim(this.editForm)
      this.$refs.editForm.validate(valid => {
        if (valid) {
          const {name, code, id} = {...this.editForm}
          let para = {name, code, id}
          this.$post(this._basePath.ajaxSaveRole, para).then(res => {
            if (res.success) {
              this.$message({
                message: '更新成功',
                type: 'success'
              })
              this.$refs['editForm'].resetFields()
              this.dialogFormVisible = false
              this.getUsers()
            }
          })
        }
      })
    },
    // 新增
    createData: function() {
      // this.editForm = this.trim(this.editForm)
      this.$refs.editForm.validate(valid => {
        if (valid) {
          const para = Object.assign({}, this.editForm)
          this.$post(this._basePath.ajaxSaveRole, para).then(res => {
            if (res.success) {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$refs['editForm'].resetFields()
              this.dialogFormVisible = false
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
    // 批量删除
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
          this.$postJson(this._basePath.ajaxRoleDel, para).then(res => {
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
  },
}
</script>

<style scoped>
  .toolbar_process {
    margin-top:20px
  }
</style>