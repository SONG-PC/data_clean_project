<template>
  <div > 
    <table >
      <tr>
        <th>字段名</th>
        <th>默认值</th>
        <th>类型</th>
        <th>是否保留</th>
      </tr>
      <tr v-for="(p,index) in format">
        <td v-if="!p.isExtend" style="color:cadetblue">{{p.name?p.name:""}}</td>
        <td v-if="p.isExtend"><input v-on:change="setName(index,$event)" style="margin-bottom:0;background-color:snow;border:none;text-align:center;font-size:10px;" type="text"  v-bind:value="p.name?p.name:''"/></td>
        <td style="background-color:snow"><input v-on:change="writeDefault(index,$event)" style="margin-bottom:0;background-color:snow;border:none;text-align:center;font-size:10px;" type="text" v-bind:value="p.default?p.default:''"/></td>
        <td>
          <select v-on:change="selectType(index,$event)" style="margin-bottom:0;border:none;font-size:10px;padding-left:15px;" >
            <option  v-for="item in getBaicDataType"  v-bind:value="item.code"  v-bind:selected="item.code==p.type_code?'selected':''" >{{item.name}}</option>
          </select>
        </td>
        <td><input v-on:change="turn(index,$event)"  v-bind:checked="p.disabled?'':'checked'" type="checkbox" style="margin-bottom:0;" /></td>
      </tr>
    </table>
    <div  v-on:click="addFormat()" style="width:100%;text-align:center;color:steelblue;height:30px;line-height:30px;font-size:10px;">新增字段</div>
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
  import Vue from 'vue'
  import $ from 'jquery'
import { format } from 'path';
  export default {
    data: function(){

      return {
      
      }



    },
    mounted: function () {

    
    },
    computed: {
      getBaicDataType: function () {
        return this.$store.getters.getBaicDataType;
      },
      format: function () {
        return this.$store.getters.getFormatFromEndpoint(this.endpoint_id);
      }
    },
    methods: {
      setName: function (index, e) {
        var value = e.target.value;
        if (!this.hasSomeName(value)) {
          var update_format = $.extend(true, [], this.format);
          update_format[index].name = value;
          this.update_conn({ id: this.connection_id, format: update_format });
        }
        else {
          errorHandler(this)("命名重复,请重新输入字段名称", "warning", "警告");
          e.target.value=this.format[index].name;

        }
      },
      hasSomeName: function (name) {
        var has_name = false;
        for (let i = 0; i < this.format.length; i++) {
          if (this.format[i].name == name) {
            has_name = true;
            break;
          }
        }
        return has_name;
      },
      update_endpoint: function (post_data ,rollback) {
        var _super = this;
        this.$store.dispatch("flowOpRest", {
          data: {
            update_data: post_data,           
          },
          rollback: rollback,
          onError: errorHandler(_super),
          onSuccess: errorHandler(_super),
          callback: function () {
         
          },
          extraData: { method: "put", obj: "Endpoint" }
        });

      },
      addFormat: function () {
        var update_format = $.extend(true, [], this.format);
        update_format.push({
          name: null,
          type_code: this.getBaicDataType[0].code,
          default: null,
          isExtend: true,
          disabled: false
        });
        this.update_endpoint({ id: this.endpoint_id, format: update_format });
      },
      selectType: function (index, e) {
        var value = e.target.value;
        var update_format = $.extend(true, [], this.format);
        update_format[index].type_code = value;
        this.update_conn({ id: this.connection_id, format: update_format });
      },
      writeDefault: function (index, e) {

        var value = e.target.value;
        var update_format = $.extend(true, [], this.format);
        update_format[index].default = $.trim(value);
        this.update_endpoint({ id: this.endpoint_id, format: update_format });
      },
      turn: function (index, e) {
        var value = e.target.checked;
        var update_format = $.extend(true, [], this.format);
        if (update_format[index].isExtend == true) {
          update_format.splice(index, 1);
        }
        else {
          update_format[index].disabled = !value;
        }
        this.update_endpoint({ id: this.endpoint_id, format: update_format }, function () {
          e.target.checked = !value;
        });
      },
      getDataType: function (code) {
        return this.$store.getters.getDataType(code);
      },
      getDataTypeName: function (code) {
        return this.$store.getters.getTypeNameFromDicByCode(code);
      }
    
    },
    props: ['node','endpoint_id'],
    components: {


    }

  }

</script>
