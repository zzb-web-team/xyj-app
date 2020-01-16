<template>
  <div class="content" id="outesr">
    <navBar :title="title" :right-text="title">
      <van-icon name="search" slot="right" />
    </navBar>

    <p>获取系统信息</p>

    <ol>
      <li>
        <span>网络地址:</span>
        http://xyj.grapefruitcloud.com/
        <!-- http://39.100.131.247 -->
      </li>
      <li >
        <span @click="gotiao">跳转</span>
        <span @click="gotwo">再跳转</span>
      </li>
      <li>
        <span>分辨率:</span>
        {{pwidth}}×{{pheight}}
      </li>
      <li>
        <span>浏览器名称:</span>
        {{appName}}
      </li>
      <li>
        <span>版本号:</span>
        {{appVersion}}
      </li>
      <li>
        <span>代码名称:</span>
        {{appCodeName}}
      </li>
      <li>
        <span>用户代理标识:</span>
        {{userAgent}}
      </li>
      <li>
        <span>手机系统:</span>
        {{system}}
      </li>
    </ol>
  </div>
</template>
<script>
import navBar from "../../components/navBar";
import Vue from "vue";
import { PasswordInput, NumberKeyboard, Button } from "vant";
export default {
  data() {
    return {
      title: "测试页面",
      appName: "",
      appVersion: "",
      appCodeName: "",
      userAgent: "",
      system: "",
      value: "",
      showKeyboard: false,
      pheight: "",
      pwidth: ""
    };
  },
  mounted() {
    this.whatBrowser();
    this.getdpi();
    // this.touchxys("outesr");
  },
  methods: {
    gotwo(){
      this.$router.push({ path: "/two" });
    },
    gotiao() {
      this.$router.push({ path: "/tiao" });
    },
    onInput(key) {
      this.value = (this.value + key).slice(0, 6);
    },
    onDelete() {
      this.value = this.value.slice(0, this.value.length - 1);
    },
    touchxys(outer) {
      var startX, //触摸时的坐标
        startY,
        x, //滑动的距离
        y,
        aboveY = 0; //设一个全局变量记录上一次内部块滑动的位置

      function touchSatrt(e) {
        //触摸
        e.preventDefault();
        var touch = e.touches[0];
        startX = touch.pageX; //刚触摸时的坐标   x
        startY = touch.pageY; //刚触摸时的坐标   y
      }

      function touchMove(e) {
        //滑动
        e.preventDefault();
        var touch = e.touches[0];
        x = startX - touch.pageX; //滑动的距离 x
        y = startY - touch.pageY; //滑动的距离 y
      }

      function touchEnd(e) {
        //手指离开屏幕
        // x 左右滑动距离 以及方向 左滑大于 0 右滑小于0
        // y 上下滑动距离 以及方向 上滑 大于0 下滑小于0
        // 判断滑动方向 上下
        if (x > 0) {
          console.log("左滑距离:" + x + "px");
        } else if (x < 0) {
          x = x * -1;
          console.log("右滑距离:" + x + "px");
        }
        if (y > 0) {
          console.log("上滑距离:" + y + "px");
        } else if (y < 0) {
          y = y * -1;
          console.log("下滑距离:" + y + "px");
        }
        e.preventDefault();
      } //

      document
        .getElementById(outer)
        .addEventListener("touchstart", touchSatrt, false);
      document
        .getElementById(outer)
        .addEventListener("touchmove", touchMove, false);
      document
        .getElementById(outer)
        .addEventListener("touchend", touchEnd, false);
    },
    getdpi() {
      this.pheight = window.screen.height;
      this.pwidth = window.screen.width;
    },
    whatBrowser() {
      this.appName = navigator.appName;
      this.appVersion = navigator.appVersion;
      this.appCodeName = navigator.appCodeName;
      this.userAgent = navigator.userAgent;
      let u = navigator.userAgent;
      if (u.indexOf("Android") > -1 || u.indexOf("Linux") > -1) {
        //安卓手机
        this.system = "Android";
        // window.location.href = "mobile/index.html";
      } else if (u.indexOf("iPhone") > -1) {
        //苹果手机
        // window.location.href = "mobile/index.html";
        this.system = "iPhone";
      } else if (u.indexOf("Windows Phone") > -1) {
        //winphone手机
        this.system = "Windows Phone";
        // window.location.href = "mobile/index.html";
      }
    }
  },
  components: {
    navBar: navBar
  }
};
</script>
<style lang="less" scoped>
.content {
  width: 100%;
  height: auto;
  background-color: aliceblue;
  color: deepskyblue;
  p {
    font-size: 0.65rem;
    margin: 0.2rem 0 0 0;
    color: khaki;
  }
  ol {
    li {
      width: 100%;
      line-height: 1rem;
      border-bottom: 0.01rem solid salmon;
      text-align: left;
      span {
        color: darkorange;
      }
    }
  }
}
</style>
