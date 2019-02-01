var basicType = {
  connector: "StateMachine",
  paintStyle: {
    stroke: "red",
    strokeWidth: 4
  },
  hoverPaintStyle: {
    stroke: "blue"
  },
  overlays: ["Arrow"]
};
var nowOverEp = null;
// this is the paint style for the connecting lines..
var connectorPaintStyle = {
  strokeWidth: 2,
  stroke: "#61B7CF",
  joinstyle: "round",
  outlineStroke: "white",
  outlineWidth: 2
},
  // .. and this is the hover style.
  connectorHoverStyle = {
    strokeWidth: 3,
    stroke: "#216477",
    outlineWidth: 5,
    outlineStroke: "white"
  },
  endpointHoverStyle = {
    fill: "#216477",
    stroke: "#216477"
  },
  endpointHoverStyle2 = {
    fill: "#216477",
    stroke: "#216477"
  },
  // the definition of source endpoints (the small blue ones)
  sourceEndpoint = {
    endpoint: "Dot",
    paintStyle: {
      stroke: "#7AB02C",
      fill: "transparent",
      radius: 7,
      strokeWidth: 1
    },
    maxConnections: -1,
    isSource: true,
    connector: ["Flowchart", { stub: [40, 60], gap: 9, cornerRadius: 5, alwaysRespectStubs: true, }],
    connectorStyle: connectorPaintStyle,
    hoverPaintStyle: endpointHoverStyle,
    connectorHoverStyle: connectorHoverStyle,
    dragOptions: {},
    overlays: [["Label", {
      location: [0.5, 1.5],
      label: "Drag",
      cssClass: "endpointSourceLabel",
      visible: false
    }]]
  },
  // the definition of target endpoints (will appear when the user drags a connection)
  targetEndpoint = {
    endpoint: "Dot",
    paintStyle: {
      fill: "#7AB02C",
      radius: 7
    },
    hoverPaintStyle: endpointHoverStyle2,
    maxConnections: 1,
    dropOptions: {
      hoverClass: "hover",
      activeClass: "active"
    },
    isTarget: true,
    overlays: [["Label", {
      location: [0.5, -0.5],
      label: "Drop",
      cssClass: "endpointTargetLabel",
      visible: false
    }]]
  };
require('../../plugins/Jsplumb/css/jsplumbtoolkit-defaults.css');
require('../../plugins/Jsplumb/dist/js/jsplumb');
import common from '../common'
import { ENGINE_METHOD_PKEY_ASN1_METHS } from 'constants';


