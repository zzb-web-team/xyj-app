<template>
  <div class="content">
    <navBar
      title="挖矿节点"
      left-text="返回"
      left-arrow
      fixed
      @click-left="onClickLeft"
    >
    </navBar>
    <!-- <baidu-map class="map" :center="center" :zoom="zoom">
      <div v-for="(item, index) in dev_lists" :key="index">
        <bm-overlay
          pane="labelPane"
          :class="{ sample: true, active }"
          @draw="draw"
        >
          <div><img src="../../assets/images/zuanshi.svg" alt />钻石节点</div>
        </bm-overlay>
      </div>
    </baidu-map> -->
    <baidu-map class="map" :zoom="6" :center="{ lng: 114.2665, lat: 30.5856 }">
      <MyOverlay
        v-for="(item, index) in dev_lists"
        :key="index"
        :position="{ lng: item.lon, lat: item.lat }"
        :text="item.node_grade_name"
        color="red"
        :dsc="item.node_grade"
      >
      </MyOverlay>
    </baidu-map>

    <div class="con_dop">
      <div class="redic_title">
        <span>我的挖矿节点</span>
      </div>

      <div class="dynamic_scroll" v-if="datalist.length > 0">
        <vuu-pull
          ref="vuuPull"
          :options="pullOptions"
          v-on:loadTop="loadTop"
          v-on:loadBottom="loadBottom"
        >
          <div
            class="recird_content"
            v-for="(item, index) in datalist"
            :key="index"
            @click="go_node_setail(item)"
          >
            <span
              class="recird_content_left"
              v-show="item.node_grade == 0"
              style="color:#205AFF"
            >
              <img src="../../assets/images/putong.svg" alt />
              普通节点
            </span>
            <span
              class="recird_content_left"
              v-show="item.node_grade == 2000"
              style="color:#FF6B6F"
            >
              <img src="../../assets/images/huangjin.svg" alt />
              黄金节点
            </span>
            <span class="recird_content_left" v-show="item.node_grade == 6000">
              <img src="../../assets/images/bojin.svg" alt />
              铂金节点
            </span>
            <span class="recird_content_left" v-show="item.node_grade == 18000">
              <img src="../../assets/images/zuanshi.svg" alt />
              钻石节点
            </span>

            <span class="recird_content_center">{{ item.dev_name }}</span>
            <span class="recird_content_right"
              >贡献值 {{ item.con_value }}</span
            >
          </div>
        </vuu-pull>
      </div>
      <van-empty description="暂无数据" v-else />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import navBar from "../../components/navBar";
