var animate =true;
export default {

  createPatternOption: function (analysis,echarts) {
    var dataAxis = [];
    var data_total = [];
    var data_after_filter = [];
    var yMax = 0;
    var dataShadow = [];
    analysis.pattern.forEach(function (v) {
      if ((v.total + v.match) > yMax) {
        yMax = (v.total + v.match);
      }
      data_total.push(v.total);
      data_after_filter.push(v.match);
      dataAxis.push(v.content);
    });
    for (var i = 0; i < data_total.length; i++) {
      dataShadow.push(yMax);
    }

    var option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          label: {
            show: true
          }
        }
      },
    grid: {
      top: '1%',
      left: '25%',
      right: '1%',
      bottom: '1%'
    },
      yAxis: {
        data: dataAxis,
        axisLabel: {
       
          textStyle: {
          
          }
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        },
        z: 10
      },
      xAxis: {
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          textStyle: {
            color: '#999'
          }
        }
      },
      dataZoom: [
        {
          type: 'inside'
        }
      ],
      series: [
       
        {
          id: "pattern",
          name: '总数量',
          type: 'bar',
          barWidth: 16,//柱图宽度
          stack: 'two',
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  { offset: 0, color: '#83bff6' },
                  { offset: 0.5, color: '#188df0' },
                  { offset: 1, color: '#188df0' }
                ]
              )
            },
            emphasis: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  { offset: 0, color: '#2378f7' },
                  { offset: 0.7, color: '#2378f7' },
                  { offset: 1, color: '#83bff6' }
                ]
              )
            }
          },
          label: {
            normal: {
              show: true,
              position: 'inside'
            }
          },
          data: data_total,
          animation: animate
        },
        { // For shadow
          id: "filter_pattern",
          name: '过滤后数量',
          type: 'bar',
          itemStyle: {
            normal: { color: '#9ACD32' }
          },
          barWidth: 16,//柱图宽度
          stack: 'one',
    
      
          data: data_after_filter,
          label: {
            normal: {
              show: true,
              position: 'inside'
            }
          },
          animation: animate
        }
      ]
    };
    return option;

  },
  createVueNumberOption: function (analysis) {
    var data_total = [];
    var data_after_filter = [];
    analysis.vue.data.forEach(function (v) {
      data_total.push(v.total);
      data_after_filter.push(v.match);
    });
    var option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          label: {
            show: true
          }
        }
      },
      grid: {
        top: '10%',
        left: '13%',
        right: '13%',
        bottom:'17%'
      },
      xAxis: [
        {
          type: 'category',
          data: data_total
        }
      ],
      yAxis: [
        {
          type: 'value',
          data: data_total
        }
      ],
      dataZoom: [
        {
          show: true,
          start: 94,
          end: 100,
          height: 10,
          top: '93%'
        },
        {
          type: 'inside',
          start: 94,
          end: 100,
          height: 10,
          top: '93%'
        },
        {
          show: true,
          yAxisIndex: 0,
          filterMode: 'empty',
          width: 10,
          height: '80%',
          showDataShadow: false,
          left: '93%'
        }
      ],
      series: [
        {
          id:"number",
          name: '总数字',
          type: 'bar',
          data: data_total,
          label: {
            normal: {
              show: true,
              position: 'outside'
            }
          },
          animation: animate
        },
        {
          id: "filter_number",
          name: '过滤后',
          type: 'bar',
          data: data_after_filter,
          label: {
            normal: {
              show: true,
              position: 'outside'
            }
          }
          ,
          animation: animate
        }
      ]
    };
    return option;

  },
  createVueStringOption: function (analysis) {
    var data_total = [];
    var data_after_filter = [];
    var xAxisData = [];
    analysis.vue.data.forEach(function (v) {
      xAxisData.push(v.content);
      data_total.push(v.total);
      data_after_filter.push(v.match)

    });
    var itemStyle = {
      normal: {
      },
      emphasis: {
        barBorderWidth: 1,
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowColor: 'rgba(0,0,0,0.5)'
      }
    };
    var option = {
      backgroundColor: '#fff',
      tooltip: {},
      xAxis: {

        splitArea: { show: false }
      },
      yAxis: {

        data: xAxisData,
        name: '字符串值分析',
        silent: true,
        axisLine: { onZero: true },
        splitLine: { show: false },
        splitArea: { show: false }
      },
      grid: {
        left: 100,
        top:10
      },
      //visualMap: {
      //  type: 'continuous',
      //  dimension: 1,
      //  text: ['上限', '下限'],
      //  inverse: true,
      //  itemHeight: 200,
      //  calculable: true,
      //  min: -2,
      //  max: 6,
      //  top: 10,
      //  left: 10,
      //  inRange: {
      //    colorLightness: [0.4, 0.8]
      //  },
      //  outOfRange: {
      //    color: '#bbb'
      //  },
      //  controller: {
      //    inRange: {
      //      color: '#2f4554'
      //    }
      //  }
      //},
      series: [

        {

          id: "string",
          name: '总量',
          type: 'bar',
          stack: 'two',
          label: {
            normal: {
              show: true,
              position: 'inside'
            }
          },
          itemStyle: itemStyle,
          data: data_total,
          barWidth: 16,//柱图宽度
          animation: animate
        },
        {
          id: "filter_string",
          name: '过滤后数量',
          type: 'bar',
          stack: 'two',
          label: {
            normal: {
              show: true,
              position: 'inside'
            }
          },
          itemStyle: itemStyle,
          data: data_after_filter,
          barWidth: 16,//柱图宽度
          animation: animate
        }
      ]
    };
    return option;

  }
}
