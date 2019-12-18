<template>
  <div id="rights">
    <ul class="first_ul">
      <li>
        <div class="first_div">用户信息</div>
        <div class="sec_div">
          <el-checkbox-group 
            v-model="checkedUsers">
            <el-checkbox v-for="(user, index) in users" :label="user.id" :key="index">{{user.userName}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </li>
      <li>
        <div class="first_div">角色信息</div>
        <div class="sec_div">
          <el-checkbox-group 
            v-model="checkedRoles">
            <el-checkbox v-for="(role, index) in roles" :label="role.id" :key="index">{{role.name}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </li>
      <li>
        <div class="first_div">权限分配</div>
        <div class="sec_div">
          <right-set :isEdit="true"></right-set>
          <!-- <hello></hello> -->
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    name: '',
    data() {
      return {
        roles: [
          {id: 0, name: 'CEO'},
          {id: 1, name: '总监'},
          {id: 2, name: '销售'},
          {id: 3, name: '讲师'},
          {id: 4, name: '运营'}
        ],
        users: [],
        checkedUsers: [],
        checkedRoles: []
      }
    },
    created() {
      this.getUsers()
    },
    components: {},
    methods: {
      getUsers() {
        const para = {
          pageNum: 1,
          pageSize: 9999,
        }
        this.$postJson(this._basePath.ajaxOperationAccountByPage, para).then(res => {
          if (res.success) { // 37BE6E2FA7F070076480DE778498F94E
            this.users = res.data.datas
          }
        })
      }
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/css/index'
  #rights
    .first_ul
      setStart()
      align-items:flex-start
      >li
        border_()
        min-height:500px
        .first_div
          bgColor(#ddd)
          padding:10px
        .el-checkbox-group
          label
            display:block
            margin:0 30px
            .el-checkbox__label
              padl(15px)
        &:first-child
          width:24%
        &:nth-child(2)
          width:24% 
          margin:0 1%
        &:nth-child(3)
          width:49%
</style>