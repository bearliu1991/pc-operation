<template>
  <div id="home">
    <OperateIndex v-if="userType !== 1"></OperateIndex>
  </div>
</template>
<script>
  import OperateIndex from './operationManage'
  export default {
    name: '',
    data() {
      return {
        userType: -1
      }
    },
    created() {
      this.userType = this.getCookie('userType') - 0
    },
    components: {OperateIndex},
    methods: {
      
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/css/index'
  #home
    padding:40px
    .home_cont
      center()
      fn(30px)
      margin:50px 0
    .order_info
      h3
        fn(20px)
      ul
        setAround()
        li
          setBetween()
          .icon
            fn(30px)
          .order_route
            setColumn()
            p
              border-bottom: 1px solid #ddd
            i
              color(err_text)
    .stage_info
      li
        padding: 0 20px
        vertical(50px)
        border_()
        &:first-child
          bgColor(#999)
          color()
</style>