<template>
  <div class="database" style="height:100%;padding-left:190px;overflow:auto">
    <div class="list" style="overflow:auto;box-sizing:border-box;position:relative;height:100%;float:left;margin-left:-190px;  ">
      <ul id="treeDemo" class="ztree" style="height:100%;margin:0;"></ul>
      <drowlist ref="mychild" />
    </div>
    <div class="add " style="float:left;width:100%;height:100%;
    padding:20px 60px 30px 60px ;"><conn/></div>
  </div>
</template>

<script>
  import $ from 'jquery';
  import '../../assets/plugins/zTree_v3/css/demo.css'
  import '../../assets/plugins/zTree_v3/css/zTreeStyle/zTreeStyle.css'
  import '../../assets/plugins/zTree_v3/js/jquery.ztree.core.js'
  import conn from '../../components/setting/connSetting'
  import drowlist from '../common/drowlist'
  import pre_view from '../../components/preview/table'
  export default {
    mounted: function () {
      var _super = this;
      var setting = {
        data: {
          simpleData: {
            enable: true
          }
        },
        view: {
  
        }
      };

      var zNodes = [
        { id: '1', pId: '0', name: "数据库", open: true, iconSkin: "pIcon01" },
        { id: '01', pId: '1', name: "db1(oracle)", iconSkin: "icon01" },
        { id: '001', pId: '01', name: "sys", iconSkin: "icon02" },
        { id: '0001', pId: '001', name: "表(32)", iconSkin: "icon03" },
        { id: '0002', pId: '001', name: "视图(16)", iconSkin: "icon03"},
        { id: '00001', pId: '0001', name: "tb_user", iconSkin: "icon04" },
        { id: '000001', pId: '00001', name: "id(varchar)", iconSkin: "icon06" },
        { id: '000002', pId: '00001', name: "name(varchar)", iconSkin: "icon05" },
        { id: '000003', pId: '00001', name: "age(varchar)", iconSkin: "icon05" },
        { id: '000004', pId: '00001', name: "name(varchar)", iconSkin: "icon05" },
        { id: '000005', pId: '00001', name: "name(varchar)", iconSkin: "icon05" },
        { id: '00002', pId: '0001', name: "tb_login", iconSkin: "icon04" },
        { id: '00001', pId: '0002', name: "v_check_userid", iconSkin: "icon04" },
        { id: '00002', pId: '0002', name: "v_check_password", iconSkin: "icon04" }
       
      ];
      $.fn.zTree.init($("#treeDemo"), setting, zNodes);
      $("#treeDemo").delegate("a.level0", "contextmenu", function (e) {
 

          _super.$refs.mychild._show({
     
            list: [{
              desc: "刷新", fn: function () {

              }
            },
            {
              desc: "删除全部链接", fn: function () {



              }
              }],
            top: $(this).offset().top ,
            left: $(this).position().left
          });
        
        
      })
      $("#treeDemo").delegate("a.level1", "contextmenu", function (e) {
     
          console.log($(this).offset().top)
          _super.$refs.mychild._show({

            list: [{
              desc: "刷新", fn: function () {


              }
            },
            {
              desc: "删除", fn: function () {



              }
            }],
            top: $(this).offset().top  ,
            left: $(this).offset().left - $("#treeDemo").offset().left
          });
      
        
      });
      $("#treeDemo").delegate("a.level2,a.level3", "contextmenu", function (e) {
    
          console.log($(this).offset().top)
          _super.$refs.mychild._hide();
          _super.$refs.mychild._show({

            list: [{
              desc: "刷新", fn: function () {


              }
            }],
            top: $(this).offset().top ,
            left: $(this).offset().left - $("#treeDemo").offset().left
          });

        
      });
      $("#treeDemo").delegate("a.level4", "contextmenu", function (e) {
  
          console.log($(this).offset().top)
          _super.$refs.mychild._hide();
          _super.$refs.mychild._show({

            list: [{
              desc: "刷新", fn: function () {


              }
            }, {
                desc: "预览", fn: function () {

                  _super.$layer.iframe({
                    content: {
                      content: pre_view, //传递的组件对象
                      parent: _super,//当前的vue对象
                      data: []//props,

                    },

                    area: ['600px', '260px'],
                    title: "tb_user"
                  });
                }
              }],
            top: $(this).offset().top ,
            left: $(this).offset().left - $("#treeDemo").offset().left
          });

        
      })
    },
    components: { conn, drowlist, pre_view}

  }

</script>
