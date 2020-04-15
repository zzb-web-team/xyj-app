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
            <p v-if="item.node_level == 0">
              <img src="../../assets/images/putong.svg" alt />普通节点
            </p>
            <p v-else-if="item.node_level == 1">
              <img src="../../assets/images/huangjin.svg" alt />黄金节点
            </p>
            <p v-else-if="item.node_level == 2">
              <img src="../../assets/images/bojin.svg" alt />铂金节点
            </p>
            <p v-else>
              <img src="../../assets/images/zuanshi.svg" alt />钻石节点
            </p>
            <p>算力：{{ item.power }}</p>
          </div>
          <div class="item_right">
            <img src="../../assets/images/per_icon_arrow.png" alt />
          </div>
        </div>
      </div>
      <van-empty description="暂无数据" v-else />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import navBar from "../../components/navBar";
import { isbindinglist } from "../../common/js/api";
import { TabbarItem, Toast, PullRefresh, Dialog, NavBar } from "vant";
export default {
  data() {
    return {
      node_suanli: 0,
      repeats: 0, //防止重复点击
      rescount: 0, //请求计数
      minerInfo: [
        // {
        //   dev_name: "我的节点1",
        //   dev_sn: "SNE4508276578",
        //   node_level: 0,
        //   power: 4358
        // },
        // {
        //   dev_name: "我的节点2",
        //   dev_sn: "SNE43697357",
        //   node_level: 1,
        //   power: 982
        // }
      ]
    };
  },
  components: {
    navBar: navBar
  },
  computed: mapState({
    log_token: state => state.user.log_token,
    phone_number: state => state.user.phone_number,
    user_name: state => state.user.user_name,
    user_sex: state => state.user.user_sex,
    charge_psd: state => state.user.charge_psd,
    minerstates: state => state.management.minerstates,
    devsn: state => state.management.devsn
  }),
  mounted() {
    this.node_suanli = this.$route.query.suanli;
    this.device(0, 0);
  },
  methods: {
    ...mapMutations(["updateUser", "clearUser", "setdevsn", "setdevstatus"]),
    //获取我的设备列表
    device(page, key) {
      this.topshow = false;
      this.localcache = [];
      this.devlist = [];
      if (this.$parent.onLine == false) {
        Toast("无法连接网络，请检查网络状态");
        // this.$loading.show("无网络连接");
      } else {
        if (key != 1) {
          this.$loading.show("加载中...");
        }
        if (key == 2) {
          return false;
        }
        if (this.repeats == 1) {
          return false;
        }
        this.repeats = 1;
        if (this.rescount >= 3) {
          this.repeats = 0;
          this.rescount = 0;
          this.refresh = true;
          this.$loading.hide();
          Toast(`请求超时，请稍后重试`);
          return false;
        }
        this.onlineCnt = 0;
        this.offlineCnt = 0;
        let params = new Object();
        params.login_token = this.log_token;
        params.page_num = page;
        isbindinglist(params)
          .then(res => {
            if (res) {
              this.$loading.hide();
            }
            this.repeats = 0;
            if (res.status == 0) {
              this.updateUser({ log_token: res.token_info.login_token });
              // this.$refs.myscroller.scrollToTop();
              if (res.err_code == 0) {
                this.rescount = 0;
                this.refresh = false;
                this.noint = false;
                this.allpage = res.data.total_page; //总页码
                this.pagenum = res.data.page_num;
                if (res.data.bind_devinfo_list.length > 0) {
                  this.localcache = res.data.bind_devinfo_list;
                  this.localcache.forEach((item, index, arr) => {
                    this.devlist.push(item);
                  });
                  if (res.data.page_num == 0) {
                    this.minerInfo = this.devlist;
                  } else {
                    this.minerInfo.push(...this.devlist); //数组拼接
                  }
                  // this.device(0);
                  if (this.minerInfo.length <= 0) {
                    this.noint = true;
                  } else {
                    this.noint = false;
                  }
                }
              } else if (res.err_code == 292) {
                this.rescount = 0;
                this.noint = true;
                // Toast({
                //   message: "您暂时没有设备，请先绑定设备",
                //   duration: 1000
                // });
              } else if (res.status == -13) {
                this.rescount = 0;
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
                this.rescount++;
                this.device(0, 0);
              } else {
                this.rescount = 0;
                const sta = err[res.err_code]
                  ? this.$t(err[res.err_code])
                  : `请稍后重试 ${res.err_code}`;
                this.$toast(sta);
              }
            } else if (res.status == -999) {
              this.rescount = 0;
              this.$toast({
                message: "登录已过期，请重新登录",
                onClose: () => {
                  this.clearUser();
                  this.$router.push({ path: "/login" });
                }
              });
            } else if (res.status == -17) {
              this.rescount = 0;
              Dialog.alert({
                message: "账号在其它地方登录，请重新登录"
              }).then(() => {
                this.clearUser();
                this.$router.push({ path: "/login" });
              });
            } else if (res.status == -500) {
              this.rescount = 0;
            } else if (res.status == -900) {
              this.rescount = 0;
              this.$router.push({ path: "/login" });
            } else if (res.status == -5) {
              this.rescount++;
              this.device(0, 0);
            } else {
              this.rescount = 0;
              const tip = this.$backStatusMap[res.status] || err[res.status];
              const str = tip ? this.$t(tip) : `请稍后重试 ${res.status}`;
              this.$toast(str);
            }
          })
          .catch(error => {
            this.repeats = 0;
            this.rescount++;
            this.device(0, 0);
            // Toast("网络错误，请重新请求181");
          });
      }
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
  z-index: 2 !important;
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
  .content {
    width: 100%;
    height: 100%;
    .calculation_top {
      width: 100%;
      height: 24.5%;
      background: url(../../assets/images/shebeisuanli.png) no-repeat;
      background-size: 100% 100%;
      background-position: top;
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
      height: 75.5%;
      font-size: 0.24rem;
      border-radius: 0.2rem 0.2rem 0 0;
      background: #f8fafb;
      width: 100%;
      position: relative;
      top: -2%;
      padding-top: 0.2rem;
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
