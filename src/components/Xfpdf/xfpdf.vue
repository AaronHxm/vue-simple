<template>
  <div class="main" ref="pdfDiv" style="margin:50px 0px; text-align: center">
    <!--如果不显示button就展示所有的页面-->
    <div style="position :fixed;z-index: 9999;text-align: center;width: 100%">
      <template v-if="isShowButtonGroups">

        <div style="margin-bottom: 1%">
          <button :class="{select:idx==0}"
                  @touchstart="idx=0"
                  @touchend="idx=-1"
                  @click="bigOrSmall(1)">
            放大
          </button>
          <button :class="{select:idx==1}"
                  @touchstart="idx=1"
                  @touchend="idx=-1"
                  @click="bigOrSmall(-1)">
            缩小
          </button>
          <select v-model="pdfSize">
            <option v-for="item in selectData"
                    v-text="item.label"
                    :value="item.value"
            >
            </option>
          </select>
          <button @click="printPdf">
            打印/下载
          </button>
        </div>
      </template>
      <template v-if="isPaging">
        <button @click="upOrDown(-1)">上一页</button>
        <button>{{numPages}}/{{totalPages}}</button>
        <button @click="upOrDown(1)">下一页</button>
      </template>
    </div>
    <template v-if="!isPaging">
      <pdf v-for=" i in totalPages"
           :src="pdfUrl"
           :page="i"
           style="margin: 0px 0px 20px 0px"
           ref="xfpdf"
      >
      </pdf>
    </template>
    <!--显示上一页 下一页-->
    <template v-if="isPaging">
      <div>
        <pdf
          :src="pdfUrl"
          :page="numPages"
          ref="xfpdf"
        >
        </pdf>
      </div>
    </template>
    <button @click="agreeHandle"
            style="position :fixed;bottom:0 ; margin-bottom: 30px">{{bottomButton}}
    </button>

  </div>

</template>

