<template>
  <div class="app-container">
    <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="addAuth">分配</el-button>
    <el-table
      ref="roleAuthTable"
      v-loading="roleAuthLoading"
      :data="list"
      element-loading-text="Loading"
      height="600"
      border
      fit
      highlight-current-row
      @selection-change="addAuth"
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
  </div>
</template>

<script>
import { selectAuth } from '@/api/sys/roleauth/roleauth'
export default {
  data() {
    return {
      list: null,
      roleAuthLoading: true,
      checkBoxData: []

    }
  },
  created() {
    this.fetchData()
  }, updated() {
    // 在这里调用toggleSelection选中方法\
    this.toggleSelection(this.list)
  },
  methods: {
    fetchData() {
      this.roleAuthLoading = true
      selectAuth().then(response => {
        this.list = response.data
        this.roleAuthLoading = false
      })
    }, toggleSelection(rows) {
      rows.forEach(row => {
        if (row.check) {
          // toggleRowSelection  这个方法是用来选中某一行（打勾）
          // row 是要选中的那一行
          // true 是为选中
          this.$refs.roleAuthTable.toggleRowSelection(row, true)
        }
      })
    }, addAuth(val) {
      this.checkBoxData = []
      val.forEach(v => {
        if (this.checkBoxData.indexOf(v.authId) === -1) {
          this.checkBoxData.push(v.authId)
        }
      })
    }
  },
  handleSelectionChange(val) {
    // val 是当前选中的表格数据，是数组类型
  }
}

</script>

<style scoped>

</style>
