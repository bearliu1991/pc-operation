<template>
  <div id="good_detail_set">
    <el-table
      :data="tableData"
      :span-method="objectSpanMethod"
      border
      style="width: 98%">
      <el-table-column prop="color" width="150px">
        <template slot="header" slot-scope="scope">
          <el-select v-model="groupAdd.color" size="mini" placeholder="颜色">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item, index) in colors" :key="index" :value="item">{{item}}</el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="size" width="150px">
        <template slot="header" slot-scope="scope">
          <el-select v-model="groupAdd.size" size="mini" placeholder="尺码">
            <el-option label="全部" value="">全部</el-option>
            <el-option v-for="(item, index) in sizes" :key="index" :value="item">{{item}}</el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="quantity" min-width="240px">
        <template slot="header" slot-scope="scope">
          <el-row :gutter="5">
            <el-col :span="14">
              <el-input size="mini" v-model.trim.number="groupAdd.quantity" placeholder="*请输入数量"/>
            </el-col>
            <el-col :span="10">
              <el-button type="primary" plain size="mini" @click='fillIn(true)'>批量填充</el-button>
            </el-col>
          </el-row>
        </template>
        <template slot-scope="scope">
          <el-input size="mini" v-model='scope.row.quantity' @blur="fillIn(false, scope.row)"></el-input>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  export default {
    name: '',
    data() {
      return {
        tableData: [],
        initNum: 9999,
        groupAdd: {
          color: '',
          size: '',
          quantity: 9999
        },
        isAddChange: false,
        changeType: '',
        modifyVal: null,
        objArr: []
      }
    },
    props: {
      isAccurate: {
        type: Boolean,
        default: () => false
      },
      colors: {
        type: Array,
        default: () => []
      },
      skuVoList: {
        type: Array,
        default: () => []
      },
      sizes: {
        type: Array,
        default: () => []
      },
      allSku: {
        type: Object,
        default: () => {}
      }
    },
    watch: {
      sizes: {
        handler(newVal, oldVal) {
          this.changeType = 'size'
          this.modifyVal = this.getDiff(newVal, oldVal)
          this.modifyVal && this.changeData()
        },
        deep: true
      },
      colors: {
        handler(newVal, oldVal) {
          this.changeType = 'color'
          this.modifyVal = this.getDiff(newVal, oldVal)
          this.modifyVal && this.changeData()
        },
        deep: true
      }
    },
    created() {
      this.objArr = this.skuVoList.slice()
      this.tableData = this.init(this.objArr)
      this.$bus.$on('deleteSku', ({name, type}) => {
        this.modifyVal = name
        this.isAddChange = false
        this.changeType = type
        this.changeData()
      })
    },
    components: {},
    methods: {
      init(temArr) {
        let arr = []
        if (temArr && temArr.length) {
          for (let item of temArr) {
            for (let n of item.skuVoList) {
              n.oldQuantity = n.quantity
              arr.push(n)
            }
          }
        }
        arr.push({color: '总库存', size: '', quantity: this.calcQuantity(arr)})
        return arr
      },
      getDiff(newArr, oldArr) {
        let value
        if (oldArr.length > newArr.length) {
          this.isAddChange = false
          for (let i of oldArr) {
            !newArr.includes(i) && (value = i)
          }
        } else if (oldArr.length < newArr.length) {
          this.isAddChange = true
          for (let i of newArr) {
            !oldArr.includes(i) && (value = i)
          }
        }
        return value
      },
      changeData() {
        if (this.changeType === 'size') {
          // 增加尺寸
          if (this.isAddChange) {
            for (let item of this.objArr) {
              item.skuVoList.push({
                size: this.modifyVal,
                color: item.color,
                quantity: this.initNum
              })
            }
            this.tableData = this.init(this.objArr)
          } else { // 减少尺寸
            for (let item of this.objArr) {
              const idx = item.skuVoList.findIndex(n => n.size === this.modifyVal)
              idx > -1 && item.skuVoList.splice(idx, 1)
            }
            this.tableData = this.init(this.objArr)
          }
        }
        if (this.changeType === 'color') {
          // 增加颜色
          if (this.isAddChange) {
            const arr = []
            for (let item of this.sizes) {
              arr.push({
                size: item,
                color: this.modifyVal,
                quantity: this.initNum
              })
            }
            const obj = {color: this.modifyVal, skuVoList: arr}
            this.objArr.push(obj)
            this.tableData = this.init(this.objArr)
          } else { // 减少颜色
            const index = this.objArr.findIndex(item => item.color === this.modifyVal)
            index > -1 && this.objArr.splice(index, 1)
            this.tableData = this.init(this.objArr)
          }
        }
      },
      getTotal() {
        return this.tableData[this.tableData.length - 1].quantity
      },
      calcQuantity(arr) {
        let quantity = 0
        for (let i = 0, len = arr.length; i < len; i++) {
          // 如果数量是正整数
          if (this.isPositiveInt(arr[i].quantity)) {
            quantity += arr[i].quantity - 0
          } else {
            this.$set(arr[i], 'quantity', 0)
          }
        } 
        return quantity
      },
      getTable() {
        return this.tableData
      },
      // 组装成接口需要的数据
      getParams() {
        const arr = this.tableData.slice()
        // 编辑精准库存时放开
        if (!this.isAccurate) {
          this.tableData.forEach(item => {
            item.quantity = this.initNum
          })
        }
        arr.splice(this.tableData.length - 1, 1)
        return arr
      },
      getSku() {
        return {colors:this.colors, sizes: this.sizes}
      },
      getId(name, type) {
        let allColor = this.allSku.color
        let allSize = this.allSku.size
        if (type === 'color') {
          const color = allColor.find(item => item.name === name)
          return color ? color.id : null
        }
        const size = allSize.find(item => item.name === name)
        return size ? size.id : null
      },
      fillIn(isBtn, row) {
        let colorArr, sizeArr
        let arr = this.tableData.slice(0, this.tableData.length - 1)
        if (isBtn && this.isPositiveInt(this.groupAdd.quantity)) {
          colorArr = !this.groupAdd.color ? this.colors : [this.groupAdd.color]
          sizeArr = !this.groupAdd.size ? this.sizes : [this.groupAdd.size]
          arr.forEach(item => {
            if (colorArr.includes(item.color) && sizeArr.includes(item.size)) {
              this.$set(item, 'quantity', this.groupAdd.quantity)
            } 
            // else {
            //   this.$set(item, 'quantity', this.initNum)
            // }
          })
          // this.groupAdd = {color: '', size: '', quantity: this.initNum}
        }
        // row && this.$set(row, 'quantity', )
        arr.push({color: '总库存', size: '', quantity: this.calcQuantity(arr)})
        this.tableData = arr
      },
      filterQuantity(color, size) {
        if (this.skuVoList.length) {
          for (let n of this.skuVoList) {
            if (n.color === color) {
              const arr = n.skuVoList.filter(i => i.size === size)
              return arr.length ? arr[0].quantity : this.initNum
            }
          }
        } 
        return this.initNum
      },
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (!this.sizes.length) {
          return [0,0]
        } else {
          if (rowIndex === this.tableData.length - 1 && columnIndex === 1) {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
          if (columnIndex === 0) {
            if (rowIndex === this.tableData.length - 1) {
              return {
                rowspan: 1,
                colspan: 2
              }
            }
            if (rowIndex % this.sizes.length === 0) {
              return {
                rowspan: this.sizes.length,
                colspan: 1
              }
            }
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      },
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/css/index'
  #good_detail_set
    tr
      td
        center()
      &:last-child
        fn(18px)
        color(text_color)
</style>