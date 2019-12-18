<template>
    <section class="app-container" id="areaList">
      <div v-show="!secShow">
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
          <div class="process_btns">
            <el-button type="primary" @click="showAddBusiness">新增banner</el-button>
            <el-button type="danger" @click="batchRemove()">批量删除</el-button>
          </div>
          <el-tabs v-model="siteType" class="switch_btn" @tab-click="getUsers">
            <el-tab-pane v-for="(item, index) in advPositions" :label="item.name" :key="index" :name="item.siteType + ''"></el-tab-pane>
          </el-tabs>
          <el-tabs v-model="status" class="switch_btn" @tab-click="getUsers">
            <el-tab-pane v-for="(item, index) in avails" :label="item.name" :key="index" :name="item.status + ''"></el-tab-pane>
          </el-tabs>
          <!-- <filter-list :filterList="avails" style="margin-bottom:0" title="是否开启" @filterChange="queryData" ref="filterBtn"></filter-list> -->
          <filter-list :filterList="advTypes" title="广告类型" @filterChange="queryData" ref="filterBtn"></filter-list>
        </el-col>
  
        <!--列表-->
        <record-count :total="total"></record-count>
        <el-table :data="users" highlight-current-row @selection-change="selsChange" v-loading="loading" style="width: 100%;">
          <el-table-column type="selection" width="45">
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" :formatter="formatTime">
          </el-table-column>
          <el-table-column prop="code" label="广告位置" :formatter="formatPosition">
          </el-table-column>
          <el-table-column prop="logo" label="banner图">
            <template slot-scope="scope">
              <img width="60px" height="60px" :src="scope.row.imgUrl">
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="类型" :formatter="formatType">
          </el-table-column>
          <el-table-column label="操作" width="320px">
            <template slot-scope="scope">
              <el-button type="primary" plain size="mini" @click="editData(scope.row)">编辑</el-button>
              <el-button type="success" plain size="mini" @click="batchRemove(scope.row)">删除</el-button>
              <template v-if="status - 0 === 0">
                <el-button size="mini" type="text"  class="downforward forward_icon icon" @click="moveDown(scope.$index, true)" v-if="scope.$index < users.length - 1">下移</el-button>
                <el-button size="mini" type="text" class="upforward forward_icon icon" @click="moveDown(scope.$index, false)" v-if="scope.$index > 0">上移</el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
  
        <!--工具条-->
        <div class="page_toolbar">
          <el-pagination layout="prev, pager, next, jumper" prev-text="上一页" next-text="下一页" background 
            @current-change="handleCurrentChange" :page-size="pageSize" :total="total">
          </el-pagination>
        </div>
      </div>
      <!--二级分类操作-->
      <Secondary :title="textMap[dialogStatus]" v-model="secShow">
        <el-form v-if="secShow" class="secondary_form" :model="advForm" style="width:800px" label-width="120px" :rules="advFormRules" ref="advForm">
          <el-form-item label="广告位置" prop="siteType">
            <el-select v-model="advForm.siteType" placeholder="请选择广告位置">
              <el-option
                v-for="(item, index) in advPositions"
                :key="index"
                :label="item.name"
                :value="item.siteType">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="banner图片" prop="imgUrl">
            <img-upload :imgUrl_main="advForm.imgUrl" @uploadImg="setImgList" :isGroup="false" mainTitle="banner图"></img-upload>
          </el-form-item>
          <el-form-item label="广告类型" prop="type">
            <el-select v-model="advForm.type" placeholder="请选择广告类型">
              <el-option
                v-for="item in advTypes.slice(1)"
                :key="item.name"
                :label="item.name"
                :value="item.filterVal.advType">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="店铺选择" v-if="_isHave(advForm.type, [1,2])">
            <template slot-scope="scope">
              <el-form :model="shopForm" ref="shopForm" class="set_start">
                <el-form-item style="margin-right:10px; margin-bottom:0" prop="name" :rules="[{required: true, validator:noEmpty, message: '不能为空'}]">
                  <el-input placeholder="档口名称" v-model="shopForm.name">
                    <el-button slot="append" icon="el-icon-search" @click="searchShop"></el-button>
                  </el-input>
                </el-form-item>
                <el-select v-model="choosedShop.value"  v-loading.fullscreen.lock="loading" placeholder="请选择档口">
                  <el-option
                    v-for="item in shopList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
                <!-- <ul>
                  <li v-for="(item, index) in shopList" :key="index">
                    <img width="30px" height="30px" :src="item.mallImage">
                    <span>{{item.name}}</span>
                    <el-button size="mini" type="primary" @click="chooseShop(item)">选择</el-button>
                  </li>
                </ul> -->
              </el-form>
            </template>
          </el-form-item>
          <el-form-item label="商品选择" v-if="_isHave(advForm.type, [1])">
            <template slot-scope="scope">
              <el-form :model="goodForm" ref="goodForm" class="set_start">
                <el-form-item style="margin-right:10px; margin-bottom:0" prop="productCode" :rules="[{required: true, validator:noEmpty, message: '不能为空'}]">
                  <el-input placeholder="商品货号" v-model="goodForm.productCode">
                    <el-button slot="append" icon="el-icon-search" @click="searchGood"></el-button>
                  </el-input>
                </el-form-item>
                <el-select v-model="choosedProduct.value" style="width:400px" placeholder="请选择商品">
                  <el-option
                    v-for="item in productList"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id">
                  </el-option>
                </el-select>
                <!-- <ul>
                  <li v-for="(item, index) in productList" :key="index">
                    <span>{{item}}</span>
                    <el-button size="mini" type="primary" @click="chooseProduct(item)">选择</el-button>
                  </li>
                </ul> -->
              </el-form>
            </template>
          </el-form-item>
          <el-form-item label="链接地址" v-if="_isHave(advForm.type, [0])">
            <template slot-scope="scope">
              <el-form :model="linkForm" ref="linkForm">
                <el-form-item label="" prop="url" :rules="[{required: true, validator:noEmpty, message: '不能为空'}]">
                  <el-input v-model="linkForm.url" placeholder="链接地址"></el-input>
                </el-form-item>
              </el-form>
            </template>
          </el-form-item>
          <el-form-item label="开启状态">
            <el-switch
              v-model="advForm.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="0"
              :inactive-value="1">
            </el-switch>
          </el-form-item>
          <el-form-item>
            <el-button @click.native="secShow=false">取消</el-button>
            <el-button type="primary" @click="saveBanner">保存</el-button>
          </el-form-item>
        </el-form>
      </Secondary>
    </section>
  </template>
  
  <script>
  export default {
    data() {
      return {
        secShow: false, // 是否展示二级编辑页面
        dialogStatus: 'create',
        textMap: {
          update: '编辑颜色',
          create: '新增颜色'
        },
        siteType: '0',
        status: '0',
        colorDefault: null,
        users: [], // 用户列表
        stallList: [], // 档口列表
        // 大楼分页
        total: 0,
        pageNum: 1,
        pageSize: 10,
        sels: [], // 列表选中列
        advFormRules: {
          imgUrl: [{ required: true, validator: this.noEmpty, message: 'banner图必须存在', trigger: 'blur' }],
        },
        avails: [
          {name: '正在使用', status: 0},
          {name: '已禁用', status: 1}
        ],
        advPositions: [
          {name: '首页顶部轮播广告', siteType: 0},
          {name: '首页中间固定广告', siteType: 1},
          {name: '首页商品列表广告', siteType: 2}
        ],
        // advPositions: [
        //   {name: '全部', filterVal: {}},
        //   {name: '首页顶部轮播广告', filterVal: {advPosition: 0}},
        //   {name: '首页中间固定广告', filterVal: {advPosition: 1}},
        //   {name: '首页商品列表广告', filterVal: {advPosition: 2}}
        // ],
        advTypes: [
          {name: '全部', filterVal: {}},
          {name: '跳转链接', filterVal: {advType: 0}},
          {name: '跳转商品', filterVal: {advType: 1}},
          {name: '跳转店铺', filterVal: {advType: 2}}
        ],
        platformType: [
          {name: 'pc商城', value: 'PC'},
          {name: '微信小程序', value: 'WX'}
        ],
        advForm: {
          type: 0,
          imgUrl: '',
          status: 0,
          url: '',
          plateformType: 'WX',
          siteType: 0
        },
        shopForm: {
          name: ''
        },
        goodForm: {
          productCode: ''
        },
        linkForm: {
          url: ''
        },
        choosedShop: {},
        choosedProduct: {},
        shopList: [],
        productList: [],
        loading: false
      }
    },
    mounted() {
      this.getUsers()
      this.moveDown = this._debounce(this.moveDown)
      this.searchShop = this._debounce(this.searchShop)
      this.searchGood = this._debounce(this.searchGood)
      this.saveBanner = this._debounce(this.saveBanner)
    },
    methods: {
      formatTime(row) {
        return this._formatTime(row.createTime)
      },
      formatPosition(row) {
        return this.advPositions.find(item => item.siteType === row.siteType).name
      },
      formatType(row) {
        return this.advTypes.find(item => item.filterVal.advType === row.type).name
      },
      queryData() {
        this.pageNum = 1
        this.getUsers()
      },
      formatStatus(row) {
        // 1 启用
        return row.status === 1 ? '开启' : '禁用'
      },
      moveDown(index, isDown) {
        const param = {
          moveId: this.users[index].id,
          unMoveId: this.users[isDown ? index + 1 : index - 1].id
        }
        this.$postJson(this._basePath.ajaxMoveBanner, param).then(res => {
          if (res.success) {
            this.$message.success('移动成功')
            this.getUsers()
          }
        })
      },  
      // 页脚显示转换
      handleCurrentChange(val) {
        this.pageNum = val
        this.getUsers()
      },
      setImgList(data) {
        this.$set(this.advForm, 'imgUrl', data[0])
      },
      searchShop(code) {
        this.$refs.shopForm.validate(valid => {
          if (valid) {
            const param = {
              name: this.shopForm.name
            }
            this.loading = true
            this.$postJson(this._basePath.ajaxFilterShop, param).then(res => {
              this.loading = false
              if (res.success) {
                this.shopList = res.data
                this.choosedShop = {value: this.shopList[0].id}
              }
            })
          } 
        })
      },
      searchGood(code) {
        if (this.choosedShop.value === undefined) {
          this.$message.error('请先选择档口')
          return false
        }
        this.$refs.goodForm.validate(valid => {
          if (valid) {
            const param = {
              pageNum: 1,
              pageSize: 999,
              saleState: 1,
              orderByUpdateTime: true,
              stallId: this.choosedShop.value,
              productCode: this.goodForm.productCode
            }
            this.loading = true
            this.$postJson(this._basePath.ajaxBannerGoods, param).then(res => {
              this.loading = false
              if (res.success) {
                if (this.productList && this.productList.length) {
                  this.productList = res.data
                  this.choosedProduct = {value: this.productList[0].id}
                }
              }
            })
          }
        })
      },
      // 禁用启用颜色
      batchRemove(row) {
        let ids = row ? [row.id] : this.sels.map(item => item.id)
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        })
          .then(() => {
            const para = { idList: ids.toString()}
            this.$postJson(this._basePath.ajaxDelBanner, para).then(res => {
              if (res.success) {
                this.$message({
                  message: '删除成功',
                  type: 'success'
                })
                this.getUsers()
              }
            })
          })
          .catch(() => {})
      },
      // 获取颜色列表
      getUsers() {
        const param = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          status: this.status - 0,
          siteType: this.siteType - 0
        }
        this.$refs.filterBtn && (param.type = this.$refs.filterBtn.getParams().advType)
        this.loading = true
        this.$postJson(this._basePath.ajaxGetBannerByPage, param).then(res => {
          this.loading = false
          if (res.success) {
            this.total = res.data.count
            this.users = res.data.datas
          }
        })
      },
      // 新增
      showAddBusiness() {
        this.secShow = true
        this.dialogstatus = 'create'
        this.advForm = {
          type: 0,
          imgUrl: '',
          status: 0,
          url: '',
          plateformType: 'WX',
          siteType: 0
        }
      },
      // 编辑
      editData(row) {
        this.$postJson(this._basePath.ajaxBannerDetail, {id: row.id}).then(res => {
          if (res.success) {
            const data = res.data
            this.secShow = true
            this.dialogstatus = 'update'
            this.advForm = Object.assign({}, data)
            if (this.advForm.type === 0) {
              this.linkForm = {url: data.url}
            } else if (this.advForm.type === 2) {
              this.choosedShop = {value: data.bizId}
              this.shopList = [{id: data.bizId, name: data.stallName}]
              this.shopForm = {name: data.stallName}
            } else if (this.advForm.type === 1) {
              this.choosedShop = {value: data.stallId}
              this.shopList = [{id: data.stallId, name: data.stallName}]
              this.shopForm = {name: data.stallName}
              this.choosedProduct = {value: data.bizId}
              this.productList = [{id: data.bizId, title: data.title}]
              this.goodForm = {productCode: data.productCode}
            }
          }
        })
      },
      // 保存信息
      saveBanner() {
        this.$refs.advForm.validate(valid => {
          if (valid) {
            let param = {...{}, ...this.advForm}
            param.url = this.linkForm.url
            if (this.advForm.type === 2) { // 店铺
              if (this.choosedShop.value === undefined) {
                this.$message.error('请选择店铺')
                return false
              }
              param.bizId = this.choosedShop.value
            } else if (this.advForm.type === 1) { // 商品
              if (this.choosedProduct.value === undefined) {
                this.$message.error('请选择商品')
                return false
              }
              param.bizId = this.choosedProduct.value
            }
            this.$post(this._basePath.ajaxEitBanner, param).then(res => {
              if (res.success) {
                this.$message.success('操作成功')
                this.getUsers()
                this.secShow = false
              }
            })
          }
        })
      },
      // 全选单选多选
      selsChange(sels) {
        this.sels = sels
      }
    }
  }
  </script>
  
  <style lang="stylus" scoped>
    #areaList
      .forward_icon
        radius(50%)
      .secondary_form
        .el-cascader
          width:100%
      .building_title
        // text-align:center
        margin-top:10px
        margin-bottom:20px
        i
          font-size:20px
          font-weight:bold
      .toolbar_process
        margin-top:20px
  </style>