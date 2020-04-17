<template>
  <div class="all_income">
    <navBar title="收益明细" left-arrow fixed @click-left="onClickLeft"></navBar>
    <!--  -->
    <div class="income_con">
      <div class="income_con_top">
        <p>累计收益(gfm)</p>
        <p class="dev_num">{{ total_revenue }}</p>
      </div>
      <div class="income_con_btn" v-show="income_list.length > 0">
        <van-dropdown-menu>
          <van-dropdown-item v-model="value11" :options="option1" @change="changedev" />
          <van-dropdown-item v-model="value22" :options="option2" @change="changetime" />
        </van-dropdown-menu>
      </div>
      <div v-if="income_list.length > 0">
        <vuu-pull
          ref="vuuPull"
          :options="pullOptions"
          v-on:loadTop="loadTop"
          v-on:loadBottom="loadBottom"
          :style="{ height: scrollerHeight }"
        >
          <van-collapse
            v-model="activeNames"
            v-for="(item, index) in income_list"
            :key="index"
            accordion
            @change="item_open(item)"
          >
            <van-collapse-item
              :title="'+' + (item.dev_profit / 100).toFixed(2) + 'gfm'"
              :name="index"
              :value="item.date_stamp | formatDate"
            >
              <div class="income_bottom_top">
                <span></span>
                <p>{{ item.devname }}</p>
              </div>
              <div class="income_bottom_con">
                <div class="income_bottom_con_item con_item_left">
                  <p>占用空间</p>
                  <p>
                    {{
                    (
                    (devarrlist.total_cap - devarrlist.free_cap) /
                    1024 /
                    1024
                    ).toFixed(2)
                    }}GB
                  </p>
                </div>
                <div class="income_bottom_con_item con_item_center">
                  <p>上行带宽</p>
                  <p>{{ (devarrlist.up_bandwidth / 1024 / 1024).toFixed(2) }}Mbps</p>
                </div>
                <div class="income_bottom_con_item con_item_right">
                  <p>下行带宽</p>
                  <p>{{ (devarrlist.down_bandwidth / 1024 / 1024).toFixed(2) }}Mbps</p>
                </div>
              </div>
              <div class="income_bottom_bot">
                <div>算力：{{ item.com_power }}</div>
                <div>在线时长：{{ (devarrlist.online_time / 3600).toFixed(2) }}h</div>
              </div>
            </van-collapse-item>
          </van-collapse>
        </vuu-pull>
      </div>
      <van-empty description="暂无数据" v-else />
    </div>
  </div>
</template>

