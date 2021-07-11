<template>
  <div id="Icctel" style="visibility: hidden;margin-top:10px; z-index:'2000' position:fixed !important;"></div>
</template>
<script>
  export default {
    name: 'Tel',
    props:{
      seatNo:{
        type:Number,
        default:8008
      },
      seatExt:{
        type:Number,
        default:8008
      },
      seatPassWord:{
        type:String,
        default:'123456'
      },
      iccSerVicePath:{
        type:String,
        default:'ws://icc.maixintech.com:55061/'
      },
      ThreeTel:{
        type: Array,
        default (){return ['110', '120', '119', '4006601330']}
      },
      items:{
        type: Array,
        default(){return ['checkIn', 'checkOut', 'txtTel', 'callTel', 'dropTel', 'threeCall', 'threeMeet', 'dialBack',
        'threeTalk', 'killTalk', 'transIvr', 'transSeatno', 'transExt','freeCall', 'keepCall', 'keepQuiet']}
      }
    },
    methods:{
      init(){
        const that = this
        IccPhone.create('div[id="Icctel"]', {
        // cssPath: '../../../external/IccTel/Base/blackflat/',//对应的文件目录
          seatNo: that.seatNo,//工号
          seatExt: that.seatExt,//分机号
          seatPassWord: that.seatPassWord,//密码
          iccSerVicePath: that.iccSerVicePath,//服务地址
          isCallinAlert: true,//呼入是否弹屏
          CallinFn: this.test,//呼入弹频的方法(由对接方提供如上【test】参数tel)
          isCalloutAlert: true,//呼出是否弹屏
          CalloutFn: this.test,//同呼入弹屏方法一样
          ThreeTel: that.ThreeTel,
          items: that.items//电话条组件(可自己根据权限或是顺序进行相对应的调整)
        })
       },
       test (tel, callId) {
         alert("来电号码：" + tel + "|通话记录ID：" + callId);
       }

    }
  }
</script>

<style scoped>
  #txtwsUri, #txtseatno, #txtpassowrd, #txtwsDoc, #txtseatext {
    position: relative;
    border: 1px solid #95B8E7;
    background-color: #fff;
    vertical-align: middle;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    margin: 0;
    padding: 4px;
    -moz-border-radius: 5px 5px 5px 5px;
    -webkit-border-radius: 5px 5px 5px 5px;
    border-radius: 5px 5px 5px 5px;
  }

  #btnInit, #btnSend {
    width: 110px;
    border: 1px solid #95B8E7;
    line-height: 21px;
    border-radius: 5px;
    color: #444;
    background: linear-gradient(to bottom,#ffffff 0,#eeeeee 100%);
    cursor: pointer;
  }
  .icctel-container{

    position: fixed
  }
</style>
