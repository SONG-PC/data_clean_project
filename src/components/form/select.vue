<template>
  <div class="option clearfix">
    <label v-if="options.components.label" for="name" style="display: block;">
      {{options.components.label}}
    </label>
    <select v-bind:data-type="options.parm_type" v-on:change="change"  v-model="options.components.value"  name="name" class="control" type="text">
      <option v-for="p in data" v-bind:value="p.value">{{p.key}}</option>
    </select>
    <span class="error" style="display: block;"></span>
    <span v-if="options.components.desc" class="desc" style="display: block;"> {{options.components.desc}}</span>
  </div>

</template>
<script>
  import common from '../../assets/js/common.js'
  import Valid from '../../assets/js/global/global_validate.js'
  export default {
    mounted: function () {
      var data = this.options.components.data,value = this.options.components.value;
      if (typeof (data) == "string") {
        data = common.getDataByString(this.options.components.data);
      }
      else if (!(data instanceof Array)) {
        console.error("select组件接收了非预期的数据");
        return;
      }
      if (data) {
        this.data = data;
        if (!this.options.components.value) {
          this.default_value = this.options.components.value= this.data[0].value;
  
        }
        else {
          this.default_value = this.options.components.value;
        }
      }
      this.valid();

    },
    methods: {
      valid: function () {

        if (!Valid.validateByType(this.options.components.value, this.options.parm_type)) {
          if (!this.options.components.value) {
            this.error = "请输入一个有效值";
          }
          else {
            this.error = "不是一个有效的" + this.options.parm_type + "值";
          }
          return false;
        }
        else {
          console.log("valid")
          this.error = null;
          return true;
        }
      },
      change: function () {
        this.valid();
      },
      reset: function () {

        this.selected = this.options.components.value = this.default_value;
        this.valid();
      }
    },
    data: function () {
      return {
        data: [],
        default_value:null
      }
    },
    props: ['options'],
    name:"Select"
  }
</script>
