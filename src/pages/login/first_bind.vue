<template>
  <div class="container">
    <!-- 头部 -->
    <van-nav-bar size="0.4rem" left-arrow title="绑定设备" @click-left="onClickLeft" :z-index="0">
      <div slot="left" class="alltitleleft">
        <span>退出</span>
      </div>
    </van-nav-bar>
    <!-- 内容 -->
    <div class="content_text">
      <div class="seacher_img">
        <img src="../../assets/images/banner.png" alt />
        <div class="explain" @click="explain_show">
          <img src="../../assets/images/wen.png" alt />
          <span>设备绑定说明</span>
        </div>
      </div>
      <div class="seacher_btn" @click="go_bind">
        <div class="btn_bgc">
          <van-icon class="iconfont icontianjia1" color="#ffffff"></van-icon>
        </div>绑定西柚机设备
      </div>
    </div>
    <!-- 蒙层 -->
    <van-overlay :show="show" class="overlay">
      <div class="overlay_btn">
        <div class="overlay_bgc">
          <van-icon class="iconfont icontianjia1" color="#ffffff"></van-icon>
        </div>绑定西柚机设备
      </div>
      <div class="overlay_img">
        <img src="../../assets/images/xu.png" alt />
      </div>
      <div class="overlay_text">
        <p>绑定西柚机设备</p>
        <p>绑定西柚机设备即可进入App，查看节点、监控、收益等内容</p>
      </div>
      <div class="wrapper" @click="hidden_overlay">我知道了</div>
    </van-overlay>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { Toast, NavBar } from "vant";
import { error, debug, log } from "util";
import { logout } from "../../common/js/api.js";
export default {
  data() {
    return {
      show: false
    };
  },
  computed: mapState({
    log_token: state => state.user.log_token,
    phone_number: state => state.user.phone_number,
    user_name: state => state.user.user_name,
    user_sex: state => state.user.user_sex,
    charge_psd: state => state.user.charge_psd
  }),
  methods: {
    //退出
    onClickLeft() {
      let param = new Object();
      param.login_token = this.log_token;
      logout(param)
        .then(res => {
          sessionStorage.cachedata = "";
          this.$router.push({ path: "/login" });
        })
        .catch(error => {
          sessionStorage.cachedata = "";
          this.$router.push({ path: "/login" });
        });
    },
    //绑定设备
    go_bind() {
      this.$router.push({ path: "/binding" });
    },
    //遮罩层显示
    explain_show() {
      this.show = true;
    },

    //遮罩层隐藏
    hidden_overlay() {
      this.show = false;
    }
  }
};
</script>

<style lang="less" scoped>
/deep/.van-nav-bar {
  color: #333333;
  background: #ffffff;
}
.container {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  overflow: hidden;
  background: #f8fafb;
  .alltitleleft {
    color: #666666;
    font-size: 0.28rem;
    padding-left: 0.1rem;
  }
  .content_text {
    width: 100%;
    .seacher_img {
      background-color: #fff;
      width: 96%;
      padding: 0 2%;
      margin: auto;
      img {
        height: 3.48rem;
      }
      .explain {
        width: 97%;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding-bottom: 0.2rem;
        color: #417bfe;
        font-size: 0.24rem;
        img {
          width: 5%;
          height: 5%;
        }
      }
    }
    .seacher_btn {
      width: 2.7rem;
      height: 0.56rem;
      line-height: 0.56rem;
      margin: 0.4rem;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 10px 10px 0px rgba(2, 21, 51, 0.06);
      opacity: 0.94;
      border-radius: 0 0.28rem 0.28rem 0;
      font-size: 0.28rem;
      color: #333333;
      position: relative;
      .btn_bgc {
        width: 0.56rem;
        height: 0.56rem;
        background: linear-gradient(
          180deg,
          rgba(254, 167, 107, 1) 0%,
          rgba(255, 109, 110, 1) 100%
        );
        box-shadow: 0px 10px 10px 0px rgba(2, 21, 51, 0.06);
        opacity: 0.94;
        border-radius: 50%;
        position: absolute;
        top: 0;
        left: -0.25rem;
      }
    }
  }
  .overlay {
    .overlay_btn {
      width: 2.7rem;
      height: 0.56rem;
      line-height: 0.56rem;
      margin: 0.4rem;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 10px 10px 0px rgba(2, 21, 51, 0.06);
      opacity: 0.94;
      border-radius: 0 0.28rem 0.28rem 0;
      font-size: 0.28rem;
      color: #333333;
      position: relative;
      top: 5.03rem;
      .overlay_bgc {
        width: 0.56rem;
        height: 0.56rem;
        background: linear-gradient(
          180deg,
          rgba(254, 167, 107, 1) 0%,
          rgba(255, 109, 110, 1) 100%
        );
        box-shadow: 0px 10px 10px 0px rgba(2, 21, 51, 0.06);
        opacity: 0.94;
        border-radius: 50%;
        position: absolute;
        top: 0;
        left: -0.25rem;
      }
    }
    .overlay_img {
      position: absolute;
      top: 6rem;
      right: 1rem;
      img {
        width: 40%;
      }
    }
    .overlay_text {
      width: 92%;
      padding: 0 4%;
      text-align: left;
      position: absolute;
      top: 7.5rem;
      p {
        color: #ffffff;
        font-size: 0.28rem;
      }
      p:nth-child(1) {
        font-size: 0.36rem;
      }
    }
    .wrapper {
      width: 1.6rem;
      height: 0.64rem;
      line-height: 0.64rem;
      color: #ffffff;
      border: 2px solid rgba(255, 255, 255, 1);
      border-radius: 0.1rem;
      position: absolute;
      bottom: -7rem;
      top: 0;
      left: 0;
      right: 0;
      margin: auto;
      z-index: 10;
    }
  }
}
</style>
