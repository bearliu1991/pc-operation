<template>
	<section class="app-container" id="areaList">
    <div v-show="!secShow">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <div class="process_btns">
          <el-button type="primary" v-on:click="showAddBusiness">新增商品尺寸</el-button>
        </div>
      </el-col>

      <!--列表-->
      <record-count :total="total"></record-count>
      <el-table :data="users" highlight-current-row @selection-change="selsChange" style="width: 100%;">
        <el-table-column type="selection" width="45px">
        </el-table-column>
        <el-table-column prop="id" label="默认尺寸ID">
        </el-table-column>
        <el-table-column prop="name" label="尺寸名称">
        </el-table-column>
        <el-table-column prop="order" label="排序号">
        </el-table-column>
        <el-table-column prop="status" label="状态" :formatter="formatStatus">
        </el-table-column>
        <el-table-column label="操作" width="320px">
          <template slot-scope="scope">
            <el-button type="primary" plain size="mini" @click="getBusinessDetail(scope.row)">编辑</el-button>
            <el-button type="danger" plain size="mini" @click="disabledArea(scope.row)" v-if="scope.row.status === 1">禁用</el-button>
            <el-button type="success" plain size="mini" @click="disabledArea(scope.row)" v-if="scope.row.status === 0">启用</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--工具条-->
      <div class="page_toolbar">
        <el-pagination layout="prev, pager, next, jumper" prev-text="上一页" next-text="下一页" background 
          @current-change="handleCurrentChange" :current-page="pageNum" :page-size="pageSize" :total="total">
        </el-pagination>
      </div>
    </div>
    <!--二级分类操作-->
    <Secondary :title="textMap[dialogStatus]" v-model="secShow">
      <el-form class="secondary_form" :model="businessForm" label-width="120px" :rules="businessFormRules" ref="businessForm">
        <el-form-item label="默认尺寸名称" prop="name">
          <el-input style="width:250px" v-model="businessForm.name" placeholder="请输入尺寸名称"></el-input>
        </el-form-item>
        <el-form-item label="尺寸序号" prop="order">
          <el-input style="width:250px" v-model="businessForm.order" placeholder="请输入尺寸序号"></el-input>
          &nbsp;&nbsp;&nbsp;<span class="light_color">(控制尺寸排序)</span>
        </el-form-item>
        <el-form-item label="开启状态">
          <el-switch
            v-model="businessForm.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item>
          <el-button @click.native="secShow=false">取消</el-button>
          <el-button type="primary" @click="tradeAreaEdit">保存</el-button>
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
        update: '编辑尺寸',
        create: '新增尺寸'
      },
      colorDefault: null,
      users: [], // 用户列表
      stallList: [], // 档口列表
      // 大楼分页
      total: 0,
      pageNum: 1,
      pageSize: 10,
      sels: [], // 列表选中列
      businessFormRules: {
        name: [
          { required: true, validator: this.noEmpty, message: '请输入默认尺寸名称', trigger: 'blur' },
          { required: true, validator: this.lessThan10, message: '尺寸名称不超过10个字符', trigger: 'blur' }
        ],
        order: [{ required: true, validator: this.mustNumber, message: '尺寸序号需为数字', trigger: 'blur' }],
      },
      businessForm: {
        name: '',
        order: '',
        status: 1
      }
    }
  },
  created() {
    this.getUsers()
    this.disabledArea = this._debounce(this.disabledArea)
    this.tradeAreaEdit = this._debounce(this.tradeAreaEdit)
  },
  methods: {
    queryData() {
      this.pageNum = 1
      this.getUsers()
    },
    formatStatus(row) {
      // 1 启用
      return row.status === 1 ? '开启' : '禁用'
    },
    // 页脚显示转换
    handleCurrentChange(val) {
      this.pageNum = val
      this.getUsers()
    },
    // 禁用启用尺寸
    disabledArea(row) {
      if (row.status === 1) {
        const self = this
        this.$confirm('确定禁用该尺寸吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$postJson(this._basePath.ajaxOperateSkuStatus, {id: row.id, status: 0, propertyId: 2}).then(res => {
            if (res.success) {
              this.$message.success('禁用成功！')
              self.getUsers()
            }
          })
        })
      } else {
        this.$postJson(this._basePath.ajaxOperateSkuStatus, {id: row.id, status: 1, propertyId: 2}).then(res => {
          if (res.success) {
            this.$message.success('启用成功！')
            this.getUsers()
          }
        })
      }
    },
    // 获取尺寸列表
    getUsers() {
      const para = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        propertyId: 2
      }
      this.$postJson(this._basePath.ajaxOperateSkuByPage, para).then(res => {
        if (res.success) {
          this.total = res.data.count
          this.users = res.data.datas
        }
      })
    },
    // 新增
    showAddBusiness() {
      this.secShow = true
      this.dialogStatus = 'create'
      this.businessForm = {
        name: '',
        order: '',
        status: 1
      }
    },
    // 编辑
    getBusinessDetail(row) {
      this.secShow = true
      this.dialogStatus = 'update'
      this.businessForm = Object.assign({}, row)
    },
    // 保存信息
    tradeAreaEdit() {
      this.$refs.businessForm.validate(valid => {
        if (valid) {
          const param = Object.assign({}, this.businessForm)
          param.propertyId = 2 // propertyId 1：颜色， 2: 尺寸
          this.$post(this._basePath.ajaxOperateSkuSave, param).then(res => {
            if (res.success) {
              this.$message.success('操作成功')
              this.queryData()
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