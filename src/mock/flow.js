var Mock = require('mockjs');
var http = require('http');
var md5 = require('js-md5');
var URL = require('url');
var type_code_arry = null;
//interface
var create_node_parm = function (obj, parms) {
  if (parms && parms instanceof Array) {
    parms.forEach(function (v) {
      if (v.type == "select") {
        obj[v.name] = v.default;
        if (v.configuration) {
          v.configuration.values.forEach(function (v) {
            create_node_parm(obj, v.parameters);
          })
        }
      } else {
        obj[v.name] = v.default;
      }
    });
  }
};
var flow_app = [
  {
    id: Mock.Random.guid(),
    name: "数据入口",
    input_count: 0,
    output_count: 1,
    img: "entry",
    setting: [
      {
        name: "属性配置",
        isOpen: true,
        parameters: [{
          name: "entry_url",
          label: "文件入口",
          type: "input",
          value: null,
          default: null,
          description: "请输入文件入口地址"
        }]
      }
    ],

  },
  {
    id: Mock.Random.guid(),
    name: "清洗模板",
    input_count: 1,
    output_count: 1,
    img: "wash",
    setting: [
      {
        name: "输出管理",
        isOpen: true,
        parameters: [{
          name: "output_point",
          type: "output_point",
          value: null,
          default: null
        }]
      },
      {
        name: "异常处理",
        isOpen: false,
        parameters: [{
          name: "all_exception", //参数名
          label: "所有异常",
          neccesary: true, //是否必须
          type: "select",
          default: "drop",
          value: "drop",
          configuration: {
            mutiple: false,
            values: [
              {
                label: "丢弃", //选项内容
                value: "drop",
              },
              {
                label: "异常处理", //选项内容
                value: "dealwith",
              }
              ,
              {
                label: "输出", //选项内容
                value: "out",
                parameters: [
                  {
                    name: "all_point_id", //参数名
                    label: "选择输入端口",
                    type: "point"
                  }
                ]
              },
              {
                label: "配置更多异常类型", //选项内容
                value: "more",
                parameters: [

                  {
                    name: "format_exception", //参数名
                    label: "格式异常",
                    neccesary: true, //是否必须
                    type: "select",
                    default: "drop",
                    value: "drop",
                    configuration: {
                      mutiple: false,
                      values: [
                        {
                          label: "丢弃", //选项内容
                          value: "drop",
                        },
                        {
                          label: "异常处理", //选项内容
                          value: "dealwith",
                        }
                        ,
                        {
                          label: "输出", //选项内容
                          value: "out",
                          parameters: [
                            {
                              name: "format_point_id", //参数名
                              label: "选择输入端口",
                              type: "point"
                            }
                          ]
                        }

                      ],
                    }
                  },
                  {
                    name: "checkout_exception", //参数名
                    label: "校验异常",
                    type: "select",
                    neccesary: true, //是否必须
                    value: "drop",
                    default: "drop",
                    configuration: {
                      mutiple: false,
                      values: [
                        {
                          label: "丢弃", //选项内容
                          value: "drop",
                        },
                        {
                          label: "异常处理", //选项内容
                          value: "dealwith",
                        }
                        ,
                        {
                          label: "输出", //选项内容
                          value: "out",
                          parameters: [
                            {
                              name: "checkout_point_id", //参数名
                              label: "选择输入端口",
                              type: "point"
                            }
                          ]
                        }
                      ],
                    }
                  },
                  {
                    name: "action_exception", //参数名
                    label: "执行异常",
                    type: "select",
                    neccesary: true, //是否必须
                    default: "drop",
                    value: "drop",
                    configuration: {
                      mutiple: false,
                      values: [
                        {
                          label: "丢弃", //选项内容
                          value: "drop",
                        },
                        {
                          label: "异常处理", //选项内容
                          value: "dealwith",
                        }
                        ,
                        {
                          label: "输出", //选项内容
                          value: "out",
                          parameters: [
                            {
                              name: "action_point_id", //参数名
                              label: "选择输入端口",
                              type: "point"
                            }
                          ]
                        }
                      ],
                    }
                  }


                ]
              }
            ],
          }
        },

        ]
      }
      ,
      {
        name: "属性配置",
        isOpen: true

      }
    ],
    buttons: [
      {
        type: "navigation",
        name: "清洗数据",
        url: "/wash",
        dependence: [],
        need_node_state: true
      }
    ]

  }
  ,
  {
    id: Mock.Random.guid(),
    name: "合并",
    input_count: 2,
    output_count: 1,
    height: 200,
    img: "combine",
    setting: [
      {
        name: "输入管理",
        isOpen: true,
        parameters: [{
          name: "mapping",
          type: "input_point",
          value: null,
          default: null
        }]
      },
      {
        name: "属性配置",
        isOpen: true

      }
    ]
  }
  ,
  {
    id: Mock.Random.guid(),
    name: "格式转换",
    input_count: 1,
    output_count: 1,

    img: "transform",
    setting: [
      {
        name: "属性配置",
        isOpen: true

      }
    ]
  }
  ,
  {
    id: Mock.Random.guid(),
    name: "过滤",
    input_count: 1,
    output_count: 1,
    img: "filter",
    setting: [
      {
        name: "属性配置",
        isOpen: true

      }
    ]
  }
  ,
  {
    id: Mock.Random.guid(),
    name: "出口",
    input_count: 1,
    output_count: 0,
    img: "out",
    setting: [
      {
        name: "属性配置",
        isOpen: true,
        parameters: [{
          name: "exit_url",
          label: "文件出口",
          type: "input",
          value: null,
          default: null,
          description: "请输入文件入口地址"
        }]
      }
    ]
  }
];

