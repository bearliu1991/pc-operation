<template>
	<section class="app-container">
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters" @submit.native.prevent>
        <el-form-item label="菜单名称" prop="menuCode" placeholder="菜单名称">
					<el-input v-model="filters.menuName" auto-complete="off"></el-input>
        </el-form-item>
        <el-select v-model="filters.roleName">
          <el-option v-for="(item, index) in roles" :key="index" :label="item.name" :value="item.name"></el-option>
        </el-select>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
      <el-table-column prop="roleName" label="角色名称">
			</el-table-column>
      <el-table-column prop="menuName" label="菜单名称">
			</el-table-column>
      <el-table-column prop="menuCode" label="菜单code">
			</el-table-column>
      <el-table-column prop="id" label="授权id">
			</el-table-column>
      <el-table-column prop="roleCode" label="roleCode" >
			</el-table-column>
      <el-table-column prop="roleId" label="roleId">
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<!-- <el-button type="danger" @click="addToRole" :disabled="this.sels.length===0">批量加入角色</el-button> -->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page="pageNum" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="100px" ref="editForm">
        <el-form-item label="角色选择" prop="roleId">
					<el-select v-model="editForm.roleId">
            <el-option v-for="(item, index) in roles" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
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

export default {
  data() {
    return {
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      roles: [],
      editRole: {roleId: 0},
      dialogFormVisible: false,
      filters: {
        roleName: null,
        menuName: null
      },
      users: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      sels: [], // 列表选中列
      editFormRules: {
        requestApi: [{ required: true, message: '请输入路由地址', trigger: 'blur' }],
      },
      // 编辑界面数据
      editForm: {
        roleId: 0,
        menuId: 0
      },
      roleIds: [
        {value: 0, label: '管理员'},
        {value: 1, label: '主管'},
        {value: 2, label: '分级主管'},
        {value: 3, label: '普通员工'}
      ],
      addFormVisible: false, // 新增界面是否显示
      addFormRules: {
        requestApi: [{ required: true, message: '请输入路由地址', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getUsers()
    this.ajaxRoles()
  },
  methods: {
    // 性别显示转换
    handleCurrentChange(val) {
      this.pageNum = val
      this.getUsers()
    },
    // 获取所有角色
    ajaxRoles() {
      this.$post(this._basePath.ajaxAllRole).then(res => {
        this.roles = res.data
      })
    },
    // 获取用户列表
    getUsers() {
      const para = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        roleName: this.filters.roleName,
        menuName: this.filters.menuName
      }
      this.$postJson(this._basePath.ajaxAuthByPage, para).then(res => {
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
          this.$postJson(this._basePath.ajaxDelAuth, para).then(res => {
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
        menuId: 0,
        roleId: 0
      }
    },
    // 编辑
    updateData() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          const para = Object.assign({}, this.editForm)
          
          this.$post(this._basePath.ajaxAuthUpdate, para).then(res => {
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
    // 新增
    createData: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {})
            .then(() => {
              this.editForm.id = (parseInt(Math.random() * 100)).toString() // mock a id
              const para = Object.assign({}, this.editForm)
              this.$post(this._basePath.ajaxSaveAuth, para).then(res => {
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
            })
            .catch(e => {
              // 打印一下错误
              console.log(e)
            })
        }
      })
    },
    // 全选单选多选
    selsChange(sels) {
      this.sels = sels
    },
    // 批量删除
    batchRemove() {
      var ids = this.sels.map(item => item.id).toString()
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          const para = { idList: ids }
          this.$postJson(this._basePath.ajaxAuthDelArr, para).then(res => {
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

</style>