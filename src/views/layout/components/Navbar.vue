<template>
  <el-menu class="navbar" mode="horizontal">
    <span class="icon hamburger-container" @click="toggleSideBar" :class="[sidebar.opened && 'inactive']">&#xe610;</span> 
    <!-- &#xe667; -->
    <nx-breadcrumb class="breadcrumb-container"></nx-breadcrumb>
    <div class="right-menu">
      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper set_middle">
          <!-- <img class="user-avatar" src="/static/img/home.png"> -->
          <svg class="icon svg-icon" aria-hidden="true">
            <use xlink:href="#iconyonghu"></use>
          </svg>
          <span class="phone">{{getCookie('phone')}}</span>
          <i class="el-icon-caret-bottom"></i>
        </div>
        <!-- <div class="set_start">
          
        </div> -->
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-if="userType === 1" style="padding: 0 0">
            <span @click="pswDialog = true" style="text-align:center; width:100%;padding:0 20px">设置密码</span>
          </el-dropdown-item>
          <el-dropdown-item style="padding: 0 0">
            <span @click="logout" style="text-align:center; display:block; padding:0 20px">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import nxBreadcrumb from '@/components/nx-breadcrumb'
export default {
  name: 'navBar',
  data() {
    return {
      stallId: 0,
      userType: -1,
      pswDialog: false,
    }
  },
  components: {
    nxBreadcrumb
  },
  computed: {
    ...mapGetters(['sidebar', 'name', 'avatar', 'userInfo'])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then((res) => {
        if (res.success) {
          if (this.getCookie('userType') === '6') {
            this.logoutClearCookie()
            this.$router.replace('/loginAdmin')
          } else {
            this.logoutClearCookie()
            this.$router.replace('/login')
          }
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 50px;
    height: 50px;
    font-size:24px;
    float: left;
    padding: 0 10px;
    cursor:pointer
  }
  .hamburger-container.inactive {
    transform:rotate(180deg)
  }
  .hamburger-container {
    transition: 0.38s;
    transform:rotate(0deg)
  }
  .breadcrumb-container {
    float: left;
  }
  .nx-help {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international {
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        // margin-top: 5px;
        align-items:center;
        position: relative;
        .svg-icon {
          width:30px;
          height:30px;
        }
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .phone {
          margin-left:5px;
          margin-right:10px;
        }
        .el-icon-caret-bottom {
          // position: absolute;
          // right: -20px;
          // top: 10px;
          font-size: 12px;
        }
      }
    }
  }
  .stall_aplly{
    width:200px;
    display:flex;
    align-items:center;
    margin-right:20px;
    button{
      margin-left:10px
    }
  }
}
</style>
