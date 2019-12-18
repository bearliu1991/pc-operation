<template>
    <div class="menu_tree">
      <div class="tree_container">
        <div class="tree_part" :props="defaultProps">
          <el-tree
            ref="tree"
            :data="treeData"
            node-key="id"
            default-expand-all
            show-checkbox
            highlight-current
            :default-checked-keys="checkedKeys"
            :expand-on-click-node="false">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ data.name }}</span>
            </span>
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
          // 所属系统
          defaultProps: {
            label: 'name'
          },
        }
      },
      props: {
        treeData: {
          type: Array,
          default: () => []
        },
        checkedKeys: {
          type: Array,
          default: () => []
        }
      },
      methods: {
        getParams() {
          return this.$refs.tree.getCheckedKeys(true)
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