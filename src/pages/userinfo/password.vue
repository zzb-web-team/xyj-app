<template>
  <div class="container">
    <navBar :title="title" :right-text="title">
      <van-icon name="search" slot="right" />
    </navBar>
    <scroller>
      <div class="user">
        <div class="user_con">
          <div class="user_con_item user_con_item_top">
            <div class="con_item_l">
              <img src="../../assets/images/icon_bg_set.png" alt />
              <span>请设置交易密码，在兑换积分时使用</span>
            </div>
          </div>
          <div class="user_con_item">
            <div class="con_item_l">
              <input
                type="password"
                placeholder=" 请输入6位交易密码"
                v-model="userPassword"
                @blur="resetDiv"
                oninput="this.value=this.value.length>4?this.value.substr(0,6):this.value;"
                autofocus
              />
            </div>
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
          </div>
        </div>
        <div>
          <van-button class="introduction_start" @click="goLink()">设置完成</van-button>
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import navBar from "../../components/navBar";
import { Toast, Dialog } from "vant";
import { updateUserinfo } from "../../common/js/api.js";
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
    test() {
      this.show = true;
    },
    goLink() {
      if (this.$parent.onLine == false) {
        Toast("无法连接网络，请检查网络状态");
      } else {
        let myreg = /^\d{6}$/;
        if (!myreg.test(this.userPassword)) {
          Toast("请输入6位数数字密码");
          return false;
        }
        if (this.userPassword != this.userConfirmPassword) {
          Toast("确认密码和设置的密码不一致");
          return false;
        }
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
        console.log(param);
        updateUserinfo(param)
          .then(res => {
            console.log(res);
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
              this.goLink();
            } else {
              const tip = this.$backStatusMap[res.status] || err[res.status];
              const str = tip ? this.$t(tip) : `请稍后重试 ${res.status}`;
              this.$toast(str);
            }
          })
          .catch(error => {
            this.repeats = 0;
            this.rescount++;
            this.goLink();
            // Toast("网络错误，请重新请求");
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
 
<style lang="less" scoped >
.container {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  overflow: hidden;
  background: #f8f8f8;
  .user {
    width: 100%;
    height: 6.72rem;
    background: #f8f8f8;
    border-radius: 0.12rem;
    overflow: hidden;
    margin: 0 auto;
    margin-top: 1.1rem;
    .user_con {
      width: 100%;
      height: auto;
      margin: 0 auto;
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
            width: 100%;
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
            color: #818181;
            font-size: 0.3rem;
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
}

.introduction_start {
  width: 5.9rem;
  height: 0.88rem;
  line-height: 0.88rem;
  font-size: 0.32rem;
  text-align: center;
  background: linear-gradient(
    90deg,
    rgba(116, 90, 243, 1) 10%,
    rgba(92, 116, 243, 1) 100%
  );
  border-radius: 1rem;
  color: #ffffff;
  margin: auto;
  margin-top: 0.8rem;
  border: none;
}
</style>
