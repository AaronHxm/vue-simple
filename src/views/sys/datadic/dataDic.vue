<template>
  <div class="app-container" style="margin-top: 30px">

    <el-card style="margin-bottom:15px ">
      <el-form ref="roleEditAndAddForm" :rules="rules" :model="dataDicDto" label-position="right"
               label-width=""
               style="width: 100%;">
        <el-col :span="4">
          <el-form-item label="" prop="">
            <xftm-select
              size="mini"
              ref="XftmSelect"
              :params="params"
              label="dicTypeName"
              value="dicTypeCode"
              :multiple="multiple"
              placeholder="请选择字典类型"
              style="width: 90%; height: 28px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="" prop="">
            <el-input
              v-model="dataDicDto.dicItemCode"
              size="mini"
              clearable
              placeholder="请输入代码"
              style="width: 90%;"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="" prop="">
            <el-input
              v-model="dataDicDto.dicItemName"
              size="mini"
              clearable
              placeholder="请输入名称"
              style="width: 90%;"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4" align="left">
          <el-form-item label="" prop="">
            <el-button type="primary" size="mini" @click="selectDicItem()">查询</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-card>
    <el-card>
      <el-button type="primary" icon="el-icon-circle-plus" size="mini" @click="openAddType()">添加字典类型</el-button>
      <el-button type="primary" icon="el-icon-circle-plus" size="mini" @click="openAddItem()">添加字典信息</el-button>
      <common-table
        ref="commonTable"
        :columns="columns"
        :options="options"
        :request-url="url"
        :rquest-type="rquestType"
        :params="dataDicDto"
        style="margin-top: 15px"
      />
    </el-card>


    <div>
      <div align="center" style="margin-top: 20px ;width: 95%;margin-left: auto;margin-right: auto">
        <!--           添加字典类型的模态框-->
        <el-dialog
          title="添加字典类型"
          :visible.sync="dialogAddType"
          width="30%"
        >
          <!--           添加字典类型的from-->

          <el-form ref="dicTypeRuleForm" :model="dicTypeRuleForm" :rules="dicTypeRules" label-width="100px"
                   class="demo-ruleForm">
            <el-form-item label="类型名字" prop="name">
              <el-input v-model="dicTypeRuleForm.name"/>
            </el-form-item>
            <el-form-item label="类型Code" prop="code">
              <el-input v-model="dicTypeRuleForm.code"/>
            </el-form-item>

          </el-form>
          <el-button @click="dialogAddType = false">取 消</el-button>
          <el-button type="primary" @click="addDicType()">确 定</el-button>
        </el-dialog>
        <!--           //添加字典信息的模态框-->
        <el-dialog
          title="添加字典信息"
          :visible.sync="dialogAddItem"
          width="30%"
        >

          <el-form ref="dicItemRuleForm" :model="dicItemRuleForm" :rules="dicItemRules" label-width="100px"
                   class="demo-ruleForm">

            <el-form-item label="字典类型" prop="code">
              <xftm-select
                ref="XftmSelect2"
                :params="params1"
                label="dicTypeName"
                value="dicTypeCode"
                style="width: 80%"
              />
            </el-form-item>
            <el-form-item label="名称" prop="name">
              <el-input v-model="dicItemRuleForm.name"/>
            </el-form-item>
            <el-form-item label="代码" prop="code">
              <el-input v-model="dicItemRuleForm.code"/>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
          <el-button @click="dialogAddItem = false">取 消</el-button>
          <el-button type="primary" @click="addDicItem()">确 定</el-button>
        </span>
        </el-dialog>
      </div>
    </div>
  </div>


</template>

