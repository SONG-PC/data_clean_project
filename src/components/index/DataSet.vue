<template>
  <div style="width:100%;height:100%">
    <div class="tools">
      <tools v-on:cardOp="cardOrList" v-bind:card="isCard" />
    </div>
   
    <Task v-on:taskOp="taskOp" v-bind:mylist="list" v-if="isCard" />
    <autolist v-on:taskOp="taskOp" v-bind:mylist="list" v-if="!isCard" />
    <div style="position:absolute;bottom:7px;left:30px">
      <el-pagination background
                     layout="prev, pager, next"
                     :total="1000">
      </el-pagination>
    </div>
    <!--class="split_left split_top"-->
    <!--<div   style="position:absolute;height:90%;width:100%;overflow:hidden;padding-bottom:45px;">
    <autolist v-on:taskOp="taskOp" v-bind:mylist="list" v-if="!isCard"/>
    <card v-on:taskOp="taskOp"  v-bind:mylist="list" v-if="isCard" />
  </div>
  <div style="position:absolute;margin-top:-2px;font-size:19px; right:10px">
    <tools v-on:cardOp="cardOrList" v-bind:card="isCard" />
  </div>
  <div style="position:absolute;bottom:7px;left:30px">
    <el-pagination background
                   layout="prev, pager, next"
                   :total="1000">
    </el-pagination>
  </div>-->
  </div>
</template>

<script>
  import DML from '../../components/helper/DML'
  import inputTable from '../../components/setting/input_table'
  import Vue from 'vue'
  import layer from 'vue-layer'
  import Task from './Task'
  import autolist from './autoList'
  import card from './Card'
  import drowlist from '../common/drowlist'
  import tools from './tools'
  Vue.prototype.$layer = layer(Vue);
  export default {
    data: function () {
      return {
        isCard: true,
        list: [{
          id: 1,
          fileName: "data_pre_test1",
          data_type: "excel",
          steps: 36,
          hasResult: false,
          exeState: "action",
          schedule: 30,
          author: "song-pc",
          updateTime: "1分钟前",
          records: 1000
        },
        {
          id: 2,
          fileName: "data_base_oracle",
          data_type: "csv",
          steps: 16,
          hasResult: false,
          exeState: "noinit",
          schedule: 0,
          author: "song-pc",
          updateTime: "3分钟前",
          records: 3000
        },
        {
          id: 3,
          fileName: "sqlserver_task",
          data_type: "csv",
          steps: 26,
          hasResult: false,
          exeState: "stop",
          schedule: 0,
          author: "song-pc",
          updateTime: "6分钟前",
          records: 500
        }, {
          id: 4,
          fileName: "my_sql0001",
          data_type: "db",
          steps: 26,
          hasResult: true,
          exeState: "success",
          exeTime: '200ms',
          schedule: 100,
          author: "song-pc",
          updateTime: "16分钟前",
          records: 100
        },
        {
          id: 5,
          fileName: "hive_380920893",
          data_type: "csv",
          steps: 26,
          hasResult: false,
          exeState: "stop",
          schedule: 0,
          author: "song-pc",
          updateTime: "6分钟前",
          records: 500
        }, {
          id:6,
          fileName: "测试3",
          data_type: "db",
          steps: 26,
          hasResult: true,
          exeState: "success",
          exeTime: '200ms',
          schedule: 100,
          author: "song-pc",
          updateTime: "16分钟前",
          records: 100
        },
        {
          id: 7,
          fileName: "测试3",
          data_type: "csv",
          steps: 26,
          hasResult: false,
          exeState: "stop",
          schedule: 0,
          author: "song-pc",
          updateTime: "6分钟前",
          records: 500
        }
        ]
      }

    },
    methods: {
      taskOp: function (payload) {

        switch (payload.type) {
          case 'edit': this.$router.push({ path: '/flow' }); break;
          case 'delete': this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
           
          }).catch(() => {
           
          });
        ; break;
          case 'start': this.$message({
            message: '开启任务',
            type: 'success'
          }); break; 
          case 'stop': this.$message({
            message: '任务中止',
            type: 'warning'
          }); ; break;
        }

      },
      cardOrList: function () {

        this.isCard = !this.isCard;
      },
      add_dataset: function () {
        var _super = this;
        this.$refs.mychild._show({
          list: [{
            desc: "CSV,EXCEL文件", fn: function () {

              $("#file").trigger("click");
            }
          },
          {
            desc: "数据表", fn: function () {

              _super.$layer.iframe({
                content: {
                  content: inputTable, //传递的组件对象
                  parent: _super,//当前的vue对象
                  data: []//props,

                },

                area: ['600px', '436px'],
                title: "添加数据源"
              });

            }
          }],
          top: 27,
          left:19
        });

      }

    },
    components: { DML, drowlist, inputTable, autolist, tools, card, Task}

  }
</script>
