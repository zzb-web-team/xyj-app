<template>
  <div class="content">
    <navBar title="挖矿节点" left-text="返回" left-arrow fixed @click-left="onClickLeft">
      <!-- <van-icon name="question-o" slot="right" size="0.4rem" /> -->
    </navBar>

    <baidu-map class="map" :center="center" :zoom="zoom">
      <bm-marker
        :position="{lng: 116.404, lat: 39.915}"
        :dragging="true"
        animation="BMAP_ANIMATION_BOUNCE"
      >
        <bm-label
          content="节点1"
          :labelStyle="{color: 'red', fontSize : '12px'}"
          :offset="{width: -5, height: 30}"
        />
      </bm-marker>
      
    </baidu-map>
    <div class="con_dop">
      <div class="redic_title">
        <span>我的挖矿节点</span>
      </div>
      <div class="dynamic_scroll">
        <div
          class="recird_content"
          v-for="(item,index) in datalist"
          :key="index"
          @click="go_node_setail(item)"
        >
          <span class="recird_content_left" v-if="item.node_level==0" style="color:#205AFF">
            <img src="../../assets/images/putong.svg" alt />
            普通节点
          </span>
          <span class="recird_content_left" v-else-if="item.node_level==1" style="color:#FF6B6F">
            <img src="../../assets/images/huangjin.svg" alt />
            黄金节点
          </span>
          <span class="recird_content_left" v-else-if="item.node_level==2">
            <img src="../../assets/images/bojin.svg" alt />
            铂金节点
          </span>
          <span class="recird_content_left" v-else>
            <img src="../../assets/images/zuanshi.svg" alt />
            钻石节点
          </span>

          <span class="recird_content_center">{{item.node_name}}</span>
          <span class="recird_content_right">贡献值 {{item.contribution}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import navBar from "../../components/navBar";
import BaiduMap from "vue-baidu-map/components/Map/Map.vue";
// import {meap} from "../../components/my_map"
export default {
  data() {
    return {
      center: { lng: 116.404, lat: 39.915 },
      zoom: 7, //缩放等级
      datalist: [{ node_level: 0, node_name: "我的111", contribution: 1580 }]
    };
  },
  components: {
    navBar,
    BaiduMap
  },
  mounted() {},
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    go_node_setail(str) {
      console.log(str);
      this.$router.push({ path: "/node_details", query: { dev: str } });
    }
  }
};
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  height: 100%;

  .map {
    margin-top: 0.92rem;
    width: 100%;
    height: 400px;
    　　 　　/deep/.anchorBL {
      display: none;
    }
  }
  .con_dop {
    width: 92%;
    padding-left: 4%;
    padding-right: 4%;
    height: 3.82rem;
    background: #ffffff;
    box-shadow: 0px -6px 6px 0px #3333330a;
    border-radius: 0.2rem 0.2rem 0 0;
    .redic_title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.3rem;
      color: #333333;
      padding-top: 0.2rem;
      .view_all {
        color: #6c6c95;
        font-size: 0.24rem;
      }
    }
    .dynamic_scroll {
      height: 3rem;
      overflow-x: hidden;
      overflow-y: scroll;

      .recird_content {
        display: flex;
        font-size: 0.28rem;
        span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          line-height: 0.6rem;
          color: #333333;
          img {
            width: 12%;
            margin-right: 0.1rem;
          }
        }
        .recird_content_left {
          width: 38%;
          display: flex;
          align-items: center;
          text-align: left;
        }
        .recird_content_center {
          width: 30%;
          text-align: center;
        }
        .recird_content_right {
          width: 30%;
          text-align: right;
        }
      }
    }
  }
}
</style>