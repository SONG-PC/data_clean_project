
var Mock = require('mockjs');

//data
var Dictionary;
var Col_metadata;
var Grid;
var Op_list;
//Gird_config 
var row_total = 1000;
var col_total = 7;
var view_total = 500;
//Gird_config 
var getRandomByRank = function (from, to) {
  return Math.floor(Math.random() * (to - from + 1) + from)
};
var get_index = function (count, range) {
  var rtn = [];
  var range_value = [];
  for (var i = range[0]; i < range[1]; i++) {
    range_value.push(i);

  }

  for (var i = 0; i < count; i++) {

    var rdm = getRandomByRank(0, range_value.length - 1);

    rtn.push(range_value[rdm]);
    range_value[rdm] = range_value[range_value.length - 1];
    range_value.pop();
  }

  return rtn.sort(function (a, b) {
    return a - b;
  });

}
var get_up_index = function (range) {
  var rtn = [];
  var range_value = [];
  for (var i = range[0]; i < range[1]; i++) {
    range_value.push(i);

  }
  return range_value;
}
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
//Tools




// data_helper
var op_code = [{
  "code": Mock.Random.guid(),
  "sign": ">",
  "param_count|1-2": 1,
  "tip": Mock.Random.cparagraph(1, 2),


}, {
  "code": Mock.Random.guid(),
  "sign": "<",
  "param_count|1-2": 1,
  "tip": Mock.Random.cparagraph(1, 2),


}, {
  "code": Mock.Random.guid(),
  "sign": "=",
  "param_count|1-2": 1,
  "tip": Mock.Random.cparagraph(1, 2),


  },
  {
    "code": Mock.Random.guid(),
    "sign": ":",
    "readonly":true,
    "param_count": 1,
    "tip": Mock.Random.cparagraph(1, 2),
  }
  ,{
    "code": Mock.Random.guid(),
    "sign": "is",
    "readonly": true,
    "param_count": 1,
    "tip": Mock.Random.cparagraph(1, 2),
  }

];
var type = [
  "select",
  "string",
  "regex",
  "integer",
  "date",
  "column",
  "boolean",
  "dictionary"
];
var repeat = [];

var Base_Mock = {
    "state":"0",
    "message":"响应成功"
}
function map_data(data_type_code) {

  switch (data_type_code) {

    case "Boolean": return Mock.Random.boolean();
    case "Integer": return Mock.Random.integer(1, 3);
    case "Decimal": return Mock.Random.float(1, 3);
    case "Date": return Mock.Random.date();
    case "City": return Mock.Random.city();
    case "Email": return Mock.Random.email();
    default: return Mock.Random.csentence(5);
  }

}
function get_data_type_by_code(code) {
  var name;
  Dictionary.data_type.forEach(function (k) {
    if (k.code == code) {
      name = k.name;
    }
  });
  return name;
}
function get_data_type_by_colid(id) {
  var data_type_code = null;
  Col_metadata.col_data.forEach(function (k) {
    if (k.id == id) {
      data_type_code = k.data_type_code;
    }
  });
  return data_type_code;
}
//根据函数code去构造参数默认值
function create_parm(code, obj, parms, col_id, row_id) {
  col_id = col_id || Mock.Random.getColid();
  row_id = row_id || Mock.Random.integer(1, row_total);
  parms.forEach(function (v) {


    if (v.type == "select") {
      obj[v.name] = v.default;
      if (v.configuration) {
        v.configuration.values.forEach(function (v) {

          create_parm(code, obj, v.parameters);

        })

       
      }


    } else {
      if (v.name == "col_id") {
        obj[v.name] = col_id;
      }
      else if (v.name == "row_id") {
        obj[v.name] = row_id;
      }
      else {
        obj[v.name] = v.default;
      }

    }
  });


}
//根据函数code去构造参数默认值
function get_fn_parm(code) {
  var rtn;
  Dictionary.function_data.forEach(function (v) {
    if (code == v.code) {
      rtn = v;
    }
  });

  return rtn.parameters;
}
//根据参数找
function get_op_parm(code) {
  var rtn;
  Dictionary.op_data.forEach(function (v) {
    if (code == v.code) {
      rtn = v;
    }
  });

  return rtn;
}

