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
          <div class="loginemile">
            <img src="../../assets/images/login_icon_pho.png" alt />
            <input
              v-validate="'required|phone'"
              name="phone"
              autofocus
              type="tel"
              v-model="phoneNum"
              placeholder=" 请输入登录密码"
              @blur="resetDiv"
              @input="formatPhone"
            />
          </div>
        </div>
        <div class="protocol">
          注册即同意
          <span @click="goprotocol()">用户协议</span>和
          <span @click="goprivacy()">隐私协议</span>
          <span @click="gopforgetpassword()">忘记密码</span>
        </div>
        <div class="nelile">
          <span @click="registration()">没有注册邮箱</span>
        </div>
        <div class="down">
          <div class="emali" @click="emaillogin()">↑↓切换手机号登录</div>
          <van-button class="introduction_start">下一步</van-button>
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
      phoneNum: ""
    };
  },
  computed: {
    ...mapFields({
      phoneFlag: "phone"
    })
  },
  mounted() {},
  methods: {
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
    //去注册邮箱
    registration() {
      this.$router.push({ path: "/emailregistration" });
    },
    //忘记密码
    gopforgetpassword() {
      this.$router.push({ path: "/pforgetpassword" });
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


