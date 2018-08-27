
<template>
  <!--数据表-->
  <div id="myGrid">

  </div>
</template>
<style>
  .slick-header-menu {
    border: 1px solid #718BB7;
    background: #f0f0f0;
    padding: 5px;
    -moz-box-shadow: 2px 2px 2px silver;
    -webkit-box-shadow: 2px 2px 2px silver;
    z-index: 20;
  }


  .slick-header-menuitem {
    padding: 2px 5px 2px 5px;
    border: 1px solid transparent;
    border-radius: 3px;
  }

    .slick-header-menuitem:hover {
      border-color: silver;
      background: white;
    }

  .slick-header-menuitem-disabled {
    border-color: transparent !important;
    background: inherit !important;
  }

  /*.icon-help {
    background-image: url(../assets/plugins/SlickGrid-master/images/help.png);
  }*/
</style>
<script>
  import grid from '../assets/js/global/global_grid'
  import common from '../assets/js/common.js'
  import Vue from 'vue'
  export default {
    mounted: function () {


      var columns = [
        { id: "index", name: "#", field: "index", isIgonore: true },
        { id: "title", name: "任务号", field: "title", quality: common.getRandomByRank(60, 100) },
        { id: "duration", name: "项目周期", field: "duration",  quality: common.getRandomByRank(60, 100) },
        { id: "%", name: "% 完成", field: "percentComplete", quality: common.getRandomByRank(60, 100) },
        { id: "start", name: "开始时间", field: "start", quality: common.getRandomByRank(60, 100) },
        { id: "finish", name: "结束时间", field: "finish", quality: common.getRandomByRank(60, 100) },
        { id: "effort-driven", name: "已结束", field: "effortDriven",  quality: common.getRandomByRank(60, 100) }
      ];
      var data = [];
      //随机生成模拟数据
      for (var i = 0; i < 2000000; i++) {
        data[i] = {
          index: i + 1,
          title: "Task " + i,
          duration: "5 天",
          percentComplete: Math.round(Math.random() * 100),
          start: "01/01/2009",
          finish: "01/05/2009",
          effortDriven: (i % 5 == 0)
        };
      }
      var my_grid = new grid("#myGrid", data, columns);

      Vue.set(window.Bus, "columns", columns);
    
    },
    name: "Grid"
  }
</script>
