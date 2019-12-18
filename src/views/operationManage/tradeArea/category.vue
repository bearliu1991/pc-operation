<template>
	<section class="app-container" id="areaList">
    <div v-show="!secShow">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <!-- <el-form :inline="true" :model="filters" @submit.native.prevent>
          <el-form-item>
            <el-input style="width: 300px" v-model="filters.phone" placeholder="用户名/商户ID/商户名称/手机号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="getUsers">查询</el-button>
          </el-form-item>
        </el-form> -->
        <div class="process_btns">
          <el-button type="primary" v-on:click="showAddBusiness">新增一级分类</el-button>
        </div>
      </el-col>

      <!--列表-->
      <record-count :total="total"></record-count>
      <el-table :data="users" highlight-current-row @selection-change="selsChange" style="width: 100%;">
        <!-- <el-table-column type="selection" width="45px">
        </el-table-column> -->
        <el-table-column prop="id" label="一级分类ID">
        </el-table-column>
        <el-table-column prop="name" label="一级分类名称">
        </el-table-column>
        <el-table-column prop="orderNum" label="排序号">
        </el-table-column>
        <el-table-column prop="status" label="状态" :formatter="formatStatus">
        </el-table-column>
        <el-table-column label="操作" width="320px">
          <template slot-scope="scope">
            <el-button type="primary" plain size="mini" @click="getFloors(scope.row.id, scope.row.name)">{{scope.row.name !== '其它' ? '设置' : '查看'}}二级分类</el-button>
            <el-button type="primary" v-if="scope.row.name !== '其它'" plain size="mini" @click="getBusinessDetail(scope.row)">编辑</el-button>
            <el-button type="danger" plain size="mini" @click="disabledArea(scope.row)" v-if="scope.row.status === 1 && scope.row.name !== '其它'">禁用</el-button>
            <el-button type="success" plain size="mini" @click="disabledArea(scope.row)" v-if="scope.row.status === 0 && scope.row.name !== '其它'">启用</el-button>
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
    <Secondary :title="secTitle" v-model="secShow">
      <template v-if="showStalls">
        <div class="building_title"><i>一级分类名称: {{parentCategory.name}}</i></div>
        <div class="process_btns">
          <!-- <el-button type="danger" @click="batchRemoveFloor" :disabled="this.selectArr.length===0">批量删除</el-button> -->
          <el-button type="primary" v-on:click="showAddStall" v-if="parentCategory.name !== '其它'">新增二级分类</el-button>
        </div>
        <record-count :total="totalFloor"></record-count>
        <el-table :data="stallList" highlight-current-row @selection-change="floorChange" style="width: 100%;">
          <el-table-column type="selection" width="45px">
          </el-table-column>
          <el-table-column prop="id" label="二级分类ID">
          </el-table-column>
          <el-table-column prop="name" label="二级分类名称">
          </el-table-column>
          <el-table-column prop="img" label="分类图片">
            <template slot-scope="scope">
              <img :src="scope.row.img" width="60px" height="60px" />
            </template>
          </el-table-column>
          <el-table-column prop="orderNum" label="排序号">
          </el-table-column>
          <el-table-column prop="status" label="状态" :formatter="formatStatus">
          </el-table-column>
          <el-table-column label="操作" width="250px">
            <template slot-scope="scope">
              <el-button type="primary" plain size="mini" v-if="parentCategory.name !== '其它'" @click="getStallDetail(scope.row)">编辑</el-button>
              <el-button type="danger" plain size="mini" @click="disabledFloor(scope.row)" v-if="scope.row.status === 1 && parentCategory.name !== '其它'">禁用</el-button>
              <el-button type="success" plain size="mini" @click="disabledFloor(scope.row)" v-if="scope.row.status === 0 && parentCategory.name !== '其它'">启用</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page_toolbar">
          <el-pagination layout="prev, pager, next, jumper" prev-text="上一页" next-text="下一页" background 
            @current-change="handleCurrentChangeFloor" :current-page="pageNumFloor" :page-size="pageSizeFloor" :total="totalFloor">
          </el-pagination>
        </div>
        <!-- <el-col :span="24" class="toolbar_process">
          <el-button type="danger" @click="batchRemoveFloor" :disabled="this.selectArr.length===0">批量删除</el-button>
          <el-pagination layout="prev, pager, next" @current-change="handleCurrentChangeFloor" 
            :page-size="pageSizeFloor" :total="totalFloor" style="float:right;">
          </el-pagination>
        </el-col> -->
      </template>
      <template v-if="showBusiness">
        <el-form class="secondary_form" :model="businessForm" label-width="120px" :rules="businessFormRules" ref="businessForm">
          <el-form-item label="一级分类名称" prop="name">
            <el-input style="width:250px" v-model="businessForm.name" placeholder="请输入分类名称,名称不能为'其它"></el-input>
          </el-form-item>
          <el-form-item label="分类序号" prop="orderNum">
            <el-input style="width:250px" v-model="businessForm.orderNum" placeholder="请输入分类序号"></el-input>
            &nbsp;&nbsp;&nbsp;<span class="light_color">(控制分类排序)</span>
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
      </template>
    </Secondary>
    <!--档口详情-->
    <Drawer v-model="showDrawer" title="编辑二级分类" :showFooter="true">
      <el-form :model="editForm" class="secondary_form" label-width="120px" :rules="editFormRules" ref="editForm">
        <el-form-item label="所属一级分类">
          {{parentCategory.name}}
        </el-form-item>
        <el-form-item label="二级分类名称" prop="categoryId">
          <el-cascader
            :options="options"
            :props="props"
            class="long_input"
            v-model="editForm.categoryId"
            @active-item-change="getCategory2" @focus="getCategory1">
          </el-cascader>
        </el-form-item>
        <el-form-item label="分类序号" prop="orderNum">
          <el-input style="width:250px" v-model="editForm.orderNum" placeholder="分类序号为数字"></el-input>
          &nbsp;&nbsp;<span class="light_color">(控制分类排序)</span>
        </el-form-item>
        <el-form-item label="商品类别图" prop="img">
          <img-upload :imgUrl_main="editForm.img" @uploadImg="setImgList" :isGroup="false" mainTitle="商品分类图"></img-upload>
        </el-form-item>
        <el-form-item label="默认重量" prop="weight">
          <el-input v-model="editForm.weight" placeholder="请输入默认重量"></el-input>
        </el-form-item>
        <el-form-item label="开启状态">
          <el-switch
            v-model="editForm.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0">
          </el-switch>
        </el-form-item>
			</el-form>
      <el-button slot="footer" type="primary" @click="createData">保存</el-button>
    </Drawer>
	</section>
