<template>
  <div class="app-container" style="margin-top: 30px">
    <el-card style="margin-bottom:15px ">
      <el-form :model="selctCondition" ref="selctCondition" class="demo-ruleForm">
        <el-col :span="4">
          <el-form-item label="" prop="acct">
            <el-input
              placeholder="请输入用户账号"
              clearable
              size="mini"
              style="width: 90%"
              v-model="selctCondition.acct"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="" prop="name">
            <el-input
              placeholder="请输入用户名称"
              style="width: 90%"
              clearable
              size="mini"
              v-model="selctCondition.name">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="" prop="mobilePhone">
            <el-input
              placeholder="请输入手机号码"
              clearable
              size="mini"
              onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
              maxlength="11"
              style="width: 90%"
              v-model="selctCondition.mobilePhone">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="" prop="">
            <el-button type="primary" size="mini" icon="el-icon-search" @click="selectTiaojian">搜索
            </el-button>

          </el-form-item>
        </el-col>
      </el-form>
    </el-card>
    <el-card>
      <el-button type="primary" size="mini" icon="el-icon-circle-plus" @click="openEdit">添加用户</el-button>
      <commonTable ref="commonTable"
                   :columns="columns"
                   :requestUrl="url"
                   :rquestType="rquestType"
                   :options="options"
                   :params="selctCondition" style="margin-top: 15px">

      </commonTable>
    </el-card>


    <!--以下是模态框-->
    <el-dialog :title="textMap[dialogStatus]"
               :visible.sync="dialogFormVisible"
               :show-close="false"
               :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px"
               v-if="dialogFormVisible"
               style="width: 500px; margin-left:50px;">
        <el-form-item label="账号" prop="Acct">
          <el-input v-model="temp.Acct"/>
        </el-form-item>
        <el-form-item label="密码" prop="Pwd" v-if="show">
          <el-input v-model="temp.Pwd"/>
        </el-form-item>
        <el-form-item label="用户名" prop="Name">
          <el-input v-model="temp.Name"/>
        </el-form-item>

        <el-form-item label="预留手机号" prop="mobilePhone">
          <el-input v-model="temp.mobilePhone"
                    onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
                    maxlength="11"
          />
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="temp.realName"/>
        </el-form-item>
        <el-form-item label="预留邮箱" prop="mailAddr">
          <el-input v-model="temp.mailAddr"/>
        </el-form-item>

        <el-form-item prop="userId">
          <el-input v-model="temp.userId" style="display: none"/>
        </el-form-item>


        <el-form-item prop="orgId" label="上级机构">
          <el-input v-model="checkedName" style="width:290px" readonly/>
          <el-button type="primary" @click="fatherMT()">
            选择机构
          </el-button>

        </el-form-item>

        <el-form-item prop="userId">
          <el-input v-model="temp.orgId" style="display: none"/>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="usersave()">
          确认
        </el-button>
      </div>
    </el-dialog>
    <!--树形机构-->

    <el-dialog :visible.sync="dialogTab">
      <el-tree :data="menuMTKFather"
               show-checkbox ref="tree"
               :props="defaultProps"
               :node-key="id"
               :check-strictly="true"
               @check-change="getChecked"
      >

      </el-tree>

      <div slot="footer" class="dialog-footer">
        <!--        <el-button @click="dialogTab = false">-->
        <el-button @click="closedialogTab">
          取消
        </el-button>
        <el-button type="primary" @click="handleNodeClick">
          提交
        </el-button>
      </div>
    </el-dialog>

    <!--树形机构-->
  </div>
</template>

