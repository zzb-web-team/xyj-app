<template>
  <div class="calculation">
    <van-nav-bar
      size="0.4rem"
      left-arrow
      fixed
      title="算力明细"
      @click-left="onClickLeft()"
      :z-index="0"
    >
      <div slot="left" class="alltitleleft">
        <van-icon name="arrow-left" color="#ffffff" />
      </div>
    </van-nav-bar>
    <div class="content">
      <div class="calculation_top">
        <p class="dev_num">
          {{ dev_details.cp_value>0?dev_details.cp_value:"--" }}
        </p>
        <p>{{ dev_details.dev_name }}</p>
      </div>
      <van-dropdown-menu>
        <van-dropdown-item
          v-model="value1"
          :options="option1"
          @change="get_status"
        />
        <van-dropdown-item
          v-model="value2"
          :options="option2"
          @change="get_thmonth"
        />
      </van-dropdown-menu>
      <div class="calculation_scroll" v-if="node_list.length > 0">
        <vuu-pull
          ref="vuuPull"
          :options="pullOptions"
          v-on:loadTop="loadTop"
          v-on:loadBottom="loadBottom"
          :style="{ height: scrollerHeight }"
        >
          <div
            class="calculation_content"
            v-for="(item, index) in node_list"
            :key="index"
          >
            <div class="content_left">
              <p>{{ item.opt_value > 0 ? "+" : "" }}{{ item.opt_value }}</p>
              <p>结余：{{ item.total_value }}</p>
            </div>
            <div class="content_right">
              <p v-if="item.type == 201">等级提升</p>
              <p v-else-if="item.type == 202">绑定设备</p>
              <p v-else-if="item.type == 203">解绑</p>
              <p v-else-if="item.type == 204">签到</p>
              <p v-else-if="item.type == 205">累计在线</p>
              <p v-else-if="item.type == 206">离线</p>
              <p>{{ item.time_stamp | formatDate }}</p>
            </div>
          </div>
        </vuu-pull>
      </div>
      <van-empty description="暂无数据" v-else />
    </div>
  </div>
</template>

