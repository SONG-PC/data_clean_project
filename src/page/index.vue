<template>


  <!--页面内容-->
  <div class="index-container">
    <div class="right">
      <div class="nav">
        {{txt}}
      </div>
      <transition name="tabs">
        <DataSet v-if="menu[0].isActive" />

      </transition>
      <transition name="tabs">
        <DataBase v-if="menu[1].isActive" />

      </transition>
    </div>
    <div class="left">
      <ul>
        <li v-for="(item,index) in menu" v-bind:class="{active:item.isActive}" v-on:click="tab(index)">
          <div v-bind:class="['icon',item.icon] ">

          </div>
          <div class="txt">{{item.name}}</div>

        </li>

      </ul>
    </div>

  </div>


    </template>
<style>

  .tabs-enter-active {
    transition: all .1s;
    opacity: 1;
  }
  .tabs-leave-active {
    opacity: 0;
    transition: all .0s;
  }
  .tabs-enter, .tabs-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
    transform: translateX(100%)
  }

</style>
    <script>
      import '../assets/scss/index.scss'
      import DataBase from '../components/index/DB'
      import DataSet from '../components/index/DataSet'
      import Vue from 'vue'
      import store from '../vuex/store'
      export default {
        store: store,
        mounted: function () {

          setTimeout(function () {

            this.$store.commit('loading');

          }.bind(this), 2000)

        },
        data: function () {
          return {
            txt: "任务处理",
            menu:[  {
                name: "任务处理",
                isActive: true,
                icon: "data_entity"

              }, {
                name: "数据源",
                isActive: false,
                icon: "database"

              }]
          }
        },
        methods: {
          tab: function (index) {
            var _super = this;
            this.menu.forEach(function (v, k) {

              if (k == index) {
                setTimeout(function () {
                  v.isActive = true;
                }, 100);
                _super.txt = v.name;
              }
              else {
                v.isActive = false;
              }


            })
          

          }
        },
        components: {
          DataBase, DataSet

        }


      }
      </script>
