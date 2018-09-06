<template>
  <div class="option clearfix">
    <label v-if="options.components.label" for="name" style="display: block;">
      {{options.components.label}}
    </label>
    <textarea v-bind:data-type="options.parm_type" name="name" class="control" type="text" v-bind:placeholder="options.components.placeholder">
    </textarea>
    <span class="error" style="display: block;"></span>
    <span v-if="options.components.desc" class="desc" style="display: block;"> {{options.components.desc}}</span>
  </div>

</template>
<script>
  export default {


    props: ['options'],
    name:"Textarea"
  }
</script>
