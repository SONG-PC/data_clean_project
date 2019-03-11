<template>
  <!--<div class="task">-->
    <transition-group  name="listtask"  tag="div" class="task">
      <div class="card" key="create_new">
        <div class="create_task"><button>新增任务+</button></div>
      </div>
      <div class="card" v-on:dblclick="taskOp('edit')" v-on:mouseover="showImg(index)" v-on:mouseleave="hideImg(index)" v-for="(item,index) in list"  v-bind:key="index">
        <div class="content split">
          <div class="img">
            <img class="view" v-bind:src="example[index%5]" />
          </div>
          <div class="title">
            {{item.fileName}}
          </div>
          <div class="info">
            <div>
              <i class="el-icon-edit-outline"></i>

              <span>{{ item.author}}</span>
            </div>
            <div>
              <i class="el-icon-share"></i>
              <span>{{  item.steps}}个 步骤</span>
            </div>
            <div>
              <i class="el-icon-time"></i>
              <span> {{item.updateTime}} 更新 </span>
            </div>

          </div>
        </div>

        <div class="state">
          <div v-if="item.exeState=='action'||item.exeState=='stop'||item.exeState=='success'" class="action">
            <div class="des">
              <p v-if="item.exeState=='action'" class="running">正在执行</p>
              <p v-if="item.exeState=='stop'" class="error">任务出错</p>
              <p v-if="item.exeState=='success'" class="success">执行完毕</p>
              <p>全量数据</p>
            </div>
            <div class="progress">
              <el-progress color="yellowgreen" :width="49" :stroke-width=3.6 type="circle" :percentage="item.schedule"></el-progress>
            </div>

            <div style="clear:both"></div>
          </div>
          <div v-else-if="item.exeState=='noinit'" class="edit">
            <button>去完善</button>
          </div>

        </div>
      </div>

  </transition-group>
</template>
<style>
  .el-icon-my-user {
    background-image: url('../../resourse/user.jpg') center no-repeat;
    background-size: 12px 12px;
  }

  .listtask-item {
    display: inline-block;
    margin-right: 10px;
  }

  .listtask-enter-active, .listtask-leave-active {
    transition: all .5s;
  }

  .listtask-enter, .listtask-leave-to
  /* .list-leave-active for below version 2.1.8 */ {
    opacity: 0;
    transform: translateY(20px);
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
      setTimeout(function () {
        this.list = this.mylist;
      }.bind(this), 0)
 
    },
    methods: {
      showImg: function (index) {
        $(".img").eq(index).css("height","150px")
      },
      hideImg: function (index) {
        $(".img").eq(index).css("height", "0px")
      },
      taskOp: function(type, index) {

        this.$emit("taskOp", { type: type, index: index });
    }
    },
    data: function () {

      return {
        list:[],
        example: [
        e1,e2,e3,e4,e4
        ]

      }

    },
    props: ["mylist"],
    components: { }

  }

</script>
