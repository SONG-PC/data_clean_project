<template>
  <!--页面内容-->
  <transition name="tabs">
    <div class="flow-taskInfo">
      <div class="taskname">Task_104258610329589</div>

      <div class="taskInfo">

        <div class="run">
          <div class="item">
            <div class="txt">
              当前状态:执行中
            </div>
            <div class="content">
              <i style="font-size:40px;" class="el-icon-loading"></i>
            </div>
          </div>
          <div class="item">
            <div class="txt">
              任务进度
            </div>
            <div class="content">
              <el-progress color="yellowgreen" :width="49" :stroke-width=3.6 type="circle" :percentage="30"></el-progress>
            </div>

          </div>
          <div class="item">
            <div class="txt">
              执行条数
            </div>
            <div class="content">
              13857条
            </div>
          </div>
          <div class="item">
            <div class="txt">
              读取速率
            </div>
            <div class="content">
              1MB/S
            </div>
          </div>
          <div class="item">
            <div class="txt">
              写入速率
            </div>
            <div class="content">
              0.96MB/S
            </div>
          </div>
          <div style="clear:both;"></div>

        </div>

        <div class="count">
          <div class="number"></div>
          <div class="graph"><canvas id="realtime" style="border:1px solid rgb(239,239,239);width:100%;height:100%">
             </canvas> </div>
        </div>
        <div class="log">
          <div class="debugInfo">

          </div>
        </div>
        <div style="clear:both;"></div>
      </div>
    </div>
  </transition>

</template>

<script>
  import realtime from '../../assets/js/global/global_realtime_line'

  export default {

    mounted: function () {


      realtime("realtime");


    },
    destroyed: function () {

    },
    updated: function () {

    },
    computed: {

    },
    methods: {


    },
    data: function () {
      return {
  
      }
    }
  }

</script>
