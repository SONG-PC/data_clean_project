<template>

  <!--右边下半部分(质量分析）-->
  <div class="right-bottom"  >

    <!--分析类型-->
    <ul id="chartTabs" class="tabs  split">
    <li  class="active" v-on:click="tab(0)">内容</li>
    <li  v-on:click="tab(1)">模式</li>
    </ul>
    <!--质量分析报表-->
    <div id="container" style="overflow-y:auto" >
      <div v-if="!analysisData" style="width:100%;height:100%;position:relative">
        <div style="width:100%;color:lightslategray;font-size:13px;text-align:center;position:absolute;top:50%;margin-top:-7.5px;">
          当前视图选择暂无分析数据
        </div>
      </div>
      <div id="canvas" v-bind:style="{'width':'100%','height':canvasHeight}">

      </div>
    </div>
  </div>
</template>
<script>

  import echarts from 'echarts';
  import $ from 'jquery';
  import Vue from 'vue'
  var st = null;
  import GlobalEachart from '../../assets/js/global/global_echart'
  var Mock = require('mockjs');
  var getRenderDataBySelecte = function (_super) {
    //目前版本仅单列选择情况有分析数据
    var analysis = _super.$store.state.col_metadata.col_analysis;
    if (analysis && Object.keys(analysis).length > 0) {
     
      if (window.Bus.gridPoint.myGrid&&window.Bus.gridSelected && window.Bus.gridSelected.length == 1 && window.Bus.gridSelected[0].toCell <= window.Bus.gridSelected[0].fromCell) {

        var col_id = window.Bus.gridPoint.myGrid.columns[window.Bus.gridSelected[0].fromCell].id;
        _super.col_id = col_id;
        _super.analysisData = analysis[col_id];
     
      }
      else {
        _super.col_id = null;
        _super.analysisData = null
      }
    }
    else {
      _super.col_id = null;
      _super.analysisData = null
    }


  }
  export default {
    created: function () {

      window.Bus.$watch('gridSelected', function (newValue, oldValue) {
        this.myChart.clear();
        getRenderDataBySelecte(this);
        setTimeout(function () {
          this.renderCanvas();
        }.bind(this), 0);
     
      }.bind(this))
      //当分析数据有变化时更新
      this.$watch('$store.state.col_metadata.col_analysis', function (newValue, oldValue) {
        this.myChart.clear();
        getRenderDataBySelecte(this);
        setTimeout(function () {
          this.renderCanvas();
        }.bind(this), 0)
      }.bind(this));
    },
    data: function () {
      return {
        tabs: 0,
        col_id:null, 
        myChart:null,
        gridSelected: null,
        analysisData: null,
        canvasHeight: "100%"
      }
    },
    mounted: function () {
      var dom = document.getElementById("canvas");
      //var con = $(".right-bottom .tabs");
      //con.delegate("li", "click", function () {
      //  con.find("li").removeClass("active");
      //  $(this).addClass("active");   
      //})
      this.myChart =echarts.init(dom);
      this.myChart.on('click', function (param) {
        var isCtrl = param.event.event.ctrlKey;
        var op;
        if (param.seriesId == "number" || param.seriesId == "string" || param.seriesId == "filter_number" || param.seriesId == "filter_string") {
          op = this.$store.getters.getOpBySign("=");
        }
        else {
          op = this.$store.getters.getOpBySign(":");
        }
        var col = this.$store.getters.getColByColid(this.col_id);
        window.Bus.filterPoint.addFilterForOtherPage(col, op, param.data, isCtrl);
        //var filterNode = [{
        //  node: {
        //    id: this.col_id
        //  },
        //  value: this.$store.getters.getColByColid(this.col_id).name

        //},
        //{
        //  node: {
        //    data_type: op.code
        //  },
        //  value: op.sign
        //},
        //  {
        //    node: {
        //      type: "parm"
        //    },
        //    value: param.data
        //  }]
        //var filter = {
        //  id: Mock.Random.guid(),
        //  filterNode: filterNode,
        //  child: []
        //}
        //if (isCtrl) {
        //  if (window.Bus.filterPoint.filterlist.length > 0) {
        //    window.Bus.filterPoint.filterlist[window.Bus.filterPoint.filterlist.length - 1].child.push(filter.filterNode);
        //    window.Bus.filterPoint.updateFilter();
        //    window.Bus.filterPoint.refreshBar();
        //  }
        //  else {
        //    window.Bus.filterPoint.filterlist.push(filter);
        //  }
        //}
        //else {
        //  window.Bus.filterPoint.filterlist.push(filter);
        //}

      }.bind(this));
      $(window).resize(function () {
        //当浏览器大小变化时
        this.myChart && this.myChart.resize();

      });
      setTimeout(function () {
        this.renderCanvas();
      }.bind(this), 0)
 
    },
    methods: {
      tab: function (index) {
        $("#chartTabs li").removeClass("active");
        $("#chartTabs li").eq(index).addClass("active");
        this.tabs = index;
        this.renderCanvas();

      },
      renderCanvas: function () {
        $("#canvas").css("display", "none");
        if (this.analysisData && this.myChart) {
          var option;
          if (this.tabs == 0) {
            if (this.analysisData.vue.type == 'string') {
              option = GlobalEachart.createVueStringOption(this.analysisData);
              this.canvasHeight = 26 * this.analysisData.vue.data.length + 'px';
              //this.canvasHeight = '100%';
            }
            else if (this.analysisData.vue.type == 'number') {
              this.canvasHeight = '100%';
              option = GlobalEachart.createVueNumberOption(this.analysisData);
            }
            else {
              this.canvasHeight = '100%';
            }
          }
          else if (this.tabs == 1) {
            option = GlobalEachart.createPatternOption(this.analysisData, echarts);
            this.canvasHeight = 52 * this.analysisData.pattern.length + 'px';
          }
          st && clearTimeout(st);
          this.myChart.clear();
          st = setTimeout(function () {
            $("#canvas").css("display", "block");
           if (option) {
             this.myChart.resize();
         
             this.myChart.setOption(option);
            }


         }.bind(this), 1000)
        
        }
      }
    },
    name:"QualityAnalysis"
  }

</script>