<script>
  import { selMenuVo } from '@/api/sys/org/org'
  import { reconstruction } from '@/utils/utils'
  import { getList } from '@/api/sys/user/user'
  import { userInsert } from '@/api/sys/user/user'
  import { selectUserById } from '@/api/sys/user/user'
  import { userupdate } from '@/api/sys/user/user'
  import { userupflag } from '@/api/sys/user/user'
  import commonTable from '../../../components/page/index'
  import { isAcct, isPwd,isMobile } from '@/utils/validate'

  export default {

    data() {
      //校验邮箱
      let ckMail = (rule, value, callback) => {
        let regExp = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        if (regExp.test(value) === false) {
          callback(new Error('不通过正则'))
        } else {
          callback()
        }
      }//校验空格
      let ckNul = (rule, value, callback) => {
        let regExp = /^[^\s]*$/
        if (regExp.test(value) === false) {
          callback(new Error('不通过正则'))
        } else {
          callback()
        }
      }
      //校验姓名
      let ckName = (rule, value, callback) => {
        let regExp = /^[\u4E00-\u9FA5A-Za-z]{2,10}$/
        if (regExp.test(value) === false) {
          callback(new Error('不通过正则'))
        } else {
          callback()
        }
      }

      let ckPhone = (rule, value, callback) => {
        let regExp = /^1(3|4|5|6|7|8|9)\d{9}$/
        if (regExp.test(value) === false) {
          callback(new Error('不通过正则'))
        } else {
          callback()
        }

      }
      const validateAcct = (rule, value, callback) => {
        console.log(value,'这是账户')
        const acct = this.isAcctMethod(value)
        if (acct != true) {
          callback(acct)
        }
      }
      const pwdValidate = (rule, value, callback) => {
        console.log(value,'这是密码')
        const pwd = this.isPwdMethod(value)
        if (pwd != true) {
          callback(pwd)
        }
      }
      const validatePhoneNum = (rule, value, callback) => {
        console.log(value, '这是联系人2的手机号')
        const isMobile = this.isMobileMethod(value)
        if (isMobile != true) {
          callback(isMobile)
        }
      }
      return {
        selctCondition: { //条件查询
          acct: '',
          name: '',
          mobilePhone: ''
        },
        show: true, //隐藏密码的input
        checkedName: '',//树形菜单实有的值
        checkedId: '',   //树形菜单名称
        menuMTKFather: [],//树形数据的存值
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        readonly: true,
        id: 'id',
        list: null,
        listLoading: true,
        dialogStatus: '',
        dialogFormVisible: false,
        dialogTab: false,
        textMap: {
          update: 'EDIT',
          create: 'CREATE'
        },
        ufalg: '',  //添加修改标记
        /*
       以下是模态框中的数据
       */
        temp: {
          Acct: '',
          Pwd: '',
          Name: '',
          orgId: '',
          mobilePhone: '',
          realName: '',
          mailAddr: '',
          useFlag: ''
        },

        columns: [
          {
            prop: 'options',
            label: '操作',
            width: '150',
            fixed: 'right'
          },
          { prop: 'acct', label: '账号', align: 'center' },
          { prop: 'name', label: '用户名', align: 'center' },
          { prop: 'org.orgName', label: '机构名称', align: 'center' },
          { prop: 'mobilePhone', label: '预留手机号', align: 'center' },
          { prop: 'realName', label: '真实姓名', align: 'center' },
          { prop: 'mailAddr', label: '预留邮箱', align: 'center' },
          {
            prop: 'useFlag', label: '状态', align: 'center', formatter: this.formatter
          }
        ],

        options: [
          {
            type: 'primary',
            label: '修改',
            size: 'mini',
            event: this.openUpdate,
            isShow: item => {
              return item.status == 0 ? false : true
            }
          },
          {
            size: 'mini',
            label: '启用',
            event: this.openFlag,
            isShow: item => {
              return item.useFlag == 0 ? true : false
            }
          },
          {
            type: 'danger',
            size: 'mini',
            label: '禁用',
            event: this.openFlag,
            isShow: item => {
              return item.useFlag == 0 ? false : true
            }
          }
        ],
        rquestType: 'post',
        url: '/view/user/userlist',

        rules: { //验证

          // Acct: [
          //   { required: true, message: '请输入账号', trigger: 'blur' },
          //   { min: 6, max: 20, message: '长度在 6到 20个字符', trigger: 'blur' },
          //   { validator: validateAcct,  trigger: 'blur' }
          // ],
          // Pwd: [
          //   { required: true, message: '请输入密码', trigger: 'blur' },
          //   { validator: pwdValidate,  trigger: 'blur' }
          // ],
          Name: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 2, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' },
            { validator: ckNul, message: '不能输入空格', trigger: 'blur' }
          ],
          // mobilePhone: [
          //   { required: true, message: '请输入预留手机号', trigger: 'blur' },
          //   { validator: validatePhoneNum,  trigger: 'blur' },
          // ],
          realName: [
            { required: true, message: '请输入真实姓名', trigger: 'blur' },
            { validator: ckName, message: '长度在 2 到 10 个中文、英文字符', trigger: 'blur' },
            { validator: ckNul, message: '不能输入空格', trigger: 'blur' }

          ],
          mailAddr: [
            { required: true, message: '请输入预留邮箱', trigger: 'blur' },
            { validator: ckMail, message: '请输入正确的邮箱格式', trigger: 'blur' },
            { validator: ckNul, message: '不能输入空格', trigger: 'blur' }
          ]

        },
        chongfu: 'chongfu'  //后台是否重复标识

      }
    },
    components: { commonTable },

    methods: {
      /**
       *
       *手机号验证
       */
      isMobileMethod(value) {
        return isMobile(value)
      },
      /**
       *账户验证
       */
      isAcctMethod(value) {
        return isAcct(value)
      },
      /**
       *
       *密码验证
       */
      isPwdMethod(value) {
        return isPwd(value)
      },

      closedialogTab() {
        this.dialogTab = false
        this.$refs.commonTable.refreshTable()
      },
      formatter(val) {

        if (val.useFlag == 1) {
          return '启用'
        } else {
          return '禁用'
        }
      },
      openFlag(row) {  //状态的更改
        const byId = userupflag({ userId: row.userId, useFlag: row.useFlag })
        const that = this
        byId.then((response) => {
          if (response.code === 200 || response.code === '200') {
            const { data } = response
            this.$message.success('操作成功')
            that.$refs.commonTable.refreshTable()
          }
        }).catch(error => {
          console.log(error)

        })
      },
      openEdit(row) {
        // this.temp = Object.assign({}, row) // copy obj
        // this.temp.timestamp = new Date(this.temp.timestamp)
        this.ufalg = 'CREATE'
        this.dialogFormVisible = true
        this.temp = {}
        this.show = true

      },
      usersave() {
          console.log(this)//添加修改提交后台
        this.$refs.dataForm.validate((valid) => {
            console.log("11")
          if (valid) {
            let usersave
            const that = this
            if (that.ufalg == 'CREATE') {
              usersave = userInsert(this.temp)

            }
            if (that.ufalg == 'EAIT') {
              usersave = userupdate(this.temp)

            }
            usersave.then((response) => {
              if (response.code === 200 || response.code === '200') {

                const { data } = response

                if (data == this.chongfu) {
                  this.$message.error('名称重复')
                  this.temp.Acct = ''
                } else {
                  this.$message.success('操作成功')
                  that.dialogFormVisible = false
                  that.$refs.commonTable.refreshTable()
                }

              }
            }).catch(error => {
              console.log(error)
            })

          } else {
            return false
          }
        })
      },
      openUpdate(row) {
        const that = this
        that.show = false
        const byId = selectUserById({ userId: row.userId })
        this.ufalg = 'EAIT'
        byId.then((response) => {
          if (response.code === 200 || response.code === '200') {
            const { data } = response
            this.dialogFormVisible = true
            this.temp.userId = data.userId
            this.temp.Acct = data.acct
            this.temp.Name = data.name
            this.temp.mailAddr = data.mailAddr
            this.temp.mobilePhone = data.mobilePhone
            this.temp.realName = data.realName
            // this.temp.orgId= data.orgId;
          }
        }).catch(error => {
          console.log(error)

        })

      },
      fatherMT() {    //回显树形数据
        const uporg = selMenuVo()

        this.dialogTab = true
        const that = this
        uporg.then(response => {

          that.menuMTKFather = reconstruction(response.data, 'id', 'pId', 'children')
          that.menuMTKFather.disabled = false
        })

      },
      handleNodeClick() {  //选中数据

        const names = this.$refs.tree.getCheckedNodes()

        this.checkedName = names[0].label

        this.dialogTab = false

      },
      getChecked(data, checked, node) {  //树形单选

        if (checked === true) {
          this.temp.orgId = data.id
          this.$refs.tree.setCheckedKeys([data.id])
        } else {
          if (this.checkedId == data.id) {
            this.$refs.tree.setCheckedKeys([data.id])
          }
        }

      },
      clearForm() {  //清空输入框的内容
        this.$refs.selctCondition.resetFields()  //清空输入框
        this.$refs.commonTable.refreshTable()//刷新表格
      },
      selectTiaojian() {  //根据条件查询
        this.$refs.commonTable.refreshTable()//刷新表格

      }
    }
  }
</script>

<style scoped>

</style>
