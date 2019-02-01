<template>
  <transition name="fadex">
    <ul v-if="show" v-bind:style="{ transition: 'all .5s','border':'1px rgb(220,220,200) solid',position:'absolute', zIndex:'99999',backgroundColor:'#fff',width:'200px','height':'auto',marginLeft:left+'px',top:top+'px'}">
      <li  style="    height:30px;
    line-height:30px;font-size:10px;color:rgb(90,90,90);width:100%;padding-left:15px;border-bottom:1px solid rgb(240,240,240);border-left:1px solid rgb(240,240,240);border-right:1px solid rgb(240,240,240)" v-for="(item,idx) in list" v-on:click.stop="_action(idx)">
        {{item.desc}}
      </li>
    </ul>
  </transition>
</template>
<style>
  .fadex-enter-active, .fadex-leave-active {
    transition:all  .5s;
   
  }

  .fadex-enter, .fadex-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0.1;
    transform:translateY(-25px)
  }

</style>
<script>
  import $ from 'jquery'
  export default {
    data: function () {
      return {
        show: false,
        list: [],

        left: 0,
        top:0
      }
    },
    mounted: function () {
      var _super = this;
      $(document).on("mousedown", function () {
   
        _super.show = false;
      })

    },
    methods: {
      _show: function (options) {
       
        this.list = options.list;
        this.show = true;
        this.top = options.top;
        this.left = options.left;
      },
      _action: function (idx) {
        this.list[idx].fn && this.list[idx].fn();
      },
      _hide: function() {
        this.show = false;
      }
    }
  }

</script>
