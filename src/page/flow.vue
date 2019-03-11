<template>
  <!--页面内容-->
  <div class="single-task-container" style="width:100%;height:100%;">
    <el-menu style="position:fixed;top:5px;left:10px;width:50%;z-index:9999;" class="el-menu-demo" mode="horizontal" default-active="0">
      <a href="JavaScript:history.go(-1)">
        <el-menu-item index="-1">
          <i style="display:inline" class="el-icon-back"></i>返回

        </el-menu-item>
      </a>
      <el-menu-item index="0" v-on:click="tab(0)">
        <i style="display:inline" class="el-icon-share"></i>流程管理

      </el-menu-item>

      <el-menu-item index="1" v-on:click="tab(1)">
        <i style="display:inline" class="el-icon-document"></i>
        任务信息
      </el-menu-item>

    </el-menu>
    <flow v-if="tab_index==0"></flow>
    <task  v-if="tab_index==1"></task>
  </div>

</template>
<style>
  .list-complete-item {
    transition: all .5s;
    display: inline-block;
  }

  .list-complete-enter, .list-complete-leave-to
  /* .list-complete-leave-active for below version 2.1.8 */ {
    opacity: 0;
  }
</style>
<script>
  import flow from '../components/flow/flowContent'
  import task from '../components/flow/taskInfo'
  import store from '../vuex/store'
  import '../assets/scss/flow.scss'
  import '../assets/scss/flow_mana.scss'
  export default {
    store: store,
    components: {
      flow, task
    },
    mounted: function () {
    


     

    },
    destroyed: function () {

    },
    updated: function () {

    },
    computed: {
   
    },
    methods: {
      tab: function (index) {
        this.tab_index = index;
      }

    },
    data: function () {
      return {
        tab_index:0
      }
    }
  }

</script>
