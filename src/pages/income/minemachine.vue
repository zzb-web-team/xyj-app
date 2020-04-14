<template>
  <div class="container">
    <navBar :right-text="title"></navBar>
    <!-- <div
      style="width:100%;height:0.8rem;position: fixed;top: 0;z-index: 0;background: linear-gradient(45deg, #745af3 10%, #5c74f3 100%);"
    ></div>-->
    <!-- <scroller ref="myscroller" @scroll="mea"> -->
    <div class="xiala">
      <Scroll ref="myscroller" :autoUpdate="true" :listenScroll="true" @pullingDown="onRefresh">
        <!-- 网络异常 -->
        <div class="refresh" v-show="refresh">
          <div
            style="width:100%;height:46px;position: fixed;top: 0;z-index: 0;background: linear-gradient(45deg, #745af3 10%, #5c74f3 100%);"
          ></div>
          <div style="width:100%">
            <div class="norefresh">
              <img src="../../assets/images/unusual_inset.png" alt />
              <p>网络异常，下拉刷新</p>
            </div>
          </div>
        </div>
        <div class="my_income" v-show="!refresh">
          <div class="my_income_t">
            <div class="income_t">
              <div class="income_t_item income_t_btn">
                <p class="item_t_title">账户积分</p>
                <div class="item_t_right" @click="recording()" v-fb="{cls:'my_touchfeedback'}">
                  <p>
                    <img src="../../assets/images/hone_icon_convert.png" />
                  </p>
                  <P>兑换记录</P>
                </div>
              </div>

              <div class="income_t_item item_active_p">
                <p class="item_p_center">{{(listInfoyu/1000000).toFixed(6)}}</p>
                <!-- <span class="item_p_title">POC</span> -->
              </div>
              <!-- <div class="income_t_item">可兑换 {{(listInfoText).toFixed(2)}} EUSD</div> -->
            </div>
            <div class="income_t_item income_t_item_active">
              <van-button
                class="income_t_btn"
                @click="goTomoney()"
                v-fb="{cls:'my_touchfeedback'}"
              >兑换</van-button>
            </div>
          </div>

          <div class="income_b_tab">
            <div class="tab_item" @click="goBill()" v-fb="{cls:'my_touchfeedback'}">
              <div>
                <img src="../../assets/images/home_icon_detail.png" />
              </div>
              <span>收益明细</span>
            </div>
            <div class="tab_item" @click="goRanking()" v-fb="{cls:'my_touchfeedback'}">
              <div>
                <img src="../../assets/images/home_icon_ranking.png" />
              </div>
              <span>收益排名</span>
            </div>
          </div>
          <div class="income_b">
            <div class="income_b_title">
              <!-- <img src="../../assets/images/home_icon_notice.png" alt /> -->
              截止{{mynewtime}}日累计收益：
              <span>{{(listInfoText/1000000).toFixed(6)}}</span>
            </div>
            <div class="nointerval" v-show="noint">
              <img src="../../assets/images/home_illustration1.png" alt />
              <p>近期暂无收益，快去绑定设备吧</p>
            </div>
            <div class="income_b_echars" v-show="!noint">
              <div id="sum_earnings" style="width:100%; height:5rem;"></div>
            </div>
          </div>
        </div>
      </Scroll>
    </div>

    <!-- </scroller> -->
    <tabbar v-model="active"></tabbar>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from "vuex";
import navBar from "../../components/barBarActive";
import { Tabbar, TabbarItem, Toast, PullRefresh, Dialog } from "vant";
import echarts from "echarts";
import {
  alldevrevenue,
  getuserdevlist,
  authorization
} from "../../common/js/api.js";
import tabbar from "../../components/foot";
import { formatTime } from "../../common/js/date.js";
import { isError, debug } from "util";
import { err } from "../../common/js/status";
import { setTimeout } from "timers";

