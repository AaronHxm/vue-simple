<template>
  <div class="app-container" style="margin-top: 30px">
    <el-card style="margin-bottom:15px ">
      <el-form label-position="left" :model="sysParamDto"
               label-width=""
               style="width: 100%;">
        <el-col :span="4">
          <el-form-item label="" prop="paramName">
            <el-input
              v-model="sysParamDto.paramName"
              placeholder="请输入名称"
              size="mini"
              clearable
              style="width:90%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="" prop="paramDesc">
            <el-input
              v-model="sysParamDto.paramDesc"
              placeholder="请输入说明"
              size="mini"
              clearable
              style="width:90%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="" prop="paramCode">
            <el-input
              v-model="sysParamDto.aramCode"
              placeholder="请输入参数值"
              style="width:90% ;"
              clearable
              size="mini"
            />
          </el-form-item>

        </el-col>
        <el-col :span="4" align="left">
          <el-form-item label="" prop="">
            <el-button type="primary" size="mini" @click="selectSysParam()">查询</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-card>
    <el-card>
      <el-button type="primary" icon="el-icon-circle-plus" size="mini" @click="openAdd">添加常量</el-button>
      <common-table
        ref="commonTable"
        :options="Options"
        :columns="columns"
        :request-url="url"
        :rquest-type="rquestType"
        :params="sysParamDto"
        style="margin-top: 15px"
      />
    </el-card>
    <el-dialog
      :title="dialogtype"
      :visible.sync="dialogAddSysParam"
      width="30%"
    >
      <el-form ref="dicItemRuleForm" :model="addUpdateSysParamDto" :rules="sysParamRules" label-width="30%"
               class="demo-ruleForm">

        <el-form-item label="参数名称" prop="paramName">
          <el-input v-model="addUpdateSysParamDto.paramName" style="width: 80%;"/>
        </el-form-item>
        <el-form-item label="参数说明" prop="paramDesc">
          <el-input v-model="addUpdateSysParamDto.paramDesc" style="width: 80%;"/>
        </el-form-item>
        <el-form-item label="参数值" prop="paramCode">
          <el-input v-model="addUpdateSysParamDto.paramCode" style="width: 80%;"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddSysParam = false">取 消</el-button>
        <el-button type="primary" @click="addUpdateSysParam()">确 定</el-button>
      </span>
    </el-dialog>
    <!--    筛选框-->
  </div>

</template>

<script>
  import commonTable from '../../../components/page/index'
  import { addUpdateSysParam, updateUseFlagOfJs } from '@/api/sys/sysparam/sysParam'

  export default {

    name: 'SysParam',
    components: { commonTable },
    data() {
      return {
        // 模态框是新增还是修改
        dialogtype: '',
        // 表单校验
        sysParamRules: {
          paramName: [{ required: true, message: '参数名字不能为空', trigger: 'change' }],
          paramDesc: [{ required: true, message: '参数声明不能为空', trigger: 'blur' }],
          paramCode: [{ required: true, message: '参数值不能为空', trigger: 'blur' }]
        },
        // 模态框的开关
        dialogAddSysParam: false,
        // 按钮
        Options: [
          {
            type: 'primary',
            label: '编辑',
            size: 'mini',
            event: this.openDialog

          },
          {
            type: 'primary',
            size: 'mini',
            label: '启用',
            event: this.updateUseFlag,
            isShow: item => {
              return item.useFlag == 0
            }
          },
          {
            type: 'danger',
            size: 'mini',
            label: '禁用',
            event: this.updateUseFlag,
            isShow: item => {
              return item.useFlag !== 0
            }
          }
        ],
        // 添加和修改请求的参数
        addUpdateSysParamDto: {
          id: '',
          paramName: '',
          paramDesc: '',
          paramCode: ''
        },
        // 表格的列数据
        columns: [
          { prop: 'paramName', label: '系统参数名称', align: 'left' },
          { prop: 'paramDesc', label: '系统参数说明', align: 'left' },
          { prop: 'paramCode', label: '系统参数值', align: 'left' },
          { prop: 'useFlag', label: '状态', align: 'center', formatter: this.useFlagFormatter },
          { prop: 'options', label: '操作', width: '200', fixed: 'right', align: 'center' }

        ],
        // 列表的请求路径
        url: '/datadic/getAllParam',
        // 请求类型
        rquestType: 'get',
        // 查询列表的条件
        sysParamDto: {
          paramName: '',
          paramDesc: '',
          paramCode: ''
        }
      }
    },
    methods: {
      /**
       * 表单验证成功后调用的方法
       * @param  promise that
       */
      validateSuccessMethod(promise, that) {
        promise.then(function(reponse) {
          that.$notify({
            message: reponse.message,
            type: 'success',
            duration: 2000
          })
          that.$refs.commonTable.refreshTable()
        }).catch(function(error) {
          that.$notify({
            message: error.message,
            type: 'danger',
            duration: 2000
          })
        })
      },
      /**
       * 更改角色状态
       */
      updateUseFlag(row) {
        const promise = updateUseFlagOfJs({ 'id': row.id, 'useFlag': row.useFlag })
        this.validateSuccessMethod(promise, this)
      },
      /**
       * 格式化状态
       * @param row
       */
      useFlagFormatter(val) {
        if (val.useFlag === 1) {
          return '已启用'
        } else {
          return '未启用'
        }
      },
      // 点击修改调用的方法  先清空模态框
      openAdd() {
        this.dialogtype = '添加常量'
        this.addUpdateSysParamDto.id = ''
        this.addUpdateSysParamDto.paramCode = ''
        this.addUpdateSysParamDto.paramDesc = ''
        this.addUpdateSysParamDto.paramName = ''
        this.dialogAddSysParam = true
      },
      // 模态框的确定按钮触发的方法
      addUpdateSysParam() {
        this.$refs.dicItemRuleForm.validate((valid) => {
          if (valid) {
            this.dialogAddSysParam = false
            const promise = addUpdateSysParam(this.addUpdateSysParamDto)
            this.validateSuccessMethod(promise, this)
          }
        })
      },
      // 点击修改的方法
      openDialog(row) {
        this.dialogtype = '修改常量'
        this.dialogAddSysParam = true
        this.addUpdateSysParamDto.id = row.id
        this.addUpdateSysParamDto.paramCode = row.paramCode
        this.addUpdateSysParamDto.paramDesc = row.paramDesc
        this.addUpdateSysParamDto.paramName = row.paramName
      },
      selectSysParam() {
        this.$refs.commonTable.refreshTable()
      },
      // 重置
      reset() {
        this.sysParamDto.sysParamName = ''
        this.sysParamDto.sysParamDesc = ''
        this.sysParamDto.sysParamCode = ''
      }
    }
  }
</script>

<style scoped>

</style>
