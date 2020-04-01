<template>
  <div class="container">
    <navBar :title="title"></navBar>
    <div class="content">
      <div class="content_item" @click="goremotecontrol()" v-fb="{cls:'my_stt'}">
        <img src="../../assets/images/icon.png" alt />
        <p>西柚遥控器</p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import navBar from "../../components/navBar";
import { Tabbar, TabbarItem, Toast, PullRefresh, Dialog } from "vant";
import { userInfoCenter, loginout } from "../../common/js/api.js";
import { error } from "util";
export default {
  data() {
    return {
      title: "工具箱"
    };
  },
  computed: mapState({
    log_token: state => state.user.log_token,
    phone_number: state => state.user.phone_number,
    user_name: state => state.user.user_name,
    user_sex: state => state.user.user_sex,
    charge_psd: state => state.user.charge_psd
  }),
  mounted() {
    try {
      window.android.setStatusBarAndNavigationBarColor("", "#ffffff");
    } catch (e) {}
    try {
      window.webkit.messageHandlers.setStatusBarAndNavigationBarColor.postMessage(
        "#745af3,#5e73f3"
      );
    } catch (error) {}
  },
  methods: {
    goremotecontrol() {
      setTimeout(() => {
        this.$router.push({ path: "/remotecontrol" });
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
  overflow: hidden;
  background: #f8f8f8;
  margin-top: 0.2rem;
  margin: 0 auto;
  .content {
    width: 100%;
    margin-top: 1.2rem;
    // display: flex;
    // justify-content: center;
    // align-items: center;
    .content_item {
      width: 30%;
      margin-left: 0.2rem;
      img {
        width: 1.5rem;
        height: 1.5rem;
      }
      p {
        font-size: 0.24rem;
        color: #2b2b2b;
      }
    }
    .content_item:nth-child(2) {
      margin: 0 0.1rem;
    }
  }
}
</style>