export default {
  data() {
    return {
      repeats: 0, //防止重复点击
      rescount: 0, //请求计数
      title: "我的收益",
      active: 3,
      noint: false,
      isLoading: false,
      refresh: false,
      mytime: "",
      devlist: "",
      control: 0,
      system: "", //系统
      mynewtime: "", //当前年月日
      isFirstEnter: true,
      sum_earnings: null,
      listInfoyu: 0,
      listInfoText: 0,
      listInfoNum: [], //y轴的数据
      arre: [],
      listInfoTim: [], //x轴的数据
      arres: [],
      a: []
    };
  },
  computed: mapState({
    log_token: state => state.user.log_token,
    phone_number: state => state.user.phone_number,
    user_name: state => state.user.user_name,
    user_sex: state => state.user.user_sex,
    charge_psd: state => state.user.charge_psd
    //savelistInfoText: state => state.management.savelistInfoText,
  }),
  // watch:mapGetters([
  //   'listInfoText'
  // ]),

  watch: {
    listInfoText(val, newval) {},
    deep: true
  },
  created() {
    this.isFirstEnter = true;
  },

  mounted: function() {
    try {
      window.android.setStatusBarAndNavigationBarColor("", "#ffffff");
    } catch (e) {}
    try {
      window.webkit.messageHandlers.setStatusBarAndNavigationBarColor.postMessage(
        "#745af3,#5e73f3"
      );
    } catch (error) {}
    this.whatBrowser();
    this.getallpoc(0);
    // if (this.listInfoTim.length <= 0) {
    //   this.noint = true;
    // } else {
    //   this.noint = false;
    // }
  },
  methods: {
    ...mapMutations(["updateUser", "clearUser"]),
    mea(pos) {
      if (pos) {
        // console.log(pos.y);
      }
    },
    //获取总受益
    getallpoc(key) {
      if (this.$parent.onLine == false) {
        Toast("无法连接网络，请检查网络状态");
      } else {
        if (!sessionStorage.querynum && key != 1) {
          this.$loading.show("加载中...");
        }
        if (this.repeats == 1) {
          return false;
        }
        this.repeats = 1;
        if (this.rescount >= 3) {
          this.repeats = 0;
          this.rescount = 0;
          this.$loading.hide();
          this.refresh = true;
          Toast(`请求超时，请稍后重试`);
          return false;
        }
        // this.listInfoText = 0;
        this.mynewtime = new Date().toLocaleDateString(); //获取的现在的年月日
        let param = new Object();
        let querydate = 90;
        let endtime = Date.parse(new Date()) / 1000; //获取当前日期时间戳(精确到秒)
        let endtimes = Date.parse(new Date().toLocaleDateString()) / 1000; //获取当前年月日时间戳（当天零点）
        let starttime = endtimes - querydate * 24 * 3600; //获取*天的时间戳
        let token = this.log_token;

        param.login_token = token;
        param.start_time = starttime;
        param.end_time = endtimes;
        param.query_type = 1;
        getuserdevlist(param) //获取总收益
          .then(res => {
            if (res) {
              this.$loading.hide();
            }
            this.repeats = 0;
            // this.mytime = res.dev_profit_list[0].date_stamp;
            if (res.status == 0) {
              this.getalldevrevenue(key);
              if (res.err_code == 0) {
                this.rescount = 0;
                this.refresh = false;
                this.listInfoText = res.data.user_total_profit;
                this.listInfoyu = res.data.user_total_profitex;
                // this.$store.dispatch('savelistInfoText',res.data.user_total_profit)
              } else {
                const sta = err[res.err_code]
                  ? this.$t(err[res.err_code])
                  : `请稍后重试 ${res.err_code}`;
                this.$toast(sta);
              }
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
            } else if (res.status == -999) {
              this.rescount = 0;
              Toast("登录已过期，请重新登录");
              this.clearUser();
              setTimeout(() => {
                this.$router.push({ path: "/login" });
              }, 1000);
            } else if (res.status == -900) {
              this.$router.push({ path: "/login" });
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
            } else if (res.status == -5) {
              this.rescount++;
              this.getallpoc();
            } else {
              const tip = this.$backStatusMap[res.status] || err[res.status];
              const str = tip ? this.$t(tip) : `请稍后重试 ${res.status}`;
              this.$toast(str);
            }
          })
          .catch(error => {
            this.repeats = 0;
            this.rescount++;
            this.getallpoc();
            // Toast("网络错误，请重新请求");
          });
      }
    },
    //获取折线图
    getalldevrevenue(key) {
      this.arres = [];
      this.listInfoTim = [];
      //正常日期
      // let Polyline = Date.parse(new Date().toLocaleDateString()) / 1000; //获取当前年月日时间戳（当天零点）
      // for (let i = 1; i <= 7; i++) {
      //   this.arres.push(Polyline - 24 * 3600 * i);
      // }
      // console.log(this.arres);
      // for (let i = 0; i < this.arres.length; i++) {
      //   //时间戳转日期格式
      //   this.listInfoTim.push(this.timestampToTime(this.arres[i]));
      // }
      if (this.$parent.onLine == false) {
        Toast("无法连接网络，请检查网络状态");
      } else {
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
        this.control = 0;
        this.a = [];
        this.listInfoNum = []; //y轴的数据
        this.arre = []; //x轴的数据
        this.mynewtime = new Date().toLocaleDateString(); //获取的现在的年月日
        let params = new Object();
        let querydate = 90;
        let endtime = Date.parse(new Date()) / 1000; //获取当前日期时间戳(精确到秒)
        let endtimes = Date.parse(new Date().toLocaleDateString()) / 1000; //获取当前年月日时间戳（当天零点）
        let starttime = endtimes - querydate * 24 * 3600; //获取7天的时间戳
        let token = this.log_token;
        params.login_token = token;
        params.start_time = starttime;
        params.end_time = endtimes;
        params.query_type = 2;
        params.cur_page = 0;
        getuserdevlist(params) //获取7天总收益明细
          .then(res => {
            if (res != -5) {
              this.$loading.hide();
            }
            this.repeats = 0;
            // this.mytime = res.dev_profit_list[0].date_stamp;
            if (res.status == 0) {
              this.updateUser({
                log_token: res.data.token_info.token
              });
              this.refresh = false;
              if (res.err_code == 0) {
                this.rescount = 0;
                if (res.data.user_profit_list.length <= 0) {
                  this.noint = true;
                }
                //虚拟日期
                for (let i = 0; i < 7; i++) {
                  this.a.push(
                    res.data.user_profit_list[0].date_stamp - i * 86400
                  );
                }
                for (let i = 0; i < this.a.length; i++) {
                  //时间戳转日期格式
                  this.listInfoTim.push(this.timestampToTime(this.a[i]));
                }

                for (let j = 0; j < this.a.length; j++) {
                  // this.arre.push(res.data.user_profit_list[j].date_stamp); //x轴数据
                  if (!res.data.user_profit_list[j]) {
                    this.control++;
                    this.listInfoNum.push("0");
                  } else if (
                    res.data.user_profit_list[j].date_stamp * 1 <= this.a[j] &&
                    res.data.user_profit_list[j].date_stamp * 1 >=
                      this.a[j] - 86400
                  ) {
                    this.listInfoNum.push(
                      (
                        res.data.user_profit_list[j].user_total_profit / 10000
                      ).toFixed(6)
                    ); //y轴数据

                    if (
                      res.data.user_profit_list[j].user_total_profit * 1 ==
                      0
                    ) {
                      this.control++;
                    }
                  }

                  // if (
                  //   res.data.user_profit_list[j].date_stamp > this.arres[j] &&
                  //   res.data.user_profit_list[j].date_stamp <
                  //     this.arres[j] + 86400
                  // ) {
                  //   this.listInfoNum.push(
                  //     (
                  //       res.data.user_profit_list[j].user_total_profit / 10000
                  //     ).toFixed(4)
                  //   ); //y轴数据
                  // } else {
                  //   this.listInfoNum.push("0");
                  // }
                }
                if (this.control == 7) {
                  this.noint = true;
                }

                // let arres = this.arre.reverse();
              } else {
                this.rescount = 0;
                const sta = err[res.err_code]
                  ? this.$t(err[res.err_code])
                  : `请稍后重试 ${res.err_code}`;
                this.$toast(sta);
              }
            } else if (res.status == -999) {
              this.rescount = 0;
              Toast("登录已过期，请重新登录");
              this.clearUser();
              setTimeout(() => {
                this.$router.push({ path: "/login" });
              }, 1000);
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
              this.noint = true;
            } else if (res.status == -900) {
              this.rescount = 0;
              this.$router.push({ path: "/login" });
            } else if (res.status == -5) {
              this.rescount++;
              getuserdevlist(params);
              this.getalldevrevenue(0);
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
            getuserdevlist(params);
            // Toast("网络错误，请重新请求");
          });
      }

      //折线图
      let sum_earnings = this.$echarts.init(
        document.getElementById("sum_earnings")
      );
      setTimeout(() => {
        this.drawLine(sum_earnings);
      }, 500);
    },
    //时间戳转时间
    timestampToTime: function(num) {
      let dates = new Date(num * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = dates.getFullYear() + "-";
      let M =
        (dates.getMonth() + 1 < 10
          ? "0" + (dates.getMonth() + 1)
          : dates.getMonth() + 1) + "-";
      let D = dates.getDate() + " ";
      let h = dates.getHours() + ":";
      let m = dates.getMinutes() + ":";
      let s = dates.getSeconds();
      return M + D; //时分秒可以根据自己的需求加上
    },
    //跳转授权
    // authorization() {
    //   window.location.href =
    //     "otcwallet://oauth?client_id=315189351447400448&redirect_uri=http://www.baidu.com& response_type=code& scope=all&state=8888";
    // },
    //下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.getalldevrevenue(1);
        this.getallpoc(1);
        // this.isLoading = false;
        this.$forceUpdate(); //强制刷新
      }, 500);
    },
    //提现
    goTomoney() {
      sessionStorage.setItem(
        "money",
        JSON.stringify(this.listInfoyu.toFixed(0))
      );
      if (this.listInfoText <= 0) {
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
    //ios获取权限
    Authorization: function(url) {
      window.goTomoney = this.goTomoney; //绑定在window全局变量上，不加括号
      try {
        window.webkit.messageHandlers.openWebView.postMessage(url);
      } catch (e) {}
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
    //提币记录
    recording() {
      setTimeout(() => {
        this.$router.push({ path: "/recording" });
      }, 200);
    },
    //收益明细
    goBill() {
      setTimeout(() => {
        this.$router.push({ path: "/bill" });
      }, 200);
    },
    //收益排名
    goRanking() {
      setTimeout(() => {
        this.$router.push({ path: "/ranking" });
      }, 200);
    },

    drawLine: function(name) {
      // 绘制图表
      name.setOption({
        // 提示框
        tooltip: {
          trigger: "axis" // 坐标触发
        },
        // 图形在画布的距离
        grid: {
          top: 30,
          left: "2%",
          right: "5%",
          bottom: "3%",
          containLabel: true
        },
        // x轴的数据
        xAxis: {
          type: "category",
          boundaryGap: false,
          axisPointer: {
            value: this.listInfoTim[0],
            handle: {
              show: true,
              color: "yellow"
            }
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: ["#888FA9"],
              width: 1,
              type: "solid"
            }
          },

          axisLine: {
            lineStyle: {
              color: "#888FA9"
            }
          },
          axisLabel: {
            interval: 0,
            rotate: 0
          },
          // data: ["09-01", "09-02", "09-03", "09-04", "09-05", "09-06", "09-07"]
          data: this.listInfoTim.reverse()
        },
        // y轴的数据
        yAxis: {
          type: "value",

          splitLine: {
            show: false,
            lineStyle: {
              color: ["#red"],
              width: 1,
              type: "solid"
            }
          },
          axisLine: {
            lineStyle: {
              color: "#888FA9"
            }
          }
        },
        // 折线图 （写几条折线图就写几个对象；是这个{}对象）
        series: [
          {
            name: "收益明细",
            type: "line",
            stack: "总量",
            smooth: true,
            // data: [12, 13, 10, 13, 9, 23, 21],
            data: this.listInfoNum.reverse(),
            color: "#56376D",
            symbol: "circle", // 拐点类型
            symbolSize: 0, // 拐点圆的大小
            itemStyle: {
              normal: {
                color: "#FA9F47", // 折线条的颜色
                borderColor: "#289df5", // 拐点边框颜色
                areaStyle: {
                  type: "default",
                  opacity: 0
                }
              }
            }
          }
        ]
      });
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // vm.listInfoText = parseFloat(sessionStorage.num);
      vm.listInfoText = JSON.parse(sessionStorage.getItem("querynum"));
      vm.listInfoyu = (
        (JSON.parse(sessionStorage.getItem("queryyu")) * 1) /
        1000000
      ).toFixed(6);
      vm.listInfoTim = JSON.parse(sessionStorage.getItem("queryxlist"));
      vm.listInfoNum = JSON.parse(sessionStorage.getItem("queryylist")) * 1;
      if (!sessionStorage.getItem("querynum")) {
        vm.listInfoText = 0;
      }
      if (!sessionStorage.getItem("queryyu")) {
        vm.listInfoyu = 0;
      }
      if (!sessionStorage.getItem("queryxlist")) {
        vm.listInfoTim = 0;
      }
      if (!sessionStorage.getItem("queryylist")) {
        vm.listInfoNum = 0;
      }
    });
    // if (
    //   from.name == "usercenter" ||
    //   !sessionStorage.askPositon ||
    //   sessionStorage.askPositon == "NaN"
    // ) {
    //   console.log("刷新页面");
    //   sessionStorage.askPositon = "";
    //   next(vm => {
    //     vm.getallpoc(0);
    //   });
    // } else {
    //   console.log("读取位置并跳转");
    //   next(vm => {
    //     if (vm && vm.$refs.myscroller) {
    //       //通过vm实例访问this
    //       setTimeout(function() {
    //         console.log("po", sessionStorage.askPositon);
    //         try {
    //           setTimeout(() => {
    //             vm.$refs.myscroller.scrollTo(
    //               0,
    //               sessionStorage.askPositon,
    //               false
    //             );
    //           }, 10);
    //         } catch (error) {
    //           setTimeout(() => {
    //             window.scrollTo(0, sessionStorage.askPositon, false);
    //           }, 10);
    //         }
    //       }, 0); //同步转异步操作
    //     }
    //   });
    // }
  },
  beforeRouteLeave(to, from, next) {
    //记录离开时的位置

    sessionStorage.setItem("queryyu", JSON.stringify(this.listInfoyu));
    sessionStorage.setItem("querynum", JSON.stringify(this.listInfoText));

    sessionStorage.setItem("queryxlist", JSON.stringify(this.listInfoTim));
    sessionStorage.setItem("queryylist", JSON.stringify(this.listInfoNum));
    next();
  },

  components: {
    navBar: navBar,
    tabbar: tabbar
  }
};
</script>


