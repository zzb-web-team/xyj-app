<template>
  <div class="all_income">
    <van-nav-bar
      size="0.4rem"
      left-arrow
      fixed
      title="西柚机收益账户"
      @click-left="onClickLeft()"
      @click-right="onClickRight()"
      :z-index="0"
    >
      <div slot="left" class="alltitleleft">
        <van-icon name="arrow-left" color="#ffffff" />
      </div>
      <div slot="right" class="titright">
        <span>兑换</span>
      </div>
    </van-nav-bar>
    <!--  -->
    <div class="income_con" >
      <div class="income_con_top">
        <p>积分()</p>
        <p class="dev_num">{{ total_revenue }}</p>
      </div>

      <div class="income_con_btn">
        <van-dropdown-menu>
          <van-dropdown-item
            v-model="value11"
            :options="option1"
            @change="changegrow"
          />
          <van-dropdown-item
            v-model="value22"
            :options="option2"
            @change="changetime"
          />
        </van-dropdown-menu>
      </div>
      <!--  -->
      <vuu-pull
        ref="vuuPull"
        :options="pullOptions"
        v-on:loadTop="loadTop"
        v-on:loadBottom="loadBottom"
        :style="{ height: scrollerHeight }"
      >
        <div class="incon_con_body" v-if="income_list.length > 0">
          <div
            class="incon_con_body_item"
            v-for="(item, index) in income_list"
            :key="index"
          >
            <div class="incon_con_body_left">
              <p>
                {{ item.profit_type == 1 ? "+" : "-"
                }}{{ (item.cur_profit / 100).toFixed(2) }}gfm
              </p>
              <p>{{ (item.total_profit / 100).toFixed(2) }}gfm</p>
            </div>
            <div class="incon_con_body_right">
              <div>
                <p>{{ item.profit_type == 2 ? "兑换" : "收益" }}</p>
                <p>{{ item.time_stamp | formatDate }}</p>
              </div>
              <!-- <van-icon name="arrow" /> -->
            </div>
          </div>
        </div>
      <van-empty image="search" description="暂无数据" v-else />
      </vuu-pull>
    </div>

  </div>
</template>

