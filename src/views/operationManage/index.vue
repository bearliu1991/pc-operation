<template>
  <div id="operate_index">
    <div>现在是: {{_formatTime(new Date(), true)}}</div>
    <div class="home_cont">
      <h1 style>{{`${getCookie('bossName')} (${getCookie('phone')})`}}, 欢迎登陆齐货管家</h1>
    </div>
    <!-- <ul class="stage_info">
      <li>平台信息</li>
      <li v-for="(item, idx) in datas" :key="idx">
        <span>{{item.label}}</span>
        <i>{{item.value}}</i>
      </li>
    </ul> -->
  </div>
</template>
<script>
  export default {
    name: '',
    data() {
      return {
        userType: -1,
        datas: [
          {label: '商户名称', value: '胖胖家'},
          {label: '当前所在', value: '档口管家'},
          {label: '上次登录时间', value: '2019-1-1'},
          {label: '网站域名', value: 'qhgj888.com'},
          {label: '平台版本', value: 'QHGJ V1.0'},
        ]
      }
    },
    created() {
      this.userType = this.getCookie('userType') - 0
    },
    methods: {
      
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/css/index'
  #operate_index
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