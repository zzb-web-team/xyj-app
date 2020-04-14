<template>
  <div class="container">
    <navBar></navBar>
    <div>
      <div class="contnet">请输入邮箱XXX收到的验证码后，进行登录密码重置</div>
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
    </div>
    <div class="down">
      <van-button class="introduction_start" @click="goreset()">下一步</van-button>
    </div>
  </div>
</template>
<script>
import navBar from "../../components/navBar";
import { get_code } from "../../common/js/api.js";
export default {
  data() {
    return {
      testCode: "",
      YzmStatus: true,
      timeout: false
    };
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
    //去下一页
    goreset() {
      this.$router.push({ path: "/reset" });
    },
    resetDiv() {
      //ios 兼容，input失去焦点后界面上移不恢复的问题
      setTimeout(() => {
        let scrollHeight =
          document.documentElement.scrollTop || document.body.scrollTop || 0;
        window.scrollTo(0, Math.max(scrollHeight - 1, 0));
      }, 100);
    }, //验证获取验证码
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
  .contnet {
    width: 90%;
    margin: 0 auto;
    margin-top: 4.2rem;
    font-size: 0.35rem;
    text-align: left;
  }
  .verificationcode {
    width: 90%;
    border-bottom: #f14d84 1px solid;
    display: flex;
    flex-direction: row;
    margin: 0 auto;
    margin-top: 1.4rem;
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
      margin-left: 0.4rem;
      height: 0.6rem;
      background: #ff467c;
      color: #ffffff;
      border-radius: 0.1rem;
      font-size: 0.3rem;
      // margin-top: 1.68rem;
      border: none;
    }
  }
  .down {
    margin-top: 1.2rem;
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
}
</style>


