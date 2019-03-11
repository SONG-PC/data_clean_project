var Mock = require('mockjs');
var http = require('http');
var md5 = require('js-md5');
var URL = require('url');
var type_code_arry = null;

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
app.use('/Task', function (req, res) {
  //添加任务
  if (req.method == "POST") {
    var action = req.body;
    var info = addTask(action.name);
    res.json({
      "state": 0, "message": "操作成功", data:info
    });
  }
  //删除任务
  else if (req.method == "DELETE") {

    var action = URL.parse(req.url, true).query;
    var has=getTask(action.id);
    if (has) {
      var id = deleteTask(action.id);
      res.json({ "state": 0, "message": "删除成功", data: id });
    }
    else {
      res.json({ "state": -1, "message": "任务不存在"});

    }
  }
  else if (req.method == "PUT") {
    var action = req.body;


  }
  else {
    res.json({});
  }
});
