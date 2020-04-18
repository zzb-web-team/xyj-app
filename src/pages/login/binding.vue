<template>
  <div class="container">
    <van-nav-bar
      size="0.4rem"
      left-text="返回"
      right-text="扫码绑定"
      left-arrow
      fixed
      @click-left="onClickLeft"
      @click-right="onClickRight"
      :z-index="2000"
    >
      <div slot="left" class="alltitleleft">
        <van-icon name="arrow-left" color="#333333" />
        <span>返回</span>
      </div>
      <div slot="right">
        <span>扫码绑定</span>
        <van-icon name="scan" size="0.4rem" />
      </div>
    </van-nav-bar>
    <scroller>
      <div class="container_introduction">
        <div class="toptext">
          <span>搜索西柚机</span>
        </div>
        <div class="protocol_text">
          将设备接通电源，插入网线，等待灯光闪烁，确认你的手机和设备在同一网络（同一WIFI）
        </div>
        <div class="introduction_text">
          <!-- <div class="protocol_titie">
                    绑定西柚机
          </div>-->
          <div class="find_devive_item">
            <img src="../../assets/images/xiyouji.png" />
          </div>
        </div>
        <div class="next_btn">
          <van-button class="introduction_start" @click="goLink()"
            >搜索</van-button
          >
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { Toast, NavBar } from "vant";
import { error, debug, log } from "util";
import {
  getMinerInfo //获取设备信息
} from "../../common/js/api.js";
export default {
  data() {
    return {
      devlist: [
        // { sn: 121212, mac: "mlmciemdsaioe468", version: "1.3.3.1" },
        // { sn: 121212, mac: "mlmciemaiohtye468", version: "1.3.3.1" },
        // { sn: 121212, mac: "mlmciemaszioe468", version: "1.3.3.1" },
        // { sn: 121212, mac: "mlmciemaioe468", version: "1.3.3.1" },
        // { sn: 121212, mac: "mlmdsbcidsemaioe468", version: "1.3.3.1" },
        // { sn: 121212, mac: "mlmciemaioe468", version: "1.3.3.1" },
        // { sn: 121212, mac: "mlmciemaioe468", version: "1.3.3.1" },
        // { sn: 121212, mac: "mlmciemzxaioe468", version: "1.3.3.1" },
        // { sn: 121212, mac: "mlmciemazxbioe468", version: "1.3.3.1" },
        // { sn: 121212, mac: "mlmciemaioe468", version: "1.3.3.1" },
        // { sn: 121212, mac: "mlmciemavsioe468", version: "1.3.3.1" },
        // { sn: 121212, mac: "mlmciemsaaioe468", version: "1.3.3.1" }
      ],
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
  mounted() {
    try {
      window.android.setStatusBarAndNavigationBarColor("", "#ffffff");
    } catch (e) {}
    try {
      window.webkit.messageHandlers.setStatusBarAndNavigationBarColor.postMessage(
        "#745af3,#5e73f3"
      );
    } catch (e) {}
    if (this.$parent.onLine == false) {
      Toast("无法连接网络，请检查网络状态");
    } else {
    }
  },
  methods: {
    ...mapMutations(["updateUser", "clearUser"]),
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
        //  window.android.searchDevices("getMinerInfolist");
      } catch (e) {}
      window.getMinerInfolist = this.getMinerInfolist; //绑定在window全局变量上，不加括号

      const toast = Toast.loading({
        duration: 3000, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: "spinner",
        message: "搜索中",
        mask: false
      });
      // setTimeout(() => {
      //   this.$router.push({
      //     // path: "/managementinfo",
      //     name: "find",
      //     params: {
      //       dev_list: this.devlist
      //     }
      //   });
      // }, 6000);
    },
    getMinerInfolist: function(data) {
      this.$router.push({
        path: "/searchbinding" //没有搜索到设备就去扫码搜索界面
      });
      let nowarr = JSON.parse(data);
      Toast.clear();
      if (nowarr.length <= 0) {
        Toast.clear();
        setTimeout(() => {
          this.$router.push({
            path: "/searchbinding" //没有搜索到设备就去扫码搜索界面
          });
        }, 100);
      } else {
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
      }
    },
    onClickLeft() {
      Toast.clear();
      this.$router.push({ path: "/management" });
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
    scan() {
      if (this.$parent.onLine == false) {
        Toast("无法连接网络，请检查网络状态");
        // setTimeout(() => {
        //   this.$router.push({ path: "/searchbinding" });
        // }, 300);
      } else {
        if (this.repeats == 1) {
          return false;
        }
        this.repeats = 1;
        let params = new Object();
        params.login_token = this.log_token;
        params.dev_sn = this.devlist;
        getMinerInfo(params) //获取设备信息
          .then(res => {
            Toast.clear();
            if (res.status == 0) {
              this.repeats = 0;
              this.updateUser({ log_token: res.token_info.login_token });
              if (res.err_code == 0 || res.err_code == 263) {
                // this.rescount = 0;
                this.number = res.data.dev_info_list.length;
                res.data.dev_info_list.forEach((item, index, arr) => {
                  this.deviceArr.push(item);
                  if (item.dev_type == -1) {
                    this.devnameokArr[index] = true;
                    this.devnameokArr = this.devnameokArr.concat([]);
                    this.deviceArr[index].nonestyle = "none";
                    this.deviceArr[index].feistyle = "black";
                    this.deviceArr[index].bind_num = "非法设备";
                    this.deviceArr[index].bind = "立即绑定";
                  } else {
                    if (item.bind_state == 0) {
                      this.deviceArr[index].nonestyle = "none";
                      this.deviceArr[index].feistyle = "none";
                      this.deviceArr[index].bind = "立即绑定";
                    } else if (item.bind_state == 1) {
                      this.devnameokArr[index] = true;
                      this.devnameokArr = this.devnameokArr.concat([]);
                      this.deviceArr[index].distea = true;
                      this.deviceArr[index].bind = "已绑定";
                    }
                  }
                });
                this.$router.push({
                  name: "find",
                  // name: "localsearch",
                  params: {
                    dev_list: this.deviceArr
                  }
                });
              } else {
                // this.rescount = 0;
                const sta = err[res.err_code]
                  ? this.$t(err[res.err_code])
                  : `请稍后重试 ${res.err_code}`;
                this.$toast(sta);
              }
            } else if (res.status == -13) {
              this.rescount = 0;
              if (res.err_code == 424) {
                Toast({
                  message: "您的账户已被冻结，请联系相关工作人员",
                  duration: 3000
                });
                setTimeout(() => {
                  this.$router.push({ path: "/login" });
                }, 3000);
              }
            } else if (res.status == -5) {
              this.$router.push({ path: "/searchbinding" });
            } else {
              // this.rescount = 0;
              const tip = this.$backStatusMap[res.status] || err[res.status];
              const str = tip ? this.$t(tip) : `请稍后重试 ${res.status}`;
              this.$toast(str);
            }
          })
          .catch(error => {
            Toast.clear();
            this.repeats = 0;
            this.$router.push({ path: "/searchbinding" });
          });
      }
    }
  }
};
</script>

<style lang="less" scoped>
/deep/.van-nav-bar .van-icon {
  color: #333333;
  vertical-align: middle;
}
/deep/.van-nav-bar__right {
  right: 0.2rem;
}
/deep/.van-icon-arrow-left:before {
  color: #333333;
}
/deep/.van-nav-bar .van-icon {
  margin-top: 0 !important;
}
.van-nav-bar {
  color: #333333;
  background: #ffffff;
}
.titright {
  line-height: 33px;
}
.titimg {
  width: 50%;
  height: 50%;
}
.van-nav-bar__text {
  margin-left: -0.3rem;
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
    background: #f8fafb;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .toptext {
      width: 80%;
      font-size: 0.36rem;
      color: #333333;
      text-align: center;
      // span {
      //   border-bottom: 0.12rem solid #e74a7e;
      // }
    }
    .protocol_text {
      width: 80%;
      color: #666666;
      font-size: 0.22rem;
      text-align: center;
      text-indent: 0rem;
      margin-top: 0.2rem;
    }
    .introduction_text {
      width: 90%;
      margin: auto;
      margin-top: 1.2rem;
      padding: 0 0.4rem;
      width: 6.9rem;
      background: #f8f8f8;
      border-radius: 0.12rem;
      box-sizing: border-box;
      .find_devive_item {
        // background-color: #fff;
        img {
          width: 85%;
          margin-top: 0.3rem;
          margin-bottom: 0.4rem;
        }
      }
    }
    .next_btn {
      width: 100%;

      .introduction_start {
        width: 92%;
        height: 0.8rem;
        font-size: 0.38rem;
        color: #ffffff;
        margin: 0 auto;
        margin-top: 4rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(
          90deg,
          rgba(254, 168, 107, 1) 0%,
          rgba(255, 109, 110, 1) 100%
        );
        box-shadow: 0px 5px 5px 0px rgba(255, 109, 110, 0.1);
        border-radius: 5px;
        border: none;
      }
    }
  }
}
</style>
