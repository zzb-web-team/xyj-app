<template>
  <div class="all_income">
    <navBar
      title="收益明细"
      left-arrow
      fixed
      @click-left="onClickLeft"
    ></navBar>
    <!--  -->
    <div class="income_con">
      <div class="income_con_top">
        <p>{{ revenue_time | formatDate }}累计收益(gfm)</p>
        <p class="dev_num">{{ total_revenue }}</p>
      </div>
      <!--  -->

      <div class="content_body" v-if="dev_income_list.length > 0">
        <vuu-pull
          ref="vuuPull"
          :options="pullOptions"
          v-on:loadTop="loadTop"
          v-on:loadBottom="loadBottom"
          :style="{ height: scrollerHeight }"
        >
          <div
            class="content_con"
            v-for="(item, index) in dev_income_list"
            :key="index"
          >
            <div class="content_body_top" @click="go_income_list(item)">
              <span>
                <img src="../../assets/images/income_dev_name.png" alt />
                {{ item.dev_name }}
              </span>
              <span>
                算力：{{ item.dev_profit }}
                <img src="../../assets/images/per_icon_arrow.png" alt />
              </span>
            </div>
            <div class="content_body_bottom" @click="go_income_list(item)">
              <div class="content_body_bottom_left">
                <img src="../../assets/images/income_shouyi_new.png" alt />
                <div class="content_body_bottom_right_detail">
                  <p>累计收益</p>
                  <p>
                    {{ (item.dev_profit / 100).toFixed(2) }}
                    <span>gfm</span>
                  </p>
                </div>
              </div>
              <div class="content_body_bottom_right item_right">
                <div class="content_body_bottom_right_detail">
                  <p>
                    占用空间：{{
                      (
                        (item.total_cap - item.free_cap) /
                        1024 /
                        1024 /
                        1024
                      ).toFixed(2)
                    }}GB
                  </p>
                  <p>
                    上行带宽：{{
                      (item.up_bandwidth / 1024 / 1024).toFixed(2)
                    }}Mbps
                  </p>
                  <p>
                    下行带宽：{{
                      (item.down_bandwidth / 1024 / 1024).toFixed(2)
                    }}Mbps
                  </p>
                  <p>在线时长：{{ (item.online_time / 3600).toFixed(2) }}h</p>
                </div>
              </div>
            </div>
          </div>
        </vuu-pull>
      </div>
      <van-empty description="暂无数据" v-else />

      <!--  -->
    </div>
  </div>
</template>