flow_app[0].next_id = flow_app[1].id;
flow_app[1].next_id = flow_app[5].id;
function extend(v, c) {
  for (var p in c) {
    v[p] = c[p];
  }
  return v;
}

function clone(obj) {
  // Handle the 3 simple types, and null or undefined or function
  if (null == obj || "object" != typeof obj) return obj;

  // Handle Date
  if (obj instanceof Date) {
    var copy = new Date();
    copy.setTime(obj.getTime());
    return copy;

  }
  // Handle Array or Object
  if (obj instanceof Array | obj instanceof Object) {
    var copy = (obj instanceof Array) ? [] : {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr))
        copy[attr] = clone(obj[attr]);

    }
    return copy;

  }
  throw new Error("Unable to clone obj! Its type isn't supported.");

}
var Base_Mock = {
  "state": "0",
  "message": "响应成功"
}
let express = require('express');   //引入express
let bodyParser = require('body-parser');
var node = [

];
var endPoint = [{
  id: "base_data_001_output1",
  name: "输出_1",
  isSource: true,
  isTarget: false,
  maxConnections: -1,
  node_id: "base_data_001",
}];
var lines = [];
let app = express();        //实例化express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

//根据节点id,端点id找到端点对象
var getEnpoint = function (endpointId) {
  var rtn;
  for (let i = 0; i < endPoint.length; i++) {
    if (endPoint[i].id == endpointId) {
      rtn = endPoint[i];
      break;
    }
  }
  return rtn;
}
//获取节点
var getNode = function (nodeId) {
  var v_node;
  for (let i = 0; i < node.length; i++) {
    if (node[i].id == nodeId) {

      v_node = node[i]
    }
  }
  return v_node;
}
var update_endpoint = function (new_endpoints) {
  for (let i = 0; i < endPoint.length; i++) {
    if (endPoint[i].node_id == new_endpoints.id) {
      endPoint[i].name = new_endpoints.name;
    }
  }
  return {
    endpoints: [{ value: endPoint[i], type: "update" }]

  }
}
//删除某节点连线信息
var deleteConnection = function (connectionId) {
  var rtn;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].id == connectionId) {
      rtn = lines.splice(i, 1)[0];
      i--;
    }
  }
  return rtn;
}
var getApp = function (appid) {
  var rtn;
  for (let i = 0; i < flow_app.length; i++) {

    if (flow_app[i].id == appid)
      rtn = flow_app[i];
  }
  return rtn;

}
//获取某节点一个空闲入口端点
var getEmptyInputEndPoint = function (nodeId) {
  var ep;
  for (let i = 0; i < endPoint.length; i++) {
    if (endPoint[i].isTarget && nodeId == endPoint[i].node_id) {
      if (getAllConnectipnByEP(endPoint[i].id).length <= 0) {
        ep = endPoint[i];
        break;
      }

    }
  }
  return ep;

}
//获取一个空闲出口端点
var getEmptyOutEndPoint = function (nodeId) {

  var ep;
  for (let i = 0; i < endPoint.length; i++) {
    if (endPoint[i].isSource && nodeId == endPoint[i].node_id) {
      if (getAllConnectipnByEP(endPoint[i].id).length <= 0) {
        ep = endPoint[i];
        break;
      }

    }
  }
  return ep;

}
var getfirstOutEndPoint = function (nodeId) {

  var ep;
  for (let i = 0; i < endPoint.length; i++) {
    if (endPoint[i].isSource && nodeId == endPoint[i].node_id) {
      ep = endPoint[i];
      break;

    }
  }
  return ep;

}
//获取一个端点所有连接对象
var getAllConnectipnByEP = function (endpointId) {
  var conn = [];
  lines.forEach(function (v) {
    if (v.sourceEndpoint.id == endpointId || v.targetEndpoint.id == endpointId) {
      conn.push(v)
    }

  })
  return conn;
}
var createNewNode = function (app_id, x, y, source_node_id) {
  var app = getApp(app_id);
  var s_node = getNode(source_node_id);
  var new_node = {
    id: 'instance' + Mock.Random.id(),
    app_id: app_id,
    name: app.name,
    width: app.width,
    height: app.height,
    x: x,
    y: y,
    state: {
      status: "unprepared",  //unprepared,stop,running
      passed_number: 0,
      format: null
    },
    parameters: {},
    excepetion: [],
  }
  if (new_node.app_id == flow_app[0].id) {
    var e_p = getAllSourceEndpointByNode(new_node);
    new_node.state.status = "prepared";
    e_p.forEach(function (v) {
      v.format = [{
        name: "name",
        type_code: Mock.Random.pick(type_code_arry).code
      },
      {
        name: "age",
        type_code: Mock.Random.pick(type_code_arry).code
      },
      {
        name: "email",
        type_code: Mock.Random.pick(type_code_arry).code
      },
      {
        name: "phone",
        type_code: Mock.Random.pick(type_code_arry).code
      },
      {
        name: "address",
        type_code: Mock.Random.pick(type_code_arry).code
      },
      {
        name: "sex",
        type_code: Mock.Random.pick(type_code_arry).code
      }
      ];
    })
  }
  app.setting.forEach(function (v) {
    create_node_parm(new_node.parameters, v.parameters);
  });

  node.push(new_node);
  var eplist = [];
  var lines_list = [];
  //创建端点

  for (let i = 0; i < app.input_count; i++) {
    var ep = createEndPoint(new_node.id, false);
    eplist.push({ value: ep, type: "insert" });

  }
  for (let i = 0; i < app.output_count; i++) {
    var ep = createEndPoint(new_node.id, true);
    eplist.push({ value: ep, type: "insert" });
  }
  //创建连线
  if (source_node_id) {
    var ep_out = getfirstOutEndPoint(source_node_id);
    var ep_in = getEmptyInputEndPoint(new_node.id);


    if (ep_out && ep_in) {
      var conn = createConnction(ep_out.id, ep_in.id)
      if (conn) {
        lines_list.push({ value: conn, type: "insert" });
        lines.push(conn);
      }
    }
  }
  validNode(new_node)
  return {
    node: [{ value: new_node, type: "insert" }],
    endpoints: eplist,
    lines: lines_list

  }
}
var deleteEndPoint = function (endpointId) {
  var lines_list = [];
  var end_list = [];
  for (let i = 0; i < endPoint.length; i++) {
    if (endPoint[i].id == endpointId) {
      end_list.push({ value: endPoint[i], type: "delete" });
      lines_list = deleteAllconnectionByEp(endPoint[i].id);
      endPoint.splice(i, 1);
      i--;
    }
  }

  return {
    lines: lines_list,
    endpoints: end_list

  }
}
var updateEndPoint = function (update_data) {
  var ep_list = [];
  for (let i = 0; i < endPoint.length; i++) {
    if (endPoint[i].id == update_data.id) {
      for (var p in update_data) {
        endPoint[i][p] = update_data[p];
      }
      ep_list.push({
        value: endPoint[i],
        type: "update"
      });
    }
  }
  return { endpoints: ep_list };
}
var updateConnection = function (update_data) {
  var line_list = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].id == update_data.id) {
      for (var p in update_data) {
        lines[i][p] = update_data[p];
      }
      line_list.push({
        value: lines[i],
        type: "update"
      });
    }
  }
  return {
    lines: line_list
  }
}
//递归复值
function update(target, obj) {
  if (obj instanceof Array) {
    for (let i = 0; i < obj.length; i++) {
      if (typeof obj[i] == "object") {
        if (target[i]) {
          update(target[i], obj[i])
        }
        else {
          target[i] = obj[i];
        }
      }
      else {
        target[i] = obj[i];

      }
    }
  }
  else if (obj instanceof Object) {
    for (var p in obj) {
      if (typeof obj[p] == "object") {
        if (target[p]) {
          update(target[p], obj[p])
        }
        else {
          target[p] = obj[p];
        }
      }
      else {

        target[p] = obj[p];
        console.log(target[p] + "|" + obj[p])
      }
    }
  }

}
var updateNode = function (now_node, update_data) {
  update(now_node, update_data);
  console.log(now_node.parameters)
}
var getAllTargetEndpointByNode = function (node) {
  var arry = [];
  endPoint.forEach(function (v) {
    if (v.node_id == node.id && v.isTarget) {
      arry.push(v);
    }
  })
  return arry;
}
var isLastConnection = function (c) {


}
var getAllSourceEndpointByNode = function (node) {
  var arry = [];
  endPoint.forEach(function (v) {
    if (v.node_id == node.id && v.isSource) {
      arry.push(v);
    }
  })
  return arry;
}
var isLastConnection = function (c) {


}

