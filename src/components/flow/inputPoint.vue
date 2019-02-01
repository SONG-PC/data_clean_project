<template>
  <div class="input_point">
  
    <ul class="point_list">
      <li v-if="p.isTarget" v-for="(p,index) in targetEndpoints" style="float:none">

        <div style="float:none">
          <el-tooltip v-if="index>0" content="删除这个入口" placement="left" effect="light">
            <div v-on:click="deleteEndpoint(p.jsPlumbNode,node)" style="color:red;font-size:30px;position:absolute;left:20px">-</div>
          </el-tooltip>
          <div style="display:inline-block;height:100%;width:100px;background-color:yellow;position:relative;margin-right:15px;"><input style="margin-left:15px;top:-15px;position:absolute;margin-right:15px;width:80px;display:inline-block" v-on:change="modify_name($event,p)" v-bind:value="p.name" /></div>
          <el-tooltip content="其他端口输入格式必须映射此端口所有字段" placement="top" effect="light">
            <span v-if="index==0" style="color:sandybrown;margin-left:60px;border:1px gray dashed;padding:5px 5px 5px 5px;border-radius:2px;">映射标准端口</span>
          </el-tooltip>
          <el-button v-if="index>0&&p.format&&p.format.length>0" size="mini">配置</el-button>
          <el-button v-if="index>0&&p.format&&p.format.length>0" size="mini">映射</el-button>
        </div>
        <div v-if="p.format&&p.format.length>0" style="position:relative;left:-76px;width:360px">

          <Format v-bind:endpoint_id="p.id" v-bind:node="node"></Format>
          <Mapping v-on:update="updateParameters" v-bind:source_id="p.id" v-bind:line_relation="getRelationFromParam(node.parameters,index)" v-bind:source="getFormat(p.id)" v-bind:target="getFormat(targetEndpoints[0].id)" v-if="index>0"></Mapping>
        </div>
      </li>
    </ul>
    <el-tooltip content="新增一个输入端口" placement="top" effect="light">
      <div v-on:click="addEndpoint" style="width:100%;height:40px;text-align:center;font-size:30px;color:olive;line-height:40px;">+</div>
    </el-tooltip>
  </div>
</template>
<script>
  import Format from '../flow/format'
  import Mapping from '../common/mapping'
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
      targetEndpoints: function () {
        var arry = [];
        this.endpoints.forEach(function (v) {
          if (v.isTarget) {
            arry.push(v);
          }
        });
        return arry;
      }
    },
    components: { Format, Mapping},
    methods: {
      getFormat: function (epid) {

        return $.extend(true, [], this.$store.getters.getFormatFromEndpoint(epid));
      },
      getRelationFromParam: function (parameters, index) {
        var relation = {};
        var endpoint = this.targetEndpoints[index];
        if (parameters && Object.keys(parameters).length > 0 && parameters["mapping"] && parameters["mapping"][endpoint.id] && parameters["mapping"][endpoint.id].length > 0) {
      
          var target = this.getFormat(this.targetEndpoints[0].id);
          var source = this.getFormat(this.targetEndpoints[index].id);
        
          parameters["mapping"][endpoint.id].forEach(function (v) {
        
            var source_index = this.getIndexFromFormat(v.source_key, source);
        
            var target_index = this.getIndexFromFormat(v.mapping_key, target);
    
            if (source_index >= 0 && target_index >= 0) {
              relation[source_index] = target_index;
            }

          }.bind(this))
        }
   
        return relation;
      },
      getIndexFromFormat: function (name, format) {
   
        var rtn;
        for (var i = 0; i < format.length; i++) {


          if (format[i].name == name) {
            rtn = i;
            break;
          }
        }
     
        return rtn;
      },
      complieRelation: function (parameters, relation, endpoint_id, source, target) {

        var arry = [];
        for (var key in relation) {
          arry.push({ source_key: source[key].name, mapping_key: target[relation[key]].name });
        }
        parameters["mapping"][endpoint_id] = arry;
      },
      updateParameters: function (payload) {
        var _super = this;
        var parameters = $.extend(true, {}, this.node.parameters);
        parameters["mapping"] = parameters["mapping"] || {};
        this.complieRelation(parameters, payload.relation, payload.endpoint_id, payload.source, payload.target);
        this.$store.dispatch("flowOpRest", {
          data: {
            update_data: {
              id: this.node.id,
              parameters: parameters
            },
          },
          onError: errorHandler(_super),
          onSuccess: errorHandler(_super),
          callback: payload.callback(),
          extraData: { method: "put", obj: "Node" }
        });
      },

      addEndpoint: function () {

        this.$emit('addEndpoint', { node_id: this.node.id, is_source: false });
      }, deleteEndpoint: function (endpoint,node) {
  
        this.$emit('deleteEndpoint', { endpoint: endpoint ,node:node});
      },
      getFormatByTargetEpid: function (ep_id) {



      },
      modify_name: function (e, endpoint) {
        var value = e.target.value;
        var rollbakc_value = endpoint.name;

        this.$emit('updateEndpoint', {
          update_data: { id: endpoint.id, name: value  }, rollback: function () {
            e.target.value = rollbakc_value;
          }
        });
      },
      setStand: function () {

        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        
        }).catch(() => {
       
        });

      },
      removePoint: function (index) {

        this.node.jsPlumbNode._removeOneEndPoint(index, false)

      },
      addPoint: function () {
        this.node.jsPlumbNode._addOneEndPoint(false,this.node.id)
       // this.$emit("okgogogo")

      }
    },
    data: function () {
      return {


      }
    },
    props: ['node', 'parameter','endpoints']
  }

</script>
