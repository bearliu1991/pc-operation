<template>
    <section class="app-container" id="hang_bill">
      <div class="switch_header">
        <el-tabs v-model="switchStatus" class="switch_tabs" @tab-click="queryData">
          <el-tab-pane label="档口列表" name="0"></el-tab-pane>
          <el-tab-pane label="已推荐" name="1"></el-tab-pane>
        </el-tabs>
      </div>
      <div>
      <!--查询条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters" @submit.native.prevent>
          <el-form-item label="档口编号">
            <el-input v-model="filters.stallCode" placeholder="档口编号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"  @click="queryData">查询</el-button>
            <el-button type="text" plain @click="clearFilter">清空筛选条件</el-button>
          </el-form-item>
        </el-form>
        <div class="process_btns">
          <el-button type="primary" @click="batchSet()" v-if="switchStatus === '0'" :disabled="this.sels.length===0">批量推荐</el-button>
          <el-button type="primary" @click="batchSet(false, true)" v-if="switchStatus === '1'" :disabled="this.sels.length===0">批量取消推荐</el-button>
          <el-button type="primary" @click="setToTop()" v-if="switchStatus === '1'" :disabled="this.sels.length===0">批量置顶</el-button>
          <el-button type="primary" @click="dialogShow = true" size="medium">设置推荐规则</el-button>
        </div>
      </el-col>
  
        <!--表格-->
        <record-count :total="total">
        </record-count>
        <el-table :data="users" @selection-change="selsChange" highlight-current-row v-loading="loading" style="width: 100%;">
          <el-table-column type="selection" width="45">
          </el-table-column>
          <el-table-column label="档口编号" prop="code">
          </el-table-column>
          <el-table-column label="档口商品数" prop="productNum">
          </el-table-column>
          <el-table-column label="七日上新数" prop="newProductNum">
          </el-table-column>
          <el-table-column label="档口粉丝数" prop="fansNum">
          </el-table-column>
          <el-table-column label="操作" fixed="right" min-width="100px">
            <template slot-scope="scope">
              <div class="process_td">
                <template>
                  <el-button type="primary" v-if="switchStatus === '0'" plain size="small" @click="batchSet(scope.row)">推荐</el-button>
                  <el-button type="primary" v-if="switchStatus === '1'" plain size="small" @click="setToTop(scope.row)">置顶</el-button>
                  <el-button type="primary" v-if="switchStatus === '1'" plain size="small" @click="batchSet(scope.row, true)">取消推荐</el-button>
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
        <el-form :model="editForm" style="width: 60%; margin: auto;" label-width="80px" ref="editForm">
          <el-form-item label="" prop="rule" :rules="[{required: true, validator: noEmpty, message: '规则不能为空'}]">
            <el-input type="textarea" v-model="editForm.rule" placeholder="请输入姓名"></el-input>
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
          switchStatus: '0',
          dialogShow: false,
          details: {},
          sels: [],
          filters: {
            stallCode: ''
          },
          pageNum: 1,
          pageSize: 10,
          total: 0,
          editForm: {
            rule: ''
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
            stallCode: ''
          }
        },
        formatTime(row) {
          return this._formatTime(row.toBoutiqueTime, true)
        },
        // 设置置顶
        setToTop(row) {
          this.$postJson(this._basePath.ajaxSetStallTop, {id: row.id, stallIsSetTop: true}).then(res => {
            if (res.success) {
              this.$message.success('置顶成功')
              this.queryData()
            }
          })
        },
        // 保存规则
        saveRule() {
          this.$refs.editForm.validate(valid => {
            if (valid) {
              this.$postJson(this.ajaxSaveSuperiorGoodRule).then(res => {
  
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
        // 批量设置展示
        batchSet(row, isCancel) {
          let ids = row ? [row.id] : this.sels.map(item => item.id)
          if (isCancel) {
            this.$confirm('确认取消推荐吗？', '提示', {
              type: 'warning'
            })
              .then(() => {
                const para = { 
                  ids: ids.toString(),
                  isExcellent: false,
                  stallIsSetTop: false
                }
                this.$postJson(this._basePath.ajaxRecommendStall, para).then(res => {
                  if (res.success) {
                    this.$message({
                      message: '取消成功',
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
              isExcellent: true,
              stallIsSetTop: true
            }
            this.$postJson(this._basePath.ajaxRecommendStall, para).then(res => {
              if (res.success) {
                this.$message({
                  message: '推荐成功',
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
            isExcellent: this.switchStatus !== '0'
          }
          this.loading = true
          this.$postJson(this._basePath.ajaxSuperiorStall, {...para, ...this.filters}).then(res => {
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
      .switch_header
        mb(20px)
      .switch_tabs
        .el-tabs__item
          fn(16px)
      .el-tabs__content
        padding:0
        
  </style>