<template>
  <div>
    <div class="stateInfo">
      <input class="stateBt" type="text"  v-model="userName">
      <input class="stateBt" type="button" value="连接"  @click="connect()">
      <input class="stateBt" type="button" value="断开"  @click="close()">
      <select class="stateBt" v-model="selectedItem"  placeholder="请选择对象" @change="changeObj($event)">
        <option  v-for="p in userList" :key="p" >{{p}}</option>
      </select>
    </div>

    <div ref="cont" class="content">
      <div class="pp"  v-for="(a,index) in msgs" :key="index" >
        <div class="p1"  v-if="a.kind==1" >{{a.data}}</div>
        <div class="p2"  v-else-if="a.kind==2">{{a.data}}</div>
      </div>
    </div>

    <div class="put">
      <input   type="text" class="inputa" v-model="info" ><input  class="stateBt" type='button' value="发送" @click="send()">
    </div>
  </div>
</template>

<script>

    export default {
        props:[
            'wz',
            'col'

        ],
        name: "aa",
        data(){
            return {
                msgs:[{data:"我是模拟信息2",kind:1},{data:"我是模拟信息2",kind:1}],
                socket:null,
                info:"hellow",
                userName:"userName",
                selectedItem:"all",
                userList:["all"]
            }


        },

        methods:{
            send:function(){
                if(null!=this.socket&&this.socket.readyState==1){
                    if(this.selectedItem=="all"){
                        this.socket.send("##msgall:"+this.info);
                        this.msgs.push({data:this.info,kind:2});
                        this.$refs.cont.scrollTop = this.$refs.cont.scrollHeight

                    }else{
                        this.socket.send("##msg:"+this.selectedItem+":"+this.info);
                        this.msgs.push({data:this.info,kind:2});
                        this.$refs.cont.scrollTop = this.$refs.cont.scrollHeight


                    }


                }else{
                    this.$notify({
                        title: '请先连接网络',
                        type: 'success',
                        message: '请先连接网络后在发送消息',
                        duration: 3000
                    })
                }
            },
            connect:function(){
                var me=this;
                if(this.userName.length>0){
                    this.socket=new WebSocket("ws://localhost:8080/webSocketDemo/wb?name="+this.userName);

                    this.socket.onmessage=function(e){
                        if(e.data.startsWith("##list:")){
                            var strm=(e.data.substring(8,e.data.length-1)).split(",");
                            console.log(strm);
                            me.userList=["all"].concat(strm);

                        }else if(e.data.startsWith("##msg:")){
                            me.msgs.push({data:e.data,kind:1});
                            me.$refs.cont.scrollTop = me.$refs.cont.scrollHeight

                        }


                    }
                }else{
                    this.$notify({
                        title: '请先输入用户名',
                        type: 'success',
                        message: '请先输入用户名，再连接',
                        duration: 3000
                    })

                }


            },
            close:function(){
                this.socket.close();
            },
            changeObj:function(obj){


            }



        },



        directives:{
            // 注册一个局部的自定义指令 v-focus
            oo:{
                // 指令的定义
                inserted: function (ea) {
                    // 聚焦元素
                    ea.focus();

                    ea.style.background="orange";
                }
            }
        }




    }
</script>

<style>
  *{
    margin: 0;
    padding: 0;
    border: 0;
  }
  .stateInfo{
    width:60%;
    height: auto;
    margin: 0 auto;
    background: peachpuff;
    border-radius: 5px;

  }
  .stateBt{
    width:80px;
    border-radius: 5px;
    background: mintcream;
    color:#008000;
    height:30px;
  }
  .content{
    width:60%;
    height:300px;
    background: papayawhip;
    overflow-y: scroll;
    margin: 0 auto;

  }
  .put{
    width:60%;
    height: auto;
    background: peachpuff;
    border-radius: 5px;
    margin: 0 auto;
  }
  .inputa{
    width:60%;
    height:30px;
    background:mintcream;
    border: 2px solid orange;
    border-radius: 5px;
  }
  .pp{
    width:100%;
    height:21px;

  }
  .p1{
    width:100%;
    height:21px;
    color:deeppink;
    text-align: left;
    font-size:28px;
    font-family: kaiti;
    margin: 10px;

  }
  .p2{
    width:100%;
    height:21px;
    color:green;
    text-align:right;
    font-size:28px;
    font-family: kaiti;

  }

  body{
    background: snow;
  }

</style>
