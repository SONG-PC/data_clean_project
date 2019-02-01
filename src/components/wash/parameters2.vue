<template>
  <div v-bind:style="{height:'auto',width:'100%','padding-left':(my_floor>=1)?'20px':'0px','padding-right':(my_floor==0)?'20px':'0px'}" class="parameters">
    <!--<div v-if="my_floor>0" style="border-top:1px solid;border-left:1px  solid;border-right:1px   solid;color:lightsteelblue;border-top-left-radius:5px;border-top-right-radius:5px;margin-bottom:20px;width:100%;text-align:center"> 联级第{{my_floor}}层 </div>-->
    <div v-for="(parm,index) in parameters" v-bind:style="{'margin-top':(my_floor==0&&index>0)?'12px':'0px','padding-left':(my_floor==0)?'62px':'0px','padding-right':(my_floor==0)?'62px':'0px'}" >
      <FnSelect  v-on:updateOp="updateOp"  v-if="parm.type=='select'" v-bind:floor="my_floor" v-bind:parameter="parm" v-bind:parameters="parameters"   v-bind:op="op"/>
      <Input   v-on:updateOp="updateOp"  v-if="parm.type=='string'||parm.type=='regex'||parm.type=='integer'" v-bind:floor="my_floor" v-bind:parameter="parm" v-bind:parameters="parameters"  />
      <Column  v-on:updateOp="updateOp"  v-if="parm.type=='column'" v-bind:floor="my_floor" v-bind:parameter="parm"  v-bind:parameters="parameters" />
    </div>

  </div>
</template>
<script>
  import Input from '../form/input.vue'
  import FnSelect from './select.vue'
  import Column from '../wash/column.vue'
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
      updateOp: function () {
        if (this.op) {
          this.$emit('updateOp', { current_op_id: this.op.id, previous_op_id: null });
        }
      }
    },
    components: {
      Input, FnSelect,Column
    },
    props: ['parameters', 'floor','op']
  }
</script>