<script>
import navBar from "../../components/navBar";
import { formatDate, transformTime } from "../../common/js/date.js";
import loadind from "../../assets/images/spainpink.gif"; //动画
import boadind from "../../assets/images/spinwhile.gif"; //动画
import {
  devrevenue,
  isbindinglist,
  devinformation,
  getuserdevlist,
  query_node_total_profit_info
} from "../../common/js/api";
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      total_revenue: 0,
      activeNames: ["1"],
      showdev: false,
      income_list: [],
      value11: 0,
      value22: 0,
      option1: [
        { text: "全部", value: 0 }
        // { text: "我的西柚机2", shouyi: 546, suanli: 34656, value: 1 },
        // { text: "我的西柚机3", shouyi: 2745, suanli: 346, value: 2 },
        // { text: "我的西柚机4", shouyi: 547, suanli: 2345, value: 3 },
        // { text: "我的西柚机5", shouyi: 6334, suanli: 93684, value: 4 },
        // { text: "我的西柚机6", shouyi: 15073, suanli: 46, value: 5 },
        // { text: "我的西柚机7", shouyi: 45, suanli: 102375, value: 6 }
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
      starttime: 0,
      endtime: 0,
      page: 0,
      slcsi: {},
      pagenum: 0,
      allpage: 1,
      devarrlist: {
        total_cap: 0,
        free_cap: 0,
        up_bandwidth: 0,
        down_bandwidth: 0,
        online_time: 0
      },
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
          window.innerHeight * 0.245 -
          0.92 * 100 -
          50 +
          "px"
        );
      } else {
        return (
          window.innerHeight -
          0.92 * 50 -
          window.innerHeight * 0.245 -
          50 +
          "px"
        );
      }
    }
  },
  mounted() {
    let date = new Date();
    this.value22 = date.getMonth() + 1;
    this.value11 = this.$route.query.allshou.dev_sn;
    this.changetime();
    this.get_use_dev_list();
  },
  methods: {
    ...mapMutations(["updateUser", "clearUser"]),
    //下拉刷新
    loadTop() {
      setTimeout(() => {
        this.get_use_dev_list();
        if (this.value11 == 0) {
          this.get_all_income(0);
          this.get_income_list(0);
        } else {
          this.get_dev_income(0);
          this.get_dev_income_day(0);
        }
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
          if (this.value11 == 0) {
            this.get_all_income(this.pagenum);
            this.get_income_list(this.pagenum);
          } else {
            this.get_dev_income(this.pagenum);
            this.get_dev_income_day(this.pagenum);
          }
        } else {
          return false;
        }
        if (this.$refs.vuuPull.closeLoadBottom) {
          this.$refs.vuuPull.closeLoadBottom();
        }
      }, 500);
    },
    //获取用户设备列表
    get_use_dev_list() {
      let params = new Object();
      params.login_token = this.log_token;
      isbindinglist(params)
        .then(res => {
          if (res.status == 0) {
            this.updateUser({ log_token: res.token_info.login_token });
            res.data.bind_devinfo_list.forEach(item => {
              let devobj = new Object();
              devobj.text = item.dev_name;
              devobj.value = item.dev_sn;
              this.option1.push(devobj);
            });
          } else if (res.status == -17) {
            this.rescount = 0;
            Dialog.alert({
              message: "账号在其它地方登录，请重新登录"
            }).then(() => {
              this.clearUser();
              this.$router.push({ path: "/login" });
            });
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
          }
        })
        .catch(error => {});
    },
    //获取单台设备每日收益列表
    get_dev_income_day(page) {
      let params = new Object();
      params.login_token = this.log_token;
      params.start_time = this.starttime;
      params.end_time = this.endtime;
      params.cur_page = page;
      params.dev_sn = this.value11;
      devrevenue(params)
        .then(res => {
          if (res.status == 0) {
            if (params.cur_page == 0) {
              this.income_list = res.data.dev_profit_list;
            } else {
              this.income_list = this.income_list.concat(
                res.data.dev_profit_list
              );
            }
          } else if (res.status == -17) {
            this.rescount = 0;
            Dialog.alert({
              message: "账号在其它地方登录，请重新登录"
            }).then(() => {
              this.clearUser();
              this.$router.push({ path: "/login" });
            });
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
          }
        })
        .catch(error => {});
    },
    //获取所有设备收益列表
    get_income_list(page) {
      let params = new Object();
      params.start_time = this.starttime;
      params.end_time = this.endtime;
      params.login_token = this.log_token;
      params.query_type = 2;
      params.cur_page = page;
      getuserdevlist(params)
        .then(res => {
          if (res.status == 0) {
            this.updateUser({
              log_token: res.data.token_info.token
            });
            if (params.cur_page == 0) {
              this.income_list = [];
            }
            res.data.user_profit_list.forEach((item, index) => {
              let dev_obj = new Object();
              dev_obj.dev_profit = item.user_total_profit;
              dev_obj.date_stamp = item.date_stamp;
              this.income_list.push(dev_obj);
            });
          } else if (res.status == -17) {
            this.rescount = 0;
            Dialog.alert({
              message: "账号在其它地方登录，请重新登录"
            }).then(() => {
              this.clearUser();
              this.$router.push({ path: "/login" });
            });
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
          }
        })
        .catch(error => {}); //获取每天总收益
    },
    //获取单台设备收益
    get_dev_income(page) {
      let params = new Object();
      params.login_token = this.log_token;
      params.cur_page = page;
      params.start_time = this.starttime;
      params.end_time = this.endtime;
      params.dev_sn = this.value11;
      query_node_total_profit_info(params)
        .then(res => {
          if (res.status == 0) {
            // this.updateUser({
            //   log_token: res.data.token_info.token
            // });
            this.total_revenue = (res.data.total_profit / 100).toFixed(2);
          } else if (res.status == -17) {
            this.rescount = 0;
            Dialog.alert({
              message: "账号在其它地方登录，请重新登录"
            }).then(() => {
              this.clearUser();
              this.$router.push({ path: "/login" });
            });
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
          }
        })
        .catch(error => {});
    },
    //获取总收益
    get_all_income(num) {
      let params = new Object();
      let token = this.log_token;
      params.login_token = token;
      params.start_time = this.starttime;
      params.end_time = this.endtime;
      params.query_type = 1;
      params.cur_page = num;
      params.dev_sn = "";
      getuserdevlist(params)
        .then(res => {
          if (res.status == 0) {
            this.updateUser({
              log_token: res.data.token_info.token
            });
            this.total_revenue = (res.data.user_total_profit / 100).toFixed(2);
          } else if (res.status == -17) {
            this.rescount = 0;
            Dialog.alert({
              message: "账号在其它地方登录，请重新登录"
            }).then(() => {
              this.clearUser();
              this.$router.push({ path: "/login" });
            });
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
          }
        })
        .catch(error => {});
    },
    onClickLeft() {
      this.$router.go(-1);
    },
    changedev() {
      this.income_list = [];
      if (this.value11 == 0) {
        this.get_all_income(0);
        this.get_income_list(0);
      } else {
        this.get_dev_income(0);
        this.get_dev_income_day(0);
      }
    },
    changetime() {
      var _this = this;
      var date = new Date();
      var y = date.getFullYear();
      function computeTime(year, month) {
        _this.starttime = new Date(year, month - 1, 1).getTime() / 1000;
        _this.endtime = new Date(year, month, 0).getTime() / 1000;
      }
      computeTime(y, this.value22);
      this.income_list = [];
      if (this.value11 == 0) {
        this.get_all_income(0);
        this.get_income_list(0);
      } else {
        this.get_dev_income(0);
        this.get_dev_income_day(0);
      }
    },
    //取消按钮
    onCancel_dev() {
      this.showdev = false;
    },
    item_open(activeNames) {
      if (activeNames.date_stamp == this.slcsi.date_stamp) {
        return false;
      }
      if (activeNames) this.slcsi = activeNames;
      let statime =
        Date.parse(this.timestampToTime(this.slcsi.date_stamp)) / 1000;
      let endtime = statime + 86400;
      let params = new Object();
      params.login_token = this.log_token;
      params.start_time = statime;
      params.end_time = endtime;
      params.cur_page = this.page;
      params.dev_sn = this.value11;
      devinformation(params)
        .then(res => {
          if (res.status == 0) {
            for (let lewf of res.data.dev_info_list) {
              if (lewf.date_stamp > statime && lewf.date_stamp <= endtime) {
                this.devarrlist = lewf;
                return false;
              }
            }
            if (this.page >= res.data.total_page) {
              return false;
            }
            this.page++;
            this.item_open();
          }
        })
        .catch(error => {});
    },
    //事件戳转时间
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate() + " ";
      var h = 0 + ":";
      var m = 0 + ":";
      var s = 0;
      return Y + M + D + h + m + s;
    }
  },
  components: {
    navBar: navBar
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
  background-color: #f8fafb;
}
/deep/.van-dropdown-menu__item {
  flex: none;
  width: 2rem;
  height: 0.6rem;
  border-radius: 1rem;
  background-color: #fff;
  margin: auto;
  border: 1px solid #eeeeee;
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
  margin-top: 2rem;
}
.all_income {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .income_con {
    margin-top: 0.92rem;
    .income_con_top {
      width: 100%;
      height: 24.5%;
      background: url(../../assets/images/suanlimingxi.png) no-repeat;
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
      position: relative;
      z-index: 11;
    }
    .income_con_body {
      background-color: #fff;
    }
    .income_bottom_top {
      width: 100%;
      display: flex;
      align-items: center;
      span {
        width: 0.1rem;
        height: 0.1rem;
        border-radius: 50%;
        background-color: #1989fa;
        margin-right: 0.2rem;
      }
      p {
        color: #333333;
      }
    }
    .income_bottom_con {
      width: 100%;
      display: flex;
      border-bottom: solid #eeeeee 1px;
      margin-top: 0.4rem;
      .income_bottom_con_item {
        width: 33%;
        p:nth-child(2) {
          font-weight: 600;
          font-size: 0.28rem;
          margin-top: 0.2rem;
          margin-bottom: 0.3rem;
          color: #333333;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .con_item_left {
        text-align: left;
        margin-left: 0.3rem;
      }
      .con_item_center {
        text-align: center;
      }
      .con_item_right {
        text-align: right;
      }
    }
    .income_bottom_bot {
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-top: 0.2rem;
    }
  }
}
</style>
