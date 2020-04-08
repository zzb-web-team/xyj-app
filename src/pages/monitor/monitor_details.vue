<template>
  <div class="monitor">
    <van-nav-bar :title="title" left-a rrow left-arrow:true :z-index="2000">
      <!-- <div slot="left">排行榜</div> -->
      <!-- <div slot="right" class="titright">
        <img src="../../assets/images/equ_nav_icon_mess.png" class="titimg" alt />
      </div>-->
      <!-- <van-icon name="comment" slot="right" size="0.46rem" color="#808080" /> -->
    </van-nav-bar>
    <div class="monitor_y">
      <div class="monitor_top">
        <div class="monitor_top_left" @click="go_management()">
          <p>{{storage.total}}</p>
          <p>设备</p>
          <div class="monitor_status">
            <span>在线：{{storage.online}}</span>
            <span>离线：{{storage.offline}}</span>
          </div>
        </div>
        <div class="monitor_top_right" @click="go_dev_calculation()">
          <p>{{storage.power}}</p>
          <p>平均算力</p>
          <div class="monitor_income">昨日收益：{{storage.income}}</div>
        </div>
      </div>
      <p class="monitor_title">检测图表</p>

      <div class="monitor_btn">
        <van-button type="default" @click="xiuxiuxiu1">
          {{value1}}
          <van-icon name="play" size="0.3rem" />
        </van-button>
        <van-button type="default" @click="xiuxiuxiu2">
          {{value2}}
          <van-icon name="play" size="0.3rem" />
        </van-button>
      </div>
      <div class="monitor_content">
        <van-action-sheet
          v-model="show1"
          :actions="actions1"
          cancel-text="取消"
          @select="onSelect1"
          @cancel="onCancel1"
        />
        <van-action-sheet
          v-model="show2"
          :actions="actions2"
          cancel-text="取消"
          @select="onSelect2"
          @cancel="onCancel2"
        />
        <!--  -->
        <van-tabs type="card" @click="switch_tabs">
          <!--  -->
          <van-tab title="存储" class="action_item">
            <p>存储信息</p>
            <div class="action_cunchu">
              <span>总存储</span>
              <span class="action_cunchu_con">{{cap.total}}GB</span>
            </div>
            <div class="action_cunchu">
              <span>占用空间</span>
              <span class="action_cunchu_con">{{cap.use}}GB</span>
            </div>
            <div class="action_cunchu">
              <span>剩余存储</span>
              <span class="action_cunchu_con">{{cap.free}}GB</span>
            </div>
            <p>在线信息</p>
            <div class="action_cunchu">
              <span>累计在线时长</span>
              <span class="action_cunchu_con">{{cap.online_time}}h</span>
            </div>
            <div class="action_cunchu">
              <span>离线次数</span>
              <span class="action_cunchu_con">{{cap.offline_times_num}}</span>
            </div>
          </van-tab>

          <!--  -->
          <van-tab title="网络" class="action_item">
            <p>上行带宽</p>
            <van-tabs type="card" class="bandwidth" @click="up_down">
              <van-tab title="上行">
                <div id="myChart_shang" style="width:100%; height:5rem;"></div>
              </van-tab>
              <van-tab title="下行">
                <div id="myChart_xia" style="width: 100%;height:5rem"></div>
              </van-tab>
            </van-tabs>
            <p>网络信息</p>
            <div class="action_cunchu">
              <span>上行带宽</span>
              <span class="action_cunchu_con">{{band.up_bandwidth}}Mbps</span>
            </div>
            <div class="action_cunchu">
              <span>下行带宽</span>
              <span class="action_cunchu_con">{{band.down_bandwidth}}Mbps</span>
            </div>
            <div class="action_cunchu">
              <span>占用带宽</span>
              <span class="action_cunchu_con">{{band.use_bandwidth}}Mbps</span>
            </div>
            <p>在线信息</p>
            <div class="action_cunchu">
              <span>累计在线时长</span>
              <span class="action_cunchu_con">{{band.online_time}}h</span>
            </div>
            <div class="action_cunchu">
              <span>离线次数</span>
              <span class="action_cunchu_con">{{band.offline_times_num}}</span>
            </div>
          </van-tab>
        </van-tabs>
      </div>
    </div>
    <foot v-model="active"></foot>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import foot from "../../components/foot";
