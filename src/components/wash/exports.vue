<template>

  <div class="setting" style="position:relative;border:1px dashed rgb(242,242,242)">
    <!--<button class="export" v-on:click.stop="open_file( $event)">导出 <span style="margin-left:10px;">∨</span></button>-->
    <!--<input ref="file" type="file" style="display:none"/>-->
    <drowlist ref="mychild" />
    <div style="position:absolute;float:left;line-height:50px;font-size:0px;">
      <i class="example1"></i>
      <i class="example2"></i>
      <i class="example3"></i>
      <i class="example4"></i>
      <i class="example5"></i>
    </div>
    <div class="gear" style="position:absolute" v-on:click="open_setting"></div>
    <div style="clear:both">

    </div>
  </div>
</template>
<style>
  .vl-notify{
    margin-left:-59px;

  }
    .vl-notify .select {
      line-height: 30px;
      list-style: none;
      position: relative;
    }

      .vl-notify .select li {
        height: 30px;
      }

        .vl-notify .select li:hover {
          background-color: aliceblue;
        }
</style>
<script>
  import Vue from 'vue'
  import layer from 'vue-layer'
  import drowlist from '../common/drowlist'
  import flatfile from '../setting/flatfile'
  import dataSetting from '../setting/dataSetting'
  Vue.prototype.$layer = layer(Vue);
  export default {
    methods: {
      open_setting: function () {


        this.$layer.iframe({
          content: {
            content: dataSetting, //传递的组件对象
            parent: this,//当前的vue对象
            data: []//props,

          },

          area: ['600px', '300px'],
          title: "当前设置"
        });


      },
      open_file: function (event) {
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


           
              }
            }],
          top: 37,
          left: 10
        });
      }
    },
    components: { drowlist, flatfile, dataSetting}

  }
</script>
