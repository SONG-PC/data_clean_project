<template>
  <div class="clearfix" >
    

    <label v-if="parameter.label" for="name" style="display: block;">
      {{parameter.label}}
    </label>
    <select v-on:change="selectType($event)">
      <option v-bind:selected="!node.parameters[parameter.name]?'selected':''" value="">无</option>
      <option v-for="item in sourceEndpoints" v-bind:value="item.id" v-bind:selected="(node.parameters[parameter.name]&&node.parameters[parameter.name]==item.id)?'selected':''">{{item.name}}</option>
    </select>
  </div>

</template>
<script>
  import Valid from '../../assets/js/global/global_validate.js'
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
    data: function () {

      return {
        my_floor:0
      }
    },
    mounted: function () {
      console.log(this.node.parameters[this.parameter.name]);
    },
    computed: {
      sourceEndpoints: function () {
        var arry = [];
        var index = 0;
        this.endpoints.forEach(function (v) {
          if (v.isSource) {
            if (index > 0) {
              arry.push(v);
            }
            index++;
          }
        });
        return arry;
      }

    },
    methods: {
      selectType: function (e) {
        var value = e.target.value;
        var _super = this;
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
    props: ['endpoints', 'parameter', 'node','floor'],
    name: "Input"
  }
</script>
