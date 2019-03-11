<template>
  <div>
    <el-tooltip class="item" effect="dark" content="搜索任务" placement="bottom">
      <i style="margin-right:20px;cursor:pointer" class="el-icon-search"></i>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="排序" placement="bottom">
      <i style="margin-right:20px;cursor:pointer" class="el-icon-sort"></i>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="切换显示模式" placement="bottom">
      <i v-on:click="carOp" style="margin-right:20px;cursor:pointer" v-bind:class="[card?'el-icon-menu':'el-icon-tickets']"></i>
      </el-tooltip>
  </div>
</template>

<script>
  import $ from 'jquery';
 
  export default {
    mounted: function () {
     
    },
    methods: {
      carOp: function () {

        this.$emit("cardOp")
      }
    },
    data: function () {

      return {

      }
    },
    props: ['card'],
    components: { }

  }

</script>
