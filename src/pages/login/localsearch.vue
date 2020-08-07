<template>
  <div class="container">
    <van-nav-bar
      size="0.4rem"
      left-text=""
      left-arrow
      fixed
      @click-left="onClickLeft"
      :z-index="2000"
    >
      <div slot="left" class="alltitleleft">
        <van-icon name="arrow-left" color="#333333" />
        <span style="margin-left: -0.1rem;">返回</span>
      </div>
    </van-nav-bar>
    <!--  -->
    <div class="findnum">发现{{ num }}台本地设备</div>
    <div id="content">
      <div
        v-for="(item, index) in listarr"
        v-bind:key="index"
        :class="`dev${index}`"
        class="dev"
        @click="gobing(item.sn)"
      >
        <div class="list_top">
          <div
            style=" display: flex;justify-content: flex-start;align-items: center;"
          >
            <span class="title_name">SN:</span>
            <span class="con_name">{{ item.sn }}</span>
          </div>
          <div
            style=" display: flex;justify-content: flex-start;align-items: center;"
          >
            <span class="title_name">版本号:</span>
            <span class="con_name con_name_right">{{ item.version }}</span>
          </div>
        </div>
        <p class="title_cpuid">
          <span class="title_name">CPU-ID:</span>
          {{ item.cpu_id }}
        </p>
        <p>
          <span class="title_name">MAC地址:</span>
          {{ item.mac }}
        </p>
      </div>
    </div>
    <div>
      <van-button class="introduction_start" @click="goLink()"
        >下一步</van-button
      >
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
        // {
        //   sn: "d1sffafaa956165",
        //   mac: "mlmciemdsaioe468",
        //   version: "1.3.3.1",
        //   cpu_id: "1616516516"
        // },
        // {
        //   sn: "fd1fdsaf651",
        //   mac: "mlmciemaiohtye468",
        //   version: "1.3.3.1",
        //   cpu_id: "1616516516"
        // },
        // {
        //   sn: "4ge65r1g6",
        //   mac: "mlmciemaszioe468",
        //   version: "1.3.3.1",
        //   cpu_id: "1616516516"
        // },
        // {
        //   sn: "f1a5sdf6415f",
        //   mac: "mlmciemaioe468",
        //   version: "1.3.3.1",
        //   cpu_id: "1616516516"
        // }
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
  color: #333333;
  vertical-align: middle;
}
/deep/.van-nav-bar__right {
  right: 0.2rem;
}
/deep/.van-nav-bar .van-icon {
  margin-top: 0;
}
.van-nav-bar {
  color: #333333;
  background: #ffffff;
}
.findnum {
  text-align: left;
  padding-left: 0.3rem;
  font-size: 0.3rem;
  color: #000;
  margin: 1rem 0 0.06rem 0;
}
.container {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  overflow: hidden;
  background: #f8fafb;

  #content {
    overflow: auto;
    height: 9.9rem;
    -webkit-overflow-scrolling: touch; /* liuhx:可以把这整行注释掉对比差别 */
    .dev {
      padding: 0.2rem 0.2rem;
      width: 96%;
      background: #ffffff;
      border-radius: 0.12rem;
      box-sizing: border-box;
      margin: 0 auto;
      margin-top: 0.15rem;
      background: #ffffff;
      box-shadow: 0px 10px 30px 0px rgba(6, 39, 92, 0.06);
      border-radius: 0.2rem;
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
          font-size: 0.3rem;
          color: #333333;
        }

        .con_name {
          display: inline-block;
          color: #6e7995;
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
        // height: 0.6rem;
        text-align: left;
        color: #43577b;
        span {
          font-size: 0.3rem;
          color: #333333;
        }
      }
      .title_cpuid {
        margin-bottom: 0.1rem;
        color: #6e7995;
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
      rgba(254, 168, 107, 1) 0%,
      rgba(255, 109, 110, 1) 100%
    );
    box-shadow: 0px 5px 5px 0px rgba(255, 109, 110, 0.1);
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
