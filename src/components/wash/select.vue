<template>
  <div class="option clearfix" >
    <label v-if="parameter.label" for="name" style="display: block;">
      {{parameter.label}}
    </label>
    <select v-on:change="update" v-model="parameter.value" name="name" class="control" type="text">
      <option  v-for="p in parameter.configuration.values" v-bind:value="p.value">{{p.label}}</option>
    </select>
    <span class="error" style="display: block;"></span>
    <span v-if="parameter.desc" class="desc" style="display: block;"> {{parameter.desc}}</span>
    <FnParameters  v-bind:op="op" v-on:updateOp="updateOp"  v-bind:floor="my_floor"  v-bind:parameters="getParameters" />
  </div>

</template>
<script>
  import common from '../../assets/js/common.js'
  var errorHandler = function (caller) {

    return function (message, type, desc) {
      caller.$notify({
        title: desc,
        message: message,
        type: type
      });
    }

  }
  export default {
    created: function () {
      this.my_floor = (this.floor + 1);
    },
    mounted: function () {


    },
    methods: {
      update: function () {
        this.$emit('updateOp');
      },
      updateOp: function (payload) {

        this.$emit('updateOp');
      }

    },
    computed: {

      getParameters: function () {
        var obj = null;
        this.parameter.configuration&&this.parameter.configuration.values.forEach(function (v) {

          if (v.value == (this.parameter.value || this.parameter.default)) {
            obj = v.parameters;
          }
        }.bind(this));
   
        return obj;


      }
    },
    data: function () {
      return {
        my_floor: 0

      }
    },
    props: ['parameter', 'floor','parameters','op'],
    name: "Select"
  }
</script>
