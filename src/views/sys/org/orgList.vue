<template>
  <div class="app-container" style="margin-top: 30px">
    <el-card style="margin-bottom:15px ">
      <el-form :model="selctCondition" ref="selctCondition" class="demo-ruleForm">
        <el-col :span="4">
          <el-form-item label="" prop="acct">
            <el-input
              placeholder="请输入部门名称"
              style="width: 90%"
              clearable
              size="mini"
              v-model="selctCondition.originName"
            >
            </el-input>
          </el-form-item>
        </el-col>


        <el-col :span="4">
          <el-form-item label="" prop="">
            <el-button type="primary" size="mini" icon="el-icon-search"
                       @click="selectTiaojian">搜索
            </el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-card>
    <el-card>
      <el-button type="primary" size="mini" icon="el-icon-circle-plus" @click="openAddOrg">添加机构</el-button>
      <commonTable ref="commonTable"
                   :columns="columns"
                   :requestUrl="url"
                   :rquestType="rquestType"
                   :options="options"
                   :params="selctCondition"
                   style="margin-top: 15px">

      </commonTable>
    </el-card>


    <!--以下是用户模态框-->

    <!---->
    <!--以下是添加机构模态框-->
    <el-dialog :title="textMap[dialogStatus]"
               :close-on-click-modal="false"
               :show-close="false"
               :visible.sync="dialogForm">
      <el-form ref="dataForm"
               v-if="dialogForm"
               :rules="rules" :model="temp" label-position="left" label-width="100px"
               style="width: 500px; margin-left:50px;">
        <el-form-item label="组织名称" prop="orgName">
          <el-input v-model="temp.orgName"/>
        </el-form-item>

        <el-form-item label="组织名称" prop="orgName">
        <el-tree :data="menuMTKFather"
                 show-checkbox ref="tree"
                 :props="defaultProps"
                 :node-key="id"
                 :check-strictly="true"
                 @check-change="getChecked"
        >

        </el-tree>

        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogForm = false">
          取消
        </el-button>
        <el-button type="primary" @click="orgsave()">
          确认添加
        </el-button>
      </div>
    </el-dialog>
    <!--上级机构-->
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
        <el-button @click="dialogTab = false">
          取消
        </el-button>
        <el-button type="primary" @click="handleNodeClick">
          提交
        </el-button>
      </div>
    </el-dialog>
    <!--上级机构-->


  </div>
</template>

