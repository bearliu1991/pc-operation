<template>
  <span id="countDown">
    <el-button type="warning" size="medium" @click="getCode" v-if="!isCounting">获取验证码</el-button>
    <el-button type="info" size="medium" disabled v-else>{{timeNum}}秒后重新获取</el-button>
  </span>
</template>
<script>
  const COUNT = 60
  export default {
    name: '',
    data() {
      return {
        timeNum: '',
        isCounting: false,
        timer: null
      }
    },
    props: {
      count: {
        type: [Number, String],
        default: COUNT
      },
      value: {
        type: [Number, String],
        default: ''
      }
    },
    created() {
      this.$bus.$on('update', () => {
        clearInterval(this.timer)
        this.isCounting = false
        this.timeNum = this.count
      })
      this.timeNum = this.count
    },
    components: {},
    methods: {
      getCode() {
        this.$emit("getCode")
        this.isCounting = true
        this.timer = setInterval(() => {
          if (this.timeNum > 0) {
            this.timeNum--
          } else {
            this.timeNum = this.count
            this.isCounting = false
            clearInterval(this.timer)
          }
        }, 1000)
      }
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/css/index'
</style>