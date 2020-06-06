<template>
<div class="content">
  <vuu-pull
    ref="vuuPull"
    :options="pullOptions"
    v-on:loadTop="loadTop"
    v-on:loadBottom="loadBottom"
    :style="{ height: scrollerHeight }"
  >
    <div v-for="item in data_list" :key="item + 'sd'">{{ item }}</div>
  </vuu-pull>
</div>
</template>

<script>
import loadind from "../../assets/images/spainpink.gif"; //动画
import boadind from "../../assets/images/spinwhile.gif"; //动画
export default {
  data() {
    return {
      data_list: [],
      pullOptions: {
        isBottomRefresh: true,
        isTopRefresh: true,
        slideResistance: 5, //拉动阻力
        topTriggerHeight: 40, //下拉触发刷新的有效距离
        topPull: {
          loadingIcon: boadind
        },
        bottomPull: {
          loadingIcon: loadind,
          triggerWord: "加载更多"
        },
        bottomCloseElMove: false //关闭上拉加载
      }
    };
  },
  computed: {
    scrollerHeight: function() {
      return window.innerHeight + "px";
    }
  },
  mounted() {},
  methods: {
    loadTop() {
      function random(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
      }
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.data_list.push(random(1, 100));
        }
        if (this.$refs.vuuPull.closeLoadTop) {
          this.$refs.vuuPull.closeLoadTop();
        }
      }, 500);
    },
    loadBottom() {
      setTimeout(() => {
        if (this.$refs.vuuPull.closeLoadBottom) {
          this.$refs.vuuPull.closeLoadBottom();
        }
      }, 500);
    }
  }
};
</script>

<style lang="less" scoped>
.content{
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