<script>
  /*版本号    "vue-pdf": "^4.1.0"  */
  import pdf from 'vue-pdf'
  import request from '../../service/request'

  export default {
    components: { pdf },
    name: 'xfpdf',
    data() {
      return {
        pdfSize: 100,
        selectData: [
          { label: '50%', value: 50 },
          { label: '75%', value: 75 },
          { label: '100%', value: 100 },
          { label: '125%', value: 125 },
          { label: '150%', value: 150 },
          { label: '200%', value: 200 },
          { label: '300%', value: 300 },
          { label: '400%', value: 400 }
        ],
        /*放大系数*/
        scale: 100,
        idx: -1,
        /*当前页码*/
        currentPageNum: '',
        /**
         * 是否展示下一步按钮
         */
        isShowNextStep: false,
        /**
         * 总页数
         */
        totalPages: 0,
        numPages: 0,
        /*PDF路径*/
        pdfUrl: '',
        /*动态下标 用于多个PDF切换*/
        activeIndex: 0
      }

    },

    props: {
      pdfUrlKey: {
        type: String,
        default: 'pdfUrl'
      },

      /*请求方式*/
      requestType: {
        type: String,
        default: 'GET'
      },
      /*请求参数*/
      pdfParams: Object,

      /*是否显示放大 缩小按钮组*/
      isShowButtonGroups: {
        type: Boolean,
        default: true
      },
      /*是否显示上一页   下一页*/
      isPaging: {
        type: Boolean,
        default: false
      },
      /*pdf集合*/
      pdfList: {
        type: Array,
        default: []
      },
      /*下方按钮内容*/
      bottomButton: {
        type: String,
        default: '已阅读'
      },
      requestUrl: {
        type: String,
        default: ''
      }
    },
    created() {
      this.initData()
    },
    watch: {
      /*监听pdfSize的变化*/
      pdfSize(val) {
        if (this.isPaging) {
          this.$refs.xfpdf.$el.style.width = parseInt(val) + '%'
        }
        /*显示全部页面 遍历*/
        const pages = this.$refs.xfpdf.length
        if (!this.isPaging) {
          for (let i = 0; i < pages; i++) {
            this.$refs.xfpdf[i].$el.style.width = parseInt(val) + '%'
          }
        }
      }
    },
    methods: {
      /*初始化数据   分为两种情况  1,直接给路径 ,2 ajax请求*/
      initData() {
        const that = this
        if (this.pdfList.length > 0) {
          let readPdfUrl = ''
          for (let i = 0; i < that.pdfList.length; i++) {
            if (typeof (this.pdfList[i]) === 'string') {
              that.pdfList[i] = {
                'pdfUrl': that.pdfList[i]
              }
            } else {
              const valueOfUrl = that.pdfList[i][that.pdfUrlKey]
              that.pdfList[i] = { 'pdfUrl': valueOfUrl }
            }
          }
          readPdfUrl = that.pdfList[0]['pdfUrl']
          that.getNumPages(readPdfUrl)
          return
        }
        /*如果pdfList的长度大于0 证明直接给了路径  直接调用初始化pdf的方法*/
        const promise = request(this.pdfUrl, this.pdfParams, this.requestType)
        this.promiseMethod(promise)
      },
      /*调用接口之后的方法*/
      promiseMethod(promise) {
        const that = this
        promise.then(function(reponse) {
          const dataLength = reponse.data.length
          /*遍历后台请求的结果*/
          for (let i = 0; i < dataLength; i++) {
            const dataIndexI = reponse.data[i]
            if (typeof (dataIndexI) == 'string') {
              const jso = JSON.parse(dataIndexI)
              const pdfUrlOfRes = jso[that.pdfUrlKey]
              const pdfUrlObject = { 'pdfUrl': pdfUrlOfRes }
              that.pdfList.push(pdfUrlObject)
            } else {
              const pdfUrlOfRes = dataIndexI[that.pdfUrlKey]
              const pdfUrlObject = { 'pdfUrl': pdfUrlOfRes }
              that.pdfList.push(pdfUrlObject)
            }
          }
          that.getNumPages(that.pdfList[0].pdfUrl)
        }).catch(function(error) {
          that.$notify({
            message: 'pdf加载失败',
            type: 'error',
            duration: 2000
          })
        })
      },
      //放大或者缩小
      bigOrSmall(val) {
        /*缩小*/
        if (val == -1) {
          if (this.scale == 50) {
            return
          }
          this.scale += -5
        }
        /*放大*/
        if (val == 1) {
          this.scale += 5
        }
        const pages = this.$refs.xfpdf.length
        /*显示全部页数的话是需要遍历的 不显示不需要*/
        /**显示上一页 下一页    也就是不显示全部页面**/
        if (this.isPaging) {
          this.$refs.xfpdf.$el.style.width = parseInt(this.scale) + '%'
        }
        /*显示全部页面 遍历*/
        if (!this.isPaging) {
          for (let i = 0; i < pages; i++) {
            this.$refs.xfpdf[i].$el.style.width = parseInt(this.scale) + '%'
          }
        }
      },

      printPdf() {
        /**显示上一页 下一页    也就是不显示全部页面**/
        if (this.isPaging) {
          this.$refs.xfpdf.print()
        }
        if (!this.isPaging) {
          this.$refs.xfpdf[0].print()
        }
      },
      /**
       * 上一页
       */
      upOrDown(val) {
        /*滚到顶端*/
        scrollTo(0, 0)
        /*滚到顶端*/
        this.$refs.pdfDiv.scrollTo(0, 0)
        if (val == -1) {
          /*上一页*/
          if (this.numPages > 1) {
            this.numPages--
          }
        }
        if (val == 1) {
          if (this.numPages < this.totalPages) {
            this.numPages++
          }
          if (this.numPages == this.totalPages) {
            this.isShowNextStep = true
          }
        }
      },
      getNumPages(url) {
        let loadingTask = pdf.createLoadingTask(url)
        this.numPages = 1
        this.pdfUrl = loadingTask
        loadingTask.promise.then(pdf => {
          this.totalPages = pdf.numPages
          return true
        }).catch((err) => {
          console.error('pdf加载失败', err)
          return false
        })
      },
      pdfClick(pdfUrl, index) {
        if (index == this.activeIndex) return
        this.activeIndex = index
        this.pdfUrl = null
        this.getNumPages(pdfUrl)
      },
      /*点击下方已同意方法*/
      agreeHandle() {
        if (this.activeIndex + 1 === this.pdfList.length) {
          this.$emit('overMethod')
        } else {
          /*滚到顶端*/
          scrollTo(0, 0)
          /*滚到顶端*/
          this.$refs.pdfDiv.scrollTo(0, 0)
          this.pdfClick(this.pdfList[this.activeIndex + 1].pdfUrl, this.activeIndex + 1)
        }
      }
    }
  }
</script>

<style scoped>
  .main {
    overflow-x: scroll;
    height: 800px;
  }
</style>
