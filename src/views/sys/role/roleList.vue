<template>
  <div class="app-container" style="margin-top: 30px">
    <span>{{this.myTest}}</span>
    <el-card style="margin-bottom:15px ">
      <el-form ref="roleEditAndAddForm" :rules="rules" :model="selectRoleByNameForm" label-position="right"
               style="width: 100%;">
        <el-col :span="4">
          <el-form-item label="" prop="">
            <el-input
              v-model="selectRoleByNameForm.roleName"
              placeholder="请输入角色名称"
              size="mini"
              clearable
              style="width:90% ;"/>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="" prop="">
            <el-input
              v-model="selectRoleByNameForm.createAcct"
              placeholder="请输入创建人名称"
              clearable
              size="mini"
              style="width: 90%;"/>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="" prop="">
            <el-input
              v-model="selectRoleByNameForm.updateAcct"
              placeholder="请输入更新人名称"
              clearable
              size="mini"
              style="width: 90%;"/>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="" prop="">
          <el-button type="primary" @click="selectRoleByName()" size="mini"
                     icon="el-icon-search">查询

          </el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-card>

    <el-card>
      <el-button class="filter-item" icon="el-icon-circle-plus" type="primary" size="mini"
                 @click="openAddRoleModal()">
        添加角色
      </el-button>
      <!--角色列表表格-->
      <commonTable ref="commonTable" :columns="columnsOfRoleList" :requestUrl="roleListUrl" :rquestType="rquestType"
                   :options="roleListOptions" :params="selectRoleListDto" style="margin-top: 15px">
      </commonTable>
    </el-card>
    <!--分配权限模态框-->
    <el-dialog title="请选择权限"
               :close-on-click-modal="false"
               :visible.sync="roleAddAuthDialog" width="30%"

    >
      <el-table
        ref="roleAuthTable"
        v-loading="roleAuthLoading"
        :data="roleAuthList"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        @selection-change="getCheckedNodeKeys"
        :height='350'
      >
        <el-table-column
          type="selection"
          width="55"
          show-overflow-tooltip="true"
        />
        <el-table-column align="center" label="ID" width="95" sortable prop="authId">
          <template slot-scope="scope">
            {{ scope.row.authId }}
          </template>
        </el-table-column>
        <el-table-column label="权限名称">
          <template slot-scope="scope">
            {{ scope.row.authName }}
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleAddAuthDialog = false">取 消</el-button>
        <el-button type="primary" @click="addAuthToRole">确 定</el-button>
      </span>
    </el-dialog>
    <!--以下是编辑添加模态框-->
    <el-dialog :title="textMap[dialogStatus]"
               :close-on-click-modal="false"
               :visible.sync="roleAddAndUpdateDialogForm">
      <el-form ref="roleEditAndAddForm" :rules="rules" :model="roleEditAndAddForm" label-position="left"
               label-width="100px"
               style="width: 500px; margin-left:50px;">
        <el-form-item label="角色代码" prop="roleCode">
          <el-input v-model="roleEditAndAddForm.roleCode"/>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleEditAndAddForm.roleName"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleAddAndUpdateDialogForm = false">
          取消
        </el-button>
        <el-button type="primary"
                   @click="dialogStatus==='create'?addRole():updateRole()">
          提交
        </el-button>
      </div>
    </el-dialog>
    <!--以下是角色添加用户组模态框-->
    <el-dialog :title="textMap[dialogStatus]"
               :close-on-click-modal="false"
               :visible.sync="roleAddGroupDialogFormVisible" width="30%">
      <el-table
        ref="groupsByRoleIdTable"
        :data="groupsByRoleId"
        tooltip-effect="dark"
        style="width: 100%"
        border
        :height='350'
        @selection-change="getCheckBoxDataOfGroupModel">
        <el-table-column
          type="selection"
          width="40%">
        </el-table-column>
        <el-table-column
          label="用户组名称">
          <template slot-scope="scope">{{ scope.row.groupName }}</template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleAddGroupDialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="addRolesToGroups()">
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>import {
  updateRoleOfJs,
  addRoleOfJs,
  updateRoleAuth,
  selectGroupsByRoleIdOfJs,
  roleAddGroup,
  updateUseFlagOfJs,
  roleListUrl,
} from '@/api/sys/role/role'
import { selectAuth } from '@/api/sys/roleauth/roleauth'
import { dateFormatterOfJs } from '@/utils/formatterUtils'
import commonTable from '../../../components/page/index'

