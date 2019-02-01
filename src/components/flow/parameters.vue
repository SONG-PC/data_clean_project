<template>
  <div v-bind:style="{height:'auto',width:'100%','padding-left':(my_floor>=1)?'20px':'0px'}" class="parameters">
    <div v-if="my_floor>0" style="border-top:1px solid;border-left:1px  solid;border-right:1px   solid;color:lightsteelblue;border-top-left-radius:5px;border-top-right-radius:5px;margin-bottom:20px;width:100%;text-align:center"> 联级第{{my_floor}}层 </div>
    <div v-for="(parm,index) in parameters" v-bind:style="{'margin-top':(my_floor==1&&index>0)?'30px':'0px'}">
      <Input v-bind:floor="my_floor" v-if="parm.type=='input'" v-bind:node="node" v-bind:parameter="parm" />
      <InputPoint v-on:updateEndpoint="updateEndpoint" v-on:addEndpoint="addEndpoint" v-on:deleteEndpoint="deleteEndpoint" v-if="parm.type=='input_point'" v-bind:node="node" v-bind:endpoints="endpoints" v-bind:parameter="parm" />
      <OutInputPoint v-on:updateEndpoint="updateEndpoint" v-on:addEndpoint="addEndpoint" v-on:deleteEndpoint="deleteEndpoint" v-if="parm.type=='output_point'" v-bind:node="node" v-bind:endpoints="endpoints" v-bind:parameter="parm" />
      <Point v-bind:floor="my_floor" v-if="parm.type=='point'" v-bind:node="node" v-bind:endpoints="endpoints" v-bind:parameter="parm" />
      <Select v-bind:floor="my_floor" v-bind:node="node" v-bind:endpoints="endpoints" v-if="parm.type=='select'&&parm.configuration" v-bind:parameter="parm" />
    </div>

  </div>
</template>
<script>
  import Select from './select'
  import InputPoint from './inputPoint';
  import OutInputPoint from './outPoint';
  import Input from './input';
  import Point from './point'
  export default {
    created: function () {

    },
    mounted: function () {


    },
    data: function () {
      return {
      }
    },
    computed: {
      my_floor: function () {
        if (!isNaN(Number(this.floor)))
          return this.floor;
        else
          return 0;
      }

    },
    methods: {
      addEndpoint: function (payload) {

        this.$emit('addEndpoint', { node_id: payload.node_id, is_source: payload.is_source });
      }, deleteEndpoint: function (payload) {

        this.$emit('deleteEndpoint', { endpoint: payload.endpoint, node: payload.node });
      },
      updateEndpoint: function (payload) {

        this.$emit('updateEndpoint', payload);
      },
      addInputPoint: function (data) {
        this.node.jsPlumbNode.endpoint.push({
          "name": "song"
        });
        //console.log("12131");
        // this.$emit("addInputPoint", data)
      }
    },
    components: {
      Select, InputPoint, OutInputPoint, Point, Input 
    },
    props: ['parameters', 'node', 'endpoints', 'floor']
  }
</script>

