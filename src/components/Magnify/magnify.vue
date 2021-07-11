<template>
  <div style="display: inline">

    <el-carousel type="card" style="width: 50%">
      <el-carousel-item v-for="arr in myArray" >

        <a data-magnify="gallery" :href="arr.img">
          <img :src="arr.img" style="width: 100%; height: 100%">
        </a>

      </el-carousel-item>
    </el-carousel>

  </div>

</template>

<script>
  import $ from 'jquery'

  export default {
    name: 'Magnify',
    props: {
      images: {
        type: Array,
        require: true
      }
    },
    data() {
      return {
        myArray: []
      }
    },
    created() {
      const imgArray = this.images
      this.images = []
        for (let i = 0; i < imgArray.length; i++) {
          this.myArray.push(
            {
              'img': imgArray[i]
            }
          )
        }

      this.init()
    },
    methods: {

  // 查看图片工具的初始化方法
  init()
  {
    $('[data-magnify]').magnify({
      headToolbar: [
        'close'
      ],
      footToolbar: [
        'zoomIn',
        'zoomOut',
        'prev',
        'fullscreen',
        'next',
        'actualSize',
        'rotateRight'
      ],
      title: false
    })
  }
  }

  }
</script>

<style scoped>

  .magnify-modal {
    box-shadow: 0 0 6px 2px rgba(0, 0, 0, 0.3);
  }

  .magnify-header .magnify-toolbar {
    background-color: rgba(0, 0, 0, .5);
  }

  .magnify-stage {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border-width: 0;
  }

  .magnify-footer .magnify-toolbar {
    background-color: rgba(0, 0, 0, .5);
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  .magnify-header,
  .magnify-footer {
    pointer-events: none;
  }

  .magnify-button {
    pointer-events: auto;
  }
</style>
