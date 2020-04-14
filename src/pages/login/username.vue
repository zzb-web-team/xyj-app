<template>
  <div class="container">
    <navBar :title="title"></navBar>
    <scroller>
      <div class="container_introduction">
        <div class="introduction_text">
          <p>完善个人信息</p>
          <div class="login_input">
            <input
              v-validate="'required|max:10|user_nickname'"
              name="user_name"
              type="text"
              v-model="userName"
              placeholder="请输入用户名称"
              @blur="resetDiv"
              maxlength="10"
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

export default {
  data() {
    return {
      repeats: 0, //防止重复点击
      rescount: 0, //请求计数
      title: "完善个人信息",
      userName: ""
    };
  },
  computed: {
    ...mapFields({
      userNameFlag: "user_name"
    }),
    ...mapState({
      log_token: state => state.user.log_token,
      phone_number: state => state.user.phone_number,
      user_name: state => state.user.user_name,
      user_sex: state => state.user.user_sex,
      charge_psd: state => state.user.charge_psd
    })
  },
  mounted() {},
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
        this.$validator.validate().then(valid => {
          setTimeout(() => {
            //let myreg=/^\d{6}$/
            if (!valid) {
              Toast("请输入正确昵称");
              return false;
            }
            let param = new Object();
            let colname = ["user_name"];
            let colvalue = [];
            colvalue.push(this.userName);
            param.login_token = this.log_token;
            param.col_name = colname;
            param.col_value = colvalue;
            updateUserinfo(param)
              .then(res => {
                //res==-1时，token过期，重新登登录
                if (res.status == -1) {
                  Toast(`${res.msg}`);
                  setTimeout(() => {
                    this.$router.push({
                      path: "/"
                    });
                  }, 1000);
                } else if (res.status == 0) {
                  // Toast("设置完毕，3秒后进入主页");
                  // this.$store.commit("changeLogin", {
                  //   token: res.login_token
                  // });
                  //存数据
                  this.updateUser({
                    log_token: res.login_token,
                    user_name: this.userName
                  });

                  //设置3秒后跳转
                  setTimeout(() => {
                    this.goLink();
                  }, 1000);
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
                } else if (res.status == -17) {
                  Dialog.alert({
                    message: "账号在其它地方登录，请重新登录"
                  }).then(() => {
                    this.clearUser();
                    this.$router.push({ path: "/login" });
                  });
                } else if (res.status == -999) {
                  Toast("登录已过期，请重新登录");
                  this.clearUser();
                  setTimeout(() => {
                    this.$router.push({ path: "/login" });
                  }, 1000);
                } else if (res.status == -500) {
                } else if (res.status == -900) {
                } else {
                  const tip =
                    this.$backStatusMap[res.status] || err[res.status];
                  const str = tip ? this.$t(tip) : `请稍后重试 ${res.status}`;
                  this.$toast(str);
                }
              })
              .catch(error => {
                // Toast("网络错误，请重新请求4");
              });
          }, 100);
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
    height: 100%;
    margin: 0 auto;
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
      background: #fff;
      border-radius: 0.12rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-direction: column;
      p {
        width: 100%;
        font-size: 0.6rem;
        color: #000;
        text-align: left;
        padding-left: 1rem;
        margin-top: 1rem;
      }
      .login_input {
        input {
          border: none;
          background: none;
          text-align: left;
          outline: none;
          border-bottom: #fa4280 1px solid;
          padding-bottom: 0.1rem;
          padding-left: 0.2rem;
          width: 5.7rem;
          color: #000;
          font-size: 0.35rem;
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
</style>
