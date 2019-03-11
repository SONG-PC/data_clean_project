<template>
  <div class="setting colfilter" >
    <div style="width:100%;padding-bottom:16px;border-bottom:1px dashed rgb(239,239,239)">
      <label class="lbl" for="filename" style="font-weight:500;color:grey;font-size:16px">
        列可见性
      </label>
    </div>
    <table>
      <tr>
        <th>是否可见</th>
        <th>列名</th>
        <th>类型</th>
      </tr>
      <tr v-for="(item,index) in col_list">
        <td v-on:click="turn(index)">
          <i v-if="!item.isFilter" class="eye"></i>
          <p v-if="item.isFilter">---</p>
        </td>
        <td>{{item.name}}</td>
        <td>{{item.data_type_name}}</td>
      </tr>    
    </table>
  </div>
</template>
<style>
  .colfilter table, .colfilter table tr th, .colfilter table tr td {
    border: 1px solid rgb(230,230,230);
    margin-top: 31px;
    font-size:12px;
    text-align:center;
    vertical-align: central;
    line-height: 20px;
    padding: 5px 15px 5px 15px;
    color: grey
  }
    .colfilter table{
     width:90%;
     margin-left:5%;

    }
    .colfilter table tr th {
      font-size:13px;
    }
    .colfilter i {
      cursor:pointer;
      vertical-align: top;
      display: inline-block;
      width: 20px;
      height: 20px;
      background-position: center;
      background-repeat: no-repeat;
      background-size: 20px 20px;
    }
.colfilter .eye { background-image: url('https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1550312860407&di=442e14818165ff866af0288e0cc17fb0&imgtype=0&src=http%3A%2F%2Fpic.90sjimg.com%2Fdesign%2F00%2F57%2F93%2F24%2F58fadc9c82555.png') } 
    
</style>
<script>
  import database from '../../assets/js/global/global_database.js';
  import $ from 'jquery'
  import store from '../../vuex/store'
  import Vue from 'vue'
  export default {
    store: store,
    created: function () {
      var _super = this;
      this.$store.state.col_metadata.col_data.forEach(function (v) {
        if (!v.primary) {
          var isFilter = false;
          window.Bus.colfilter.forEach(function (k) {

            if (v.id == k) {
              isFilter = true;
            }
          });
          var item = $.extend(true, {}, v);
         
          item.isFilter = isFilter
          item.data_type_name = _super.$store.getters.getDataType(item.data_type_code).name;
          _super.col_list.push(item);
        }

      })

    },
    data: function () {
      return {
        col_list:[]

      }
    },
    methods:  {

      turn: function (index) {
       
        this.col_list[index].isFilter = !this.col_list[index].isFilter;
        if (this.col_list[index].isFilter) {
          window.Bus.colfilter.push(this.col_list[index].id);
        }
        else {
          window.Bus.colfilter.forEach(function (v,i) {
            if (v == this.col_list[index].id) {
              window.Bus.colfilter.splice(i,1);
            }
          }.bind(this))
        }
      }
    }
  
  }
</script>
