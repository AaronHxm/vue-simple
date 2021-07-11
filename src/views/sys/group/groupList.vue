<template>
  <div class="app-container" style="margin-top: 30px">
    <el-card style="margin-bottom:15px ">
    <el-form>
      <el-col :span="6">
        <el-form-item label="" prop="groupNameInfo">
          <el-input
            v-model="formInfoData.groupNameInfo"
            placeholder="请输入用户组名称"
            size="mini"
            clearable
            style="width:90% "/>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="" prop="">
          <el-button type="primary" @click="selectGroupByName()" size="mini"
                     icon="el-icon-search">查询
          </el-button>
        </el-form-item>
      </el-col>
    </el-form>
  </el-card>

    <el-card style="margin-bottom:15px ">

      <el-button type="primary" @click="toEdit()" size="mini" icon="el-icon-circle-plus">添加用户组</el-button>


      <commonTable :params="formInfoData" ref="commonTable" :columns="columns"
                   :requestUrl="url" :rquestType="rquestType" :options="options"
                   style="margin-top: 15px">

      </commonTable>
    </el-card>

    <el-dialog title="添加用户到用户组" :visible.sync="openAddUserModal">
      <el-form ref="dataForm" :model="formData" label-position="left" label-width="100px">
       <!-- <el-input v-model="namess" type="text" style="width: 70%; padding-left: 10%" placeholder="请输入用户名"></el-input>
        <el-button type="primary" @click="getUserByName()">查询</el-button>-->
        <el-table
          ref="multipleTable"
          :data="userLists"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="getUserAllId">
          <el-table-column
            type="selection"
            width="55"/>
          <el-table-column label="用户名">
            <template slot-scope="scope">
              {{ scope.row.name}}
            </template>
          </el-table-column>
          <el-table-column label="账号">
            <template slot-scope="scope">
              {{ scope.row.acct}}
            </template>
          </el-table-column>
          <el-table-column label="真实姓名">
            <template slot-scope="scope">
              {{ scope.row.realUserName}}
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openAddUserModal = false">
          取消
        </el-button>
        <el-button type="primary" @click="adminUserToGroup()">
          提交
        </el-button>
      </div>
    </el-dialog>
    <!--添加或修改时打开的模态框-->
    <el-dialog :title="textMap.dialogStatus"
               :close-on-click-modal="false"
               :visible.sync="openAddOrUpdateUserModal">
      <el-form ref="dataForm" :rules="rules" :model="formData" label-position="left" label-width="100px"
               style="width: 500px; margin-left:50px;">
        <el-form-item label="用户组名称" prop="groupName">
          <el-input v-model="formData.groupName" name="groupName"/>
        </el-form-item>
        <el-form-item label="用户组编码" prop="groupCode">
          <el-input v-model="formData.groupCode" name="groupCode"/>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="openAddOrUpdateUserModal = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData('dataForm'):updateData('dataForm')">
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>


</template>

