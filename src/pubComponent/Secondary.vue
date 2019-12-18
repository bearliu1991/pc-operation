<template>
  <div id="secondary">
    <transition name="fade" mode="out-in">
      <div v-show="secShow">
        <div class="title">
          <el-button type="primary" plain="" @click="goBack">返回</el-button>
          <p>|</p>
          <div>{{title}}</div>
        </div>
        <div class="content" :style="{width: width}">
          <slot></slot>
          <div class="footer">
            <slot name="footer"></slot>
          </div>
        </div>
        <!-- <div class="footer">
          <slot name="footer"></slot>
        </div> -->
      </div>
    </transition>
  </div>
</template>
<script>
  export default {
    name: '',
    data() {
      return {

      }
    },
    model: {
      prop: "secShow",
      event: "close"
    },
    props: ['title', 'secShow', 'width'],
    created() {

    },
    components: {},
    methods: {
      goBack() {
        this.$emit('close')
      }
    }
  }
</script>
<style>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .2s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
<style lang="stylus" scoped>
  @import '~@/assets/css/index'
  
  #secondary
    .title
      padding:20px
      padt(0)
      setStart()
      borb()
      p
        margin: 0 20px
    .content
      width:100%
      min-width:400px
      padding:20px
      .footer
        setMiddle()
</style>