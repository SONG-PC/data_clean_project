<template>
  <div class="option clearfix" v-bind:style="{'padding-left':(my_floor==1)?'62px':'0px','padding-right':(my_floor==1)?'62px':'0px'}">
    <label v-if="parameter.label" for="name" style="display: block;">
      {{parameter.label}}
    </label>
    <input  v-on:input="input" v-on:change="update($event)"  v-bind:value="node.parameters[parameter.name]"  class="control" type="text" v-bind:placeholder="parameter.description">
  </div>

</template>
<script>
  import Valid from '../../assets/js/global/global_validate.js'
  import common from '../../assets/js/common.js';
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
    data: function () {

      return {
        my_floor: 0
      }
    },
    created: function () {
      this.my_floor = (this.floor + 1);
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
      update: function (e) {
        var _super = this;
        var value = e.target.value;
        var parameters = $.extend(true, {}, this.node.parameters);
        parameters[this.parameter.name] = value;
        this.$store.dispatch("flowOpRest", {
          data: {
            type: "update_node",
            update_data: {
              id: this.node.id,
              parameters: parameters
            },
          },
          onError: function () {
            e.target.value = _super.parameter.value || "";
            errorHandler(_super).apply(this, arguments);
          },
          onSuccess: errorHandler(_super),
          extraData: { method: "put", obj: "Node" }
        });
      }

    },
    props: ['parameter', 'node',  'floor'],
  }
</script>
