<template>
  <div class="container">
    <van-nav-bar
      size="0.4rem"
      :title="dev_ip"
      left-text="返回"
      left-arrow
      fixed
      @click-left="onClickLeft"
      @click-right="onClickRight"
      :z-index="2000"
    >
      <div slot="left" class="alltitleleft">
        <van-icon name="arrow-left" color="#ffffff" />
        <span>返回</span>
      </div>
      <van-icon name="plus" slot="right" size="0.4rem" color="#ababab" />
    </van-nav-bar>

    <div class="content" @click="ClickRight(false)">
      <transition name="mybox">
        <div class="rightmenu" v-show="boxshow" @click.stop="dontshow(true)">
          <div
            class="rightmenu_up"
            v-for="(item,index) in minerInfo"
            v-bind:key="index"
            v-show="nodevice"
            v-bind:id="item.dev_sn"
            :class="{'rightmenu_up1':active==index}"
            @click.stop="select(item.ip,item.dev_sn,index,item)"
          >
            <div class="rightmenu_point"></div>
            <div class="rightmenu_con">
              <!-- <p>{{item.dev_name}}</p> -->
              <p>设备</p>
              <p>sn:{{item.dev_sn}}</p>
              <p>ip:{{item.ip}}</p>
            </div>
          </div>
          <div class="kong"></div>
          <div class="rightmenu_up_next" v-show="!nodevice">
            <img src="../../assets/images/illustration4.png" alt />
            <p>设备清单空空如也</p>
          </div>
          <div class="footmeau">
            <van-button class="rightmenu_btn" @click.stop="search">搜索</van-button>
            <div class="rightmenu_down" @click.stop="other">
              <span>没有找到设备?</span>
            </div>
          </div>
        </div>
      </transition>
      <transition name="upperlevel">
        <div class="level" v-show="levelshow" @click.stop="leavetrue">
          <div class="level_up">
            <div @click.stop="leavefalse">
              <span>取消</span>
            </div>
            <div class="level_ti">
              <p>为什么扫描不到我的西柚机？</p>
              <br />
              <p>扫描前请确保</p>
              <p>1、西柚机已接通电源，插入网线</p>
              <p>2、西柚机和手机保持同一局域网</p>
              <p>3、西柚机和电视已通过HDMI连接</p>
            </div>
          </div>
        </div>
      </transition>

      <div class="content_item_con">
        <!--- 上下左右按钮--->
        <div class="circle">
          <div class="circle_leavel">
            <div class="circle_btn_top" @click="controltop">
              <div
                class="circle-btn circle-top"
                :class="{setscolortop:topshow,getscolortop:!topshow}"
              >
                <i class="chevron-up"></i>
              </div>
            </div>

            <div class="circle_btn_left" @click="controlleft">
              <div
                class="circle-btn circle-left"
                :class="{setscolorleft:leftshow,getscolorleft:!leftshow}"
              >
                <i class="chevron-left"></i>
              </div>
            </div>
            <div class="circle-round" :class="{setscolorround:roundshow,getscolorround:!roundshow}">
              <div class="circle-round-inner" @click="controlround">
                <i class="pause-circle">ok</i>
              </div>
            </div>
            <div class="circle_btn_right" @click="controlright">
              <div
                class="circle-btn circle-right"
                :class="{setscolorright:rightshow,getscolorright:!rightshow}"
              >
                <i class="chevron-right"></i>
              </div>
            </div>
            <div class="circle_btn_bottom" @click="controlbottom">
              <div
                class="circle-btn circle-bottom"
                :class="{setscolorbottom:bottomshow,getscolorbottom:!bottomshow}"
              >
                <i class="chevron-down"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="content_item_top" @click="cancel" :class="{setbgc:boshow,getbgc:!boshow}">
        <div class="content_item_top_next">
          <div class="content_item_innerring">
            <img src="../../assets/images/backo.png" alt />
          </div>
        </div>
      </div>
      <div class="content_item_boot">
        <div class="content_item_boot_next">
          <div class="content_item_innerring" :class="{olds: !isshow,news: isshow,duction:isfocus}">
            <div class="volumeplus" @click="plus ">+</div>
            <div class="volumereduction" @click="ereduction">-</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { Tabbar, TabbarItem, Toast, PullRefresh, Dialog, NavBar } from "vant";