var instance_base = null;
export default (function () {
  var instance = function (Container, caller) {

    this.caller = caller;
    this.endpoint = [];
    this.connection = [];
    this.inIndex = 0;
    this.outIndex = 0;
    this.Node = Node;
    this.instance = jsPlumb.getInstance({
      // default drag options
      DragOptions: {
        cursor: 'pointer',
        zIndex: 2000
      },
      // the overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in this
      // case it returns the 'labelText' member that we set on each connection in the 'init' method below.
      ConnectionOverlays: [["Arrow", {
        location: 1,
        visible: true,
        width: 11,
        length: 11,
        id: "ARROW",
        events: {
          click: function () {

          }
        }
      }], ["Label", {
        location: 0.5,
        id: "label",
        cssClass: "aLabel",
        events: {
          tap: function () {
            alert("hey");
          }
        }
      }]],
      Container: Container
    });

    this.instance.registerConnectionType("basic", basicType);
    this._bindEvent(caller);



  }
  function jsPlumbNode(id) {
    this.node_id = id;
    this.endpoints = [];
    this.in_index = 0;
    this.out_index = 0;
  }
  instance.prototype = {
    _init: function (id) {

      var node = jsPlumb.getSelector(".flowchart-demo #" + id);
      this.instance.draggable(node, {
        grid: [20, 20]
      });
      this.instance.batch(function () {


      }.bind(this));
      return new jsPlumbNode(id);
    },
    _renamePoint(point) {


    },
    _destroy: function () {

      instance_base = null;

    },
    _addEndpointInput: function (node, ep) {
      var _super = this.caller;
      var sourceUUID = ep.id;
      var ed = this.instance.addEndpoint(node.node_id, targetEndpoint, {
        anchor: null,
        uuid: sourceUUID
      });

      ed.bind("mouseover", function (ep, e) {
        e.stopPropagation();
        e.preventDefault();
        var eleRect = e.target.getBoundingClientRect();
        var center = { x: (eleRect.left + eleRect.width / 2), y: (eleRect.top + eleRect.height / 2) };
        nowOverEp = {
          endpoint: ep,
          center: center
        };
      });
      ed.state = [];
      ed.name = ep.name;
      ed.canvas.title = ep.name;
      ed.uuid = sourceUUID;
      ed.stand = ep.stand;
      node.endpoints.push(ed);
      node.in_index++;
      return ed;
    },

    resizeEndPoint: function (isSource, node) {

      var count = isSource ? node.out_index : node.in_index;
      var zoom = 1 / (count + 1);
      var i = 0;
      node.endpoints.forEach(function (v) {
        if (isSource && v.isSource) {
          v.setAnchor([1, (i) * zoom + zoom, 0, 0]);
          i++;
        }
        else if (!isSource && v.isTarget) {

          v.setAnchor([0, (i) * zoom + zoom, 0, 0]);
          i++;

        }


      });
      setTimeout(function () {
        this.instance.repaintEverything();
      }.bind(this), 0)

    },
    _removeOneEndPoint: function (index, isSource) {


    },
    _addEndpointOutput: function (node, ep) {
      var sourceUUID = ep.id;
      var ed = this.instance.addEndpoint(node.node_id, sourceEndpoint, {
        anchor: null,
        uuid: sourceUUID
      });
      ed.state = [];
      ed.name = ep.name;
      ed.canvas.title = ep.name;
      ed.uuid = sourceUUID;
      ed.stand = ep.stand;
      node.endpoints.push(ed);
      node.out_index++;
      return ed;
    },
    _connection: function (uuids, id, format) {

      var _super = this.caller;
      var connection = this.instance.connect({
        uuids: uuids,
        editable: true
      });
      connection.connid = id;
      connection.bind("contextmenu", function (conn, e) {

        var list = [];
        list.push({
          desc: "删除连线",
          fn: function () {
            _super.deleteLine(conn);
          },
          callback: function () {


          }
        });
        _super.$refs.mychild._show({
          list: list,
          top: e.clientY - 72 + _super.getScroll().top,
          left: e.clientX - 200 + _super.getScroll().left
        });
      });
      return connection;
    },
    _hasChildNode: function () {
      var hasChild = false;
      for (let i = 0; i < this.endpoint.length; i++) {

        if (this.endpoint[i].connections.length > 0 && this.endpoint[i].isSource) {
          hasChild = true;
          break;
        }

      }
      return hasChild;

    },
    _isConnection: function () {
      var rtn = false;
      for (let i = 0; i < this.endpoint.length; i++) {

        if (this.endpoint[i].connections.length > 0 && this.endpoint[i].isSource) {
          rtn = true;
          break;
        }
      }
      return rtn;

    },
    _valid: function () {

      //入口数据格式加参校验
      this.endpoint.forEach(function (v) {



      })

    },
    _getEndPointByUUID: function (node, uuid) {
      var rtn;
      node.jsPlumbNode.endpoint.forEach(function (v) {
        if (v.uuid == uuid)
          rtn = v;
      })

      return rtn;
    },
    _bindEvent: function (caller) {

      $(document).on("mousemove", function (e) {
        if (nowOverEp) {
          var ep = nowOverEp.endpoint;
          var center = nowOverEp.center;
          var distance = common.getDistanceBy2Point(center.x, center.y, e.clientX, e.clientY);
          if (distance > 10) {
            caller.format = null;
            // nowOverEp = null;
          }
          //var conn = ep.connections[0];
          //if (conn) {

          var format = caller.getFormatFromEndpoint(ep.uuid);

          if (format && format.length > 0) {
            if (distance < 10) {

              var top = e.clientY - 72 + caller.getScroll().top;
              var left = e.clientX - 200 + caller.getScroll().left
              caller.show_format(format, top, left);

            }


          }
          // }
        }
      });
      //
      // make all the window divs draggable
      //this.instance.draggable(jsPlumb.getSelector(".flowchart-demo .window"), {
      //  grid: [20, 20]
      //});
      // listen for new connections; initialise them the same way we initialise the connections at startup.
      this.instance.bind("connection",
        function (connInfo, originalEvent) {

        }.bind(this));

      // listen for clicks on connections, and offer to delete connections on click.
      //
      this.instance.bind("beforeDetach", function (conn) {

        if (caller.$store.getters.hasLinesByConnId(conn.connid)) {
          caller.deleteLine(conn);
          return false;
        }
        else {
          return true;
        }
        //  
      });
      this.instance.bind("contextmenu",
        function (conn, originalEvent) {

        });

      this.instance.bind("connection",
        function (connection) {
          //  this.instance.deleteConnection(connection)
        }.bind(this));

      this.instance.bind("connectionDragStop",
        function (connection) {

          caller.hideConnect();
        });
      this.instance.bind("connectionDrag",
        function (conn) {
          caller.showConnect(conn.sourceId);

        }.bind(this));
      this.instance.bind("beforeDrop",
        function (conn) {

          if (conn && conn.connection.endpoints[1].connections.length > 0) {
            this.caller.addLine(conn.dropEndpoint.uuid, conn.connection.endpoints[0].uuid)
          }
          return false;

        }.bind(this));

    }

  }

  return instance;

}())
