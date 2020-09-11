<template>
  <div class="container">
    <navBar class="navbar" :title="title" :right-text="title">
      <van-icon name="search" slot="right" />
    </navBar>
    <div class="xiala">
      <van-pull-refresh class="xiala" v-model="isLoading" @refresh="onRefresh">
        <div class="user">
          <div class="user_con">
            <div class="user_con_item" @click="gouser()">
              <div class="con_item_l">
                <img src="../../assets/images/per_logo12x.png" alt />
              </div>
              <div class="con_item_r">
                <p>{{ user_name }}</p>
                <p>
                  <img src="../../assets/images/phone_img.png" alt />
                  {{ phone_number }}
                </p>
              </div>
              <!-- <button @click.stop="goUserName()" :disabled="flag">
                <img src="../../assets//images/per_pegister_icon.png.png" alt />
                {{ flag ? "已签到" : "签到" }}
              </button> -->
              <div class="con_item_img">
                <img src="../../assets/images/evenmore.png" />
              </div>
            </div>
            <!-- <div class="user_con_item" v-fb="{ cls: 'my_touchfeedback' }">
              <div class="user_con_item_border">
                <div class="con_item_l">
                  <img src="../../assets/images/per_integral_icon.png" alt />
                  <div>
                    <p>
                      {{ all_income }}
                      <span>gfm</span>
                    </p>
                    <p>积分</p>
                  </div>
                </div>
                <div class="con_item_r">
                  <button @click.stop="goexange()">兑换</button>
                </div>
              </div>
            </div> -->
            <div
              class="user_con_item"
              @click="gotool()"
              v-fb="{ cls: 'my_touchfeedback' }"
            >
              <div class="con_item_l">
                <img src="../../assets/images/per_list_icon_toolbox.png" alt />
                <span>工具箱</span>
              </div>
              <div class="con_item_r">
                <img src="../../assets/images/evenmore.png" />
              </div>
            </div>
            <div class="user_con_item" @click="gojifen()">
              <div class="con_item_l">
                <img src="../../assets/images/per_list_icon_integral.png" alt />
                <span>我的收益</span>
              </div>
              <div class="con_item_r">
                <img src="../../assets/images/evenmore.png" />
              </div>
            </div>
            <div class="user_con_item" @click="gohelp()">
              <div class="con_item_l">
                <img src="../../assets/images/per_list_icon_help.png" alt />
                <span>帮助中心</span>
              </div>
              <div class="con_item_r">
                <img src="../../assets/images/evenmore.png" />
              </div>
            </div>
            <!-- <div class="user_con_item" @click="gowe()">
              <div class="con_item_l">
                <img src="../../assets/images/per_list_icon_about.png" alt />
                <span>关于我们</span>
              </div>
              <div class="con_item_r">
                <img src="../../assets/images/evenmore.png" />
              </div>
            </div> -->
            <!-- <div class="user_con_item" @click="goPassword()" v-fb="{ cls: 'my_touchfeedback' }">
              <div class="con_item_l">
                <img src="../../assets/images/per_icon_password@3x.png" alt />
                <span>交易密码</span>
              </div>
              <div class="con_item_r">
                <img src="../../assets/images/evenmore.png" />
              </div>
            </div>-->
            <!-- <div class="user_con_item" @click="goAbout()" v-fb="{ cls: 'my_touchfeedback' }">
              <div class="con_item_l">
                <img src="../../assets/images/per_icon_about@3x.png" alt />
                <span>关于我们</span>
              </div>
              <div class="con_item_r">
                <img src="../../assets/images/evenmore.png" />
              </div>
            </div>-->
            <!-- <div
              class="user_con_item"
              @click="goUserAgreement()"
              v-fb="{ cls: 'my_touchfeedback' }"
            >
              <div class="con_item_l">
                <img src="../../assets/images/per_icon_about@3x.png" />
                <span>用户协议</span>
              </div>
              <div class="con_item_r">
                <img src="../../assets/images/evenmore.png" />
              </div>
            </div>-->
            <div
              class="user_con_item"
              @click="goPrivacy()"
              v-fb="{ cls: 'my_touchfeedback' }"
            >
              <div class="con_item_l">
                <img src="../../assets/images/per_list_icon_about.png" alt />
                <span>隐私政策</span>
              </div>
              <div class="con_item_r">
                <img src="../../assets/images/evenmore.png" />
              </div>
            </div>
            <!-- <div class="user_con_item" @click="goversioninformation()">
              <div class="con_item_l">
                <img src="../../assets/images/per_icon_version@3x.png" alt />
                <span>跳转测试</span>
              </div>
              <div class="con_item_r"></div>
            </div> -->
            <div class="user_con_item">
              <div class="con_item_l">
                <img src="../../assets/images/per_list_icon_version.png" alt />
                <span>版本</span>
              </div>
              <div class="con_item_r"><i></i>1.3.2.165</div>
            </div>
          </div>
          <div>
            <van-button
              class="out_login"
              @click="loginOut()"
              v-fb="{ cls: 'my_touchfeedback' }"
            >
              <b>退出登录</b>
            </van-button>
          </div>
        </div>
      </van-pull-refresh>
    </div>
    <van-overlay :show="show" @click="show = false">
      <div class="wrapper" @click.stop>
        <div class="block">
          <div class="topclose" @click="show = false">
            <img src="../../assets/images/add_close.png" alt />
          </div>
          <img src="../../assets/images/qiandao_tu.png" alt />
          <p>签到成功</p>
          <p class="add_num">
            <!-- {{num}}台设备算力 -->
            <span>+{{ gongxianzhi }}</span>
          </p>
        </div>
      </div>
    </van-overlay>
    <tabbar v-model="active"></tabbar>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import navBar from "../../components/barBarActive";
