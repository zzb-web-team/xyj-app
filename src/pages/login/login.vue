<template>
  <div class="container">
    <!-- <van-nav-bar :z-index="2000"></van-nav-bar> -->

    <div class="container_introduction">
      <div class="welcome">手机号登陆</div>
      <div class="introduction_text">
        <div class="login_input">
          <!-- <p>手机号</p> -->
          <div class="loginPpho">
            <!-- <img src="../../assets/images/login_icon_pho.png" alt /> -->
            <input
              v-validate="'required|phone'"
              name="phone"
              type="tel"
              v-model="phoneNum"
              ref="input"
              placeholder=" 请输入手机号码"
              @blur="resetDiv"
              @input="formatPhone"
              autofocus
            />
          </div>

          <div
            class="van-field__error-message"
            v-show="errors.has('phone') && phoneFlag.touched"
          >{{ errors.first('phone') }}</div>
        </div>

        <div class="protocol">
          注册即同意
          <span @click="goprotocol()">用户协议</span>及
          <span @click="goprivacy()">隐私协议</span>
        </div>

        <div class="down">
          <!-- <div class="emali" @click="emaillogin()">↑↓切换邮箱登录</div> -->
          <van-button class="introduction_start" @click="getCode()">登录</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
// import navBar from "../../components/navBar";
import { authen, get_code } from "../../common/js/api.js";

import { Toast, PasswordInput, NumberKeyboard } from "vant";
import { mapFields } from "vee-validate";

export default {
  data() {
    return {
      phoneNum: "",
      show: false,
      codeType: ""
    };
  },
  created() {
    try {
      window.android.setStatusBarAndNavigationBarColor("1", "#ffffff");
    } catch (e) {}
    try {
      window.webkit.messageHandlers.setStatusBarAndNavigationBarColor.postMessage(
        "#ffffff"
      );
    } catch (e) {}
  },

  mounted() {
    // window.get_pushid("090909090");
  },
  computed: {
    ...mapFields({
      phoneFlag: "phone"
    })
  },
  methods: {
    ...mapMutations(["updateUser", "clearUser"]),
    formatPhone(e) {
      const target = event.target;
      const value = target.value;
      if (value && value.length > 11) {
        this.phoneNum = value.substr(0, 11);
      } else {
        this.phoneNum = value;
      }
    },
    //去用户协议
    goprotocol() {
      this.$router.push({ path: "/useragreement" });
    },
    //去隐私协议
    goprivacy() {
      this.$router.push({ path: "/privacy" });
    },
    //去邮箱登录
    emaillogin() {
      this.$router.push({ path: "/emaillogin" });
    },
    //输入手机号验证，跳转下一步
    getCode() {
      this.$validator.validate().then(valid => {
        if (!valid) {
          Toast("请输入正确手机号码");
          return false;
        }
        this.$router.push({
          path: "/loginCode",
          query: { phoneNum: this.phoneNum }
        });
      });
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
  // components: {
  //   navBar: navBar
  // }
};
</script>

<style lang="less" scoped >
body {
  height: 100%;
}
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
    //margin-top: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: url(../../assets/images/log_bottom.png) no-repeat;
    background-size: 100% auto;
    background-position: bottom;
    .welcome {
      width: 76%;
      text-align: left;
      font-size: 0.48rem;
      font-weight: 500; //加粗
      color: #333333;
    }
    .introduction_text {
      font-size: 0.4rem;
      color: #000000;
      width: 76%;
      height: 5.4rem;
      border-radius: 0.12rem;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-direction: column;
      .protocol {
        width: 100%;
        font-size: 0.24rem;
        text-align: left;
        margin-top: 0.15rem;
        color: #666666;
        font-weight: 500;
        span {
          color: #417bfe;
          font-weight: 500;
        }
      }
      .login_input {
        width: 100%;
        p {
          margin-top: 0.78rem;
          text-align: left;
          font-size: 0.3rem;
        }
        .loginPpho {
          width: 100%;
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
            line-height: 0.58rem;
            // padding-left: 0.4rem;
            width: 100%;
            // color: #ffffff;
            font-size: 0.28rem;
            margin-top: 1rem;
            padding-bottom: 0.1rem;
            border-radius: 0;
            border-bottom: #bebebe 1px solid;
          }
        }
      }
      .down {
        margin-top: 0.5rem;
        .emali {
          font-size: 0.28rem;
        }
        .introduction_start {
          font-size: 0.3rem;
          color: #ffffff;
          margin: 0 auto;
          background: #cccccc;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 5.7rem;
          height: 0.88rem;
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
}
input[type="tel"]:focus,
input[type="text"]:focus {
  border-bottom: 1px solid #fa9f47 !important;
}
</style>
