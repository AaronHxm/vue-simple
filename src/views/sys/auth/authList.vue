<template>
  <div class="app-container" style="margin-top: 30px">
    <el-card style="margin-bottom:15px ">
      <el-form ref="authEditAndAddForm" :rules="rules" :model="selectAuthByNameForm" label-position="right"
               style="width: 100%;">

        <el-col :span="4">
          <el-form-item label="" prop="">
            <el-input
              v-model="selectAuthByNameForm.authName"
              placeholder="请输入权限名称"
              size="mini"
              clearable
              style="width:90% "/>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="" prop="">
            <el-input
              v-model="selectAuthByNameForm.createAcct"
              placeholder="请输入创建人名称"
              size="mini"
              clearable
              style="width:90% "/>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="" prop="">
            <el-input
              v-model="selectAuthByNameForm.updateAcct"
              placeholder="请输入更新人名称"
              clearable
              size="mini"
              style="width:90% "/>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="" prop="">
            <el-button type="primary" @click="selectAuthByName()" size="mini"
                       icon="el-icon-search">查询
            </el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-card>

    <el-card>
      <el-button class="filter-item" type="primary" size="mini" icon="el-icon-circle-plus"
                 @click="openAddAuthModel()">
        添加权限
      </el-button>
      <commonTable ref="commonTable" :columns="columns" :requestUrl="authListUrl" :rquestType="rquestType"
                   :options="options" :params="selectAuthListDto" style="margin-top: 15px">
      </commonTable>
    </el-card>

    <!--以下是权限分配菜单模态框-->
    <el-dialog title="分配菜单" :visible.sync="authAddMenuFormVisible"
               :close-on-click-modal="false"
               style="height: 90% ; ">
      <el-form ref="authEditAndAddForm" label-position="left"
               label-width="100px"
               style="width:95%; margin-left:5%;">
        <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterText"
          size="small"
          style="width: 50%">
        </el-input>

        <el-tree
          v-infinite-scroll="load"
          ref="authTree"
          :data="authData"
          empty-text="点击左边权限"
          show-checkbox
          :props="defaultProps"
          class="filter-tree"
          default-expand-all
          :default-expanded-keys="[2]"
          :default-checked-keys="resourceCheckedKey"
          node-key="id"
          :filter-node-method="filterNode"
          style="margin-top: 20px; height:250px;overflow: auto"
        />
        <div style="text-align: right">
          <el-button style="margin: 25px 40px  0px 0px  ;" size="small" type="primary"
                     @click="updateAuthMenu()">确认分配
          </el-button>
        </div>
      </el-form>
    </el-dialog>

    <!--以下是添加编辑模态框-->
    <el-dialog :title="textMap[authDialogStatus]"
               :visible.sync="authDialogFormVisible"
               :close-on-click-modal="false">
      <el-form :rules="rules" ref="authEditAndAddForm" :model="authEditAndAddForm" label-position="left"
               label-width="100px"
               style="width: 500px; margin-left:50px;">
        <el-form-item label="权限代码" prop="authCode">
          <el-input v-model="authEditAndAddForm.authCode"/>
        </el-form-item>
        <el-form-item label="权限名称" prop="authName">
          <el-input v-model="authEditAndAddForm.authName"/>
        </el-form-item>
        <el-form-item label="权限等级" prop="seq">
          <el-input v-model="authEditAndAddForm.seq"/>
        </el-form-item>
        <el-form-item label="系统代码" prop="sysCode">
          <el-input v-model="authEditAndAddForm.sysCode" disabled/>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="authDialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary"
                   @click="authDialogStatus==='create'?addAuth():updateAuth()">
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>import {
  updateAuthOfJs, addAuthOfJs, updateUseFlagOfJs,authListUrl
} from '@/api/sys/auth/auth'
import commonTable from '../../../components/page/index'
import { dateFormatterOfJs } from '@/utils/formatterUtils'
import { selectMenuByAuthId } from '@/api/sys/authmenu/authMenu'
import { upadteRelAuthMenu } from '@/api/sys/authmenu/authMenu'
export default {
  components: { commonTable },
  data() {
    return {
      /**
       * 从count到defaultProps是分配菜单所需要的data
       */
      count: '',
      authId:'',
      authAddMenuFormVisible: false,
      filterText: '',
      authFilterText: '',
      authData: [],
      resourceCheckedKey: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },


      columns: [
        { prop: 'authName', label: '权限名称', align: 'left', tooltip: true },
        { prop: 'seq', label: '权限等级', align: 'center' },
        { prop: 'sysCode', label: '系统代码', align: 'left' },
        { prop: 'createAcct', label: '创建人员', align: 'left' },
        { prop: 'createTime', label: '创建时间', tooltip: true, align: 'center', formatter: this.createTimeFormatter },
        { prop: 'updateAcct', label: '更新人员', align: 'left' },
        { prop: 'updateTime', label: '更新时间', tooltip: true, align: 'center', formatter: this.updateTimeFormatter },
        { prop: 'useFlag', label: '状态', align: 'center', formatter: this.useFlagFormatter },
        { prop: 'options', label: '操作', width: '300', fixed: 'right', align: 'center' }
      ],
      options: [
        {
          type: 'primary',
          label: '编辑',
          size: 'mini',
          event: this.openUpdataAuthModel,
          isShow: item => {
            return item.status === 0 ? false : true
          }
        },
        {
          type: 'primary',
          label: '分配菜单',
          size: 'mini',
          event: this.openModal,
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

      /**
       * 表格数据请求路径
       */
      authListUrl: authListUrl.url,
      /**
       *查询角色列表实际参数
       */
      selectAuthListDto: {
        authName: '',
        createAcct: '',
        updateAcct: ''
      },
      /**
       * 以下是查询权限表单中参数
       */
      selectAuthByNameForm: {
        authName: '',
        createAcct: '',
        updateAcct: ''
      },
      /**
       * 模态框状态
       */
      authDialogStatus: '',
      /**
       * 用来控制模态框是否显示
       */
      authDialogFormVisible: false,
      textMap: {
        update: '编辑',
        create: '添加'
      },
      /**
       * 表单中的数据
       */
      authEditAndAddForm: {
        authId: '',
        authName: '',
        authCode: '',
        seq: '',
        sysCode: ''
      },
      /**
       * 表单验证规则
       */
      rules: {
        authCode: [{ required: true, message: '权限代码不能为空', trigger: 'blur' }],
        authName: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        seq: [{ required: true, message: '权限等级不能为空', trigger: 'blur' }],
        sysCode: [{ required: true, message: '系统代码不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    //分配菜单的方法
    updateAuthMenu() {
      this.authAddMenuFormVisible = false
      const args = JSON.stringify(this.$refs.authTree.getCheckedKeys())

      const promise = upadteRelAuthMenu({ 'authId': this.authId, 'args': this.$refs.authTree.getCheckedKeys() })
      promise.then(response => {
        this.$message({
          type: 'success',
          message: '分配成功',
          duration: 1000,
          center: true
        })
      }).catch(error => {
        this.$message({
          type: 'error',
          message: '失败啦',
          duration: 1000,
          center: true
        })
      })
    },
    //查询菜单
    selectMenu(data) {
      this.resourceCheckedKey = []
      this.authId = data.authId
      const promise = selectMenuByAuthId({ 'authId': data.authId })
      promise.then(response => {
        this.authData = response.data
        for (let i = 0; i < this.authData.length; i++) {
          const menu = this.authData[i]

          if (menu.checked) {
            this.resourceCheckedKey.push(menu.id)
          }
          for (let j = 0; j < menu.children.length; j++) {
            const menu2 = menu.children[j]
            if (menu2.checked) {
              this.resourceCheckedKey.push(menu2.id)
            }
          }
        }
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },

    openModal(row) {
      this.authAddMenuFormVisible = true
      this.selectMenu(row)
      // console.log(row,'这是当前行')
    },
    load() {
      this.count += 2
    },

    /**
     * 格式化时间
     * @param row
     */
    createTimeFormatter(row) {
      return dateFormatterOfJs(row.createTime)
    },
    updateTimeFormatter(row) {
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
     * 验证成功之后调用的方法
     * @param promise that
     */
    validateSuccessMethod(promise, that) {
      promise.then(function(reponse) {
        that.authDialogFormVisible = false
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
     * 打开添加权限模态框
     * @param row
     */
    openAddAuthModel(row) {
      this.authEditAndAddForm = Object.assign({}, row) // copy obj
      this.authEditAndAddForm.seq = 5
      this.authEditAndAddForm.sysCode = 'BASIC'
      this.authDialogStatus = 'create'
      this.authDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.authEditAndAddForm.clearValidate()
      })
    },
    /**
     * 打开更新权限模态框
     * @param row
     */
    openUpdataAuthModel(row) {
      this.authEditAndAddForm = Object.assign({}, row) // copy obj
      this.authDialogStatus = 'update'
      this.authDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.authEditAndAddForm.clearValidate()
      })
    },
    /**
     *添加权限
     */
    addAuth() {
      this.$refs.authEditAndAddForm.validate((valid) => {
        if (valid) {
          const promise = addAuthOfJs(this.authEditAndAddForm)
          this.validateSuccessMethod(promise, this)
        } else {
          return false
        }
      })
    },
    /**
     *更新权限
     */
    updateAuth() {
      this.$refs.authEditAndAddForm.validate((valid) => {
        if (valid) {
          const promise = updateAuthOfJs(this.authEditAndAddForm)
          this.validateSuccessMethod(promise, this)
        } else {
          return false
        }
      })
    },
    /**
     * 更改状态
     */
    updateUseFlag(row) {
      const promise = updateUseFlagOfJs({ 'authId': row.authId, 'useFlag': row.useFlag })
      this.validateSuccessMethod(promise, this)
    },
    /**
     * 重置搜索框中的内容
     */
    resetSelectAuthByNameForm() {
      this.selectAuthByNameForm.createAcct = ''
      this.selectAuthByNameForm.authName = ''
      this.selectAuthByNameForm.updateAcct = ''
    },
    /**
     * 搜索按钮绑定事件
     */
    selectAuthByName() {
      this.selectAuthListDto = this.selectAuthByNameForm
      this.$refs.commonTable.refreshTable()
    }
  }
}
</script>

<style scoped>

</style>
