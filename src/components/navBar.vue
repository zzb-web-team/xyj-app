<template>
  <van-nav-bar
    :title="title"
    left-text="返回"
    right-text
    rrow
    
    left-arrow
    @click-left="onClickLeft"
    @click-right="onClickRight"
    :z-index="2000"
  >
    <div slot="left" class="alltitleleft">
      <van-icon name="arrow-left" color="#ffffff" />
      <span>返回</span>
    </div>
  </van-nav-bar>
</template>

<script>
import { NavBar, Toast } from "vant";
export default {
  props: ["title"],
  methods: {
    onClickLeft() {
      this.$router.back(-1);
    },
    onClickRight() {
      Toast("按钮");
    }
  }
};
</script>

<style>
.van-nav-bar {
  /* z-index: 2 !important; */
  color: #fff;
  background: linear-gradient(
    45deg,
    rgba(116, 90, 243, 1) 10%,
    rgba(92, 116, 243, 1) 100%
  );
}
.van-hairline--bottom::after {
  border-bottom-width: 0px;
}
.van-nav-bar__title {
  font-size: 0.34rem;
  color: #ffffff;
}
.van-nav-bar__text {
  color: #ffffff;
  font-size: 0.28rem;
}
.van-nav-bar__left {
  font-size: 0.36rem;
}
.van-icon-arrow-left:before {
  color: #ffffff;
}
.alltitleleft span {
  color: #ffffff;
  font-size: 0.28rem;
}
</style>
