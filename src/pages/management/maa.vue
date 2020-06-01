<template>
  <div class="container">
    <navBar :title="title" :right-text="title">
      <van-icon name="search" slot="right" />
    </navBar>
    <scroller>
      <div class="mycon">
        <div class="topimg">
          <img class="logoimg" src="../../assets/images/per_logo1.png" alt />
        </div>
        <div class="bborder"></div>
        <p class="text">登录后该应用将获取以下权限</p>
        <div class="only">
          <van-checkbox class="prompttext" v-model="checked" checked-color="#07c160">
            <span>获取的你的公开信息(昵称丶手机号)</span>
          </van-checkbox>
        </div>
        <van-button class="btn" type="primary" @click="deauthorize()">确认授权</van-button>
      </div>
    </scroller>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import navBar from "../../components/navBar";
import { Button, Checkbox, CheckboxGroup } from "vant";
import { authorization } from "../../common/js/api.js";
export default {
  data() {
    return {
      repeats: 0, //防止重复点击
      rescount: 0, //请求计数
      title: "验证授权",
      checked: true
    };
  },
  methods: {
    ...mapMutations(["updateUser", "clearUser"]),
    onClickLeft() {
      this.$router.back(-1);
    },
    deauthorize() {
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
        let nowparam = new Object();
        nowparam.user_tel = 13305123016;
        authorization(nowparam)
          .then(response => {
            this.repeats = 0;
            if (response.status == 1) {
              this.rescount = 0;
              window.location.href = response.msg;
            }
          })
          .catch(error => {
            this.repeats = 0;
            this.rescount++;
            this.deauthorize();
            // Toast("网络错误，请重新请求");
          });
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
  background: #F8F8F8;
  .mycon {
    width: 85%;
    height: 6rem;
    margin: auto;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 0.2rem;
    padding-left: 0.2rem;
    margin-top: 1.2rem;
    .topimg {
      width: 2rem;
      height: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .bborder {
      width: 80%;
      margin: auto;
      border-bottom: 1px solid #ff467c;
      margin-top: 0.2rem;
      margin-bottom: 0.2rem;
    }
    .logoimg {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 0.2rem;
      text-align: left;
    }
    .text {
      font-size: 0.36rem;
      color: #000000;
      margin-top: 0.2rem;
      width: 85%;
      display: inline-block;
      text-align: left;
    }
    .prompttext {
      font-size: 0.2rem;
      color: #000000;
      margin-top: 0.2rem;
    }
    .only {
      width: 85%;
      text-align: left;
      span {
        color: #000000;
        font-size: 0.28rem;
      }
    }
  }
  .btn {
    margin-top: 0.8rem;
    width: 70%;
    background-color: #43bff9;
  }
}
</style>
