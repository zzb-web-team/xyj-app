<template>
  <div class="container">
    <navBar :title="title" :right-text="title">
      <van-icon name="search" slot="right" />
    </navBar>
    <scroller>
      <div class="user_con">
        <p>个人信息</p>
        <div class="user_con_item" @click="openSetname()">
          <div class="con_item_l">用户昵称</div>
          <div class="con_item_r" v-if="setActive">
            <p>{{ user_name }}</p>
            <img src="../../assets/images/evenmore.png" />
          </div>
        </div>
        <div class="user_con_item">
          <div class="con_item_l">性别</div>
          <div class="con_item_r" v-if="setActiveSex" @click="openSetSex()">
            <p>{{ user_sex }}</p>
            <img src="../../assets/images/evenmore.png" />
          </div>
          <div class="con_item_r" v-else>
            <!-- <van-radio-group v-model="user_sex" class="radio_own">
              <van-radio name="男" size="0.2rem">男</van-radio>
              <van-radio name="女" size="0.2rem">女</van-radio>
            </van-radio-group>
            <div @click.stop="closeSetSex()">确定</div> -->
          </div>
        </div>
        <div class="user_con_item user_active" @click="goSetPhone()">
          <div class="con_item_l">手机号码</div>
          <div class="con_item_r">
            <p>{{ phone_number }}</p>
            <img src="../../assets/images/evenmore.png" />
          </div>
        </div>
        <p class="item_title">安全</p>
        <div class="user_con_item" @click="goSetPhone()">
          <div class="con_item_l">交易密码</div>
          <div class="con_item_r">
            <p>设置密码</p>
            <img src="../../assets/images/evenmore.png" />
          </div>
        </div>
      </div>
    </scroller>
    <van-action-sheet
      v-model="show"
      :actions="actions"
      @select="onSelect"
      cancel-text="取消"
      @cancel="onCancel"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import navBar from "../../components/navBar";
import { Toast, Dialog, ActionSheet } from "vant";
import { userInfo, getUserinfo, updateUserinfo } from "../../common/js/api.js";
import { err } from "../../common/js/status";

export default {
  data() {
    return {
      repeats: 0, //防止重复点击
      rescount: 0, //请求计数
      title: "个人信息",
      active: 2,
      usersex: "",
      currentRate: 60,
      setActive: true,
      setActiveSex: true,
      show: false,
      actions: [{ name: "男" }, { name: "女" }]
    };
  },
  computed: {
    ...mapState({
      log_token: state => state.user.log_token,
      phone_number: state => state.user.phone_number,
      user_name: state => state.user.user_name,
      // user_sex: (state) => state.user.user_sex,
      charge_psd: state => state.user.charge_psd
    }),

    user_sex: {
      get() {
        return this.$store.state.user.user_sex;
      },
      set(value) {
        this.$store.commit("updateUser", { user_sex: value });
      }
    }
  },
  mounted: function() {
    if (this.$parent.onLine == false) {
      Toast("无法连接网络，请检查网络状态");
    } else {
    }
  },
  methods: {
    ...mapMutations(["updateUser", "clearUser"]),
    openSetname() {
      //修改昵称
      this.$router.push({ path: "/setusername" });
      this.setActive = false;
    },
    onSelect(item) {
      this.usersex = item.name;
      this.show = false;
      this.closeSetSex();
    },
    onCancel() {
      this.show = false;
    },
    openSetSex() {
      this.show = true;
      this.setActiveSex = false;
    },
    //更改性别
    closeSetSex() {
      // debugger;
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
        this.setActiveSex = true;
        let param = new Object();
        let colname = ["user_sex"];
        let colvalue = [];
        colvalue.push(this.usersex);
        param.login_token = this.log_token;
        param.col_name = colname;
        param.col_value = colvalue;
        updateUserinfo(param)
          .then(res => {
            Toast.clear();
            this.repeats = 0;
            if (res.status == 0) {
              this.rescount = 0;
              this.updateUser({
                log_token: res.data.login_token
              });
              Toast({
                message: "修改成功",
                duration: 800
              });
              this.user_sex = this.usersex;
              if (res.err_code == 0) {
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
              this.closeSetSex();
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
              const tip = this.$backStatusMap[res.status] || err[res.status];
              const str = tip ? this.$t(tip) : `请稍后重试 ${res.status}`;
              this.$toast(str);
            }
          })
          .catch(error => {
            Toast.clear();
            this.repeats = 0;
            this.rescount++;
            this.closeSetSex();
            // Toast("网络错误，请重新请求");
          });
      }
    },
    goSetPhone() {
      this.$router.push({
        name: "changephone",
        params: {
          usertel: this.phone_number
        }
      });
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
}
.container {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  overflow: hidden;
  background: #ffffff;
  color: #000000;
  font-size: 0.24rem;
  .user_con {
    width: 100%;
    height: auto;
    margin: 0 auto;
    margin-top: 1.08rem;
    background-color: #fff;
    padding-top: 0.1rem;
    p {
      text-align: left;
      padding-left: 4%;
      color: #666666;
      font-size: 0.24rem;
    }
    .item_title {
      display: inline-block;
      margin-top: 0.5rem;
      text-align: left;
      width: 100%;
    }
    .user_con_item {
      height: 1rem;
      width: 90%;
      margin: auto;
      background: #fff;
      // border-radius: 0.12rem;
      margin-bottom: 0.02rem;
      // padding: 0 0.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      font-size: 0.26rem;
      border-bottom: 0.01rem solid #eeeeee;
      &:nth-child(1) {
        border: none;
      }
      img {
        width: 0.12rem;
        height: 0.24rem;
      }
      .con_item_l {
        font-size: 0.26rem;
      }
    }
    .con_item_r {
      color: #333333;
    }
    .user_active {
      img {
        width: 0.12rem;
        height: 0.24rem;
      }
    }
  }
}
.con_item_r {
  display: flex;
  justify-content: flex-start;
  color: #616c8a;
  align-items: center;
  p {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-right: 0.22rem;
  }
  input {
    width: 2rem;
    border: none;
    margin-right: 0.12rem;
    border-bottom: 1px #616c8a solid;
    background: none;
  }
}
.device_info_img {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-right: 0.4rem;
}
.radio_own {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.van-toast {
  background-color: rgba(44, 44, 44, 0.35);
}
</style>
