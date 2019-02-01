<template>
  <div>
    <el-date-picker v-model="value" style="margin-bottom:30px;"  value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="选择日期时间"
                    align="right"
                    :picker-options="pickerOptions">
    </el-date-picker>
    <div class="setting">
      <div class="button">
        <button class="btn confirm" v-on:click="confirm">输入</button>    <button class="btn cancel" v-on:click="close">不需要</button>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import layer from 'vue-layer'
  Vue.prototype.$layer = layer(Vue);
  export default {
    props: ['bind_data'],
    data: function () {
      return {

        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
        value: ''

     
        
      }
    },
    methods: {
      confirm: function () {
        this.bind_data(this.value);
        this.close();

      }, close: function () {
        this.$layer.closeAll();

      }

    }


  }
</script>
