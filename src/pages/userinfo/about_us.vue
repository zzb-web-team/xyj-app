<template>
  <div class="about_us">
    <navBar title="关于我们"></navBar>
    <div class="about_us_body">
      <van-cell is-link @click="goprivacy" v-fb="{ cls: 'my_touchfeedback' }">隐私政策</van-cell>
      <van-cell is-link @click="goUserAgreement" v-fb="{ cls: 'my_touchfeedback' }">用户协议</van-cell>
      <van-cell title="版本" class="ves">
        <i></i>1.3.1.152
      </van-cell>
    </div>
  </div>
</template>

<script>
import navBar from "../../components/navBar";
export default {
  data() {
    return {};
  },
  mounted() {},
  methods: {
    goprivacy() {
      setTimeout(() => {
        this.$router.push({ path: "/privacy" });
      }, 200);
    },
    goUserAgreement() {
      setTimeout(() => {
        this.$router.push({ path: "/UserAgreement" });
      }, 200);
    }
  },
  components: {
    navBar: navBar
  }
};
</script>

<style lang="less" scoped>
.about_us {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .about_us_body {
    margin-top: 0.92rem;
    .ves {
      .van-cell__title {
        text-align: left;
        color: #333333;
      }
      i {
        display: inline-block;
        width: 0.1rem;
        height: 0.1rem;
        border-radius: 50%;
        background: red;
        margin-right: 0.1rem;
      }
    }
  }
}
</style>
