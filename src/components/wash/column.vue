<template>
  <div class="option clearfix"  >
    <label v-if="parameter.label" for="name" style="display: block;">
      {{parameter.label}}
    </label>
    <select v-model="parameter.value" v-on:change="update">
      <option v-bind:value="empty">无</option>
      <option v-if="!item.primary" v-for="(item,index) in col_list" v-bind:value="item.id">{{item.name}}</option>
    </select>
  </div>

</template>
<script>
  import Valid from '../../assets/js/global/global_validate.js'
  import common from '../../assets/js/common.js';
  export default {
    created: function () {
      this.my_floor = (this.floor + 1);
    
    },
    data: function () {

      return {
        my_floor:0
      }
    },
    mounted: function () {
     
   
    },
    computed: {
      col_list: function () {
        var col_list = this.$store.state.col_metadata.col_data;
 
        return col_list;
      },
      empty: function () {
        if (!this.parameter.value)
          return this.parameter.value
      }

    },
    methods: {
      update: function () {

        this.$emit('updateOp');
      }

    },
    props: ["parameter","parameters"],
    name: "column"
  }
</script>
