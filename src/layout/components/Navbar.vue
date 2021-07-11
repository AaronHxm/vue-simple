<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container"
               @toggleClick="toggleSideBar"/>

    <breadcrumb class="breadcrumb-container" style="#fff"/>

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <search id="header-search" class="right-menu-item"/>

        <error-log class="errLog-container right-menu-item hover-effect"/>

        <screenfull id="screenfull" class="right-menu-item hover-effect"/>

        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect"/>
        </el-tooltip>

      </template>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/profile/index">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>修改密码</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登陆</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'
  import ErrorLog from '@/components/ErrorLog'
  import Screenfull from '@/components/Screenfull'
  import SizeSelect from '@/components/SizeSelect'
  import Search from '@/components/HeaderSearch'
  import SockJS from './socket.io'

  export default {
    components: {
      Breadcrumb,
      Hamburger,
      ErrorLog,
      Screenfull,
      SizeSelect,
      Search
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'avatar'
      ])
    },
    created() {
      // this.connect()
      this.connect()
    },
    data: {
      // 按钮加载条控制
      sendLoading: false,
      // 当前用户名
      userName: '',
      // 当前用户名
      socket: null,
      // 消息类型
      msgType: '01',
      // 消息数据
      msgContent: '',
      // 消息列表
      msgList: [],
      // 注销按钮是否显示
      logOutShowFlag: false
    },
    methods: {
      initsss(){
        var websocket = null;

        //判断当前浏览器是否支持WebSocket
        if ('WebSocket' in window) {
          websocket = new WebSocket("ws://10.10.40.140:8080/ws");
        } else {
          alert('浏览器不支持webSocket')
        }

        //连接发生错误的回调方法
        websocket.onerror = function () {
          // setMessageInnerHTML("error");
        };

        //连接成功建立的回调方法
        websocket.onopen = function (event) {
          // setMessageInnerHTML("open");
        }

        //接收到消息的回调方法
        websocket.onmessage = function (event) {
          // setMessageInnerHTML(event.data);
          // this.$notify({
          //   // dangerouslyUseHTMLString: true,
          //   type: 'success',
          //   message: event.data,
          //   duration: 2000
          // })
          alert(event.data)
        }

        //连接关闭的回调方法
        websocket.onclose = function () {
          // setMessageInnerHTML("close");
        }

        //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
        window.onbeforeunload = function () {
          websocket.close();
        }

        //将消息显示在网页上
        function setMessageInnerHTML(innerHTML) {
          // document.getElementById('message').innerHTML += innerHTML + '<br/>';
        }

      },
      connect() {
        console.log('xxxxxxxx')
        this.socket = SockJS.connect('10.10.40.140:9090', {
          'query': 'userName= aaa',
          // 放弃之前尝试重新连接的次数，默认值 Infinity
          'reconnectionAttempts': 3,
          // 每次连接等待时间 默认值 1000
          'reconnectionDelay': 3000
        })

        // 监听receiveMsg接收消息事件
        this.socket.on('receiveMsg', (data) => {
          console.log(data, 'datadatadatadatadatadatadatadatadatadata')
          data.msgDate = moment().format('HH:mm:ss')
          if (data.msgType == '00') {
            // 发送消息给全部人
            this.$notify({
              dangerouslyUseHTMLString: true,
              title: data.sourceUserName,
              message: '<b>' + data.msgContent + '</b>',
              duration: 6000
            })
          }
        })
      },
      toggleSideBar() {
        this.$store.dispatch('app/toggleSideBar')
      },
      async logout() {
        await this.$store.dispatch('user/logout')
        this.$router.push(`/login?redirect=11`)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

    .hamburger-container {
      line-height: 46px;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background .3s;
      -webkit-tap-highlight-color: transparent;

      &:hover {
        background: rgba(0, 0, 0, .025)
      }
    }

    .breadcrumb-container {
      float: left;
    }

    .right-menu {
      float: right;
      height: 100%;
      line-height: 50px;

      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;

        &.hover-effect {
          cursor: pointer;
          transition: background .3s;

          &:hover {
            background: rgba(0, 0, 0, .025)
          }
        }
      }

      .avatar-container {
        margin-right: 30px;

        .avatar-wrapper {
          margin-top: 5px;
          position: relative;

          .user-avatar {
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }

          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
