<template>
  <div id="withdrawSetting">
    <el-tabs v-model="activeName" class="switch_btn" @tab-click="switchPane">
      <el-tab-pane label="档口提现通道" name="stall"></el-tab-pane>
      <el-tab-pane label="采购端提现通道" name="buyer"></el-tab-pane>
      <el-tab-pane label="银行卡校验配置" name="verifyTime"></el-tab-pane>
    </el-tabs>
    <ul class="channel_list" v-if="activeName !== 'verifyTime'">
      <li v-for="(item, index) in platformList.filter(n => n.userType === activeName)" :key="index">
        <span class="icon" :class="[formatChannel(item.channel, true).class]" v-html="formatChannel(item.channel, true).icon">&#xe612;</span>
        <h3>{{formatType(item.userType)}}-{{formatChannel(item.channel)}}提现通道</h3>
        <i>当日最大提现额度{{item.platformDailyMax | _toThousand}}元</i>
        <i>单笔最小提现限额{{item.personalSingleMin | _toThousand}}元</i>
        <i>单笔最大提现限额{{item.personalSingleMax | _toThousand}}元</i>
        <i>当日个人最多提现{{item.personalDailyTimes | _toThousand}}次</i>
        <i>(提现费率{{item.serviceChargeRate}}%，最小{{item.serviceChargeMin}}元，最大{{item.serviceChargeMax}}元)</i>
        <el-button type="primary" @click="showDialog(item)">设置</el-button>
        <span class="err_color status_color" v-if="item.status === 2">自动关闭-商户号余额不足</span>
        <span class="success_color status_color" v-if="item.status === 1">开启中</span>
        <span class="err_color status_color" v-if="item.status === 3">手动关闭</span>
      </li>
    </ul>
    <ul class="channel_list" v-else>
      <li>
        <span class="icon warn_color">&#xe625;</span>
        <h3>银行卡三要素校验</h3>
        <i>当日已完成校验{{verifyForm.todayTotalNum}}次</i>
        <i>总计已完成校验{{verifyForm.totalNum}}次</i>
        <div class="set_verify">
          <i>当日个人最大可校验次数</i>
          <el-form :model="verifyForm" ref="verifyForm">
            <el-form-item 
            :rules="[{required: true, validator: mustNumber, message: '校验次数需为数字'}]">
              <el-input size="medium" v-model="verifyForm.value"></el-input>
            </el-form-item>
          </el-form>
          <el-button size="medium" type="primary" @click="setVerifyTime">设置</el-button>
        </div>
      </li>
    </ul>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="setDialogShow"
      width="760px"
      center>
      <div class="dialog_wrap">
        <div class="form_wrap">
          <el-form :inline="true" label-width="200px" :model="editForm" ref="editForm"
            :rules="editFormRules" @submit.native.prevent>
            <el-form-item v-if="currItem.channel === 'bank'" style="width:100%" :label="currItem.userType === 'stall' ? '采购端平台当日最大提现额度' : '档口端平台当日最大提现额度'">
              <div class="set_start">
                <span>{{occupyLimit | _toThousand}}</span>
                <el-tooltip :content="`银行卡提现通道的平台当日最大提现额度由采购端和档口端共享，故两者总和不大于平台当日最大提现额度${_toThousand(PLATEFORM_MAX)}`" style="margin-left:10px" placement="top" :open-delay="300">
                  <i class="icon">&#xe657;</i>
                </el-tooltip>
              </div>
            </el-form-item>
            <el-form-item label="平台当日最大提现额度">
              <el-input size="medium" v-model="editForm.platformDailyMax" placeholder="最大提现额度"></el-input>
            </el-form-item>
            <el-form-item label="渠道当日最大提现额度" prop="channelPlatformDailyMax">
              <el-input size="medium" v-model="editForm.channelPlatformDailyMax" placeholder="最大提现额度"></el-input>
            </el-form-item>

            <el-form-item label="平台手续费费率"  prop="serviceChargeRate">
              <el-input size="medium" v-model="editForm.serviceChargeRate" placeholder="手续费费率">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
            <el-form-item label="渠道手续费费率"  prop="channelServiceChargeRate">
              <el-input size="medium" v-model="editForm.channelServiceChargeRate" placeholder="手续费费率">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>

            <el-form-item label="平台个人单笔最大提现额度" prop="personalSingleMax">
              <el-input size="medium" v-model="editForm.personalSingleMax" placeholder="单笔最大提现额度"></el-input>
            </el-form-item>
            <el-form-item label="渠道个人单笔最大提现额度" prop="channelPersonalSingleMax">
              <el-input size="medium" v-model="editForm.channelPersonalSingleMax" placeholder="单笔最大提现额度"></el-input>
            </el-form-item>

            <el-form-item label="平台个人单笔最小提现额度" prop="personalSingleMin">
              <el-input size="medium" v-model="editForm.personalSingleMin" placeholder="单笔最小提现额度"></el-input>
            </el-form-item>
            <el-form-item label="渠道个人单笔最小提现额度" prop="channelPersonalSingleMin">
              <el-input size="medium" v-model="editForm.channelPersonalSingleMin" placeholder="单笔最小提现额度"></el-input>
            </el-form-item>

            <el-form-item label="平台最大手续费" prop="serviceChargeMax">
              <el-input size="medium" v-model="editForm.serviceChargeMax" placeholder="最大手续费"></el-input>
            </el-form-item>
            <el-form-item label="渠道最大手续费" prop="channelServiceChargeMax">
              <el-input size="medium" v-model="editForm.channelServiceChargeMax" placeholder="最大手续费"></el-input>
            </el-form-item>

            <el-form-item label="平台最小手续费" prop="serviceChargeMin">
              <el-input size="medium" v-model="editForm.serviceChargeMin" placeholder="最小手续费"></el-input>
            </el-form-item>
            <el-form-item label="渠道最小手续费" prop="channelServiceChargeMin">
              <el-input size="medium" v-model="editForm.channelServiceChargeMin" placeholder="最小手续费"></el-input>
            </el-form-item>

            <el-form-item label="平台个人当日最多提现次数" prop="personalDailyTimes">
              <el-input size="medium" v-model="editForm.personalDailyTimes" placeholder="当日最多提现次数"></el-input>
            </el-form-item>
            <el-form-item label="开启状态" prop="status">
              <el-switch
                v-model="editForm.status"
                :active-value="1"
                active-color="#13ce66"
                :inactive-value="3">
              </el-switch>
            </el-form-item>
          </el-form>
        </div>
        <div class="set_middle">
          <el-button @click.native="setDialogShow = false">取消</el-button>
          <el-button type="primary" @click="saveSetting">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: '',
    data() {
      return {
        PLATEFORM_MAX:2000000,
        setDialogShow: false,
        dialogTitle: '',
        activeName: 'stall',
        currItem: {},
        occupyLimit: 0,
        verifyForm: {
          value: ''
        },
        editForm: {
          platformDailyMax: 0,
          serviceChargeRate: 0,
          personalSingleMax: 0,
          personalSingleMin: 0,
          serviceChargeMin: 0,
          serviceChargeMax: 0,
          personalDailyTimes: 0
        },
        editFormRules: {
          channelPlatformDailyMax: [
            { required: true, validator: this.mustNumber, message: '需为有效数字', trigger: 'blur'}
          ],
          channelPersonalSingleMax: [
            { required: true, validator: this.mustNumber, message: '需为有效数字', trigger: 'blur'}
          ],
          platformDailyMax: [
            { required: true, validator: this.mustNumber, message: '需为有效数字', trigger: 'blur'},
            { required: true, validator: this.smallThan, trigger: 'blur'},
            { required: true, validator: this.sumSmallThan, trigger: 'blur'}
          ],
          platformDailyMax1: [
            { required: true, validator: this.mustNumber, message: '需为有效数字', trigger: 'blur'},
            { required: true, validator: this.smallThan, trigger: 'blur'},
            { required: true, validator: this.sumSmallThan, trigger: 'blur'}
          ],
          serviceChargeRate: [
            { required: true, validator: this.mustNumber, message: '需为有效数字', trigger: 'blur'},
            { required: true, validator: this.areaNum, message: '费率介于0 ~ 100之间', trigger: 'blur'},
          ],
          personalSingleMax: [
            { required: true, validator: this.mustNumber, message: '需为有效数字', trigger: 'blur'},
            { required: true, validator: this.smallThan, trigger: 'blur'}
          ],
          personalSingleMin: [{ required: true, validator: this.mustNumber, message: '需为数字', trigger: 'blur'}],
          serviceChargeMin: [{ required: true, validator: this.mustNumber, message: '需为数字', trigger: 'blur'}],
          serviceChargeMax: [{ required: true, validator: this.mustNumber, message: '需为数字', trigger: 'blur'}],
          personalDailyTimes: [{ required: true, validator: this.mustNumber, message: '需为数字', trigger: 'blur'}],
        },
        platformList: [
          {
            userType: 'stall',
            platformDailyMax: 0,
            serviceChargeRate: 0,
            personalSingleMax: 0,
            personalSingleMin: 0,
            serviceChargeMin: 0,
            serviceChargeMax: 0,
            personalDailyTimes: 0,
            channel: 'bank'
          },
          {
            userType: '',
            platformDailyMax: 0,
            serviceChargeRate: 0,
            personalSingleMax: 0,
            personalSingleMin: 0,
            serviceChargeMin: 0,
            serviceChargeMax: 0,
            personalDailyTimes: 0,
            channel: 'zfb'
          },
          {
            userType: '',
            platformDailyMax: 0,
            serviceChargeRate: 0,
            personalSingleMax: 0,
            personalSingleMin: 0,
            serviceChargeMin: 0,
            serviceChargeMax: 0,
            personalDailyTimes: 0,
            channel: 'wx'
          },
          {
            userType: 'buyer',
            platformDailyMax: 0,
            serviceChargeRate: 0,
            personalSingleMax: 0,
            personalSingleMin: 0,
            serviceChargeMin: 0,
            serviceChargeMax: 0,
            personalDailyTimes: 0,
            channel: 'bank'
          }
        ]
      }
    },
    created() {
      // status 提现通道状态 1. '开启中'； 2.  ‘自动关闭-余额不足’ 3. ‘手动关闭’
      this.init()
      this.saveSetting = this._debounce(this.saveSetting)
      this.setVerifyTime = this._debounce(this.setVerifyTime)
    },
    components: {},
    methods: {
      init() {
        this.getUsers()
        this.getVerifyTime()
      },
      smallThan(rule, value, callback) {
        // 微信
        if (this.currItem.channel === 'wx') {
          if (rule.field === 'platformDailyMax' && value > this.editForm.channelPlatformDailyMax) {
            callback(new Error('不可大于渠道相关费用'))
            return false
          } else if (rule.field === 'personalSingleMax' && value > this.editForm.channelPersonalSingleMax) {
            callback(new Error('不可大于渠道相关费用'))
            return false
          }
        // 支付宝
        } else if (this.currItem.channel === 'zfb') {
          if (rule.field === 'platformDailyMax' && value > this.editForm.channelPlatformDailyMax) {
            callback(new Error('不可大于渠道相关费用'))
            return false
          } else if (rule.field === 'personalSingleMax' && value > this.editForm.channelPersonalSingleMax) {
            callback(new Error('不可大于渠道相关费用'))
            return false
          }
        // 银行
        } else if (this.currItem.channel === 'bank') {
          if (rule.field === 'platformDailyMax' && value > this.editForm.channelPlatformDailyMax) {
            callback(new Error('不可大于渠道相关费用'))
            return false
          } else if (rule.field === 'personalSingleMax' && value > this.editForm.channelPersonalSingleMax) {
            callback(new Error('不可大于渠道相关费用'))
            return false
          }
        }
        callback()
      },
      getVerifyTime() {
        this.$post(this._basePath.ajaxOperateGetVerifyTime).then(res => {
          if (res.success) {
            this.verifyForm = res.data
          }
        })
      },
      setVerifyTime() {
        this.$refs.verifyForm.validate((valid) => {
          this.$postJson(this._basePath.ajaxOperateSetVerifyTime, {number: this.verifyForm.value, id: this.verifyForm.id}).then(res => {
            if (res.success) {
              this.$message.success('保存成功!')
            }
          })
        })
      },
      sumSmallThan(rule, value, callback) {
        if (this.currItem.channel === 'bank' && (this.occupyLimit - 0 + (this.editForm.platformDailyMax - 0) > this.editForm.channelPlatformDailyMax)) {
          callback(new Error(`档口和采购端银行提现总额不大于${this._toThousand(this.PLATEFORM_MAX)}`))
          return false
        }
        callback()
      },
      areaNum(rule, value, callback) {
        if (value < 0 || value > 100) {
          callback(new Error(rule.message))
        } else {
          callback()
        }
      },
      formatType(userType) {
        return userType === 'stall' ? '档口' : userType === 'buyer' ? '采购端' : ''
      },
      formatChannel(channel, isClass) {
        if (isClass) return channel === 'wx' ? {class: 'success_color', icon: '&#xe612;'} : channel === 'zfb' ? {class: 'text_color', icon: '&#xe605;'} : channel === 'bank' ? {class: 'warn_color', icon: '&#xe625;'} : {}
        return channel === 'wx' ? '微信' : channel === 'zfb' ? '支付宝' : channel === 'bank' ? '银行' : ''
      },
      showDialog(item) {
        this.currItem = item
        this.setDialogShow = true
        this.$refs.editForm && this.$refs.editForm.resetFields()
        this.editForm = Object.assign({}, item)
        if (item.channel === 'wx') {
          this.dialogTitle = '档口-微信提现设置'
        }
        if (item.channel === 'zfb') {
          this.dialogTitle = '档口-支付宝提现设置'
        }
        if (item.channel === 'bank') {
          if (item.userType === 'buyer') {
            this.dialogTitle = '采购端-银行卡提现设置'
            this.occupyLimit = this.platformList[0].platformDailyMax
          } else if (item.userType === 'stall') {
            this.occupyLimit = this.platformList[3].platformDailyMax
            this.dialogTitle = '档口-银行卡提现设置'
          }
        }
      },
      saveSetting() {
        this.$refs.editForm.validate(valid => {
          if (valid) {
            let param = Object.assign({}, this.editForm)
            param.userType = this.currItem.userType
            param.channel = this.currItem.channel
            param.serviceChargeRate = this.editForm.serviceChargeRate / 100
            param.id = this.currItem.id
            this.$post(this._basePath.ajaxWithdrawSettingSave, param).then(res => {
              if (res.success) {
                this.$message.success('保存成功')
                this.setDialogShow = false
                this.getUsers()
              }
            })
          }
        })
      },
      switchPane(val) {
        this.activeName = val.name
      },
      getUsers() {
        this.$post(this._basePath.ajaxWithdrawSettingByPage).then(res => {
          if (res.success) {
            const arr = res.data ? res.data : []
            if (arr.length) {
              for (let item of arr) {
                item.serviceChargeRate = item.serviceChargeRate * 100
                const index = this.platformList.findIndex(n => {
                  if (item.channel === "bank") {
                    return n.userType === item.userType && n.channel === item.channel
                  }
                  return n.channel === item.channel
                })
                index > -1 && this.$set(this.platformList, index, item)
              }
            }
          }
        })
      }
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/css/index'
  #withdrawSetting
    .switch_btn
      .el-tabs__item
        fn(16px)
    .channel_list
      setAround()
      li
        setColumn()
        align-items:center
        .icon
          fn(60px)
          margin:30px
        h3
          margin:15px
          fn(16px)
        i
          mt(10px)
        .el-button
          margin:30px
      .set_verify
        mt(10px)
        setMiddle()
        .el-button
          margin:0
        i
          mt(0)
        .el-form-item
          mb(0)
        .el-input
          width:80px
          margin: 0 10px
    .dialog_wrap
      .form_wrap
        .el-form
          margin:auto
          .el-form-item
            .el-form-item__error
              padt(2px)
              fn(10px)
          .el-input
            width:140px
            input
              padding: 0 5px
</style>