<style lang="less" scoped >
.van-nav-bar[data-v-7af07bb2] {
  background: none;
  z-index: 100;
}
.van-nav-bar {
  background: none !important;
}
.container {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  overflow: hidden;
  // background: #f2f2f2;
  background: url(../../assets/images/bgc33.png) #f2f2f2 no-repeat 0 0;
  background-size: 100%;
  .xiala {
    height: 100%;
    z-index: -1;
    .refresh {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      z-index: 2001;
      .norefresh {
        width: 100%;
        height: 100%;
        background: #f2f2f2;
      }
      img {
        margin-top: 3.5rem;
        width: 50%;
      }
    }
  }
  .container_introduction {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    overflow: hidden;
    background: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .introduction_text {
      font-size: 0.4rem;
      color: #cccccc;
      margin-top: 2.5rem;
    }
    .introduction_start {
      font-size: 0.4rem;
      color: #ffffff;
      width: 5.6rem;
      margin: 0 auto;
      height: 0.9rem;
      background: #cccccc;
      margin-top: 4.5rem;
      border-radius: 0.6rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
.my_income {
  width: 100%;
  height: auto;
  overflow: hidden;
  .my_income_t {
    width: 100%;
    // background: linear-gradient(
    //   0deg,
    //   rgba(203, 197, 255, 1) 0%,
    //   rgba(122, 98, 249, 1) 100%
    // );
    background: url(../../assets/images/bgc3.png) no-repeat 0 0;
    background-size: 100% 100%;
    height: 4.1rem;
    // margin-top: 0.7rem;
    padding-top: 0.7rem;
    // box-shadow: 0 3px 3px #cacecd;
    .income_t {
      height: auto;
      overflow: hidden;
      // background: url(../../assets/images/bg1.png) no-repeat 0 0;
      background-size: 100% 100%;
      width: 90%;
      height: 2.28rem;
      border-radius: 0.12rem;
      margin: auto;
      // box-shadow: 0 0 10px #f5b3c8;
      .income_t_item {
        font-size: 0.24rem;
        color: #f9c943;
        overflow: hidden;
        text-align: left;
        margin-left: 0.4rem;
        &.income_t_btn {
          text-align: right;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 0.3rem;
          height: 0.6rem;
          line-height: 0.6rem;
          margin-right: 0.4rem;
          .item_t_title {
            color: white;
            font-size: 0.28rem;
          }
          .item_t_right {
            position: absolute;
            right: 0;
            width: 1.65rem;
            height: 0.51rem;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 1rem 0 0 1rem;
            background-color: #e7ebff;
          }
          p {
            font-size: 0.22rem;
            color: #575ee7;
          }
          img {
            width: 0.4rem;
            height: 0.4rem;
            margin-top: 0.2rem;
          }
        }
        &.item_active_p {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-left: 0.4rem;
          .item_p_title {
            color: #f9c943;
          }
        }
        p {
          font-size: 0.68rem;
          color: #ffffff;
          overflow: hidden;
          &.item_p_title {
            font-size: 0.24rem;
            color: #f9c943;
            margin-left: 0.1rem;
          }
          &.item_p_center {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            margin-left: -0.4rem;
            // border-bottom: 0.04rem solid #43bff9;
          }
        }

        &.income_t_img {
          height: 1.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
  .income_b_title {
    width: 100%;
    height: 0.82rem;
    font-size: 0.22rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    margin: 0 auto;
    color: #808080;
    overflow: hidden;
    background-color: #fff;
    padding-left: 0.2rem;
    font-weight: 600;
    // margin-top: 0.1rem;
    img {
      width: 7%;
    }
    span {
      display: inline-block;
      width: 27%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #fa9e45;
      text-align: left;
    }
  }
  .income_b_tab {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 1.04rem;
    margin: 0 auto;
    background: #ffffff;
    border-bottom: 0.01rem solid #f3f3f3;
    // margin-bottom: 0.1rem;
    .tab_item {
      width: 50%;
      color: #6b6d7f;
      height: 1.03rem;
      background: #ffffff;
      font-size: 0.3rem;
      display: flex;
      justify-content: center;
      align-items: center;
      div {
        width: 0.48rem;
        height: 0.48rem;
        background: #fff0e1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.26rem;
        margin-right: 0.1rem;
        border-radius: 50%;
        img {
          width: 100%;
        }
      }
      &:nth-child(1) {
        border-right: 0.01rem solid #f3f3f3;
      }
    }
  }
  .income_b {
    width: 100%;
    height: auto;
    overflow: hidden;
    background: #f2f2f2;
    // margin-top: 0.2rem;
    padding-bottom: 1.3rem;
    .nointerval {
      // margin-top: 0.2rem;
      width: 100%;
      height: 5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: #fff;
      img {
        width: 1.4rem;
        height: 2.4rem;
        margin-top: 0.8rem;
      }
      p {
        margin-top: 0.4rem;
        color: #808080;
        font-size: 0.22rem;
      }
    }

    .income_b_echars {
      width: 100%;
      height: auto;
      overflow: hidden;
      margin: 0 auto;
      background-color: #fff;
    }
  }
}
&.income_t_item_active {
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  width: 100%;
  height: 0.88rem;
  // background: #43bff9;
  // border-radius: 0.12rem;
  // margin-top: -0.5rem;
  .income_t_btn {
    color: #ffffff;
    font-size: 0.3rem;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    width: 2.8rem;
    height: 0.7rem;
    border-radius: 1rem;
    background: #959eff;
    border: none;
    .item_p_title {
      float: left;
    }
  }
}
.van-button {
  line-height: 0px;
}
</style>
