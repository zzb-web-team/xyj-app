<template>
  <div class="container">
    <navBar :title="title" :right-text="title">
      <van-icon name="search" slot="right" />
    </navBar>
    <scroller>
      <div class="user">
        <div class="user_con">
          <div class="user_con_item">
            <div class="con_item_l">
              <input
                type="password"
                placeholder=" 请输入原交易密码"
                v-model="userOldPassword"
                @blur="resetDiv"
                oninput="this.value=this.value.length>4?this.value.substr(0,6):this.value;"
                autofocus
              />
            </div>
          </div>
          <div class="user_con_item">
            <div class="con_item_l">
              <input
                type="password"
                placeholder=" 请输入新的6位交易密码"
                v-model="userNewPassword"
                @blur="resetDiv"
                oninput="this.value=this.value.length>4?this.value.substr(0,6):this.value;"
              />
            </div>
          </div>
          <div class="user_con_item user_con_item_active">
            <div class="con_item_l">
              <input
                type="password"
                placeholder=" 请再次输入新的交易密码"
                v-model="userConfirmPassword"
                @blur="resetDiv"
                oninput="this.value=this.value.length>4?this.value.substr(0,6):this.value;"
              />
            </div>
          </div>
        </div>
        <div class="introduction_start" @click="goLink()">修改完成</div>
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
      title: "交易密码修改",
      active: 2,
      userOldPassword: "",
      userNewPassword: "",
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
    goLink() {
      if (this.$parent.onLine == false) {
        Toast("无法连接网络，请检查网络状态");
      } else {
        let myreg = /^\d{6}$/;
        if (!myreg.test(this.userOldPassword)) {
          Toast("请输入原6位正确密码");
          return false;
        }
        if (!myreg.test(this.userNewPassword)) {
          Toast("请输入新的6位数数字密码");
          return false;
        }
        if (this.userNewPassword != this.userConfirmPassword) {
          Toast("确认密码和设置的密码不一致");
          return false;
        }
        // 修改密码
        let param = new Object();
        let colname = ["old_charge_psd", "charge_psd"];
        let colvalue = [];
        colvalue.push(this.userOldPassword);
        colvalue.push(this.userConfirmPassword);
        param.login_token = this.log_token;
        param.col_name = colname;
        param.col_value = colvalue;
        updateUserinfo(param)
          .then(res => {
            // res==-1时，token过期，重新登登录
            if (res.status == 0) {
              this.updateUser({
                log_token: res.data.login_token,
                charge_psd: 1
              });
              if (res.err_code == 0) {
                Toast.success({
                  message: "设置成功",
                  duration: 800
                });
                setTimeout(() => {
                  //修改完成之后回到个人中心
                  this.$router.push({
                    path: "/user"
                  });
                }, 2000);
              }else {
                const sta = err[res.err_code]
                  ? this.$t(err[res.err_code])
                  : `请稍后重试 ${res.err_code}`;
                this.$toast(sta);
              }
            } else if (res.status == -13) {
              if (res.err_code == 424) {
                Toast({
                  message: "您的账户已被冻结，请联系相关工作人员",
                  duration: 3000
                });
                setTimeout(() => {
                  this.$router.push({ path: "/login" });
                }, 3000);
              }
            } else if (res.status == -15) {
              if (res.err_code == 415) {
                Toast(`原交易密码错误`);
              }
            } else if (res.status == -999) {
              Toast("登录已过期，请重新登录");
              this.clearUser();
              setTimeout(() => {
                this.$router.push({ path: "/login" });
              }, 1000);
            } else if (res.status == -900) {
              this.$router.push({ path: "/login" });
            }else if (res.status == -17) {
              Dialog.alert({
                message: "账号在其它地方登录，请重新登录"
              }).then(() => {
                this.clearUser();
                this.$router.push({ path: "/login" });
              });
            } else {
              const tip = this.$backStatusMap[res.status] || err[res.status];
              const str = tip ? this.$t(tip) : `请稍后重试 ${res.status}`;
              this.$toast(str);
            }
          })
          .catch(error => {
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
.van-nav-bar {
  color: #000;
  // box-shadow: 0 5px 5px #e6e6e6;
  /* background-color: #222a45; */
  /* border-bottom: 0.01rem solid #616c8a; */
}
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
    margin: auto;
    margin-top: 0.86rem;
    .user_con {
      width: 100%;
      height: auto;
      margin: 0 auto;
      .user_con_item {
        width: 100%;
        height: 1rem;
        line-height: 0.82rem;
        // border-bottom: #38446f 1px solid;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 0 0 0 0.2rem;
        box-sizing: border-box;
        font-size: 0.3rem;
        background-color: #fff;
        font-weight: 400;
        color: rgba(136, 143, 169, 1);
        margin: auto;
        // margin-top: 0.4rem;
        &:nth-child(1) {
          margin-top: 0.4rem;
          // border-bottom: #568fff solid;
        }
        &:nth-child(2) {
          border-top: 0.01rem #e8eceb solid;
          border-bottom: 0.01rem #e8eceb solid;
        }
        input {
          width: 100%;
          height: 0.6rem;
          line-height: 0.6rem;
          background: none;
          border: none;
          color: #000;
          // padding-left: 0.2rem;
        }
        &.user_con_item_active {
          .con_item_l {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .codeYzm {
            width: 1.4rem;
            height: 0.6rem;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #cccccc;
            color: #ffffff;
            border-radius: 0.1rem;
          }
        }
        .con_item_l {
          width: 100%;
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
  margin: auto;
  margin-top: 1.2rem;
  border: none;
}
</style>
