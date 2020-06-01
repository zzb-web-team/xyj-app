<template>
  <div class="container">
    <navBar :title="title" :right-text="title">
      <van-icon name="search" slot="right" />
    </navBar>
    <scroller>
      <div class="user">
        <div class="user_con">
          <!-- <div class="user_con_item user_con_item_top">
            <div class="con_item_l">
              <img src="../../assets/images/icon_bg_set.png" alt />
              <span>请设置交易密码，在兑换积分时使用</span>
            </div>
          </div> -->
          <div class="user_con_item">
            <div class="con_item_l">
              <input
                type="password"
                placeholder=" 请输入密码(6位数字)"
                v-model="userPassword"
                @blur="resetDiv"
                oninput="this.value=this.value.length>4?this.value.substr(0,6):this.value;"
                autofocus
              />
            </div>
            <van-icon
              name="clear"
              color="#CBCBCB"
              size="20"
              @click="clearpwd"
            />
          </div>
          <div class="user_con_item user_con_item_active">
            <div class="con_item_l">
              <input
                type="password"
                placeholder=" 请再次输入密码"
                v-model="userConfirmPassword"
                @blur="resetDiv"
                oninput="this.value=this.value.length>4?this.value.substr(0,6):this.value;"
              />
            </div>
            <van-icon
              name="clear"
              color="#CBCBCB"
              size="20"
              @click="clearpwds"
            />
          </div>
        </div>
        <div>
          <van-button class="introduction_start" @click="goLink()"
            >提交</van-button
          >
        </div>
      </div>
    </scroller>
    <van-action-sheet
      v-model="show"
      title="安全验证"
      :close-on-click-overlay="false"
      :round="false"
      class="dot"
    >
      <div class="users">
        <div class="user_con">
          <div class="user_con_item">
            <div class="con_item_l topnumber">
              <!-- <img src="../../assets/images/icon_bg_alteration.png" alt /> -->
              <span>{{ phone_number }}</span>
            </div>
          </div>
          <div class="user_con_item user_con_item_active">
            <div class="con_item_l">
              <!-- <span>验证码</span> -->
              <input
                class="yanzhengma"
                type="tel"
                placeholder=" 请输入验证码"
                v-model="YzmCodeInput"
                @blur="resetDiv"
                oninput="this.value=this.value.length>4?this.value.substr(0,6):this.value;"
              />
              <div v-if="YzmStatus">
                <van-button class="codeYzm" @click="gettelCode()"
                  >发送</van-button
                >
              </div>
              <div v-else>
                <van-button class="codeYzm" v-if="!YzmStatus"
                  >{{ count }}S</van-button
                >
              </div>
            </div>
          </div>
        </div>

        <div>
          <van-button class="introduction_start" @click="gonext()"
            >确认</van-button
          >
        </div>
        <!-- <div class="login_title">更换新手机后需重新登录</div> -->
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import navBar from "../../components/navBar";
import { Toast, Dialog } from "vant";
import { updateUserinfo, get_code, login } from "../../common/js/api.js";
import { err } from "../../common/js/status";

