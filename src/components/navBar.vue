<template>
  <van-nav-bar
    :title="title"
    left-text="返回"
    right-text
    rrow
    fixed
    left-arrow
    @click-left="onClickLeft"
    @click-right="onClickRight"
    :z-index="2050"
  >
    <div slot="left" class="alltitleleft">
      <van-icon name="arrow-left" color="#000000" />
      <span></span>
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
  /* background: linear-gradient(
    45deg,
    #4C94FE 10%,
    #2762FD 100%
  ); */
}

.van-hairline--bottom::after {
  border-bottom-width: 0px;
  color: #333333;
}
.van-nav-bar__title {
  font-size: 0.34rem;
  color: #333333;
}
.van-nav-bar__text {
  color: #333333;
  font-size: 0.28rem;
}
.van-nav-bar__left {
  font-size: 0.36rem;
}
.van-icon-arrow-left:before {
  color: #333333;
}
.alltitleleft span {
  color: #333333;
  font-size: 0.28rem;
}
</style>
