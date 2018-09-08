<template>
      <div class="content" data-name="test" >
        <div v-for="(item,index) in   option_data.parm" v-bind:data-name="item.parm_name" data-index="index" class="parm">
          <Input ref="mychild" v-if="item.components.tag=='input'" v-bind:options="item" />
          <Select ref="mychild" v-if="item.components.tag=='select'" v-bind:options="item" />
          <Areatext ref="mychild" v-if="item.components.tag=='textarea'" v-bind:options="item" />
        </div>
        <div style="clear:both"> </div>
        <div><button class="join" v-on:click="save">保存</button><button class="reset" v-on:click="reset">还原</button></div>
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
    data: function () {
      return {
        default_value: null
      }
    },
    methods: {
      save: function () {
        var isAllowed = true;
        this.$refs.mychild.forEach(function (item, index) {
          if (!item.valid()) {
            isAllowed = false;
          }
        });
        if (isAllowed) {
          this.$emit("refresh_order");
        }
      },
      reset: function () {
        this.$refs.mychild.forEach(function (item, index) {
          item.reset();
        })   
      }
    },
    name: "Option"
  };
</script>
