<template>
    <div id="good_img_upload">
      <el-upload
      class="upload_btn"
      ref="upload"
      :action="uploadUrl"
      :before-upload="beforeUpload"
      :on-exceed="onexceed"
      :on-success="uploadSuccess"
      :on-error="uploadErr"
      :headers="headers"
      :limit="maxImgNum"
      :multiple="isGroup"
      :file-list="fileList"
      :drag="true"
      :show-file-list="false"
      list-type="file">
      <ul class="imgs_list">
          <li v-for="(item, idx) in imgTotalList" class="slick_item" :index="idx" :key="idx">
            <div class="item_wrap">
              <div v-if="idx === 0" @click.stop class="main_img"
              @mouseenter.stop="imgHover(idx)" @mouseleave.stop="imgHover(idx, true)">{{mainTitle}}</div>
              <img :src="item" v-if="item" @error="imgLoadErr" :class="{main_pic: idx === 0}" class="img_cont"
                @mouseenter.stop="imgHover(idx)" @mouseleave.stop="imgHover(idx, true)" @click.stop="scanBigImg(idx)"/>
              <div v-if="!item" class="no_img" @click="imgRefresh(idx)">
                <el-button type="text">+</el-button>
                <span>添加上传图片</span>
              </div>
              <div class="process_img" v-if="mouseEnter && (imgActiveIdx === idx) && item"
              @mouseenter.stop="imgHover(idx)" @mouseleave.stop="imgHover(idx, true)" @click="barClick($event)">
                <i class="icon" @click.stop="moveNext(idx)" v-if="idx !== 0 && isGroup" size="mini">&#xe604;</i>
                <i type="text" class="icon" size="mini" @click.stop="removeImg(idx)">&#xe624;</i>
                <i type="text" class="icon" size="mini" @click="imgRefresh(idx)">换</i>
                <i type="text" class="icon" @click.stop="moveNext(idx, true)" 
                  v-if="idx !== imgTotalList.length - 1 && isGroup" size="mini">&#xe648;</i>
              </div>
            </div>
            <div class="split_p" @click.stop></div>
          </li>
        </ul>
        <el-button size="small" ref="fileBtn" type="primary" style="visibility:hidden" @click="clearImg">点击上传</el-button>
        <!-- <div slot="tip" class="el-upload__tip"> -->
          <!-- <ul class="imgs_list">
            <li v-for="(item, idx) in imgTotalList" :key="idx">
              <img @click.stop="scanBigImg(idx)" :src="item" />
              <p @click.stop="imgTotalList.splice(idx, 1)">X</p>
            </li>
          </ul> -->
          <!-- <p>只能上传jpg/png文件，且不超过500kb</p> -->
          <!-- <SlickList v-model="imgTotalList" class="imgs_list" axis="x" :hideSortableGhost="true" :pressDelay="200">
            <SlickItem v-for="(item, idx) in imgTotalList" :item="item" class="slick_item" :index="idx" :key="idx">
              <div v-if="idx === 0 && mouseEnter && (imgActiveIdx === idx)" @click.stop class="main_img"
              @mouseenter.stop="imgHover(idx)" @mouseleave.stop="imgHover(idx, true)">*宝贝主图</div>
              <img :src="item" v-if="item" :class="{main_pic: idx === 0}" class="img_cont"
              @mouseenter.stop="imgHover(idx)" @mouseleave.stop="imgHover(idx, true)" @click.stop="scanBigImg(idx)"/>
              <div v-if="!item" class="no_img" @click.stop="openFileList">
                <el-button type="text">+</el-button>
                <span>添加上传图片</span>
              </div>
              <div class="process_img" v-if="mouseEnter && (imgActiveIdx === idx)"
              @mouseenter.stop="imgHover(idx)" @mouseleave.stop="imgHover(idx, true)">
                <el-button type="text" @click.stop="moveNext(idx)" v-if="idx !== 0" size="mini"><</el-button>
                <el-button type="text" class="icon" size="mini" @click.stop="removeImg(idx)">&#xe624;</el-button>
                <el-button type="text" @click.stop="moveNext(idx, true)" v-if="idx !== imgTotalList.length - 1" size="mini">></el-button>
              </div>
            </SlickItem>
          </SlickList> -->
        <!-- </div> -->
      </el-upload>
      <el-dialog
        title=""
        append-to-body
        width="600px"
        :visible.sync="showBigImg">
        <div style="text-align:center">
          <img style="max-height:90%; max-width:90%" :src="imgTotalList[bigImgIdx]">
        </div>
      </el-dialog>
    </div>
  </template>
  <script>
    export default {
      name: '',
      data() {
        return {
          // 鼠标移至图片
          mouseEnter: false,
          imgActiveIdx: -1,
          showBigImg: false,
          bigImgIdx: -1,
          processIdx: -1,
          headers: {'x-auth-token': this.getCookie('x-auth-token')},
          maxImgNum: 5,
          imgTotalList: ['', '', '', '', ''],
          realUrlList: [],
          fileList: [],
          uploadUrl: this._basePath.ajaxUpload,
          tempImgArr: []
        }
      },
      props: {
        // 是否可上传一组图片
        isGroup: {
          type: Boolean,
          default: true
        },
        mainTitle: {
          type: String,
          default: '*宝贝主图'
        },
        imgUrl_main: {
          type: String,
          default: ''
        },
        imgList: {
          type: Array,
          default: () => []
        }
      },
      created() {
        this.init()
      },
      components: {},
      methods: {
        init() {
          if (this.imgList && this.imgList.length) {
            this.imgList.forEach((item, index) => {
              this.imgTotalList[item.position + 1] = item.url
            })
          }
          this.imgTotalList[0] = this.imgUrl_main
          !this.isGroup && (this.imgTotalList = [this.imgUrl_main || ''])
          this.realUrlList = this.imgTotalList.slice()
        },
        removeImg(idx) {
          this.$set(this.imgTotalList, idx, '')
          this.$set(this.realUrlList, idx, '')
          this.$emit('uploadImg', this.getParams())
        },
        imgRefresh(idx) {
          this.processIdx = idx
          this.clearImg()
        },
        // 移动图片
        moveNext(idx, isNext) {
          if (isNext) {
            const obj = this.imgTotalList[idx + 1]
            this.$set(this.imgTotalList, idx + 1, this.imgTotalList[idx])
            this.$set(this.imgTotalList, idx, obj)

            const obj1 = this.realUrlList[idx + 1]
            const obj2 = this.realUrlList[idx]
            this.$set(this.realUrlList, idx + 1, obj2)
            this.$set(this.realUrlList, idx, obj1)
          } else {
            const obj = this.imgTotalList[idx - 1]
            this.$set(this.imgTotalList, idx - 1, this.imgTotalList[idx])
            this.$set(this.imgTotalList, idx, obj)

            const obj1 = this.realUrlList[idx - 1]
            const obj2 = this.realUrlList[idx]
            this.$set(this.realUrlList, idx - 1, obj2)
            this.$set(this.realUrlList, idx, obj1)
          }
          this.$emit('uploadImg', this.getParams())
        },
        // 点击查看上一页下一页
        siblingClick(isNext) {
          if (isNext) {
            this.bigImgIdx = this.bigImgIdx < this.imgTotalList.length - 1 ? this.bigImgIdx + 1 : 0
          } else {
            this.bigImgIdx = this.bigImgIdx > 0 ? this.bigImgIdx - 1 : this.imgTotalList.length - 1
          }
        },
        getParams() {
          let arr = []
          if (this.isGroup) {
            let picList = this.realUrlList.slice(1).forEach((item, index) => {
              item && arr.push({position: index, url: item})
            })
            return {imgUrl_main: this.realUrlList[0], picList: arr}
          } else {
            return this.realUrlList
          }
        },
        beforeUpload(file) {
          const extension = file.name.substring(file.name.lastIndexOf('.') + 1)
          const acceptTypes = ['png','jpg','jpeg','tbi']
          const isLt2M = file.size / 1024 / 1024 < 2
          // const isJPG = file.type === 'image/jpeg'
          // if (!isJPG) {
          //   this.$message.error('上传头像图片只能是 JPG 格式!');
          // }
          if (!acceptTypes.includes(extension)) {
            this.$message.error('只有png,jpg,jpeg,tbi图片文件可以上传')
            return false
          }
          if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!')
          }
          let reader = new FileReader();
          let self = this
          reader.onload = function (e) {
              let data = e.target.result;
              // 加载图片获取图片真实宽度和高度
              let image = new Image()
              image.onload = function() {
                const width = image.width
                const height = image.height
              }
              image.src = data
              self.tempImgArr.push({name: file.name, src: data})
          }
          reader.readAsDataURL(file)
          return isLt2M
        },
        uploadSuccess(res, file, fileList) {
          if (res.success) {
            let allTrue = true
            fileList.forEach((item, index) => {
              !item.response && (allTrue = false)
              if (this.processIdx + index < 5) {
                if (item.response) {
                  this.$set(this.realUrlList, this.processIdx + index, item.response.data)
                  this.$set(this.imgTotalList, this.processIdx + index, this.tempImgArr[index].src)
                }
              }
            })
            this.$emit('uploadImg', this.getParams())
            if (allTrue) {
              this.processIdx = -1
              this.fileList = []
              this.tempImgArr = []
            }
          } else {
            this.$message.error(res.msg)
          }
        },
        uploadErr(err, file, fileList) {
          this.$message.error(err.message)
          this.processIdx = -1
        },
        imgHover(idx, isLeave) {
          if (isLeave) {
            this.mouseEnter = false
            this.imgActiveIdx = -1
            return false
          }
          this.mouseEnter = true
          this.imgActiveIdx = idx
        },
        onexceed(files, fileList) {
          this.$message.error(`图片上传个数应小于${this.maxImgNum}个`)
          this.$refs.upload.abort()
        },
        clearImg() {
          this.fileList = []
        },
        scanBigImg(idx) {
          this.showBigImg = true
          this.bigImgIdx = idx
        },
        barClick(e) {
          if (e.target.nodeName !== "I") {
            window.event ? window.event.cancelBubble = true : e.stopPropagation();
          }
        },
        imgLoadErr(event) {
          let img = event.srcElement
          img.src = `${process.env.CHILD_ROUTE}/static/img_err.png`
          img.onerror = null // 防止闪图
        }
      }
    }
  </script>
  <style lang="stylus">
    imgWidth = 120px
    @import '~@/assets/css/index'
    #good_img_upload
      height:imgWidth
      .el-dialog
        min-width: 500px
      .upload_btn
        width:100%
        overflow-x:auto
        .el-upload-dragger
          width:auto
          height: imgWidth
          border:none
          radius(0)
        .imgs_list
          setStart()
          .slick_item
            setStart()
            .item_wrap
              relative()
              border_()
              square(imgWidth)
              .main_img
                width: calc(100%)
                absolute()
                top:0
                z-index:1
                color()
                center()
                vertical(20px)
                bgColor(rgba(0,0,0,0.5))
              .no_img
                width: imgWidth
              .img_cont
                cursor()
              .process_img
                absolute()
                width:100%
                color()
                setAround()
                bottom:0
                vertical(40px)
                bgColor(rgba(0,0,0,0.7))
                button, i
                  width:24px
                  vertical(24px)
                  setMiddle()
                  align-items:center
                  radius(50%)
                  fn(14px)
                  color(#fff)
                  bgColor(text_color)
              img
                width:100%
                height:100%
            .split_p
              cursor:default
              height:imgWidth
              width:30px
              color(transparent)
        .el-upload__tip
          mt(-20px)
          .imgs_list
            mt(20px)
            .slick_item
              mr(10px)
              height:100%
              relative()
              inline()
              .main_img
                width:100%
                absolute()
                top:0
                z-index:1
                color()
                center()
                vertical(20px)
                bgColor(rgba(0,0,0,0.5))
              .img_cont
                cursor()
              .process_img
                absolute()
                width:100%
                color()
                setMiddle()
                bottom:0
                vertical(20px)
                bgColor(rgba(0,0,0,0.5))
              img
                width:imgWidth
                height:imgWidth
                border_()
  </style>