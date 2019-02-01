<template>
  <div class="setting">
    <div style="margin-bottom:10px;">
      <label style="width:100%">数据源:</label>
      <br />
      <select style="width:400px;margin-bottom:0px;">
        <option selected="selected">sys</option>
      </select>
   
      <button class="btn normal" v-on:click="create_conn">新建</button>   <button class="btn normal" v-on:click="create_sql">生成SQL语句</button>
     
    </div>
    <label>SQL语句</label>
    <br />
    <textarea style="width:100%;height:200px;">
 select * from table
</textarea>

    <div class="button">
  <button class="btn confirm">添加</button>   <button class="btn test" v-on:click="preview">预览</button>
    </div>
  </div>
</template>
<script>
  import conn from './connSetting.vue'
  import pre_view from '../preview/table'
  import DML from '../helper/DML'
  import Vue from 'vue'
  import layer from 'vue-layer'
  Vue.prototype.$layer = layer(Vue);
  export default {
    methods: {
      create_conn: function () {
        var _super = this;
        _super.$layer.iframe({
          content: {
            content: conn, //传递的组件对象
            parent: _super,//当前的vue对象
            data: []//props,

          },

          area: ['888px', '700px'],
          title: "新建数据源"
        });

      },
      preview: function () {

         var _super = this;
        _super.$layer.iframe({
          content: {
            content: pre_view, //传递的组件对象
            parent: _super,//当前的vue对象
            data: []//props,

          },

          area: ['600px', '260px'],
          title: "tb_user"
        });
      },
      create_sql: function () {

        var _super = this;
        _super.$layer.iframe({
          content: {
            content: DML, //传递的组件对象
            parent: _super,//当前的vue对象
            data: []//props,

          },

          area: ['500px', '500px'],
          title: "生成SQL语句"
        });

      }


    },
    components: { DML, conn}
  }
</script>
