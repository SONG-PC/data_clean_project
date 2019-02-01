<template>
  <div class="setting">
    <label for="filename">
      处理快照名称:
    </label>
    <input name="filename" type="text" value="0x21d331dwd3131313" />
    <label for="encoding">
      编码方式:
    </label>
    <select name="encoding">
      <option v-for="item in encoding">{{item}}</option>
    </select>
    <div class="button">
      <button class="btn confirm">保存</button>    <button class="btn cancel">取消</button>
    </div>
  </div>
</template>
<script>
  import database from '../../assets/js/global/global_database.js';

  export default {
    data: function () {
      return {
        encoding: database.encoding

      }
    }


  }
</script>
