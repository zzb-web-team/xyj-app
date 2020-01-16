<template lang="html">
  <div v-if="isShowLoading" class="loading-container">
    <div class="loading-box">
      <img class="loading-img" :src="require('../../assets/images/loading.gif')">
      <span class="loading-txt">{{content}}</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
   return{repeats: 0, //防止重复点击
      rescount: 0, //请求计数
      isShowLoading: false,
      content: "加载中..."
    };
  }
};
</script>

<style lang="less" scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 1rem;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0);
  z-index: 1000;
}
.loading-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  //   border-radius: 10px;
  background: #F8F8F8;
}
.loading-img {
  width: 3rem;
  height: 3rem;
  //   animation: rotating 2s linear infinite;
}
@keyframes rotating {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(1turn);
  }
}
.loading-txt {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.28rem;
  color: #000000;
}
</style>