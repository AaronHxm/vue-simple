<template>
  <div>
    <el-cascader
      ref="cascader"
      v-model="thisValue"
      :options="options"
      :props="props"
      clearable
      filterable
      :size="size"
      :show-all-levels="showAllLevels"
      style="width: 100%"
      @change="checkedChange"
    />
  </div>

</template>

<script>
  import {reconstruction} from '@/utils/utils'
  import { queryProvincialData } from '@/api/components/components'
  export default {
    name: 'Provincial',
    props: {


      // 默认选中的值
      selemodel: Array,
      // 实际的值
      value: {
        type: String,
        default: 'areaCode'
      },
      // 显示的值
      label: {
        type: String,
        default: 'areaDesc'
      },
      // 子选项
      children: {
        type: String,
        default: 'children'
      },
      // 次级菜单的触发方式
      expandTrigger: {
        type: String,
        default: 'click'
      },
      // 是否多选
      multiple: {
        type: Boolean,
        default: false
      },
      // 是否严格的遵守父子节点不互相关联
      checkStrictly: {
        type: Boolean,
        default: false
      },
      // 尺寸
      size: {
        type: String,
        default: 'small'
      },
      // 是否支持清空
      clearable: {
        type: Boolean,
        default: true
      },
      showAllLevels: {
        type: Boolean,
        default: true
      },
      //  在选中节点时  true 返回的是各级菜单的值得组成的数组   false 只返回当前节点
      emitPath: {
        type: Boolean,
        default: true
      },
      level:{
        type: Number,
        default:3
      }

    },
    data() {
      return {
        props: {
          value: this.value,
          label: this.label,
          children: this.children,
          expandTrigger: this.expandTrigger,
          multiple: this.multiple,
          checkStrictly: this.checkStrictly,
          clearable: this.clearable,
          emitPath: this.emitPath
        },
        options: [],
        thisValue: this.selemodel,
        selectedPublicValue: [],
        selectedObject: [],
        selectedPrivateValue: []

      }
    },
    mounted() {
      this.querySelect()
    },
    methods: {
      getCount() {
        let optionsChildren = this.options[1]
        let count = 1
        for (count; 1 < 100; count++) {
          if (optionsChildren.children) {
            return count
          } else {
            optionsChildren = optionsChildren.children
          }
        }
      },
      checkedChange(val) {
        this.selectedPrivateValue = []
        this.selectedPublicValue = []
        this.selectedObject = []
        // eslint-disable-next-line no-unused-vars
        const MaxArr = this.$refs.cascader.getCheckedNodes()
        for (let j = 0, J = MaxArr.length; j < J; j++) {
          const arr = MaxArr[j].pathNodes
          const testArr = []
          const valueArr = []
          const objectArr = []
          for (let i = 0, I = arr.length; i < I; i++) {
            const object = {
              'value': arr[i].value,
              'label': arr[i].label
            }
            testArr.push(arr[i].label)
            valueArr.push(arr[i].value)
            objectArr.push(object)
          }
          this.selectedObject.push(objectArr)
          this.selectedPrivateValue.push(testArr)
          this.selectedPublicValue.push(valueArr)

        }
        console.log('his',this)
        this.$emit('check', val)
      },
      getSelectedPublicValue() {
        return this.selectedPublicValue
      },
      getSelectedPrivateValue() {

        return this.selectedPrivateValue
      },
      getSelectedObject() {

        return this.selectedObject
      },
      querySelect() {
        const than = this
        let level = ''
        if(this.level === 1){
          level = 'PROVINCE'
        }
        if(this.level === 2){
          level = 'PROVINCE,CITY'
        }
        if(this.level === 3){
          level = 'PROVINCE,CITY,AREA'

        }
        const promise = queryProvincialData({'level':level})
        promise.then(function (reponse) {
          const arr = reconstruction(reponse.data, 'areaCode', 'preCode', 'children')
          const objList = arr
          for (let i = 0; i < objList.length; i++) {
            than.options.push(objList[i])
          }
          console.log(than.thisValue)

          than.setDefauleValue(than.thisValue)
        }).catch(function (error) {
          console.log(error)
        })
      },
      setDefauleValue(array){
        this.thisValue = array
        this.selectedPublicValue = [array]
      }




    }
  }
</script>

<style scoped>

</style>
