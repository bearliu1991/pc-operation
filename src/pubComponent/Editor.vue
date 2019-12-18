<template>
  <div id="editor_frame">
    <quill-editor v-model="content"></quill-editor>
  </div>
</template>
<script>
  import { quillEditor } from 'vue-quill-editor'
  export default {
    name: 'editor',
    data() {
      return {
        content: ''
      }
    },
    watch: {
      initialHtml() {
        this.content = this.initialHtml
      }
    },
    props: {
      initialHtml: {
        type: String,
        default: ''
      }
    },
    components: {},
    methods: {
      getParams() {
        return this.content
      }
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/css/index'
  #editor_frame
    #editor
      height:500px
</style>