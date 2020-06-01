<template>
  <div class="container">
    <navBar></navBar>

    <div class="container_introduction">
      <div class="introduction_text">
        <div class="login_input">
          <div class="loginPpho">
            <img src="../../assets/images/login_icon_pho.png" alt />
            <input
              v-validate="'required|phone'"
              name="phone"
              autofocus
              type="tel"
              v-model="phoneNum"
              placeholder=" 请输入邮箱地址"
              @blur="resetDiv"
              @input="formatPhone"
            />
          </div>
          <div class="verificationcode">
            <img src="../../assets/images/login_icon_pho.png" alt />
            <input
              type="tel"
              name="yzm"
              v-validate="'required|digits:6'"
              v-model="testCode"
              placeholder="请输入验证码"
              @blur="resetDiv"
              @input="formatYzm"
              autofocus
            />
            <template v-if="YzmStatus">
              <van-button class="codeYzm" :disabled="timeout" @click="getCode()">获取验证码</van-button>
            </template>
            <template v-else>
              <van-button class="codeYzm" v-bind:text="count + 'S'" v-bind:style="{background:bgc}"></van-button>
            </template>
          </div>
          <div class="loginemile">
            <img src="../../assets/images/login_icon_pho.png" alt />
            <input
              v-validate="'required|phone'"
              name="phone"
              autofocus
              type="tel"
              v-model="password"
              placeholder=" 请输入登录密码"
              @blur="resetDiv"
              @input="formatPwd"
            />
          </div>
        </div>
        <div class="protocol">
          注册即同意
          <span @click="goprotocol()">用户协议</span>和
          <span @click="goprivacy()">隐私协议</span>
        </div>

        <div class="down">
          <div class="emali" @click="emaillogin()">↑↓切换手机号登录</div>
          <van-button class="introduction_start">注册并登录</van-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import navBar from "../../components/navBar";
import { authen, get_code } from "../../common/js/api.js";

import { Toast, PasswordInput, NumberKeyboard } from "vant";
import { mapFields } from "vee-validate";
export default {
  data() {
    return {
      phoneNum: "",
      testCode: "",
      password: "",
      timeout: false,
      YzmStatus: true
    };
  },
  computed: {
    ...mapFields({
      phoneFlag: "phone"
    })
  },
  mounted() {},
  methods: {
    formatYzm(e) {
      const target = event.target;
      const value = target.value;
      if (value && value.length > 6) {
        this.testCode = value.substr(0, 6);
      } else {
        this.testCode = value;
      }
    },
    formatPhone(e) {
      const target = event.target;
      const value = target.value;
      if (value && value.length > 11) {
        this.phoneNum = value.substr(0, 11);
      } else {
        this.phoneNum = value;
      }
    },
    formatPwd(e) {
      const target = event.target;
      const value = target.value;
      if (value && value.length > 10) {
        this.password = value.substr(0, 10);
      } else {
        this.password = value;
      }
    },
    //去用户协议
    goprotocol() {
      this.$router.push({ path: "/protocol" });
    },
    //去隐私协议
    goprivacy() {
      this.$router.push({ path: "/privacy" });
    },
    //去手机登录
    emaillogin() {
      this.$router.push({ path: "/login" });
    },
    resetDiv() {
      //ios 兼容，input失去焦点后界面上移不恢复的问题
      setTimeout(() => {
        let scrollHeight =
          document.documentElement.scrollTop || document.body.scrollTop || 0;
        window.scrollTo(0, Math.max(scrollHeight - 1, 0));
      }, 100);
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
        let param = new Object();
        let change_telnumflag = 0;
        param.user_tel = this.$route.query.phoneNum;
        param.change_telnum_flag = change_telnumflag;
        get_code(param) //获取验证码
          .then(res => {
            if (res.status == 0) {
              if (res.err_code == 499) {
                //验证码倒计时
                if (!this.timer) {
                  this.bgc = "#D2D2D2";
                  this.YzmStatus = false;
                  const nowCount = 60;
                  this.count = nowCount;
                  // this.timeout = false;
                  this.timer = window.setInterval(() => {
                    if (this.count > 0 && this.count <= nowCount) {
                      this.count -= 1;
                    } else {
                      this.bgc = "#E74A7E";
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
          .catch(error => {});
      }
    }
  },
  components: {
    navBar: navBar
  }
};
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  overflow: hidden;
  background-color: #fff;
  .container_introduction {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    overflow: hidden;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .welcome {
      width: 92%;
      text-align: left;
      font-size: 0.6rem;
      padding-left: 1rem;
      font-weight: 700; //加粗
    }
    .introduction_text {
      font-size: 0.4rem;
      color: #000000;
      width: 80%;
      height: 8.4rem;
      border-radius: 0.12rem;
      display: flex;
      //   justify-content: flex-start;
      align-items: center;
      flex-direction: column;
      .protocol {
        width: 100%;
        font-size: 0.28rem;
        text-align: left;
        margin-top: 0.2rem;
        span {
          color: #43bff9;
        }
        span:nth-child(3) {
          float: right;
          color: #808080;
        }
      }
      .login_input {
        width: 100%;
        .loginPpho {
          width: 100%;
          border-bottom: #f14d84 1px solid;
          display: flex;
          flex-direction: row;
          img {
            width: 0.4rem;
            height: 0.4rem;
            margin-top: 1.68rem;
          }
          input {
            border: none;
            background: none;
            text-align: left;
            outline: none;
            padding-bottom: 0.1rem;
            padding-left: 0.4rem;
            width: 80%;
            // color: #ffffff;
            font-size: 0.35rem;
            margin-top: 1.68rem;
          }
        }
        .verificationcode {
          width: 100%;
          border-bottom: #f14d84 1px solid;
          display: flex;
          flex-direction: row;
          margin-top: 0.4rem;
          img {
            width: 0.4rem;
            height: 0.4rem;
          }
          input {
            border: none;
            background: none;
            text-align: left;
            outline: none;
            padding-bottom: 0.1rem;
            padding-left: 0.4rem;
            width: 44%;
            // color: #ffffff;
            font-size: 0.35rem;
          }
          .codeYzm {
            width: 2.1rem;
            margin-left: 0.2rem;
            height: 0.6rem;
            background: #ff467c;
            color: #ffffff;
            border-radius: 0.1rem;
            font-size: 0.3rem;
            // margin-top: 1.68rem;
            border: none;
          }
        }
        .loginemile {
          width: 100%;
          border-bottom: #f14d84 1px solid;
          display: flex;
          flex-direction: row;
          margin-top: 0.4rem;
          img {
            width: 0.4rem;
            height: 0.4rem;
          }
          input {
            border: none;
            background: none;
            text-align: left;
            outline: none;
            padding-bottom: 0.1rem;
            padding-left: 0.4rem;
            width: 80%;
            // color: #ffffff;
            font-size: 0.35rem;
          }
        }
      }
      .down {
        margin-top: 1.2rem;
        .emali {
          font-size: 0.28rem;
          span {
            border-bottom: 0.01rem solid #cccccc;
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
          border: none;
          margin-top: 0.2rem;
        }
      }
      .nelile {
        width: 100%;
        font-size: 0.3rem;
        margin-top: 0.3rem;
        text-align: left;
        span {
          border-bottom: 0.01rem solid #cccccc;
        }
      }
    }
  }
}
</style>


