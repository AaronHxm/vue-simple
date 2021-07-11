<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
  import echarts from 'echarts'
  //import { shiftUPMethod } from '@/api/bk/dashboard/Sector'


  export default {
    // name: 'Sector',
    props: {
      className: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '350px'
      },
      autoResize: {
        type: Boolean,
        default: true
      },
      chartData: {
        type: Object,
        required: true
      }
    },
    created() {
      this.initData()
    },
    data() {
      return {
        chart: null,
        shiftUP: '',
        noShiftUP: '',
        AToB: '',
        BToC: '',
        AToC: ''
      }
    },
    mounted() {
      this.initChart()

      this.$nextTick(function () {
        this.drawPie('main')
      })
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    watch: {
      chartData: {
        deep: true,
        handler(val) {
          this.setOptions(val)
        }
      }
    },
    methods: {
      initData(){
        // shiftUPMethod().then(
        //   response => {
        //     this.chartData = response.data
        //     this.shiftUP = response.data.shiftUpRate,
        //     this.noShiftUP = response.data.noShiftUpRate,
        //     this.AToB = response.data.aToBRate,
        //     this.BToC = response.data.bToCRate,
        //     this.AToC = response.data.aToCRate
        //   }
        //)
      },
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons')
          this.setOptions(this.chartData)
      },
      setOptions() {
        this.chart.setOption({
          title: {
            text :'营销升档率(%)',
            top: 7
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d})%'
          },
          legend: {
            orient: 'vertical',
            right: -5,
            top: -5,
            data: ['已升档', '未升档', 'A升B', 'B升C', 'A升C']
          },
          series: [
            {
              name: '总升档率',
              type: 'pie',
              selectedMode: 'single',
              radius: [0, '30%'],
              label: {
                position: 'inner',
                show: false,
                formatter:'{d}%'
              },
              labelLine: {
                show: true
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '15',
                  fontWeight: 'bold'
                }
              },
              data: [
                {value: this.shiftUP, name: '已升档'},
                {value: this.noShiftUP, name: '未升档'}
              ]
            },
            {
              name: '升档率',
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: true,
              emphasis: {
                label: {
                  show: true,
                  fontSize: '20',
                  fontWeight: 'bold'
                }
              },
              label: {
                show: false,
                position: 'inner',
                formatter:'{d}%'
              },
              data: [
                {value: this.AToB, name: 'A升B'},
                {value: this.BToC, name: 'B升C'},
                {value: this.AToC, name: 'A升C'}
              ]
            }
          ]
        })
      }
    }
  }
</script>

<style scoped>

</style>
