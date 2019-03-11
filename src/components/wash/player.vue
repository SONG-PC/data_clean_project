<template>
  <div class="player open split" style="height:50px;width:100%">
    <i v-on:click="play"  v-bind:class="[playing?'pause':((this.nowIndex  > this.frame.length-2)?'action_no': 'action')]" title="播放"></i>
    <i v-on:click=" replay2(0,frame.length-1)" v-bind:class="['replay ']" title="从头逐帧"></i>
    <div style="display:inline-block;margin-left:-3px">
      <span v-bind:style="{color: (this.nowIndex <= 0)?'rgb(239,239,239)':''}"   v-on:click="preFrame">[上一帧]</span>
      <span v-bind:style="{color: (this.nowIndex  > this.frame.length-2)?'rgb(239,239,239)':''}" v-on:click="nextFrame">[下一帧]</span>
    </div>
    <div v-if="frameCount>0" style="line-height:25px;position:absolute;right:0px;top:0px;border-left:1px solid rgb(239,239,239);color:coral;width:37px;height:100%;font-size:16px;font-weight:600;text-align:center;">
      <el-tooltip content="当前播放帧" placement="left" effect="light">
        <div style="font-size:10px;color:darkgrey;border-bottom:1px solid rgb(230,230,230)">{{(nowIndexText)}}</div>
      </el-tooltip>
      <el-tooltip content="总帧数" placement="left" effect="light">
        <div>{{(frame.length-1)/2}}</div>
      </el-tooltip>
     
    </div>
  </div>
</template>
<script>
  var itv = null;
  var frame = 0;
  var message = null;
  var wanna_break =false;
  var createFrame = function (_super,isData,idx) {
    return function (resolve,cb, isReverse) {
    _super.$emit("action", {
      resolve: function () {
          resolve && resolve();
        },
        cb: cb,
        isReverse: isReverse,
        isData: isData,
      idx: idx
      });
    }
  }
  var getDataDesc = function (frameIndex) {
    if (frameIndex == 0) {
      return '原始数据';
    }
    else if (frameIndex % 2 > 0) {
      return '差异数据';
    }
    else if (frameIndex % 2 == 0) {
      return '当前执行版本数据';
    }
   
  }
  export default {
    created: function () {
      this.$watch('op_list', function (newValue, oldValue) {
        this.frame = [];
        this.frame.push(createFrame(this, false, -1));
        var count = 0;
        newValue.forEach(function (v, i) {
          if (v.turn) {
            this.frame.push(createFrame(this, false, i));
            this.frame.push(createFrame(this, true, i));
            if (v.isPreview) {
              count += 0.5;
            }
          }
        }.bind(this));
        this.nowIndex = this.frame.length - 1 - count;
      }.bind(this));
      this.$watch('nowIndex', function (newValue,oldValue) {
        var notTure = newValue / 2;
        if (notTure.toString().split(".")[1]) {
          if (oldValue > newValue) {
            this.nowIndexText = parseInt(oldValue / 2) + "->" + parseInt(newValue / 2);
          }
          else {
            this.nowIndexText = parseInt(oldValue / 2) + "->" + Math.ceil(newValue / 2);
          }
         
          message && message.close();
          message = this.$message({ message: '播放从' + this.nowIndexText + '差异数据', duration: 1500 });
        } else {
          this.nowIndexText = parseInt(notTure);
          message && message.close();
          message = this.$message({ message: '播放第' + this.nowIndexText + '帧版本数据', duration: 1500 });
         
        }
       
   

      }.bind(this));
    },
    data: function () {
      return {
        playing: false,
        frame: [],
        nowIndex: 0,
        nowIndexText: "0",
        reverse: false
      }
    },
    methods: {
      replay2: function (start, end) {
        //message && message.close();
        //message =  this.$message({
        //  message: '开始播放',
        //  type: 'success'
        //});
        wanna_break = false;
        var _super = this;
        _super.playing = true;
        var Promise = new window.Promise(function (resolve) {
          _super.frame[start](resolve, function () {
            _super.nowIndex = start;
        
            if (_super.nowIndex == end) {
              _super.playing = false;
              message && message.close();
            }
          });
        });
        var temp = Promise;
        for (let i = start + 1; i <= end; i++) {

          temp = temp.then(function () {
            if (!wanna_break) {
       
              return new window.Promise(function (resolve) {
                _super.frame[i](resolve, function () {
                  _super.nowIndex = i;
                 // message && message.close();
                 // message = _super.$message({ message: '第' + _super.nowIndex + '帧  ' + getDataDesc(_super.nowIndex), duration: 0 });
                  if (_super.nowIndex == end) {
                    _super.playing = false;
                   // setTimeout(function () { message && message.close();},1500)
                     
                  }
                });

              });
            }
        
          });
        }

      },
      playFrame: function (frame_index,nowIndex,isReverse) {
        var Promise = new window.Promise(function (resolve) {
          this.frame[frame_index](resolve, function () {
            this.nowIndex = nowIndex;
          }.bind(this), isReverse);
        }.bind(this));
      },
      preFrame: function () {
        if (this.nowIndex <= 0) {
          message && message.close();
          message=  this.$message({
            message: '已经是起始帧',
            type: 'warning'
          });
          return;
        }
        this.playFrame(this.nowIndex-1 , this.nowIndex-1, true);

      },
      nextFrame: function () {
        if (this.nowIndex > this.frame.length - 2) {
          message && message.close();
          message = this.$message({
            message: '已经是结束帧',
            type: 'warning'
          });
          return;
        }
        this.playFrame(this.nowIndex+1, this.nowIndex+1, false);
      },
      play: function () {
        window.Bus.timeOut && clearTimeout(window.Bus.timeOut);
        if (this.playing) {
          message && message.close();
          message = this.$message({
            message: '用户请求暂停',
            type: 'success'
          });
          this.pause();
        }
        else {
  
          if (this.nowIndex > this.frame.length - 2) {
            return;
          }
          this.replay2(this.nowIndex+1, this.frame.length - 1)
        }
      },
      pause: function () {
       
        this.playing = false;
        wanna_break = true;
        message && message.close();
      }

   
   },
    computed: {
      frameCount: function () {
        var count = 0;
        this.op_list.forEach(function (v) {
          if (v.turn)
            count++;
        });
        return count;
      },
      nowFrameCount: function () {
        var count = 0;
        this.op_list.forEach(function (v) {
          if (v.turn&&v.isAction)
            count++;
        });
        return count;
      }
    },
    props: ["op_list"]

  }
 </script>
