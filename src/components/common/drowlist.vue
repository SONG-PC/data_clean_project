<template>
  <transition name="fadex">
    <ul v-if="show" v-bind:style="{ transition: 'all .5s','border':'1px rgb(239,239,239) solid',position:'fixed', zIndex:'99999',backgroundColor:'#fff',width:'200px','height':'auto',marginLeft:left+'px',top:top+'px','border-bottom':'none','z-index':9999}">
      <li class="drowlist_li split"  style="    height:30px;
    line-height:30px;font-size:10px;width:100%;padding-left:15px" v-for="(item,idx) in list" v-on:click.stop="_action(idx)">
        {{item.desc}}
      </li>
    </ul>
  </transition>
</template>
<style>
  .fadex-enter-active, .fadex-leave-active {
    transition:all  .5s;
   
  }
  .drowlist_li:hover{
    color:#fff;
    background-color:yellowgreen
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
