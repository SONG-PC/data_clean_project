<template>
  <div class="setting">
    <label for="baseType">
      数据库类型:
    </label>
    <select name="baseType">
      <option v-for="item in dbType">{{item}}</option>
    </select>
    <label for="hostName">
      主机名称:
    </label>
    <input name="hostName"  placeholder="域名或IP地址" type="text" value="" />
    <label for="baseName">
      数据库名称:
    </label>
    <input name="baseName" placeholder="实例名称" type="text" value="" />
    <label for="port">
      端口号:
    </label>
    <input name="port"  placeholder="主机端口号" type="text" value="" />
    <label for="username">
      用户名:
    </label>
    <input name="username"  placeholder="数据库帐户" type="text" value="" />
    <label for="password">
      密码:
    </label>
    <input name="password" placeholder="数据库访问密码" type="text" value="" />
    <div class="button" style="margin-top:100px;">
      <button class="btn test" >测试</button>  <button class="btn confirm">添加</button>   <button class="btn cancel">清空</button>
    </div>
  </div>
</template>
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
