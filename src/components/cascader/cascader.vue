<template>
  <div>
    <el-cascader
      ref="aaaa"
      v-model="thisValue"
      :options="options"
      :props="props"
      clearable
      filterable
      :size="size"
      :show-all-levels="showAllLevels"
      style="width: 600px"
      @change="checkedChange"
    />
  </div>

</template>

<script>
    import {reconstruction} from '@/utils/utils'
    import { queryData } from '@/api/components/components'
    export default {
        name: 'XftmCascader',
        props: {

            // 请求路径
            url: {
                type: String,
                default: ''
            },
            // 参数
            param: Object,
            reqType: {
                type: String,
                default: 'get'
            },
            //组件字段名
            akey:{
                type: String,
                default: 'key'
            },
            // fId
            parentKey:{
                type: String,
                default: 'parentKey'
            },
            // 子节点的属性名
            childKey:{
                type: String,
                default: 'childKey'
            },
            // 默认选中的值
            selemodel: Array,
            // 实际的值
            value: {
                type: String,
                default: 'id'
            },
            // 显示的值
            label: {
                type: String,
                default: 'name'
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
                console.log(this.$refs.aaaa.getCheckedNodes())
                this.selectedPrivateValue = []
                this.selectedPublicValue = []
                this.selectedObject = []
                // eslint-disable-next-line no-unused-vars
                const MaxArr = this.$refs.aaaa.getCheckedNodes()
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
                const promise = queryData(than.url,than.param,than.reqType)
                promise.then(function (reponse) {
                    const arr = reconstruction(reponse.data, than.akey, than.parentKey, than.childKey)
                    const objList = arr
                    for (let i = 0; i < objList.length; i++) {
                        than.options.push(objList[i])
                    }

                }).catch(function (error) {
                    console.log(error)
                })
            },




        }
    }
</script>

<style scoped>

</style>