var getAllTagetEndpointByNode = function (node) {
  var arry = [];
  for (let i = 0; i < endPoint.length; i++) {

    if (endPoint[i].isTarget && endPoint[i].node_id == node.id) {
      arry.push(endPoint[i]);
    }
  }
  return arry;

}

var deleteDisableMapping = function (format, mapping, isSource) {

  if (mapping instanceof Array) {
    mapping.forEach(function (v, i) {
      var has = false;
      format.forEach(function (k) {
        var validname = isSource ? v.source_key : v.target_key
        if (k.name == validname && !k.disabled) {
          has = true
        }
      });
      if (!has) {
        mapping.splice(i--, 1);
      }
    })
  }

}

//重新计算节点参数
var updateMappingParameters = function (node) {
  if (node.app_id == flow_app[2].id) {
    if (node.parameters["mapping"]) {
      var target_endpoints = getAllTagetEndpointByNode(node);
      if (target_endpoints.length > 0) {
        var stand_fomat = target_endpoints[0].format;
        console.log(stand_fomat);
        target_endpoints.forEach(function (v, i) {
          if (i > 0) {
            if (!stand_fomat) {
              node.parameters["mapping"][v.id] = [];
            }
            else {
              var format = v.format;
              if (!format) {
                node.parameters["mapping"][v.id] = [];
              }
              else {
                deleteDisableMapping(format, node.parameters["mapping"], true);
                deleteDisableMapping(stand_fomat, node.parameters["mapping"], false)
              }
            }
          }
        });
      }
    }
  }
  else if (node.app_id == flow_app[1].id) {
    //var sourceEndpoints = getAllSourceEndpointByNode(node);
    //for (var key in node.parameters) {

    //  var has = false;
    //  sourceEndpoints.forEach(function (k) {
    //    if (node.parameters[key] == k.id) {
    //      var has = true;
    //    }
    //  });
    //  if (!has) {
    //    delete node.parameters[key];     
    //  }
    //}
  }
}
var validNode = function (node) {
  //校验当前节点状态,若符合条件,写入或取消输出.
  //合并节点校验
  var excepetion = [];
  var s_e = getAllSourceEndpointByNode(node);
  updateMappingParameters(node);
  if (node.app_id == flow_app[2].id) {
    //查找所有输入点信息

    var target_endpoints = getAllTagetEndpointByNode(node);
    if (target_endpoints.length > 0) {
      if (target_endpoints.length > 1) {
        var stand_format = target_endpoints[0].format;
        var valid_stand_format_length = 0;
        stand_format && stand_format.forEach(function (v) {
          if (!v.disabled) {
            valid_stand_format_length++;
          }
        });

        if (stand_format && stand_format.length > 0) {
          if (node.parameters && (node.parameters["mapping"] instanceof Object)) {
            target_endpoints.forEach(function (v, i) {
              var now_format = target_endpoints[0].format;
              if (node.parameters["mapping"][v.id] && i > 0) {
                if (!now_format) {

                  excepetion.push({ message: "" + v.name + "无数据来源" })
                }
                else {
                  if (node.parameters["mapping"][v.id].length < valid_stand_format_length) {
                    excepetion.push({ message: "" + v.name + "未完全映射标准端口" })
                  }
                }
              }
              else if (!node.parameters["mapping"][v.id] && i > 0) {

                excepetion.push({ message: "" + v.name + "未映射标准端口" })
              }

            })
          }
          else {
            excepetion.push({ message: "该节点缺少映射关系" });
          }
        }
        else {
          excepetion.push({ message: "该节点缺少映射标准端口" });
        }
      }
      else {
        excepetion.push({ message: "该节点需要一个以上的输入端口" });
      }

    }
    else {
      excepetion.push({ message: "该节点缺少输入端口" });
    }
    if (excepetion.length <= 0) {

      node.state.status = "prepared"
      s_e.forEach(function (v) {
        v.format = clone(stand_format);
        v.format.forEach(function (k) {
          k.default = null;
          k.isExtend = false;
          k.disabled = false;

        })
      });

    }
    else {
      node.state.status = "unprepared"
      s_e.forEach(function (v) {
        v.format = null;

      })

    }
  }
  if (node.app_id == flow_app[1].id) {
    var target_endpoints = getAllTagetEndpointByNode(node);
    if (target_endpoints.length > 0) {

      var format = target_endpoints[0].format;
      if (format && format.length > 0) {
        s_e.forEach(function (v) {
          v.format = clone(format);
          v.format.forEach(function (k) {
            k.default = null;
            k.isExtend = false;
            k.disabled = false;

          })
        });

      }
      else {
        excepetion.push({ message: "该节点缺少上游节点" });
      }
    }
    else {

      excepetion.push({ message: "该节点缺少输入端口" });
    }
    if (excepetion.length <= 0) {
      console.log("????")
      node.state.status = "prepared"
    }
    else {
      node.state.status = "unprepared"
      s_e.forEach(function (v) {
        v.format = null;

      })
    }
  }
  node.excepetion = excepetion;

}
var createEndPoint = function (node_id, isSource) {
  var id = Mock.Random.id();
  var ep = {
    id: node_id + '_ep_' + id,
    name: '端口' + id,
    node_id: node_id,
    maxConnections: isSource ? -1 : 1,
    format: [],
    isSource: isSource,
    isTarget: !isSource
  };
  endPoint.push(ep)
  return ep;
}
var deleteNode = function (nodeId) {
  var v_node = getNode(nodeId);
  var ep_list = [];
  var lines_list = [];
  for (let i = 0; i < node.length; i++) {
    if (node[i].id == nodeId) {
      node.splice(i, 1);
      i--;
    }
  }
  for (let i = 0; i < endPoint.length; i++) {
    if (endPoint[i].node_id == nodeId) {
      ep_list.push({ value: endPoint[i], type: "delete" });
      lines_list = deleteAllconnectionByEp(endPoint[i].id);
      endPoint.splice(i, 1);
      i--;
    }
  }

  return {
    node: [{ value: v_node, type: "delete" }],
    endpoints: ep_list,
    lines: lines_list

  }

}
var deleteAllconnectionByEp = function (ep_id) {
  var rtn = [];
  var conn = getAllConnectipnByEP(ep_id);
  for (let i = 0; i < lines.length; i++) {
    var flag = false;
    conn.forEach(function (v) {
      if (v.id == lines[i].id) {
        flag = true;
      }
    });
    if (flag) {
      var line = lines.splice(i, 1)[0];
      i--;
      rtn.push({ value: line, type: "delete" });
    }
  }
  return rtn;

}
var hasAnyAsSourceConnection = function (node) {
  var ep = getAllSourceEndpointByNode(node);
  var has = false;
  for (let i = 0; i < ep.length; i++) {
    if (getAllConnectipnByEP(ep[i].id).length > 0) {
      has = true;
      break;
    }
  }
  return has;
}
var createConnction = function (sourceEndpointId, targetEndpointId) {
  var conn_id = 'conn_' + Mock.Random.id();
  var sourceEp = getEnpoint(sourceEndpointId);
  var targetEp = getEnpoint(targetEndpointId);
  var s_node = getNode(sourceEp.node_id);

  if (s_node && sourceEp.format) {
    var connection = {
      id: conn_id,
      sourceEndpoint: sourceEp,
      targetEndpoint: targetEp
    }
    targetEp.format = clone(sourceEp.format);
    targetEp.format.forEach(function (v) {
      v.default = null;
      v.isExtend = false;
      v.disabled = false;

    })

    return connection;
  }

}
var getLineByID = function (connid) {
  var rtn;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].id == connid) {
      rtn = lines[i];
      break;
    }
  }
  return rtn;

}
var getTargeNodeByConnId = function (connid) {
  var conn = getLineByID(connid);
  return getNode(conn.targetEndpoint.node_id);

}
var getChangeStateNode = function (mynode) {
  var node_list = [];
  validNode(mynode)
  node_list.push({ value: mynode, type: "update" });
  return node_list;
}
var actionHandler = function (action, updates) {
  //需要加入检验队列的节点
  //1.被连线增删改
  //2.端点增删改
  //3.自身更新

  //连接
  if (action.type == "connection") {
    //1.源端点格式覆盖当前端点格式
    //2.依次判断当前节点至下游所有节点状态是否有更新
    //3.若当前源端点无格式状态,连接失败
    if (action.source_epid && action.target_epid) {
      var sourceEp = getEnpoint(action.source_epid);
      var targetEp = getEnpoint(action.target_epid);
      var s_node = getNode(sourceEp.node_id);
      var t_node = getNode(targetEp.node_id);
      if (sourceEp.format) {
        var conn = createConnction(action.source_epid, action.target_epid);
        if (conn) {
          lines.push(conn);
          return {
            "state": 0, "message": "操作成功", data: {
              node: getChangeStateNode(t_node),
              lines: [{ value: conn, type: "insert" }],
            }
          };
        }
      }
      else {
        return { "state": -1, "message": "当前端口缺少输出格式,无法创建下游节点." };
      }

    }
    else {
      return { "state": -1, "message": "当前动作缺少必要参数" };

    }
  }
  //删除连接
  else if (action.type == "delete_connection") {
    if (action.connection_id) {
      var t_node = getTargeNodeByConnId(action.connection_id);
      var hasInputData = hasAnyAsSourceConnection(t_node);
      if (hasInputData) {
        return { "state": -1, "message": "当前操作可能会影响下游数据格式，系统已终止此操作" }
      }
      else {
        var conn = deleteConnection(action.connection_id);
        if (conn) {
          return {
            "state": 0, "message": "操作成功", data: {
              node: getChangeStateNode(t_node),
              lines: [{ value: conn, type: "delete" }],
            }
          }
        }
      }
    }
  }
  //添加节点
  else if (action.type == "add_node") {



    var info = createNewNode(action.app_id, action.x, action.y, action.source_node_id);
    return {
      "state": 0, "message": "操作成功", data: info
    };

  }
  //删除节点
  else if (action.type == "delete_node") {
    var hasInputData = hasAnyAsSourceConnection(getNode(action.node_id));

    if (hasInputData) {
      return { "state": -1, "message": "当前操作可能会影响下游数据格式，系统已终止此操作" }
    }
    else {
      return { "state": 0, "message": "删除成功", data: deleteNode(action.node_id) }
    }
  }
  //增加端点
  else if (action.type == "add_endpoint") {
    var t_node = getNode(action.node_id);
    var hasInputData = hasAnyAsSourceConnection(t_node);
    if (hasInputData) {
      return { "state": -1, "message": "当前操作可能会影响下游数据格式，系统已终止此操作" }
    }
    else {
      var ep = createEndPoint(action.node_id, action.is_source);
      return {

        "state": 0, "message": "操作成功", data: {
          node: getChangeStateNode(t_node),
          endpoints: [{ value: ep, type: "insert" }]
        }
      }
    }
  }
  //删除端点
  else if (action.type == "delete_endpoint") {
    var t_node = getNode(getEnpoint(action.endpoint_id).node_id);
    var hasInputData = hasAnyAsSourceConnection(t_node);
    if (hasInputData) {
      return { "state": -1, "message": "当前操作可能会影响下游数据格式，系统已终止此操作" }
    }
    else {
      var data = deleteEndPoint(action.endpoint_id);
      data.node = getChangeStateNode(t_node);
      return {
        "state": 0, "message": "操作成功", data: data
      }
    }
  }
  //修改端点
  else if (action.type == "update_endpoint") {
    var t_node = getNode(getEnpoint(action.update_data.id).node_id);
    var hasInputData = hasAnyAsSourceConnection(t_node);
    if (hasInputData) {
      return { "state": -1, "message": "当前操作可能会影响下游数据格式，系统已终止此操作" }
    }
    else {
      var data = updateEndPoint(action.update_data);
      data.node = getChangeStateNode(t_node);
      return {
        "state": 0, "message": "操作成功", data: data
      }
    }
  }
  //修改连线信息update
  else if (action.type == "update_connection") {
    var t_node = getTargeNodeByConnId(action.update_data.id);
    var hasInputData = hasAnyAsSourceConnection(t_node);
    if (hasInputData) {
      return { "state": -1, "message": "当前操作可能会影响下游数据格式，系统已终止此操作" }
    }
    else {
      var data = updateConnection(action.update_data);
      data.node = getChangeStateNode(t_node);
      return {
        "state": 0, "message": " 操作成功", data: data
      }
    }
  }
  //移动端点
  else if (action.type == "move_node") {


  }
  //更新节点
  else if (action.type == "update_node") {
    var now_node = getNode(action.update_data.id)
    var hasInputData = hasAnyAsSourceConnection(now_node);
    var origin_format;
    var hash;
    if (hasInputData) {
      return { "state": -1, "message": "当前操作可能会影响下游数据格式，系统已终止此操作" }
    }
    else {
      updateNode(now_node, action.update_data);
      return {
        "state": 0, "message": " 操作成功", data: { node: getChangeStateNode(now_node) }
      }
    }


  }
}
app.use('/FlowNodeOp', function (req, res) {
  var request = req.body;
  //console.log(request);
  res.json(actionHandler(request));
});
app.use('/Node', function (req, res) {

  //添加节点
  if (req.method == "POST") {

    var action = req.body;

    var info = createNewNode(action.app_id, action.x, action.y, action.source_node_id);
    res.json({
      "state": 0, "message": "操作成功", data: info
    });

  }
  //删除节点
  else if (req.method == "DELETE") {

    var action = URL.parse(req.url, true).query;
    var hasInputData = hasAnyAsSourceConnection(getNode(action.node_id));

    if (hasInputData) {
      res.json({ "state": -1, "message": "当前操作可能会影响下游数据格式，系统已终止此操作" });
    }
    else {
      res.json({ "state": 0, "message": "删除成功", data: deleteNode(action.node_id) });
    }
  }
  else if (req.method == "PUT") {
    var action = req.body;
    var now_node = getNode(action.update_data.id)
    var hasInputData = hasAnyAsSourceConnection(now_node);
    var origin_format;
    var hash;
    if (hasInputData) {
      res.json({ "state": -1, "message": "当前操作可能会影响下游数据格式，系统已终止此操作" });
    }
    else {
      updateNode(now_node, action.update_data);
      res.json({
        "state": 0, "message": " 操作成功", data: { node: getChangeStateNode(now_node) }
      });
    }
  }
  else {
    res.json({});
  }
});
app.use('/Endpoint', function (req, res) {

  //增加端点
  if (req.method == "POST") {
    var action = req.body;
    var t_node = getNode(action.node_id);
    var hasInputData = hasAnyAsSourceConnection(t_node);
    if (hasInputData) {
      res.json({ "state": -1, "message": "当前操作可能会影响下游数据格式，系统已终止此操作" });
    }
    else {
      var ep = createEndPoint(action.node_id, action.is_source);
      res.json({

        "state": 0, "message": "操作成功", data: {
          node: getChangeStateNode(t_node),
          endpoints: [{ value: ep, type: "insert" }]
        }
      });
    }
  }
  //删除端点
  else if (req.method == "DELETE") {
    var action = URL.parse(req.url, true).query;
    var t_node = getNode(getEnpoint(action.endpoint_id).node_id);
    var hasInputData = hasAnyAsSourceConnection(t_node);
    if (hasInputData) {
      res.json({ "state": -1, "message": "当前操作可能会影响下游数据格式，系统已终止此操作" });
    }
    else {
      var data = deleteEndPoint(action.endpoint_id);
      data.node = getChangeStateNode(t_node);
      res.json({
        "state": 0, "message": "操作成功", data: data
      });
    }
  }
  //修改端点
  else if (req.method == "PUT") {
    var action = req.body;
    var t_node = getNode(getEnpoint(action.update_data.id).node_id);
    var hasInputData = hasAnyAsSourceConnection(t_node);
    if (hasInputData) {
      res.json({ "state": -1, "message": "当前操作可能会影响下游数据格式，系统已终止此操作" });
    }
    else {
      var data = updateEndPoint(action.update_data);
      data.node = getChangeStateNode(t_node);
      res.json({
        "state": 0, "message": "操作成功", data: data
      });
    }
  }
  else {
    res.json({});
  }
});
app.use('/Line', function (req, res) {

  if (req.method == "POST") {
    var action = req.body;
    //1.源端点格式覆盖当前端点格式
    //2.依次判断当前节点至下游所有节点状态是否有更新
    //3.若当前源端点无格式状态,连接失败
    if (action.source_epid && action.target_epid) {
      var sourceEp = getEnpoint(action.source_epid);
      var targetEp = getEnpoint(action.target_epid);
      var s_node = getNode(sourceEp.node_id);
      var t_node = getNode(targetEp.node_id);
      if (sourceEp.format) {
        var conn = createConnction(action.source_epid, action.target_epid);
        if (conn) {
          lines.push(conn);
          res.json({
            "state": 0, "message": "操作成功", data: {
              node: getChangeStateNode(t_node),
              lines: [{ value: conn, type: "insert" }],
              endpoints: [{ value: targetEp, type: "update" }]
            }
          });
        }
      }
      else {
        res.json({ "state": -1, "message": "当前端口缺少输出格式,无法创建下游节点." });
      }

    }
    else {
      res.json({ "state": -1, "message": "当前动作缺少必要参数" });

    }
  }
  //删除连接
  else if (req.method == "DELETE") {

    var action = URL.parse(req.url, true).query;
    if (action.connection_id) {
      var t_node = getTargeNodeByConnId(action.connection_id);
      var hasInputData = hasAnyAsSourceConnection(t_node);
      if (hasInputData) {
        res.json({ "state": -1, "message": "当前操作可能会影响下游数据格式，系统已终止此操作" });
      }
      else {
        var conn = deleteConnection(action.connection_id);
        if (conn) {
          res.json({
            "state": 0, "message": "操作成功", data: {
              node: getChangeStateNode(t_node),
              lines: [{ value: conn, type: "delete" }],
            }
          });
        }
      }
    }
  }
  else if (req.method == "PUT") {
    var action = req.body;
    var t_node = getTargeNodeByConnId(action.update_data.id);
    var hasInputData = hasAnyAsSourceConnection(t_node);
    if (hasInputData) {
      res.json({ "state": -1, "message": "当前操作可能会影响下游数据格式，系统已终止此操作" });
    }
    else {
      var data = updateConnection(action.update_data);
      data.node = getChangeStateNode(t_node);
      res.json({
        "state": 0, "message": " 操作成功", data: data
      });
    }
  }
  else {
    res.json({});
  }
});
app.use('/FlowApp', function (req, res) {
  res.json({
    "state": 0, "message": " 操作成功", "data": flow_app
  });
});
app.use('/Flow', function (req, res) {
  var request = req.body;
  res.json({
    "state": 0, "message": " 操作成功", "data": { node: node, lines: lines, endpoints: endPoint }
  });
});