import { Tabbar, TabbarItem, Toast, PullRefresh, Dialog, NavBar } from "vant";
import {
  userInfoCenter,
  loginout,
  sign,
  authorization,
  query_daily_sign,
  get_sign_value
} from "../../common/js/api.js";
import {
  logout,
  getUserinfo,
  querystatus,
  getuserdevlist
} from "../../common/js/api.js";
import tabbar from "../../components/foot";
import { error } from "util";
import { err } from "../../common/js/status";

export default {
  data() {
    return {
      loading: false,
      finished: false,
      title: "",
      active: 2,
      isLoading: false,
      show: false,
      gongxianzhi: 0,
      num: 0,
      all_income: 0,
      system: "",
      flag: false
    };
  },
  computed: mapState({
    log_token: state => state.user.log_token,
    phone_number: state => state.user.phone_number,
    user_name: state => state.user.user_name,
    user_sex: state => state.user.user_sex,
    charge_psd: state => state.user.charge_psd
  }),
  mounted: function() {
    try {
      window.android.setStatusBarAndNavigationBarColor("1", "#ffffff");
    } catch (e) {}
    try {
      window.webkit.messageHandlers.setStatusBarAndNavigationBarColor.postMessage(
        "#ffffff"
      );
    } catch (error) {}
    this.whatBrowser();
    if (this.$parent.onLine == false) {
      Toast("无法连接网络，请检查网络状态");
      return false;
    } else {
      this.query_sign();
      this.get_all_income(90);
    }
    console.log(this.user_name);
  },
  methods: {
    ...mapMutations(["updateUser", "clearUser"]),
    onRefresh() {
      setTimeout(() => {
        this.get_all_income(90);
        this.isLoading = false;
      }, 500);
    },
    //网络状态
    internetstatus() {
      if (this.$parent.onLine == true) {
      }
    },
    query_sign() {
      let params = new Object();
      params.login_token = this.log_token;
      query_daily_sign(params)
        .then(res => {
          if (res.status == 0) {
            this.updateUser({
              log_token: res.data.login_token
            });
            //sign_state == 0代表未签到
            if (res.data.sign_state == 1) {
              this.flag = true;
            } else {
              this.flag = false;
            }
          } else if (res.status == -17) {
            this.rescount = 0;
            Dialog.alert({
              message: "账号在其它地方登录，请重新登录"
            }).then(() => {
              this.clearUser();
              this.$router.push({ path: "/login" });
            });
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
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //退出登录
    loginOut() {
      if (this.$parent.onLine == false) {
        Toast("无法连接网络，请检查网络状态");
      } else {
        Dialog.confirm({
          // title: "标题",
          message: "退出后不会影响收益获取，可以重复登录"
        })
          .then(() => {
            if (this.repeats == 1) {
              return false;
            }
            this.repeats = 1;
            if (this.rescount >= 3) {
              this.repeats = 0;
              this.rescount = 0;
              Toast(`请求超时，请稍后重试`);
              return false;
            }
            let param = new Object();
            param.login_token = this.log_token;
            logout(param)
              .then(res => {
                // try {
                //   window.android.setPushTag("");
                // } catch (e) {}
                this.repeats = 0;
                sessionStorage.cachedata = "";
                this.clearUser();
                setTimeout(() => {
                  this.$router.push({ path: "/login" });
                }, 500);
              })
              .catch(error => {
                this.repeats = 0;
                this.rescount++;
                logout(param);
                // Toast("网络错误，请重新请求");
              });
          })
          .catch(() => {
            // on cancel
          });
      }
    },
    //获取总积分
    get_all_income(num) {
      let params = new Object();
      let endtime = Date.parse(new Date()) / 1000; //获取当前日期时间戳(精确到秒)
      let endtimes = Date.parse(new Date().toLocaleDateString()) / 1000; //获取当前年月日时间戳（当天零点）
      let starttime = endtimes - num * 24 * 3600; //获取7天的时间戳
      let token = this.log_token;
      params.login_token = token;
      params.start_time = starttime;
      params.end_time = endtimes;
      params.query_type = 1;
      params.cur_page = 0;
      getuserdevlist(params)
        .then(res => {
          if (res.status == 0) {
            this.updateUser({
              log_token: res.data.token_info.token
            });
            this.all_income = (res.data.user_total_profit / 100).toFixed(2);
          } else if (res.status == -17) {
            this.rescount = 0;
            Dialog.alert({
              message: "账号在其它地方登录，请重新登录"
            }).then(() => {
              this.clearUser();
              this.$router.push({ path: "/login" });
            });
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
          }
        })
        .catch(error => {});
    },
    goversioninformation() {
      //this.$router.push({ path: "/versioninformation" });
      this.$router.push({ path: "/minemachine" });
    },
    gotool() {
      setTimeout(() => {
        this.$router.push({ path: "/tool" });
      }, 200);
    },
    //跳转我的积分
    gojifen() {
      setTimeout(() => {
        this.$router.push({
          // path: "/about_us",
          path: "/my_scores",
          query: { income: this.all_income }
        });
      }, 200);
    },
    //跳转帮助中心
    gohelp() {
      setTimeout(() => {
        this.$router.push({ path: "/help_center" });
      }, 200);
    },
    //跳转关于我们
    gowe() {
      setTimeout(() => {
        this.$router.push({ path: "/about_us" });
      }, 200);
    },
    goLink() {
      this.$router.push({ path: "/login" });
    },
    //签到
    goUserName() {
      let param = new Object();
      param.login_token = this.log_token;
      sign(param)
        .then(res => {
          if (res.status == 0) {
            this.updateUser({
              log_token: res.data.token_info.token
            });
            this.getgxz();
          } else if (res.status == -17) {
            this.rescount = 0;
            Dialog.alert({
              message: "账号在其它地方登录，请重新登录"
            }).then(() => {
              this.clearUser();
              this.$router.push({ path: "/login" });
            });
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
          } else {
            Toast("签到失败");
          }
        })
        .catch(error => {
          // console.log(error);
        });
    },
    //获取颠倒所得贡献值
    getgxz() {
      let params = new Object();
      params.login_token = this.log_token;
      get_sign_value(params)
        .then(res => {
          if (res.status == 0) {
            this.updateUser({
              log_token: res.data.token_info.token
            });
            this.gongxianzhi = res.data.cp_sign_value;
            this.num = res.data.cp_sign_value;
            this.show = true;
            this.flag = true;
            setTimeout(() => {
              this.show = false;
            }, 3000);
          } else if (res.status == -17) {
            this.rescount = 0;
            Dialog.alert({
              message: "账号在其它地方登录，请重新登录"
            }).then(() => {
              this.clearUser();
              this.$router.push({ path: "/login" });
            });
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
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //个人中心
    gouser() {
      this.$router.push({ path: "/user" });
    },
    //去兑换
    goexange() {
      if (this.all_income <= 0) {
        Toast({
          message: "账户暂无积分",
          duration: 1500
        });
        return false;
      }
      const toast = Toast.loading({
        duration: 15000, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: "spinner",
        mask: false
      });
      let nowparam = new Object();
      nowparam.login_token = this.log_token;
      nowparam.login_type = 1;
      authorization(nowparam)
        .then(res => {
          Toast.clear();
          if (res.status == 0) {
            if (res.data.bind_status == 1) {
              setTimeout(() => {
                this.$router.push({
                  path: "/tomoney"
                });
              }, 200);
            } else {
              Toast.fail({
                message: "未授权",
                duration: 400
              });
              if (this.system == "iPhone") {
                this.Authorization(res.url);
              } else {
                setTimeout(() => {
                  this.$router.push({
                    path: "/ding",
                    query: { url: res.url }
                  });
                }, 400);
              }
            }
          } else if (res.status == -999) {
            Toast("登录已过期，请重新登录");
            this.clearUser();
            setTimeout(() => {
              this.$router.push({ path: "/login" });
            }, 1000);
          } else if (res.status == -17) {
            Dialog.alert({
              message: "账号在其它地方登录，请重新登录"
            }).then(() => {
              this.clearUser();
              this.$router.push({ path: "/login" });
            });
          } else if (res.status == -500) {
            this.noint = true;
          } else if (res.status == -900) {
            this.$router.push({ path: "/login" });
          } else if (res.status == -5) {
            Toast(`请求超时，请稍后重试`);
          } else {
            const tip = this.$backStatusMap[res.status] || err[res.status];
            const str = tip ? this.$t(tip) : `请稍后重试 ${res.status}`;
            this.$toast(str);
          }
        })
        .catch(error => {
          // Toast("网络错误，请重新请求");
        });
    },
    //获去手机系统
    whatBrowser() {
      let u = navigator.userAgent;
      if (u.indexOf("Android") > -1 || u.indexOf("Linux") > -1) {
        //安卓手机
        this.system = "Android";
        // window.location.href = "mobile/index.html";
      } else if (u.indexOf("iPhone") > -1) {
        //苹果手机
        // window.location.href = "mobile/index.html";
        this.system = "iPhone";
      } else if (u.indexOf("Windows Phone") > -1) {
        //winphone手机
        this.system = "Windows Phone";
        // window.location.href = "mobile/index.html";
      }
    },
    goPassword() {
      //根据交易密码状态选择去那个页面
      if (this.charge_psd == 2) {
        setTimeout(() => {
          this.$router.push({ path: "/password" });
        }, 200);
      } else if (this.charge_psd == 1) {
        setTimeout(() => {
          this.$router.push({ name: "updatepassword" });
        }, 200);
      }
    },
    goAbout() {
      setTimeout(() => {
        this.$router.push({ path: "/about" });
      }, 200);
    },
    goPrivacy() {
      setTimeout(() => {
        this.$router.push({ path: "/privacy" });
      }, 200);
    },
    goUserAgreement() {
      setTimeout(() => {
        this.$router.push({ path: "/UserAgreement" });
      }, 200);
    },
    onClickRight() {
      this.$router.push({ path: "/message" });
    },
    govertion() {
      this.$router.push({ path: "/income_overview" });
    }
  },
  components: {
    navBar: navBar,
    tabbar: tabbar
  }
};
</script>

<style lang="less" scoped>
/deep/.van-overlay {
  z-index: 2001;
}
/deep/.van-nav-bar {
  background: #ffffff;
}
/deep/.van-hairline--bottom::after {
  border-bottom-width: 0px;
  color: #ffffff;
}
#app {
  background: #ffffff;
}
.van-nav-bar {
  color: #fff;
  // box-shadow: 0 5px 5px #e6e6e6;
  // background: linear-gradient(
  //   45deg,
  //   rgba(116, 90, 243, 1) 10%,
  //   rgba(92, 116, 243, 1) 100%
  // );
  /* border-bottom: 0.01rem solid #616c8a; */
}
.container {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  overflow: hidden;
  color: #000000;
  background: #ffffff;
  background-size: 100% 4.8rem;
  .top {
    width: 100%;
    height: 1.5rem;
    // background: linear-gradient(
    //   45deg,
    //   rgba(116, 90, 243, 1) 10%,
    //   rgb(93, 118, 242) 100%
    // );
    background: #ffffff;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
  }
  .xiala {
    height: 100%;
    background: #ffffff;
    margin-top: 0.92rem;
  }
  .user {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #ffffff;
    .user_con {
      width: 100%;
      height: auto;
      margin: auto;
      .user_con_item {
        height: 0.88rem;
        font-size: 0.28rem;
        background: #ffffff;
        border-bottom: 0.01rem solid #f3f3f3;
        padding: 0 0.5rem;
        color: #424b66;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        // overflow: hidden;
        img {
          width: 0.12rem;
          height: 0.24rem;
        }
        .con_item_l {
          height: 1rem;
          display: flex;
          flex-direction: row;
          align-items: center;
          img {
            width: 21%;
            height: 45%;
          }
          span {
            padding-left: 0.1rem;
          }
        }
        .con_item_r {
          i {
            display: inline-block;
            width: 0.1rem;
            height: 0.1rem;
            border-radius: 50%;
            background: red;
            margin-right: 0.1rem;
            line-height: 0.9rem;
            margin-bottom: 0.02rem;
          }
        }
        button {
          width: 1.52rem;
          height: 0.48rem;
          line-height: 0.4rem;
          border-radius: 0.42rem;
          background-color: #f2f2f2;
          border: 1px solid rgb(255, 255, 255);
          white-space: nowrap;
        }
      }
      .user_con_item:nth-child(1) {
        width: 100%;
        height: 2rem;
        box-shadow: 0 0.1rem 0.3rem 0 #06275c0f;
        border: none;
        button {
          // width: 1.62rem;
          max-width: 1.62rem;
          color: #666666;
          font-size: 0.24rem;
          background: rgba(255, 255, 255, 1);
          box-shadow: 0px 0px 32px 0px rgba(207, 207, 207, 0.32);
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          img {
            width: 0.37rem;
            height: 0.4rem;
          }
        }
        .con_item_l {
          width: 1.14rem;
          height: 1.14rem;
          border-radius: 50%;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .con_item_r {
          width: 70%;
          text-align: left;
          p {
            height: 0.6rem;
            line-height: 0.6rem;
            font-size: 0.22rem;
            color: #333333;
            margin-left: -0.2rem;
          }
          p:nth-child(1) {
            display: inline-block;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #333333;
            font-size: 0.38rem;
            padding: 0 0.2rem;
          }
          p:nth-child(2) {
            display: inline-block;
            height: 0.4rem;
            line-height: 0.4rem;
            padding: 0 0.2rem;
            border: 0.01rem solid rgba(255, 255, 255, 0.3);
            border-radius: 1rem;
            text-align: left;
            color: #999999;
            img {
              width: 5%;
            }
          }
        }
        .con_item_img {
          img {
            width: 55%;
          }
        }
      }
      .user_con_item:nth-child(2) {
        height: auto;
        // margin-bottom: 0.5rem;
        margin-top: 0.3rem;
        .con_item_l {
          img {
            width: 25%;
          }
        }
        .user_con_item_border {
          width: 100%;
          margin: auto;
          // border: 4px solid #eeeeee;
          // border-radius: 0.2rem;
          box-shadow: 0 0 0.32rem 0 rgba(207, 207, 207, 0.32);
          border-radius: 0.1rem;
          font-size: 0.3rem;
          background: #ffffff;
          padding: 0 0.3rem 0 0.5rem;
          color: #424b66;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-sizing: border-box;
          overflow: hidden;
          margin-top: 0.2rem;
          margin-bottom: 0.2rem;
          .con_item_l {
            text-align: left;
            img {
              margin-right: 0.1rem;
              width: 25%;
              height: 45%;
            }
            p {
              color: #333333;
              span {
                color: #666666;
                font-size: 0.18rem;
              }
            }
            p:nth-child(2) {
              font-size: 0.18rem;
              color: #666666;
            }
          }
          .con_item_r {
            button {
              border: #ff6c6c solid 0.01rem;
              // width: 1.2rem;
              height: 0.6rem;
              color: #ff6c6c;
              background-color: #fff;
              font-size: 0.28rem;
            }
          }
        }
      }
      .user_con_item:nth-child(3) {
        .con_item_l {
          img {
            width: 24%;
          }
        }
      }
      .user_con_item:last-child {
        .con_item_l {
          img {
            width: 27%;
          }
        }
        .con_item_r {
          color: #8f8f8f;
          font-size: 0.28rem;
        }
      }
    }
  }
  .out_login {
    width: 92%;
    height: 0.88rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.24rem;
    color: #666666;
    margin: auto;
    margin-top: 2.8rem;
    border: none;
    background: #f9f9f9;
    border-radius: 0.44rem;
  }
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .block {
    width: 5.65rem;
    height: 5.65rem;
    border-radius: 0.2rem;
    background-color: #fff;
    .topclose {
      text-align: right;
      height: 0.6rem;
      img {
        width: 7%;
        margin-right: 0.2rem;
      }
    }
    img {
      width: 50%;
      margin: 0.2rem 0 0.4rem 0;
    }
    p {
      color: #333333;
      font-size: 0.3rem;
      font-weight: bold;
      span {
        color: #ff5252;
        font-size: 0.36rem;
      }
    }
    .add_num {
      font-size: 0.24rem;
      color: #535054;
      margin-top: 0.1rem;
    }
  }
}
</style>
