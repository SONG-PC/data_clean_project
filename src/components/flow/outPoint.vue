<template>
  <div class="input_point">

    <ul class="point_list">
      <li v-if="p.isSource" v-for="(p,index) in sourceEndpoints" style="float:none">

        <div style="float:none">
          <el-tooltip content="删除这个出口" placement="left" effect="light">
            <div v-on:click="deleteEndpoint(p.jsPlumbNode,node)" style="color:red;font-size:30px;position:absolute;left:20px">-</div>
          </el-tooltip>
          <div style="display:inline-block;height:100%;width:100px;background-color:yellow;position:relative;margin-right:15px;"><input style="margin-left:15px;top:-15px;position:absolute;margin-right:15px;width:80px;display:inline-block" v-on:change="modify_name($event,p)" v-bind:value="p.name" /></div>
          <el-tooltip content="此端口为正常数据出口,不可占用" placement="top" effect="light">
            <span v-if="index==0" style="color:sandybrown;margin-left:60px;border:1px gray dashed;padding:5px 5px 5px 5px;border-radius:2px;">数据出口</span>
          </el-tooltip>
        </div>

      </li>
    </ul>
    <el-tooltip content="新增一个输出端口" placement="top" effect="light">
      <div v-on:click="addEndpoint" style="width:100%;height:40px;text-align:center;font-size:30px;color:olive;line-height:40px;">+</div>
    </el-tooltip>
  </div>
  </template>
  <script>
    var errorHandler = function (caller) {

      return function (message, type, desc) {
        caller.$notify({
          title: desc,
          message: message,
          type: type
        });
      }

    }
    export default {
      mounted: function () {


      },
      computed: {
        sourceEndpoints: function () {
          var arry = [];
          this.endpoints.forEach(function (v) {
            if (v.isSource) {
              arry.push(v);
            }
          });
          return arry;
        }
      },
      methods: {

        addEndpoint: function () {

          this.$emit('addEndpoint', { node_id: this.node.id, is_source: true });
        },
        deleteEndpoint: function (endpoint, node) {

          this.$emit('deleteEndpoint', { endpoint: endpoint, node: node });
        },
        modify_name: function (e, endpoint) {
          var value = e.target.value;
          var rollbakc_value = endpoint.name;

          this.$emit('updateEndpoint', {
            update_data: { id: endpoint.id, name: value }, rollback: function () {
              e.target.value = rollbakc_value;
            }
          });
        },

      },
      data: function () {
        return {


        }
      },
      props: ['node', 'parameter', 'endpoints']
    }

  </script>
