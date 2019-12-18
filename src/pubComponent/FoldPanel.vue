<template>
  <div id="fold-panel">
    <div class="fold-title" @click="packUpToogle">
      <slot name="title"></slot>
      <i class="el-icon-arrow-up chevron" :class="{chevronAnimate: !foldStatu}"></i>
    </div>
    <div class="fold-container" ref="container" :class="{'fold-pick-up': !foldStatu}">
      <slot name="container"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'foldPanel',
  props: {
    isFold: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      foldStatu: this.isFold
    }
  },
  mounted() {},
  methods: {
    packUpToogle() {
      this.foldStatu = !this.foldStatu
      this.$root.Bus.$emit('calcScrollHeight')
    }
  }
}
</script>

<style lang="stylus">
#fold-panel
  .fold-title
    padding 21px 0
    position relative
    cursor pointer
    border-bottom solid 1px #e3e4e6
    .chevron
      color #409eff
      position absolute
      right 5px
      top 44px
      transition all 0.2s
    .chevronAnimate
      transform rotateZ(-180deg)
  .fold-container
    position relative
    max-height 196px
    overflow hidden
    transition all 0.2s
    &.fold-pick-up
      max-height 0
</style>

