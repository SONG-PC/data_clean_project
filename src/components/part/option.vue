<template>
      <div class="content" data-name="test" >
        <div v-for="(item,index) in   option_data.parm" v-bind:data-name="item.parm_name" data-index="index" class="parm">
          <Input ref="mychild" v-if="item.components.tag=='input'" v-bind:options="item" />
          <Select ref="mychild" v-if="item.components.tag=='select'" v-bind:options="item" />
          <Areatext ref="mychild" v-if="item.components.tag=='textarea'" v-bind:options="item" />
        </div>
        <div style="clear:both"> </div>
        <div><button class="join" v-on:click="save">保存</button><button class="reset" v-on:click="reset">取消</button></div>
      </div>
</template>
<script>
  import Input from '../form/input'
  import Select from '../form/select'
  import Areatext from '../form/textarea'
  import common from '../../assets/js/common.js'
  export default {
    components: { Input, Select, Areatext },
    props: ['option_data'],
    methods: {
     save: function () {


      },
      reset: function () {

      }
    },
    name: "Option"
  };
</script>
