<template>
    <div class="menu_tree">
      <!-- <el-form :model="querys">
        <el-select v-model="querys.roleId">
          <el-option v-for="(item, index) in roles" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-button type="primary" @click="getUsers">查询</el-button>
      </el-form> -->
      <div class="tree_container">
        <div class="tree_part" :props="defaultProps">
          <el-tree
            ref="tree"
            :data="treeData"
            node-key="id"
            default-expand-all
            show-checkbox
            highlight-current
            @node-click="handleNodeClick"
            @check="checkChange"
            :expand-on-click-node="false">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ data.name }}</span>
              <span>
                <el-button
                  type="primary"
                  size="mini"
                  @click.stop="() => append(data, node)" round>
                  <span>+</span>
                </el-button>
                <el-button
                  type="primary"
                  size="mini"
                  @click.stop="() => append(data, node, true)" round>
                  <span>edit</span>
                </el-button>
                <el-button
                  v-if="isDev"
                  type="danger"
                  size="mini"
                  @click.stop="() => remove(node, data)" round>
                  <span>-</span>
                </el-button>
                <el-button
                  type="primary"
                  size="mini"
                  :disabled="moveIconShow(data, node)"
                  @click.stop="getNode(data, node)">
                  <span class="icon">&#xe636;</span>
                </el-button>
                <el-button
                  type="primary"
                  size="mini"
                  :disabled="moveIconShow(data, node, true)"
                  @click.stop="getNode(data, node, true)">
                  <span class="icon">&#xe637;</span>
                </el-button>
              </span>
            </span>
          </el-tree>
        </div>
        <div class="forms" v-show="isShowForm">
          <h3>节点详情</h3>
          <el-form :model="details" label-width="150px">
            <el-form-item label="类别: ">
              <p>{{formatType(details.type)}}</p>
            </el-form-item>
            <el-form-item label="名称: " prop="name">
              <p>{{details.name}}</p>
            </el-form-item>
            <el-form-item label="code: " prop="code">
              <p>{{details.code}}</p>
            </el-form-item>
            <el-form-item label="code: " prop="code">
              <p>{{details.id}}</p>
            </el-form-item>
            <template v-if="details.type === 2">
              <el-form-item label="请求路径" prop="requestApi">
                <p>{{details.requestApi}}</p>
              </el-form-item>
            </template>
            <template v-if="details.type === 1">
              <el-form-item label="页面路由: " prop="routePath">
                <p>{{details.routePath}}</p>
              </el-form-item>
              <el-form-item label="图标名称: ">
                <p>{{details.icon}}</p>
              </el-form-item>
            </template>
            <el-form-item label="系统选择">
              <p>{{details.system}}</p>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!-- <el-button type="primary" class="joinRole" @click="isJoin = true" :disabled="sels.length===0">批量授权角色</el-button> -->
      <el-button type="danger" class="joinRole" @click="remove" :disabled="sels.length===0">批量删除</el-button>
      <!--加入角色-->
      <!-- <el-dialog title="加入角色" :visible.sync="isJoin" :close-on-click-modal="false">
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
      </el-dialog> -->
      <Drawer v-model="showDrawer" title="菜单设置"></Drawer>
      <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
        <el-form :model="editForm" label-width="150px" :rules="editFormRules" ref="editForm">
          <el-form-item label="类别">
            <el-radio v-model="editForm.type" :label="1">页面</el-radio>
            <el-radio v-model="editForm.type" :label="2">按钮</el-radio>
            <el-radio v-model="editForm.type" :label="0">系统</el-radio>
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="editForm.name" placeholder="如: 权限管理-菜单页面-新增菜单"></el-input>
          </el-form-item>
          <el-form-item label="code" prop="code">
            <span v-if="editForm.parentId === -1">{{editForm.code}}</span>
            <el-input v-if="editForm.parentId !== -1" v-model="editForm.code" placeholder="如: permissionSet-menuPage-addMenu"></el-input>
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
          <el-form-item label="系统选择">
            <el-select v-model="editForm.system">
              <el-option v-for="(item, index) in systems" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="dialogFormVisible = false">取消</el-button>
          <el-button v-if="dialogStatus=='新增'" type="primary" @click="saveData">添加</el-button>
          <el-button v-else type="primary" @click="saveData">修改</el-button>
        </div>
      </el-dialog>
      <!-- <img src="https://img.alicdn.com/imgextra/i4/805486201/O1CN018Ehdex1vg6TnkzmDO_!!805486201.jpg"> -->
    </div>
