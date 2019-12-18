<template>
  <div id="table_records">
    <div class="record_wrap">
      <div class="record_wrap_first">
        <span class="icon">&#xe645;</span> 共<i> {{total}} </i>条记录
      </div>
      <div class='record_wrap_sec'>
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: '',
    data() {
      return {

      }
    },
    props: {
      total: {
        type: [String, Number],
        default: 0
      }
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/css/index'
    #table_records
      float:left
      width:100%
      &:before
        display:table
        content: ''
      .record_wrap
        background-color: #BAE7FF
        height:50px
        line-height:50px
        margin-bottom:10px
        padding: 0 15px
        setBetween()
        .record_wrap_first
          i
            color: #409eff
        .record_wrap_sec
          setEnd()
</style>