export default {
  components: { commonTable },
  data() {
    return {
      columnsOfRoleList: [
        { prop: 'roleName', label: '角色名称', align: 'left', tooltip: true },
        { prop: 'createAcct', label: '创建人员', align: 'left' },
        { prop: 'createTime', label: '创建时间', tooltip: true, align: 'left', formatter: this.dateFormatter },
        { prop: 'updateAcct', label: '更新人员', align: 'left' },
        { prop: 'updateTime', label: '更新时间', tooltip: true, align: 'left', formatter: this.dateFormatter1 },
        { prop: 'useFlag', label: '状态', align: 'center', formatter: this.useFlagFormatter },
        { prop: 'options', label: '操作', width: '400', fixed: 'right', align: 'center' }
      ],
      /*
      columnsOfGroupList: [
        { prop: 'groupName', label: '用户组名称', align: 'left' },
        { prop: 'selection', width: '55', fixed: 'left', align: 'left' }
      ],
      groupListOptions: [
        {
          type: 'checkboxs',
          size: 'mini',
          event: this.openUpdateRoleModel,
          isShow: item => {
            return item.status === 0 ? false : true
          }
        }
      ],*/
      roleListOptions: [
        {
          type: 'primary',
          label: '编辑角色',
          size: 'mini',
          event: this.openUpdateRoleModel,
          isSelection: true,
          isShow: item => {
            return item.status === 0 ? false : true
          }
        },
        {
          type: 'primary',
          label: '分配用户组',
          size: 'mini',
          event: this.openRoleGroupModel,
          isShow: item => {
            return item.status === 1 ? false : true
          }
        },
        {
          type: 'primary',
          label: '分配权限',
          size: 'mini',
          event: this.openRoleAddAuthModel,
          isShow: item => {
            return item.status === 1 ? false : true
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
      stateOfRole: 'danger',
      /*
      查询角色列表url
      */
      roleListUrl: roleListUrl.url,
      /*
      查询角色列表实际参数
      */
      selectRoleListDto: {
        roleName: '',
        createAcct: '',
        updateAcct: ''
      },
      /**
       * 以下是查询角色表单中参数
       */
      selectRoleByNameForm: {
        roleName: '',
        createAcct: '',
        updateAcct: ''
      },
      /*
      角色添加用户组时用来传递roleId
      */
      roleIdAddgroup: '',
      /*
      角色添加权限时用来传递roleId
      */
      roleAuthId: '',
      /*
      角色添加权限时用来存储已有的权限
      */
      roleAuthList: [],
      /*
      角色添加权限时表格中Loading的属性
      */
      roleAuthLoading: true,
      /*
      用来存储选中checkBox中的数据
      */
      checkBoxData: '',
      /*
      角色分配用户组的时候用来存储已有的用户组
      */
      groupsByRoleId: null,
      /*
      表格中Loading的属性
      */
      listLoading: true,
      /*
      添加和编辑时用来确定打开的模态框时哪一个
      */
      dialogStatus: '',
      /*
      用来管理角色添加和编辑时的模态框的是否显示 ture是显示
      */
      roleAddAndUpdateDialogForm: false,
      /*
      用来管理角色分配用户组时的模态框的是否显示 ture是显示
      */
      roleAddGroupDialogFormVisible: false,
      /*
      用来管理角色分配权限时的模态框的是否显示 ture是显示
      */
      roleAddAuthDialog: false,
      textMap: {
        update: '编辑',
        create: '添加',
        roleAddGroup: '添加用户组'
      },
      /*
     以下是添加和编辑时模态框中的数据
     */
      roleEditAndAddForm: {
        roleId: '',
        roleName: '',
        roleCode: '',
        useFlag: ''
      },
      /*
      表单验证规则
      */
      rules: {
        roleCode: [{ required: true, message: '角色代码不能为空', trigger: 'blur' }],
        roleName: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        useFlag: [{ required: true, message: '必须选中其中一个', trigger: 'change' }]
      }
    }
  },
  updated() {
    // 在这里调用toggleSelection选中方法\
    this.toggleSelection(this.roleAuthList)
    this.groupSelecthion(this.groupsByRoleId)
  },
  computed:{
    myTest(){
      return '这是测试方法'
    }
  },
  methods: {

    /**
     * 格式化时间
     * @param row
     */
    dateFormatter(row) {
      return dateFormatterOfJs(row.createTime)
    },
    dateFormatter1(row) {
      return dateFormatterOfJs(row.updateTime)
    },
    /**
     * 格式化状态
     * @param row
     */
    useFlagFormatter(val) {
      if (val.useFlag == 1) {
        return '已启用'
      } else {
        return '未启用'
      }
    },
    /**
     * 表单验证成功后调用的方法
     * @param  promise that
     */
    validateSuccessMethod(promise, that) {
      promise.then(function(reponse) {
        that.roleAddAndUpdateDialogForm = false
        that.roleAddGroupDialogFormVisible = false
        that.roleAddAuthDialog = false
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
    /*
   以下是wangsong*/
    /**
     * 角色添加权限
     */
    addAuthToRole() {
      const promise = updateRoleAuth({ 'roleId': this.roleAuthId, 'args': this.checkBoxData })
      this.validateSuccessMethod(promise, this)
    },
    /**
     * 打开角色添加权限模态框
     * @param  row
     */
    openRoleAddAuthModel(row) {
      this.roleAuthId = row.roleId
      this.getAllAuth()
      this.roleAddAuthDialog = true
    },
    /**
     * 获取到角色已有的权限
     */
    getAllAuth() {
      this.roleAuthLoading = true
      selectAuth({ 'roleId': this.roleAuthId }).then(response => {
        this.roleAuthList = response.data
        this.roleAuthLoading = false
        // this.$nextTick( setTimeout(,3000))
      })
    },
    /**
     * toggleRowSelection  这个方法是用来选中某一行（打勾）
     * @param  rows所有的权限
     */
    toggleSelection(rows) {
      rows.forEach(row => {
        if (rows != null) {
          if (row.check) {
            // toggleRowSelection  这个方法是用来选中某一行（打勾）
            // row 是要选中的那一行
            // true 是为选中
            this.$refs.roleAuthTable.toggleRowSelection(row, true)
          }
        }
      })
    },
    /**
     *获取
     */
    getCheckedNodeKeys(val) {
      this.checkBoxData = ''
      val.forEach(v => {
        this.checkBoxData += v.authId + ','
      })
    },
    /*
    以上是wangsong*/
    /*
    * 打开添加角色模态框
    *  @param row
    */
    openAddRoleModal(row) {
      this.roleEditAndAddForm = Object.assign({}, row) // copy obj
      this.dialogStatus = 'create'
      this.roleAddAndUpdateDialogForm = true
      this.$nextTick(() => {
        this.$refs.roleEditAndAddForm.clearValidate()
      })
    },
    /*
    * 打开编辑角色模态框
    * @param row
    */
    openUpdateRoleModel(row) {
      this.roleEditAndAddForm = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.roleAddAndUpdateDialogForm = true
      this.$nextTick(() => {
        this.$refs.roleEditAndAddForm.clearValidate()
      })
    },
    /**
     * 打开分配用户组模态框
     * @param row
     */
    openRoleGroupModel(row) {
      this.roleIdAddgroup = row.roleId
      this.dialogStatus = 'roleAddGroup'
      this.roleAddGroupDialogFormVisible = true
      selectGroupsByRoleIdOfJs({ 'roleId': row.roleId }).then(response => {
        this.groupsByRoleId = response.data
      })
    },
    /**
     * 用来获取当前角色id是否有用户组
     * @param rows
     */
    groupSelecthion(rows) {
      if (rows != null) {
        rows.forEach(row => {
          if (row.check) {
            this.$refs.groupsByRoleIdTable.toggleRowSelection(row, true)
          }
        })
      }
    },
    /**
     * 添加角色
     */
    addRole() {
      this.$refs.roleEditAndAddForm.validate((valid) => {
        if (valid) {
          const promise = addRoleOfJs(this.roleEditAndAddForm)
          this.validateSuccessMethod(promise, this)
        } else {
          return false
        }
      })
    },
    /**
     * 更新角色
     */
    updateRole() {
      this.$refs.roleEditAndAddForm.validate((valid) => {
        if (valid) {
          const promise = updateRoleOfJs(this.roleEditAndAddForm)
          this.validateSuccessMethod(promise, this)
        } else {
          return false
        }
      })
    },
    /**
     * 获取多选框中选中的数据
     */
    getCheckBoxDataOfGroupModel(val) {
      this.checkBoxData = ''
      val.forEach(v => {
        this.checkBoxData += v.groupId + ','
      })
    },
    /**
     * 提交角色添加用户组
     */
    addRolesToGroups() {
      const promise = roleAddGroup({ 'roleId': this.roleIdAddgroup, 'args': this.checkBoxData })
      this.validateSuccessMethod(promise, this)
    },
    /**
     * 更改角色状态
     */
    updateUseFlag(row) {
      const promise = updateUseFlagOfJs({ 'roleId': row.roleId, 'useFlag': row.useFlag })
      this.validateSuccessMethod(promise, this)
    },
    /**
     * 重置搜索框中的内容
     */
    resetSelectRoleByNameForm() {
      this.selectRoleByNameForm.createAcct = ''
      this.selectRoleByNameForm.roleName = ''
      this.selectRoleByNameForm.updateAcct = ''
    },
    /**
     * 搜索按钮绑定事件
     */
    selectRoleByName() {
      this.selectRoleListDto = this.selectRoleByNameForm
      this.$refs.commonTable.refreshTable()
    }
  }
}
</script>

<style scoped>

</style>
