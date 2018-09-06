<template>
  <div class="option clearfix">
    <label v-if="options.components.label" for="name" style="display: block;">
      {{options.components.label}}
    </label>
    <select v-bind:data-type="options.parm_type" name="name" class="control" type="text">
      <option v-for="p in options.components.data" v-bind:value="p.value">{{p.key}}</option>
    </select>
    <span class="error" style="display: block;"></span>
    <span v-if="options.components.desc" class="desc" style="display: block;"> {{options.components.desc}}</span>
  </div>

</template>
<script>
  export default {
    props: ['options'],
    name:"Select"
  }
</script>