<script>
  import { addGroup, updateGroup, adminGroup, userList, openOrCloseFlag, userByName } from '@/api/sys/group/groupList'
  import commonTable from '../../../components/page/index'  // 分页组件

  export default {
    data() {
      return {
        columns: [
          {
            prop: 'options',
            label: '操作',
            width: '300',
            fixed: 'right',
            align: 'center'
          },
          { prop: 'groupName', label: '用户组名称', align: 'left' },
          { prop: 'groupCode', label: '用户组编码', align: 'left' },
          { prop: 'createTime', label: '创建时间', align: 'center', formatter: this.dateFormat, tooltip: true },
          { prop: 'updateTime', label: '更新时间', align: 'center', formatter: this.dateFormat, tooltip: true },
          { prop: 'updateAcct', label: '更新人员', align: 'center' },
          { prop: 'useFlag', label: '是否启用', align: 'center', formatter: this.formatter }
        ],
        options: [
          {
            type: 'primary',
            label: '编    辑',
            size: 'mini',
            event: this.toGroupEdit,
            isShow: item => {
              return item.status == 0 ? false : true
            }
          },
          {
            type: 'primary',
            size: 'mini',
            label: '添加用户',
            event: this.adminGroup,
            isShow: item => {
              return item.status == 1 ? false : true
            }
          },
          {
            size: 'mini',
            label: '启用',
            event: this.openOrCloseFlag,
            isShow: item => {
              return item.useFlag == 0 ? true : false
            }
          },
          {
            type: 'danger',
            size: 'mini',
            label: '禁用',
            event: this.openOrCloseFlag,
            isShow: item => {
              return item.useFlag == 0 ? false : true
            }
          }
        ],
        // 表单验证，绑定页面
        rules: {
          groupName: [
            { required: true, message: '请输入用户组名称', trigger: 'blur' },
            { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
          ],
          groupCode: [
            { required: true, message: '请输入编号', trigger: 'blur' }
          ],
          useFlag: [
            { required: true, message: '必须选中其中一个', trigger: 'change' }
          ]
        },
        // 分页组件的请求方式
        rquestType: 'get',
        // 分页组件的请求
        url: '/view/groupCtrl/getSelectGroup',
        // 添加用户模态框是否显示
        openAddUserModal: false,
        // 定义添加修改模态框页面的执行状态
        dialogStatus: '',
        // 用户组添加或修改时候模态框是否显示
        openAddOrUpdateUserModal: false,
        textMap: {
          create: '添加用户组',
          update: '修改用户组'
        },
        // 定义绑定用户组数据传给后台
        formData: {
          groupName: '',
          groupCode: '',
          useFlag: '',
          groupId: ''
        },
        // 绑定添加用户模态框的用户数据
        userLists: [],
        // 定义选中用户组添加用户的用户id
        args: '',
        // 定义用户组id传给后端
        groupId: '',
        // 定义user，获取输入user的name
        namess: '',

        formInfoData: {
          groupNameInfo: ''
        }
      }
    },
    // 生命分页组件
    components: { commonTable },
    methods: {
      // 模糊查询搜索条件
      selectGroupByName(){
        this.$refs.commonTable.refreshTable()//刷新表格
      },
      // 根据用户name搜索出用户的搜索按钮方法
      getUserByName() {
        const that = this
        const promise = userByName({ 'name': this.namess })
        promise.then(function(reponse) {
          that.userLists = reponse.data
          console.log(reponse.data)
        })

      },
      //禁用启用切换的按钮的方法
      openOrCloseFlag(row) {
        const that = this
        const promise = openOrCloseFlag({ groupId: row.groupId, useFlag: row.useFlag })
        that.$refs.commonTable.refreshTable()
        promise.then(function(reponse) {
          that.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success'
          })
        }).catch(function(error) {
          that.$notify({
            title: '失败',
            message: '修改失败',
            type: 'danger'
          })
        })
        that.$refs.commonTable.refreshTable()
      },
      // 时间格式化方法
      dateFormat: function(row, column) {
        let t = new Date(row.updateTime)//row 表示一行数据, updateTime 表示要格式化的字段名称
        return t.getFullYear() + '-' + (t.getMonth() + 1) + '-' + t.getDate() + ' ' + t.getHours() + ':' + t.getMinutes() + ':' + t.getSeconds()
      },
      // 根据数据0和1返回字符串的方法
      formatter(val) {
        if (val.useFlag == 1) {
          return '启用'
        } else {
          return '未启用'
        }
      },
      userList() {
        userList().then(response => {
          this.userList = response.data
        })

      },
      // 打开用户组模态框
      toEdit(row) {
        this.formData = Object.assign({}, row)
        this.dialogStatus = 'create'
        this.openAddOrUpdateUserModal = true
        this.$nextTick(() => {
          this.$refs.dataForm.clearValidate()
        })
      },
      // 添加用户组数据
      createData(formData) {
        const that = this
        this.$refs[formData].validate((valid) => {
          if (valid) {
            const promise = addGroup(this.formData)
            promise.then(function(reponse) {
              that.openAddOrUpdateUserModal = false
              that.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 1000
              })
            }).catch(function(error) {
              that.$notify({
                title: '失败',
                message: '添加失败',
                type: 'danger',
                duration: 1000
              })
            })
          } else {
            return false
          }
          that.$refs.commonTable.refreshTable()
        })
      },
      // 点击修改时遍历用户组数据
      toGroupEdit(row) {
        this.formData = Object.assign({}, row)
        this.dialogStatus = 'update'
        this.openAddOrUpdateUserModal = true
        this.$nextTick(() => {
          this.$refs.dataForm.clearValidate()
        })
      },
      // 修改请求
      updateData(formData) {
        const that = this
        this.$refs[formData].validate((valid) => {
          if (valid) {
            const promise = updateGroup(this.formData)
            promise.then(function(reponse) {
              that.openAddOrUpdateUserModal = false
              that.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 1000
              })
            }).catch(function(error) {
              that.$notify({
                title: '失败',
                message: '更新失败',
                type: 'danger',
                duration: 1000
              })
            })
          } else {
            return false
          }
          that.$refs.commonTable.refreshTable()
        })
        that.$refs.commonTable.refreshTable()
      },
      // 点击用户组添加用户，打开模态框，获取当前用户组用户
      adminGroup(row) {
        this.name = ''
        this.groupId = row.groupId
        const promise = userList({ 'groupId': row.groupId })
        const that = this
        promise.then(function(reponse) {
          that.userLists = reponse.data
          that.$nextTick(() => {
              for (let i = 0; i < that.userLists.length; i++) {
                if (that.userLists[i].check == true) {
                  // 刷新当前页面
                  that.$refs.multipleTable.toggleRowSelection(that.userLists[i])
                }
              }
            }
          )
        }).catch(function(error) {
        })
        this.openAddUserModal = true
      },
      // 用户组操作用户
      adminUserToGroup() {
        const that = this
        const promise = adminGroup({ 'groupId': this.groupId, 'args': this.args })
        promise.then(function(reponse) {
          that.openAddOrUpdateUserModal = false
          that.$notify({
            title: '成功',
            message: '分配用户成功',
            type: 'success',
            duration: 1000
          })
        }).catch(function(error) {
          that.$notify({
            title: '失败',
            message: '分配用户失败',
            type: 'danger',
            duration: 1000
          })
        })
        this.openAddUserModal = false
      },
      // 绑定获取选中多个用户id
      getUserAllId(val) {
        this.args = ''
        val.forEach(v => {
          this.args += v.userId + ','
        })
      }
    }

  }
</script>

<style scoped>

</style>