<script>
import { formatDate, transformTime } from "../../common/js/date.js";
import { get_app_dev_cp_list } from "../../common/js/api";
import { Toast, Dialog, NavBar } from "vant";
import { mapState, mapMutations } from "vuex";
import loadind from "../../assets/images/spainpink.gif"; //动画
import boadind from "../../assets/images/spinwhile.gif"; //动画
export default {
  data() {
    return {
      dev_details: {},
      value1: 0,
      value2: -1,
      option1: [
        { text: "全部", value: 0 },
        { text: "增加", value: 1 },
        { text: "减少", value: 2 }
      ],
      option2: [
        { text: "全部", value: -1 },
        { text: "1月", value: 1 },
        { text: "2月", value: 2 },
        { text: "3月", value: 3 },
        { text: "4月", value: 4 },
        { text: "5月", value: 5 },
        { text: "6月", value: 6 },
        { text: "7月", value: 7 },
        { text: "8月", value: 8 },
        { text: "9月", value: 9 },
        { text: "10月", value: 10 },
        { text: "11月", value: 11 },
        { text: "12月", value: 12 }
      ],
      node_list: [],
      pagenum: 0,
      allpage: 1,
      pullOptions: {
        isBottomRefresh: true,
        isTopRefresh: true,
        slideResistance: 5, //拉动阻力
        topTriggerHeight: 40, //下拉触发刷新的有效距离
        topPull: {
          loadingIcon: boadind
        },
        bottomPull: {
          loadingIcon: loadind,
          triggerWord: "加载更多"
        },
        bottomCloseElMove: false //关闭上拉加载
      }
    };
  },
  filters: {
    //时间戳转时间
    formatDate(time) {
      if (parseFloat(time).toString() == "NaN") {
        return time;
      } else {
        time = time * 1000;
        let date = new Date(time);
        return formatDate(date, "yyyy-MM-dd");
      }
    }
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
      if (window.innerWidth > 375) {
        return (
          window.innerHeight -
          2.18 * (window.deviceWidth / 7.5) -
          window.innerHeight * 0.175 +
          "px"
        );
      } else {
        return (
          window.innerHeight - 2.18 * 50 - window.innerHeight * 0.175 + "px"
        );
      }
    }
  },
  mounted() {
    try {
      window.android.setStatusBarAndNavigationBarColor("", "#ffffff");
    } catch (e) {}
    try {
      window.webkit.messageHandlers.setStatusBarAndNavigationBarColor.postMessage(
        "#559afe,#2762fd"
      );
    } catch (error) {}
    this.dev_details = this.$route.query.item_detail;
    var date = new Date();
    // this.value2 = date.getMonth() + 1;
    this.get_power_list(0);
  },
  methods: {
    ...mapMutations(["updateUser", "clearUser", "setdevsn", "setdevstatus"]),
    onClickLeft() {
      this.$router.go(-1);
    },
    //下拉刷新
    loadTop() {
      setTimeout(() => {
        this.get_power_list(0);
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
          this.get_power_list(this.pagenum);
        } else {
          this.$refs.vuuPull.closeLoadBottom();
        }
        if (this.$refs.vuuPull.closeLoadBottom) {
          this.$refs.vuuPull.closeLoadBottom();
        }
      }, 500);
    },
    get_power_list(page) {
      let parmas = new Object();
      parmas.login_token = this.log_token;
      parmas.dev_sn = this.dev_details.dev_sn;
      parmas.month = this.value2;
      parmas.cp_type = this.value1;
      parmas.cur_page = page;
      get_app_dev_cp_list(parmas)
        .then(res => {
          if (res.status == 0) {
            this.updateUser({ log_token: res.data.token_info.token });
            if (parmas.cur_page == 0) {
              this.node_list = res.data.cp_list;
            } else {
              this.node_list = this.node_list.concat(res.data.cp_list);
            }
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
    //筛选状态
    get_status() {
      this.node_list = [];
      this.get_power_list(0);
    },
    //筛选月份
    get_thmonth() {
      this.node_list = [];
      this.get_power_list(0);
    }
  }
};
</script>

<style lang="less" scoped>
/deep/.van-popup {
  width: 94%;
  padding: 3%;
  overflow-y: scroll;
}
/deep/.van-nav-bar {
  z-index: 2 !important;
  color: #fff;
  background: linear-gradient(45deg, #4c94fe 10%, #2762fd 100%);
}
/deep/.van-dropdown-menu {
  z-index: 11;
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
    margin-top: 0.92rem;
    height: 100%;
    .calculation_top {
      width: 100%;
      height: 17.5%;
      background: url(../../assets/images/suanlimingxi.png) no-repeat;
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
        padding-top: 0.5rem;
      }
    }
    .calculation_scroll {
      font-size: 0.24rem;
      border-radius: 0.2rem 0.2rem 0 0;
      background: #f8fafb;
      width: 100%;
      position: relative;
      top: -2%;
      padding-top: 0.2rem;
      overflow-x: hidden;
      overflow-y: scroll;
      .calculation_content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 94%;
        margin: auto;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 0.1rem 0.1rem 0px rgba(109, 164, 255, 0.06);
        border-radius: 0.1rem;
        margin-top: 0.2rem;
        height: 1.28rem;
        .content_left {
          width: 30%;
          p {
            font-size: 0.28rem;
            color: #333333;
          }
          p:nth-child(2) {
            font-size: 0.24rem;
            color: #666666;
          }
        }
        .content_right {
          width: 30%;
          p {
            font-size: 0.28rem;
            color: #333333;
          }
          p:nth-child(2) {
            font-size: 0.24rem;
            color: #666666;
          }
        }
      }
    }
  }
}
</style>
