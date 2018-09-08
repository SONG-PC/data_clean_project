<template>
  <div class="section_container">
    <div class="section_group">
      <div class="list">
        <div class="tabs"><span>任务号</span></div>
        <div class="tabs"><span>项目编号</span></div>
        <div class="tabs"><span>开始时间</span></div>
        <div class="tabs"><span>项目周期</span></div>
        <div class="tabs"><span>结束时间</span></div>

      </div>

    </div>
    <div class="more">...</div>
    <div style="clear:both"></div>
  </div>
</template>
<script>

  import NS from '../../assets/js/global/global_scoller'
  export default {
    mounted: function () {
      new NS(".section_group", ".list");
    },
    name: "sectionGroup"
  }

</script>
