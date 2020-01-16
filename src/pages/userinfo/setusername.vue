<template>
  <div class="container">
    <navBar :title="title"></navBar>
    <scroller>
      <div class="container_introduction">
        <div class="introduction_text">
          <p>完善个人信息</p>
          <div class="login_input">
            <input
              type="text"
              v-model="userName"
              placeholder="请输入用户名称"
              v-validate="'required|max:10|user_nickname'"
              name="user_name"
              @blur="resetDiv"
              autofocus
            />
            <div
              class="van-field__error-message"
              v-show="errors.has('user_name') && userNameFlag.touched"
            >{{ errors.first('user_name') }}</div>
          </div>
          <div>
            <van-button class="introduction_start" @click="getNext()">完成</van-button>
          </div>
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import navBar from "../../components/navBar";
import { Toast, Dialog } from "vant";
import { updateUserinfo, getUserinfo } from "../../common/js/api.js";
import { log } from "util";
import { mapFields } from "vee-validate";
import { err } from "../../common/js/status";

export default {
  data() {
    return {
      repeats: 0, //防止重复点击
      rescount: 0, //请求计数
      title: "个性昵称",
      userName: ""
    };
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
      userNameFlag: "user_name"
    })
  },
  mounted: function() {
    if (this.user_name) {
      this.userName = this.user_name;
    } else {
      this.userName = "";
    }
  },
  methods: {
    ...mapMutations(["updateUser", "clearUser"]),
    //设置昵称完成后跳转
    goLink() {
      this.$router.push({ path: "/binding" });
    },
    getNext() {
      if (this.$parent.onLine == false) {
        Toast("无法连接网络，请检查网络状态");
      } else {
        const toast = Toast.loading({
          duration: 15000, // 持续展示 toast
          forbidClick: true, // 禁用背景点击
          loadingType: "spinner",
          mask: false
        });
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
        console.log(JSON.stringify(this.userName));
        this.$validator.validate().then(valid => {
          if (!valid) {
            // do stuff if not valid.
            Toast("请输入正确昵称");
            return false;
          } else {
            let param = new Object();
            let colname = ["user_name"];
            let colvalue = [];
            colvalue.push(this.userName);
            param.login_token = this.log_token;
            param.col_name = colname;
            param.col_value = colvalue;
            console.log(param);
            updateUserinfo(param)
              .then(res => {
                console.log(res);
                Toast.clear();
                this.repeats = 0;
                if (res.status == 0) {
                  if (res.err_code == 0) {
                    this.rescount = 0;
                    this.updateUser({
                      log_token: res.data.login_token,
                      user_name: this.userName
                    });
                    // if (res.err_code == 0) {
                    Toast.success({
                      message: "修改成功",
                      duration: 800
                    });
                    setTimeout(() => {
                      //修改完成之后回到个人中心
                      this.$router.push({
                        path: "/usercenter"
                      });
                    }, 1000);
                  } else if (res.err_code == 500) {
                    this.rescount = 0;
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
                } else if (res.status == -900) {
                  this.rescount = 0;
                  this.$router.push({ path: "/login" });
                } else if (res.status == -5) {
                  this.rescount++;
                  this.getNext();
                } else if (res.status == -17) {
                  this.rescount = 0;
                  Dialog.alert({
                    message: "账号在其它地方登录，请重新登录"
                  }).then(() => {
                    this.clearUser();
                    this.$router.push({ path: "/login" });
                  });
                } else {
                  this.rescount = 0;
                  const tip =
                    this.$backStatusMap[res.status] || err[res.status];
                  const str = tip ? this.$t(tip) : `请稍后重试 ${res.status}`;
                  this.$toast(str);
                }
              })
              .catch(error => {
                Toast.clear();
                this.repeats = 0;
                this.rescount++;
                this.getNext();
                // Toast("网络错误，请重新请求1");
              });
          }
        });
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
  .container_introduction {
    width: 100%;
    margin: auto;
    margin-top: 1.4rem;
    overflow: hidden;
    background: #f8f8f8;
    display: flex;
    justify-content: center;
    align-items: center;
    .introduction_text {
      font-size: 0.4rem;
      color: #cccccc;
      width: 6.9rem;
      height: 6.4rem;
      background: #f8f8f8;
      border-radius: 0.12rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-direction: column;
      margin-top: 0;
      p {
        width: 100%;
        font-size: 0.64rem;
        color: #000;
        text-align: left;
        padding-left: 1rem;
        margin-top: 1rem;
      }
      .login_input {
        input {
          border: none;
          color: #cccccc;
          background: none;
          text-align: left;
          outline: none;
          padding-bottom: 0.1rem;
          padding-left: 0.2rem;
          width: 5.7rem;
          color: #000000;
          font-size: 0.35rem;
          margin-top: 1.28rem;
          border-radius: 0;
          border-bottom: #bebebe 1px solid;
        }
      }
      .introduction_start {
        font-size: 0.3rem;
        color: #ffffff;
        margin: 0 auto;
        background: #cccccc;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 5.9rem;
        height: 0.88rem;
        background: linear-gradient(
          90deg,
          rgba(132, 90, 243, 1) 0%,
          rgba(92, 116, 243, 1) 100%
        );
        border-radius: 1rem;
        margin-bottom: 1.84rem;
        border: none;
        margin-top: 1.1rem;
      }
    }
  }
}
input[type="text"]:focus {
  border-bottom: 1px solid #fa9f47 !important;
}
</style>
