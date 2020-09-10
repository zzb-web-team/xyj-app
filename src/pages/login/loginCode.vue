<template>
  <div class="container" @touchmove.prevent>
    <van-nav-bar
      left-text=""
      right-text
      rrow
      fixed
      left-arrow
      @click-left="onClickLeft"
      :z-index="2000"
    />

    <div class="container_introduction">
      <div class="introduction_text">
        <div class="welcome">验证码</div>
        <div class="login_input">
          <div class="tel">
            <div>
              <i class="telnum">已发送至{{ tel }}(60秒内有效)</i>
            </div>
            <div class="codfe">
              <template v-if="YzmStatus">
                <van-button
                  class="codeYzm"
                  :disabled="timeout"
                  @click="getCode()"
                ></van-button>
              </template>
              <template v-else>
                <van-button
                  class="codeYzm"
                  v-bind:text="count + 'S'"
                ></van-button>
              </template>
            </div>
          </div>

          <div class="erification_code">
            <!-- <SecurityCode ref="signCode" v-model="authCode"></SecurityCode> -->
            <van-password-input
              :value="value"
              :mask="false"
              :gutter="10"
              :focused="showKeyboard"
              @focus="showKeyboard = true"
            />
            <van-number-keyboard
              :show="showKeyboard"
              theme="custom"
              extra-key="."
              close-button-text="完成"
              @close="onclose"
              @input="onInput"
              @delete="onDelete"
              @blur="showKeyboard = false"
            />
            <div
              class="van-field__error-message"
              v-show="errors.has('yzm') && yzmFlag.touched"
            >
              {{ errors.first("yzm") }}
            </div>
          </div>
        </div>
        <div class="get_verification_code">
          <i>没有收到验证码？</i>
          <span @click="getCode()">
            重新获取
            <strong class="arrow"></strong>
          </span>
        </div>
        <!-- <div>
          <van-button class="introduction_start" @click="goNext()">下一步</van-button>
        </div>-->
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import navBar from "../../components/navBar";
import SecurityCode from "../../components/verification";
import metu from "../../components/metu";
import { get_code, login, getUserinfo, get_tag,turnon } from "../../common/js/api.js";
import { Toast, Dialog, NavBar } from "vant";
import { mapFields } from "vee-validate";
import { err } from "../../common/js/status";
import { setTimeout } from "timers";
//import getId from '../../common/js/util'

