<template>
  <div style="position:relative;">
    <ul id="tree" class="ztree" style="height:100%;width:100%;margin:0"></ul>
    <drowlist ref="mychild" />
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
  import Vue from 'vue'
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
     
        { id: '001', pId: '01', name: "sys", iconSkin: "icon02" },
        { id: '0001', pId: '001', name: "表(32)", iconSkin: "icon03" },
        { id: '0002', pId: '001', name: "视图(16)", iconSkin: "icon03" },
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
      Vue.nextTick(function () {
        $.fn.zTree.init($("#tree"), setting, zNodes);

        $("#tree").delegate("a.level2", "mousedown", function (e) {
          if (3 == e.which) {
            console.log($(this).offset().top)
            _super.$refs.mychild._show({

              list: [{
                desc: "预览前100行",
                fn: function () {



                }
            
              },
                {
                  desc: "生成查询语句",
                  fn: function () {



                  }
                }
             ],
              top: $(this).offset().top - $("#tree").offset().top + 20,
              left: $(this).offset().left - $("#tree").offset().left
            });

          }
        });


      })
   



    }
    ,
    components: { drowlist, pre_view }


  }

</script>