var init_data = function () {
  var options = {
    host: "192.168.1.3",
    port: 8090,
    path: "/Dictionary",
    method: 'get'
  }
  var sendmsg = '';
  req = http.request(options, function (req) {
    req.on("data", function (chunk) {
      sendmsg += chunk;
    });
    req.on("end", function (d) {
      var chunk = JSON.parse(sendmsg).data;
      var arry = [];
      if (chunk.data_type) {
        chunk.data_type.forEach(function (v) {
          if (v.isBasic) {
            arry.push(v);
          }
        })

      }
      var init_node = {
        id: "base_data_001",
        app_id: flow_app[0].id,
        name: "待清洗数据",
        connections: [],
        width: null,
        height: null,
        x: null,
        y: null,
        state: {
          status: "prepared",  //unprepared,stop,running
          passed_number: 0,

        },
        parameters: {},
        excepetion: []

      };
      type_code_arry = arry;
      node.push(init_node);
      endPoint[0].format = [{
        name: "name",
        type_code: Mock.Random.pick(arry).code
      },
      {
        name: "age",
        type_code: Mock.Random.pick(arry).code
      },
      {
        name: "email",
        type_code: Mock.Random.pick(arry).code
      },
      {
        name: "phone",
        type_code: Mock.Random.pick(arry).code
      },
      {
        name: "address",
        type_code: Mock.Random.pick(arry).code
      },
      {
        name: "sex",
        type_code: Mock.Random.pick(arry).code
      }
      ];
      flow_app[0].setting.forEach(function (v) {
        create_node_parm(init_node.parameters, v.parameters);
      });
      app.listen('8091', () => {
        console.log('监听端口 8091');
      })
    });

  });
  req.end();
};
init_data();
