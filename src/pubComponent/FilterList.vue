<template>
  <div id="filter_list">
    <span class="other_item">{{title}}: </span>
    <el-badge :value="item.num" :max="99" class="filter_item" v-for="(item, index) in filterList" :key="index">
      <el-button type="primary" :size="size" :plain="activeIndex !== index" @click="emitFilter(item, index)">{{item.name}}</el-button>
    </el-badge>
  </div>
</template>
<script>
  export default {
    name: '',
    data() {
      return {
        curFilter: {},
        activeIndex: 0
      }
    },
    props: {
      title: {
        type: String,
        default: '其他类目'
      },
      size: {
        type: String,
        default: 'medium'
      },
      filterList: {
        type: Array,
        default: () => {}
      }
    },
    created() {
      this.curFilter = this.filterList[0].filterVal
    },
    methods: {
      emitFilter(item, index) {
        if (index !== this.activeIndex) {
          this.curFilter = item.filterVal
          this.activeIndex = index
          this.$emit('filterChange', this.curFilter)
        }
      },
      getParams() {
        return this.curFilter
      }
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/css/index'
  #filter_list
    mb(20px)
    padt(10px)
    padb(10px)
    bort(1px dashed #ddd)
    .filter_item
      margin:5px 8px
      &:last-child
        border:none
</style>