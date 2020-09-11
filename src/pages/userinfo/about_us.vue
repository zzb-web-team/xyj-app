<template>
  <div class="about_us">
    <navBar title="收益账户"></navBar>
    <div class="about_us_body">
      <van-cell is-link @click="goprivacy" v-fb="{ cls: 'my_touchfeedback' }"
        >西柚机收益账户</van-cell
      >
      <van-cell
        is-link
        @click="goUserAgreement"
        v-fb="{ cls: 'my_touchfeedback' }"
        >节点收益账户</van-cell
      >
      <!-- <van-cell title="版本" class="ves">
        <i></i>1.3.2.163
      </van-cell> -->
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
        this.$router.push({ path: "/my_scores" });
      }, 200);
    },
    goUserAgreement() {
      setTimeout(() => {
        this.$router.push({ path: "/node_scores" });
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
  background-color: #f5f5f5;
  .about_us_body {
    margin-top: 0.92rem;
    padding-top: 0.33rem;
    background-color: #f5f5f5;
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
