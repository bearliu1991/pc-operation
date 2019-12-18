<template>
  <el-form class="login-form" status-icon :rules="loginRules" ref="loginForm" :model="loginForm" label-width="0">
    <el-form-item prop="phone">
      <el-input size="small" @keyup.enter.native="handleLogin" v-model="loginForm.phone" auto-complete="off" placeholder="请输入用户名">
        <i slot="prefix" class="icon-yonghu"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input size="small" @keyup.enter.native="handleLogin" :type="passwordType" v-model="loginForm.password" auto-complete="off" placeholder="请输入密码">
        <i class="el-icon-view el-input__icon" slot="suffix" @click="showPassword"></i>
        <i slot="prefix" class="icon-mima"></i>
      </el-input>
    </el-form-item>
    <el-checkbox v-if="userType - 6 !== 0" v-model="checked">记住账号</el-checkbox>
    <el-form-item>
      <!-- <el-button type="primary" size="small" @click.native.prevent="handleLogin" class="login-submit">登录1</el-button> -->
      <el-button type="primary" size="small" @click="handleLogin" class="login-submit">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'userlogin',
  data() {
    const validateCode = (rule, value, callback) => {
      if (this.code.value !== value) {
        this.loginForm.code = ''
        this.refreshCode()
        callback(new Error('请输入正确的验证码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        phone: '',
        password: ''
      },
      checked: false,
      code: {
        src: '',
        value: '',
        len: 4,
        type: 'text'
      },
      loginRules: {
        phone: [
          { required: true, validator: this.noEmpty, message: '请输入用户名', trigger: 'blur'}
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur'},
          // { min: 6, message: '密码长度最少为6位', trigger: 'blur' }
        ],
        code: [
          { required: true, validator: this.noEmpty, message: '请输入验证码', trigger: 'blur' },
          // { min: 4, max: 4, message: '验证码长度为4位', trigger: 'blur' },
          // { required: true, trigger: 'blur', validator: validateCode }
        ]
      },
      passwordType: 'password'
    }
  },
  props: ['userType'],
  created() {
    const info = this.getCookie('userMsg')
    if (info) {
      const arr = info.split('&')
      this.$set(this.loginForm, 'phone', arr[0])
      this.$set(this.loginForm, 'password', arr[1])
      this.$set(this, 'checked', !!arr[2])
    }
  },
  mounted() {},
  computed: {
  },
  methods: {
    ...mapMutations([
      'SET_ROUTERS' 
      // 映射 this.increment() 为 this.$store.commit('increment')
    ]),
    showPassword() {
      this.passwordType === ''
        ? (this.passwordType = 'password')
        : (this.passwordType = '')
    },
    // logins() {
    //   const param = {
    //     phone: this.loginForm.username,
    //     password: this.loginForm.password
    //   }
    //   this.$postJson(this._basePath.ajaxLogin, param).then(res => {
    //     if (res.success) {
    //       const data = res.data
    //       this.$message.success('登陆成功')
    //       this.setCookie('userId', data.id)
    //       this.$router.push({ path: '/home'})
    //     }
    //   })
    // },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          const obj = {password: window.md5(this.loginForm.password + this.Const.JointStr)}
          const para = {...{}, ...this.loginForm, ...{userType: this.userType}, ...obj}
          this.$store.dispatch('Login', para).then(res => {
            if (res.success) {
              this.$store.commit('SET_ROUTERS', [])
              const data = res.data
              this.checked ? this.setCookie('userMsg', this.loginForm.phone + '&' + this.loginForm.password + '&' + this.checked, 1000 * 100000) : this.removeCookie('userMsg')
              this.$message.success('登陆成功')
              this.setCookie('userId', data.id)
              this.setCookie('userType', data.userType)
              this.setCookie('stallId', data.stallId)
              this.setCookie('phone', data.phone)
              this.setCookie('bossName', data.userName)
              this.$router.push({ path: '/'})
            }
          })
        }
      })
    }
  }
}
</script>
<style>
</style>
