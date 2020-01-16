<template>
  <div>
    <div class="mui-content">
      <van-nav-bar :title="title" left-text="返回" left-arrow @click-left="_left"></van-nav-bar>
      <!-- 提示框 -->
      <!-- <div class="tishi">
      <div>1、保证手机正常联网</div>
      <div>2、扫码确认关联后即可使用</div>
      </div>-->
      <!-- 扫码框 -->
      <div class="scan">
        <div id="bcid">
          <div class="content" style="height:40%"></div>
          <p class="tip" v-html="message">{{message}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import navBar from "../../components/navBar";
import { NavBar } from "vant";

export default {
  data() {
   return{
      title: "扫码绑定",
      codeUrl: "",
      message: "载入中......",
      devlist: []
    };
  },
  // components:{
  //       topbar
  //   },
    methods: {
    ...mapMutations(["updateUser", "clearUser"]),  
  }
};
</script>
<style lang="less" scoped>
.mui-content {
  height: 100%;
  background: rgba(34, 42, 69, 1);
}
.scan {
  height: 100%;
  background: rgba(34, 42, 69, 1);
  #bcid {
    width: 100%;
    position: absolute;
    left: 0;
    right: 0;
    top: 0.8rem;
    bottom: 0;
    text-align: center;
    color: #d9e4dd;
    font-size: 0.4rem;
    background: rgba(253, 253, 253, 0);
  }
}
</style>