//data_helper





//mock_random
Mock.Random.extend({
  op_code: function (count, data) {
    var rtn = [];
    var index_arry = get_index(count, [0, data.length]);
    index_arry.forEach(function (v, i) {

      rtn.push(data[v].code);
    })
    return rtn;
  },
  fn_type: function () {
    return this.pick(type);
  },
  dml: function () {
    return this.pick(["insert", "update","delete"]);
  },
  vue_type: function () {
    return this.pick(["number", "string"]);
  },
  form_data: function () {
    return this.pick(["value", "string"]);
  },
  col: function () {

    return this.pick(Col_metadata.col_data);

  },
  guidOrNull: function () {

    return this.pick([Mock.Random.guid(), null])
  }
  ,
  getColType: function () {
    var arry = Col_metadata.col_data.filter(function (v) {

      if (v.primary == true) {
        return false
      }
      else {
        return true;
      }
    })
    return this.pick(arry).data_type_code
  },
  getOpCode: function () {
    return this.pick(Dictionary.op_data).code;
  }
  ,
  getSope: function () {
    return this.pick(["col","row"]);
  }
  ,
  getColid: function () {
    var arry = Col_metadata.col_data.filter(function (v) {

      if (v.primary == true) {
        return false
      }
      else {
        return true;
      }
    })
    return this.pick(arry).id;
  }
  ,
  getFilterType: function () {
    return this.pick(["Pattern","Vue","Defined"]);
  },
  getFnListCode: function () {

    return this.pick(Dictionary.function_data).code;
  }
})

//mock_random







