<template>
  <div class="option clearfix">
    <label v-if="options.components.label" for="name" style="display: block;">
      {{options.components.label}}
    </label>
    <textarea v-bind:data-type="options.parm_type"  v-model="options.components.value"  name="name" class="control" type="text" v-bind:placeholder="options.components.placeholder">
    </textarea>
    <span class="error" style="display: block;"></span>
    <span v-if="options.components.desc" class="desc" style="display: block;"> {{options.components.desc}}</span>
  </div>

</template>
<script>
  import Valid from '../../assets/js/global/global_validate.js'
  export default {

    data: function () {

      return {
        default_value: null,
        error: null
      }
    },
    mounted: function () {
      this.default_value = this.options.components.value;
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

          this.error = null;
          return true;
        }
      },
      input: function () {
        this.valid();
      },
      reset: function () {

        this.options.components.value = this.default_value;
        this.valid();
      }

    },
    props: ['options'],
    name:"Textarea"
  }
</script>