import BaiduMap from "vue-baidu-map/components/Map/Map.vue";
import MyOverlay from "../../components/mymap";
import {
  query_node_address_info,
  isbindinglist,
  get_app_dev_con_val
} from "../../common/js/api";
import loadind from "../../assets/images/spainpink.gif"; //动画
import boadind from "../../assets/images/spinwhile.gif"; //动画
import { Toast } from "vant";
// import {meap} from "../../components/my_map"
export default {
  data() {
    return {
      // center: { lon: 116.404, lat: 39.915 },
      center3: { lon: 114.48, lat: 38.03 },
      zoom: 5, //缩放等级
      datalist: [
        // { node_level: 0, dev_name: "我的111", contribution: 1580 }
      ],
      zan_datalist: [],
      zan_dev_lists: [],
      dev_lists: [],
      pagenum: 0,
      active: false,
      allpage: 1,
      pullOptions: {
        isBottomRefresh: true,
        isTopRefresh: true,
        slideResistance: 5, //拉动阻力
        topTriggerHeight: 40, //下拉触发刷新的有效距离
        topPull: {
          loadingIcon: boadind
        },
        bottomCloseElMove: false //关闭上拉加载
      }
    };
  },
  components: {
    navBar,
    BaiduMap,
    MyOverlay
  },
  computed: {
    ...mapState({
      log_token: state => state.user.log_token,
      phone_number: state => state.user.phone_number,
      user_name: state => state.user.user_name,
      user_sex: state => state.user.user_sex,
      charge_psd: state => state.user.charge_psd,
      minerstates: state => state.management.minerstates,
      devsn: state => state.management.devsn
    })
  },
  mounted() {
    this.get_con();
    this.get_use_dev_list(0);
    this.get_coordinate();
  },
  methods: {
    ...mapMutations(["updateUser", "clearUser", "setdevsn", "setdevstatus"]),
    draw({ el, BMap, map }) {
      let _this = this;
      const pixel = map.pointToOverlayPixel(
        new BMap.Point(_this.center3.lng, _this.center3.lat)
      );
      el.style.left = pixel.x - 60 + "px";
      el.style.top = pixel.y - 20 + "px";
    },
    //下拉刷新
    loadTop() {
      setTimeout(() => {
        this.get_con();
        this.get_use_dev_list(0);
        this.get_coordinate();
        if (this.$refs.vuuPull.closeLoadTop) {
          this.$refs.vuuPull.closeLoadTop();
        }
      }, 500);
    },
    //上拉加载
    loadBottom() {
      setTimeout(() => {
        if (this.pagenum < this.allpage) {
          this.pagenum++;
          this.get_use_dev_list(this.pagenum);
        } else {
          return false;
        }
        if (this.$refs.vuuPull.closeLoadBottom) {
          this.$refs.vuuPull.closeLoadBottom();
        }
      }, 500);
    },
    //获取用户设备列表
    get_use_dev_list(page) {
      let params = new Object();
      params.login_token = this.log_token;
      params.page_num = page;
      isbindinglist(params)
        .then(res => {
          if (res.status == 0) {
            this.updateUser({ log_token: res.token_info.login_token });
            this.allpage = res.data.total_page;

            if (page == 0) {
              this.zan_datalist = res.data.bind_devinfo_list;
            } else {
              this.zan_datalist = this.zan_datalist.concat(
                res.data.bind_devinfo_list
              );
            }
            // res.data.bind_devinfo_list.forEach(item => {
            //   let devobj = new Object();
            //   devobj.text = item.dev_name;
            //   devobj.value = item.dev_sn;
            //   // this.option1.push(devobj);
            // });
          } else if (res.status == -17) {
            Dialog.alert({
              message: "账号在其它地方登录，请重新登录"
            }).then(() => {
              this.clearUser();
              this.$router.push({ path: "/login" });
            });
          } else if (res.status == -13) {
            if (res.err_code == 424) {
              Toast({
                message: "您的账户已被冻结，请联系相关工作人员",
                duration: 3000
              });
              setTimeout(() => {
                this.$router.push({ path: "/login" });
              }, 3000);
            }
          }
        })
        .catch(error => {
          //  console.log(error);
        });
    },
    //获取设备坐标
    get_coordinate() {
      let params = new Object();
      params.login_token = this.log_token;
      query_node_address_info(params)
        .then(res => {
          if (res.status == 0) {
            this.zan_dev_lists = [];
            this.updateUser({ log_token: res.token_info.login_token });
            this.zan_dev_lists = this.zan_dev_lists.concat(res.data.dev_list);
          } else if (res.status == -17) {
            Dialog.alert({
              message: "账号在其它地方登录，请重新登录"
            }).then(() => {
              this.clearUser();
              this.$router.push({ path: "/login" });
            });
          } else if (res.status == -13) {
            if (res.err_code == 424) {
              Toast({
                message: "您的账户已被冻结，请联系相关工作人员",
                duration: 3000
              });
              setTimeout(() => {
                this.$router.push({ path: "/login" });
              }, 3000);
            }
          } else {
            Toast(res.err_msg);
          }
        })
        .catch(error => {
          //  console.log(error);
        });
    },
    //获取贡献值
    get_con() {
      let params = new Object();
      params.login_token = this.log_token;
      get_app_dev_con_val(params)
        .then(res => {
          if (res.status == 0) {
            this.updateUser({ log_token: res.data.token_info.token });
          }
          res.data.dev_value_list.forEach((item, index) => {
            this.zan_datalist.forEach(adme => {
              if (adme.dev_sn == item.dev_sn) {
                this.zan_datalist[index].con_value = item.con_value;
                this.zan_datalist[index].node_grade = item.node_grade;
                this.zan_dev_lists[index].node_grade = item.node_grade;
                if (item.node_grade == 0) {
                  this.zan_datalist[index].node_grade_name = "普通节点";
                } else if (item.node_grade == 2000) {
                  this.zan_datalist[index].node_grade_name = "黄金节点";
                } else if (item.node_grade == 6000) {
                  this.zan_datalist[index].node_grade_name = "铂金节点";
                } else if (item.node_grade == 18000) {
                  this.zan_datalist[index].node_grade_name = "钻石节点";
                }
              }
            });
          });
          this.$nextTick(() => {
            this.datalist = this.zan_datalist;
            this.dev_lists = this.zan_dev_lists;
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    onClickLeft() {
      this.$router.go(-1);
    },
    go_node_setail(str) {
      this.$router.push({ path: "/node_details", query: { dev: str } });
    }
  }
};
</script>

<style lang="less" scoped>
/deep/.van-nav-bar {
  background: #f8f8f8;
}
/deep/.van-nav-bar__title {
  color: #333333;
}
/deep/.van-icon-arrow-left:before {
  color: #333333;
}
/deep/.van-empty__image {
  width: 2rem;
  height: 2rem;
}
.content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .map {
    margin-top: 0.92rem;
    width: 100%;
    height: 400px;
    　　 　　/deep/.anchorBL {
      display: none;
    }
  }
  .con_dop {
    flex: 1;
    width: 92%;
    padding-left: 4%;
    padding-right: 4%;
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
          width: 33%;
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
.sample {
  width: 120px;
  height: 40px;
  line-height: 40px;
  overflow: hidden;
  color: #333333;
  text-align: center;
  padding: 10px;
  position: absolute;
  img {
    width: 15%;
  }
}
.sample.active {
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
}
</style>
