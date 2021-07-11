<template>
  <el-select
    v-model="selectValue"
    filterable
    clearable
    :placeholder="placeholder"
    :multiple="multiple"
    class="el-field-input"
    @change="selectSelectValue"
    :disabled="disabled"
    :size="size"
  >
    <el-option
      v-for="item in selectData"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script>
import axios from '../../service/interceptor'
import { getToken,removeToken } from '@/utils/auth' // get token from cookie
import Qs from 'qs'
export default {
  name: 'XftmSelect',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'small'
    },
    // input值
    placeholder: {
      type: String,
      default: '请选择'
    },
    // 显示值得key
    label: {
      type: String,
      default: 'name'
    },
    // 实际值的key
    value: {
      type: String,
      default: 'code'
    },
    // 请求路径
    requrl: {
      type: String,
      default: '/datadic/getAllDicType'
    },
    // 请求类型
    reqtype: {
      type: String,
      default: 'GET'
    },
    // 参数
    params: {
      type: String || Object,
      default: ''
    },
    // 默认的常量类型
    group: {
      type: String
    },
    // 是否需要自定义选项
    isDefault: {
      type: Number,
      default: 0 // 0 无 1 有 默认 0 是否有默认选项
    },
    // 自定义选项的lable
    defaultLable: {
      type: String,
      default: '请选择'
    },
    // 自定义选项的value
    defaultValue: {
      type: Number,
      default: -1
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 默认选中的值
    selelectValue: {
      type: Array,
      default() {
        return []
      }
    }


  },
  data: function() {
    return {
      selectValueString: '',
      selectData: Array, // 下拉框数据
      selectValue: Array, // 当前被选中的值
      selectObject: []
    }
  },
  computed: {
    // selectVal: {
    //   get() {
    //     return [...this.value]
    //   },
    //   set(val) {
    //     this.$emit('input', [...val])
    //   }
    // }
  },
  mounted() {
     this.querySelect()
     this.selectValue = this.selelectValue
  },
  methods: {
    selectSelectValue(val) {
      console.log(val)
     console.log( this.selectValue)
      this.selectValue = val
      this.selectObject = []
      if (this.multiple) {

        this.selectValueString = ''

        for (let i = 0, I = this.selectValue.length; i < I; i++) { //  选中的
          for (let j = 0, J = this.selectData.length; j < J; j++) { // 所有
            if (this.selectData[j].value === this.selectValue[i]) {
              this.selectValueString = this.selectValueString + this.selectValue[i] + ','
              this.selectObject.push(this.selectData[j])
            }

            // if(this.selectData[i]){
            //    this.selectObject.push(this.selectData[i])
            // }
          }
        }
      } else {

        this.selectValueString = val
          for (let j = 0, J = this.selectData.length; j < J; j++) { // 所有
              if (this.selectData[j].value === val) {
                  const aa = this.label
                  this.selectValueString = this.selectData[j].label
                  this.selectObject.push(this.selectData[j])
              }

              // if(this.selectData[i]){
              //     this.selectObject.push(this.selectData[i])
              // }
          }

      }
    },
    getSelectValueString() {
      return this.selectValueString
    },
    getSelectValue() {
      return this.selectValue
    },
    getSelectObject() {
      return this.selectObject
    },
    setSelelectValue(val) {

        this.selectValue = val


    },
    querySelect() {
      const that = this
      let promise
      let params
      if (!this.params) {
        params = {
          'typeCode': that.group
        }
      }
      if (that.reqtype.toUpperCase() === 'GET') {
        that.sendGet()
      } else if (that.reqtype.toUpperCase() === 'POST') {
        that.sendPost()
      }
      // if(this.selectValue ){
      //   console.log('this.selectValue',this.selectValue)
      //   this.setSelelectValue(this.selectValue)
      // }

    },
    sendGet() {
      const that = this
      let promise
      // 2.2 拼接字符串
      let paramsStr = ''
      let requsetUrl = that.requrl
      // 2.3 遍历
      console.log(that.params)
      if (this.requrl === '/datadic/getAllDicType') {
        paramsStr += 'typeCode' + '=' + that.params
      } else {
        Object.keys(that.params).forEach(key => {
          paramsStr += key + '=' + that.params[key] + '&'
        })
        paramsStr = paramsStr.substr(0, paramsStr.lastIndexOf('&'))

      }
      /*
                注意：为了防止请求缓存，在尾部加了时间戳
              */
      if (paramsStr) {
        // 2.5 拼接完整路径
        if (that.requrl.indexOf('127.0.0.1') === -1) {
          requsetUrl += '?' + paramsStr // + '&Geek-James=' + randomCode(20);
        } else {
          requsetUrl += '?' + paramsStr
        }
      } else {
        if (that.requrl.indexOf('127.0.0.1') === -1) {
          // url += '?Geek-James=' + randomCode(20)
        }
      }

      // 2.6 发起get请求
      promise = axios.get(requsetUrl, {
        headers: {

          'xftmtoken': getToken()
        }

      })
      const myData = []
      promise.then(function(reponse) {

        if (Number(that.isDefault) !== 0) {
          myData.push({
            'label': that.defaultLable,
            'value': that.defaultValue
          })
        }
        const objList = reponse.data
        for (let i = 0; i < objList.length; i++) {
          myData.push({
            'label': objList[i][that.label],
            'value': objList[i][that.value]
          })
        }
        that.selectData = myData
       }).catch(function(error) {
        console.log(error)
      })
    },
    sendPost() {
      let promise
      const that = this
      console.log(that.url)

      promise = axios.post(that.url, Qs.stringify(params), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
          'xftmtoken': getToken()
        }
      })
      promise.then(function(reponse) {

        that.tableData = reponse.data || []
        that.total = Number(reponse.total) || that.tableData.length
      }).catch(function(error) {
        console.log(error)
      })
    }
  }
}
</script>

<style scoped>
  .drag-select >>> .sortable-ghost {
    opacity: .8;
    color: #fff!important;
    background: #42b983!important;
  }

  .drag-select >>> .el-tag {
    cursor: pointer;
  }
</style>