</template>

<script>
export default {
  data() {
    return {
      editRole: {roleId: null},
      secShow: false, // 是否展示二级编辑页面
      dialogStatus: '',
      cascaderProps: {value: 'name', label: 'name'},
      showStalls: false,
      showBusiness: true,
      // cascader级联props
      props: {
        value: 'id',
        label: 'name',
        children: 'children'
      },
      secTitle: '',
      options: [],
      isFirstShow: true,
      defaultOptions: [{name: '', id: ''}],
      textMap: {
        update: '编辑用户',
        create: '创建用户'
      },
      filters: {
        userName: '',
        phone: '',
      },
      users: [], // 用户列表
      stallList: [], // 档口列表
      // 大楼分页
      total: 0,
      pageNum: 1,
      pageSize: 10,
      // 楼层分页
      totalFloor: 0,
      pageNumFloor: 1,
      pageSizeFloor: 10,
      sels: [], // 列表选中列
      showDrawer: false,
      editFormRules: {
        categoryId: [{ required: true, validator: this.noEmptyArr, message: '请选择分类', trigger: 'blur' }],
        orderNum: [{ required: true, validator: this.mustNumber, message: '分类序号需为数字', trigger: 'blur' }],
        img: [{ required: true, validator: this.noEmpty, message: '分类图片不能为空', trigger: 'blur' }]
      },
      businessFormRules: {
        name: [ 
          {required: true, validator: this.noEmpty, message: '请输入一级分类名称', trigger: 'blur' },
          { required: true, validator: this.lessThan10, message: '一级分类名称不超过10个字符', trigger: 'blur' },
          {required: true, validator: this.noOther, message: "一级分类名称不能为'其他'", trigger: 'blur' }
        ],
        orderNum: [{ required: true, validator: this.mustNumber, message: '分类序号需为有效数字', trigger: 'blur' }]
      },
      businessForm: {
        name: '',
        orderNum: '',
        status: 1
      },
      // 编辑界面数据
      editForm: {
        name: '',
        orderNum: '',
        img: '',
        status: 1,
        categoryId: []
      },
      parentCategory: {},
      ids: [],
      selectArr: [],
      addFormVisible: false // 新增界面是否显示
    }
  },
  created() {
    this.getUsers()
    this.tradeAreaEdit = this._debounce(this.tradeAreaEdit)
    this.disabledFloor = this._debounce(this.disabledFloor)
    this.createData = this._debounce(this.createData)
  },
  methods: {
    queryData() {
      this.pageNum = 1
      this.getUsers()
    },
    formatCreateTime(row) {
      return this._formatTime(row.updateTime)
    },
    formatStatus(row) {
      // on 启用
      return row.status === 1 ? '开启' : '禁用'
    },
    formatFloorStatus(row) {
      return row.status === '2' ? '开启' : '禁用'
    },
    // 页脚显示转换
    handleCurrentChange(val) {
      this.pageNum = val
      this.getUsers()
    },
    // 页脚显示转换
    handleCurrentChangeFloor(val) {
      this.pageNumFloor = val
      this.getFloors()
    },
    // 禁用大楼
    disabledArea(row) {
      if (row.status === 1) {
        const self = this
        this.$confirm('确定禁用该一级分类吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$postJson(this._basePath.ajaxCategoryOperateStatus1, {id: row.id, status: 0}).then(res => {
            if (res.success) {
              this.$message.success('禁用成功！')
              self.getUsers()
            }
          })
        })
      } else {
        this.$postJson(this._basePath.ajaxCategoryOperateStatus1, {id: row.id, status: 1}).then(res => {
          if (res.success) {
            this.$message.success('启用成功！')
            this.getUsers()
          }
        })
      }
    },
    setImgList(data) {
      this.$set(this.editForm, 'img', data[0])
    },
    noOther(rule, value, callback) {
      if (!value || value === '其它') {
        callback(new Error(rule.message))
      } else {
        callback()
      }
    },
    // 获取商品分类一级数据
    getCategory1() {
      if (this.isFirstShow) {
        this.$get(this._basePath.ajaxCategoryOperationCategory1).then((res) => {
          if (res.success) {
              let arr = []
              for (let item of res.data) {
                !item.isChildren && (item.children = [])
                arr.push(item)
              }
              this.options = arr
              this.isFirstShow = false
          }
        })
      }
    },
    // 级联选择变化，获取商品分类二级数据
    getCategory2(value) {
      const obj = this.options.find(item => {
        return item.id === value[0]
      })
      if (!obj.isChildren && obj.children.length === 0) {
        this.$postJson(this._basePath.ajaxCategoryOperationCategory2, {parentId: value[value.length - 1]}).then((res) => {
          if (res.success) {
            let item = this.iteratorCascader(value[value.length - 1], this.options)
            if (res.data.length) {
              !item.isChildren && (item.children = [])
              this.$set(item, 'children', res.data)
            } else {
              return true
            }
          }
        })
      }
    },
    iteratorCascader(val, arr) {
      let obj = {}
      function iterater(val, arr) {
        for (let item of arr) {
          item.id === val && (obj = item)
          item.children && iterater(val, item.children)
        }
      }
      iterater(val, arr)
      return obj
    },
    // 显示编辑二级分类
    showAddStall() {
      this.isFirstShow = true
      this.showDrawer = true
      this.editForm = {
        name: '',
        orderNum: '',
        img: '',
        status: 1,
        categoryId: []
      }
    },
    // 获取大楼列表
    getUsers() {
      const para = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      }
      let b = this.filters
      this.$postJson(this._basePath.ajaxCategoryByPage, {...para, ...b}).then(res => {
        if (res.success) {
          this.total = res.data.count
          this.users = res.data.datas
        }
      })
    },
    // 新增大楼
    showAddBusiness() {
      this.secShow = true
      this.showBusiness = true
      this.showStalls = false
      this.secTitle = '编辑一级分类'
      this.businessForm = {
        name: '',
        orderNum: '',
        status: 1
      }
    },
    // 展示编辑页面
    getBusinessDetail(row) {
      this.secShow = true
      this.secTitle = '编辑一级分类'
      this.showStalls = false
      this.showBusiness = true
      this.businessForm = Object.assign({}, row)
    },
    // 保存大楼信息
    tradeAreaEdit() {
      this.$refs.businessForm.validate(valid => {
        if (valid) {
          const param = Object.assign({}, this.businessForm)
          this.$post(this._basePath.ajaxCategoryEdit, param).then(res => {
            if (res.success) {
              this.$message.success('操作成功')
              this.queryData()
              this.secShow = false
            }
          })
        }
      })
    },
    // 获取楼层列表
    getFloors(id, name) {
      const param = {
        parentId: id !== undefined ? id : this.parentCategory.id,
        pageNum: this.pageNumFloor,
        pageSize: this.pageSizeFloor,
      }
      this.$postJson(this._basePath.ajaxCategorySec, param).then(res => {
        if (res.success) {
          id !== undefined && (this.parentCategory = {
            name: name,
            id: id
          })
          this.secTitle = '商品二级分类'
          this.stallList = res.data.datas
          this.totalFloor = res.data.count
          this.secShow = true
          this.showStalls = true
          this.showBusiness = false
        }
      })
    },
    // 编辑二级分类
    getStallDetail(row) {
      this.isFirstShow = true
      this.showDrawer = true
      this.editForm = Object.assign({}, row)
      this.$set(this.editForm, 'categoryId', [row.cParentId, row.cId])
      this.options = [{name: row.cParentName, id: row.cParentId, children: [{name: row.name, id: row.cId }]}]
    },
    disabledFloor(row) {
      if (row.status === 1) {
        const self = this
        this.$confirm('确定禁用该二级分类吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$postJson(this._basePath.ajaxCategoryOperateStatus2, {id: row.id, status: 0}).then(res => {
            if (res.success) {
              this.$message.success('禁用成功！')
              self.getFloors()
            }
          })
        })
      } else {
        this.$postJson(this._basePath.ajaxCategoryOperateStatus2, {id: row.id, status: 1}).then(res => {
          if (res.success) {
            this.$message.success('启用成功！')
            this.getFloors()
          }
        })
      }
    },
    // 显示编辑界面
    handleEdit(index, row) {
      this.dialogStatus = 'update'
      this.secShow = true
      this.editForm = Object.assign({}, row)
      this.$set(this.editForm, 'categoryId', [row.cParentId, row.cId])
    },
    // 新增
    createData: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          const para = Object.assign({}, this.editForm)
          para.cParentId = this.editForm.categoryId[0]
          para.cId  = this.editForm.categoryId[1]
          para.parentId = this.parentCategory.id
          this.$post(this._basePath.ajaxCategorySecEdit, para).then(res => {
            if (res.success) {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$refs['editForm'].resetFields()
              this.showDrawer = false
              this.getFloors()
            }
          })
        }
      })
    },
    // 大楼全选单选多选
    selsChange(sels) {
      this.sels = sels
    },
    // 全选单选多选
    floorChange(sels) {
      this.selectArr = sels
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