export default {
  data() {
    return {
      repeats: 0, //防止重复点击
      rescount: 0, //请求计数
      show: false,
      timeout: true,
      timeouts: false,
      phoneCode: "",
      testCode: "",
      YzmStatus: true,
      count: 60,
      timer: null,
      tel: "",
      value: "",
      authCode: "",
      verificationcode: "",
      showKeyboard: true,
      tag: "",
      version: "1.3.2.161"
    };
  },
  components: {
    SecurityCode: SecurityCode,
    metu: metu
  },
  watch: {
    authCode(value) {
      if (value.length === 6) {
        this.verificationcode = value;
        this.value = this.verificationcode;
        this.goNext();
      }
    }
  },
  created() {
    // window.get_pushid = this.get_pushid;
  },
  mounted: function() {
    // this.changeData();
    try {
      window.android.setStatusBarAndNavigationBarColor("1", "#ffffff");
    } catch (e) {}
    try {
      window.webkit.messageHandlers.setStatusBarAndNavigationBarColor.postMessage(
        "#ffffff"
      );
    } catch (error) {}

    sessionStorage.clear();
    this.tel = this.$route.query.phoneNum;
    this.getCode();
  },
  computed: {
    ...mapState({
      log_token: state => state.user.log_token,
      phone_number: state => state.user.phone_number,
      user_name: state => state.user.user_name,
      user_sex: state => state.user.user_sex,
      charge_psd: state => state.user.charge_psd
    }),
    ...mapFields({
      yzmFlag: "yzm"
    })
  },

  methods: {
    ...mapMutations(["updateUser", "clearUser"]),
    onClickLeft() {
      this.$router.back(-1);
    },
    formatYzm(e) {
      const target = event.target;
      const value = target.value;
      if (value && value.length > 6) {
        this.testCode = value.substr(0, 6);
      } else {
        this.testCode = value;
      }
    },
    //消息推送--传tag
    push_tag() {
      // alert(this.tag)
      try {
        window.webkit.messageHandlers.setPushId.postMessage(this.tag);
      } catch (e) {}
      try {
        window.android.setPushTag(this.tag);
      } catch (e) {}
    },
    //消息推送--获取消息id
    //消息推送--获取消息id
    // get_pushid: function(data) {
    //   if (data == "(null)") {
    //     // 没有取到数据
    //     this.push_id = "a";
    //   } else {
    //     // 取到数据
    //     if (data) {
    //       // let nearr = JSON.parse(data);
    //       this.push_id = data;
    //     } else {
    //       this.push_id = "a";
    //     }
    //   }
    // },
    //点击下一步验证
    goNext() {
      const toast = Toast.loading({
        duration: 15000, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: "spinner",
        mask: false
      });
      if (this.$parent.onLine == false) {
        Toast("无网络连接，请检查网络连接状态");
      } else {
        // this.$validator.validate().then(valid => {
        // if (!valid) {
        //   Toast("请检查输入的验证码是否正确");
        //   return false;
        // }
        //检验验证码格式是否正确
        if (this.value === "") {
          Toast("验证码不能为空");
        } else {
          let reg = /^\d{6}$/;
          if (!reg.test(this.value)) {
            Toast("验证码为6位数字，请检查验证码格式");
          } else {
            if (this.repeats == 1) {
              return false;
            }
            this.repeats = 1;
            if (this.rescount >= 3) {
              Toast.clear();
              this.repeats = 0;
              this.rescount = 0;
              Toast(`请求超时，请稍后重试`);
              return false;
            }
            let param = new Object();
            param.user_name = this.$route.query.phoneNum;
            param.user_passwd = this.value;
            param.login_type = 1;
            login(param)
              .then(res => {
                Toast.clear();
                this.repeats = 0;
                if (res.status == 0) {
                  let params = new Object();
                    params.phone = this.$route.query.phoneNum;
                    params.version = this.version;
                    turnon(params)
                      .then(res => {
                      })
                      .catch(error => {
                      });
                  if (res.err_code == 0) {
                    this.rescount = 0;
                    // if (res.err_code == 0) {
                    // 老用户
                    // 获取个人信息
                    let params = new Object();
                    params.col_name = [
                      "user_name",
                      "user_tel",
                      "charge_psd",
                      "user_birth",
                      "user_sex"
                    ];
                    params.login_token = res.data.login_token;
                    this.repeats = 1;
                    if (this.rescount >= 3) {
                      this.repeats = 0;
                      this.rescount = 0;
                      return false;
                    }
                    getUserinfo(params)
                      .then(res => {
                        this.repeats = 0;
                        //res==-1时，token过期，重新登登录
                        if (res.status == 0) {
                          this.rescount = 0;
                          this.updateUser({
                            log_token: res.data.login_token,
                            phone_number: res.data.col_value[1],
                            user_name: res.data.col_value[0],
                            user_sex: res.data.col_value[4],
                            charge_psd: res.data.col_value[2]
                          });
                          //消息推送;
                          let params = new Object();
                          params.login_token = this.log_token;
                          get_tag(params)
                            .then(res => {
                              if (res.status == 0) {
                                if (res.err_code == 0) {
                                  this.updateUser({
                                    log_token: res.token_info.token
                                  });
                                  this.tag = res.data.tag;
                                  //调用原生方法并传递tag
                                  this.push_tag();
                                }
                              }
                            })
                            .catch(error => {});
                          this.$router.push({
                            path: "/first_bind"
                          });
                        } else if (res.status == -900) {
                          this.rescount = 0;
                          Toast(`验证码错误`);
                        } else if (res.status == -5) {
                          this.rescount++;
                          getUserinfo(params);
                        } else {
                          this.rescount = 0;
                          const tip =
                            this.$backStatusMap[res.status] || err[res.status];
                          const str = tip
                            ? this.$t(tip)
                            : `请稍后重试 ${res.status}`;
                          this.$toast(str);
                        }
                      })
                      .catch(error => {
                        this.repeats = 0;
                        this.rescount++;
                        getUserinfo(params);
                        // Toast("网络错误，请重新请求");
                      });
                    // } else {
                    //   const sta = err[res.err_code]
                    //     ? this.$t(err[res.err_code])
                    //     : `请稍后重试 ${res.err_code}`;
                    //   this.$toast(sta);
                    // }
                  } else if (res.err_code == 1) {
                    this.rescount = 0;
                    // if (res.err_code == 0) {
                    //获取个人信息
                    let params = new Object();
                    params.col_name = [
                      "user_name",
                      "user_tel",
                      "charge_psd",
                      "user_birth",
                      "user_sex"
                    ];
                    params.login_token = res.data.login_token;
                    this.repeats = 1;
                    if (this.rescount >= 3) {
                      this.repeats = 0;
                      this.rescount = 0;
                      return false;
                    }
                    getUserinfo(params)
                      .then(res => {
                        this.repeats = 0;
                        if (res.status == 0) {
                          this.rescount = 0;
                          this.updateUser({
                            log_token: res.data.login_token,
                            phone_number: res.data.col_value[1],
                            user_name: res.data.col_value[0],
                            user_sex: res.data.col_value[4],
                            charge_psd: res.data.col_value[2]
                          });
                          //消息推送;
                          let params = new Object();
                          params.login_token = this.log_token;
                          get_tag(params)
                            .then(res => {
                              if (res.status == 0) {
                                if (res.err_code == 0) {
                                  this.updateUser({
                                    log_token: res.token_info.token
                                  });
                                  this.tag = res.data.tag;
                                  //调用原生方法并传递tag
                                  this.push_tag();
                                }
                              }
                            })
                            .catch(error => {});
                          this.$router.push({
                            path: "/management"
                          });
                        } else {
                          this.rescount = 0;
                          const tip =
                            this.$backStatusMap[res.status] || err[res.status];
                          const str = tip
                            ? this.$t(tip)
                            : `请稍后重试 ${res.status}`;
                          this.$toast(str);
                        }
                      })
                      .catch(error => {
                        this.repeats = 0;
                        this.rescount++;
                        getUserinfo(params);
                        // Toast("网络错误，请重新请求");
                      });
                  } else {
                    const sta = err[res.err_code]
                      ? this.$t(err[res.err_code])
                      : `请稍后重试 ${res.err_code}`;
                    this.$toast(sta);
                  }
                } else if (res.status == -5) {
                  this.rescount++;
                  this.goNext();
                } else if (res.status == -13) {
                  this.rescount = 0;
                  if (res.err_code == 424) {
                    Toast(`您的账户已被冻结，请联系相关工作人员`);
                  }
                } else if (res.status == -15) {
                  this.rescount = 0;
                  if (res.err_code == 405) {
                    this.rescount = 0;
                    Toast(`验证码错误`);
                  }
                } else if (res.status == -900) {
                  this.rescount = 0;
                  Toast(`验证码不能为空`);
                } else {
                  this.rescount = 0;
                  const tip =
                    this.$backStatusMap[res.status] || err[res.status];
                  const str = tip ? this.$t(tip) : `请稍后重试 ${res.status}`;
                  this.$toast(str);
                }
              })
              .catch(error => {
                console.log(error);
                this.repeats = 0;
                this.rescount++;
                this.goNext();
                // Toast("网络错误，请重新请求2");
              });
          }
        }
      }
    },
    //验证获取验证码
    getCode() {
      if (this.$parent.onLine == false) {
        Toast("无网络连接，请检查网络连接状态");
      } else {
        this.showKeyboard = true;
        // let myreg = this.getCode;
        // if (myreg != this.phoneCode) {
        //   Toast("请输入正确验证码");
        // } else {
        //   this.$router.push({ path: "/protocol" });
        // }
        let params = new Object();
        let change_telnumflag = 0;
        params.user_tel = this.$route.query.phoneNum;
        params.change_telnum_flag = change_telnumflag;
        get_code(params) //获取验证码
          .then(res => {
            if (res.status == 0) {
              if (res.err_code == 499) {
                //验证码倒计时
                if (!this.timer) {
                  this.YzmStatus = false;
                  const nowCount = 60;
                  this.count = nowCount;
                  // this.timeout = false;
                  this.timer = window.setInterval(() => {
                    if (this.count * 1 > 0 && this.count * 1 <= nowCount) {
                      this.count -= 1;
                      if (this.count <= 9) {
                        return "0" + this.count;
                      }
                    } else {
                      this.YzmStatus = true;
                      window.clearInterval(this.timer);
                      this.timer = null;
                    }
                  }, 1000);
                  //. }
                }
              } else if (res.err_code == 402) {
                this.rescount = 0;
                Toast(`验证码请求过于频繁，请稍后重试`);
              } else {
                const sta = err[res.err_code]
                  ? this.$t(err[res.err_code])
                  : `请稍后重试 ${res.err_code}`;
                this.$toast(sta);
              }
            } else if (res.status == -13) {
              this.rescount = 0;
              if (res.err_code == 424) {
                Toast(`您的账户已被冻结，请联系相关工作人员`);
              }
            } else if (res.status == -5) {
              Toast(`验证码请求超时，请稍后重试`);
            }
            // else if (res.status == -14) {
            //   Toast(`操作过于频繁，请稍后60s后重试`);
            // }
            else {
              const tip = this.$backStatusMap[res.status] || err[res.status];
              const str = tip ? this.$t(tip) : `请稍后重试 ${res.status}`;
              this.$toast(str);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    test() {
      this.show = true;
    },
    onInput(key) {
      this.value = (this.value + key).slice(0, 6);
      if (this.value.length == 6) {
        this.showKeyboard = false;
        this.goNext();
      }
    },
    onclose() {
      this.showKeyboard = false;
      this.goNext();
    },
    onDelete() {
      this.value = this.value.slice(0, this.value.length - 1);
    },
    resetDiv() {
      //ios 兼容，input失去焦点后界面上移不恢复的问题
      setTimeout(() => {
        let scrollHeight =
          document.documentElement.scrollTop || document.body.scrollTop || 0;
        window.scrollTo(0, Math.max(scrollHeight - 1, 0));
      }, 100);
    }
  }
};
</script>

<style lang="less" scoped>
/deep/.van-password-input__security {
  height: 0.85rem;
}
/deep/.van-password-input__security li {
  border-bottom: 1px solid #333333;
  font-weight: 600;
  font-size: 0.5rem;
  // border-radius: 0.12rem;
  line-height: 0.9rem;
}
/deep/.van-nav-bar {
  background: none;
}
/deep/.van-button::before {
  background: none;
}
body {
  height: 100%;
}
.container {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  overflow: hidden;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .container_introduction {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url(../../assets/images/log_bottom.png) no-repeat;
    background-size: 100% auto;
    background-position: bottom;
    .introduction_text {
      font-size: 0.4rem;
      color: #000;
      width: 76%;
      margin: auto;
      // height: 6.4rem;
      border-radius: 0.12rem;
      display: flex;
      justify-content: space-between;
      align-items: stretch;
      flex-direction: column;
      .welcome {
        margin-top: -2.5rem;
        text-align: left;
        font-size: 0.48rem;
        font-weight: 500; //加粗
        color: #333333;
      }
      .login_input {
        margin-top: 0.5rem;
        // padding-right: 0.5rem;
        .tel {
          width: 100%;
          height: 0.6rem;
          text-align: left;
          color: #818181;
          font-size: 0.14rem;
          margin-bottom: 0.16rem;
          display: flex;
          justify-content: space-between;
          .telnum{
            font-size: 0.26rem;
          }
          .codfe {
            margin-top: -0.1rem;
          }
          span {
            color: #333333;
            font-size: 0.3rem;
          }
        }
        .erification_code {
          width: 100%;
        }
        input {
          border: none;
          color: #cccccc;
          background: none;
          text-align: left;
          outline: none;
          border-bottom: #333333 1px solid;
          padding-bottom: 0.1rem;
          padding-left: 0.4rem;
          width: 3.7rem;
          flex: 1;
          color: #888fa9;
          font-size: 0.35rem;
          // margin-top: 1.68rem;
          margin-right: 0.2rem;
        }
        .codeYzm {
          width: 0.9rem;
          height: 0.6rem;
          flex-basis: 1.7rem;
          // align-self: flex-start;
          background: none;
          color: #ffffff;
          border-radius: 0.1rem;
          font-size: 0.24rem;
          border: none;
          margin-right: 0.4rem;
        }
      }
      .get_verification_code {
        margin-top: 0.4rem;
        font-size: 0.26rem;
        text-align: left;
        width: 100%;
        i {
          color: #808080;
        }
        span {
          color: #5c74f3;
          position: relative;
          .arrow {
            width: 6px;
            height: 6px;
            border-top: 1px solid #5c74f3;
            border-right: 1px solid #5c74f3;
            transform: rotate(45deg);
            position: absolute;
            top: 0.1rem;
          }
        }
      }
      .introduction_start {
        font-size: 0.38rem;
        color: #ffffff;
        margin: 0 auto;
        background: #cccccc;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 5.9rem;
        height: 0.88rem;
        background: #43bff9;
        border-radius: 0.12rem;
        margin-bottom: 1.84rem;

        border: none;
      }
    }
  }
}
.van-button--normal {
  padding: 0px;
}
.van-button {
  line-height: 0px;
}
.van-toast--text {
  display: none;
}
// .van-password-input__security li {
//   margin: 0 0.1rem;
//   background-color: white;
//   border: 0.02rem solid #5c74f3;
//   border-radius: 0.12rem;
//   font-weight: 600;
//   font-size: 0.48rem;
// }

// .van-password-input__security {
//   background-color: #ffffff;
// }
// [class*="van-hairline"]::after {
//   border: none;
// }
.van-nav-bar {
  /* background: #222a45; */
  z-index: 2 !important;
}
.van-hairline--bottom::after {
  border-bottom-width: 0px;
}
.van-nav-bar__title {
  font-size: 0.36rem;
  color: #ffffff;
}
.van-nav-bar__text {
  color: #000000;
}
.van-nav-bar__left {
  font-size: 0.36rem;
}
.van-icon-arrow-left:before {
  color: #000000;
}
// .van-hairline {
//   line-height: 0.81rem;
// }
</style>
