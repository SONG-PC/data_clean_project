<template>


  <!--页面内容-->
  <div class="index-container">
    <el-menu style="position:fixed;top:5px;left:270px;width:50%;z-index:9999;"  class="el-menu-demo" mode="horizontal" default-active="0" >
      <el-menu-item v-on:click="tab(index)" v-for="(item,index) in menu" v-bind:key="index" v-bind:index="index.toString()">
        <i style="font-size:15px;" v-bind:class="[item.icon] ">

        </i>{{item.name}}
      </el-menu-item>
   
    </el-menu>

    <div class="navi">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">[切换帐号]</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">任务处理</a></el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <transition name="tabs">
        <DataSet class=" " v-if="menu[0].isActive" />
      </transition>
      <transition name="tabs">
        <DataBase class=" " v-if="menu[2].isActive" />
      </transition>
    </div>
    <!--<div class="right"  style="padding-bottom:196px;">
    <div class="nav " style="font-size:14px;height:45px;color:gray;line-height:45px;background-color:#fff">
     /{{txt}}
    </div>
    <div  style="border-radius:10px;margin-top:30px;width:95%;margin-left:2.5%;padding-top:10px;height:100%;background-color:#fff">
      <transition name="tabs">
        <DataSet class=" " v-if="menu[0].isActive" />

      </transition>
      <transition name="tabs">
        <DataBase class=" " v-if="menu[2].isActive" />

      </transition>
    </div>
  </div>
  <div class="left"  >
    <ul class="split_top"  >
      <li   v-for="(item,index) in menu" v-bind:class="{active:item.isActive,split:true,'split_right':true}" v-on:click="tab(index)">
        <i style="font-size:20px;" v-bind:class="[item.icon] ">

        </i>
        <div class="txt">{{item.name}}</div>

      </li>

    </ul>
  </div>-->

  </div>


    </template>

    <script>
      import '../assets/scss/index.scss'
      import DataBase from '../components/index/DB'
      import DataSet from '../components/index/DataSet'
      import Vue from 'vue'
      import store from '../vuex/store'
      export default {
        store: store,
        mounted: function () {

       

        },
        data: function () {
          return {
            txt: "任务处理",
            menu:[  {
                name: "任务处理",
                isActive: true,
              icon: "el-icon-bell"

            }, {
                name: "最近编辑",
                isActive: false,
                icon: "el-icon-time"

              }, {
                name: "数据源",
                isActive: false,
                icon: "el-icon-tickets"

              }, {
                name: "回收站",
                isActive: false,
                icon: "el-icon-delete"

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
