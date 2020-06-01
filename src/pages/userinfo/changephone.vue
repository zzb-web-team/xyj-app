<template>
  <div class="container">
    <navBar :title="title" :right-text="title">
      <van-icon name="search" slot="right" />
    </navBar>
    <scroller>
      <div class="user">
        <div class="user_con">
          <div class="user_con_item">
            <div class="con_item_l topnumber">
              <!-- <img src="../../assets/images/icon_bg_alteration.png" alt /> -->
              <span>验证原手机号</span>
            </div>
          </div>
          <div class="user_con_item">
            <div class="con_item_l">
              <!-- <span>手机号</span> -->
              <input
                type="tel"
                v-model="tel"
                placeholder=" 请输入新手机号码"
                @blur="resetDiv"
                oninput="this.value=this.value.length>4?this.value.substr(0,11):this.value;"
                autofocus
                disabled
              />
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
                  >获取</van-button
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
          <van-button class="introduction_start" @click="goLink()"
            >验证</van-button
          >
        </div>

        <!-- <div class="login_title">更换新手机后需重新登录</div> -->
      </div>
    </scroller>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import navBar from "../../components/navBar";
import { Toast, Dialog } from "vant";
import { get_code, settelnum, logout, login } from "../../common/js/api.js";
import { err } from "../../common/js/status";

export default {
  data() {
    return {
      repeats: 0, //防止重复点击
      rescount: 0, //请求计数
      title: "",
      active: 2,
      timer: null,
      YzmStatus: true,
      YzmCode: "",
      tel: "",
      YzmCodeInput: "",
      count: "",
      timer: null
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
    this.tel = this.phone_number;
  },
  methods: {
    ...mapMutations(["updateUser", "clearUser"]),
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
        let user_tel = this.tel;
        let myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!myreg.test(this.tel)) {
          Toast("请输入正确手机号码");
          this.repeats = 0;
          return false;
        }
        let params = new Object();
        let changetelnumflag = 0;
        params.user_tel = this.tel;
        params.change_telnum_flag = changetelnumflag;
       // params.login_token = this.log_token; //token;
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
    goLink() {
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
        let param = new Object();
        param.user_name = this.tel;
        param.user_passwd = this.YzmCodeInput;
        param.login_type = 1;
        login(param)
          .then(res => {
            if (res.status == 0 || res.status == 1) {
              this.updateUser({
                log_token: res.data.login_token
              });
              this.$router.push({ path: "/updatephone" });
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
              const tip = this.$backStatusMap[res.status] || err[res.status];
              const str = tip ? this.$t(tip) : `请稍后重试 ${res.status}`;
              this.$toast(str);
            }
          })
          .catch(error => {});

      }
    },
    resetDiv() {
      //ios 兼容，input失去焦点后界面上移不恢复的问题
      setTimeout(() => {
        let scrollHeight =
          document.documentElement.scrollTop || document.body.scrollTop || 0;
        window.scrollTo(0, Math.max(scrollHeight - 1, 0));
      }, 100);
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
  background: #ffffff;
  .user {
    margin: 1.3rem 0;
    width: 100%;
    height: 6.72rem;
    background: #ffffff;
    border-radius: 12px;
    overflow: hidden;

    .user_con {
      height: auto;
      margin: 0 auto;
      width: 92%;
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
          // border-bottom: #38446f 0.02rem solid;
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
            color: #333333;
            font-size: 0.5rem;
          }
        }
        &:nth-child(1) {
          width: 100%;
          text-align: left;
          margin: auto;
          margin-top: -0.2rem;
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
            // input {
            //   margin-left: 0.1rem;
            // }
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
        margin-top: 0.5rem;
        .con_item_l {
          background: #ffffff;
        }
      }
      .user_con_item:nth-child(2) {
        margin-top: 0.5rem;
      }
      .user_con_item:nth-child(3) {
        margin-top: 0.3rem;
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
.login_title {
  margin-top: 0.2rem;
  font-size: 0.28rem;
  color: rgba(136, 143, 169, 1);
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
  font-size: 0.3rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  line-height: 40px;
  margin: 1.2rem 0 0;
  border: none;
}
.van-button--normal {
  padding: 0px;
}
.van-button {
  line-height: 0px;
}
/** 设置input提示文字的样式*/
input::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #aaaaaa;
  font-size: 0.24rem;
}

input:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #aaaaaa;
  font-size: 0.24rem;
}

input::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #aaaaaa;
  font-size: 0.24rem;
}

input:-ms-input-placeholder {
  /* Internet Explorer 10+ */
  color: #aaaaaa;
  font-size: 0.24rem;
}
</style>
