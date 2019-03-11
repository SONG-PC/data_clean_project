<template>
  <div class="setting conn">
    <label for="baseType">
      数据库类型:
    </label>
    <select name="baseType">
      <option v-for="item in dbType">{{item}}</option>
    </select>
    <label for="hostName">
      主机名称:
    </label>
    <input class="split" name="hostName"  placeholder="域名或IP地址" type="text" value="" />
    <label for="baseName">
      数据库名称:
    </label>
    <input class="split" name="baseName" placeholder="实例名称" type="text" value="" />
    <label for="port">
      端口号:
    </label>
    <input class="split" name="port"  placeholder="主机端口号" type="text" value="" />
    <label for="username">
      用户名:
    </label>
    <input class="split" name="username"  placeholder="数据库帐户" type="text" value="" />
    <label class="split" for="password">
      密码:
    </label>
    <input class="split" type="password" name="password" placeholder="数据库访问密码"  value="" />
    <div class="button" style="margin-top:0;">
      <button class="btn test" >测试</button>  <button class="btn confirm">添加</button>   <button class="btn cancel">清空</button>
    </div>
  </div>
</template>
<style>
  .conn input, .conn select {
    margin-bottom: 40px;
  }
  .conn label {
    margin-bottom: 40px;
    font-size:13px;
  }
</style>
<script>
  import database from '../../assets/js/global/global_database.js';
  export default {
    data: function () {

      return {
        dbType: database.database
      }
    }


  }
</script>
