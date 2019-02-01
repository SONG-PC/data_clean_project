<template>
  <div style="position:relative;width:100%;height:100%;background-color:#fff;margin-top:0;padding-top:90px;padding-bottom:0px;">
    <div style="position:relative;margin-top:-90px;height:90px;">
      <div class="button" style="margin-top:10px;border-bottom:1px solid rgb(220,220,220);width:100%">
        <button class="btn confirm" style="width:120px;margin-left:20px;" v-on:click.stop="add_dataset">添加任务 +</button>
        <drowlist ref="mychild" />
      </div>
      <div class="setting " style="position:absolute;margin-top:10px;border-bottom:1px solid rgb(220,220,220);width:100%;height:36px;">

        <select style="width:150px;border-bottom:1px dashed green;margin-left:20px;">
          <option>今天</option>
          <option selected="selected">一周内</option>
          <option>一月内</option>
          <option>全部</option>
        </select>
      </div>
      <drowlist ref="mychild" />
    </div>
    <div style="position:absolute;height:100%;width:100%;"><autolist/></div>
    <input id="file" type="file" style="display:none"/>
  </div>
</template>

<script>
  import DML from '../../components/helper/DML'
  import inputTable from '../../components/setting/input_table'
  import Vue from 'vue'
  import layer from 'vue-layer'
  import autolist from './autoList'
  import drowlist from '../common/drowlist'
  Vue.prototype.$layer = layer(Vue);
  export default {
    methods: {

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
    components: { DML, drowlist, inputTable, autolist}

  }
</script>
