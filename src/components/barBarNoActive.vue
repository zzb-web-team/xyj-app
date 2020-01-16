
<template>
  <van-nav-bar
    :title="title"
    left-text="返回"
    left-a
    rrow
    @click-left="onClickLeft"
    fixed
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
    }
  }
};
</script>

<style>
.van-icon-bullhorn-o:before {
  color: #000000;
}
</style>