<script>
import navBar from "../../components/navBar";
import { formatDate, transformTime } from "../../common/js/date.js";
import { alldevinformation, alldevrevenue } from "../../common/js/api";
import loadind from "../../assets/images/spainpink.gif"; //动画
import boadind from "../../assets/images/spinwhile.gif"; //动画
import { mapState, mapMutations } from "vuex";
import { Toast, Dialog } from "vant";
export default {
  data() {
    return {
      total_revenue: 0,
      revenue_time: 0,
      dev_income_list: [],
      income_detail: [],
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
          0.92 * (window.deviceWidth / 7.5) -
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
    this.total_revenue = (
      this.$route.query.allshou.user_total_profit / 100
    ).toFixed(2);
    this.revenue_time = this.$route.query.allshou.date_stamp;
    this.get_income(0);
  },
  methods: {
    ...mapMutations(["updateUser", "clearUser", "setdevsn", "setdevstatus"]),
    //下拉刷新
    loadTop() {
      setTimeout(() => {
        this.get_income(0);
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
          this.get_income(this.pagenum);
        } else {
          return false;
        }
        if (this.$refs.vuuPull.closeLoadBottom) {
          this.$refs.vuuPull.closeLoadBottom();
        }
      }, 500);
    },
    //收益
    get_income(page) {
      let params = new Object();
      let statime = Date.parse(this.timestampToTime(this.revenue_time)) / 1000;
      let endtime = statime + 86399;
      params.login_token = this.log_token;
      params.cur_page = page;
      params.start_time = statime;
      params.end_time = endtime;
      alldevrevenue(params)
        .then(res => {
          if (res.status == 0) {
            if (params.cur_page == 0) {
              this.income_detail = res.data.dev_profit_list;
            } else {
              this.income_detail = this.income_detail.concat(
                res.data.dev_profit_list
              );
            }
            this.allpage = res.data.total_page;
            this.get_dev_detail(params.cur_page);
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
        .catch();
    },
    //详情
    get_dev_detail(page) {
      let params = new Object();
      let statime = Date.parse(this.timestampToTime(this.revenue_time)) / 1000;
      let endtime = statime + 86399;
      params.login_token = this.log_token;
      params.start_time = statime;
      params.end_time = endtime;
      params.cur_page = page;
      alldevinformation(params)
        .then(res => {
          if (res.status == 0) {
            for (let i = 0; i < this.income_detail.length; i++) {
              for (let j = 0; j < res.data.dev_info_list.length; j++) {
                if (
                  this.income_detail[i].dev_sn ==
                  res.data.dev_info_list[j].dev_sn
                ) {
                  this.income_detail[i].total_cap =
                    res.data.dev_info_list[j].total_cap;
                  this.income_detail[i].free_cap =
                    res.data.dev_info_list[j].free_cap;
                  this.income_detail[i].up_bandwidth =
                    res.data.dev_info_list[j].up_bandwidth;
                  this.income_detail[i].down_bandwidth =
                    res.data.dev_info_list[j].down_bandwidth;
                  this.income_detail[i].online_time =
                    res.data.dev_info_list[j].online_time;
                }
              }
            }
            this.dev_income_list = this.income_detail;
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
        .catch();
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
    },
    onClickLeft() {
      this.$router.go(-1);
    },
    go_income_detail(data) {
      // console.log(data);
    },
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
    display: flex;
    flex-direction: column;
    .income_con_top {
      width: 100%;
      height: 24.5%;
      background: url(../../assets/images/suanlimingxi.png) no-repeat;
      background-size: 100% 100%;
      background-position: top;
      p {
        color: #fff;
        padding-top: 0.2rem;
      }
      .dev_num {
        font-size: 0.6rem;
        font-weight: bold;
        padding-bottom: 0.2rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .content_body {
      width: 100%;
      overflow-y: scroll;
      flex: 1;
      .content_con {
        width: 84%;
        padding: 4%;
        margin: auto;
        color: #333333;
        border: solid 0.01rem #eeeeee;
        border-radius: 0.1rem;
        margin-top: 0.2rem;
        text-align: left;

        img {
          width: 18%;
        }
        .content_body_top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.2rem;
          font-size: 0.28rem;
          font-weight: 600;
          span {
            width: 2rem;
            display: flex;
            overflow: hidden;
            align-items: center;
            img {
              margin-right: 0.1rem;
            }
          }
          span:nth-child(2) {
            font-weight: 500;
            font-size: 0.24rem;
            color: #666666;
            justify-content: flex-end;
            img {
              width: 20%;
              margin-left: 0.1rem;
              margin-right: 0;
            }
          }
        }
        .content_body_bottom {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .content_body_bottom_left,
          .content_body_bottom_right {
            width: 28.5%;
            padding: 10%;
            display: flex;
            justify-content: space-between;
            align-content: center;
            border: solid 0.01rem #eeeeee;
            border-radius: 0.1rem;
            img {
              width: 28%;
            }
            .content_body_bottom_right_detail {
              width: 96%;
              padding-left: 4%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              p {
                font-size: 0.2rem;
                color: #666666;
              }
            }
          }
          .item_right {
            width: 38.5%;
            padding: 4.6% 5% 4.6% 5%;
          }
        }
      }
    }
  }
}
</style>