var response= {
  init_data: function () {
    //构造字典Mock


    var dictionary = extend({}, Base_Mock);
    dictionary.data = {}
    dictionary.data.op_data = Mock.mock(op_code);
    dictionary.data["data_type|7"] = [
      {
        // 属性 id 是一个自增数，起始值为 1，每次增 1
        'code': "@guid",
        'name|+1': ['City', 'Email','String', 'Integer', 'Boolean', 'Decimal', 'Date'],
        'reg': "[sS]*.*[^s][sS]*",
        'op_code': Mock.Random.op_code(Mock.Random.integer(1, 2), dictionary.data.op_data)

      }
    ];
 
    var fn_dic = [
      {
        // 属性 id 是一个自增数，起始值为 1，每次增 1
        'code': "@guid",
        'name': '@word(3)',
        'label': '@cword(3)',
        'category|+1': ["字符串", "日期", "数据清洗", "数值", "单位换算"],
        'shortcut|1': "@boolean",
        'category_icon_url': "@image",
        'description': '@cparagraph(2)',
        'dynamic': "@boolean",
        'doc_url': "@image",
        'fn_icon':"@image",

      }
    ];
    var parm = [{
      'name': '@word(3)',
      'label': '@cword(3)',
      "default": 0,
      'value':0,
      "description": '@cparagraph(2)',
      'neccesary|1': "@boolean",
      'read_only|1': "@boolean",
      'type': "@fn_type",
    }
    ];
    var fn_di = Mock.mock({ "function_data|17": fn_dic });
    var fn_dic_data = fn_di.function_data ;
    fn_dic_data.forEach(function (v) {
      var d = Mock.mock({ "parameters|1-3": parm });
      v.parameters = d.parameters;
      v.parameters.forEach(function (v) {
        if (v.type == "select") {
         var configuration_mock= {
           'mutiple|1': "@boolean",
           "values|1-3": [
             {
               'label': '@cword(3)',
               'value|+1': 0,
               "parameters|1-3": Mock.mock([{
                 'name': '@word(3)',
                 'label': '@cword(3)',
                 "default": 0,
                 'value': 0,
                 "description": '@cparagraph(2)',
                 'neccesary|1': "@boolean",
                 'read_only|1': "@boolean",
                 'type': Mock.Random.pick([
                   "string",
                   "regex",
                   "integer",
                   "date",
                   "column",
                   "boolean",
                   "dictionary"
                 ]),
               }
               ])//嵌套一个新的 parameter 对象

             }]
          };
          v.configuration = Mock.mock(configuration_mock);
        }
      })

    });
    fn_dic_data.forEach(function (v) {
      var scope = Mock.Random.pick(["row", "col"]);
      if (scope == "col") {
        v.parameters.unshift({
            'name': 'col_id',
            'label': '选择列',
            "default": null,
            "description": '当前函数操作列',
            'neccesary': true,
            'read_only': false,
            'type': "column",
            'default': null,
            'value': null
          });      
      }
      else {
        v.parameters.unshift({
          'name': 'row_id',
          'label': '行号',
          "default": null,
          "description": '当前操作行号',
          'neccesary': true,
          'read_only': false,
          'type': "integer",
          'value': null
        });
      }
      v.parameters.unshift({
        'name': 'scope',
        'label': '作用域',
        "default": scope,
        "value": scope,
        //"configuration": {
        //  "mutiple": false,
        //  "values": [{
        //    'label': '列',
        //    'value': "col",
        //    'parameters': [{
        //      'name': 'col_id',
        //      'label': '选择列',
        //      "default": null,
        //      "description": '当前函数操作列',
        //      'neccesary': true,
        //      'read_only': false,
        //      'type': "column",
        //      'default': null,
        //      'value':null
        //    },
        //    {
        //      'name': 'col_content',
        //      'label': '匹配内容',
        //      "default": null,
        //      "description": '仅操作匹配内容',
        //      'neccesary': false,
        //      'read_only': false,
        //      'type': "regex",
        //      'value': null
        //    }

        //    ]
        //  }, {
        //    'label': '行',
        //    'value': "row",
        //    'parameters': [
        //      {
        //        'name': 'row_id',
        //        'label': '行号',
        //        "default": null,
        //        "description": '当前操作行号',
        //        'neccesary': true,
        //        'read_only': false,
        //        'type': "integer",
        //        'value': null
        //      }
        //    ]
        //  }]
        //},
        "description": '当前函数作用域类型',
        'neccesary': true,
        'read_only': false,
        'type': null,
      });

      
    });
    dictionary.data["function_data"] = fn_dic_data;
    dictionary.data["grid_op_mapping"] = {
      "swap": Mock.Random.pick(fn_dic_data).code,
      "delete": Mock.Random.pick(fn_dic_data).code
    };
    var data = Mock.mock(dictionary);
    data.data.data_type.forEach(function (v, i) {

      if (v.name == "City" || v.name == "Email") {
        v.isBasic = false
      }
      else {
        v.isBasic = true
      }
    })




    // 输出结果
    //console.log(JSON.stringify(data, null, 4))
    Dictionary= data.data;
    this.col_meta_data(Dictionary);
  
  },
 
  getSuggestionFromDictionary: function () {
    var number = Mock.Random.integer(1, 6);
    var arry = [];
    for (var i = 0; i < number; i++) {
      arry.push(Mock.Random.pick(Dictionary.function_data))
    }
    return arry;

  },
  col_meta_data: function (dictionary) {
   
    var col = {
      "col_metadata": { //(列元数据)
        "col_data|7": [ //列定义 
          {
            'primary': false,
            'name': '@cword(3)',
            'id': "@guid",
            "data_type_code": dictionary.data_type[0].code,//列选择类型编码
            "data_type_suggestion": dictionary.data_type.map(function (v) { if (!v.isBasic) { return { isBasic: v.isBasic, code: v.code, match_per: Mock.Random.integer(1, 100) } } else { return { isBasic: v.isBasic, code: v.code } } }).filter(function (v) { if (v) return true; else return false; }),


          }
        ],
        "col_analysis": { //列定义 

        }
        
      },
     
    };

    var data = Mock.mock(col);

    var anaysisi = {
      "quality": [{
        "type": "有效",
        "count": "@integer(10000,200000)", //数量
        "percent": "33.3" //占比
      },
      {
        "type": "无效",
        "count": "@integer(10000,200000)", //数量
        "percent": "33.3" //占比
      },
      {
        "type": "空值",
        "count": "@integer(10000,200000)", //数量
        "percent": "33.3" //占比
      }

      ],
      "vue": {
          "data|100": [{
            "total": "@integer(1000, 2000)",//当前版本总量
            "match": "@integer(500, 1000)", //当前过滤条件下总量
            "content": '@csentence(5)',//分析为字符串时内容值
          }],
          "type": "@vue_type" ,//分析类型 值分析/字符串分析
      
      },
      "pattern|10": [{ //模式数据
        "total": "@integer(1000, 2000)",//当前版本总量
        "match": "@integer(500, 1000)", //当前过滤条件下总量
        "content": '@csentence(5)',//分析为字符串时内容值
        "child": null//子模式 
      }]
    };

    data.col_metadata.col_data.forEach(function (v) {
      if (!v.primary)
        data.col_metadata.col_analysis[v.id] = Mock.mock(anaysisi);

    })



    data.col_metadata.col_data.forEach(function (v, k) {
      v.data_type_code = dictionary.data_type[k].code;
    })
    Col_metadata = data.col_metadata;
    Col_metadata.col_data.unshift({     
        'primary': true,
        'name': '序号列',
        'id': "-", 
    })
    this.grid_data(Col_metadata);
    this.op_list();
   // console.log(JSON.stringify(data, null, 4))
  },
  createOne_op: function (filter, parameters, parent_op_id, fn_code) {
  
    var fn = null;
    Dictionary.function_data.forEach(function (v) {
      if (v.code == fn_code) {
        fn = v.code;
      }
    });
    var col_data_type = null;

    if (fn) {
 
      var data = {
        "parent_op_id": parent_op_id || null, //父级op_id
        //"height": 0,
        //"isEdit": false,
        //"tip": null,
        //"exception": Mock.Random.pick([["参数校验失败"],[]]),
        //"info": ["运行函数不是最新版本"],
       // "warning": ["运行存在风险"],
        "id": "@guid", //当前操作id
        "fn_list_code": fn, //当前函数编码
        "turn": true,//开关,
        "col_data_type": parameters.col_id? get_data_type_by_colid(parameters.col_id):null,//当前列数据类型编码
        "parameters": parameters,
        "filters": filter
      };
      return Mock.mock(data);
    }
    else {
      return fn;
    }
  },
  op_list: function () {
    var steps = [];
    for (var i = 0; i < 10; i++) {
      steps.push(Mock.Random.guid());
    }
    var data = {
      "op_list|0": [
        {
          "parent_op_id": null, //父级op_id
          "id": "@guid", //当前操作id
          "fn_list_code":"@getFnListCode", //当前函数编码
          "turn": true,///开关,
          //"isEdit": false,
          //"tip": null,
          ////"exception": [],
          ////"info": [],
          ////"warning":[],
          //"height": 0,
          "col_data_type": "@getColType",//当前列数据类型编码
          "parameters": { "scope": "@getSope", "col_id": Mock.Random.col().id, "row_id": Mock.Random.integer(1, Grid.full_data.length) },
          "filters":[ { //过滤条件
            "type":"@getFilterType" ,  //过滤类型 值，内部表达式,表达式
            "col_id":"@getColid", //操作列对象
            "op_code": "@getOpCode", //操作符编码
            "child": null ,//子过滤条件
            "parameters": []
          }]

        }]
    };
    
    var data_com = Mock.mock(data);
    data_com.op_list.forEach(function (v) {
      create_parm(v.fn_list_code, v.parameters, get_fn_parm(v.fn_list_code));
      v.filters.forEach(function (k) {
        for (let i = 0; i < get_op_parm(k.op_code).param_count; i++) {
          k.parameters.push(0);
        }
    });
    });

    var steps = {
        "steps|0":["@guid"]
    }
 
    Op_list = { "op_list":data_com.op_list,"steps" :Mock.mock(steps).steps };
  
  }
  ,
  create_new_filter() {
    var data = {
      "filters": [{ //过滤条件
        "type": "@getFilterType",  //过滤类型 值，内部表达式,表达式
        "col_id": "@getColid", //操作列对象
        "op_code": "@getOpCode", //操作符编码
        "child": null,//子过滤条件
        "parameters": []
      }]
    };
    var d = Mock.mock(data);
    d.filters.forEach(function (k) {
      for (let i = 0; i < get_op_parm(k.op_code).param_count; i++) {
        k.parameters.push(0);
      }
  
    });
    return d.filters;
  },
  get_grid_diff: function (col_metadata,post_data) {
    col_metadata = col_metadata || Col_metadata;
    var d = Mock.Random.integer(1, col_metadata.col_data.length - 2);
    var arry = get_index(d, [0, col_metadata.col_data.length - 2]);
    //从列定义中随便选几行生成列差异数据
    var col_diff = {};
    arry.forEach(function (v) {
      col_diff[col_metadata.col_data[v].id] = Mock.Random.dml();
    });



    var diff = {
      "diff_data": [
      ]
    };

    //当前视窗
    if (post_data && post_data.view_type && post_data.view_range) {
      if (post_data.view_type == "view") {
        post_data.view_range.forEach(function (v) {
          diff.diff_data.push({
            col_diff: col_diff,
            row_diff: Mock.Random.dml(),
            row_id: v
          })
        });
      }
      else {
        //从当前过滤中拿50条数据
        if (Grid.view_range && Grid.view_range.length > 0) {
          var count=0;
          Grid.view_range.forEach(function (v) {
            var flag = Mock.Random.boolean();
            if (flag) {
              diff.diff_data.push({
                col_diff: col_diff,
                row_diff: Mock.Random.dml(),
                row_id: v
              })
            }
          });
        }
        //从全量中拿50条数据
        else {
          Grid.full_data.forEach(function (v) {
            var flag = Mock.Random.boolean();
            if (flag) {
              diff.diff_data.push({
                col_diff: col_diff,
                row_diff: Mock.Random.dml(),
                row_id: v.row_id
              })
            }
          });
        }

      }
    }
    return diff.diff_data.sort(function (a, b) {
      return a.row_id - b.row_id;
    });

  },
  grid_data: function (col_metadata) {
    
    var tp = {
      "grid": { //(网格数据)

        "full_data": get_up_index([1, row_total]),
        "view_range": get_index(view_total, [1, row_total])
      }
    };

    var data = Mock.mock(tp);
 

  
  
    //生成全量数据

    data.grid.full_data.forEach(function (v,i) {
      data.grid.full_data[i] = { "-": v };

      col_metadata.col_data.forEach(function (d) {

        if (!d.primary) {

          data.grid.full_data[i][d.id] = map_data(get_data_type_by_code(d.data_type_code));
        }
      })

    })
   
    Grid = data.grid;
    Grid.diff_data = this.get_grid_diff(col_metadata);
    Grid.diff_data.forEach(function (v, k) {
      col_metadata.col_data.forEach(function (d, b) {
        if (!d.primary)
          v[d.id] = Mock.Random.csentence(5);
      });
    });
  }
}
















