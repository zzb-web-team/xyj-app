<template>
  <div class="income_overview">
    <!-- 头部 -->
    <van-nav-bar
      size="0.4rem"
      left-arrow
      title="收益"
      fixed
      @click-right="onClickRight()"
      :z-index="11"
    >
      <div slot="left" class="alltitleleft">
        <!-- <van-icon name="arrow-left" color="#ffffff" /> -->
      </div>
      <div slot="right" class="titrights">
        <span>排行</span>
      </div>
    </van-nav-bar>
    <!--  -->
    <div class="content">
      <vuu-pull ref="vuuPull" :options="pullOptions" v-on:loadTop="loadTop">
        <div class="content_top">
          <div class="content_top_all" @click="go_all_income_list">
            <p>
              累计收益(gfm)
              <van-icon name="play" />
            </p>
            <div>{{ all_income }}</div>
          </div>
          <div class="content_top_detail">
            <div class="content_top_detail_left">
              <p>{{ last_income }}</p>
              <p>昨日收益(gfm)</p>
            </div>
            <div class="content_top_detail_right">
              <p>{{ weak_income }}</p>
              <p>近一周收益(gfm)</p>
            </div>
          </div>
        </div>

        <div
          class="content_body"
          v-if="dev_income_list.length > 0"
          :style="{ height: scrollerHeight }"
        >
          <div
            class="content_con"
            v-for="(item, index) in dev_income_list"
            :key="index"
          >
            <div class="content_body_top" @click="go_income_list(item)">
              <div>
                <img src="../../assets/images/income_dev_name.png" alt />
                {{ item.dev_name }}
              </div>
              <img src="../../assets/images/per_icon_arrow.png" alt />
            </div>
            <div class="content_body_bottom">
              <div
                class="content_body_bottom_left"
                @click="go_income_list(item)"
              >
                <img src="../../assets/images/income_shouyi_new.png" alt />
                <div class="content_body_bottom_right_detail">
                  <p>累计收益</p>
                  <p>
                    {{ (item.total_profit / 100).toFixed(2) }}
                    <span>gfm</span>
                  </p>
                </div>
              </div>
              <div
                class="content_body_bottom_right"
                @click="go_calculation_details(item)"
                v-bind:style="{
                  'pointer-events': item.cp_value >= 0 ? 'auto' : 'none'
                }"
              >
                <img src="../../assets/images/income_suanli_new.png" alt />
                <div class="content_body_bottom_right_detail">
                  <p>算力</p>
                  <p>{{ item.cp_value >= 0 ? item.cp_value : "--" }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <van-empty description="暂无数据" v-else />
      </vuu-pull>
    </div>
    <!--  -->
    <tabbar v-model="active"></tabbar>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import tabbar from "../../components/foot";
import loadind from "../../assets/images/spainpink.gif"; //动画
import boadind from "../../assets/images/spinwhile.gif"; //动画
import {
  getuserdevlist,
  query_node_total_profit_info,
  get_app_dev_con_val,
  isbindinglist,
  getdevhistoricalname
} from "../../common/js/api";
import { Toast, Dialog } from "vant";
export default {
  data() {
    return {
      active: 3,
      all_income: 0,
      last_income: 0,
      weak_income: 0,
      pullOptions: {
        isBottomRefresh: true,
        isTopRefresh: true,
        slideResistance: 5, //拉动阻力
        topTriggerHeight: 40, //下拉触发刷新的有效距离
        topPull: {
          loadingIcon: boadind
        },
        bottomCloseElMove: false //关闭上拉加载
      },
      dev_income_list: [
        // {
        //   devname: "我的西柚机1",
        //   total_profit: 6334,
        //   total_com_power: 56,
        //   dev_sn: 0
        // },
        // {
        //   devname: "我的西柚机2",
        //   total_profit: 546,
        //   total_com_power: 34656,
        //   dev_sn: 1
        // },
        // {
        //   devname: "我的西柚机3",
        //   total_profit: 2745,
        //   total_com_power: 346,
        //   dev_sn: 2
        // },
        // {
        //   devname: "我的西柚机4",
        //   total_profit: 547,
        //   total_com_power: 2345,
        //   dev_sn: 3
        // },
        // {
        //   devname: "我的西柚机5",
        //   total_profit: 6334,
        //   total_com_power: 93684,
        //   dev_sn: 4
        // },
        // {
        //   devname: "我的西柚机6",
        //   total_profit: 15073,
        //   total_com_power: 46,
        //   dev_sn: 5
        // },
        // {
        //   devname: "我的西柚机7",
        //   total_profit: 45,
        //   total_com_power: 102375,
        //   dev_sn: 6
        // }
      ],
      user_dev_list: [],
      demo_minerInfo: []
    };
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
        return window.innerHeight - 4.52 * (window.deviceWidth / 7.5) + "px";
      } else {
        return window.innerHeight - 4.52 * 50 + "px";
      }
    }
  },
  mounted() {
    try {
      window.android.setStatusBarAndNavigationBarColor("1", "#ffffff");
    } catch (e) {}
    try {
      window.webkit.messageHandlers.setStatusBarAndNavigationBarColor.postMessage(
        "#ffffff"
      );
    } catch (error) {}
    this.get_all_income(90);
    this.get_all_dev_income(0);
  },
  methods: {
    ...mapMutations(["updateUser", "clearUser", "setdevsn", "setdevstatus"]),
    //下拉
    loadTop() {
      setTimeout(() => {
        this.get_all_income(90);
        this.get_all_dev_income(0);
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
          return false;
        }
        if (this.$refs.vuuPull.closeLoadBottom) {
          this.$refs.vuuPull.closeLoadBottom();
        }
      }, 500);
    },
    get_use_dev_list() {
      let params = new Object();
      let nowtime = new Date(new Date().toLocaleDateString());
      let starttime = nowtime.setTime(
        nowtime.getTime() - 3600 * 1000 * 24 * 90
      );
      params.login_token = this.log_token;
      params.start_ts = starttime / 1000;
      params.end_ts = Date.parse(new Date()) / 1000;
      getdevhistoricalname(params)
        .then(res => {
          if (res.status == 0) {
            this.updateUser({ log_token: res.token_info.login_token });
            this.user_dev_list = res.data;
            // res.data.bind_devinfo_list.forEach(item => {
            //   let devobj = new Object();
            //   devobj.dev_name = item.dev_name;
            //   devobj.dev_sn = item.dev_sn;
            //   this.user_dev_list.push(devobj);
            // });
            this.get_con();
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
          // console.log(error);
        });
    },
    //获取设备收益列表
    get_all_dev_income(page) {
      let params = new Object();
      params.login_token = this.log_token;
      params.cur_page = page;
      query_node_total_profit_info(params)
        .then(res => {
          if (res.status == 0) {
            this.updateUser({
              log_token: res.data.token_info.token
            });
            if (params.cur_page == 0) {
              // this.dev_income_list = res.data.dev_total_profit_list;
              this.demo_minerInfo = res.data.dev_total_profit_list;
            } else {
              // this.dev_income_list = this.dev_income_list.concat(
              //   res.data.dev_total_profit_list
              // );
              this.demo_minerInfo = this.demo_minerInfo.concat(
                res.data.dev_total_profit_list
              );
            }
            this.get_use_dev_list();
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
        .catch(error => {});
    },
    //获取总收益
    get_all_income(num) {
      let params = new Object();
      let endtime = Date.parse(new Date()) / 1000; //获取当前日期时间戳(精确到秒)
      let endtimes = Date.parse(new Date().toLocaleDateString()) / 1000; //获取当前年月日时间戳（当天零点）
      let starttime = endtimes - num * 24 * 3600; //获取7天的时间戳
      let token = this.log_token;
      params.login_token = token;
      params.start_time = starttime;
      params.end_time = endtimes;
      params.query_type = 1;
      params.cur_page = 0;
      params.dev_sn = "";
      getuserdevlist(params)
        .then(res => {
          if (res.status == 0) {
            this.updateUser({
              log_token: res.data.token_info.token
            });
            this.all_income = (res.data.user_total_profit / 100).toFixed(2);
            this.last_income = (res.data.yes_profit / 100).toFixed(2);
            this.weak_income = (res.data.one_week_profit / 100).toFixed(2);
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
        .catch(error => {});
    },
    //获取算力值
    get_con(num) {
      let params = new Object();
      params.login_token = this.log_token;
      get_app_dev_con_val(params)
        .then(res => {
          if (res.status == 0) {
            this.updateUser({ log_token: res.data.token_info.token });
          }
          if (num == 0) {
            this.minerInfo = [];
          }
          let obje = {};
          res.data.dev_value_list.forEach((item, index) => {
            let key = item.dev_sn;
            let value = item;
            obje[key] = value;
            obje[key].dev_name = "";
          });
          this.user_dev_list.forEach(deem => {
            let uev_sn = deem.dev_sn;
            if (obje[uev_sn]) {
              obje[uev_sn].dev_name = deem.dev_name;
            }
          });
          this.demo_minerInfo.forEach((adme, indexs) => {
            let sad = adme.dev_sn;
            if (obje[sad]) {
              let deas = new Object();
              deas = adme;
              deas.cp_value = obje[sad].cp_value;
              deas.con_value = obje[sad].con_value;
              deas.node_grade = obje[sad].node_grade;
              deas.dev_name = obje[sad].dev_name;
              this.dev_income_list.push(deas);
            }
          });
        })
        .catch(error => {
          console.log(error);
        });
    },

    onClickRight() {
      this.$router.push({
        path: "/ranking"
      });
    },
    go_all_income_list() {
      this.$router.push({
        path: "/all_income_list",
        query: { allshou: this.all_income }
      });
    },
    go_income_list(val) {
      this.$router.push({
        path: "/income_list",
        query: { allshou: val }
      });
    },
    go_calculation_details(val) {
      let detail = new Object();
      detail.dev_sn = val.dev_sn;
      detail.cp_value = val.cp_value;
      detail.dev_name = "";
      this.$router.push({
        path: "/calculation_details",
        query: { item_detail: detail }
      });
    }
  },
  components: {
    tabbar: tabbar
  }
};
</script>

<style lang="less" scoped>
/deep/.van-nav-bar {
  background: #ffffff !important;
}
.pull-normal-top,
.pull-normal-bottom {
  color: #333333;
}
.income_overview {
  width: 100%;
  height: 100%;
  background-color: #fff;
  // overflow: hidden;
  .titrights {
    margin-right: 0.2rem;
    color: #666666;
  }
  .content {
    margin-top: 0.92rem;
    color: #ffffff;
    font-size: 0.24rem;
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    .content_top {
      width: 72%;
      padding: 0 10%;
      height: 3.6rem;
      text-align: left;
      margin: auto;
      border-radius: 0.1rem;
      background: url(../../assets/images/all_income.png) no-repeat;
      background-size: 100% 100%;
      position: relative;
      z-index: 11;
      .content_top_all {
        padding-top: 10%;
        div {
          width: 100%;
          font-size: 0.76rem;
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .content_top_detail {
        display: flex;
        justify-content: center;
        margin-top: 0.5rem;
        .content_top_detail_left,
        .content_top_detail_right {
          width: 50%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          p {
            font-size: 0.32rem;
          }
          p:nth-child(2) {
            margin-top: 0.1rem;
            font-size: 0.24rem;
          }
        }
      }
    }
    .content_body {
      width: 100%;
      overflow-x: hidden;
      overflow-y: scroll;
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
          width: 7%;
        }
        .content_body_top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.2rem;
          font-size: 0.28rem;
          font-weight: 600;
          width: 100%;
          div {
            width: 3rem;
            img {
              width: 14%;
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
              width: 0.6rem;
              height: 0.6rem;
            }
            .content_body_bottom_right_detail {
              width: 96%;
              padding-left: 4%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              p {
                font-style: 0.26rem;
                color: #666666;
              }
              p:nth-child(2) {
                font-weight: 600;
                color: #333333;
                span {
                  font-size: 0.22rem;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
