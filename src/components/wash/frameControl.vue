<template>
  <div>

    <div class="line" v-bind:style="{top:lineTop+'px',height:  lineHeight+'px',transition:'all 0.5s '}"></div>


  </div>
</template>

<script>

  import layer from 'vue-layer'
  import $ from 'jquery'
  import common from '../../assets/js/common.js';
  export default {
    created: function () {
      



    },
    computed: {
      lineHeight: function () {
        var start, end, height = 0;
        this.op_list.forEach(function (item, index, arr) {
        
          if (item.isAction && item.turn) {
            if (start == undefined) {
              start = index;
            }
            else {
              if (item.turn) {
                end = index
              }
            }

          }

        }.bind(this));
        for (var i = start; i < end; i++) {
         // if ((i + 1) <= end && this.op_list[i + 1].turn) {
            height += this.op_list[i].height+5;
        //  }
        }
     
        return height;
      },
      lineTop: function () {
        var start, top = 0;
        this.op_list.forEach(function (item, index, arr) {

          if (item.isAction && item.turn && start == undefined) {
            start = index
          }
          if (start == undefined) {
            top += item.height+ 12;
          }

        }.bind(this));
        console.log(start);
        return top + 63 * 0.5;
      }

    

    },
    mounted: function () {


    },
    methods: {
   
    },
    props:["op_list"],
    data: function () {
      return {
       

      }
    }
  };


</script>


