<template>
  <!--全局菜单元素-->
  <transition name="menulist">
    <div id="menu" v-if="menu_data.length>0" v-bind:style="{ left:position_data.left, top:position_data.top  }">

      <ul>
        <li v-if="item.type=='field'" v-bind:class="{ highlight:item.highlight,field:true }" v-on:mousedown.stop="doNoThing" v-on:click.stop.prevent="selet_one(index)" v-for="(item,index) in menu_data" data-index="index">
          <i v-if="item.highlight" style="display:inline-block;width:15px;height:100%;background-image:url(https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2174151210,532060572&fm=26&gp=0.jpg);background-position:center;background-size:12px 10px;background-repeat:no-repeat"></i>
          {{item.content}}<span class="count">{{item. probability}}</span><i v-if="item.seleted" style="display:inline-block;margin-left:15px;width:10px;height:100%;background-image:url(http://bpic.588ku.com/element_origin_min_pic/01/80/23/93574d67eccb0b0.jpg);background-position:center;background-size:10px 10px;background-repeat:no-repeat"></i>
        </li>
        <li v-if="item.type=='input_text'" v-bind:class="{ highlight:item.highlight,text:true }" v-on:mousedown.stop="doNoThing" v-on:click.stop.prevent="doNoThing" v-for="(item,index) in menu_data" data-index="index">
          <input v-on:change="rename($event)" style="width:100%;font-size:12px;height:100%;border:none;outline:none;" type="text" v-bind:placeholder="item.placeholder" />
        </li>
      </ul>

    </div>
  </transition>
</template>
<style>

  .menulist-enter-active, .menulist-leave-active {
    transition: all 0s;

  }

  .menulist-enter, .menulist-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
   
  }
</style>
<script>
  import $ from 'jquery'
  export default {
    props: ['menu_data', 'position_data'], mounted: function () {
   
    },
    data: function () {
      return {

      }
    },
    methods: {
      doNoThing: function () {

      },
      selet_one: function (index) {
   
        this.$emit('select-one', index);
    
      },
      rename: function (e) {
        var changeValue = e.currentTarget.value;

        if ($.trim(changeValue)) {
          this.$emit('rename', changeValue);
        }
      }
    },
    name: "Menu"
  };
</script>
