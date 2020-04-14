<template>
  <div class="container">
    <van-nav-bar
      size="0.4rem"
      left-text="返回"
      left-arrow
      fixed
      @click-left="onClickLeft"
      :z-index="2000"
    >
      <div slot="left" class="alltitleleft">
        <van-icon name="arrow-left" color="#ffffff" />
        <span>返回</span>
      </div>
    </van-nav-bar>
    <!--  -->
    <div class="findnum">发现{{num}}台本地设备</div>
    <div id="content">
      <div
        v-for="(item,index) in listarr"
        v-bind:key="index"
        :class="`dev${index}`"
        class="dev"
        @click="gobing(item.sn)"
      >
        <div class="list_top">
          <div style=" display: flex;justify-content: flex-start;align-items: center;">
            <span class="title_name">SN:</span>
            <span class="con_name">{{item.sn}}</span>
          </div>
          <div style=" display: flex;justify-content: flex-start;align-items: center;">
            <span class="title_name">版本号:</span>
            <span class="con_name con_name_right">{{item.version}}</span>
          </div>
        </div>
        <p>
          <span class="title_name">MAC地址:</span>
          {{item.mac}}
        </p>
      </div>
    </div>
    <div>
      <van-button class="introduction_start" @click="goLink()">下一步</van-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { Toast, NavBar } from "vant";
import { error, debug, log } from "util";
export default {
  data() {
    return {
      listarr: [
        // { sn: "d1sffafaa956165", mac: "mlmciemdsaioe468", version: "1.3.3.1" },
        // { sn: "fd1fdsaf651", mac: "mlmciemaiohtye468", version: "1.3.3.1" },
        // { sn: "4ge65r1g6", mac: "mlmciemaszioe468", version: "1.3.3.1" },
        // { sn: "f1a5sdf6415f", mac: "mlmciemaioe468", version: "1.3.3.1" },
        // { sn: "f1ssfsd651", mac: "mlmdsbcidsemaioe468", version: "1.3.3.1" },
        // { sn: "d2asger651", mac: "mlmciemaioe468", version: "1.3.3.1" },
        // { sn: "f1adhd31", mac: "mlmciemaioe468", version: "1.3.3.1" },
        // { sn: "f16hrssa51g5", mac: "mlmciemzxaioe468", version: "1.3.3.1" },
        // { sn: "g1a1g54r", mac: "mlmciemazxbioe468", version: "1.3.3.1" },
        // { sn: "g5adzgfd4e5w", mac: "mlmciemaioe468", version: "1.3.3.1" },
        // { sn: "g1a65we6", mac: "mlmciemavsioe468", version: "1.3.3.1" },
        // { sn: "fg1a5e", mac: "mlmciemsaaioe468", version: "1.3.3.1" }
      ],
      dev_id_list: [],
      num: 0
    };
  },
  mounted() {
    if (this.$route.query.dev_list) {
      this.listarr = this.$route.query.dev_list;
      this.num = this.listarr.length;
    }
  },
  methods: {
    onClickLeft() {
      Toast.clear();
      this.$router.back(-1);
    },
    goLink() {
      if (this.listarr.length <= 0) {
        this.$router.push({
          path: "/binding"
        });
      } else {
        this.listarr.forEach((item, index) => {
          this.dev_id_list.push(item.sn);
        });
        this.$router.push({
          path: "/find",
          query: {
            dev_list: this.dev_id_list
          }
        });
      }
    },
    gobing(id) {
      let idlist = [];
      idlist.push(id);
      this.$router.push({
        name: "find",
        query: {
          dev_list: idlist
        }
      });
    }
  },
  components: {}
};
</script>
<style lang="less" scoped>
/deep/.van-nav-bar .van-icon {
  color: #ffffff;
  vertical-align: middle;
}
/deep/.van-nav-bar__right {
  right: 0.2rem;
}
.van-nav-bar {
  color: #fff;
  background: linear-gradient(
    45deg,
    rgba(116, 90, 243, 1) 10%,
    rgba(92, 116, 243, 1) 100%
  );
}
.findnum {
  text-align: left;
  padding-left: 0.3rem;
  font-size: 0.5rem;
  font-weight: 600;
  color: #000;
  margin: 1rem 0 0.06rem 0;
}
.container {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  overflow: hidden;
  background: #f8f8f8;

  #content {
    overflow: auto;
    height: 9.9rem;
    -webkit-overflow-scrolling: touch; /* liuhx:可以把这整行注释掉对比差别 */
    .dev {
      padding: 0 0.2rem;
      width: 96%;
      background: #ffffff;
      border-radius: 0.12rem;
      box-sizing: border-box;
      margin: 0 auto;
      margin-top: 0.15rem;
      box-shadow: 0px 0px 18px 0px rgba(232, 232, 232, 1);
      .list_top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 0.6rem;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .list_top_one {
          width: 100%;
        }
        .title_name {
          font-weight: 600;
          font-size: 0.3rem;
          color: #737374;
        }
        .con_name {
          display: inline-block;
          color: #43577b;
          width: 3rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: left;
        }
        .con_name_right {
          width: 1.4rem;
        }
      }
      p {
        width: 100%;
        height: 0.6rem;
        text-align: left;
        margin-top: 0.1rem;
        color: #43577b;
        span {
          font-weight: 600;
          font-size: 0.3rem;
          color: #737374;
        }
      }
    }
  }
  .introduction_start {
    font-size: 0.38rem;
    color: #ffffff;
    margin: 0 auto;
    display: flex;
    margin-top: 0.2rem;
    align-items: center;
    justify-content: center;
    width: 3.9rem;
    height: 0.88rem;
    background: linear-gradient(
      90deg,
      rgba(116, 90, 243, 1) 0%,
      rgba(92, 116, 243, 1) 100%
    );
    border-radius: 1rem;
    border: none;
  }
}
@media screen and (min-device-height: 812px) {
  #content {
    height: 12rem !important;
  }
}
</style>
