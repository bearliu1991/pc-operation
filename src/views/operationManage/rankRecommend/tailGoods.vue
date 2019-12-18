<template>
    <section class="app-container" id="hang_bill">
      <div class="switch_header">
        <el-tabs v-model="switchStatus" class="switch_tabs" @tab-click="queryData">
          <el-tab-pane label="等待审核" name="0"></el-tab-pane>
          <el-tab-pane label="展示中" name="1"></el-tab-pane>
          <el-tab-pane label="审核不通过" name="2"></el-tab-pane>
        </el-tabs>
      </div>
      <div>
      <!--查询条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters" @submit.native.prevent>
          <el-form-item label="商品货号">
            <el-input v-model="filters.productCode" placeholder="商品货号"></el-input>
          </el-form-item>
          <el-form-item label="所属档口">
            <el-input v-model="filters.stallName" placeholder="档口名称"></el-input>
          </el-form-item>
          <el-form-item label="报名时间">
            <date-pick ref="dateFilter" v-model="reset"></date-pick>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"  @click="queryData">查询</el-button>
            <el-button type="text" plain @click="clearFilter">清空筛选条件</el-button>
          </el-form-item>
        </el-form>
        <div class="process_btns">
          <el-button type="primary" @click="batchSet()" v-if="switchStatus === '0'" :disabled="this.sels.length===0">批量通过</el-button>
          <el-button type="danger" @click="batchSet(false, true)" v-if="switchStatus === '0'" :disabled="this.sels.length===0">批量不通过</el-button>
          <el-button type="primary" @click="setToTop()" v-if="switchStatus === '1'" :disabled="this.sels.length===0">批量置顶</el-button>
          <el-button type="danger" @click="batchRemove()" v-if="_isHave(switchStatus, ['1', '2'])" :disabled="this.sels.length===0">批量删除</el-button>
          <el-button type="primary" @click="dialogShow = true" size="medium">设置尾货处理规则</el-button>
        </div>
      </el-col>
  
        <!--表格-->
        <record-count :total="total">
        </record-count>
        <el-table :data="users" @selection-change="selsChange" highlight-current-row v-loading="loading" style="width: 100%;">
          <el-table-column type="selection" width="45">
          </el-table-column>
          <el-table-column prop="imgUrl_main" label="图片" width="70px">
            <template slot-scope="scope">
              <img :src="scope.row.imgUrl_main" style="max-width:50px; max-height:50px">
            </template>
          </el-table-column>
          <el-table-column label="商品货号" prop="productCode" width="180px">
          </el-table-column>
          <el-table-column label="所属档口" prop="stallName">
          </el-table-column>
          <el-table-column label="拿货价/打包价" prop="sellAndPackagePrice">
          </el-table-column>
          <template v-if="_isHave(switchStatus, ['1'])">
            <el-table-column label="通过时间" prop="auditTime" :formatter="formatTime">
            </el-table-column>
          </template>
          <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <div class="process_td">
                <template>
                  <el-button type="primary" v-if="switchStatus === '0'" plain size="small" @click="batchSet(scope.row)">通过</el-button>
                  <el-button type="danger" v-if="switchStatus === '0'" plain size="small" @click="batchSet(scope.row, true)">不通过</el-button>
                  <el-button type="primary" v-if="switchStatus === '1'" plain size="small" @click="setToTop(scope.row)">置顶</el-button>
                  <el-button type="danger" v-if="_isHave(switchStatus, ['1', '2'])" plain size="small" @click="batchRemove(scope.row, true)">删除</el-button>
                </template>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!--工具条-->
        <div class="page_toolbar">
          <el-pagination layout="prev, pager, next, jumper" prev-text="上一页" next-text="下一页" background 
            @current-change="handleCurrentChange" :page-size="pageSize" :current-page="pageNum" :total="total">
          </el-pagination>
        </div>
      </div>
      <el-dialog
        title="设置展示规则"
        :visible.sync="dialogShow"
        width="600px">
        <el-form :model="editForm" style="width: 80%; margin: auto;" label-width="130px" ref="editForm">
          <el-form-item label="尾货处理规则" prop="rule" :rules="[{required: true, validator: noEmpty, message: '规则不能为空'}]">
            <el-input type="textarea" v-model="editForm.rule" placeholder="尾货规则定义"></el-input>
          </el-form-item>
          <el-form-item label="最大尾货商品数" prop="goodNum" 
            :rules="[
              {required: true, validator: noEmpty, message: '不能为空'},
              {required: true, validator: _positiveInt, message: '商品数为正整数'}
            ]"
          >
            <el-input v-model="editForm.goodNum" placeholder="商品数"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogShow = false">取 消</el-button>
          <el-button type="primary" @click="saveRule">确 定</el-button>
        </span>
      </el-dialog>
    </section>
  </template>
  <script>
    export default {
      data() {
        return {
          loading: false,
          users: [],
          reset: false,
          info: {},
          switchStatus: '0',
          dialogShow: false,
          details: {},
          sels: [],
          filters: {
            productCode: '',
            stallName: ''
          },
          pageNum: 1,
          pageSize: 10,
          total: 0,
          editForm: {
            rule: '',
            goodNum: ''
          }
        }
      },
      props: {
        curItem: {
          type: Object,
          default: () => {}
        }
      },
      mounted() {
        this.getUsers()
      },
      methods: {
        queryData() {
          this.pageNum = 1
          this.getUsers()
        },
        // 清空筛选条件
        clearFilter() {
          this.filters = {
            productCode: '',
            stallName: ''
          }
          this.reset = true
        },
        formatTime(row) {
          return this._formatTime(row.auditTime, true)
        },
        // 设置置顶
        setToTop(row) {
          this.$postJson(this._basePath.ajaxOperationTailGoodsSetTop, {ids: [row.id].toString(), tailHandleIsSetTop: true}).then(res => {
            if (res.success) {
              this.$message.success('置顶成功')
              this.queryData()
            }
          })
        },
        getRule() {
          this.$postJson(this._basePath.ajaxOperationTailRuleGet).then(res => {
            if (res.success) {
              this.editForm = {
                rule: res.datatailHandleRule,
                goodNum: res.data.tailHandleNumber
              }
            }
          })
        },
        // 保存规则
        saveRule() {
          this.$refs.editForm.validate(valid => {
            if (valid) {
              const param = {
                tailHandleNumber: this.editForm.goodNum,
                tailHandleRule: this.editForm.rule
              }
              this.$postJson(this._basePath.ajaxOperationTailRuleSave, param).then(res => {
                res.success && this.$message.success('保存成功！')
                this.dialogShow = false
              })
            }
          })
        },
        clearSearch() {
          this.$bus.$emit('clearDate')
          this.reset = true
        },
        selsChange(sels) {
          this.sels = sels
        },
        // 页脚显示转换
        handleCurrentChange(val) {
          this.pageNum = val
          this.getUsers()
        },
        // 批量删除
        batchRemove(row) {
          let ids = row ? [row.id] : this.sels.map(item => item.id)
          this.$confirm('确认删除选中内容吗？', '提示', {
            type: 'warning'
          })
            .then(() => {
              const para = { 
                ids: ids.toString()
              }
              this.$postJson(this._basePath.ajaxOperationTailGoodsDel, para).then(res => {
                if (res.success) {
                  this.$message({
                    message: '删除成功',
                    type: 'success'
                  })
                  this.queryData()
                }
              })
            })
            .catch(() => {})
        },
        // 批量设置展示
        batchSet(row, isCancel) {
          let ids = row ? [row.id] : this.sels.map(item => item.id)
          if (isCancel) {
            this.$confirm('确认拒绝用户申请吗？', '提示', {
              type: 'warning'
            })
              .then(() => {
                const para = { 
                  ids: ids.toString(),
                  isChecked: false
                }
                this.$postJson(this._basePath.ajaxOperationTailGoodsApplyPass, para).then(res => {
                  if (res.success) {
                    this.$message({
                      message: '拒绝成功',
                      type: 'success'
                    })
                    this.queryData()
                  }
                })
              })
              .catch(() => {})
          } else {
            const para = { 
              ids: ids.toString(),
              isChecked: true
            }
            this.$postJson(this._basePath.ajaxOperationTailGoodsApplyPass, para).then(res => {
              if (res.success) {
                this.$message({
                  message: '申请通过',
                  type: 'success'
                })
                this.queryData()
              }
            })
          }
        },
        // 获取用户列表
        getUsers() {
          const para = {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            status: this.switchStatus - 0
          }
          this.loading = true
          this.$postJson(this._basePath.ajaxOperationTailGoodsByPage, {...para, ...this.filters}).then(res => {
            this.loading = false
            if (res.success) {
              this.total = res.data.count
              let data = res.data.datas
              this.users = data
            }
          })
        }
      }
    }
  </script>
  <style lang="stylus">
    @import '~@/assets/css/index'
    #hang_bill
      textarea
        height: 120px 
      .switch_header
        mb(20px)
      .switch_tabs
        .el-tabs__item
          fn(16px)
      .el-tabs__content
        padding:0
        
  </style>