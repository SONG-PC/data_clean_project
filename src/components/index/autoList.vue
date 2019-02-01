<template>
  <div>
    <ul class="auto_list">
      <li class="head">
        <div class="col1" style="width:20%">名称</div>
        <div class="col2" style="width:10%">创建者</div>
        <div class="col3" style="width:10%">更新时间</div>
        <div class="col4" style="width:10%">总行数</div>
        <div class="col5" style="width:10%">执行函数</div>
        <div class="col5" style="width:10%">任务进度</div>
        <div class="col6" style="width:30%"></div>
      </li>
      <li class="data" v-for="(item,index) in list" v-on:contextmenu="menu">
        <div class="col1" style="width:20%">
          <i v-bind:class="[item.data_type]"></i>
          {{item.fileName}}
        </div>
        <div class="col2" style="width:10%">
          {{item.author}}
        </div>
        <div class="col3" style="width:10%">
          {{item.updateTime}}
        </div>
        <div class="col4" style="width:10%">
          {{item.records}}
        </div>
        <div class="col5" style="width:10%">
          {{item.steps}}
        </div>
        <div class="col5" style="width:10%">
          <div v-if="item.exeState=='action'" class="schedule"><div style="padding:0;line-height:10px;height:10px;width:30%;background-color:#b6be00;text-align:right;">30%</div></div>
          <div v-else-if="item.exeState=='noinit'" class="noinit">编辑中</div>
          <div v-else-if="item.exeState=='stop'" class="stop">已终止</div>
          <div v-else-if="item.exeState=='success'" class="suc">执行成功:耗时{{item.exeTime}}</div>
        </div>
        <div class="col6" style="width:30%;padding-left:60px;">
          <button v-bind:class="{action:true,stop:(item.exeState=='action'),start:(item.exeState=='noinit'),replay:(item.exeState=='success')||(item.exeState=='stop')||(item.exeState=='compelete')}" v-bind:title="action_txt(index)"></button> <router-link to="wash"><button title="处理" class="edit"></button></router-link><button v-if="item.hasResult" v-on:click.stop="exportResult(index,$event)" title="导出" class="export"></button><button title="删除" v-on:click="deleteOne.stop(index,$event)" class="delete"></button>
        </div>
      </li>

    </ul>
     <drowlist  ref="mychild" />
  </div>
</template>

<script>
  import Vue from 'vue'
  import layer from 'vue-layer'
  Vue.prototype.$layer = layer(Vue);
  import drowlist from '../common/drowlist'
  import flatfile from '../setting/flatfile'
  import Mapping from '../setting/Mapping'

  export default {
    data: function(){

      return {
        list: [{
          fileName: "测试1",
          data_type:"excel",
          steps: 36,
          hasResult: false,
          exeState:"action",
          schedule: "30%",
          author: "song-pc",
          updateTime: "1分钟前",
          records:1000
        },
          {
            fileName: "测试2",
            data_type: "csv",
            steps: 16,
            hasResult: false,
            exeState: "noinit",
            schedule: "0%",
            author: "song-pc",
            updateTime: "3分钟前",
            records: 3000
          },
          {
            fileName: "测试3",
            data_type: "csv",
            steps: 26,
            hasResult: false,
            exeState: "stop",
            schedule: "0%",
            author: "song-pc",
            updateTime: "6分钟前",
            records: 500
          }, {
            fileName: "测试3",
            data_type: "db",
            steps: 26,
            hasResult: true,
            exeState: "success",
            exeTime:'200ms',
            schedule: "0%",
            author: "song-pc",
            updateTime: "16分钟前",
            records: 100
          }]

      }



    },
    methods: {
      menu: function (e) {
        var _super= this;
        this.$refs.mychild._show({
          list: [{
            desc: "流程控制", fn: function () {
              _super.$router.push({ path: '/flow' })
             
            }
          },
          ],
          top: e.clientY- $(".auto_list").offset().top,
          left: e.clientX - $(".auto_list").offset().left
        });

      },
      action_txt: function (idx) {
   
        if (this.list[idx].exeState == "action") {
          return '终止任务'
        }
        else if (this.list[idx].exeState == "noinit") {
          return '开始任务'

        }
        else if (this.list[idx].exeState == "stop" || this.list[idx].exeState == "failed" || this.list[idx].exeState == "compelete" || this.list[idx].exeState == "success") {
          return '重新执行'

        }


    },
    exportResult: function (idx, e) {
      var _super = this;
 
      this.$refs.mychild._show({
        list: [{
          desc: "CSV格式", fn: function () {

            _super.$layer.iframe({
              content: {
                content: flatfile, //传递的组件对象
                parent: _super,//当前的vue对象
                data: []//props,

              },

              area: ['600px', '366px'],
              title: "导出为CSV格式文件"
            });
          }
        },
        {
          desc: "数据表", fn: function () {

            _super.$layer.iframe({
              content: {
                content: Mapping, //传递的组件对象
                parent: _super,//当前的vue对象
                data: []//props,

              },

              area: ['600px', '536px'],
              title: "导出为数据表"
            });

          }
        }],
        top: $(e.target).offset().top - $(".auto_list").offset().top+52 ,
        left: $(e.target).offset().left - $(".auto_list").offset().left
      });

    },
    deleteOne: function (idx) {


    }

    },
    components: {
      drowlist,
      Mapping,
      flatfile

    }

  }

</script>
