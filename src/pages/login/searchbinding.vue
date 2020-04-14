<template>
  <div class="container">
    <van-nav-bar
      size="0.4rem"
      left-text="返回"
      right-text="扫码绑定"
      left-arrow
      fixed
      @click-left="onClickLeft()"
      @click-right="onClickRight()"
      :z-index="2000"
    >
      <div slot="left" class="searchleft">
        <van-icon name="arrow-left" color="#ffffff" />
        <span>返回</span>
      </div>
      <div slot="right" class="searchright">
        <van-icon name="scan" size="0.4rem" />
        <span>扫码绑定</span>
      </div>
    </van-nav-bar>
    <scroller>
      <div class="container_introduction">
        <div class="toptext">
          <span>没有发现西柚机</span>
        </div>
        <div class="protocol_text">将设备接通电源，插入网线，等待灯光闪烁，确认你的手机和设备在同一网络（同一WIFI）</div>
        <div class="introduction_text">
          <div class="find_devive_item">
            <img src="../../assets/images/sea_illustrations3.png" />
          </div>
        </div>
        <div>
          <van-button class="introduction_start" @click="onClickRight()">尝试扫码绑定</van-button>
        </div>
        <div>
          <div class="argin" @click="goLink()">重新搜索</div>
        </div>
        <div class="jumpover" @click="jumpover()">跳过此步骤</div>
      </div>
    </scroller>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { logout } from "../../common/js/api.js";
import { Toast, Dialog, NavBar } from "vant";
import {
  getMinerInfo //获取设备信息
} from "../../common/js/api.js";
export default {
  data() {
    return {
      repeats: 0, //防止重复点击
      rescount: 0, //请求计数
      devlist: [],
      deviceArr: [],
      devnameokArr: []
    };
  },
  computed: mapState({
    log_token: state => state.user.log_token,
    phone_number: state => state.user.phone_number,
    user_name: state => state.user.user_name,
    user_sex: state => state.user.user_sex,
    charge_psd: state => state.user.charge_psd
  }),
  methods: {
    ...mapMutations(["updateUser", "clearUser"]),
    onClickLeft() {
      Toast.clear();
      this.$router.push({ path: "/binding" });
    },
    onClickRight() {
      try {
        window.webkit.messageHandlers.scanQRCodeByCamera.postMessage(
          "scancode"
        );
      } catch (e) {}
      try {
        window.android.startScanCode("scancode");
      } catch (e) {}
      window.scancode = this.scancode; //绑定在window全局变量上，不加括号
    },
    scancode: function(data) {
      try {
        let nowarr = JSON.parse(data);
        if (!nowarr.sn) {
          Toast(`未知二维码`);
        } else {
          this.devlist.push(nowarr.sn);
          //this.scan();
          this.$router.push({
            name: "find",
            query: {
              dev_list: this.devlist
            }
          });
        }
      } catch (e) {
        Toast(`未知二维码`);
      }
    },
    goLink() {
      if (this.$parent.onLine == false) {
        Toast("无法连接网络，请检查网络状态");
        return false;
      }
      try {
        window.webkit.messageHandlers.udpFindDevices.postMessage(
          "getMinerInfolist"
        );
      } catch (e) {}
      try {
        window.android.findDevices("getMinerInfolist");
      } catch (e) {}
      window.getMinerInfolist = this.getMinerInfolist; //绑定在window全局变量上，不加括号
      const toast = Toast.loading({
        duration: 15000, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: "spinner",
        message: "搜索中",
        mask: false
      });
    },
    getMinerInfolist: function(data) {
      let nowarr = JSON.parse(data);
      if (nowarr.length <= 0) {
        Toast(`未搜索到设备`);
      } else {
        Toast.clear();
        nowarr.forEach((item, index, arr) => {
          this.devlist.push(item);
        });
        setTimeout(() => {
          this.$router.push({
            name: "localsearch",
            query: {
              dev_list: this.devlist
            }
          });
        });
        //this.scan();
      }
    },
    //跳过步骤，去主页
    jumpover() {
      this.$router.push({
        path: "/management"
      });
    }
  }
};
</script>

<style lang="less" scoped >
/deep/.van-nav-bar .van-icon {
  color: #ffffff;
  vertical-align: middle;
  margin-right: 0.2rem;
}
/deep/.van-nav-bar__arrow + .van-nav-bar__text {
  margin-left: -20px;
  padding-left: 12px;
}
.van-nav-bar {
  color: #fff;
  background: linear-gradient(
    45deg,
    rgba(116, 90, 243, 1) 10%,
    rgba(92, 116, 243, 1) 100%
  );
}
.searchleft span {
  margin-left: -0.2rem;
  color: #ffffff;
  font-size: 0.3rem;
}
.searchright span {
  margin-left: -0.2rem;
  margin-right: 0.2rem;
  color: #fff;
}
.titright {
  line-height: 33px;
}
.titimg {
  width: 50%;
  height: 50%;
}
.container {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  overflow: hidden;
  background: #f8f8f8;
  .container_introduction {
    width: 100%;
    margin: 0 auto;
    margin-top: 1.5rem;
    overflow: hidden;
    background: #f8f8f8;
    // display: flex;
    // justify-content: flex-start;
    // align-items: center;
    // flex-direction: column;
    .toptext {
      width: 80%;
      font-size: 0.6rem;
      color: #000;
      text-align: center;
      margin: auto;
      // span {
      //   border-bottom: 0.12rem solid #e74a7e;
      // }
      .logoutbtn {
        font-size: 0.24rem;
        background-color: #f8f8f8;
        border-radius: 0.12rem;
        width: 1.18rem;
        height: 0.53rem;
        border: 1px solid #e6e6e6;
        position: relative;
        top: -0.2rem;
        right: -0.7rem;
        div {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width: 24%;
            height: 24%;
          }
        }
      }
    }
    .protocol_text {
      width: 80%;
      color: #888fa9;
      font-size: 0.24rem;
      text-align: center;
      text-indent: 0rem;
      margin: auto;
      margin-top: 0.2rem;
    }
    .introduction_text {
      width: 90%;
      margin: auto;
      margin-top: 1.2rem;
      padding: 0.5rem 0.4rem;
      width: 6.9rem;
      background: #fff;
      // border-radius: 0.12rem;
      box-sizing: border-box;
      .logout {
        float: right;
        border: none;
        text-align: right;
        height: 0.6rem;
        background-color: #ff467c;
        color: #fff;
      }
      .find_devive_item {
        img {
          width: 80%;
          margin-top: 0.3rem;
          margin-bottom: 0.4rem;
        }
      }

      .jumpovers {
        height: 0.5rem;
        display: flex;
        justify-content: flex-end;
        color: #ffffff;
        span {
          border-bottom: 1px solid #fff;
          font-size: 0.3rem;
        }
      }
    }
    .introduction_start {
      font-size: 0.32rem;
      color: #ffffff;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 5.9rem;
      height: 0.88rem;
      background: linear-gradient(
        90deg,
        rgba(116, 90, 243, 1) 0%,
        rgba(92, 116, 243, 1) 100%
      );
      border-radius: 1rem;
      margin-top: 0.6rem;
      border: none;
    }
    .argin {
      margin-top: 0.35rem;
      font-size: 0.32rem;
      color: #5f7bf2;
    }
    .jumpover {
      border-bottom: 1px solid #424b66;
      float: right;
      margin-right: 0.4rem;
    }
  }
}
</style>
