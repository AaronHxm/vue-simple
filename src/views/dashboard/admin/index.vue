<template>
  <div class="dashboard-editor-container">
    <!--    头部四小块-->
    <panel-group @handleSetLineChartData="handleSetLineChartData"/>
    <!-- 折线图部分 -->
    <el-row style="margin-bottom:30px;">
      <el-col :span="18">
        <el-card >
            <line-chart :chart-data="lineChartData"/>
        </el-card>
      </el-col>
      <!--      环状图部分-->
      <el-col :span="6">
        <el-card style="display: inline-block; margin-left: 5%; width: 100%">
          <Sector/>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  // import PanelGroup from './components/PanelGroup'
  // import LineChart from './components/LineChart'
  // import Sector from './components/Sector'

  // /*曲线图中的数据*/
  // const lineChartData = {
  //
  // }
  //
  // export default {
  //   name: 'DashboardAdmin',
  //   components: {
  //     PanelGroup,
  //     LineChart,
  //     Sector
  //   },
  //   data() {
  //     return {
  //       openTable: false
  //     }
  //   },
  //   methods: {
  //     handleSetLineChartData(type) {
  //       this.lineChartData = lineChartData[type]
  //     }
  //   }
  //}
</script>

<style lang="scss" scoped>
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;

    .github-corner {
      position: absolute;
      top: 0px;
      border: 0;
      right: 0;
    }

    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }

  @media (max-width: 1024px) {
    .chart-wrapper {
      padding: 8px;
    }
  }
</style>
