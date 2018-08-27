import front_data from './global_database.js'
export default (function () {
  //预期的标签
  var expect = /[input|select|textarea]/;
  var need_data = /[input]/;

  var tmpl_button = "  <div><button  style=\"margin-right: 50px\" class=\"join\">加入队列</button><button   class=\"reset\">还原</button></div>";
  function createDataCom(dom, tag, k, v) {
    if (tag == "select") {

      dom.options.add(new Option(k, v));
    }

  }
  function createData(data, dom, tag) {
    //本地数据库 

    if (typeof data == "string") {

      for (var p in front_data) {
        if (p == data) {
          for (var i = 0; i < front_data[p].length; i++) {

            createDataCom(dom, tag, front_data[p][i].key, front_data[p][i].value);
          }

        }
      }
    }
    //服务端数据
    else if (typeof data == "object") {

      for (var i = 0; i < data.length; i++) {
        //如果是下拉列表,按如下方式处理 
        createDataCom(dom, tag, data[i].key, data[i].value);
      }
    }
  }

  return {
    resolve: function (options, index) {

      //开始解析
      //第一步看看需要创建什么类型的标签
      var parmArray = options.parm, fn_name = options.fn_name, dom, desc;
      //创建容器
      var container = document.createElement("div");
      container.className = "content";
      container.setAttribute("data-name", fn_name);


      for (var i = 0; i < parmArray.length; i++) {
        var obj = parmArray[i].components;
        var isExpectTag = expect.test(obj.tag);
        isExpectTag ? dom = document.createElement(obj.tag) : false;
        if (dom) {
          //添加容器
          var parm_container = document.createElement("div");
          parm_container.setAttribute("data-name", parmArray[i].parm_name);
          parm_container.setAttribute("data-index", i);
          parm_container.className = "parm";
          dom.setAttribute("name", parmArray[i].parm_name);
          dom.className = "control";
          var isDataCom = false
          if (need_data.test(obj.tag)) {
            isDataCom = true;
          }
          for (var p in obj) {
            if (p == "label" || p == "desc") {
              //创建额外节点
              if (obj[p]) {
                if (p == "label") {

                  var lbl = document.createElement("label");
                  lbl.style.display = "block";
                  lbl.setAttribute("for", parmArray[i].parm_name);
                  lbl.innerHTML = obj.label;
                  parm_container.appendChild(lbl);
                }
                else {

                  desc = document.createElement("span");
                  desc.className = "desc";
                  desc.style.display = "block";
                  desc.innerHTML = obj.desc;
                }
              }
            }
            if (p == "data" && isDataCom == true) {
              //为该节点创建数据 

              createData(obj[p], dom, obj.tag);
            }
            if (p == "value" && obj.tag != "input") {
              dom.innerHTML = obj[p];
            }
            else {
              obj[p] ? dom[p] = obj[p] : false;
            }
          }
          parm_container.appendChild(dom);
          var error = document.createElement("span");
          error.style.display = "block";
          error.className = "error";
          parm_container.appendChild(error);
          if (desc) parm_container.appendChild(desc);

        }
        else {
          console.error("非前端预期的组件");
          return 0;
        }

        container.appendChild(parm_container);
        container.innerHTML += tmpl_button;
      }
      return container;
    }
  }
}());
