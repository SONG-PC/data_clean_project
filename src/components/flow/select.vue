<template>
  <div class="option clearfix" v-bind:style="{'padding-left':(my_floor==1)?'62px':'0px','padding-right':(my_floor==1)?'62px':'0px'}">
    <label v-if="parameter.label" for="name" style="display: block;">
      {{parameter.label}}
    </label>
    <select v-on:change="selectType($event)" name="name" class="control" type="text">
      <option v-bind:selected="p.value==(node.parameters[parameter.name]||parameter.default)?'selected':''" v-for="p in parameter.configuration.values" v-bind:value="p.value">{{p.label}}</option>
    </select>
    <span class="error" style="display: block;"></span>
    <span v-if="parameter.desc" class="desc" style="display: block;"> {{parameter.desc}}</span>
    <Parameters v-bind:floor="my_floor" v-bind:node="node" v-bind:endpoints="endpoints" v-if="getParameters" v-bind:parameters="getParameters" />
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
      selectType: function (e) {
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
          onError: errorHandler(_super),
          onSuccess: errorHandler(_super),
          extraData: { method: "put", obj: "Node" }
        });
      }

    },
    computed: {

      getParameters: function () {
        var obj = null;
        this.parameter.configuration.values.forEach(function (v) {

          if (v.value == this.node.parameters[this.parameter.name] && v.parameters && v.parameters.length > 0) {
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
    props: ['parameter', 'node', 'endpoints', 'floor'],
    name: "Select"
  }
</script>