<script>
  import { orglist } from '@/api/sys/org/org'
  import { selectUserNull } from '@/api/sys/org/org'
  import { updataUserOrg } from '@/api/sys/org/org'
  import { orginsert } from '@/api/sys/org/org'
  import { selMenuVo } from '@/api/sys/org/org'
  import { reconstruction } from '@/utils/utils'
  import { selectOrgById } from '@/api/sys/org/org'
  import { orgupdate } from '@/api/sys/org/org'
  import { disable } from '@/api/sys/org/org'
  import commonTable from '../../../components/page/index'
  import XftmSelect from '../../../components/Select/select'

  export default {
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'info',
          deleted: 'danger'
        }
        return statusMap[status]
      },
      typeFilter(type) {
        return calendarTypeKeyValue[type]
      }
    },
    data() {


      //校验空格
      let ckNul = (rule, value, callback) => {
        let regExp = /^[^\s]*$/
        if (regExp.test(value) === false) {
          callback(new Error('不通过正则'))
        } else {
          callback()
        }
      }

      return {
        selctCondition: { //条件查询
          originName: ''
        },

        columns: [
          {
            prop: 'options',
            label: '操作',
            width: '250',
            fixed: 'right'
          },

          { prop: 'originName', label: '组织名称', align: 'center', tooltip: true },
         // { prop: 'orgCode', label: '组织代码', align: 'center' },
          { prop: 'fatherId', label: '上级机构ID', align: 'center' },
          { prop: 'fname', label: '上级名称', align: 'center' },
          {
            prop: 'status', label: '状态', align: 'center', formatter: this.formatter
          }
        ],

        options: [
          {
            type: 'primary',
            size: 'mini',
            label: '修改',
            event: this.openEdit,
            isShow: item => {
              return true
            }
          },

          {
            size: 'mini',
            label: '启用',
            event: this.openFlag,
            isShow: item => {
              return item.status == 0 ? true : false
            }
          },
          {
            type: 'danger',
            size: 'mini',
            label: '禁用',
            event: this.openFlag,
            isShow: item => {
              return item.status == 0 ? false : true
            }
          }
        ],
        rquestType: 'post',
        url: '/api/v1//sysOrigins/search',
        checkedName: '',//树形菜单显示名称
        checkedId: '',   //树形菜单真实的值
        menuMTKFather: [],  //树形菜单回显数据
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        id: 'id',  //树形节点的id
        aaa: '',   //后台传入的树形节点的Id
        list: null,
        listLoading: true,
        dialogStatus: '', //模态框的状态
        dialogFormVisible: false,//添加用户
        dialogForm: false,//添加机构
        dialogTab: false, //树形
        tableData: [{   //为机构添加用户

          acct: '',
          name: '',
          mobilePhone: '',
          realName: ''
        }],
        textMap: {
          update: 'EDIT',
          create: 'CREATE'
        },
        editfalg: '',  //添加修改标记
        createfalg: '',//添加修改标记

        /*
       以下是模态框中添加机构的数据
       */
        temp: {
          orgId: '',
          orgName: '',
          orgCode: '',
          orgTypeCode: '',
          useFlag: '',
          fatherId: ''
        }, //验证
        rules: {
          orgName: [
            { required: true, message: '请输入组织名称', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' },
            { validator: ckNul, message: '不能输入空格', trigger: 'blur' }
          ],
          orgCode: [
            { required: true, message: '请输入组织代码', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' },
            { validator: ckNul, message: '不能输入空格', trigger: 'blur' }
          ]
          // orgTypeCode: [
          //     {required: true, message: '请输入组织类型代码', trigger: 'blur'},
          //     {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'},
          //     {validator: ckNul, message: '不能输入空格', trigger: 'blur'}
          // ],
        },
        listOrg: []

      }
    },
    components: { commonTable, XftmSelect },
    created() {
      this.fetchData()
    },
    methods: {
      formatter(val) {
        if (val.useFlag == 0) {
          return '启用'
        } else {
          return '禁用'
        }
      },
      fetchData() {
        this.listLoading = true

        orglist().then(response => {

          this.list = response.data

          this.listLoading = false
        })
      },
      openAdd(row) {
        this.dialogFormVisible = true
        this.aaa = row.orgId

        const that = this

        const userNull = selectUserNull(this.temp)

        userNull.then((response) => {
          if (response.code === 200 || response.code === '200') {
            const { data } = response
            that.tableData = []
            for (let i = 0; i < data.length; i++) {
              that.tableData.push({
                'userId': data[i].userId,
                'acct': data[i].acct,
                'name': data[i].name,
                'mobilePhone': data[i].mobilePhone,
                'realName': data[i].realName
              })
            }
          }
        }).catch(error => {
          console.log(error)

        })

      },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row)

          })
        } else {
          this.$refs.multipleTable.clearSelection()
        }
      },
      handleSelectionChange(val) {
        let v = []
        this.multipleSelection = val
        let va = this.multipleSelection
        for (let i = 0; i < va.length; i++) {
          v.push(va[i].userId)
        }

        this.listOrg.push({
          'oid': this.aaa,
          'uid': v
        })
      },
      butt() {

        if (this.listOrg == null) {

          return false
        }
        const that = this

        const userNull = updataUserOrg({

          'args': JSON.stringify(this.listOrg)
        })

        userNull.then((response) => {
          if (response.code === 200 || response.code === '200') {
            this.$message.success('成功')
          }
        }).catch(error => {
          console.log(error)

        })
        this.dialogFormVisible = false
      },
      openAddOrg() { //添加机构
        this.dialogForm = true
        this.temp = {}
        this.createfalg = 'EDIT'
      },
      openEdit(row) { //修改 根据Id 查询数据

        const byId = selectOrgById({ orgId: row.orgId })
        this.editfalg = 'CREATE'
        byId.then((response) => {
          if (response.code === 200 || response.code === '200') {
            const { data } = response
            this.dialogForm = true

            this.temp.orgId = data.orgId
            this.temp.orgName = data.orgName
            this.temp.orgCode = data.orgCode
            this.temp.orgTypeCode = data.orgTypeCode
            this.temp.orgTypeName = data.orgTypeName
            this.temp.useFlag = data.useFlag
          }
        }).catch(error => {
          console.log(error)

        })

      },
      // fatherMT() {    //回显树形数据
      //   const uporg = selMenuVo()
      //
      //   this.dialogTab = true
      //   const that = this
      //   uporg.then(response => {
      //     that.menuMTKFather = reconstruction(response.data, 'id', 'pId', 'children')
      //     that.menuMTKFather.disabled = false
      //   })
      //
      // },
      handleNodeClick() {  //选中数据

        const names = this.$refs.tree.getCheckedNodes()

        this.checkedName = names[0].label

        this.dialogTab = false

        this.dialogForm = true
      },
      getChecked(data, checked, node) {  //树形单选

        if (checked === true) {
          this.checkedId = data.id
          this.$refs.tree.setCheckedKeys([data.id])
        } else {
          if (this.checkedId == data.id) {
            this.$refs.tree.setCheckedKeys([data.id])
          }
        }
      },
      orgsave() {  //确认添加
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            let usersave

            if (this.createfalg == 'EDIT') {
              this.temp.orgTypeCode = this.$refs.XftmSelect.getSelectValueString()
              usersave = orginsert(this.temp)

            }
            if (this.editfalg == 'CREATE') {
              usersave = orgupdate(this.temp)

            }
            usersave.then((response) => {
              const that = this
              if (response.code === 200 || response.code === '200') {
                const that = this
                const { data } = response

                if (data == that.chongfu) {

                  this.$message.error('用户名称重复')
                  this.temp.orgName = ''

                } else {

                  this.$message.success('成功')
                  this.dialogForm = false
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
      openFlag(row) {  //状态的更改
        const byId = disable({ orgId: row.orgId, status: row.status })
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
