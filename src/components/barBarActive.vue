<template>
  <van-nav-bar
    :title="title"
    left-text
    left-a
    rrow
    fixed
    @click-right="onClickRight"
    :z-index="2000"
  >
    <div slot="right" class="titright">
      <img src="../../src/assets/images/per_nav_inform_icon.png" class="titimg" alt />
    </div>

    <!-- <van-icon name="chat-o" slot="right" size="0.46rem" color="#808080"/> -->
  </van-nav-bar>
</template>

<script>
import { NavBar, Toast } from "vant";

export default {
  props: ["title"],

  methods: {
    onClickRight() {
      this.$router.push({ path: "/message" });
    }
  }
};
</script>

<style >
.van-nav-bar {
  color: #fff;
  /* background: linear-gradient(
    45deg,
    rgba(116, 90, 243, 1) 10%,
    rgba(92, 116, 243, 1) 100%
  ); */
}
.van-hairline--bottom::after {
    border-bottom-width: 0px;
    color: #333333;
}
.van-nav-bar__title {
    color: #333333;
}
.van-icon-arrow-left:before{
  color: #333333;
}
.van-nav-bar__text {
    color: #333333;
}
.titright {
  line-height: 33px;
}
.titimg {
  width: 50%;
  height: 50%;
}
.van-icon-bell:before {
  color: #333333;
}
.van-icon-bullhorn-o:before {
  color: #333333;
}
@font-face {
  font-family: "my-icon";
  src: url("../assets/iconfont_t/iconfont.ttf") format("truetype");
}

.my-icon {
  font-family: "my-icon";
  width: 0.4rem;
  height: 0.4rem;
}

.my-icon-extra::before {
  content: "\e626";
}
</style>
