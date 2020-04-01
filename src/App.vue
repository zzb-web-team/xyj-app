<template>
  <div id="app">
    <transition :name="transitionName">
      <keep-alive>
        <router-view v-if="$route.meta.keepalive" class="Router"></router-view>
      </keep-alive>
    </transition>

    <transition :name="transitionName">
      <router-view v-if="!$route.meta.keepalive" class="Router"></router-view>
    </transition>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "App",
  data() {
    return {
      onLine: navigator.onLine,
      transitionName: "slide-right" // 默认动态路由变化为slide-right
    };
  },
  watch: {
    //使用watch 监听$router的变化
    $route(to, from) {
      //如果to索引大于from索引,判断为前进状态,反之则为后退状态
      if (!to.meta.index || !from.meta.index) {
        this.transitionName = "";
      } else if (to.meta.index == 7 && from.meta.index == 5) {
        this.transitionName = "slide-left";
      } else if (to.meta.index > from.meta.index) {
        //设置动画名称
        this.transitionName = "slide-left";
      } else if (to.meta.index == from.meta.index) {
        this.transitionName = "";
      } else {
        this.transitionName = "slide-right";
      }
    }
  },
  // // //App.vue中监听路由变化
  // watch: {
  //   $route(to, from) {
  //     if (!this.removalArr(to.name) && to.name != "login") {
  //       //如果不存在缓存的组件，并且登录页设置为不缓存
  //       this.$store.dispatch("changeKeepAlive", to.name); //将此组件添加至缓存中
  //     } else if (to.name == "login") {
  //       //如果跳转到登录页，需清空所有的缓存
  //       this.$store.dispatch("changeKeepAlive", []); //清空
  //     }
  //   }
  // },
  mounted() {
    window.addEventListener("online", this.updateOnlineStatus);
    window.addEventListener("offline", this.updateOnlineStatus);
  },
  methods: {
    updateOnlineStatus(e) {
      const { type } = e;
      this.onLine = type === "online";
    }
    // removalArr(val) {
    //   for (let i = 0; i < this.keepAlive.length; i++) {
    //     //查找是否有包含的缓存组件
    //     if (this.keepAlive[i] == val) {
    //       //如果有,直接return
    //       return true;
    //     }
    //   }
    //   return false;
    // }
  },

  beforeDestroy() {
    window.removeEventListener("online", this.updateOnlineStatus);
    window.removeEventListener("offline", this.updateOnlineStatus);
  }

};
</script>

<style>
@import url(./common/font/font.css);
@import '../src/assets/iconfont/iconfont.css';
/* body{
 font-family: myself;
} */
#app {
  font-family: "myself", "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #f8f8f8;
  /* background: linear-gradient(
    45deg,
    rgba(116, 90, 243, 1) 10%,
    rgba(92, 116, 243, 1) 100%
  );
  */
}
.Router {
  position: absolute;
  width: 100%;
  /* transition: all 1s ease; */
  top: 0px;
}

/* .slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  -webkit-transform: translate(100%, 0);
  transform: translate(100%, 0);
}

.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  -webkit-transform: translate(-100%, 0);
  transform: translate(-100% 0);
} */
.slide-left-enter-active {
  transition: all 0.4s ease;
}
.slide-left-enter {
  transform: translateX(100%);
  opacity: 0;
}
.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-right-enter-active {
  transition: all 0.4s ease;
}
.slide-right-enter {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
