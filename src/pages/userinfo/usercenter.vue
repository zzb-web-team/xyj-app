<template>
  <div class="container">
    <navBar class="navbar" :title="title" :right-text="title">
      <van-icon name="search" slot="right" />
    </navBar>
    <div class="top"></div>
    <div class="xiala">
      <Scroll
        ref="myscroller"
        :autoUpdate="true"
        :listenScroll="true"
        @pullingDown="onRefresh"
      >
        <div class="user">
          <div
            style="width:100%;height:0.8rem; background:linear-gradient(45deg,rgba(116, 90, 243, 1) 10%,rgba(92, 116, 243, 1) 100%);"
          ></div>
          <div class="user_con">
            <div class="user_con_item" @click="goUserName()">
              <div class="con_item_l">
                <img src="../../assets/images/per_logo12x.png" alt />
              </div>
              <div class="con_item_r">
                <p>{{ user_name }}</p>
                <p>{{ phone_number }}</p>
              </div>
              <button @click="goUserName()">编辑</button>
            </div>
            <div
              class="user_con_item"
              @click="gotool()"
              v-fb="{ cls: 'my_touchfeedback' }"
            >
              <div class="con_item_l">
                <img src="../../assets/images/per_icon_toolkit.png" alt />
                <span>工具箱</span>
              </div>
              <div class="con_item_r">
                <img src="../../assets/images/evenmore.png" />
              </div>
            </div>
            <div
              class="user_con_item"
              @click="goPassword()"
              v-fb="{ cls: 'my_touchfeedback' }"
            >
              <div class="con_item_l">
                <img src="../../assets/images/per_icon_password@3x.png" alt />
                <span>交易密码</span>
              </div>
              <div class="con_item_r">
                <img src="../../assets/images/evenmore.png" />
              </div>
            </div>
            <div class="user_con_item" @click="goversioninformation()">
              <div class="con_item_l">
                <img src="../../assets/images/per_icon_version@3x.png" alt />
                <span>版本信息</span>
              </div>
              <div class="con_item_r">1.3.1.126</div>
            </div>
            <div
              class="user_con_item"
              @click="goAbout()"
              v-fb="{ cls: 'my_touchfeedback' }"
            >
              <div class="con_item_l">
                <img src="../../assets/images/per_icon_about@3x.png" alt />
                <span>关于我们</span>
              </div>
              <div class="con_item_r">
                <img src="../../assets/images/evenmore.png" />
              </div>
            </div>
            <div
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
            </div>
            <div
              class="user_con_item"
              @click="goPrivacy()"
              v-fb="{ cls: 'my_touchfeedback' }"
            >
              <!-- -->
              <div class="con_item_l">
                <img src="../../assets/images/per_icon_agreement@3x.png" alt />
                <span>隐私协议</span>
              </div>
              <div class="con_item_r">
                <img src="../../assets/images/evenmore.png" />
              </div>
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
      </Scroll>
    </div>
    <tabbar v-model="active"></tabbar>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import navBar from "../../components/barBarActive";
import { Tabbar, TabbarItem, Toast, PullRefresh, Dialog, NavBar } from "vant";
import { userInfoCenter, loginout } from "../../common/js/api.js";
import { logout, getUserinfo, querystatus } from "../../common/js/api.js";
import tabbar from "../../components/foot";
import { error } from "util";
import { err } from "../../common/js/status";

