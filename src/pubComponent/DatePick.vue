<template>
  <div id="date_pick" :class="{'mr10': isShowInput}">
    <el-date-picker
      v-if="isShowInput && !isHidden"
      ref="datePicker"
      size="small"
      v-model="timeData"
      :clearable="clearable"
      type="daterange"
      range-separator="~"
      unlink-panels
      @change="inputChange"
      format="yyyy 年 MM 月 dd 日"
      value-format="yyyy-MM-dd"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
    <el-radio-group v-model="timeChoose" v-if="showBtn" @change="dateChange" :size="size" class="radio_group">
      <el-radio-button v-if="has('all')" label="all">全部</el-radio-button>
      <el-radio-button v-if="has('today')" :label="1">今天</el-radio-button>
      <el-radio-button v-if="has('yesterday')" label="yesterday">昨天</el-radio-button>
      <el-radio-button v-if="has('lastWeek')" :label="7">近7天</el-radio-button>
      <el-radio-button v-if="has('last30')" :label="30">近30天</el-radio-button>
      <el-radio-button v-if="has('last90')" :label="90">近90天</el-radio-button>
      <el-radio-button v-if="has('last180')" :label="180">近180天</el-radio-button>
      <el-radio-button v-if="has('last3Month')" label="3M">近3个月</el-radio-button>
      <el-radio-button v-if="has('last6Month')" label="6M">近6个月</el-radio-button>
      <el-radio-button v-if="has('curMonth')" :label="'curMonth'">本月</el-radio-button>
    </el-radio-group>
  </div>
</template>
<script>
  export default {
    name: 'date_pick',
    data() {
      return {
        timeChoose: -1,
        timeData: '',
        typeArr: [1, -1, 7],
        isHidden: false
      }
    },
    model: {
      prop: "reset",
      event: "resetVal"
    },
    props: {
      showArr: {
        type: Array,
        default: () => {return ['today', 'yesterday', 'lastWeek']}
      },
      isLimit: {
        type: Boolean,
        default: false
      },
      maxDays: {
        type: [Number, String],
        default: 31
      },
      exceedTip: {
        type: String,
        default: ''
      },
      isAccurate: {
        type: Boolean,
        default: false
      },
      clearable: {
        type: Boolean,
        default: false
      },
      reset: {
        type: Boolean,
        default: false
      },
      isShowInput: {
        type: Boolean,
        default:true
      },
      showBtn: {
        type: Boolean,
        default:true
      },
      defaultIndex: {
        type: [Number,String],
        default: -1
      },
      size: {
        type: String,
        default: 'small'
      }
    },
    watch: {
      reset() {
        if (this.reset) {
          this.timeData = ''
          this.timeChoose = -1
          this.$emit('resetVal', false)
        }
      }
    },
    created() {
      // this.$nextTick(() => {
        this.timeChoose = this.defaultIndex
        this.$bus.$on('clearDate', () => {
          this.timeData = ''
        })
        this.timeChoose !== -1 && this.setDate()
      // })
    },
    components: {},
    methods: {
      dateChange() {
        this.setDate()
        this.$emit('dateChange')
      },
      // 设置时间
      setDate() {
        const val = this.timeChoose
        let end = new Date()
        let start = new Date()
        this.isHidden = true
        if (val === 'all') {
          this.timeData = ''
        } else if (val === 'yesterday') {
          start.setTime(start.getTime() - 3600 * 1000 * 24)
          this.$set(this, 'timeData', [start, start])
        } else if (val === '3M') {
          this.$set(this, 'timeData', [this._last3Month().last, this._last3Month().now])
        } else if (val === '6M') {
          this.$set(this, 'timeData', [this._last6Month().last, this._last6Month().now])
        } else if (val === 'curMonth') {
          start.setTime(start.getTime() - 3600 * 1000 * 24 * (start.getDate() - 1))
          this.$set(this, 'timeData', [start, end])
        } else {
          // val === 1 && end.setTime(end.getTime() - 3600 * 1000 * 24 * val)
          // if (val === "curMonth") {
          //   start.setTime(start.getTime() - 3600 * 1000 * 24 * (start.getDate() - 1))
          // } else if (val === 0) {
          //   start.setTime(start.getTime())
          // } else {
            start.setTime(start.getTime() - 3600 * 1000 * 24 * (val - 1))
            this.$set(this, 'timeData', [start, end])
          // }
        }
        this.$nextTick(() => {
          this.isHidden = false
        })
      },
      inputChange() {
        this.timeChoose = -1
        this.$emit('dateChange')
      },
      getParams() {
        if (this.isLimit && this.timeData && this.timeData[0] && this.timeData[1]) {
          const days = this._differInDays(this.timeData[0], this.timeData[1])
          if (days > this.maxDays) {
            this.$message.error(this.exceedTip || `时间范围不超过${this.maxDays}天`)
            return false
          }
        }
        
        if (this.isAccurate) return this.timeData ? [this._formatTime(this.timeData[0]) + ' 00:00:00', this._formatTime(this.timeData[1]) + ' 23:59:59'] : [null, null]
        return this.timeData ? [this._formatTime(this.timeData[0]), this._formatTime(this.timeData[1])] : [null, null]
      },
      has(str) {
        return this.showArr.includes(str)
      }
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/css/index'
  #date_pick
    .el-radio-button__orig-radio:checked+.el-radio-button__inner
      bgColor(#409EFF)
      border-color:#409EFF
      box-shadow: -1px 0 0 0 #409EFF
      &:hover
        color()
    .el-radio-button__inner:hover
      color(#409EFF)
    .el-date-editor
      mb(5px)
    .radio_group
      ml(5px)
    .date_segment
      inline()
      fn(0)
      ml(10px)
      li
        cursor()
        border_()
        width:100px
        center()
        radius(3px)
        inline()
        fn(14px)
        &.active
          bgColor(#409EFF)
          color()
</style>