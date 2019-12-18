<template>
    <div class="menu_tree" v-loading="loading" ref="menu_tree">
      <div class="tree_container" v-for="(tree, index) in trees">
        <div class="tree_part">
          <el-tree
            :ref="'tree' + index"
            :data="tree"
            node-key="id"
            default-expand-all
            show-checkbox
            :props="defaultProps"
            highlight-current
            @check-change="checkChange"
            >
          </el-tree>
        </div>
      </div>
    </div>
</template>

<script>
    export default {
      name: 'baseform',
      data: function() {
        return {
          // 系统设置
          isEdit: false,
          sels: [],
          loading: false,
          defaultProps: {
            label: 'name'
          },
          trees: [],
        }
      },
      props: {
        curItem: {
          type: Object,
          default: () => {}
        }
      },
      created() {
        if (this.curItem.id !== undefined) {
          Promise.all([this.getChoosedMenuIds(), this.getUsers()]).then((res) => {
            this.$nextTick(() => {
              let choosedMenu = res[0]
              let allMenu = res[1]
              const defaultCheckedKeys = choosedMenu.map((item) => item.menuId)
              for (let key in this.$refs) {
                for (let item of defaultCheckedKeys) {
                  this.$refs[key] && this.$refs[key][0] && this.$refs[key][0].setChecked(item, true)
                }
              }
            })
          }).catch((error) => {
            console.log(error)
          })
        } else {
          this.getUsers()
        }
      },
      methods: {
        checkChange(checkedNodes, checkedKeys) {
          this.sels = []
          for (let key in this.$refs) {
            if (this.$refs[key] && this.$refs[key][0]) {
              const fn = this.$refs[key][0].getCheckedNodes
              if (fn) {
                this.sels = this.sels.concat(fn(false, true))
              }
            }
          }
        },
        getParams: function() {
          // if (!this.sels.length) {
          //   this.$message.error('至少选择一个权限')
          //   return false
          // }
          return this.sels || []
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
        // 获取用户列表
        getChoosedMenuIds() {
          return new Promise((resolve, reject) => {
            this.$postJson(this._basePath.ajaxOperationGetValidRightsByRoleId, {roleId: this.curItem.id}).then(res => {
              res.success ? resolve(res.data) : reject()
            })
          })
        },
        getUsers() {
          this.loading = true
          return new Promise((resolve, reject) => {
            this.$postJson(this._basePath.ajaxAllocateRights, {systems: [5].toString()}).then(res => {
              this.loading = false
              if (res.success) {
                resolve(res.data)
                const exceptionArr = ['childAccount']
                this.users = []
                res.data.forEach((item) => {
                  !exceptionArr.includes(item.code) && this.users.push(item)
                })
                const arr = this.formatData(this.users)
                let a = []
                for (let item of arr) {
                  a.push([item])
                }
                this.trees = a
              } else {
                reject()
              }
            })
          })
        }
      }
    }
</script>
<style scoped lang="stylus">
  @import '~@/assets/css/index'
  .menu_tree
    .el-dialog__wrapper
      .el-form-item
        margin:20px
  
  .menu_tree
    padding:0 20px
    height:600px
    overflow-y: auto
    border_()
    setBetween()
    align-items:stretch
    .tree_container
      boxSizing()
      align-content: stretch
      padding: 10px
      flex:1
      borr()
      &:last-child
        borr(0)
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