export default {
  data() {
    return {
      loading: false,
      finished: false,
      title: "个人中心",
      active: 2,
      isLoading: false
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
    if (this.$parent.onLine == false) {
      Toast("无法连接网络，请检查网络状态");
      return false;
    } else {
    }
  },
  methods: {
    ...mapMutations(["updateUser", "clearUser"]),
    onRefresh() {
      console.log("下拉");
    },
    //网络状态
    internetstatus() {
      if (this.$parent.onLine == true) {
      }
    },
    //http://www.pianshen.com/article/3027137171/   下拉刷新的参考网址
    // async _getOpenDetail() {
    //   await getOpenDetail(this.lottery, this.pageIndex, 10).then(data => {
    //     if (data.error === "0") {
    //       //请求成功
    //       if (this.dtWinNumberInfos.length) {
    //         //当请求前有数据时 第n次请求
    //         if (this.isUpLoading) {
    //           // 上拉加载
    //           this.dtWinNumberInfos = this.dtWinNumberInfos.concat(
    //             data.dtWinNumberInfo
    //           ); //上拉加载新数据添加到数组中
    //           this.$nextTick(() => {
    //             //在下次 DOM 更新循环结束之后执行延迟回调
    //             this.isUpLoading = false; //关闭上拉加载中
    //           });
    //           if (data.dtWinNumberInfo.length < 10) {
    //             //没有更多数据
    //             this.upFinished = true; //上拉加载完毕
    //           }
    //         }
    //         if (this.isDownLoading) {
    //           //关闭下拉刷新
    //           this.isDownLoading = false; //关闭下拉刷新中
    //           this.dtWinNumberInfos = data.dtWinNumberInfo; //重新给数据赋值
    //           if (this.upFinished) {
    //             //如果上拉加载完毕为true则设为false。解决上拉加载完毕后再下拉刷新就不会执行上拉加载问题
    //             this.upFinished = false;
    //           }
    //         }
    //       } else {
    //         //当请求没有数据时 第一次请求
    //         this.dtWinNumberInfos = data.dtWinNumberInfo;
    //       }
    //     }
    //   });
    // },
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
                console.log(res);
                // try {
                //   window.android.setPushTag("");
                // } catch (e) {}
                this.repeats = 0;
                sessionStorage.cachedata = "";
                this.clearUser();
                setTimeout(() => {
                  this.$router.push({ path: "/login" });
                }, 500);
                // if (res.status == 0) {
                // } else if (res.status == -13) {
                //   this.rescount = 0;
                //   if (res.err_code == 424) {
                //     Toast({
                //       message: "您的账户已被冻结，请联系相关工作人员",
                //       duration: 3000
                //     });
                //     setTimeout(() => {
                //       this.$router.push({ path: "/login" });
                //     }, 3000);
                //   }
                // } else if (res.status == -17) {
                //   this.$router.push({ path: "/login" });
                // } else {
                //   this.rescount = 0;
                //   const tip =
                //     this.$backStatusMap[res.status] || err[res.status];
                //   const str = tip ? this.$t(tip) : `请稍后重试 ${res.status}`;
                //   // this.$toast(str);
                // }
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
    goversioninformation() {
      this.$router.push({ path: "/versioninformation" });
    },
    gotool() {
      setTimeout(() => {
        this.$router.push({ path: "/tool" });
      }, 200);
    },
    goLink() {
      this.$router.push({ path: "/login" });
    },
    goUserName() {
      this.$router.push({
        name: "user"
      });
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
    }
  },
  components: {
    navBar: navBar,
    tabbar: tabbar
  }
};
</script>

<style lang="less" scoped>
.van-nav-bar {
  color: #fff;
  // box-shadow: 0 5px 5px #e6e6e6;
  background: linear-gradient(
    45deg,
    rgba(116, 90, 243, 1) 10%,
    rgba(92, 116, 243, 1) 100%
  );
  /* border-bottom: 0.01rem solid #616c8a; */
}
.container {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  overflow: hidden;
  color: #000000;
  background: url(../../assets/images/bgc33.png) #f2f2f2 no-repeat 0 0;
  background-size: 100% 4.8rem;
  .top {
    width: 100%;
    height: 1.5rem;
    background: linear-gradient(
      45deg,
      rgba(116, 90, 243, 1) 10%,
      rgb(93, 118, 242) 100%
    );
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
  }
  .xiala {
    height: 100%;
  }
  .user {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #f2f2f2;
    .user_con {
      width: 100%;
      height: auto;
      margin: auto;
      .user_con_item {
        height: 0.88rem;
        font-size: 0.3rem;
        background: #ffffff;
        border-bottom: 0.01rem solid #f3f3f3;
        padding: 0 0.5rem;
        color: #424b66;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        overflow: hidden;
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
            width: 18%;
            height: 45%;
          }
          span {
            padding-left: 0.1rem;
          }
        }
        button {
          width: 1.42rem;
          height: 0.48rem;
          line-height: 0.4rem;
          border-radius: 0.42rem;
          background-color: #f2f2f2;
          border: 1px solid rgb(255, 255, 255);
        }
      }
      .user_con_item:nth-child(1) {
        width: 100%;
        height: 2rem;
        // box-shadow: 0 5px 5px #e6e6e6;
        background: linear-gradient(
          90deg,
          rgba(116, 90, 243, 1) 10%,
          rgba(92, 116, 243, 1) 100%
        );
        border: none;
        button {
          color: rgb(255, 255, 255);
          background: rgba(92, 116, 243, 1);
        }
        .con_item_l {
          width: 1.14rem;
          height: 1.14rem;
          border-radius: 0.1rem;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .con_item_r {
          width: 40%;
          text-align: left;
          p {
            height: 0.6rem;
            line-height: 0.6rem;
            font-size: 0.22rem;
            color: #ffffff;
            margin-left: -0.2rem;
          }
          p:nth-child(1) {
            display: inline-block;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 0.32rem;
            color: rgb(255, 255, 255);
            font-size: 0.38rem;
          }
          p:nth-child(2) {
            display: inline-block;
            height: 0.4rem;
            line-height: 0.4rem;
            padding: 0 0.2rem;
            border: 0.01rem solid rgba(255, 255, 255, 0.3);
            border-radius: 1rem;
            text-align: center;
            color: rgba(255, 255, 255, 0.8);
          }
        }
      }
      .user_con_item:nth-child(2) {
        margin-bottom: 0.2rem;
        // border-radius: 0.12rem;
        border: none;
        .con_item_l {
          img {
            width: 25%;
            height: 53%;
          }
        }
      }
      .user_con_item:nth-child(3) {
        margin-bottom: 0.2rem;
        // border-radius: 0.12rem;
        border: none;
      }
      .user_con_item:nth-child(7) {
        // border-radius: 0 0 0.12rem 0.12rem;
        border: none;
      }
    }
  }
  .out_login {
    width: 100%;
    height: 0.88rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.28rem;
    background: #ffffff;
    border-radius: 0.12rem;
    color: #252834;
    margin: auto;
    margin-top: 0.8rem;
    border: none;
  }
}
</style>
