<template>
  <div class="drawer-main">
    <transition name="slide-fade">
      <div class="drawer" @click="clickBody" v-if="showDrawer" :style="{height: height + 'px'}">
        <div class="drawer-wrapper" @click.stop :style="{width: width, minWidth: minWidth, height: height + 'px'}">
          <div class="drawer-title">
            <span>{{title}}</span>
          </div>
          <div class="drawer-content isScroll-content">
            <slot name="header">
            </slot>
            <ScrollBar>
              <slot></slot>
            </ScrollBar>
          </div>
          <div class="footer" v-if="showFooter">
            <el-button @click="$emit('close')">返回</el-button>
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  name: 'drawer',
  data() {
    return {
      height: 0
    }
  },  
  model: {
    prop: "showDrawer",
    event: "close"
  },
  props: {
    showDrawer: {
      default: false,
      type: Boolean
    },
    title: {
      default: 'Title',
      type: String
    },
    showFooter: {
      type: Boolean,
      default: true
    },
    isCloseHeghtLight: {
      type: Boolean,
      default: true
    },
    width: {
      type: String,
      default: '50%'
    },
    minWidth: {
      type: String,
      default: '640px'
    }
  },
  computed: {
    heightLight: {
      get: function () {
        return this.isCloseHeghtLight
      },
      set: function (newValue) {}
    }
  },
  mounted() {
    this.height = document.body.clientHeight
  },
  updated() {
    this.height = document.body.clientHeight
  },
  methods: {
    clickBody() {
      this.heightLight = true
      this.$emit('close', false)
    },
    toggleContainerTouchAction(v) {
      const container = document.querySelector('.drawer-main')
      if (!container) {
        return
      }
      container.style['touch-action'] = v ? 'none' : 'auto'
    },
    stopTouch(e) {
      e.preventDefault()
    }
  },
  watch: {
    showDrawer(val) {
      this.toggleContainerTouchAction(val)
      if (val) {
        document.body.addEventListener('touchmove', this.stopTouch, { passive: false, capture: true })
      } else {
        document.body.removeEventListener('touchmove', this.stopTouch, { capture: true })
      }
      if (!val && this.heightLight) {
        // this.$root.Bus.$emit('drawerClose')
      }
    }
  },
}
</script>
<style lang="stylus">
@import '~@/assets/css/index'


.slide-fade-enter-active, .slide-fade-leave-active
    transition all 0.2s ease-in-out
.slide-fade-enter, .slide-fade-leave-to
  transform translateX(640px)
  
.drawer-main
  .drawer
    position fixed
    top 0
    right 0
    left:0
    bottom 0
    width 100%
    z-index 500
    background-color rgba(255,255,255,0)
    clear()
    .drawer-wrapper
      position relative
      fr()
      height 100%
      background-color #fff
      box-shadow -5px 0px 8px 0px rgba(3, 0, 0, 0.15)
      .drawer-title
        font-size 18px
        padding 20px
        height:59px
        border-bottom solid 1px #edeff0
      .drawer-content
        margin: 0 auto
        margin-bottom 60px
        padding:20px
        // overflow-y:auto
        relative()
        height calc(100% - 119px)
      .footer
        border-top solid 1px #edeff0
        position absolute
        background-color #fff
        left 0
        bottom 0
        width 100%
        height 60px
        line-height 60px
        text-align center
        >div
          height 100%
  
</style>
