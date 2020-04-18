<template>
  <div class="calculation">
    <navBar
      title="设备算力"
      left-text="返回"
      left-arrow
      fixed
      @click-left="onClickLeft"
    ></navBar>
    <div class="content">
      <div class="calculation_top">
        <p class="dev_num">{{ node_suanli }}</p>
        <p>平均算力</p>
      </div>

      <div class="calculation_bottom" v-if="minerInfo.length > 0">
        <vuu-pull
          ref="vuuPull"
          :options="pullOptions"
          v-on:loadTop="loadTop"
          v-on:loadBottom="loadBottom"
          :style="{ height: scrollerHeight }"
        >
          <div
            class="calculation_item"
            v-for="(item, index) in minerInfo"
            :key="index"
            @click="go_calculation_details(item)"
          >
            <div class="item_left">
              <p>{{ item.dev_name }}</p>
              <p>SN:{{ item.dev_sn }}</p>
            </div>
            <div class="item_center">
              <p v-if="item.node_grade == 0">
                <img src="../../assets/images/putong.svg" alt />普通节点
              </p>
              <p v-else-if="item.node_grade == 2000">
                <img src="../../assets/images/huangjin.svg" alt />黄金节点
              </p>
              <p v-else-if="item.node_grade == 5000">
                <img src="../../assets/images/bojin.svg" alt />铂金节点
              </p>
              <p v-else-if="item.node_grade == 18000">
                <img src="../../assets/images/zuanshi.svg" alt />钻石节点
              </p>
              <p>算力：{{ item.cp_value }}</p>
            </div>
            <div class="item_right">
              <img src="../../assets/images/per_icon_arrow.png" alt />
            </div>
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
import { isbindinglist, get_app_dev_con_val } from "../../common/js/api";
import { TabbarItem, Toast, PullRefresh, Dialog, NavBar } from "vant";
import loadind from "../../assets/images/spainpink.gif"; //动画
import boadind from "../../assets/images/spinwhile.gif"; //动画
export default {
  data() {
    return {
      node_suanli: 0,
      allpage: 1,
      pagenum: 0,
      minerInfo: [],
      demo_minerInfo: [
        // {
        //   dev_name: "我的节点1",
        //   dev_sn: "SNE4508276578",
        //   node_level: 0,
        //   power: 4358
        // },
      ],
      pullOptions: {
        isBottomRefresh: true,
        isTopRefresh: true,
        slideResistance: 5, //拉动阻力
        topTriggerHeight: 40, //下拉触发刷新的有效距离
        topPull: {
          loadingIcon: boadind
        },
        bottomPull: {
          loadingIcon: loadind
        },
        bottomCloseElMove: false //关闭上拉加载
      }
    };
  },
  components: {
    navBar: navBar
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
    }),
    scrollerHeight: function() {
      console.log(
        window.innerHeight,
        window.innerHeight - window.innerHeight * 0.245 + "px"
      );
      return window.innerHeight - window.innerHeight * 0.245 + "px";
    }
  },
  mounted() {
    this.node_suanli = this.$route.query.suanli;
    this.device(0);
  },
  methods: {
    ...mapMutations(["updateUser", "clearUser", "setdevsn", "setdevstatus"]),

    //下拉刷新
    loadTop() {
      setTimeout(() => {
        this.device(0);
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
          this.device(this.pagenum);
        } else {
          return false;
        }
        if (this.$refs.vuuPull.closeLoadBottom) {
          this.$refs.vuuPull.closeLoadBottom();
        }
      }, 500);
    },
    //获取我的设备列表
    device(page) {
      if (this.$parent.onLine == false) {
        Toast("无法连接网络，请检查网络状态");
      } else {
        let params = new Object();
        params.login_token = this.log_token;
        params.page_num = page;
        isbindinglist(params)
          .then(res => {
            if (res.status == 0) {
              this.updateUser({ log_token: res.token_info.login_token });
              if (res.err_code == 0) {
                this.allpage = res.data.total_page; //总页码
                this.pagenum = res.data.page_num;
                if (params.page_num == 0) {
                  this.demo_minerInfo = res.data.bind_devinfo_list;
                } else {
                  this.demo_minerInfo.push(...res.data.bind_devinfo_list); //数组拼接
                }
                this.get_con();
              } else if (res.err_code == 292) {
                // Toast({
                //   message: "您暂时没有设备，请先绑定设备",
                //   duration: 1000
                // });
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
              } else if (res.err_code == -5) {
                // Toast("网络错误，请重新请求181");
              } else {
                const sta = err[res.err_code]
                  ? this.$t(err[res.err_code])
                  : `请稍后重试 ${res.err_code}`;
                this.$toast(sta);
              }
            } else if (res.status == -999) {
              this.$toast({
                message: "登录已过期，请重新登录",
                onClose: () => {
                  this.clearUser();
                  this.$router.push({ path: "/login" });
                }
              });
            } else if (res.status == -17) {
              Dialog.alert({
                message: "账号在其它地方登录，请重新登录"
              }).then(() => {
                this.clearUser();
                this.$router.push({ path: "/login" });
              });
            } else if (res.status == -500) {
            } else if (res.status == -900) {
              this.$router.push({ path: "/login" });
            } else if (res.status == -5) {
              Toast("网络错误，请重新请求");
            } else {
              const tip = this.$backStatusMap[res.status] || err[res.status];
              const str = tip ? this.$t(tip) : `请稍后重试 ${res.status}`;
              this.$toast(str);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
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
          let obje = {};
          res.data.dev_value_list.forEach((item, index) => {
            let key = item.dev_sn;
            let value = item;
            obje[key] = value;
            obje.cp_value = "";
            obje.con_value = "";
            obje.node_grade = "";
          });
          console.log(obje);
          this.demo_minerInfo.forEach((adme, indexs) => {
            let sad = adme.dev_sn;
            console.log(obje[sad]);
            console.log(adme);
            if (obje[sad]) {
              let deas = new Object();
              deas = adme;
              deas.cp_value = obje[sad].cp_value;
              deas.con_value = obje[sad].con_value;
              deas.node_grade = obje[sad].node_grade;
              if (obje[sad].node_grade == 0) {
                deas.node_grade_name = "普通节点";
              } else if (obje[sad].node_grade == 2000) {
                deas.node_grade_name = "黄金节点";
              } else if (obje[sad].node_grade == 6000) {
                deas.node_grade_name = "铂金节点";
              } else if (obje[sad].node_grade == 18000) {
                deas.node_grade_name = "钻石节点";
              }
              this.minerInfo.push(deas);
            }
          });
          console.log(this.minerInfo);
        })
        .catch(error => {
          console.log(error);
        });
    },
    onClickLeft() {
      this.$router.go(-1);
    },
    go_calculation_details(data) {
      this.$router.push({
        path: "/calculation_details",
        query: { item_detail: data }
      });
    }
  }
};
</script>

