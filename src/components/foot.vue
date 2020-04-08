<template>
  <van-tabbar :value="value" class="active_tab" :class="{youfoot:leftshow,myfoot:!leftshow}">
    <van-tabbar-item
      v-for="(item,index) in tabbars"
      :key="index"
      @click="tab(index,item.name)"
      v-fb="{cls:'my_stt'}"
    >
      <span :class="currIndex == index ? 'active':''">{{item.title}}</span>
      <div slot="icon" slot-scope="props">
        <img :src="props.active ? item.active : item.normal" />
      </div>
    </van-tabbar-item>
  </van-tabbar>
</template>

<script>
export default {
  name: "tabbar",
  props: {
    value: {
      type: Number
    }
  },
  data() {
    return {
      currIndex: 0,
      leftshow: true,
      tabbars: [
        {
          name: "dynamic_node",
          title: "节点",
          normal: require("../assets/images/Tab_jiedian.svg"),
          active: require("../assets/images/Tab_jiedian_pre.svg")
        },
        {
          name: "monitor_details",
          title: "监控",
          normal: require("../assets/images/Tab_jiankong.svg"),
          active: require("../assets/images/Tab_jiankong_pre.svg")
        },
        {
          name: "management",
          // title: "西柚机",
          normal: require("../assets/images/Tab_xiyouji.svg"),
          active: require("../assets/images/Tab_xiyouji.svg")
        },
        {
          // name: "minemachine",
          name:"income_overview",
          title: "收益",
          normal: require("../assets/images/Tab_shouyi.svg"),
          active: require("../assets/images/Tab_shouyi_pre.svg")
        },
        {
          name: "usercenter",
          title: "我的",
          normal: require("../assets/images/Tab_wode.svg"),
          active: require("../assets/images/Tab_wode_pre.svg")
        }
      ]
    };
  },
  mounted() {
    let castatus = navigator.userAgent; //获取手机系统
    let conheight = window.screen.height; //获取屏幕高度(分辨率的高度)

    if (conheight >= 812 && castatus.indexOf("iPhone") > -1) {
      //如果是苹果手机大于等于812底部抬升
      this.leftshow = false;
    }
  },

  methods: {
    tab(index, val) {
      this.currIndex = index;
      this.$router.push(val);
    }
  }
};
</script>

<style lang="less" scoped>
.active_tab img {
  width: 0.6rem;
  height: 0.6rem;
}
.van-tabbar-item--active {
  color: #ff6d6e;
}
span {
  font-size: 0.22rem;
}
// @media screen and (min-device-height: 812px) {
//   .van-tabbar {
//     border-top: solid #e5e5e5 0.01rem;
//     height: 0.98rem;
//     padding-bottom: 0.22rem;
//   }
// }
.youfoot {
  padding-bottom: 0;
}
.myfoot {
  padding-bottom: 0.22rem !important;
}
</style>
