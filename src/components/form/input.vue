<template>
  <div class="option clearfix">
    <label v-if="parameter.label" for="name" style="display: block;">
      {{parameter.label}}
    </label>
    <input v-on:input="input" v-on:change="update"   v-model="parameter.value" v-bind:data-type="parameter.type" name="name" class="control split" type="text" v-bind:placeholder="parameter.description">
    <!--<span v-if="error" class="error" style="display: block;">{{error}}</span>-->
  </div>

</template>
<script>
  import Valid from '../../assets/js/global/global_validate.js'
  import common from '../../assets/js/common.js';
  export default {
    data: function () {

      return {
        default_value:null,
        error: null
      }
    },
    mounted: function () {
  

    },
    methods: {
      valid: function () {
      
      },
      input: function () {
      
      },
      reset: function () {

        
      },
      update: function () {
        this.$emit('updateOp');
      }

    },
    props: ['parameter','parameters'],
  }
</script>
