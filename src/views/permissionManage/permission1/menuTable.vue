<template>
	<section class="app-container">
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters" @submit.native.prevent>
				<el-form-item>
					<el-input v-model="filters.code" placeholder="按钮code"></el-input>
				</el-form-item>
        <el-form-item>
					<el-input v-model="filters.routePath" placeholder="页面路由"></el-input>
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
			<el-table-column type="selection" width="45">
			</el-table-column>
      <el-table-column prop="name" label="菜单名称">
			</el-table-column>
      <el-table-column prop="code" label="菜单code">
			</el-table-column>
      <el-table-column prop="type" label="类型" :formatter="formatType">
			</el-table-column>
      <el-table-column prop="requestApi" label="请求路径">
			</el-table-column>
      <el-table-column prop="system" label="所属系统">
			</el-table-column>
      <el-table-column prop="id" label="ID">
			</el-table-column>
			<el-table-column prop="routePath" label="页面路由">
			</el-table-column>
			<el-table-column prop="icon" label="icon图标">
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
			<el-button type="danger" @click="roleAddDialog" :disabled="this.sels.length===0">角色授权</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

    <!--加入角色-->
    <el-dialog title="加入角色" :visible.sync="isJoin" :close-on-click-modal="false">
			<el-form :model="editRole" label-width="120px" ref="joinForm">
				<el-form-item label="角色选择" prop="name">
					<el-select v-model="editRole.roleId">
            <el-option v-for="(item, index) in roles" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
			 <el-button @click.native="isJoin=false">取消</el-button>
			 <el-button type="primary" @click="joinRole">加入</el-button>
			</div>
		</el-dialog>

    <!-- <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="活动名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="活动区域" prop="region">
        <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
    </el-form> -->

		<!--编辑界面-->
		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="150px" :rules="editFormRules" ref="editForm">
        <el-form-item label="所属系统">
          <el-select v-model="editForm.system" placeholder="请选择活动区域">
            <el-option v-for="(item, index) in systems" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类别">
          <el-select v-model="editForm.type" placeholder="请选择活动区域">
            <el-option v-for="(item, index) in typeOpts" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="editForm.name" placeholder="如: 权限管理-菜单页面-新增菜单"></el-input>
        </el-form-item>
        <el-form-item label="code" prop="code">
          <el-input v-model="editForm.code" placeholder="如: permissionSet-menuPage-addMenu"></el-input>
        </el-form-item>
        <template v-if="editForm.type === 1">
          <el-form-item label="页面路由" prop="routePath">
            <el-input v-model="editForm.routePath" placeholder="如: /home"></el-input>
          </el-form-item>
          <el-form-item label="图标名称">
            <el-input v-model="editForm.icon" placeholder="如: el-icon-info"></el-input>
          </el-form-item>
        </template>
        <template v-if="editForm.type === 2">
          <el-form-item label="请求路径" prop="requestApi">
            <el-input v-model="editForm.requestApi" placeholder="如: /menu/Save.do"></el-input>
          </el-form-item>
        </template>
        <el-form-item label="父ID(parentId)">
          <el-input v-model="editForm.parentId"></el-input>
          <el-tree
            :data="routeList"
            :highlight-current="true"
            :default-expand-all="true"
            :expand-on-click-node="false"
            @node-click="handleNodeClick">
          </el-tree>
          <!-- <el-select v-model="formData.parentId" placeholder="请选择活动区域">
            <el-option v-for="(item, index) in options" :key="index" :label="`父ID: ${item.value}`" :value="item.value"></el-option>
          </el-select> -->
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
import Const from './const'
import {
  getUserListPage,
  removeUser,
  batchRemoveUser,
  editUser,
  addUser
} from '@/api/userTable'
function deepCopy (data) {
  return JSON.parse(JSON.stringify(data))
}
export default {
  data() {
    return {
      editRole: {roleId: null},
      systems: [
        {value: 1, label: '档口'},
        {value: 2, label: '商家'},
        {value: 3, label: '运营'}
      ],
      isJoin: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogFormVisible: false,
      filters: {
        routePath: '',
        code: ''
      },
      users: [],
      roles: [],
      typeOpts: [
        {
          value: 1,
          label: '页面'
        },
        {
          value: 2,
          label: '按钮'
        }
      ],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      sels: [], // 列表选中列
      editFormRules: {
        name: [{ required: true, validator: this.noEmpty, message: '请输入名称', trigger: 'blur' }],
        code: [{ required: true, validator: this.noEmpty, message: '请输入code', trigger: 'blur' }],
        requestApi: [{ required: true, validator: this.noEmpty, message: '请输入请求路径', trigger: 'blur' }],
        routePath: [{ required: true, validator: this.noEmpty, message: '请输入页面地址', trigger: 'blur' }]
      },
      // 编辑界面数据
      editForm: {
        system: 1,
        id: null,
        routePath: '',
        type: 2,
        icon: '',
        code: '',
        parentId: -1,
        name: '',
        requesetApi: ''
      },
      ids: [],
      routeList: [],
      addFormVisible: false, // 新增界面是否显示
      addFormRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.init()
    this.ajaxRoles()
    this.getUsers()
  },
  methods: {
    init() {
      let list = Const.list
      let arrs = deepCopy(list)
      for (let item of arrs) {
        let idx = list.findIndex((val) => {
          return item.id === val.parentId
        })
        if (idx > -1) {
          item.arr ? item.arr.push(arrs[idx]) : item.arr = [arrs[idx]]
          arrs[idx].isDelete = true
        }
      }
      for (let i = arrs.length - 1; i >= 0; i--) {
        if (arrs[i].isDelete) arrs.splice(i, 1)
      }
      this.routeList = this.iterator(arrs)
    },
    // createData: function() {
    //   this.$refs.editForm.validate(valid => {
    //     if (valid) {
    //       const para = Object.assign({}, this.editForm)
    //       this.$post(this._basePath.ajaxSaveRight, para).then(res => {
    //         this.$message({
    //           message: '提交成功',
    //           type: 'success'
    //         })
    //         this.$refs['editForm'].resetFields()
    //         this.dialogFormVisible = false
    //         // this.getUsers()
    //       })
    //     }
    //   })
    // },
    formatType(val) {
      let arr = this.typeOpts.filter((item) => item.value === val.type)
      return  arr[0] ? arr[0].label : ''
    },
    ajaxRoles() {
      this.$post(this._basePath.ajaxAllRole).then(res => {
        this.roles = res.data
      })
    },
    // 弹框加入角色
    joinRole() {
      const para = 
      {
        menuIdList: this.ids,
        roleId: this.editRole.roleId
      }
      this.$post(this._basePath.ajaxAuthAuth, para).then(res => {
        if (res.success) {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          // this.$refs['editForm'].resetFields()
          this.isJoin = false
          this.getUsers()
        }
      })
    },
    roleAddDialog() {
      this.ids = this.sels.map((item) => {
        return item.id
      })
      this.isJoin = true
    },
    handleNodeClick(val) {
      this.$set(this.editForm, 'parentId', val.id)
    },
    iterator (arr) {
      let nothing = []
      if (arr.length) {
        for (let val of arr) {
          if (val.arr) {
            nothing.push({
              label: val.name,
              route: val.routePath,
              icon: val.icon,
              id: val.id,
              children: this.iterator(val.arr)
            })
          } else {
            nothing.push({
              label: val.name,
              icon: val.icon,
              id: val.id,
              route: val.routePath
            })
          }
        }
      }
      return nothing
    },
    formatBool: function(row, column) {
      return row.isShow === true ? '是' : '否'
    },
    // 性别显示转换
    handleCurrentChange(val) {
      this.pageNum = val
      this.getUsers()
    },
    // 获取用户列表
    getUsers() {
      const para = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      }
      let b = this.filters
      this.$postJson(this._basePath.ajaxMenuByPage, {...para, ...b}).then(res => {
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
          this.$postJson(this._basePath.ajaxMenuDel, para).then(res => {
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
        system: 1,
        id: null,
        routePath: '',
        type: 2,
        icon: '',
        code: '',
        parentId: -1,
        name: '',
        requesetApi: ''
      }
    },
    // 编辑
    updateData() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          const para = Object.assign({}, this.editForm)
          this.$post(this._basePath.ajaxSaveMenu, para).then(res => {
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
      // this.editForm.type === 1 && this.$set(this.editFormRules, 'routePath', [])
      this.$refs.editForm.validate(valid => {
        if (valid) {
          const para = Object.assign({}, this.editForm)
          this.$post(this._basePath.ajaxSaveMenu, para).then(res => {
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
          this.$postJson(this._basePath.ajaxMenuDel, para).then(res => {
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
  mounted() {
    this.getUsers()
  }
}
</script>

<style scoped>
  .toolbar_process {
    margin-top:20px
  }
</style>