//interface
let express = require('express');   //引入express
let bodyParser = require('body-parser');

let app = express();        //实例化express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
response.init_data();
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.use('/Dictionary', function (req, res) {
  var resp_data = extend({}, Base_Mock);
  resp_data.data = Dictionary;
  res.json(resp_data);
});
app.use('/Diff', function (req, res) {

   
    if (req.method == "POST") {
      var grid = {};
      if (req.body.view_type) {
      
        var flag = (!req.body.current_version && !req.body.previous_version) || (req.body.current_version ==req.body.previous_version);
        if (!flag) {
          grid.diff_data  = response.get_grid_diff(Col_metadata, req.body);
        }
        else {
          grid.diff_data = [];
          grid.full_data=Grid.full_data,
          grid.view_range=Grid.view_range  
        }
     
      res.json({
        "state": 0,
        "message": "响应成功",
        "data": {
          "grid": grid,
          "col_metadata": Col_metadata

        }
      });
    }
    else {

      res.json({ "state": -1, "message": "请求参数有误" });
    }

  }
  else {
    res.json({});
  }




});
app.use('/Action', function (req, res) {
  var resp_data = extend({}, Base_Mock);
  var reqJson = req.body;
  if (req.method == "OPTIONS") {
    res.json({});
  }
  else
  if (req.method == "GET") {


    resp_data.data = {
      "operation": Op_list,
      "grid": {
        "full_data": Grid.full_data
      },
      "col_metadata": Col_metadata

    }
    res.json(resp_data);

  }
  else if (req.method == "POST") {

    if (reqJson.actions) {
      var data = {
        grid: null,
        col_metadata: null,
        operation: null
      }

      if (reqJson.filter && reqJson.filter.length > 0) {

        grid = Grid;
      }
      else {
        grid = { "full_data": Grid.full_data };
      }
      if (reqJson.actions && reqJson.actions.length > 0) {
        var up = false;
        reqJson.actions.forEach(function (v) {
          var op = response.createOne_op(v.filters, v.parameters, v.parent_op_id, v.fn_code);
          if (op) {
            Op_list.op_list.push(op)
            Op_list.steps.push(Mock.Random.guid());
            up = true
          }
          else {
            up = false
          }
        });
        if (up) {
          data.grid = grid;
          data.operation = Op_list;
          data.col_metadata = Col_metadata;
          resp_data.data = data;
          res.json(resp_data);
        }
        else {
          res.json({ "state": -1, "message": "函数不存在或请求参数有误" });

        }
      }
      else {
        res.json({ "state": 2, "message": "无改变" });
      }
 
    }
    else {
      res.json({ "state": -1, "message": "请求参数有误" });
    }

  }
  else if (req.method == "PUT") {
    if (reqJson.updates) {
      if (reqJson.updates && reqJson.updates.length > 0) {
        var update = false;
        Op_list.op_list.forEach(function (v) {
          reqJson.updates.forEach(function (k) {
            if (v.id == k.current_op_id) {
              v.filters = k.filters;
              v.parameters = k.parameters;
              update = true;
            }
          })


        });
        if (update) {
          resp_data.data = {
            grid: Grid,
            col_metadata: Col_metadata,
            operation: Op_list
          };
          res.json(resp_data);
        }
        else {
          res.json({ "state": 2, "message": "修改函数不存在" });
        }
      } else {
        res.json({ "state": 2, "message": "无改变" });
      }
    }
    else {
      res.json({ "state": -1, "message": "请求参数有误" });
    }
  } 
});
app.use('/CardOp', function (req, res) {
  var error_data = null
  var resp_data = extend({}, Base_Mock);
  if (req.method == "POST") {
    var update = false;
    if (req.body.current_op_id && req.body.type) {
      if (req.body.type == "swap") {
        var cur_index;
        var previous__index = 0;
        var obj;
        Op_list.op_list.forEach(function (v, i) {
          if (v.id == req.body.current_op_id) {
            obj = v;
            cur_index = i;
          }
          if (v.id == req.body.previous_op_id) {
            previous_index = i;
          }
        })
        if (previous_index == cur_index) {
          for (var i = cur_index - 1; i >= 0; i--) {
            Op_list.op_list[i + 1] = Op_list.op_list[i];
          }
          Op_list.op_list[0] = obj;
          update = true;
        }
        else if (previous_index > cur_index) {
          for (var i = cur_index + 1; i <= previous_index; i++) {
            Op_list.op_list[i - 1] = Op_list.op_list[i];
          }
          Op_list.op_list[previous_index] = obj;
          update = true;
        }
        else if (previous_index < cur_index) {

          for (var i = cur_index - 1; i > previous_index; i--) {
            Op_list.op_list[i + 1] = Op_list.op_list[i];
          }
          Op_list.op_list[previous_index + 1] = obj;
          update = true;
        }



      }
      else if (req.body.type == "delete") {

        Op_list.op_list.forEach(function (v, i) {
          if (v.id == req.body.current_op_id) {
            Op_list.op_list.splice(i, 1);
            Op_list.steps.splice(i, 1);
            update = true;
          }

        })
      }
      else if (req.body.type == "turn") {

        Op_list.op_list.forEach(function (v, i) {
          if (v.id == req.body.current_op_id) {
          //  if (v.exception.length <= 0) {
              v.turn = !v.turn;
              if (v.turn) {
                Op_list.steps.splice(i, 0, Mock.Random.guid());
                for (let idx = i + 1; idx < Op_list.steps; idx++) {
                  Op_list[idx] = Mock.Random.guid();
                }
              }
              else {
                Op_list.steps.splice(i, 1);
                for (let idx = i; idx < Op_list.steps; idx++) {
                  Op_list[idx] = Mock.Random.guid();
                }
              }
              update = true;
          //  }
          //  else {
          //    error_data={ "state": -1, "message": "当前函数存在异常,无法启动" };
          //  }
          }
        })

      }
      if (update) {
        resp_data.data = {
          grid: Grid,
          col_metadata: Col_metadata,
          operation: {
            op_list: Op_list.op_list,
            steps: Op_list.steps
          }
        };
        res.json(resp_data);

      } else {

        res.json(error_data||{ "state": -1, "message": "未找到操作对象" });
      }
    }
    else {

      res.json({ "state": -1, "message": "请求参数有误" });



    }



  }
  else {
    res.json({ });
  }

});