</template>

<script>
    export default {
      name: 'baseform',
      data: function() {
        return {
          isDev: process.env.NODE_ENV === 'development',
          // 所属系统
          currentNode: {},
          showDrawer: false,
          // 系统设置
          systemShow: false,
          systems: [
            {label: "档口后台", value: 1},
            {label: "一体机", value: 2},
            {label: "报货系统", value: 3},
            {label: "pda", value: 4},
            {label: "运营系统", value: 5},
            {label: "超级管理系统", value: 6},
            {label: "小程序老板", value: 7}
          ],
          roles: [],
          editRole: {roleId: null},
          isJoin: false,
          isEdit: false,
          isShowForm: false,
          dialogFormVisible: false,
          processNode: '',
          processParentNode: '',
          dialogStatus: '',
          sels: [],
          editFormRules: {
            name: [{ required: true, validator: this.noEmpty, message: '请输入名称', trigger: 'blur' }],
            code: [{ required: true, validator: this.noEmpty, message: '请输入code', trigger: 'blur' }],
            routePath: [{ required: true, validator: this.noEmpty, message: '请输入页面地址', trigger: 'blur' }],
            requestApi: [{ required: true, validator: this.noEmpty, message: '请输入请求路径', trigger: 'blur' }]
          },
          defaultProps: {
            label: 'name'
          },
          // 编辑界面数据
          editForm: {
            id: null,
            routePath: '',
            requestApi: '',
            system: 1,
            type: 1,
            icon: '',
            code: '',
            parentId: -1,
            name: ''
          },
          details: {},
          querys: {roleId: ''},
          typeOpts: [
            {
              value: 0,
              label: '系统'
            },
            {
              value: 1,
              label: '页面'
            },
            {
              value: 2,
              label: '按钮'
            },
          ],
          treeData: [
            {
              name: 'Root',
              id: -1,
              children: [

              ]
            }
          ]
        }
      },
      created() {
        // this.ajaxRoles()
        this.getUsers()
      },
      methods: {
        formatType(type) {
          return type === 1 ? '页面' : type === 2 ? '按钮' : '系统'
        },
        moveIconShow(data, node, isUp) {
          let parentNode = node.parent
          let childNodes = parentNode.childNodes
          let childDatas = childNodes.map(item => item.data)
          const index = childDatas.findIndex(item => item.id === data.id)
          if (isUp) {
            return index === 0
          } else {
            return index === childDatas.length - 1
          }
        },
        clearForm() {
          this.editForm = {
            id: null,
            routePath: '',
            requestApi: '',
            system: 1,
            type: 1,
            icon: '',
            code: '',
            name: ''
          }
        },
        getNode(data, node, isUp) {
          let parentNode = node.parent
          let childNodes = parentNode.childNodes
          let childDatas = childNodes.map(item => item.data)
          const index = childDatas.findIndex(item => item.id === data.id)
          // 上移
          if (isUp && (index !== 0)) {
            const param = {
              moveMenuId: childDatas[index].id,
              unMoveMenuId: childDatas[index - 1].id
            }
            this.$postJson(this._basePath.ajaxMoveMenu, param).then(res => {
              if (res.success) {
                childNodes.splice(index - 1, 0, childNodes[index])
                childNodes.splice(index + 1, 1)
              }
            })
          } else if (!isUp && (index !== childDatas.length - 1)) { // 下移
            const param = {
              moveMenuId: childDatas[index].id,
              unMoveMenuId: childDatas[index + 1].id
            }
            this.$postJson(this._basePath.ajaxMoveMenu, param).then(res => {
              if (res.success) {
                childNodes.splice(index, 0, childNodes[index + 1])
                childNodes.splice(index + 2, 1)
              }
            })
          }
        },
        ajaxRoles() {
          this.$post(this._basePath.ajaxAllRole).then(res => {
            if (res.success) {
              this.roles = res.data
            }
          })
        },
        joinSystem() {

        },
        checkChange(checkedNodes, checkedKeys) {
          this.sels = this.$refs.tree.getCheckedKeys(true)
        },
        // 保存表单数据
        saveData: function() {
          this.$refs.editForm.validate(valid => {
            if (valid) {
              let para = Object.assign({}, this.editForm)
              let arr = this.processNode.children
              let maxOrderNum
              if (arr && arr.length) {
                maxOrderNum = arr.sort((a, b) => {a.orderNumber - a.orderNumber})[arr.length - 1].orderNumber + 1
              } else {
                maxOrderNum = 0
              }
              
              para.parentId = this.isEdit ? this.processNode.parentId : this.processNode.id
              this.editForm.orderNumber === undefined && (para.orderNumber = maxOrderNum)

              this.$post(this._basePath.ajaxSaveMenu, para).then(res => {
                if (res.success) {
                  this.$message({
                    message: '提交成功',
                    type: 'success'
                  })
                  const newId = res.data
                  if (this.isEdit) {
                    for (let key in this.processNode) {
                      this.$set(this.processNode, key, this.editForm[key])
                    }
                  } else {
                    const newChild = Object.assign(this.editForm, {parentId: para.parentId}, {id: newId}, {orderNumber: para.orderNumber})
                    if (!this.processNode.children) {
                      this.$set(this.processNode, 'children', []);
                    }
                    this.processNode.children.push(newChild)
                  }
                  this.$refs['editForm'].resetFields()
                  this.dialogFormVisible = false
                  this.isEdit = false
                  this.getUsers()
                }
              })
            }
          })
        },
        handleNodeClick(obj, node, self) {
          this.isShowForm = true
          this.details = obj
        },
        formatData(arrs) {
          for (let item of arrs) {
            const idxs = arrs.filter((val) => {
              return item.id === val.parentId
            })
            for (let idx of idxs) {
              item.children ? item.children.push(idx) : item.children = [idx]
              idx.isDelete = true
            }
          }
          for (let i = arrs.length - 1; i >= 0; i--) {
            if (arrs[i].isDelete) arrs.splice(i, 1)
          }
          return arrs.sort((a,b) => {a.orderNumber - b.orderNumber})
        },
        // 弹框加入角色
        joinRole() {
          const para = { menuIdList: this.sels, roleId: this.editRole.roleId }
          this.$post(this._basePath.ajaxAuthAuth, para).then(res => {
            this.$message({message: '提交成功',type: 'success'})
            this.isJoin = false
            this.getUsers()
          })
        },
        // 获取用户列表
        getUsers() {
          // 请求数据
          this.$postJson(this._basePath.ajaxAllMenuForTree).then(res => {
            this.users = res.data
            let treeTem = this.formatData(this.users)
            this.treeData[0].children = treeTem
          })
        },
        // 显示编辑界面
        append(data, node, isEdit) {
          this.isEdit = isEdit
          this.dialogStatus = this.isEdit ? '编辑' : '新增'
          this.dialogFormVisible = true
          this.editForm = this.isEdit ? Object.assign({}, data) : {
            id: null,
            routePath: '',
            requestApi: '',
            system: 1,
            type: 1,
            icon: '',
            code: '',
            name: ''
          }
          this.processNode = data
          // this.processParentNode = node.parent
        },
        remove(node, data) {
          let ids = data ? data.id : this.sels
          this.$confirm('确认删除该记录吗?', '提示', {
            type: 'warning'
          })
            .then(() => {
              const para = { idList: ids.toString() }
              this.$postJson(this._basePath.ajaxMenuDel, para).then(res => {
                if (res.success) {
                  this.$message({
                    message: '删除成功',
                    type: 'success'
                  })
                  if (data) {
                    const parent = node.parent
                    const children = parent.data.children || parent.data
                    const index = children.findIndex(d => d.id === data.id)
                    children.splice(index, 1)
                  } else {
                    for (let item of this.$refs.tree.getCheckedNodes(true)) {
                      this.$refs.tree.remove(item)
                    }
                  }
                }
              })
            })
            .catch(() => {})
        }
      }
    }
</script>
<style>
  /* .menu_tree .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
    background-color: blue
  } */
</style>
<style scoped lang="stylus">
  @import '~@/assets/css/index'
  .menu_tree
    .el-dialog__wrapper
      .el-form-item
          margin:20px
  
  .menu_tree
    padding:20px
    .tree_container
      radius(5px)
      setStart()
      align-items:flex-start
      border_()
      mb(20px)
      .tree_part
        width:500px
        padding 50px
      .forms
        border_()
        width:500px
        padding 50px
        h3
          center()
        button
          ml(150px)
    .custom-tree-node
      flex: 1
      display: flex
      align-items: center
      justify-content: space-between
      font-size: 14px
      padding-right: 8px
      button
        height:16px
        padding:0 8px
        line-height:10px
        fn(12px)
</style>