import { userInfoCenter, loginout } from "../../common/js/api.js";
import { error } from "util";
import { setTimeout } from "timers";
export default {
  data() {
    return {
      title: "没有设备，去添加→",
      boxshow: false,
      levelshow: false,
      dev_ip: "",
      dev_sn: "",
      nodevice: true, //有没有设备
      isshow: false,
      isfocus: false,
      boshow: true,
      topshow: true,
      leftshow: true,
      rightshow: true,
      bottomshow: true,
      roundshow: true,
      active: 0,
      minerInfo: [
        // {
        //   dev_sn: "RKDEV2016081618400",
        //   ip: "47.99.0.244"
        // },
        // {
        //   dev_sn: "IOO2TDRJNA",
        //   ip: "47.99.0.244"
        // }
      ]
    };
  },
  created() {
    try {
      window.android.setStatusBarAndNavigationBarColor("2", "#ffffff");
    } catch (e) {}
    try {
      window.webkit.messageHandlers.setStatusBarAndNavigationBarColor.postMessage(
        "#141414"
      );
    } catch (error) {}
  },
  computed: mapState({
    log_token: state => state.user.log_token,
    phone_number: state => state.user.phone_number,
    user_name: state => state.user.user_name,
    user_sex: state => state.user.user_sex,
    charge_psd: state => state.user.charge_psd
  }),
  mounted() {
    //ios方法
    try {
      window.webkit.messageHandlers.getBindDevice.postMessage("getsn");
      window.webkit.messageHandlers.searchDevices.postMessage("getlist");
    } catch (e) {}
    //Android方法
    try {
      window.android.getBindDevice("getsn");
      window.android.searchDevices("getlist");
    } catch (e) {}
    window.getsn = this.getsn;
    window.getlist = this.getlist;
    if (this.minerInfo.length <= 0) {
      this.nodevice = false;
    } else {
      this.nodevice = true;
    }
  },

  methods: {
    getlist: function(data) {
      let nowarr = JSON.parse(data);
      if (nowarr.length <= 0) {
        this.minerInfo = [];
        this.nodevice = false;
        this.dev_ip = "没有设备";
        Toast("未找到可连接设备");
      } else {
        this.nodevice = true;
        this.minerInfo = [];
        let my_dev = false;
        for (let i = 0; i < nowarr.length; i++) {
          this.minerInfo.push(nowarr[i]);
          if (nowarr[i].dev_sn == this.dev_sn) {
            this.dev_ip = nowarr[i].ip;
            this.active = i;
            my_dev = true;
          }
        }
        if (!my_dev) {
          this.dev_sn = this.minerInfo[0].dev_sn;
          this.dev_ip = this.minerInfo[0].dev_ip;
        }
      }
    },
    getsn: function(data) {
      this.dev_sn = data;
    },
    onClickLeft() {
      this.$router.back(-1);
    },
    onClickRight() {
      this.boxshow = !this.boxshow;
    },
    ClickRight(flage) {
      this.boxshow = flage;
      this.levelshow = flage;
    },
    //取消点击空白区域折叠面板隐藏
    dontshow() {
      this.boxshow = true;
    },
    //取消
    cancel() {
      this.control("4");
      this.boshow = false;
      setTimeout(() => {
        this.boshow = true;
      }, 200);
    },
    //音量加
    plus() {
      this.control("24");
      this.isshow = true;
      setTimeout(() => {
        this.isshow = false;
      }, 200);
      this.isfocus = false;
    },
    //音量减
    ereduction() {
      this.control("25");
      this.isfocus = true;
      setTimeout(() => {
        this.isfocus = false;
      }, 200);
      this.isshow = false;
    },
    //上
    controltop() {
      this.control("19");
      this.topshow = false;
      setTimeout(() => {
        this.topshow = true;
      }, 200);
    },
    //下
    controlbottom() {
      this.control("20");
      this.bottomshow = false;
      setTimeout(() => {
        this.bottomshow = true;
      }, 200);
    },
    //左
    controlleft() {
      this.control("21");
      this.leftshow = false;
      setTimeout(() => {
        this.leftshow = true;
      }, 200);
    },
    //右
    controlright() {
      this.control("22");
      this.rightshow = false;
      setTimeout(() => {
        this.rightshow = true;
      }, 200);
    },
    //确定
    controlround() {
      this.control("23");
      this.roundshow = false;
      setTimeout(() => {
        this.roundshow = true;
      }, 200);
    },
    //操作设备
    select(ip, sn, unm, item) {
      //  this.minerInfo.splice(unm, 1);
      // this.minerInfo.unshift(item);
      if (this.dev_sn) {
      }
      this.active = unm;
      //ios
      try {
        window.webkit.messageHandlers.bindDevice.postMessage(sn);
        this.dev_ip = ip;
      } catch (e) {}
      //Android
      try {
        window.android.bindDevice(sn);
        this.dev_ip = ip;
      } catch (e) {}
    },
    //搜索
    search() {
      const toast = Toast.loading({
        duration: 2000, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: "spinner",
        mask: false
      });
      //ios
      try {
        window.webkit.messageHandlers.searchDevices.postMessage("getlist");
      } catch (e) {}
      //Android
      try {
        window.android.searchDevices("getlist");
      } catch (e) {}
      window.getlist = this.getlist;
    },
    //未找到
    other() {
      this.levelshow = true;
    },
    //取消
    leavefalse() {
      this.levelshow = false;
    },
    leavetrue() {
      this.levelshow = true;
    },
    control(keyCode) {
      //ios
      try {
        window.webkit.messageHandlers.ControlDevice.postMessage(
          keyCode + "," + this.dev_ip
        );
      } catch (e) {}
      //Android
      try {
        window.android.ControlDevice(keyCode, this.dev_ip);
      } catch (e) {}
    }
  }
};
</script>
<style lang="less" scoped>
/deep/.van-nav-bar__right {
  right: 0.2rem;
}
/deep/.van-nav-bar {
  z-index: 2 !important;
  color: #fff;
  background: #141414;
}
.container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #000000;
  margin-top: 0.2rem;
  margin: 0 auto;
  .content {
    position: relative;
    width: 100%;
    height: 100%;
    margin-top: 1.2rem;
    padding-top: 1rem;
    .content_item_top {
      width: 1.46rem;
      height: 1.46rem;
      margin: 0 auto;
      background: linear-gradient(
        90deg,
        rgba(67, 191, 249, 1) 28.000000000000004%,
        rgba(255, 255, 255, 1) 50%,
        rgba(67, 191, 249, 1) 70%
      );
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      .content_item_top_next {
        width: 1.35rem;
        height: 1.35rem;
        border-radius: 50%;
        background-color: #000;
        display: flex;
        justify-content: center;
        align-items: center;
        .content_item_innerring {
          width: 1.25rem;
          height: 1.25rem;
          background: #1d739b;
          box-shadow: 0 0 10px 0 #31545e inset;
          border-radius: 50%;
          border: 0.02rem solid #143344;
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            // background: radial-gradient(#486870, #00adffdb);
          }
        }
      }
      span {
        margin-left: 0.2rem;
        background-color: bisque;
        display: inline-block;
        border-radius: 0.12rem;
        height: 0.6rem;
        text-align: center;
        line-height: 0.6rem;
      }
    }
    .content_item_con {
      width: 100%;
      height: 5rem;
      margin: 0 auto;
      line-height: 5rem;
      margin-top: -0.4rem;
      .circle {
        margin: 0 auto;
        width: 4.41rem;
        height: 4.41rem;
        line-height: 4.41rem;
        background: linear-gradient(
          60deg,
          rgba(67, 191, 249, 0.87) 28.000000000000004%,
          rgba(255, 255, 255, 0.77) 50%,
          rgba(67, 191, 249, 0.86) 70%
        );
        opacity: 0.9;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        .circle_leavel {
          position: relative;
          margin: 0 auto;
          width: 4.12rem;
          height: 4.12rem;
          background: linear-gradient(0deg, #494547 0%, #494547 100%);
          box-shadow: 0rem 0rem 0rem 0rem rgba(198, 218, 255, 0.79),
            0rem 0rem 0rem 0rem rgba(29, 29, 29, 0.28);
          border-radius: 50%;
          .circle-btn {
            width: 1rem;
            height: 1rem;
          }
          .circle_btn_top {
            width: 1.2rem;
            height: 1.2rem;
            margin: 0 auto;
            .circle-top {
              position: absolute;
              color: #fff;
              top: 10%;
              left: 42%;
              width: 0;
              height: 0;
              border-width: 0 0.35rem 0.35rem;
              border-style: solid;
              border-color: transparent transparent #000;
            }
          }
          .circle_btn_left {
            width: 1.2rem;
            height: 1.2rem;
            margin-top: 0.2rem;
            .circle-left {
              position: absolute;
              color: #fff;
              top: 40%;
              left: 11%;
              width: 0;
              height: 0;
              border-top: 0.35rem solid transparent;
              border-bottom: 0.35rem solid transparent;
              border-right: 0.35rem solid #000;
            }
          }
          .circle_btn_right {
            width: 1.2rem;
            height: 1.2rem;
            float: right;
            margin-top: -1.2rem;
            .circle-right {
              position: absolute;
              color: #fff;
              top: 40%;
              right: 11%;
              width: 0;
              height: 0;
              border-top: 0.35rem solid transparent;
              border-bottom: 0.35rem solid transparent;
              border-left: 0.35rem solid #000;
            }
          }
          .circle_btn_bottom {
            width: 1.2rem;
            height: 1.2rem;
            margin: 0 auto;
            margin-top: 0.3rem;
            .circle-bottom {
              position: absolute;
              color: #fff;
              bottom: 12%;
              left: 42%;
              width: 0;
              height: 0;
              border-right: 0.35rem solid transparent;
              border-left: 0.35rem solid transparent;
              border-top: 0.35rem solid #000;
            }
          }

          .circle-round {
            width: 1.48rem;
            height: 1.48rem;
            // background: linear-gradient(
            //   0deg,
            //   rgba(67, 191, 249, 1) 1%,
            //   rgba(67, 191, 249, 1) 100%
            // );
            background-color: #0e3d59;
            opacity: 0.9;
            border-radius: 50%;
            position: absolute;
            top: 31%;
            left: 31%;
            display: flex;
            justify-content: center;
            align-items: center;

            .circle-round-inner {
              width: 1.35rem;
              height: 1.35rem;
              background: #144968;
              // box-shadow: 0rem 0rem 0rem 0rem #b9b9b929;
              border-radius: 50%;
              text-align: center;
              line-height: 2.18rem;
              display: flex;
              justify-content: center;
              align-content: center;
              box-shadow: 0 0 10px #41c1f9 inset;
              i {
                display: inline-block;
                width: 100%;
                height: 100%;
                text-align: center;
                line-height: 1.25rem;
                font-size: 0.45rem;
                color: rgba(67, 191, 249, 1);
                text-shadow: 0 0 3px #43bff9;
              }
            }
          }
        }
      }
    }
    .content_item_boot {
      width: 1.5rem;
      height: 3.25rem;
      margin: 0 auto;
      margin-top: 1rem;
      background: linear-gradient(
        85deg,
        rgba(67, 191, 249, 0.91) 18%,
        rgba(255, 255, 255, 0.77) 50%,
        rgba(67, 191, 249, 0.9) 79%
      );
      border-radius: 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      .content_item_boot_next {
        width: 1.35rem;
        height: 3.05rem;
        border-radius: 1rem;
        background-color: #000;
        display: flex;
        justify-content: center;
        align-items: center;
        .content_item_innerring {
          width: 1.2rem;
          height: 2.95rem;
          background: #272f34;
          box-shadow: 0 0 10px 0 #31545e inset;
          border-radius: 1rem;
          border: 0.04rem solid #143344;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
          // box-shadow: 0 53px 37px #41c1f9ad inset;
          .volumeplus {
            width: 1.3rem;
            height: 1.3rem;
            border-radius: 50%;
            text-align: center;
            line-height: 0.9rem;
          }
          .volumereduction {
            width: 1.3rem;
            height: 1.3rem;
            border-radius: 50%;
            text-align: center;
            line-height: 0.9rem;
          }
        }
      }
    }
    .rightmenu {
      background-color: #282828;
      color: #fff;
      width: 62%;
      height: 100%;
      position: absolute;
      right: 0;
      top: -0.3rem;
      z-index: 100;
      -webkit-transition: all 0.6s ease-in;
      transition: all 0.6s ease-in;
      overflow: auto;
      -webkit-overflow-scrolling: touch; /* liuhx:可以把这整行注释掉对比差别 */
      .rightmenu_up {
        height: 1.39rem;
        border-bottom: 0.01rem solid #000;
        background-color: #282828;
        display: flex;
        flex-direction: row;
        align-items: center;
        .rightmenu_point {
          width: 0.2rem;
          height: 0.2rem;
          background-color: #3eade1;
          margin-right: 0.2rem;
          margin-left: 0.2rem;
          border-radius: 50%;
        }
        .rightmenu_con {
          p {
            text-align: left;
            width: 100%;
          }
          p:nth-child(1) {
            color: #3eade1;
            font-size: 0.3rem;
          }
        }
        &.rightmenu_up1 {
          height: 1.39rem;
          border-bottom: 0.01rem solid #000;
          background-color: #3ca4d5;
          display: flex;
          flex-direction: row;
          align-items: center;
          .rightmenu_point {
            width: 0.2rem;
            height: 0.2rem;
            background-color: #fff;
            margin-right: 0.2rem;
            margin-left: 0.2rem;
            border-radius: 50%;
          }
          .rightmenu_con {
            p {
              text-align: left;
              width: 100%;
            }
            p:nth-child(1) {
              color: #ffffff;
              font-size: 0.3rem;
            }
          }
        }
      }
      .rightmenu_up_next {
        width: 100%;
        height: 4rem;
        font-size: 0.3rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        img {
          margin-top: -1rem;
        }
        p {
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          color: #9a9a9a;
          margin: 0.6rem 0rem 1rem 0rem;
        }
      }
      .footmeau {
        width: 75%;
        height: 2rem;
        position: fixed;
        bottom: 0;
        right: 0;
        // background-color: #000;
        opacity: 0.7;
        .rightmenu_btn {
          width: 3rem;
          height: 0.75rem;
          color: #fff;
          background-color: #269fbd;
          border-radius: 0.12rem;
          border: none;
          position: absolute;
          bottom: 1rem;
          left: 32%;
          opacity: 1;
        }
        .rightmenu_down {
          opacity: 1;
          position: absolute;
          bottom: 0.45rem;
          left: 42%;
          color: #3eade1;
          span {
            border-bottom: 0.01rem solid #3eade1;
          }
        }
      }
    }
    .kong {
      width: 100%;
      height: 4rem;
    }
    .level {
      margin-left: 0.2rem;
      background-color: #282828;
      color: #fff;
      width: 62%;
      height: 100%;
      position: absolute;
      right: 0;
      top: -0.3rem;
      z-index: 110;
      -webkit-transition: all 0.6s ease-in;
      transition: all 0.1s ease-in;
      .level_up {
        margin-left: 0.6rem;
        margin-top: 0.4rem;
        div {
          text-align: left;
          span {
            display: inline-block;
            width: 1rem;
            height: 1rem;
            color: #ababab;
            margin-top: 0.2rem;
            font-size: 0.32rem;
          }
        }
      }
      .level_ti {
        margin-top: 2rem;
        p {
          width: 100%;
          display: inline-block;
          line-height: 0.6rem;
          color: #3eade1;
          font-size: 0.22rem;
        }
        p:nth-child(1) {
          color: #e9e9e9;
          font-size: 0.28rem;
        }
        p:nth-child(3) {
          color: #e9e9e9;
          font-size: 0.26rem;
          margin-top: 0.6rem;
        }
      }
    }
  }
}
//点解切换样式
//音量键
.olds {
  color: #acacac;
}
.news {
  color: #43bff9;
  text-shadow: 0 0 10px #41c1f9;
  box-shadow: 0 53px 37px #41c1f9ad inset !important;
  .volumereduction {
    color: #acacac;
    text-shadow: none;
  }
}
.duction {
  color: #43bff9;
  text-shadow: 0 0 10px #41c1f9;
  box-shadow: 0 -53px 37px #41c1f9ad inset !important;
  .volumeplus {
    color: #acacac;
    text-shadow: none;
  }
}
//返回键
.setbgc {
  img {
    background: none;
  }
}
.getbgc {
  img {
    background: radial-gradient(#486870, #00adffdb);
  }
}
//上下左右
.setscolortop {
  border-bottom-color: #000 !important;
}
.getscolortop {
  border-bottom-color: #43bff9 !important;
  transform: scale(1.5);
}
.setscolorleft {
  border-right-color: #000 !important;
}
.getscolorleft {
  border-right-color: #43bff9 !important;
  transform: scale(1.5);
}
.setscolorright {
  border-left-color: #000 !important;
}
.getscolorright {
  border-left-color: #43bff9 !important;
  transform: scale(1.5);
}
.setscolorbottom {
  border-top-color: #000 !important;
}
.getscolorbottom {
  border-top-color: #43bff9 !important;
  transform: scale(1.5);
}
.setscolorround {
  box-shadow: none;
}
.getscolorround {
  box-shadow: 0 0 10px #43bff9;
  transform: scale(1.1);
}
//左侧过度动画
.mybox-leave-active,
.mybox-enter-active {
  transition: all 0.6s ease;
}
.mybox-leave-active,
.mybox-enter {
  width: 0 !important;
  opacity: 0;
}
.mybox-leave,
.mybox-enter-active {
  width: 100%;
}
//提示过度动画
.upperlevel-leave-active,
.upperlevel-enter-active {
  transition: all 0.2s ease;
}
.upperlevel-leave-active,
.upperlevel-enter {
  width: 0 !important;
  opacity: 0;
}
.upperlevel-leave,
.upperlevel-enter-active {
  width: 100%;
}
</style>
