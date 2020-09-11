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
      <vuu-pull
        ref="vuuPull"
        :options="pullOptions"
        v-on:loadTop="loadTop"
        v-on:loadBottom="loadBottom"
        :style="{ height: scrollerHeight }"
      >
        <!-- <van-empty description="暂无数据" v-else /> -->
        <div class="monitor_top">
          <div class="monitor_top_left" @click="goprivacy()">
            <div class="monitor_top_left_img">
              <img src="../../assets/images/xiyouji_income.png" alt="" />
            </div>
            <div class="monitor_status">
              {{ storage.income }}<span>gfm</span>
            </div>
            <p>西柚机收益</p>
          </div>
          <div class="monitor_top_right" @click="goUserAgreement()">
            <div class="monitor_top_right_img">
              <img src="../../assets/images/node_income.png" alt="" />
            </div>
            <div class="monitor_income">
              {{ storage.jifen }}<span>积分</span>
            </div>
            <p>节点收益</p>
          </div>
        </div>
        <div class="income_con_btn">
          <van-dropdown-menu>
            <van-dropdown-item
              v-model="value11"
              :options="option1"
              @change="changegrow"
            />
          </van-dropdown-menu>
          <van-tabs
            type="card"
            v-model="activeName"
            class="bandwidth"
            @change="up_down"
          >
            <van-tab title="西柚机收益" name="a">
              <div
                id="myChart_xiyou"
                style="width:96%; height:6rem;"
                v-show="echarts_data.length > 0"
              ></div>
              <div
                v-show="echarts_data.length <= 0"
                style="width:96%; height:6rem;margin: auto;padding-top:2rem;"
              >
                <img src="../../assets/images/nodata.png" alt="" />
                <p>
                  暂无数据
                </p>
              </div>
            </van-tab>
            <van-tab title="节点收益" name="b">
              <div
                id="myChart_node"
                style="width: 96%;height:6rem"
                v-show="echarts_data.length > 0"
              ></div>
              <div
                v-show="echarts_data.length <= 0"
                style="width:96%; height:6rem;margin: auto;padding-top:2rem;"
              >
                <img src="../../assets/images/nodata.png" alt="" />
                <p>
                  暂无数据
                </p>
              </div>
            </van-tab>
          </van-tabs>
        </div>
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
import { upodateTime } from "../../common/js/date";
import { Toast, Dialog } from "vant";
import echarts from "echarts";
export default {
  data() {
    return {
      active: 1,
      activeName: "a",
      all_income: 0,
      last_income: 0,
      weak_income: 0,
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
        bottomCloseElMove: false //关闭上拉加载
      },
      dev_income_list: [],
      user_dev_list: [],
      demo_minerInfo: [],
      conval_list: [],
      storage: {
        income: 0,
        jifen: 0
      },
      value11: 1,
      option1: [
        { text: "近一周", value: 0 },
        { text: "近一个月", value: 1 },
        { text: "近半年", value: 2 }
      ],
      echart_data_list_x: [],
      echart_data_list: [],
      echarts_data: []
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
        return window.innerHeight - 1.32 * (window.deviceWidth / 7.5) + "px";
      } else {
        return window.innerHeight - 1.32 * 50 + "px";
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
    this.get_all_income(29, 2);
    // this.$nextTick(function() {
    //   let linechartex1 = document.getElementById("myChart_xiyou");
    //   linechartex1.style.width = window.innerWidth + "px";
    //   this.drawLine();
    // });
  },
  methods: {
    ...mapMutations(["updateUser", "clearUser", "setdevsn", "setdevstatus"]),
    //下拉
    loadTop() {
      setTimeout(() => {
        this.get_all_income(90);
        this.get_all_income(29, 2);
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
        } else {
          this.$refs.vuuPull.closeLoadBottom();
        }
        if (this.$refs.vuuPull.closeLoadBottom) {
          this.$refs.vuuPull.closeLoadBottom();
        }
      }, 500);
    },
    changegrow() {
      let number = 7;
      if (this.value11 == 0) {
        number = 7;
      } else if (this.value11 == 1) {
        number = 30;
      } else if (this.value11 == 2) {
        number = 180;
      }
      if (this.activeName == "a") {
        this.get_all_income(number, 2);
      } else {
        this.drawLine("node");
      }
    },
    up_down(name, title) {
      if (title != "节点收益") {
        this.changegrow();
      } else {
        this.echarts_data = [];
        this.$nextTick(function() {
          let linechartex2 = document.getElementById("myChart_node");
          linechartex2.style.width =
            window.innerWidth - window.innerWidth * 0.06 + "px";
          echarts.init(linechartex2);
          this.drawLine("node");
        });
      }
    },
    goprivacy() {
      setTimeout(() => {
        this.$router.push({ path: "/xiyouji_income_list" });
      }, 200);
    },
    goUserAgreement() {
      setTimeout(() => {
        this.$router.push({ path: "/node_income_list" });
      }, 200);
    },
    //获取总收益
    get_all_income(num, type) {
      let params = new Object();
      let endtime = Date.parse(new Date()) / 1000; //获取当前日期时间戳(精确到秒)
      let endtimes = Date.parse(new Date().toLocaleDateString()) / 1000; //获取当前年月日时间戳（当天零点）
      let starttime = endtimes - num * 24 * 3600; //获取7天的时间戳
      let token = this.log_token;
      params.login_token = token;
      params.start_time = starttime;
      params.end_time = endtime;

      params.cur_page = 0;
      params.dev_sn = "";
      if (type) {
        params.query_type = 2;
      } else {
        params.query_type = 1;
      }
      getuserdevlist(params)
        .then(res => {
          if (res.status == 0) {
            if (type) {
              this.echarts_data = res.data.user_profit_list.reverse();
              // this.up_down();
            } else {
              this.storage.income = (res.data.user_total_profit / 100).toFixed(
                2
              );
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
          }
          this.$nextTick(function() {
            let linechartex1 = document.getElementById("myChart_xiyou");
            linechartex1.style.width =
              window.innerWidth - window.innerWidth * 0.06 + "px";
            echarts.init(linechartex1);
            this.drawLine();
          });
        })
        .catch(error => {});
    },
    onClickRight() {
      this.$router.push({
        // path: "/ranking"
        path: "/allranking"
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
    },
    //条形图
    drawLine(label) {
      let _this = this;
      var option = {
        color: ["#3980ff"],
        tooltip: {
          trigger: "axis"
        },
        grid: {
          top: 30,
          left: "2%",
          right: "5%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            splitNumber: 8,
            data: _this.echarts_data.map(function(item) {
              return upodateTime(item.date_stamp, "M");
            }),
            silent: false,
            splitLine: {
              show: false
            },
            splitArea: {
              show: false
            },
            axisTick: {
              //坐标轴刻度相关设置
              show: true, //是否显示坐标轴刻度。
              alignWithLabel: true, //类目轴中在 boundaryGap 为 true 的时候有效，可以保证刻度线和标签对齐
              inside: false, //坐标轴刻度是否朝内，默认朝外。
              length: 5 //坐标轴刻度的长度。
            },
            axisLabel: {
              margin: 2
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "##E5E5E5"
              }
            }
          }
        ],
        yAxis: {
          splitArea: {
            show: false
          },
          //取消坐标值
          axisLabel: {
            show: true
          },
          //取消刻度线
          axisTick: {
            show: false,
            lineStyle: { color: "##E2E6F5" }
          },
          //取消坐标轴
          axisLine: {
            show: true,
            lineStyle: {
              color: "##E5E5E5"
            }
          },
          splitLine: {
            //网格线
            lineStyle: {
              type: "dashed" //设置网格线类型 dotted：虚线   solid:实线
            },
            show: true //隐藏或显示
          }
        },
        series: [
          {
            type: "line",
            smooth: true, //这个是把线变成曲线
            // data: [15, 46, 15, 48, 16, 165, 1, 6, 34, 30],
            data: _this.echarts_data.map(function(item) {
              return (item.user_total_profit / 100).toFixed(2);
            }),

            large: true,
            // markLine: {
            //   symbol: "none",
            //   label: {
            //     position: "middle", //将警示值放在哪个位置，三个值“start”,"middle","end"  开始  中点 结束
            //     formatter: function(params) {
            //       return `${params.value}`;
            //     }
            //   },
            //   data: [{ type: "max", name: "最大值" }]
            // },
            areaStyle: {
              normal: {
                color: {
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: "#79A5FE" // 0% 处的颜色
                    },
                    {
                      offset: 0.7,
                      color: "#ffffff" // 100% 处的颜色
                    }
                  ],
                  globalCoord: false // 缺省为 false
                }
              }
            }
          }
        ]
      };
      if (label) {
        // 初始化echarts实例
        let myChart_xia = this.$echarts.init(
          document.getElementById("myChart_node")
        );
        //防止越界，重绘canvas
        window.onresize = myChart_xia.resize;
        myChart_xia.clear();
        myChart_xia.setOption(option); //设置option
      } else {
        // 初始化echarts实例
        let myChart_shang = this.$echarts.init(
          document.getElementById("myChart_xiyou")
        );
        //防止越界，重绘canvas
        window.onresize = myChart_shang.resize;
        myChart_shang.clear();
        myChart_shang.setOption(option); //设置option
      }
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
/deep/.van-popup {
  width: 94%;
  padding: 3%;
  overflow-y: scroll;
}
/deep/.van-dropdown-menu {
  width: 49%;
  justify-content: space-between;
  background-color: #ffffff;
  height: 0.88rem;
  z-index: 11;
}
/deep/.van-dropdown-menu__item {
  flex: none;
  width: 2.2rem;
  height: 0.6rem;
  border-radius: 1rem;
  background-color: #fff;
  margin: auto;
  border: 1px solid #eeeeee;
  margin-left: 4%;
}
/deep/.van-dropdown-item--down {
  top: 3.3rem !important;
}
/deep/.van-hairline--top-bottom::after,
.van-hairline-unset--top-bottom::after {
  border: none;
}
/deep/.van-tabs__nav--card {
  border: #cecece solid 0.01rem;
}
/deep/.van-tabs__nav--card .van-tab {
  border-right: #cecece solid 0.01rem;
}
/deep/.van-tabs__nav--card .van-tab.van-tab--active {
  height: 0.46rem;
  background: #3477fd;
  border-radius: 0.1rem;
  color: #ffffff;
}
/deep/.van-tab .van-ellipsis {
  border-radius: 0.1rem;
}
/deep/.van-tabs__nav--card .van-tab {
  color: #3477fd;
}
/deep/.bandwidth .van-tab {
  width: 1.5rem;
  font-size: 0.24rem;
}
/deep/.bandwidth .van-tabs__nav--card{
  border: none;
}
/deep/.bandwidth .van-tabs__wrap {
  // width: 75%;
  height: 0.6rem;
  line-height: 0.6rem;
  display: flex;
  justify-content: flex-end;
  position: absolute;
  right: 0.3rem;
  top: -0.7rem;
  font-size: 0.24rem;
  border: none;
}
/deep/.bandwidth .van-tabs__nav--card .van-tab.van-tab--active {
  height: 0.6rem;
  line-height: 0.6rem;
}
/deep/.bandwidth .van-ellipsis {
  height: 0.6rem;
  line-height: 0.6rem;
}
.pull-normal-top,
.pull-normal-bottom {
  color: #333333;
}
.income_overview {
  width: 100%;
  height: 100%;
  background-color: #fff;
  overflow: hidden;
  margin-top: 0.92rem;
  .titrights {
    margin-right: 0.2rem;
    color: #666666;
  }
  .content {
    color: #333333;
    font-size: 0.24rem;
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    // padding: 0 10%;
    background: #f8fafb;
    .monitor_top {
      background-color: #f8fafb;
      color: #ffffff;
      display: flex;
      align-items: center;
      margin: auto;
      padding-top: 0.2rem;
      text-align: left;
      margin-bottom: 0.2rem;
      justify-content: space-around;
      .monitor_top_left {
        background: #ffffff;
        width: 3.33rem;
        height: 3.16rem;
        color: black;
        background-size: 100% 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        box-sizing: border-box;
        padding: 0.4rem 0.3rem;
        border-radius: 0.2rem;
        margin-right: -0.2rem;
        .monitor_top_left_img {
          img {
            width: 0.8rem;
            height: 0.8rem;
          }
        }
        p {
          font-size: 0.24rem;
          color: #999999;
          width: 100%;
          margin-top: 0.1rem;
        }
        .monitor_status {
          font-size: 0.38rem;
          margin-top: 0.4rem;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
      .monitor_top_right {
        background: #ffffff;
        width: 3.33rem;
        height: 3.16rem;
        color: black;
        background-size: 100% 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        box-sizing: border-box;
        padding: 0.4rem 0.3rem;
        border-radius: 0.2rem;
        margin-left: -0.2rem;
        .monitor_top_right_img {
          img {
            width: 0.8rem;
            height: 0.8rem;
          }
        }
        p {
          font-size: 0.24rem;
          color: #999999;
          width: 100%;
          margin-top: 0.1rem;
        }
        .monitor_income {
          font-size: 0.38rem;
          margin-top: 0.4rem;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
    }
    .income_con_btn {
      background-color: #ffffff;
      width: 94%;
      height: 6.98rem;
      margin: auto;
      position: relative;
      z-index: 11;
      border-radius: 0.2rem;
    }
  }
}
</style>
