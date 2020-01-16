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
          name: "management",
          title: "设备",
          normal: require("../assets/images/home_icon_equ_unselec@2x.png"),
          active: require("../assets/images/home_icon_equ_selec@2x.png")
        },
        {
          name: "minemachine",
          title: "收益",
          normal: require("../assets/images/home_icon_ear_unselec@2x.png"),
          active: require("../assets/images/home_icon_ear_selec@2x.png")
        },
        {
          name: "usercenter",
          title: "我的",
          normal: require("../assets/images/home_icon_my_unselec@2x.png"),
          active: require("../assets/images/home_icon_my_selec@2x.png")
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
  color: #5c74f3;
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
