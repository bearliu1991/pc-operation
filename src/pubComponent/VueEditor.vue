<template>
  <div id="vue_editor">
    <div class="editor_cont">
        <!-- <quill-editor ref="myTextEditor" v-model="content" :options="editorOption"></quill-editor> -->
        <!-- <el-button class="editor-btn" type="primary" @click="submit">提交</el-button> -->
    </div>
  </div>
</template>

<script>
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'
// import { quillEditor } from 'vue-quill-editor'
export default {
  name: 'editor',
  data: function() {
    return {
      content: '',
      editorOption: {
        placeholder: '商品详情描述'
      }
    }
  },
  props: ['description'],
  components: {
    // quillEditor
  },
  created() {
    this.content = this.description
  },
  methods: {
    onEditorChange({ editor, html, text }) {
      this.content = html
    },
    getParams() {
      return this.content
    },
    submit() {
      this.$message.success('提交成功！')
    }
  }
}
</script>
<style lang="stylus" scoped>
  .vue_editor
    .editor_cont
      .editor-btn
          margin-top: 20px
</style>