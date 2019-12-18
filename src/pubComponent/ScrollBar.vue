<template>
  <div class="wrapper-scroll" ref="wrapperScroll">
    <div class="main-wrapper" ref="mainWrapper" @touchstart="recordStart($event)">
      <slot></slot>
    </div>
    <div class="scroll-bar-out" ref="out">
      <div class="scroll-bar-in" ref="in" @mousedown.prevent="mousedownBar">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    dropHeight: {
      type: Number,
      default: 0
    },
    pullHeight: {
      type: Number,
      default: 0
    },
    maxHeight: {
      type: Number,
      default: 0
    },
    isBottom: {
      type: Boolean,
      default: false
    },
    // 滚动条宽度
    scrollWidth: {
      type: Number,
      default: 6
    },
    // 滚动条颜色
    scrollColor: {
      type: String,
      default: 'rgba(0, 0, 0, 0.4)'
    },
    // 自动渲染
    isAuto: {
      type: Boolean,
      default: true
    },
    // 自动渲染
    isTop: {
      type: Boolean,
      default: false
    },
    scroHeight: {
      type: Number,
      default: 0
    },
    isContextMenu: {
      type: Boolean,
      default: false
    },
    pulling: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      out: null, // scrollbar总内容
      con: null, // 被包裹的内容
      box: null, // 滚动条部分总轨道
      drag: null, // 滚动条导轨
      beforeHeight: 0,
      isPulling: false,
      preHeight: 0,
      startY: 0
    }
  },
  updated() {
    if (this.isAuto) {
      this.$nextTick(() => {
        this.calcHeight()
        if (this.con) {
          this.preHeight = this.preHeight || this.con.clientHeight
          if (this.con.clientHeight - this.preHeight > 0) {
            this.pulling &&
              this.setPosition(this.con.clientHeight, this.preHeight)
          }
          this.isBottom && this.setBottom()
          this.isTop && this.setTop()
        }
      })
    }
  },
  created() {
    this.$bus.$on('calcScrollHeight', () => {
      setTimeout(() => {
        this.calcHeight()
      },50)
    })
  },
  destroyed() {
    this.$bus.$off('calcScrollHeight')
  },
  mounted() {
    setTimeout(() => {
      this.calcHeight()
      let self = this
      this.$nextTick(() => {
        this.mousewheelScroll()
        self.isBottom && self.setBottom()
        self.isTop && self.setTop()
        this.initScrollStyle()
      })
    }, 1)
    window.addEventListener('resize', () => {
      this.calcHeight()
    })
  },
  methods: {
    recordStart(e) {
      // let target = e.target
      // if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA') {
      //   // e.preventDefault()
      // }
      this.startY = e.changedTouches[0].pageY
    },
    setPosition(nowVal, preVal) {
      let self = this
      self.con && (self.con.style.top = preVal - nowVal + 'px')
      this.$nextTick(() => {
        self.drag && (self.drag.style.top =
          (self.box.clientHeight - self.drag.clientHeight) *
            (nowVal - preVal) /
            (nowVal - self.box.clientHeight) +
          'px')
      })
    },
    // 更新
    updated() {
      let self = this
      this.$nextTick(() => {
        self.calcHeight()
        self.isBottom && self.setBottom()
        self.isTop && self.setTop()
      })
    },
    // 初始化滚动条样式
    initScrollStyle() {
      this.box && (this.box.style.width = this.scrollWidth + 2 + 'px')
      if (this.drag) {
        this.drag.style.width = this.scrollWidth + 'px'
        this.drag.style.backgroundColor = this.scrollColor
        this.drag.style.opacity = 0
      }
    },
    mousedownBar(ev) {
      if (this.con.clientHeight - this.out.clientHeight > 0) {
        let e = ev || window.event
        if (e.preventDefault) {
          e.preventDefault()
        } else {
          e.returnValue = false
        }
        let dbkt = e.clientY - this.drag.offsetTop
        document.onmousemove = document.ontouchmove = ev => {
          let e = ev || window.event
          let top = e.clientY - dbkt
          if (top <= 0) {
            top = 0
          }
          if (top >= this.box.clientHeight - this.drag.clientHeight) {
            top = this.box.clientHeight - this.drag.clientHeight
          }
          let scale = top / (this.box.clientHeight - this.drag.clientHeight)
          let cony = scale * (this.con.clientHeight - this.out.clientHeight)
          this.drag.style.top = top + 'px'
          this.con.style.top = -cony + 'px'
          if (-top <= this.pullHeight) {
            this.$emit('pullLoading')
          }
          if (
            -top + this.drag.clientHeight >=
            this.box.clientHeight - this.dropHeight
          ) {
            this.$emit('dropLoading')
          }
        }
        document.onmouseup = document.ontouchend = function() {
          document.onmousemove = null
        }
      }
    },
    // 位置top
    setTop() {
      this.con.style.top = 0
      this.drag.style.top = 0
    },
    // 初始位置设为底部
    setBottom() {
      let self = this
      let timer = setTimeout(function() {
        if (self.con.clientHeight > self.out.clientHeight) {
          self.con.style.top =
            self.out.clientHeight - self.con.clientHeight + 'px'
          self.drag.style.top =
            self.box.clientHeight -
            self.drag.clientHeight -
            self.scroHeight /
              (self.con.clientHeight - self.box.clientHeight) *
              self.scroHeight +
            'px'
        } else {
          self.con.style.top = 0
          self.drag.style.top = 0
        }
        clearTimeout(timer)
      })
    },
    // 鼠标滑轮滚动
    mousewheelScroll() {
      let str = window.navigator.userAgent.toLowerCase()
      let self = this
      if (str.indexOf('firefox') !== -1) {
        // 火狐浏览器
        this.out.addEventListener(
          'DOMMouseScroll',
          e => {
            self.$emit('hideContextMenue')
            if (this.con.clientHeight - this.out.clientHeight > 0) {
              e.preventDefault() // 阻止窗口默认的滚动事件
              if (e.detail < 0) {
                this.calcPullProgress(40)
              }
              if (e.detail > 0) {
                this.calcDropProgress(40)
              }
            }
          },
          false
        )
      } else {
        // 非火狐浏览器
        this.out.onmousewheel = this.out.ontouchmove = ev => {
          self.$emit('hideContextMenue')
          let e = ev || window.event
          if (this.con.clientHeight - this.out.clientHeight > 0) {
            if (e.preventDefault) {
              e.preventDefault()
            } else {
              e.returnValue = false
            }
            if (e.wheelDelta) {
              if (e.wheelDelta > 0) {
                this.calcPullProgress(40)
              }
              if (e.wheelDelta < 0) {
                this.calcDropProgress(40)
              }
            } else {
              let moveEndY = e.changedTouches[0].pageY
              if (moveEndY - this.startY > 0) {
                this.calcPullProgress(10)
              } 
              if (moveEndY - this.startY < 0) {
                this.calcDropProgress(10)
              }
            }
          }
        }
      }
    },
    // 计算滚动条下拉的top和内容高度的比例的关系
    // num是每次滚动的高度
    calcDropProgress(num) {
      let t = this.con.offsetTop - num
      if (t >= 0) {
        t = 0
      }
      if (t <= -(this.con.clientHeight - this.out.clientHeight)) {
        t = -(this.con.clientHeight - this.out.clientHeight)
      }
      let scale = t / (this.con.clientHeight - this.out.clientHeight)
      let top = scale * (this.box.clientHeight - this.drag.clientHeight)
      this.con.style.top = t + 'px'
      this.drag.style.top = -top + 'px'
      if (
        -top + this.drag.clientHeight >=
        this.box.clientHeight - this.dropHeight
      ) {
        // 当滚动到指定位置派发下拉事件
        this.$emit('dropLoading')
      }
    },
    // 计算滚动条上拉的top和内容高度的比例的关系
    // num是每次滚动的高度
    calcPullProgress(num) {
      let t = this.con.offsetTop + num
      if (t >= 0) {
        t = 0
      }
      if (t <= -(this.con.clientHeight - this.out.clientHeight)) {
        t = -(this.con.clientHeight - this.out.clientHeight)
      }
      this.preHeight = this.con.clientHeight
      let scale = t / (this.con.clientHeight - this.out.clientHeight)
      let top = scale * (this.box.clientHeight - this.drag.clientHeight)
      this.con.style.top = t + 'px'
      this.drag.style.top = -top + 'px'
      if (-top <= this.pullHeight) {
        // 当滚动到指定位置派发上滑事件
        if (!this.isPulling) {
          let self = this
          self.isPulling = true
          let timer = setTimeout(() => {
            self.$emit('pullLoading')
            self.isPulling = false
            clearTimeout(timer)
          }, 1000)
        }
      }
    },
    // 计算内容高度
    calcHeight() {
      let self = this
      this.$nextTick(() => {
        self.out = self.$refs.wrapperScroll
        self.con = self.$refs.mainWrapper
        self.box = self.$refs.out
        self.drag = self.$refs.in
        if (self.out && self.con && self.box && self.drag) {
          self.box.style.display = 'block'
          if (
            self.con.clientHeight + parseFloat(self.con.style.top) <
            self.out.clientHeight
          ) {
            if (self.con.clientHeight > self.out.clientHeight) {
              self.con.style.top =
                self.out.clientHeight - self.con.clientHeight + 'px'
            } else {
              self.con.style.top = 0
            }
          }
          self.drag.style.height =
            self.out.clientHeight /
              self.con.clientHeight *
              self.box.clientHeight +
            'px'
          if (self.out.clientHeight - self.con.clientHeight >= 0) {
            self.box.style.display = 'none'
          }
          if (self.maxHeight > 0) {
            if (self.con.clientHeight <= self.maxHeight) {
              self.out.style.height = self.con.clientHeight + 'px'
            } else {
              self.out.style.height = self.maxHeight + 'px'
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.wrapper-scroll
  width 100%
  height 100%
  position relative
  overflow hidden
  .main-wrapper
    position absolute
    left 0
    right 0
  .scroll-bar-out
    position absolute
    right 0
    top 0
    height 100%
    width 8px
    .scroll-bar-in
      position absolute
      width 6px
      height 0
      background rgba(0, 0, 0, 0)
      left 1px
      top 0px
      border-radius 6px
      transition background 0.1s
.wrapper-scroll:hover
  .scroll-bar-out
    .scroll-bar-in
      background rgba(0, 0, 0, 0.4)
      opacity 1 !important
</style>
