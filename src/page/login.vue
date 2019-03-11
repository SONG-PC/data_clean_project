<template>
  <div class="login_container" >
    <div class="menu" style="position:absolute;right:10px;top:20px">
      <el-menu  class="el-menu-demo" mode="horizontal" style="background-color:transparent;" >
        <el-menu-item index="1" style="background-color:transparent;">系统教程</el-menu-item>
        <el-submenu index="2" style="background-color:transparent;">
          <template slot="title">
         更新记录
          </template>
          <el-menu-item index="2-1">选项1</el-menu-item>
          <el-menu-item index="2-2">选项2</el-menu-item>
          <el-menu-item index="2-3">选项3</el-menu-item>
          <el-submenu index="2-4">
            <template slot="title">
              选项4
            </template>
            <el-menu-item index="2-4-1">选项1</el-menu-item>
            <el-menu-item index="2-4-2">选项2</el-menu-item>
            <el-menu-item index="2-4-3">选项3</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-menu-item index="3" disabled style="background-color:transparent;">消息中心</el-menu-item>
        <el-menu-item index="4" style="background-color:transparent;"><a >团队信息</a></el-menu-item>
      </el-menu>
    </div>
    <div class="login_panel">
      <div class="logo" style="text-align:center"><i id="logo" style="background-position:center;height:90px;width:220px;display:inline-block;background-size:220px 90px;"></i></div>
      <div style="width:50%;margin-left:25%;">
        <el-input placeholder="请输入用户名"
                  suffix-icon="el-icon-my-user">
        </el-input>
        <el-input type="password" style="margin-top:20px" placeholder="请输入密码"
                  suffix-icon="el-icon-my-passowrd">

        </el-input>
      </div>
      <div v-on:click="login" style="width:50%;margin-left:25%;margin-top:20px;">  <el-button style="width:100%" type="primary">登陆</el-button></div>
      <div class="line"></div>
      <div style="width:50%;margin-left:25%;margin-top:30px;text-align:center">
        <el-row >
       
          <el-button type="primary" icon="el-icon-edit" circle size="medium"></el-button>
          <el-button type="success" icon="el-icon-check" circle size="medium"></el-button>
          <el-button type="info" icon="el-icon-message" circle size="medium"></el-button>
          <el-button type="warning" icon="el-icon-star-off" circle size="medium"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="medium"></el-button>
        </el-row>
      </div>
    </div>
    <vue-particles style="position:absolute;width:100%;z-index:-1;height:100%" color="#01A9DB"
                   :particleOpacity="0.5"
                   :particlesNumber="100"
                   shapeType="circle"
                   :particleSize="4"
                   linesColor="#BDBDBD"
                   :linesWidth="1"
                   :lineLinked="true"
                   :lineOpacity="0.4"
                   :linesDistance="150"
                   :moveSpeed="2"
                   :hoverEffect="true"
                   hoverMode="grab"
                   :clickEffect="false"
                   clickMode="push"
                   class="lizi">
    </vue-particles>
  </div>
</template>
<style>
  /* remove canvas default margin */
  body{
    width:100%;
    height:100%;

  }
  .login_panel .line {

    width: 50%;
    margin-left: 25%;
    margin-top: 20px;
    height: 1px;
    margin-top: 40px;
    background-color: rgb(230,230,230);
  }
  .el-icon-my-user {
    background: url('../resourse/user.jpg') center no-repeat;
    background-size: 20px 20px;
  }
  .el-icon-my-passowrd {
    background: url('../resourse/password.png') center no-repeat;
    background-size: 20px 20px;
  }
  .login_container{
    position:fixed;
    background-color:#fff;
    z-index:9999;
    margin:0;
    width:100%;
    height:100%;

    top:0;
  }
  .login_panel {
    width: 500px;
    height: 400px;
    position: fixed;
    top: 50%;
    left: 50%;
    margin-left: -250px;
    margin-top: -200px;
    /*box-shadow: 0px 0px 19px #444;
    -o-box-shadow: 0px 0px 19px #444;
    -webkit-box-shadow: 0px 0px 19px #444;
    -moz-box-shadow: 0px 0x 19px #444;*/
  }

</style>
<script>
  import Vue from 'vue'
  import $ from 'jquery'
  import logo from '../resourse/LOGO.png'
      export default {
        mounted: function () {
          $(".login_container #logo").css("background-image", "url('" +logo+"')")
        },
        data: function () {
          return {
         
          }
        },
    methods: {
      login: function () {
        window.login = true;
        this.$router.push({ path: '/index' })
      }
        },
        components: {
         
        }


      }
</script>
