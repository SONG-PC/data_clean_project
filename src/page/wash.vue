<template>
 
  
    <!--页面内容-->
    <div class="wash_container" style="padding-top:74px">
      <!--中间-->
        
      <div class="mid">
        <exports />
        <InputFilter />
        <Grid />
       
      </div>
 
      <!--左边-->

        <div class="left">
     
       <App ></App>
       
       </div>
  
      <!--右边-->
 
        <div class="right"><FunctionList /><QualityAnalysis /></div>
 
    </div>
  
 
</template>

<script>
  import '../assets/css/css_rest.css'
  import '../assets/scss/wash_main.scss'
  import '../assets/scss/wash_setting.scss'
  import '../assets/scss/wash_menu.scss'
  import '../assets/scss/wash_section.scss'
  import Vue from 'vue'
  import App from '../components/wash/FunctionSection'
  import Grid from '../components/wash/dataTable'
  import InputFilter from '../components/wash/filter'
  import FunctionList from '../components/wash/functionList'
  import QualityAnalysis from '../components/wash/qualityAnalysis'
  //主页面样式
  import sectionGroup from '../components/wash/sectionGroup'
  import exports from '../components/wash/exports'
  import store from '../vuex/store'
  import $ from 'jquery'

  export default {
    store: store,
    beforeCreate: function () {
     
    },
    destroyed: function () {
      this.$store.commit("setFilters", null);

    },
    mounted: function () {

      this.$store.dispatch("getWashTask");
    
    },
    methods: {
    
    },
    components: { FunctionList, QualityAnalysis, InputFilter, Grid, App, sectionGroup, exports},
    data: function () {
      return {
        card: window.Bus.card,
          card_segment: window.Bus.card_segment
      }

    }


}
  </script>