<script>
  import commonTable from '../../../components/page/index'
  import {insertDicItem, insertDicType} from '@/api/sys/datadic/dataDic'
  import XftmSelect from '../../../components/Select/select'

  export default {

    name: 'DataDic',
    components: {XftmSelect, commonTable},

    data() {
      return {

        // 添加类型表单的验证
        qqq: 'MARRYSTATUS',
        dicTypeRules: {
          name: [
            {required: true, message: '请输入类型名称', trigger: 'blur'},
            {min: 3, message: '名称最少3位', trigger: 'change'}
          ],
          code: [
            {required: true, message: '请输入类型代码 ', trigger: 'blur'}
          ]
        },
        params: '',
        params1: '',
        dicItemRules: {},
        // 类型表单绑定的值
        dicTypeRuleForm: {
          name: '',
          code: ''
        },
        // 字典信息表单绑定的值
        dicItemRuleForm: {
          name: '',
          code: ''
        },
        dialogAddItem: false, // 添加字典信息模态框的开关
        dialogAddType: false, // 添加字典类型模态框的开关
        // 下拉框多选
        multiple: true,
        // 下拉框请求的路径
        selectReqUrl: '/getAllDicType',
        // 列表的列信息
        columns: [
          {prop: 'dicTypeName', label: '字典类型', align: 'left'},
          {prop: 'dicItemCode', label: '代码', align: 'left'},
          {prop: 'dicItemName', label: '名称', align: 'left'},
          {prop: 'useFlag', label: '状态', align: 'center', formatter: this.formatter},
          {prop: 'options', label: '操作', width: '300', fixed: 'right', align: 'center'}
        ],
        options: [
          {
            type: 'primary',
            label: '添加字典信息',
            size: 'mini',
            event: this.openUpdataAuthModel,
            isShow: item => {
              return item.status === 0 ? false : true
            }
          },
          {
            type: 'primary',
            size: 'mini',
            label: '启用',
            event: this.updateUseFlag,
            isShow: item => {
              return item.useFlag == 0 ? true : false
            }
          },
          {
            type: 'danger',
            size: 'mini',
            label: '禁用',
            event: this.updateUseFlag,
            isShow: item => {
              return item.useFlag == 0 ? false : true
            }
          }
        ],
        // 列表的请求路径
        url: '/datadic/queryDic',
        // 请求类型
        rquestType: 'get',
        // 添加类型时的参数
        dicTypeData: {
          dicTypeName: '',
          dicTypeCode: ''
        },
        // 添加字典信息时的参数
        dicItemData: {
          dicTypeCode: '',
          dicItemCode: '',
          dicItemName: ''
        },
        // 加载列表的参数
        dataDicDto: {
          dicTypeCode: '',
          dicItemCode: '',
          dicItemName: ''
        }
      }
    }, created() {
      // this.initSelect()
    },
    methods: {
      /**
       * 验证成功之后调用的方法
       * @param promise that
       */
      validateSuccessMethod(promise, that) {
        promise.then(function (reponse) {
          that.authDialogFormVisible = false
          that.$notify({
            message: reponse.message,
            type: 'success',
            duration: 2000
          })
          that.$refs.commonTable.refreshTable()
        }).catch(function (error) {
          that.$notify({
            message: error.message,
            type: 'danger',
            duration: 2000
          })
        })
      },
      /**
       * 更改字典状态
       */
      updateUseFlag(row) {
        //未实现
        const promise = updateUseFlagOfJs({'id': row.authId, 'useFlag': row.useFlag})
        this.validateSuccessMethod(promise, this)
      },
      openAddType() {
        this.dialogAddType = true
        this.dicTypeRuleForm.name = ''
        this.dicTypeRuleForm.code = ''

        this.$nextTick(() => {
          this.$refs.dicTypeRuleForm.clearValidate()
        })
      },
      openAddItem() {
        this.dialogAddItem = true
        this.dicItemRuleForm.code = ''
        this.dicItemRuleForm.name = ''
        this.$nextTick(() => {
          this.$refs.dicItemRuleForm.clearValidate()
        })
      },
      addDicItem() {
        this.dialogAddItem = false
        this.dicItemData.dicTypeCode = this.$refs.XftmSelect2.getSelectValue()
        console.log(this.dicItemData.dicTypeCode)
        this.dicItemData.dicItemCode = this.dicItemRuleForm.code
        this.dicItemData.dicItemName = this.dicItemRuleForm.name
        insertDicItem(this.dicItemData)
      },
      addDicType() {
        this.dialogAddType = false
        this.dicTypeData.dicTypeCode = this.dicTypeRuleForm.code
        this.dicTypeData.dicTypeName = this.dicTypeRuleForm.name
        const promise = insertDicType(this.dicTypeData)
        promise.then(function (reponse) {
          if (reponse.code === 422) {
            this.$message({
              type: 'error',
              message: reponse.message,
              duration: 1000,
              center: true
            })
          }
          if (reponse.code === 200) {
            this.$message({
              type: 'success',
              message: reponse.message,
              duration: 1000,
              center: true
            })
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      formatter(val) {
        if (val.useFlag === 1) {
          return '启用'
        } else {
          return '不启用'
        }
      },
      selectDicItem() {
        const selectValue = this.$refs.XftmSelect.getSelectValueString()
        this.dataDicDto.dicTypeCode = selectValue
        this.$refs.commonTable.refreshTable()
      },
      reset() {
        this.dataDicDto.dicTypeCode = ''
        this.dataDicDto.dicItemName = ''
        this.dataDicDto.dicItemCode = ''
      }
    }
  }
</script>

<style scoped>
  #sele {
    height: 20px;
  }

</style>
