<template>
  <div class="app-container" style="margin-top: 30px">

<!--    <div>-->
<!--      <magnify :images="image"></magnify>-->
<!--    </div>-->
    <el-card style="margin-bottom:15px ">
      <el-form>
        <el-col :span="6">
          <el-form-item label="" prop="menuNameInfo">
            <el-input
              v-model="formInfoData.menuNameInfo"
              placeholder="请输入菜单名称"
              size="mini"
              clearable
              style="width:90% "/>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="" prop="">
            <el-button type="primary" @click="selectmenuByName()" size="mini"
                       icon="el-icon-search">查询
            </el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-card>

    <el-card style="margin-bottom:15px ">
      <el-button type="primary" icon="el-icon-circle-plus" size="mini" @click="toEdit()">添加菜单</el-button>

      <!--    页面添加分页组件-->
      <commonTable :params="formInfoData" ref="commonTable" :columns="columns" :requestUrl="url" :rquestType="rquestType" :options="options"
                   style="margin-top: 15px">

      </commonTable>
    </el-card>
    <!--    添加或修改时候打开的模态框-->
    <el-dialog :title="textMap.dialogStatus" :visible.sync="openAddOrUpdateMenuModal">
      <el-form ref="dataForm" :rules="rules" :model="formData" label-position="left" label-width="100px"
               style="width: 500px; margin-left:50px;">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="formData.menuName"/>
        </el-form-item>
        <el-form-item label="菜单URL" prop="menuUrl">
          <el-input v-model="formData.menuUrl"/>
        </el-form-item>
        <el-form-item label="icon" prop="icon">
          <el-input v-model="formData.icon"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addFather()">选择父级</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!--        这个取消是饿了么官网的api方法，这样点击就关闭当前模态框-->
        <el-button @click="openAddOrUpdateMenuModal = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createMenu('dataForm'):updateMenu('dataForm')">
          提交
        </el-button>
      </div>
    </el-dialog>

    <!--    添加或修改的模态框里面嵌套的模态框，用来选择父级节点-->
    <el-dialog title="请选择父级菜单" :visible.sync="openAddOrUpdateFatherNodeModal">
      <el-form ref="dataForm" :model="formData" label-position="left" label-width="100px"
               style="width: 500px; margin-left:50px;">
        <el-tree :data="menuModalFather" show-checkbox ref="tree" :node-key="id"
                 :props="defaultProps" @check-change="handleNodeClick" :check-strictly="true"></el-tree>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="openAddOrUpdateFatherNodeModal = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateFatherNode">
          提交
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { addMenu, updateMenu, selectMenuVo, openOrCloseFlag } from '@/api/sys/menu/menuList'
  import { reconstruction } from '@/utils/utils'    // tree组件
  import commonTable from '../../../components/page/index'    // 分页组件
  // 看图组件
  import magnify from '../../../components/Magnify/magnify'

  export default {
    data() {
      return {
        image: [
          'https://farm5.staticflickr.com/4267/34162425794_1430f38362_z.jpg',
          'https://farm1.staticflickr.com/4160/34418397675_18de1f7b9f_z.jpg',
          'https://farm1.staticflickr.com/512/32967783396_a6b4babd92_z.jpg'
        ],

        columns: [
          {
            prop: 'options',
            label: '操作',
            align: 'center',
            fixed: 'right',
            width: '250'
          },
          { prop: 'menuName', label: '菜单名称', align: 'left' },
          { prop: 'menuUrl', label: '菜单URL', align: 'left', tooltip: true },
          { prop: 'createTime', label: '创建时间', align: 'center', formatter: this.dateFormat, tooltip: true },
          { prop: 'updateTime', label: '更新时间', align: 'center', formatter: this.dateFormat, tooltip: true },
          { prop: 'updateAcct', label: '更新人员', align: 'center' },
          { prop: 'useFlag', label: '是否启用', align: 'center', formatter: this.formatter }
        ],
        options: [
          {
            type: 'primary',
            label: '编辑菜单',
            size: 'mini',
            event: this.menuEdit,
            isShow: item => {
              return item.status == 0 ? false : true
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
        // 表单验证
        rules: {
          menuName: [
            { required: true, message: '请输入菜单名称', trigger: 'blur' },
            { min: 4, max: 8, message: '长度在 4 到 8 个字符', trigger: 'blur' }
          ],
          menuUrl: [
            { required: true, message: 'url不能为空', trigger: 'blur' }
          ],
          useFlag: [
            { required: true, message: '必须选中其中一个', trigger: 'change' }
          ]
        },
        // 初始化遍历页面请求方式
        rquestType: 'get',
        // 初始化遍历页面请求地址
        url: '/view/menuCtrl/queryMenuList',
        // 绑定选择父级的模态框
        menuModalFather: [],
        // 选择父级的模态框的结构
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        // 绑定选择父级模态框tree的后台返回结果节点id
        id: 'id',
        // 定义添加修改模态框的执行状态
        dialogStatus: '',
        // 添加修改模态框是否显示
        openAddOrUpdateMenuModal: false,
        // 选择父级的模态框是否显示
        openAddOrUpdateFatherNodeModal: false,
        textMap: {
          create: '添加用户组',
          update: '修改用户组'
        },
        // 定义绑定后台传输数据
        formData: {
          icon: '',
          menuName: '',
          menuUrl: '',
          useFlag: '',
          fatherId: '',
          menuId: ''
        },
        // 定义一个接受选择父节点的一个集合数组
        checkList: [],
        checked: [],   // 存储节点的id

        formInfoData: {
          menuNameInfo: ''
        }
      }
    },
    // 声明的组件
    components: { commonTable, magnify },
    // 初始化调用方法
    created() {
      this.getMenus()
    },
    methods: {
      // 模糊查询搜索条件
      selectmenuByName(){
        //刷新表格
        this.$refs.commonTable.refreshTable()
      },
      //禁用启用切换的按钮的方法
      openOrCloseFlag(row) {
        const that = this
        const promise = openOrCloseFlag({ menuId: row.menuId, useFlag: row.useFlag })
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
      // 格式化时间格式的方法，绑定formatter，到页面上
      dateFormat: function(row, column) {
        let t = new Date(row.updateTime)//row 表示一行数据, updateTime 表示要格式化的字段名称
        return t.getFullYear() + '-' + (t.getMonth() + 1) + '-' + t.getDate() + ' ' + t.getHours() + ':' + t.getMinutes() + ':' + t.getSeconds()
      },
      // 根据数值给出返回字符串，绑定formatter，到页面上
      formatter(val) {
        if (val.useFlag == 1) {
          return '启用'
        } else {
          return '未启用'
        }
      },
      // 选择父级节点，并判断只可以选择一个
      handleNodeClick(data, checked) {
        this.checkList = this.$refs.tree.getCheckedKeys()

        if (checked === true) {
          this.formData.fatherId = data.id
          this.$refs.tree.setCheckedKeys([data.id])
        } else {
          if (this.checkedId == data.id) {
            this.$refs.tree.setCheckedKeys([data.id])
          }
        }

      },
      // 打开模态框时候调用的方法，遍历数据，显示tree
      getMenus() {
        const that = this
        selectMenuVo().then(response => {
          that.menuModalFather = reconstruction(response.data, 'id', 'pId', 'children')
        })
      },
      // 添加菜单按钮
      toEdit(row) {
        this.formData = Object.assign({}, row)
        this.dialogStatus = 'create'
        this.openAddOrUpdateMenuModal = true
        this.$nextTick(() => {
          this.$refs.dataForm.clearValidate()
        })
      },
      // 添加一条菜单
      createMenu(formData) {
        const that = this
        this.$refs[formData].validate((valid) => {
          if (valid) {
            const promise = addMenu(this.formData)
            promise.then(function(reponse) {
              that.openAddOrUpdateMenuModal = false
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

        that.$refs.commonTable.refreshTable()
      },
      // 点击编辑按钮，显示模态框，并传入数据遍历页面上
      menuEdit(row) {
        this.formData = Object.assign({}, row)
        this.dialogStatus = 'update'
        this.openAddOrUpdateMenuModal = true
        this.$nextTick(() => {
          this.$refs.dataForm.clearValidate()
        })
      },
      // 修改菜单方法,选择父级id后一样执行修改
      updateMenu(formData) {
        const that = this
        this.$refs[formData].validate((valid) => {
          if (valid) {
            const promise = updateMenu(this.formData)
            promise.then(function(reponse) {
              that.openAddOrUpdateMenuModal = false
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
      // 选择父级模态框按钮，显示出来，遍历数据
      addFather(row) {
        this.openAddOrUpdateFatherNodeModal = true
        this.getMenus()
      },
      // 选择父级把id传给fatherId
      updateFatherNode() {
        this.formData.fatherId = this.checkList[0]
        this.openAddOrUpdateFatherNodeModal = false
      }
    }
  }
</script>

<style scoped>

</style>