export default {
  data() {
    return {
      repeats: 0, //防止重复点击
      rescount: 0, //请求计数
      title: "交易密码设置",
      active: 2,
      userPassword: "",
      show: false,
      YzmStatus: true,
      YzmCodeInput: "",
      userConfirmPassword: ""
    };
  },
  computed: mapState({
    log_token: state => state.user.log_token,
    phone_number: state => state.user.phone_number,
    user_name: state => state.user.user_name,
    user_sex: state => state.user.user_sex,
    charge_psd: state => state.user.charge_psd
  }),
  mounted: function() {},
  methods: {
    ...mapMutations(["updateUser", "clearUser"]),
    clearpwd() {
      this.userPassword = "";
    },
    clearpwds() {
      this.userConfirmPassword = "";
    },
    goLink() {
      let myreg = /^\d{6}$/;
      if (!myreg.test(this.userPassword)) {
        Toast("请输入6位数数字密码");
        return false;
      }
      if (this.userPassword != this.userConfirmPassword) {
        Toast("确认密码和设置的密码不一致");
        return false;
      }
      this.show = true;
    },
    setpwd() {
      if (this.$parent.onLine == false) {
        Toast("无法连接网络，请检查网络状态");
      } else {
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
        const toast = Toast.loading({
          duration: 15000, // 持续展示 toast
          forbidClick: true, // 禁用背景点击
          loadingType: "spinner",
          mask: false
        });
        // 初次设置密码
        let param = new Object();
        let colname = ["charge_psd"];
        let colvalue = [];
        colvalue.push(this.userConfirmPassword);
        param.login_token = this.log_token;
        param.col_name = colname;
        param.col_value = colvalue;
        updateUserinfo(param)
          .then(res => {
            Toast.clear();
            this.repeats = 0;
            //res==-1时，token过期，重新登登录
            if (res.status == 0) {
              if (res.err_code == 0) {
                this.rescount = 0;
                this.updateUser({
                  log_token: res.data.login_token,
                  charge_psd: 1
                });
                // if (res.err_code == 0) {
                Toast.success({
                  message: "设置成功",
                  duration: 800
                });
                setTimeout(() => {
                  //修改完成之后回到个人中心
                  this.$router.push({
                    path: "/usercenter"
                  });
                }, 1000);
              } else {
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
            } else if (res.status == -999) {
              this.rescount = 0;
              Toast("登录已过期，请重新登录");
              this.clearUser();
              setTimeout(() => {
                this.$router.push({ path: "/login" });
              }, 1000);
            } else if (res.status == -17) {
              this.rescount = 0;
              Dialog.alert({
                message: "账号在其它地方登录，请重新登录"
              }).then(() => {
                this.clearUser();
                this.$router.push({ path: "/login" });
              });
            } else if (res.status == -900) {
              this.rescount = 0;
              Toast("登录已过期，请重新登录");
              this.clearUser();
              setTimeout(() => {
                this.$router.push({ path: "/login" });
              }, 1000);
            } else if (res.status == -5) {
              this.rescount++;
              this.setpwd();
            } else {
              const tip = this.$backStatusMap[res.status] || err[res.status];
              const str = tip ? this.$t(tip) : `请稍后重试 ${res.status}`;
              this.$toast(str);
            }
          })
          .catch(error => {
            this.repeats = 0;
            this.rescount++;
            this.setpwd();
            // Toast("网络错误，请重新请求");
          });
      }
    },
    gonext() {
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
        console.log(this.YzmCodeInput);
        if (this.YzmCodeInput == "") {
          Toast("验证码不能为空");
        } else {
          let reg = /^\d{6}$/;
          if (!reg.test(this.YzmCodeInput)) {
            Toast("验证码为6位数字，请检查验证码格式");
          } else {
            let param = new Object();
            param.user_name = this.phone_number;
            param.user_passwd = this.YzmCodeInput;
            param.login_type = 1;
            this.show = false;
            login(param)
              .then(res => {
                Toast.clear();
                if (res.status == 0) {
                  this.updateUser({
                    log_token: res.data.login_token
                  });
                  this.setpwd();
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
                }
              })
              .catch(error => {});
          }
        }
      }
    },
    gettelCode() {
      if (this.$parent.onLine == false) {
        Toast("无法连接网络，请检查网络状态");
      } else {
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
        //个人中心获取验证码
        let user_tel = this.phone_number;
        let myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!myreg.test(this.phone_number)) {
          Toast("请输入正确手机号码");
          this.repeats = 0;
          return false;
        }
        let params = new Object();
        let changetelnumflag = 0;
        params.user_tel = this.phone_number;
        params.change_telnum_flag = changetelnumflag;
        //params.login_token = this.log_token; //token;
        get_code(params)
          .then(res => {
            this.repeats = 0;

            if (res.status == 0) {
              if (res.err_code == 499) {
                this.rescount = 0;
                //验证码倒计时
                if (!this.timer) {
                  this.YzmStatus = false;
                  const nowCount = 60;
                  this.count = nowCount;
                  this.timer = setInterval(() => {
                    if (this.count > 0 && this.count <= nowCount) {
                      this.count--;
                    } else {
                      this.YzmStatus = true;
                      clearInterval(this.timer);
                      this.timer = null;
                    }
                  }, 1000);
                  //. }
                }
              } else {
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
            } else if (res.status == -900) {
              this.rescount = 0;
              this.$router.push({ path: "/login" });
            } else {
              this.rescount = 0;
              const tip = this.$backStatusMap[res.status] || err[res.status];
              const str = tip ? this.$t(tip) : `请稍后重试 ${res.status}`;
              this.$toast(str);
            }
          })
          .catch(error => {
            this.repeats = 0;
            this.rescount++;
            this.gettelCode();
            // Toast("网络错误，请重新请求106");
          });
      }
    },
    preventNotNumber(event) {
      let keyValue = event.key;
      if (
        !calculator.isBackspace(keyValue) &&
        !calculator.isDot(keyValue) &&
        !calculator.isNumber(keyValue)
      ) {
        // 其他按键
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    },
    resetDiv() {
      //ios 兼容，input失去焦点后界面上移不恢复的问题
      setTimeout(() => {
        let scrollHeight =
          document.documentElement.scrollTop || document.body.scrollTop || 0;
        window.scrollTo(0, Math.max(scrollHeight - 1, 0));
      }, 100);
    }
  },

  components: {
    navBar: navBar
  }
};
</script>

<style lang="less" scoped>
/deep/.van-popup {
  width: 94%;
  padding: 3%;
  overflow-y: scroll;
  background: #ffffff;
}
/deep/.van-action-sheet__header {
  font-size: 0.42rem;
  font-weight: 600;
  color: #333333;
}
.container {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  overflow: hidden;
  background: #f8f8f8;
  .user {
    width: 100%;
    // height: 6.72rem;
    background: #f8f8f8;
    border-radius: 0.12rem;
    overflow: hidden;
    margin: 0 auto;
    margin-top: 0.92rem;
    .user_con {
      width: 100%;
      height: auto;
      margin: 0 auto;
      margin-top: 0.2rem;
      .user_con_item {
        width: 100%;
        height: 1rem;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 0rem 0rem;
        box-sizing: border-box;
        margin: 0 auto;
        color: #000000;
        font-size: 0.3rem;
        background-color: #fff;
        .con_item_l {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 92%;
          height: 1rem;
          font-size: 0.3rem;
          font-weight: 400;
          color: #888fa9;
          line-height: 1rem;
          border-top: 0.01rem solid #f2f3f3;
        }
        input {
          height: 0.6rem;
          line-height: 0.6rem;
          color: #000;
          background: none;
          border: none;
          padding-left: 0.2rem;
        }
        &.user_con_item_active {
          .con_item_l {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 92%;
            height: 1rem;
            font-size: 0.3rem;
            font-weight: 400;
            color: #888fa9;
            line-height: 1rem;
            border-top: 0.01rem solid #f2f3f3;
          }
          .codeYzm {
            width: 1.4rem;
            height: 0.6rem;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #cccccc;
            color: #888fa9;
            border-radius: 0.1rem;
          }
        }
      }
      .user_con_item_top {
        border: none;
        background-color: #f8f8f8;
        .con_item_l {
          height: 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: auto;
          color: #000;
          img {
            width: 8%;
          }
          span {
            color: #666666;
            font-size: 0.28rem;
          }
        }
      }
    }
    .out_login {
      width: 100%;
      height: 0.8rem;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 0.3rem;
      background: #ffffff;
      color: red;
      margin-top: 1.5rem;
    }
  }
  .dot {
    .users {
      width: 100%;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      .user_con {
        height: auto;
        margin: 0 auto;
        width: 100%;
        .user_con_item {
          width: 100%;
          height: 0.88rem;
          line-height: 0.88rem;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          box-sizing: border-box;
          margin: auto;
          font-size: 0.3rem;
          background-color: #fff;
          border-bottom: 0.01rem solid #eeeeee;
          .con_item_l {
            width: 100%;
            height: 0.82rem;
            line-height: 0.82rem;
            background-color: #fff;
            span {
              font-size: 0.3rem;
              color: #000000;
            }
          }

          .topnumber {
            width: 100%;
            border: none;
            color: #aaaaaa;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            text-align: left;
            font-weight: 600;
            img {
              width: 7%;
            }
            span {
              color: #666666;
            }
          }
          &:nth-child(1) {
            width: 100%;
            text-align: left;
            margin: auto;
          }
          input {
            margin: 0.1rem 0;
            width: 100%;
            height: 0.4rem;
            line-height: 0.4rem;
            outline: none;
            background: none;
            border: none;
            color: #000000;
          }
          &.user_con_item_active {
            .con_item_l {
              display: flex;
              justify-content: flex-start;
              align-items: center;
              font-size: 0.3rem;
              font-weight: 400;
              color: rgb(0, 0, 0);
              line-height: 0.82rem;
              text-align: center;
              width: 98%;
              .yanzhengma {
                width: 100%;
                padding-left: 0.1rem;
              }
            }
            .codeYzm {
              width: 2rem;
              height: 0.62rem;
              background: none;
              color: #3c7cfe;
              width: 1.35rem;
              height: 0.6rem;
              border: 0.02rem solid;
              border-image: linear-gradient(90deg, #5199ff, #205aff) 10 10;
              border-radius: 1rem;
              span {
                color: #3c7cfe;
                font-size: 0.24rem;
              }
            }
          }
        }
        .user_con_item:nth-child(1) {
          border: none;
          .con_item_l {
            background: #ffffff;
          }
        }
      }
      .out_login {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 0.35rem;
        background: #ffffff;
        color: red;
        line-height: 0.8rem;
      }
    }
  }
}

.introduction_start {
  width: 6.87rem;
  height: 0.88rem;
  background: linear-gradient(
    90deg,
    rgba(254, 168, 107, 1) 0%,
    rgba(255, 109, 110, 1) 100%
  );
  border-radius: 0.1rem;
  line-height: 0.88rem;
  font-size: 0.32rem;
  text-align: center;

  color: #ffffff;
  margin: auto;
  margin-top: 0.8rem;
  border: none;
}
</style>
