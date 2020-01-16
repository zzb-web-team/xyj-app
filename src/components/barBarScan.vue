<template>
  <van-nav-bar
    size="0.4rem"
    :title="title"
    left-text="返回"
    right-text="扫码绑定"
    left-arrow
    fixed
    @click-left="onClickLeft"
    @click-right="onClickRight"
    :z-index="2000"
  >
    <div slot="left" class="alltitleleft">
      <van-icon name="arrow-left" color="#ffffff" />
      <span>返回</span>
    </div>
    <van-icon name="scan" slot="right" size="0.4rem" />
  </van-nav-bar>
</template>

<script>
import { NavBar, Toast } from "vant";
import { error, debug, log } from "util";
export default {
  data() {
    return {
      devlist: []
    };
  },
  props: ["title"],
  methods: {
    onClickLeft() {
      this.$router.back(-1);
    },
    onClickRight() {
      try {
        window.webkit.messageHandlers.scanQRCodeByCamera.postMessage(
          "scancode"
        );
      } catch (e) {}
      try {
        window.android.startScanCode("scancode");
      } catch (e) {}
      window.scancode = this.scancode; //绑定在window全局变量上，不加括号
    },
    scancode: function(data) {
      try {
        let nowarr = JSON.parse(data);
        if (!nowarr.sn) {
          Toast(`未知二维码`);
        } else {
          this.devlist.push(nowarr.sn);
          this.$router.push({
            name: "find",
            params: {
              dev_list: this.devlist
            }
          });
        }
      } catch (e) {
        Toast(`未知二维码`);
      }
    }
  }
};
</script>

<style>
.van-icon-bullhorn-o:before {
  color: #000000;
}
/* .van-nav-bar { */
/* background: #222a45; */
/* border-bottom: 0.01rem solid #616c8a; */
/* } */
.van-hairline--bottom::after {
  border-bottom-width: 0px;
}
.van-nav-bar__title {
  font-size: 0.36rem;
  color: #ffffff;
  font-size: 0.28rem;
}

.van-nav-bar__left {
  font-size: 0.36rem;
}
.van-icon-arrow-left:before {
  color: #000000;
}
.van-icon-scan:before {
  color: #000000;
}
</style>
