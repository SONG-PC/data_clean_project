<template>

  <!--右边下半部分(质量分析）-->
  <div class="right-bottom">

    <!--分析类型-->
    <ul class="tabs">
    <li class="active">冗余性</li>
    <li>模式</li>
    <li>数值</li></ul>
    <!--质量分析报表-->
    <div id="container"></div>
  </div>
</template>
<script>

  import echarts from 'echarts';
  import $ from 'jquery';
  export default {
    mounted: function () {
      var dom = document.getElementById("container");
      var con = $(".right-bottom .tabs");
      con.delegate("li", "click", function () {
        con.find("li").removeClass("active");
        $(this).addClass("active");   
      })
      var myChart =echarts.init(dom);
     
      $(window).resize(function () {
        //当浏览器大小变化时
        myChart && myChart.resize();

      });
      var option = {
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '直接访问',
            type: 'bar',
            barWidth: '60%',
            data: [10, 52, 200, 334, 390, 330, 220]
          }
        ]
      };

      myChart.setOption(option );
    },
    name:"QualityAnalysis"
  }

</script>