import echarts from "echarts";
import {
  get_dev_cap_list,
  get_dev_bandwidth_list,
  get_user_average_cp,
  isbindinglist
} from "../../common/js/api";
import {
  TabbarItem,
  Toast,
  PullRefresh,
  Dialog,
  NavBar,
  ActionSheet
} from "vant";
export default {
  data() {
    return {
      tabname: 0,
      active: 1,
      title: "监控",
      show1: false,
      show2: false,
      storage: {
        total: 0,
        online: 0,
        offline: 0,
        power: 0,
        income: 0
      },
      cap: {
        total: 0,
        use: 0,
        free: 0,
        online_time: 0,
        offline_times_num: 0
      },
      band: {
        up_bandwidth: 0,
        down_bandwidth: 0,
        use_bandwidth: 0,
        online_time: 0,
        offline_times_num: 0
      },
      value1: "全部",
      value2: "今天",
      actions1: [{ name: "全部", value: 0 }],
      actions2: [
        { name: "昨天", value: 0 },
        { name: "今天", value: 1 },
        { name: "近一周", value: 2 }
      ],
      xdata: [],
      ydata: [],
      dev_sn: "",
      timetype: 1,
      bandtype: 0
    };
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
    if (this.$route.query.devsn) {
      this.value1 = this.$route.query.devname;
      this.dev_sn = this.$route.query.devsn;
    }
    this.get_cp();
    this.get_dev_cap();
    this.get_use_dev_list();
  },
  methods: {
    ...mapMutations(["updateUser", "clearUser", "setdevsn", "setdevstatus"]),
    //获取用户设备列表
    get_use_dev_list() {
      let params = new Object();
      params.login_token = this.log_token;
      isbindinglist(params)
        .then(res => {
          if (res.status == 0) {
            this.updateUser({ log_token: res.token_info.login_token });
            this.storage.total =
              res.data.online_cnt * 1 + res.data.offline_cnt * 1;
            this.storage.online = res.data.online_cnt;
            this.storage.offline = res.data.offline_cnt;
            res.data.bind_devinfo_list.forEach(item => {
              let devobj = new Object();
              devobj.name = item.dev_name;
              devobj.value = item.dev_sn;
              this.actions1.push(devobj);
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
          } else {
            Toast(res.err_msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取数据--监控（存储）
    get_dev_cap() {
      let params = new Object();
      params.login_token = this.log_token;
      params.dev_sn = this.dev_sn;
      params.time_type = this.timetype;
      get_dev_cap_list(params)
        .then(res => {
          if (res.status == 0) {
            this.updateUser({ log_token: res.data.token_info.token });
            if (res.err_code == 0) {
              this.cap.total = (res.data.total_cap / 1048576).toFixed(2);
              this.cap.free = (res.data.free_cap / 1048576).toFixed(2);
              this.cap.use = (
                res.data.total_cap / 1048576 -
                res.data.free_cap / 1048576
              ).toFixed(2);
              this.cap.online_time = (res.data.online_time / 3600).toFixed(2);
              this.cap.offline_times_num = res.data.offline_times;
            } else {
              Toast(res.err_msg);
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
        .catch(error => {
          console.log(error);
        });
    },
    //获取数据--监控（设备带宽）
    get_dev_bangwidth() {
      let params = new Object();
      params.login_token = this.log_token;
      params.dev_sn = this.dev_sn;
      params.time_type = this.timetype;
      params.bandwidth_type = this.bandtype;
      get_dev_bandwidth_list(params)
        .then(res => {
          if (res.status == 0) {
            this.updateUser({ log_token: res.data.token_info.token });
            if (res.err_code == 0) {
              this.band.online_time = (res.data.online_time / 3600).toFixed(2);
              this.band.offline_times_num = res.data.offline_times;
            } else {
              Toast(res.err_msg);
            }
          }else if (res.status == -17) {
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
        .catch(error => {
          console.log(error);
        });
    },
    //存储和网络显示切换
    switch_tabs(name, title) {
      this.tabname = name;
      if (name == 1) {
        this.get_dev_bangwidth();
        let linechartex1 = document.getElementById("myChart_shang");
        if (linechartex1) {
          linechartex1.style.width = window.innerWidth + "px";
          echarts.init(linechartex1);
          this.drawLine();
        } else {
          //Vue.nextTick()作用：在下次dom更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获得更新后的dom如果不使用this.$nextTick() 在切换tab的时候dom从无到有，该节点还没加载，不能获取，会报错
          this.$nextTick(() => {
            this.drawLine();
          });
        }
      } else {
        this.get_dev_cap();
      }
    },
    //上行下行带宽切换
    up_down(name, title) {
      if (title == "上行") {
        this.bandtype = 0;
        this.get_dev_bangwidth();
        this.drawLine();
      } else {
        this.bandtype = 1;
        this.get_dev_bangwidth();
        let linechartex2 = document.getElementById("myChart_xia");
        if (linechartex2) {
          linechartex2.style.width = window.innerWidth + "px";
          echarts.init(linechartex2);
          this.drawLine("down");
        } else {
          //Vue.nextTick()作用：在下次dom更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获得更新后的dom如果不使用this.$nextTick() 在切换tab的时候dom从无到有，该节点还没加载，不能获取，会报错
          this.$nextTick(() => {
            this.drawLine("down");
          });
        }
      }
    },
    //获取用户平均算力
    get_cp() {
      let params = new Object();
      params.login_token = this.log_token;
      get_user_average_cp(params)
        .then(res => {
          if (res.status == 0) {
            this.updateUser({ log_token: res.data.token_info.token });
            if (res.err_code == 0) {
              this.storage.power = res.data.average_cp;
              this.band.up_bandwidth = (
                res.data.up_bandwidth /
                1024 /
                1024
              ).toFixed(2);
              this.band.down_bandwidth = (
                res.data.down_bandwidth /
                1024 /
                1024
              ).toFixed(2);
            }
          }else if (res.status == -17) {
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
        .catch(error => {
          console.log(error);
        });
    },
    //下拉折叠菜单显示
    xiuxiuxiu1() {
      this.show1 = true;
    },
    xiuxiuxiu2() {
      this.show2 = true;
    },
    //取消
    onCancel1() {
      this.show1 = false;
      Toast("cancel");
    },
    onCancel2() {
      this.show2 = false;
      Toast("cancel");
    },
    //选择设备
    onSelect1(item) {
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      this.show1 = false;
      this.value1 = item.name;
      if (item.value == 0) {
        this.dev_sn = "";
      } else {
        this.dev_sn = item.value;
      }
      if (this.tabname == 0) {
        this.get_dev_cap();
      } else {
        this.get_dev_bangwidth();
      }
    },
    //选择时间
    onSelect2(item) {
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      this.show2 = false;
      this.value2 = item.name;
      this.timetype = item.value;
      if (this.tabname == 0) {
        this.get_dev_cap();
      } else {
        this.get_dev_bangwidth();
      }
    },
    //跳转页面
    go_management() {
      this.$router.push({ path: "/management" });
    },
    go_dev_calculation() {
      this.$router.push({
        path: "/dev_calculation",
        query: { suanli: this.storage.power }
      });
    },
    //条形图
    drawLine(label) {
      // 绘制图表
      // var option = {
      //   title: { text: "" },
      //   color: ["#3398D8"],
      //   // 提示框
      //   tooltip: {
      //     trigger: "axis", // 坐标触发
      //     axisPointer: {
      //       // 坐标轴指示器，坐标轴触发有效
      //       type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
      //     }
      //   },
      //   grid: {
      //     left: "3%",
      //     right: "4%",
      //     bottom: "3%",
      //     containLabel: true
      //   },
      //   xAxis: {
      //     type: "category",
      //     data: this.xdata,
      //     axisTick: {
      //       alignWithLabel: true
      //     }
      //   },
      //   yAxis: [
      //     {
      //       type: "value",
      //       splitLine: { show: false } //隐藏横线
      //     }
      //   ],
      //   series: [
      //     {
      //       radius: "65%",
      //       name: "带宽",
      //       type: "bar",
      //       barWidth: "40%", //柱图宽度
      //       center: ["50%", "50%"],
      //       data: this.ydata
      //     }
      //   ]
      // };
      var dataCount = 5e5;
      var data = generateData(dataCount);
      var option = {
        // title: {//头部的下载按钮
        //     text: echarts.format.addCommas(dataCount) + ' Data',
        //     left: 10
        // },
        // toolbox: {
        //   feature: {
        //     dataZoom: {
        //       yAxisIndex: false
        //     },
        //     saveAsImage: {
        //       pixelRatio: 2
        //     }
        //   }
        // },
        color: ["#3980ff"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          bottom: 90,
          left: "4%",
          right: "4%"
        },
        dataZoom: [
          {
            type: "inside"
          },
          {
            type: "slider",
            show: false
          }
        ],
        xAxis: {
          data: data.categoryData,
          silent: false,
          splitLine: {
            show: false
          },
          splitArea: {
            show: false
          }
        },
        yAxis: {
          splitArea: {
            show: false
          },
          //取消网格线
          splitLine: {
            show: false
          },
          //取消坐标值
          axisLabel: {
            show: false
          },
          //取消刻度线
          axisTick: {
            show: false
          },
          //取消坐标轴
          axisLine: {
            show: false
          }
        },
        series: [
          {
            type: "bar",
            data: data.valueData,
            // Set `large` for large data amount
            large: true,
            markLine: {
              symbol: "none",
              label: {
                position: "middle", //将警示值放在哪个位置，三个值“start”,"middle","end"  开始  中点 结束
                formatter: function(params) {
                  return `${params.value} Mb/s`;
                }
              },

              data: [{ type: "max", name: "最大值" }]
            }
          }
        ]
      };
      if (label) {
        // 初始化echarts实例
        let myChart_xia = this.$echarts.init(
          document.getElementById("myChart_xia")
        );
        //防止越界，重绘canvas
        window.onresize = myChart_xia.resize;
        myChart_xia.setOption(option); //设置option
      } else {
        // 初始化echarts实例
        let myChart_shang = this.$echarts.init(
          document.getElementById("myChart_shang")
        );
        //防止越界，重绘canvas
        window.onresize = myChart_shang.resize;
        myChart_shang.setOption(option); //设置option
      }

      function generateData(count) {
        var baseValue = Math.random() * 1000;
        var time = +new Date(2011, 0, 1);
        var smallBaseValue;

        function next(idx) {
          smallBaseValue =
            idx % 30 === 0
              ? Math.random() * 700
              : smallBaseValue + Math.random() * 500 - 250;
          baseValue += Math.random() * 20 - 10;
          return Math.max(0, Math.round(baseValue + smallBaseValue) + 3000);
        }

        var categoryData = [];
        var valueData = [];

        for (var i = 0; i < count; i++) {
          categoryData.push(
            echarts.format.formatTime("yyyy-MM-dd\nhh:mm:ss", time)
          );
          valueData.push(next(i).toFixed(2));
          time += 1000;
        }

        return {
          categoryData: categoryData,
          valueData: valueData
        };
      }
    }
  },
  components: {
    foot
  }
};
</script>

<style lang="less" scoped>
/deep/.van-nav-bar {
  color: #000;
  background: #ffffff;
}
/deep/.van-dropdown-menu {
  width: 50%;
}
/deep/.van-tabs__nav {
  background: #fff;
}
/deep/.van-tabs__wrap {
  width: 30%;
  display: flex;
  justify-content: flex-end;
  position: absolute;
  right: 0.3rem;
  top: -0.75rem;
}
/deep/.van-popup {
  width: 94%;
  padding: 3%;
  overflow-y: scroll;
}
/deep/.van-button .van-icon {
  transform: rotate(90deg);
}
/deep/.van-button {
  width: 1.68rem;
  height: 0.56rem;
  background: #ffffff;
  border-radius: 0.1rem;
  font-size: 0.28rem;
  border: none;
  margin: 0.3rem 0.3rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/deep/.van-tabs__nav--card {
  border: none;
}
/deep/.van-tabs__nav--card .van-tab {
  border-right: none;
}

/deep/.van-tabs__nav--card .van-tab.van-tab--active {
  width: 1.14rem;
  height: 0.56rem;
  background: #ff6d6e;
  border-radius: 0.1rem;
  color: #ffffff;
}
/deep/.van-tab .van-ellipsis {
  border-radius: 0.1rem;
}
/deep/.van-tabs__nav--card .van-tab {
  color: #ff6d6e;
}
/deep/.bandwidth .van-tabs__wrap {
  width: 30%;
  height: 0.4rem;
  line-height: 0.4rem;
  display: flex;
  justify-content: flex-end;
  position: absolute;
  right: 0.3rem;
  top: -0.4rem;
  font-size: 0.24rem;
}
/deep/.bandwidth .van-tabs__nav--card .van-tab.van-tab--active {
  height: 0.4rem;
  line-height: 0.4rem;
}
/deep/.bandwidth .van-ellipsis {
  height: 0.4rem;
  line-height: 0.4rem;
}
.monitor {
  width: 100%;
  height: 100%;
  background-color: #f8fafb;
  .monitor_y {
    height: 667px;
    overflow-y: scroll;
  }
  .monitor_top {
    background-color: #fff;
    color: #ffffff;
    display: flex;
    align-items: center;
    margin: auto;
    padding-top: 0.2rem;
    text-align: left;
    .monitor_top_left {
      width: 47.5%;
      margin-left: 4%;
      margin-right: 1%;
      padding: 0 4%;
      height: 1.84rem;
      background: #ffffff url(../../assets/images/shebeibg.png) no-repeat;
      background-size: 100% 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      p {
        font-size: 0.48rem;
        width: 100%;
        margin-top: 0.1rem;
      }
      p:nth-child(2) {
        font-size: 0.24rem;
        margin-top: 0rem;
      }
      .monitor_status {
        width: 100%;
        font-size: 0.24rem;
        margin-top: 0.2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
    .monitor_top_right {
      width: 47.5%;
      margin-left: 1%;
      margin-right: 4%;
      padding: 0 4%;
      height: 1.84rem;
      background: url(../../assets/images/suanlibg.png) no-repeat;
      background-size: 100% 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      p {
        font-size: 0.48rem;
        width: 100%;
        margin-top: 0.1rem;
      }
      p:nth-child(2) {
        font-size: 0.24rem;
        margin-top: 0rem;
      }
      .monitor_income {
        font-size: 0.24rem;
        margin-top: 0.2rem;
      }
    }
  }
  .monitor_title {
    width: 96%;
    background-color: #fff;
    color: #333333;
    font-size: 0.32rem;
    text-align: left;
    padding-left: 4%;
    display: inline-block;
    height: 0.89rem;
    line-height: 0.89rem;
  }
  .monitor_btn {
    display: flex;
  }
  .monitor_content {
    width: 100%;
    height: auto;
    float: left;
    position: relative;
    .action_item {
      text-align: left;
      width: 100%;
      margin: auto;
      margin-top: 0.2rem;
      margin-bottom: 1rem;
      color: #666666;
      font-size: 0.24rem;
      p {
        margin-left: 4%;
        margin-right: 4%;
      }
      .action_cunchu {
        background: #ffffff;
        width: 92%;
        height: 0.88rem;
        margin: auto;
        padding: 0 4%;
        margin-top: 0.1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .action_cunchu_con {
          max-width: 3rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>