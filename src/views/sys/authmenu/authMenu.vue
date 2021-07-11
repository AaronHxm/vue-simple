<template>
  <div class="app-container" style="margin-top: 30px">

    <el-card style="margin-bottom:15px ">
      <el-form ref="authEditAndAddForm" :rules="rules" :model="selectAuthByNameForm" label-position="right"
               style="width: 100%;">

        <el-col :span="4">
          <el-form-item label="" prop="authName">
            <el-input
              v-model="selectAuthByNameForm.authName"
              placeholder="请输入权限名称"
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
      <commonTable ref="commonTable" :columns="columns" :requestUrl="authListUrl" :rquestType="rquestType"
                   :options="options" :params="selectAuthByNameForm">
      </commonTable>
    </el-card>


    <!--以下是模态框-->
    <el-dialog title="分配菜单" :visible.sync="authDialogFormVisible"
               style="height: 90% ;position: absolute;left:0% ;top:0% ">
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
          style="margin-top: 20px; height:300px;overflow: auto"
        />
        <div style="text-align: right">
          <el-button style="margin: 25px 40px  0px 0px  ;" size="small" type="primary"
                     @click="updateAuthMenu()">确认分配
          </el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import commonTable from '../../../components/page/index'
  import { selectMenuByAuthId } from '@/api/sys/authmenu/authMenu'
  import { selectAllRole } from '@/api/sys/authmenu/authMenu'
  import { upadteRelAuthMenu } from '@/api/sys/authmenu/authMenu'

  export default {
    watch: {
      filterText(val) {
        this.$refs.authTree.filter(val)
      },
      authFilterText(val) {
        this.$refs.roleTree.filter(val)
      }
    },

    components: { commonTable },
    data() {
      return {
        columns: [
          { prop: 'id', label: '权限ID', align: 'left', tooltip: true },
          { prop: 'label', label: '权限名称', align: 'left', tooltip: true },
          { prop: 'options', label: '操作', width: '200', fixed: 'right', align: 'center' }
        ],
        /**
         * 以下是查询权限表单中参数
         */
        selectAuthByNameForm: {
          authName: ''
        },
        options: [
          {
            type: 'primary',
            label: '分配菜单',
            size: 'mini',
            event: this.openModal,
            isShow: item => {
              return item.status === 0 ? false : true
            }
          }
        ],
        count: '',
        authDialogFormVisible: false,
        authListUrl: '/view/authMenuCtrl/getAllAuth',
        rquestType: 'get',
        filterText: '',
        authFilterText: '',

        authData: [],
        resourceCheckedKey: [],
        roleData: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        authIds: {
          authId: '2'
        }
      }
    },
    methods: {
      /**
       * 搜索按钮绑定事件
       */
      selectAuthByName() {

        this.$refs.commonTable.refreshTable()
      },
      filterNode1(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      //分配菜单的方法
      updateAuthMenu() {
        this.authDialogFormVisible = false
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
        this.authId = data.id
        const promise = selectMenuByAuthId({ 'authId': data.id })
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
      filterNode2(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      initRoleList() {
        selectAllRole().then(response => {
          this.roleData = response.data
        })
      },
      // dakai
      openModal(row) {
        this.authDialogFormVisible = true
        this.selectMenu(row)
      },
      load() {
        this.count += 2
      }
    }
  }
</script>

<style scoped>

</style>
