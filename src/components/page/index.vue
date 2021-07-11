<template>
  <div id="commonTable">
    <el-table :data="tableData" :max-height="maxHeight" border stripe tooltip-effect="light"  @select='mySelect'
              @selection-change="handleSelectionChange"    >
      <slot name="table_oper"/>


      <template v-for="(item, index) in columns">
<!--        <el-table-column-->
<!--          v-show="item.show != false"-->
<!--          :key="index"-->
<!--          :prop="item.prop"-->
<!--          :label="item.label"-->
<!--          :align="item.align?item.align:'center'"-->
<!--          :width="item.width"-->
<!--          :formatter="item.formatter?item.formatter : formatterValue"-->
<!--        >-->
<!--        </el-table-column>-->


        <template v-if="item.prop == 'options'">
          <template v-if="options.length">
            <el-table-column :label="item.label" :width="item.width" :fixed="item.fixed" :align="item.align?item.align:'center'" >
              <template slot-scope="scope">
                <template v-for="btn in options">
                  <el-button
                    :type="btn.type"
                    :size="btn.size"
                    v-if="btn.isShow ? btn.isShow(scope.row) : true"
                    @click="btn.event(scope.row)"
                  >{{btn.label}}</el-button>
                </template>
              </template>
            </el-table-column>
          </template>
        </template>

        <template v-else-if="item.prop == 'selection'">

          <el-table-column
            :fixed="item.fixed"
            :align="item.align?item.align:'center'"
            type="selection"

            width="55">
          </el-table-column>
          </template>

        <template v-else>
<!--          <template v-if="item.isImg">-->
<!--            <el-table-column :prop="item.prop" :label="item.label" :width="item.width">-->
<!--              <template slot-scope="scope">-->
<!--                <el-popover placement="left" trigger="click">-->
<!--                  <div>-->
<!--                    <el-image-->
<!--                      style="width: 300px; height: auto;"-->
<!--                      :src="scope.row[item.prop]"-->
<!--                      fit="contain"-->
<!--                      slot="reference"-->
<!--                    ></el-image>-->
<!--                  </div>-->
<!--                  <el-image-->
<!--                    style="width: 100px;height: 100px;"-->
<!--                    :src="scope.row[item.prop]"-->
<!--                    fit="contain"-->
<!--                    slot="reference"-->
<!--                  ></el-image>-->
<!--                </el-popover>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--          </template>-->
          <el-table-column
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :fixed="item.fixed"
            :formatter="item.formatter?item.formatter:null"
            :show-overflow-tooltip="item.tooltip?item.tooltip:false"
            :sortable="item.sortable?item.sortable:false"
            :align="item.align?item.align:'center'"
          ></el-table-column>
        </template>
<!--        <el-table-column-->
<!--            v-show="item.show != false"-->
<!--            v-else= "item.type != 'btn'"-->
<!--            :key="index"-->
<!--            :prop="item.prop"-->
<!--            :label="item.label"-->
<!--            :align="item.align?item.align:'center'"-->
<!--            :width="item.width"-->
<!--            :formatter="item.formatter?item.formatter : formatterValue"-->
<!--          >-->
<!--          <el-button-->
<!--            v-for="(btn,index) in item.btns"-->
<!--            type="btn.type" size="btn.size"    @click="btn.handle(scope.row)">{{btn.name}}</el-button>-->

<!--        </el-table-column>-->
      </template>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      style="text-align: center;margin:20px 0;"
      :current-page="pageNo"
      :page-size="tableSize"
      :page-sizes="tablePageList"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
  import axios from '../../service/interceptor'
  import Qs from 'qs'
  import { getToken,removeToken } from '@/utils/auth' // get token from cookie

  export default {
    name: 'commonTable',
    data(){

      return {
        tableData:[],
        total:0,
        pageNo:1,
        selectionArray:[],
        tableSize:0,
        tablePageList:[]
      }
    },
    props: {
      columns: Array, // #表头
      data: Array, //数据
      pageSize:{
        type:Number,
        default:10
      }, //分页大小
      options:Array, //按钮
      pageList:{
        type: Array,
        default(){return [10,20,30,50]}
      }, //每页大小
      maxHeight: {
        type: Number,
        default: 2000
      },
      requestUrl: {
        type: String,
        require: true
      }, //请求地址
      params: Object, //请求参数
      requestType: {
        type: String,
        default: 'GET'
      },
      isSelection:{
        type:Boolean,
        default:false
      }
    },
    mounted() {
      this.tableSize = this.pageSize
      this.tablePageList = this.pageList

      this.initTable()

    },
    methods: {
      mySelect(val){
        this.selectionArray = val
        this.$emit('selectionChange', val);
      },
      handleSelectionChange(val) {

        // this.initTable()
        this.selectionArray = val
        this.$emit('handleSelectionChange', val);
       },
      handleSizeChange(val) {
        this.tableSize =val
        this.initTable()
        this.$emit('handleSizeChange', val);
      },
      handleCurrentChange(val) {
        this.pageNo =val

        this.initTable()
        this.$emit('handleCurrentChange', val);
      },
      formatterValue(row, column, cellValue) {
        return cellValue;
      },
      refreshTable(){
        this.currentPage = 1
        this.initTable()
      },
      initTable(){
        if (this.requestType.toUpperCase() === 'GET') {
          this.sendGet()
        } else {
          this.sendPost()
        }
      },
      sendGet() {
        const that = this
        let promise
          // 2.2 拼接字符串
          let paramsStr = ''
          let requsetUrl = that.requestUrl
          // 2.3 遍历
        that.params.pageSize = that.tableSize
        that.params.currentPage = that.pageNo
        if(that.params){
          Object.keys(that.params).forEach(key => {
            paramsStr += key + '=' + that.params[key] + '&'
          })
          // 2.4 过滤最后的&
          /*
            注意：为了防止请求缓存，在尾部加了时间戳
          */
          if (paramsStr) {
            paramsStr = paramsStr.substr(0, paramsStr.lastIndexOf('&'))
            // 2.5 拼接完整路径
            if (that.requestUrl.indexOf('127.0.0.1') === -1) {
              requsetUrl += '?' + paramsStr // + '&Geek-James=' + randomCode(20);
            } else {
              requsetUrl += '?' + paramsStr
            }
          } else {
            if (that.requestUrl.indexOf('127.0.0.1') === -1) {
              // url += '?Geek-James=' + randomCode(20)
            }
          }
        }
          console.log(requsetUrl)
          // 2.6 发起get请求
          promise = axios.get(requsetUrl,{
            headers: {
           //   'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
              'pageNum': that.pageNo,
              'pageSize': that.tableSize,
              'isPage': 1,
              'token': getToken()
            }

          })

          promise.then(function(reponse){
            console.log(reponse)
            that.tableData = reponse.data.list || []
            that.total = Number(reponse.data.count) || that.tableData.length
          }).catch(function(error){
            console.log(error)

          })

      },
      sendPost() {
        let promise
        const that = this
        console.log(that.requestUrl)

        promise = axios.post(that.requestUrl, Qs.stringify(that.params), {
          headers: {
            //'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            'pageNum': that.pageNo,
            'pageSize': that.tableSize,
            'isPage': 1,
            'xftmtoken': getToken()
          }
        })
        promise.then(function(reponse){
          console.log(reponse)
          that.tableData = reponse.data || []
          that.total = Number(reponse.total) || that.tableData.length
        }).catch(function(error){
          console.log(error)

        })
      },
      getselectionArray(){
        return this.selectionArray
      }
    }
  }
</script>
