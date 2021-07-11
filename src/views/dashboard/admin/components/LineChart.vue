<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
  import echarts from 'echarts'

 // require('echarts/theme/macarons') // echarts theme
  import resize from './mixins/resize'
//  import { lineChartInit } from '@/api/bk/dashboard/LineChart'

  export default {
    mixins: [resize],  // 折线图样式
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
        date: [],
        kpiRate: []
      }
    },
    watch: {
      chartData: {
        deep: true,
        handler(val) {
          this.setOptions(val)
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.initChart()
      })
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    methods: {
      initData() {
        // lineChartInit({ 'month': 6 }).then(
        //   response => {
        //     this.chartData = response.data
        //   }
        // )
      },
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons')
        this.setOptions(this.chartData)
      },
      setOptions() {
        this.chart.setOption({
          toolbox: {
            show: true,
            orient: 'horizontal',  // 竖向：vertical
            // itemGap: 20,   //间距
            feature: {
              dataView: {                            //数据视图工具，可以展现当前图表所用的数据，编辑后可以动态更新
                show: true,                         //是否显示该工具。
                title: '数据视图',
                readOnly: false,                    //是否不可编辑（只读）
                lang: ['数据视图', '关闭', '刷新'],  //数据视图上有三个话术，默认是['数据视图', '关闭', '刷新']
                backgroundColor: '#fff',             //数据视图浮层背景色。
                textareaColor: '#fff',               //数据视图浮层文本输入区背景色
                textareaBorderColor: '#333',         //数据视图浮层文本输入区边框颜色
                textColor: '#000',                    //文本颜色。
                buttonColor: '#c23531',              //按钮颜色。
                buttonTextColor: '#fff'             //按钮文本颜色。
              },
              saveAsImage: {                         //保存为图片。
                show: true,                         //是否显示该工具。
                type: 'png',                         //保存的图片格式。支持 'png' 和 'jpeg'。
                name: 'pic1',                        //保存的文件名称，默认使用 title.text 作为名称
                backgroundColor: '#ffffff',        //保存的图片背景色，默认使用 backgroundColor，如果backgroundColor不存在的话会取白色
                title: '保存为图片',
                pixelRatio: 1                        //保存图片的分辨率比例，默认跟容器相同大小，如果需要保存更高分辨率的，可以设置为大于 1 的值，例如 2
              },
              magicType: {
                type: ['line', 'bar']
              }
            },
            right: 66
          },
          title: {
            text: '月度KPI总达成率(%)',
            textStyle: {
              fontWeight: 'normal',              //标题颜色
              color: '#ED868C'
            },
            left: 35
          },
          xAxis: {
            data: [this.chartData[5].kpiDate, this.chartData[4].kpiDate, this.chartData[3].kpiDate, this.chartData[2].kpiDate, this.chartData[1].kpiDate, this.chartData[0].kpiDate],
            type: 'category',
            boundaryGap: false
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            },
            padding: [5, 10],
            formatter: '{a} <br/>{b}: {c} %'
          },
          yAxis: {
            data: ['0', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100'],
            type: 'value',
            axisLabel: {
              show: true,
              interval: 'auto',
              formatter: '{value}%'
            },
            show: true,
            axisTick: {
              show: true
            }
          },
          series: [
            {
              name: '达成率',
              data: [this.chartData[5].kpiRate, this.chartData[4].kpiRate, this.chartData[3].kpiRate, this.chartData[2].kpiRate, this.chartData[1].kpiRate, this.chartData[0].kpiRate],
              type: 'line',
              axisLabel: {
                show: true,
                interval: 'auto',
                formatter: '{line}%'
              }
            }
          ]
        })
      }
    }
  }
</script>