app.use('/UpdateColMetaData', function (req, res) {
  if (req.method == "POST") {
    var resp_data = extend({}, Base_Mock);
    if (req.body.id && (req.body.data_type_code || req.body.name)) {
      var update = false;
      Col_metadata.col_data.forEach(function (v) {
        if (v.id == req.body.id) {

          v.name = req.body.name || v.name;
          v.data_type_code = req.body.data_type_code || v.data_type_code;
          update = true;
        }


      });
      if (update) {
        var rtn = { col_metadata: Col_metadata };
        //if (req.body.data_type_code) {
        //  rtn.suggestion = response.getSuggestionFromDictionary()
        //}
        res.json({ "state":0, "message": "请求成功", data:rtn });
      }
      else {
        res.json({ "state": -1, "message": "请求参数有误" });
      }
    }
    else {
      res.json({ "state": -1, "message": "请求参数有误" });
    }
  }
  else {
    res.json({});
  }
});
app.use('/Suggestion', function (req, res) {
  if (req.method == "POST") {
    if (req.body.type) {
      res.json({ "state": 0, "message": "请求成功", data: { suggestion: response.getSuggestionFromDictionary() }});
    }
    else {
      res.json({ "state": -1, "message": "请求参数有误" });
    }
  }
  else {
    res.json({ });
  }
});
app.use('/Filter', function (req, res) {
  var resp_data = extend({}, Base_Mock);
  if (req.method == "POST") {
    if (req.body.filters) {
      if (req.body.filters.length > 0) {
        Grid.view_range = get_index(view_total, [1, row_total]);
        resp_data.data = {
          "grid": {
            view_range: Grid.view_range 
          },
          "col_metadata": {
            col_analysis: Col_metadata.col_analysis
          }
        };
        res.json(resp_data);
      }
      else {
        Grid.view_range = [];
        resp_data.data = {
          "grid": {
            view_range: Grid.view_range 
          },
          "col_metadata": {
            col_analysis: Col_metadata.col_analysis
          }
        };
        res.json(resp_data);
      }

    }
    else {
      res.json({ "state": -1, "message": "请求参数有误" });
    }
  }
  else {
    res.json({
      
    });
  }
});
app.use('/Restart', function (req, res) {
  response.init_data();
  res.json({ "state": 0, "message": "重启成功" });
});
app.use('/Preview', function (req, res) {
 
  if (req.method == "POST") {
    if (req.body.op_list) {


      res.json({ "state": 0, "message": "请求成功", data: Mock.Random.guid()});
    }
    else {

      res.json({ "state": -1, "message": "请求参数有误" });
    }

  }
  else {
    res.json({});
  }
});
app.use('/Example', function (req, res) {
  //获取当前版本与上一版本差异信息
  var all_post = [];

  var interface_1 = Mock.mock(
    {
      desc: "获取当前版本与上一版本差异信息",
      "example": {
        "view_type": Mock.Random.pick(["diff", "view"]),  //显示方式  1.[行号]为锁定行范围    2.”diff”为差异方式显示
        "view_range|1-50": ["@integer(1," + row_total + ")"],
        "current_version": Mock.Random.pick(Op_list.steps),//当前版本号
        "previous_version": Mock.Random.pick(Op_list.steps) //差异版本号

      }
    }
  );
  all_post.push(interface_1);
  var function_obj = Mock.Random.pick(Dictionary.function_data);
  var function_parm = {};
  create_parm(function_obj.code, function_parm, get_fn_parm(function_obj.code));
  var op_obj = Mock.Random.pick(Op_list.op_list);
  var op_parm = {};
  create_parm(op_obj.fn_list_code, op_parm, get_fn_parm(op_obj.fn_list_code));

  var interface_2 = Mock.mock(
    {
      get: {
        desc: "获取当前清洗进度",
        wash_id: "1234567"
      },
      post: {
        "desc": "提交函数",
        "example": {
          "actions": [{
            "fn_code": function_obj.code, //当前函数编码
            "parameters": function_parm,
            "filters": op_obj.filters

          }]
        }
      }
      ,
      update: {
        "desc": "更新函数",
        "example": {
          "updates": [{
            "current_op_id": Mock.Random.pick(Op_list.op_list).id,//当前操作op_id
            "parameters": op_parm,
            "filters": [{ //过滤条件
              "type": "@getFilterType",  //过滤类型 值，内部表达式,表达式
              "col_id": "@getColid", //操作列对象
              "op_code": "@getOpCode", //操作符编码
              "child": null,//子过滤条件
              "filters": op_obj.filters
            }]
          }]
        }
      }
    });
  all_post.push(interface_2);
  var interface_3 = Mock.mock({
    "desc": "函数卡片操作",
    "example": {
      current_op_id: Mock.Random.pick(Op_list.op_list).id,//当前操作ID 
      previous_op_id: Mock.Random.pick(Op_list.op_list).id,//上一步操作ID 
      type: Mock.Random.pick(["swap", "delete", "turn"]) //操作类型 移动/屏蔽/删除/执行到这一步
    }

  })
  all_post.push(interface_3);
  var interface_4 = Mock.mock(
    {
      "desc": "修改列定义",
      "example": {
        name: "测试", //列名
        id: Mock.Random.col().id, //列编码
        data_type_code: Mock.Random.pick(Dictionary.op_data).code//列选择类型编码

      }
    });
  all_post.push(interface_4);
  var interface_5 = Mock.mock(
    {
      "desc": "客户端焦点改变",
      "example": {
        type: Mock.Random.pick(["col", "row"]), //选中类型  行/列
        col_id_range: [Mock.Random.col().id],  //列
        row_id_range: [Mock.Random.integer(1, row_total)], //行范围
        cell_range: [{ col_id: Mock.Random.col().id, row_id: Mock.Random.integer(1, row_total)}  ], //单元格
        select_content: { col_id: Mock.Random.col().id, row_id: Mock.Random.integer(1, row_total), start:0, end:1 } //选中内容

      }
    });




  all_post.push(interface_5);

  var interface_6 = Mock.mock(
    {
      "desc": "过滤当前视图",
      "example": {
        filters: response.create_new_filter()
      }
    });
  all_post.push(interface_6);


  var interface_7 = Mock.mock(
    {
      "desc": "预览当前函数",
      "example": {
        "previews": [//待预览函数
          {
            fn_code: function_obj.code, //当前函数编码
            parameters: function_parm,
            filters: response.create_new_filter()
          }
        ],
        "view_type": "view",
        "view_range": get_index(10, [1, row_total])
      }
    });

  all_post.push(interface_7);
  res.json(all_post);
});


app.listen('8090', () => {
  console.log('监听端口 8090')
})


//interface