<style lang="less" scoped>
/deep/.van-nav-bar {
  z-index: 2050 !important;
  color: #fff;
  background: linear-gradient(45deg, #4c94fe 10%, #2762fd 100%);
}
/deep/.van-nav-bar__title {
  font-size: 0.34rem;
  color: #ffffff;
}
/deep/.van-icon-arrow-left:before {
  color: #ffffff;
}
/deep/.van-empty {
  margin-top: 2rem;
}
.calculation {
  width: 100%;
  height: 100%;
  background: #f8fafb;
  overflow: hidden;
  .content {
    width: 100%;
    height: 100%;
    .calculation_top {
      width: 100%;
      height: 24.5%;
      background: url(../../assets/images/shebeisuanli.png) no-repeat;
      background-size: 100% 100%;
      background-position: top;
      position: relative;
      z-index: 11;
      p {
        color: #fff;
      }
      .dev_num {
        font-size: 0.6rem;
        font-weight: bold;
        padding-top: 1.3rem;
      }
    }
    .calculation_bottom {
      font-size: 0.24rem;
      border-radius: 0.2rem 0.2rem 0 0;
      background: #f8fafb;
      width: 100%;
      position: relative;
      top: -2%;
      padding-top: 0.2rem;
      overflow-x: hidden;
      overflow-y: scroll;
      .calculation_item {
        width: 90%;
        height: 1.3rem;
        display: flex;
        align-items: center;
        margin: auto;
        margin-top: 0.2rem;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 10px 10px 0px rgba(109, 164, 255, 0.06);
        border-radius: 10px;
        font-size: 0.28rem;
        color: #333333;
        .item_left {
          width: 56%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: left;
          padding-left: 4%;
          p:nth-child(2) {
            font-size: 0.24rem;
            color: #666666;
            margin-top: 0.1rem;
          }
        }
        .item_center {
          width: 30%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: left;
          p {
            display: flex;
            align-items: center;
            img {
              width: 15%;
              margin-right: 0.1rem;
            }
          }
          p:nth-child(2) {
            font-size: 0.24rem;
            color: #666666;
            margin-top: 0.1rem;
          }
        }
        .item_right {
          width: 10%;
          img {
            width: 60%;
          }
        }
      }
    }
  }
}
</style>
