<template>
  <section class="app-container" id="editor_frame">
    <Editor ref="editor" :initialHtml="obj.value"></Editor>
    <div class="save_btn">
      <el-button type="primary" @click="saveEditor">保存</el-button>
    </div>
  </section>
</template>
<script>
  export default {
    name: 'editor',
    data() {
      return {
        obj: {}
      }
    },
    created() {
      this.getDocuments()
      this.saveEditor = this._debounce(this.saveEditor)
    },
    components: {},
    methods: {
      getDocuments() {
        this.$postJson(this._basePath.ajaxGetChargeStandard, {code: 'chargeStandard'}).then(res => {
          if (res.success) {
            this.obj = res.data[0]
          }
        })
      },
      saveEditor() {
        const param = {
          bizCode: 'chargeStandard',
          value: this.$refs.editor.getParams(),
          id: this.obj.id
        }
        this.$post(this._basePath.ajaxChargeStandardSave, param).then(res => {
          if (res.success) {
            this.$message.success('保存成功')
          }
        })
      }
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/css/index'
  #editor_frame
    .save_btn
      mt(10px)
      center()
</style>