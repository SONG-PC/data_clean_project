<template>
  <div class="card" style="height:100%;overflow:auto" >
    <div  v-for="(item,index) in mylist" class="card_item" style="position:relative;background-color:#fff">
      <div class="split">
        <img v-bind:src="example[(index%5)]" style="width:100%;border-radius:5px;height:117px;margin-top:0px;" />

      </div>
      <div >
        <div style="position:absolute;height:20px;bottom:-30px;width:100%;text-align:center;font-size:13px;font-weight:600">
          <i class="el-icon-news"></i> <span style="font-weight:500">{{item.fileName}}</span>
        </div>
        <div style="position:absolute;height:20px;right:5px;top:5px;text-align:center;font-size:10px;">
          <div v-if="item.exeState=='action'" class="schedule" style="height:12px;margin-top:5px;width:100px"> <div style="line-height:10px;height:10px;width:30%;background-color:#b6be00;text-align:right;color:#fff;font-size:10px;">30%</div></div>
          <el-tag style="" v-else-if="item.exeState=='noinit'" type="info" size="small">编辑中</el-tag>
          <el-tag style="color:red" size="small" v-else-if="item.exeState=='stop'" type="danger">任务报错</el-tag>
          <el-tag style="color:#b6be00" size="small" v-else-if="item.exeState=='success'" type="success">执行成功,耗时200MS</el-tag>
        </div>
        <div style="position:absolute;height:20px;right:10px;bottom:2px;text-align:center;font-size:16px;">

          <el-tooltip v-if="item.exeState=='action'" class="item" effect="dark" content="停止任务" placement="bottom">
            <i style="margin-right:10px" v-on:click="taskOp('stop',index)" class="el-icon-loading"></i>
          </el-tooltip>
          <el-tooltip v-if="item.exeState!='action'" class="item" effect="dark" content="运行任务" placement="bottom">
            <i style="margin-right:10px" v-on:click="taskOp('start',index)" class="el-icon-caret-right"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="编辑任务" placement="bottom">
            <i style="margin-right:10px" v-on:click="taskOp('edit',index)" class="el-icon-setting"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除任务" placement="bottom">
            <i v-on:click="taskOp('delete',index)" class="el-icon-delete"></i>
          </el-tooltip>
        </div>
        <div style="position:absolute;height:20px;left:10px;bottom:0px;text-align:center;font-size:10px;">
          <i  class="el-icon-edit-outline"></i>
          <span>song-pc</span>
        </div>
      </div>
    </div>
    <div style="clear:both"></div>
  </div>
</template>
<style>
  .el-icon-my-user {
    background-image: url('../../resourse/user.jpg') center no-repeat;
    background-size: 12px 12px;
  }


  .list-completetask-item {
    transition: all .5s;
    display: inline-block;
  }

  .list-completetask-enter, .list-completetask-leave-to
  /* .list-complete-leave-active for below version 2.1.8 */ {
    opacity: 0;
  }
</style>
<script>
  import $ from 'jquery';
  import e1 from '../../resourse/exp1.jpg'
  import e2 from '../../resourse/exp2.jpg'
  import e3 from '../../resourse/exp3.jpg'
  import e4 from '../../resourse/exp4.jpg'
  export default {
    mounted: function () {

    },
    methods: {
      taskOp: function(type, index) {

        this.$emit("taskOp", { type: type, index: index });
    }
    },
    data: function () {

      return {
        example: [
        e1,e2,e3,e4,e4
        ]

      }

    },
    props: ["mylist"],
    components: { }

  }

</script>
