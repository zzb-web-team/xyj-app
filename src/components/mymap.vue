<template>
  <bm-overlay
    ref="customOverlay"
    :class="{ sample: true, active }"
    pane="labelPane"
    @draw="draw"
  >
    <img src="../assets/images/putong.svg" alt v-if="dsc == 0" />
    <img src="../assets/images/huangjin.svg" alt v-else-if="dsc == 2000" />
    <img src="../assets/images/bojin.svg" alt v-else-if="dsc == 6000" />
    <img src="../assets/images/zuanshi.svg" alt="" v-else-if="dsc == 18000" />
    <div v-text="text" @click="handleClick"></div>
  </bm-overlay>
</template>

<script>
import BaiduMap from "vue-baidu-map/components/Map/Map.vue";
export default {
  props: ["text", "position", "active", "aqua", "dsc"],
  watch: {
    position: {
      handler() {
        this.$refs.customOverlay.reload();
      },
      deep: true
    }
  },
  methods: {
    handleClick() {
      global.alert("Well done.");
    },
    draw({ el, BMap, map }) {
      const { lng, lat } = this.position;
      const pixel = map.pointToOverlayPixel(new BMap.Point(lng, lat));
      el.style.left = pixel.x - 60 + "px";
      el.style.top = pixel.y - 20 + "px";
    }
  }
};
</script>

<style lang="less" scoped>
.sample {
  width: 120px;
  height: 40px;
  line-height: 40px;
  overflow: hidden;
  color: #333333;
  text-align: center;
  padding: 10px;
  position: absolute;
  display: flex;
  img {
    width: 15%;
  }
}
.sample.active {
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
}
</style>
