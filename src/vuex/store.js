import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';
import { fail } from 'assert';
import { setTimeout } from 'timers';
import { EALREADY } from 'constants';
import $ from 'jquery'
Vue.use(Vuex)
var interface_host ="http://localhost:8090"
var flow_interface_host ="http://localhost:8091"
const store = new Vuex.Store({
  state: {
    grid: {
      full_data: null,
      view_range:[]

    },
    col_metadata:
    {
       col_data: [],
        col_analysis: {}
    },
    dictionary: {
      data_type: [],
      function_data: [],
      op_data:[]
    },
    suggestion: null,
    operation: {
      op_list: [],
      steps:[]
    },
    filters:[],
    loading: false,
    loading_txt: "数据正在加载中",
    flowEle: { node: [], lines: [], endpoints: []},
    flowApp: []
  },
  getters: {
    getColAnalysis: state => (colid) => {
      return state.col_metadata.col_analysis[colid];
    },
    getColByColid: state => (colid) => {
      var rtn = null;
      state.col_metadata.col_data && state.col_metadata.col_data.forEach(
        function (v) {
          if (v.id == colid)
            rtn = v;
        });
      return rtn;
    },
    getFunctionList: state => (fn_id) =>{

      if (state.dictionary) {
        var function_list = state.dictionary.function_data;
        var rtn = null;
        if (fn_id) {
          for (let i = 0; i < function_list.length; i++) {
            if (function_list[i].code == fn_id) {
              rtn = function_list[i];
              break;
            }
          }
        }
        else {
          rtn = function_list;
        }
        return rtn;
      }
      else {
        return [];
      }

    },

    getFunctionListGroup: state => () => {
      var fn_group_list = {};
      if (state.dictionary) {
        state.dictionary.function_data&&  state.dictionary.function_data.forEach(function (v) {
          fn_group_list[v.category] = fn_group_list[v.category] || [];
          fn_group_list[v.category].push(v);
        });
      }
      return  fn_group_list;
     

    },
    getBaicDataType: state => {
      var arry = [];
      if (state.dictionary) {
        state.dictionary.data_type.forEach(function (v) {
            if (v.isBasic) {
              arry.push(v);
            }
        })
        
      }
 
      return arry;
    },
    getFormatFromEndpoint: (state) => (endpoint_id) => {
  
      var format = null;
      for (let i = 0; i < state.flowEle.endpoints.length; i++) {

        if (endpoint_id == state.flowEle.endpoints[i].id) {

          format = state.flowEle.endpoints[i].format;
          break;
        }
      }
      return format;
    },
    hasLinesByConnId: state => (conn_id) => {
      var has = false;
      for (let i = 0; i < state.flowEle.lines.length; i++) {

        if (conn_id == state.flowEle.lines[i].id) {

          has = true;
          break;
        }
      }
      return has;
    },
    getGridRenderData: state => {

      return { full_data: state.grid && state.grid.full_data, view_range: state.grid && state.grid.view_range, col_metadata : state.col_metadata }
    },
    getDataType: (state) => (code) => {
      
      var value;
      state.dictionary.data_type.forEach(function (v) {
        if (code == v.code)
          value = v;
      });
      return value;

    },
    getOpByCode: (state) => (code) => {

      var value;
      state.dictionary.op_data.forEach(function (v) {
        if (code == v.code)
          value = v;
      });
      return value;

    },
    getTypeNameFromDicByCode: (state)=>(code) =>{
      var name;
      state.dictionary.data_type.forEach(function (v) {
        if (code == v.code)
          name = v.name;
      });
      return name;
    }
  },
  mutations: {

    loading: function (state, msg) {

      state.loading = false;
      state.loading_txt= msg;
    },
    setFilters: function (state, filters) {
      state.filters = filters;
    },
    justUpdataState: function (state, payload) {

      for (var key in payload.data) {
        state[key] = payload.data[key];
        
      }
   
     
    },
    incrementalUpdataState: function (state, data) {
      console.log(data);
      increm_update(state, data);
      
    },
    createFlowEle: function (state, payload) {
      for (var key in payload) {
        payload[key].forEach(function (v) {
          flowNodeFix(v, key);
        })
      }
      state.flowEle = payload;
    }
    ,
    createFlowApp: function (state, payload) {
      state.flowApp = payload
    },
    flowOpHandler: function (state, payload) {

        for (var key in payload.data) {
          payload.data[key].forEach(function (v) {
            if (v.type == "insert") {
              flowNodeFix(v.value, key);
              state.flowEle[key].push(v.value);
            
            }
            else if (v.type == "delete") {
          
              for (let i = 0; i < state.flowEle[key].length; i++) {
                if (state.flowEle[key][i]) {
                  if (v.value.id == state.flowEle[key][i].id) {
                    if (key == "node") {
                      Vue.set(state.flowEle[key], i, null);
                    }
                    else {
                      state.flowEle[key].splice(i, 1);
                      i--;
                    }
                    break;
                  }
                }
              }
            }
            else if (v.type == "update") {

              state.flowEle[key].forEach(function (node, i) {
                if (node&&node.id == v.value.id) {
                  for (var param in node) {
                    if (param != "jsPlumbNode") {
                      node[param] = v.value[param];
                    }                
                  }
                  Vue.set(state.flowEle[key], i, node);
                }
              });
            }
          })
        }
    

    }
  },
  actions: {
    getFilter: function ({ commit }, postJson) {

      getFilterView(postJson.data).then(function (response) {
        responseHandler(response, function () {
          commit('incrementalUpdataState', response.data.data);
        }, postJson)
      });

    },
    focusSuggestion: function ({ commit }, postJson) {
      Suggestion(postJson.data).then(function (response) {
        responseHandler(response, function () {
          commit('incrementalUpdataState', response.data.data);
        }, postJson)
      });;
    },
    getDictionary: function ({ commit }) {

      var payload = {};
      axios.all([Dictionary()]).then(function (response) {
        payload.data={
          dictionary: response[0].data.data

        } ;
      
        commit('justUpdataState', payload);
      
      })
    },
    getWashTask: function ({ commit }) {
      getAction().then(function (response) {
        responseHandler(response, function () {
          commit('incrementalUpdataState', response.data.data);
        });

      });

    },
    flowOp: function ({ commit },postJson) {

      FlowOp(postJson.data).then(function (response) {     
        responseHandler(response, function () {
          commit('flowOpHandler', response.data);
        }, postJson);
        
      }).catch(function (err) {
        console.log(err);
      })
    },
    flowOpRest: function ({ commit }, postJson) {

      FlowOpRest(postJson.data, postJson.extraData.method, postJson.extraData.obj).then(function (response) {


        responseHandler(response, function () {
          commit('flowOpHandler', response.data);

        }, postJson);

      }).catch(function (err) {
        console.log(err);
      })

    },
    flow: function ({ commit }) {

      FlowElement().then(function (response) {
        responseHandler(response, function () {
          commit('createFlowEle', response.data.data);
        });

      }).catch(function (err) {
        console.log(err);
      })
    },
    flowApp: function ({ commit }) {
      FlowApp().then(function (response) {
        responseHandler(response, function () {
          commit('createFlowApp', response.data.data);
        });

      })
    },
    washAction: function ({ commit }, postJson) {

      postAction(postJson.data).then(function (response) {
        responseHandler(response, function () {
          commit('incrementalUpdataState', response.data.data);
        }, postJson);
      });
    },
    washActionPut: function ({ commit }, postJson) {

      putAction(postJson.data).then(function (response) {
        responseHandler(response, function () {
          commit('incrementalUpdataState', response.data.data);
        });

      }, postJson);
    },
    cardOp: function ({ commit }, postJson) {

      CardOp(postJson.data).then(function (response) {
        responseHandler(response, function () {
          commit('incrementalUpdataState', response.data.data);
        }, postJson);

      });

    }
  }

});
function increm_update(state,data) {

  if (data instanceof Array) {
    state = data;
  }
  else if (data instanceof Object) {

    for (var key in data) {
      state[key] = state[key] || {}
      if (data[key] instanceof Object && !(data[key] instanceof Array)) {
      
          increm_update(state[key],data[key]);
        }
        else {
          state[key] = data[key];
        }
      
    }
  }
  else {
    state = data;
  }
}
function flowNodeFix(obj,type) {
  if (type == "node") {
    obj.isSelect = false;
    obj.isEdit = false;
    obj.isTip = false;
  }
  obj.jsPlumbNode = null;
}
function responseHandler(response,commitFn,postJson) {

  if (response.data.state < 0) {
    postJson&&  postJson.onError && postJson.onError(response.data.message, "warning", "警告");
    postJson && postJson.rollback && postJson.rollback();
  }
  else if (response.data.state >= 0) {

    commitFn();
    postJson && postJson.onSuccess && postJson.onSuccess(response.data.message, "success", "成功");
    postJson && postJson.callback && postJson.callback();
  }


}
function getAction() {
  return axios.get(interface_host +'/Action');
}
function CardOp(jsonPost) {
  return axios.post(interface_host + '/CardOp', jsonPost);
}
function postAction(jsonPost) {

  return axios.post(interface_host+ '/Action', jsonPost)
}
function putAction(jsonPost) {

  return axios.put(interface_host + '/Action', jsonPost)
}
function Dictionary() {
  return axios.get(interface_host + '/Dictionary')
}
function FlowOp(jsonPost) {
  
  return axios.post(flow_interface_host + '/FlowNodeOp', jsonPost)
}
function FlowOpRest(json, method, obj) {

  return axios[method](flow_interface_host + '/' + obj + '', json)
}
function FlowElement() {
  return axios.get(flow_interface_host + '/Flow')
}
function FlowApp() {
  return axios.get(flow_interface_host + '/FlowApp')
}
function getFilterView(jsonPost) {
  return axios.post(interface_host + '/Filter', jsonPost) 
}
function Suggestion(jsonPost) {
  return axios.post(interface_host + '/Suggestion', jsonPost)
}
export default store
