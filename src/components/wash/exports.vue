<template>

  <div class="setting split" style="position:relative;margin-bottom:10px;border-radius:5px;">
    <!--<button class="export" v-on:click.stop="open_file( $event)">导出 <span style="margin-left:10px;">∨</span></button>-->
    <!--<input ref="file" type="file" style="display:none"/>-->
    <drowlist ref="mychild" />
    <div style="height:40px;position:absolute;float:left;line-height:40px;font-size:0px;">
      <i v-on:click="addfn(index)" v-for="(item,index) in  shortcutFnList" v-bind:class="['example'+((index)%5+1),'split_right']"></i>
      <!--<i class="example2"></i>
    <i class="example3"></i>
    <i class="example4"></i>
    <i class="example5"></i>-->
    </div>
    <a href="JavaScript:history.go(-1)">
      <div class="out" style="position:absolute"></div>
      </a>
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
  import columnFilter from './columnFilter'
  Vue.prototype.$layer = layer(Vue);
  export default {
    computed: {
      shortcutFnList: function () {

       return   this.$store.getters.getShortcutFnList();

      }
    },
    methods: {
      addfn: function (index) {
        window.Bus.fnlistPoint.unready_list.push($.extend(true, {}, this.shortcutFnList[index]));
      },
      open_setting: function () {


        this.$layer.iframe({
          content: {
            content: columnFilter, //传递的组件对象
            parent: this,//当前的vue对象
            data: []//props,

          },
          area: ['600px', '500px'],
          title: "当前设置"
        });


      }
     
    },
    components: { drowlist, flatfile, columnFilter}

  }
</script>