<script>
import { formatDate, transformTime } from "../../common/js/date.js";
import {
  authorization,
  redeems,
  query_user_node_exchange_list
} from "../../common/js/api";
import { TabbarItem, Toast, PullRefresh, Dialog, NavBar } from "vant";
import { mapState, mapMutations } from "vuex";
import loadind from "../../assets/images/spainpink.gif"; //动画
import boadind from "../../assets/images/spinwhile.gif"; //动画
export default {
  data() {
    return {
      total_revenue: 0,
      activeNames: ["1"],
      showdev: false,
      system: "",
      income_list: [],
      value11: 0,
      value22: 0,
      starttime: 0,
      endtime: 0,
      pagenum: 0,
      allpage: 1,
      option1: [
        { text: "全部", value: 0 },
        { text: "收益", value: 1 },
        { text: "兑换", value: 2 }
      ],
      option2: [
        { text: "全部", value: 0 },
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
          triggerWord:"加载更多"
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
      charge_psd: state => state.user.charge_psd
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
    this.total_revenue = this.$route.query.income;
    let date = new Date();
    this.value2 = date.getMonth() + 1;
    this.whatBrowser();
    this.changetime();
  },
  methods: {
    ...mapMutations(["updateUser", "clearUser"]),
    onClickLeft() {
      this.$router.go(-1);
    },
    //下拉刷新
    loadTop() {
      setTimeout(() => {
        //  this.income_list = [];
        this.redemptionrecord(0);
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
          this.redemptionrecord(this.pagenum);
        } else {
          this.$refs.vuuPull.closeLoadBottom();
        }
        if (this.$refs.vuuPull.closeLoadBottom) {
          this.$refs.vuuPull.closeLoadBottom();
        }
      }, 500);
    },
    //积分收支记录
    redemptionrecord(pages) {
      if (this.$parent.onLine == false) {
        Toast("无法连接网络，请检查网络状态");
      } else {
        let params = new Object();
        let token = this.log_token;
        params.start_time = this.starttime;
        params.end_time = this.endtime;
        params.login_token = token;
        params.cur_page = pages;
        params.profit_type = this.value11;
        query_user_node_exchange_list(params) //兑换记录
          .then(res => {
            if (res.status == 0) {
              this.updateUser({ log_token: res.data.token_info.token });
              if (res.err_code == 0) {
                if (params.cur_page == 0) {
                  this.income_list = res.data.total_profit_list;
                } else {
                  this.income_list = this.income_list.concat(
                    res.data.total_profit_list
                  );
                }
                this.allpage = res.data.total_page;
              } else if (res.err_code == -5) {
              } else if (res.err_code == 500) {
                this.noint = true;
              } else {
                const sta = err[res.err_code]
                  ? this.$t(err[res.err_code])
                  : `请稍后重试 ${res.err_code}`;
                this.$toast(sta);
              }
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
            } else if (res.status == -999) {
              Toast("登录已过期，请重新登录");
              this.clearUser();
              setTimeout(() => {
                this.$router.push({ path: "/login" });
              }, 1000);
            } else if (res.status == -900) {
              this.$router.push({ path: "/login" });
            } else if (res.status == -5) {
              Toast("服务器响应超时");
            } else if (res.status == -17) {
              Dialog.alert({
                message: "账号在其它地方登录，请重新登录"
              }).then(() => {
                this.clearUser();
                this.$router.push({ path: "/login" });
              });
            } else if (res.status == -500) {
            } else {
              const tip = this.$backStatusMap[res.status] || err[res.status];
              const str = tip ? this.$t(tip) : `请稍后重试 ${res.status}`;
              this.$toast(str);
            }
          })
          .catch(error => {
            // console.log(error);
            // Toast("网络错误，请重新请求");
          });
      }
    },
    //兑换
    onClickRight() {
      if (this.total_revenue <= 0) {
        Toast({
          message: "账户暂无积分",
          duration: 1500
        });
        return false;
      }
      const toast = Toast.loading({
        duration: 15000, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: "spinner",
        mask: false
      });
      let nowparam = new Object();
      nowparam.login_token = this.log_token;
      nowparam.login_type = 1;
      authorization(nowparam)
        .then(res => {
          Toast.clear();
          if (res.status == 0) {
            if (res.data.bind_status == 1) {
              setTimeout(() => {
                this.$router.push({
                  path: "/tomoney"
                });
              }, 200);
            } else {
              Toast.fail({
                message: "未授权",
                duration: 400
              });
              if (this.system == "iPhone") {
                this.Authorization(res.url);
              } else {
                setTimeout(() => {
                  this.$router.push({
                    path: "/ding",
                    query: { url: res.url }
                  });
                }, 400);
              }
            }
          } else if (res.status == -999) {
            Toast("登录已过期，请重新登录");
            this.clearUser();
            setTimeout(() => {
              this.$router.push({ path: "/login" });
            }, 1000);
          } else if (res.status == -17) {
            Dialog.alert({
              message: "账号在其它地方登录，请重新登录"
            }).then(() => {
              this.clearUser();
              this.$router.push({ path: "/login" });
            });
          } else if (res.status == -500) {
            this.noint = true;
          } else if (res.status == -900) {
            this.$router.push({ path: "/login" });
          } else if (res.status == -5) {
            Toast(`请求超时，请稍后重试`);
          } else {
            const tip = this.$backStatusMap[res.status] || err[res.status];
            const str = tip ? this.$t(tip) : `请稍后重试 ${res.status}`;
            this.$toast(str);
          }
        })
        .catch(error => {
          // Toast("网络错误，请重新请求");
        });
    },
    //获去手机系统
    whatBrowser() {
      let u = navigator.userAgent;
      if (u.indexOf("Android") > -1 || u.indexOf("Linux") > -1) {
        //安卓手机
        this.system = "Android";
        // window.location.href = "mobile/index.html";
      } else if (u.indexOf("iPhone") > -1) {
        //苹果手机
        // window.location.href = "mobile/index.html";
        this.system = "iPhone";
      } else if (u.indexOf("Windows Phone") > -1) {
        //winphone手机
        this.system = "Windows Phone";
        // window.location.href = "mobile/index.html";
      }
    },
    changetime() {
      if (this.value22 == 0) {
        let querydate = 90;
        this.endtime = Date.parse(new Date().toLocaleDateString()) / 1000; //获取当前年月日时间戳
        this.starttime = this.endtime - querydate * 24 * 3600; //获取前九十天的时间戳
      } else {
        var _this = this;
        var date = new Date();
        var y = date.getFullYear();
        function computeTime(year, month) {
          _this.starttime = new Date(year, month - 1, 1).getTime() / 1000;
          _this.endtime = new Date(year, month, 0).getTime() / 1000 + 86399;
        }
        computeTime(y, this.value22);
      }
      this.income_list = [];
      this.redemptionrecord(0);
    },
    changegrow() {
      this.income_list = [];
      this.redemptionrecord(0);
    },
    go_income_detail(data) {},
    show_dev() {
      this.showdev = true;
    },
    onSelect_dev(item) {
      this.showdev = false;
    },
    //取消按钮
    onCancel_dev() {
      this.showdev = false;
    }
  }
};
</script>

<style lang="less" scoped>
/deep/.van-button .van-icon {
  transform: rotate(90deg);
}
/deep/.van-cell--clickable {
  border-bottom: 1px solid #eeeeee;
}
/deep/.van-cell__title {
  text-align: left;
  width: 1.65rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/deep/.van-popup {
  width: 94%;
  padding: 3%;
  overflow-y: scroll;
}
/deep/.van-dropdown-menu {
  justify-content: space-between;
  background-color: #F5F5F5;
  height: 1.26rem;
  z-index: 11;
}
/deep/.van-dropdown-menu__item:nth-child(1) {
  flex: none;
  width: 1.56rem;
  height: 0.6rem;
  border-radius: 1rem;
  background-color: #fff;
  margin: auto;
  border: 1px solid #eeeeee;
  margin-left: 4%;
}
/deep/.van-dropdown-menu__item:nth-child(2) {
  flex: none;
  width: 1.56rem;
  height: 0.6rem;
  border-radius: 1rem;
  background-color: #fff;
  margin: auto;
  border: 1px solid #eeeeee;
  margin-right: 4%;
}
/deep/.van-collapse-item__content {
  background-color: #f9f9fd;
}
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
  margin-top: 1rem;
}
.all_income {
  width: 100%;
  height: 100%;
  background-color: #fff;
  overflow: hidden;
  .titright {
    line-height: inherit;
    margin-right: 0.2rem;
  }
  .income_con {
    margin-top: 0.92rem;
    height: 100%;
    .income_con_top {
      width: 100%;
      height: 17.5%;
      background: url(../../assets/images/shouyi_bgc.png) no-repeat;
      background-size: 100% 100%;
      background-position: top;
      position: relative;
      z-index: 11;
      p {
        color: #fff;
        padding-top: 0.2rem;
      }
      .dev_num {
        font-size: 0.6rem;
        font-weight: bold;
        padding-bottom: 0.2rem;
      }
    }
    .income_con_btn {
      background-color: #f8fafb;
      width: 100%;
    }
    .incon_con_body {
      overflow-x: hidden;
      overflow-y: scroll;
      .incon_con_body_item {
        display: flex;
        align-items: center;
        width: 92%;
        justify-content: space-between;
        padding: 0 4%;
        border-bottom: 1px solid #eeeeee;
        .incon_con_body_left {
          p {
            margin: 0.1rem 0;
            text-align: left;
          }
          p:nth-child(2) {
            color: #666666;
            font-size: 0.24rem;
          }
        }
        .incon_con_body_right {
          display: flex;
          align-items: center;
          text-align: right;
          div {
            margin-right: 0.1rem;
          }
          p {
            margin: 0.1rem 0;
          }
          p:nth-child(2) {
            color: #666666;
            font-size: 0.26rem;
          }
        }
      }
    }
  }
}
</style>
