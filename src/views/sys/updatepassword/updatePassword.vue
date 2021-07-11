<template>
  <div class="app-container" style="margin-top: 30px">
    <el-card style="margin-bottom:15px ">
      <el-form :model="selctCondition" ref="selctCondition" class="demo-ruleForm" style="width: 100%">
        <el-col :span="4">
          <el-form-item label="" prop="acct">
            <el-input
              placeholder="请输入用户账号"
              clearable
              v-model="selctCondition.acct"
              size="mini"
              clearable
              style="width: 90%"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="" prop="name">
            <el-input
              placeholder="请输入用户名称"
              clearable
              style="width: 90%"
              size="mini"
              clearable
              v-model="selctCondition.name">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="" prop="">
            <el-button type="primary" size="mini" icon="el-icon-search" @click=" selectTiaojian
          ">搜索
            </el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-card>
    <el-card>
      <commonTable ref="commonTable" :columns="columnsOfUserList" :requestUrl="userListUrl" :rquestType="rquestType"
                   :options="userListOptions" :params="selctCondition">
      </commonTable>
    </el-card>
    <!--以下是模态框-->
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible">

      <el-form ref="editAndAddForm" :rules="rules" :model="editAndAddForm" label-position="left" label-width="100px"
               style="width: 500px; margin-left:50px;">
        <el-form-item label="账户" prop="acct">
          <el-input :disabled="true" v-model="editAndAddForm.acct"/>
        </el-form-item>
        <el-form-item label="用户名" prop="name">
          <el-input :disabled="true" v-model="editAndAddForm.name"/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="editAndAddForm.password" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="确认密码" prop="againpassword">
          <el-input type="password" v-model="editAndAddForm.againpassword" autocomplete="off"/>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="submitPassword('editAndAddForm')">
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>import { updatepasswordOfJs } from '@/api/sys/user/user'
import commonTable from '../../../components/page/index'

export default {
  components: { commonTable },
  data() {
    const validatePassword = (rule, value, callback) => {
      const reg = /(^\s+)|(\s+$)|\s+/g
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (reg.test(value)) {
        callback(new Error('错误：密码不能有空格！'))
      } else if (value.length < 6 || value.length > 16) {
        callback(new Error('密码必须在6到16位之间'))
      } else {
        callback()
      }
    }
    const validateAgainPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.editAndAddForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      selctCondition: { //条件查询
        acct: '',
        name: ''
      },
      columnsOfUserList: [
        { prop: 'acct', label: '账户', align: 'left' },
        { prop: 'name', label: '用户名', align: 'left' },
        { prop: 'options', label: '操作', width: '400', fixed: 'right', align: 'center' }
      ],
      userListOptions: [
        {
          type: 'primary',
          label: '重置密码',
          size: 'mini',
          event: this.openEdit,
          isSelection: true,
          isShow: item => {
            return item.status === 0 ? false : true
          }
        }],
      userListUrl: '/view/user/userlist',
      rquestType: 'get',
      dialogFormVisible: false,
      /*
     以下是模态框中的数据
     */
      editAndAddForm: {
        acct: '',
        name: '',
        password: '',
        againpassword: ''
      },
      rules: {
        password: [{ validator: validatePassword, trigger: 'blur' }],
        againpassword: [{ validator: validateAgainPassword, trigger: 'blur' }]
      }
    }
  },
  methods: {
    selectTiaojian() {  //根据条件查询
      this.$refs.commonTable.refreshTable()//刷新表格

    },
    clearForm() {  //清空输入框的内容
      this.$refs.selctCondition.resetFields()  //清空输入框
      this.$refs.commonTable.refreshTable()//刷新表格
    },
    validateSuccessMethod(promise, that) {
      promise.then(function(reponse) {
        that.dialogFormVisible = false
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
    openEdit(row) {
      this.editAndAddForm = Object.assign({}, row) // copy obj
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['editAndAddForm'].clearValidate()
      })
    },
    submitPassword(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const that = this
          const promise = updatepasswordOfJs(this.editAndAddForm)
          that.validateSuccessMethod(promise, that)
        } else {
          return false
        }
      })
    }

  }
}
</script>

<style scoped>

</style>
