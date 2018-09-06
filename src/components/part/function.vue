<template>
  <div>
    <div class="label">{{function_data.fn_label}}</div>
    <div>
      <div class="content" data-name="test" style="display: none;">
        <div v-for="(item,index) in  function_data.parm" v-bind:data-name="item.parm_name" data-index="index" class="parm">
          <Input ref="mychild"  v-if="item.components.tag=='input'" v-bind:options="item" />
          <Select ref="mychild" v-if="item.components.tag=='select'" v-bind:options="item" />
          <Areatext  ref="mychild" v-if="item.components.tag=='textarea'" v-bind:options="item" />
        </div>
        <div style="clear:both"> </div>
        <div><button  class="join" v-on:click="join">加入队列</button><button class="reset" v-on:click="reset">还原</button></div>
      </div>
    </div>
 
  </div>
</template>
<script>
  import Input from '../form/input'
  import Select from '../form/select'
  import Areatext from '../form/textarea'
  import common from '../../assets/js/common.js'
  import md5 from 'js-md5'
  import Vue from 'vue'
  export default {
    components: { Input, Select, Areatext },
    props: ['function_data', 'operator_data','operator_name'],
    methods: {
      join: function () {
        var isAllowed =true;
        this.$refs.mychild.forEach(function (item, index) {
          if (!item.valid()) {
            isAllowed = false;
          }
        });
        if (isAllowed) {
          var newObject = jQuery.extend(true, { data_id: common.GUID(), filter: [] }, this.function_data);

          var card = window.Bus.card;
          var hash = md5(JSON.stringify(this.operator_data));
          var hash_exsit = false;
          var exsit_idx;
          card.forEach(function (v,idx) {
            if (v.hash == hash) {
              hash_exsit = true;
              exsit_idx = idx;
            }
          }
          );
          if (hash_exsit) {
            var arry = card.concat();
            arry[exsit_idx].fnlist.push(newObject);
            Vue.set(window.Bus, "card", arry);
            console.log("走这个");
          }
          else {
            var data = {
              hash: hash,
              name: this.operator_name,
              operator_data:
                {
                  isAllCol: this.operator_data.all_col ? true : false,
                  rows: this.operator_data.all_col,
                  cells: this.operator_data.all_col
                },
              fnlist: [newObject]
            }
            card.push(data);
          }
 
        }
      
      },
      reset: function () {
        this.$refs.mychild.forEach(function (item, index) {
           item.reset();
        })     
      }
    },
    name:"Function"
  };
</script>
