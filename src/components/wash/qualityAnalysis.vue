<template>

  <!--右边下半部分(质量分析）-->
  <div class="right-bottom" >

    <!--分析类型-->
    <ul class="tabs">
    <li  class="active" v-on:click="tab(0)">冗余性</li>
    <li  v-on:click="tab(1)">模式</li>
    <li  v-on:click="tab(2)">数值</li></ul>
    <!--质量分析报表-->
    <div id="container" style="overflow:scroll">
      <div id="canvas" v-bind:style="{height:chartsHeight}">
      </div>
    </div>
  </div>
</template>
<script>

  import echarts from 'echarts';
  import $ from 'jquery';
  import Vue from 'vue'
  var myChart;
  var data = [
    [[28604, 77, 17096869, 'Australia', 1990], [31163, 77.4, 27662440, 'Canada', 1990], [1516, 68, 1154605773, 'China', 1990], [13670, 74.7, 10582082, 'Cuba', 1990], [28599, 75, 4986705, 'Finland', 1990], [29476, 77.1, 56943299, 'France', 1990], [31476, 75.4, 78958237, 'Germany', 1990], [28666, 78.1, 254830, 'Iceland', 1990], [1777, 57.7, 870601776, 'India', 1990], [29550, 79.1, 122249285, 'Japan', 1990], [2076, 67.9, 20194354, 'North Korea', 1990], [12087, 72, 42972254, 'South Korea', 1990], [24021, 75.4, 3397534, 'New Zealand', 1990], [43296, 76.8, 4240375, 'Norway', 1990], [10088, 70.8, 38195258, 'Poland', 1990], [19349, 69.6, 147568552, 'Russia', 1990], [10670, 67.3, 53994605, 'Turkey', 1990], [26424, 75.7, 57110117, 'United Kingdom', 1990], [37062, 75.4, 252847810, 'United States', 1990]],
    [[44056, 81.8, 23968973, 'Australia', 2015], [43294, 81.7, 35939927, 'Canada', 2015], [13334, 76.9, 1376048943, 'China', 2015], [21291, 78.5, 11389562, 'Cuba', 2015], [38923, 80.8, 5503457, 'Finland', 2015], [37599, 81.9, 64395345, 'France', 2015], [44053, 81.1, 80688545, 'Germany', 2015], [42182, 82.8, 329425, 'Iceland', 2015], [5903, 66.8, 1311050527, 'India', 2015], [36162, 83.5, 126573481, 'Japan', 2015], [1390, 71.4, 25155317, 'North Korea', 2015], [34644, 80.7, 50293439, 'South Korea', 2015], [34186, 80.6, 4528526, 'New Zealand', 2015], [64304, 81.6, 5210967, 'Norway', 2015], [24787, 77.3, 38611794, 'Poland', 2015], [23038, 73.13, 143456918, 'Russia', 2015], [19360, 76.5, 78665830, 'Turkey', 2015], [38225, 81.4, 64715810, 'United Kingdom', 2015], [53354, 79.1, 321773631, 'United States', 2015]]
  ];

  var option = [{
    grid: {
      top: 30,
      bottom: 5
    },
    backgroundColor: new echarts.graphic.RadialGradient(0, 0,0, [{
      offset: 0,
      color: '#ffff'
    }, {
      offset: 1,
      color: '#cdd0d5'
    }]),

    legend: {
      right: 10,
      data: ['1990', '2015']
    },
    xAxis: {
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    yAxis: {
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      },
      scale: true
    },
    series: [{
      name: '1990',
      data: data[0],
      type: 'scatter',
      symbolSize: function (data) {
        return Math.sqrt(data[2]) / 9e2;
      },
      label: {
        emphasis: {
          show: true,
          formatter: function (param) {
            return param.data[3];
          },
          position: 'top'
        }
      },
      itemStyle: {
        normal: {
          shadowBlur: 10,
          shadowColor: 'rgba(120, 36, 50, 0.5)',
          shadowOffsetY: 5,
          color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
            offset: 0,
            color: 'rgb(251, 118, 123)'
          }, {
            offset: 1,
            color: 'rgb(204, 46, 72)'
          }])
        }
      }
    }, {
      name: '2015',
      data: data[1],
      type: 'scatter',
      symbolSize: function (data) {
        return Math.sqrt(data[2]) / 9e2;
      },
      label: {
        emphasis: {
          show: true,
          formatter: function (param) {
            return param.data[3];
          },
          position: 'top'
        }
      },
      itemStyle: {
        normal: {
          shadowBlur: 10,
          shadowColor: 'rgba(25, 100, 150, 0.5)',
          shadowOffsetY: 5,
          color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
            offset: 0,
            color: 'rgb(129, 227, 238)'
          }, {
            offset: 1,
            color: 'rgb(25, 183, 207)'
          }])
        }
      }
    }]
  },
    {
      title: {


      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        top: 30,
        bottom:0
      },
      xAxis: {
        type: 'value',
        position: 'top',
        splitLine: { lineStyle: { type: 'dashed' } },
      },
      yAxis: {
        type: 'category',
        axisLine: { show: false },
        axisLabel: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        data: [
          'Abb',
          'aabb',
          'AA-BB-CC',
          'aa-Bb-cc',
          'b baaa b',
          'b baaa b',
          'b baaa b',
          'b baaa b',
          'b baaa b'
          ]
      },
      series: [
        {
          itemStyle: {
            normal: {
     
              color: "#4682B4"
          
            }
          },
          name: '',
          type: 'bar',
          textAlign: 'left',
          barWidth: 22,
          stack: '',
          label: {
            normal: {
           
              show: true,
              formatter: '{b}'
            }
          },
          data: [

           1,
            5,
           3,
           9,
            10,
            10,
            10,
            10,
            10
          ]
        }
      ]
    },
    {
      grid: {
        top: 30,
        bottom: 5
      },
      tooltip: {},
      animationDurationUpdate: 1500,
      animationEasingUpdate: 'quinticInOut',
      series: [
        {
          type: 'graph',
          layout: 'none',
          symbolSize: 33,
          roam: true,
          label: {
            normal: {
              show: true
            }
          },
          edgeSymbol: ['circle', 'arrow'],
          edgeSymbolSize: [4, 10],
          edgeLabel: {
            normal: {
              textStyle: {
                fontSize: 10
              }
            }
          },
          data: [{
            name: '节点1',
            x: 300,
            y: 300
          }, {
            name: '节点2',
            x: 800,
            y: 300
          }, {
            name: '节点3',
            x: 550,
            y: 100
          }, {
            name: '节点4',
            x: 550,
            y: 500
          }],
          // links: [],
          links: [{
            source: 0,
            target: 1,
            symbolSize: [5, 20],
            label: {
              normal: {
                show: true
              }
            },
            lineStyle: {
              normal: {
                width: 5,
                curveness: 0.2
              }
            }
          }, {
            source: '节点2',
            target: '节点1',
            label: {
              normal: {
                show: true
              }
            },
            lineStyle: {
              normal: { curveness: 0.2 }
            }
          }, {
            source: '节点1',
            target: '节点3'
          }, {
            source: '节点2',
            target: '节点3'
          }, {
            source: '节点2',
            target: '节点4'
          }, {
            source: '节点1',
            target: '节点4'
          }],
          lineStyle: {
            normal: {
              opacity: 0.9,
              width: 2,
              curveness: 0
            }
          }
        }
      ]
    }
  ];
  export default {
    data: function () {
      return {
        op_index: 0,
        chartsHeight:"100%"


      }
    },
    mounted: function () {
      var dom = document.getElementById("canvas");
      var con = $(".right-bottom .tabs");
      con.delegate("li", "click", function () {
        con.find("li").removeClass("active");
        $(this).addClass("active");   
      })
      myChart =echarts.init(dom);
     
      $(window).resize(function () {
        //当浏览器大小变化时
        myChart && myChart.resize();

      });
     

      myChart.setOption(option[this.op_index]);
    },
    methods: {
      tab: function (model_idx) {
        myChart.off("click");
        if (option[model_idx]) {
          if (model_idx == 1 && this.op_index != model_idx) {
            this.chartsHeight = "350px";
            myChart.on('click', function (param) {
              Vue.set(window.Bus, "filterlist", [param.name]);

              // console.log()
            });
          }
          else {
            this.chartsHeight = "100%";
          }
          Vue.nextTick(function () {
            this.op_index == model_idx ? false : (myChart.resize(),myChart.clear(), this.op_index = model_idx, myChart.setOption(option[this.op_index]));

          }.bind(this));
        
        
        }

      }
    },
    name:"QualityAnalysis"
  }

</script>
