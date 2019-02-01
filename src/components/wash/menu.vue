<template>
  <!--全局菜单元素-->
  <div id="menu" v-if="menu_data.length>0" v-bind:style="{ left:position_data.left, top:position_data.top  }">
    <ul>
      <li v-bind:class="{ highlight:item.highlight }" v-on:click="selet_one(index)" v-for="(item,index) in menu_data" data-index="index">
        <i v-if="item.highlight" style="display:inline-block;width:15px;height:100%;background-image:url(https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2174151210,532060572&fm=26&gp=0.jpg);background-position:center;background-size:12px 10px;background-repeat:no-repeat"></i>
        {{item.content}}<span class="count">{{item. probability}}</span><i v-if="item.seleted" style="display:inline-block;margin-left:15px;width:10px;height:100%;background-image:url(http://bpic.588ku.com/element_origin_min_pic/01/80/23/93574d67eccb0b0.jpg);background-position:center;background-size:10px 10px;background-repeat:no-repeat"></i>
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    props: ['menu_data', 'position_data'], mounted: function () {
   
    },
    data: function () {
      return {

      }
    },
    methods: {
      selet_one: function (index) {
   
        this.$emit('select-one', index);
    
      }
    },
    name: "Menu"
  };
</script>
