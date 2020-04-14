<template>
  <div class="container">
    <navBar :title="title" :right-text="title">
      <van-icon name="search" slot="right" />
    </navBar>
    <div class="xiala" @refresh="onRefresh">
      <!-- <Scroll ref="myscroller" :autoUpdate="true" :listenScroll="true" @pullingDown="onRefresh"> -->
      <!-- 网络异常 -->
      <div class="refresh" v-show="refresh">
        <div style="background: #f2f2f2">
          <img src="../../assets/images/unusual_inset.png" alt />
          <p>网络异常，下拉刷新</p>
        </div>
      </div>
      <!-- 主体类容 -->
      <!-- 头部 -->
      <div class="ranking_con" v-show="!refresh">
        <div class="ranking_con_item">
          <div class="con_item_l">
            <div class="con_item_r">
              <div class="item_r_btn">{{ mytime | formatDate }}收益</div>
            </div>
            <div class="item_l_name">
              <p class="item_p1">+{{ (moneyNum / 1000000).toFixed(6) }}</p>
              <!-- <span>POC</span> -->
            </div>
          </div>
        </div>
        <!-- 列表 -->
        <div class="div_show">
          <div
            class="show_text_con"
            v-for="(item, index) in allListdetails"
            v-bind:key="index"
          >
            <div class="show_text_top">
              <div class="show_text_top_left">{{ item.dev_name }}</div>
              <div class="show_text_top_right">
                时长{{ (item.online_time / 3600).toFixed(2) }}h
              </div>
            </div>
            <div class="show_text_content">
              <div>
                <p class="content_top">
                  <b>{{ (item.dev_profit / 1000000).toFixed(6) | aa }}</b>
                  <span>积分</span>
                </p>
                <p>收益</p>
              </div>
              <div class="intermediate">
                <p class="content_top">
                  <b>{{ (item.total_cap / 1024 / 1024 / 1024).toFixed(2) }}</b>
                  <span>Gb</span>
                </p>
                <p>空间</p>
              </div>
              <div>
                <p class="content_top">
                  <b>{{
                    ((item.store_ability * 1) / 1000000).toFixed(6) | aa
                  }}</b>
                  <span>S/d</span>
                </p>
                <p>存储力</p>
              </div>
            </div>
            <div class="show_text_foot">
              <div>
                上行带宽：
                <span
                  >{{ (item.up_bandwidth / 1024 / 1024).toFixed(2) }}Mb/s</span
                >
              </div>
              <div>
                下行带宽：
                <span
                  >{{
                    (item.down_bandwidth / 1024 / 1024).toFixed(2)
                  }}Mb/s</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- </Scroll> -->
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import navBar from "../../components/navBar";
import { Tabbar, TabbarItem, Toast, Dialog } from "vant";
import {
  alldevinformation,
  getdevhistoricalname,
  alldevrevenue
} from "../../common/js/api.js";
import { formatDate } from "../../common/js/date.js";
import { error, debug } from "util";
import { err } from "../../common/js/status";

export default {
  data() {
    return {
      repeats: 0, //防止重复点击
      rescount: 0, //请求计数
      title: "收益明细",
      isLoading: false, //控制上拉加载的加载动画
      refresh: false,
      moneyNum: "", //单日总收益
      mytime: "", //时间
      dev_name: "", //设备名称
      miningArr: [],
      alllist: [],
      devhistoricalname: [], //历史设备名称
      absa: [],
      otey: [],
      absx: [],
      otex: [],
      allListdetails: [
        // {
        //   dev_name: "设备1",
        //   total_cap: 365000000, //空间
        //   up_bandwidth: 12326, //上行带宽
        //   online_time: 24123165, //在线时长
        //   store_ability: 0.1123, //存储力
        //   dev_profit: 1351260, //收益
        //   down_bandwidth: 31815 //下行带宽
        // },
        // {
        //   dev_name: "设备1",
        //   total_cap: 365000000, //空间
        //   up_bandwidth: 12326, //上行带宽
        //   online_time: 24123165, //在线时长
        //   store_ability: 0.1123, //存储力
        //   dev_profit: 1351260, //收益
        //   down_bandwidth: 31815 //下行带宽
        // },
        // {
        //   dev_name: "设备1",
        //   total_cap: 365000000, //空间
        //   up_bandwidth: 12326, //上行带宽
        //   online_time: 24123165, //在线时长
        //   store_ability: 0.1123, //存储力
        //   dev_profit: 1351260, //收益
        //   down_bandwidth: 31815 //下行带宽
        // }
      ]
    };
  },

  computed: mapState({
    log_token: state => state.user.log_token,
    phone_number: state => state.user.phone_number,
    user_name: state => state.user.user_name,
    user_sex: state => state.user.user_sex,
    charge_psd: state => state.user.charge_psd
  }),
  filters: {
    //时间戳转时间
    formatDate(time) {
      time = time * 1000;
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd");
    },
    aa(aaa) {
      if (aaa == "NaN") {
        return 0;
      } else return aaa;
    }
  },
  mounted: function() {
    this.mytime = this.$route.params.othertime;
    this.moneyNum = this.$route.params.userprofit;
    this.getnamelist(); //获取设备历史名称
    this.allrevenue(0, 0);
  },
  methods: {
    ...mapMutations(["updateUser", "clearUser"]),
    //下拉刷新
    onRefresh() {
      this.allListdetails = [];
      this.absx = [];
      this.otex = [];
      setTimeout(() => {
        this.allrevenue(0, 1);
        this.isLoading = false;
      }, 500);
    },
    goLink() {
      this.$router.push({ path: "/login" });
    },
    //请求数据
    allrevenue(page, key) {
      if (this.$parent.onLine == false) {
        Toast("无法连接网络，请检查网络状态");
      } else {
        if (key != 1 && page == 0) {
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
        this.absa = [];
        this.otey = [];
        let params = new Object();
        let startime = this.mytime + 1 - 24 * 3600;
        let token = this.log_token;
        params.start_time = startime;
        params.end_time = this.mytime + 1;
        params.login_token = token;
        params.cur_page = page;
        alldevinformation(params) //所有设备详情
          .then(res => {
            if (res) {
              this.$loading.hide();
            }
            this.repeats = 0;
            if (res.status == 0) {
              this.rescount = 0;
              this.refresh = false;
              if (res.data.page == 0) {
                this.updateUser({ log_token: res.data.token_info.token });
              }
              if(!res.data.dev_info_list){
                 Toast({
                  message: "暂无收益信息",
                  duration: 2000
                });
                return false;
              }
              this.miningArr = res.data.dev_info_list;
              //将详情筛选出来
              this.miningArr.forEach((item, index, arr) => {
                if (
                  item.date_stamp > params.start_time &&
                  item.date_stamp <= params.end_time
                ) {
                  item.dev_profit = 0;
                  item.store_ability = 0;
                  this.absa.push(item);
                }
              });
              this.absx = this.absx.concat(this.absa);
              alldevrevenue(params) //所有设备收益
                .then(res => {
                  if (res) {
                    this.$loading.hide();
                  }
                  this.repeats = 0;
                  if (res.status == 0) {
                    if (res.data.page == 0) {
                      this.updateUser({ log_token: res.data.token_info.token });
                    }
                    if (res.err_code == 0) {
                      this.rescount = 0;
                      //将收益筛选出来
                      res.data.dev_profit_list.forEach(xtime => {
                        if (
                          xtime.date_stamp > params.start_time &&
                          xtime.date_stamp <= params.end_time
                        ) {
                          this.otey.push(xtime);
                        }
                      });
                      this.otex = this.otex.concat(this.otey);

                      // console.log(this.allListdetails);
                      if (
                        page >= res.data.total_page - 1 ||
                        res.data.total_page == 0 ||
                        res.data.total_page == 1
                      ) {
                        if (this.absx.length > 0 && this.otex.length > 0) {
                          this.absx.forEach(atim => {
                            this.otex.forEach(item => {
                              if (atim.dev_sn == item.dev_sn) {
                                atim.dev_profit = item.dev_profit;
                                atim.store_ability = item.store_ability;
                              }
                            });
                          });
                        }
                        if (this.devhistoricalname.length > 0) {
                          this.absx.forEach(stim => {
                            this.devhistoricalname.forEach(item => {
                              if (stim.dev_sn == item.dev_sn) {
                                stim.dev_name = item.dev_name;
                              }
                            });
                          });
                        }
                        this.allListdetails = this.allListdetails.concat(
                          this.absx
                        );
                        return false;
                      } else {
                        page++;

                        this.allrevenue(page, 1);
                      }

                      //正常时间
                      // console.log(res.data.total_page, page);
                      // if (page >= res.data.total_page) {
                      //   return false;
                      // }
                      // page++;
                      // this.allrevenue(page, 1);
                      // console.log(this.miningArr, this.devhistoricalname);
                      // this.miningArr.forEach((item, index, arr) => {
                      //   console.log(item);
                      //   for (
                      //     let i = 0;
                      //     i < this.devhistoricalname.length;
                      //     i++
                      //   ) {
                      //     console.log(this.devhistoricalname[i]);
                      //     if (item.dev_sn == this.devhistoricalname[i].dev_sn) {
                      //       console.log("结果");
                      //       item.dev_name = this.devhistoricalname[i].dev_name;
                      //     }
                      //   }
                      // });
                      // this.allListdetails = this.miningArr; //正常时间
                    } else {
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
                  } else if (res.status == -900) {
                    this.rescount = 0;
                    // this.$router.push({ path: "/login" });
                  } else if (res.status == -5) {
                    this.rescount++;
                    this.allrevenue(0, 1);
                  } else {
                    this.rescount = 0;
                    const tip = this.$backStatusMap[res.status];
                    const str = tip ? this.$p(tip) : `请稍后重试 ${res.status}`;
                    this.$toast(str);
                  }
                })
                .catch(error => {
                  this.repeats = 0;
                  this.rescount++;
                  this.allrevenue(0, 1);
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
            } else if (res.status == -999) {
              this.rescount = 0;
              Toast("登录已过期，请重新登录");
              this.clearUser();
              setTimeout(() => {
                this.$router.push({ path: "/login" });
              }, 1000);
            } else if (res.status == -900) {
              this.rescount = 0;
              this.$router.push({ path: "/login" });
            } else if (res.status == -5) {
              this.rescount++;
              this.refresh = true;
            } else {
              this.rescount = 0;
              const tip = this.$backStatusMap[res.status];
              const str = tip ? this.$p(tip) : `请稍后重试 ${res.status}`;
              this.$toast(str);
            }
          })
          .catch(error => {
            this.repeats = 0;
            this.rescount++;
            this.allrevenue(0);
          });
      }
    },
    //获取设备历史名称
    getnamelist() {
      this.devhistoricalname = [];
      let params = new Object();
      let startime = this.mytime + 1 - 24 * 3600;
      let token = this.log_token;
      params.start_ts = startime;
      params.end_ts = this.mytime + 1;
      params.login_token = token;
      getdevhistoricalname(params)
        .then(res => {
          if (res.status == 0) {
            this.updateUser({ log_token: res.token_info.login_token });
            this.devhistoricalname = res.data;
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
          } else if (res.status == -999) {
            this.rescount = 0;
            Toast("登录已过期，请重新登录");
            this.clearUser();
            setTimeout(() => {
              this.$router.push({ path: "/login" });
            }, 1000);
          } else if (res.status == -900) {
            this.rescount = 0;
            this.$router.push({ path: "/login" });
          } else if (res.status == -5) {
            this.rescount++;
            this.refresh = true;
          } else {
            this.rescount = 0;
            const tip = this.$backStatusMap[res.status];
            const str = tip ? this.$p(tip) : `请稍后重试 ${res.status}`;
            this.$toast(str);
          }
        })
        .catch({});
    }
  },
  components: {
    navBar: navBar
  }
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  color: #ffffff;
  background: url(../../assets/images/bgc33.png) #f2f2f2 no-repeat 0 0;
  background-size: 100% 5.5rem;
  .xiala {
    // height: 100%;
    .refresh {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #000000;
      img {
        margin-top: 4.3rem;
        width: 50%;
      }
    }
  }
  .ranking_con {
    width: 100%;
    height: auto;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    margin-top: 0.8rem;
    background-color: #f2f2f2;
    .ranking_con_item {
      display: flex;
      padding: 0rem 0.2rem;
      box-sizing: border-box;
      justify-content: space-between;
      align-items: center;
      position: relative;
      font-size: 0.28rem;
      width: 100%;
      height: 2.72rem;
      // background: url(../../assets/images/bg10.png) no-repeat 0 0;
      background: linear-gradient(
        90deg,
        rgba(116, 90, 243, 1) 0%,
        rgba(92, 116, 243, 1) 100%
      );
      background-size: 100% 100%;
      box-sizing: border-box;
      margin: 0 auto;
      margin-top: -0.28rem;
      // margin-top: 0.3rem;
      // &:hover {
      //   background: #cccccc;
      // }
    }
    .div_show {
      width: 100%;
      color: #000000;
      margin: auto;
      background: #f8f8f8;
      margin-top: -0.12rem;
      overflow: auto;
      height: 9.2rem;
      -webkit-overflow-scrolling: touch; /* liuhx:可以把这整行注释掉对比差别 */
      overflow-x: hidden;
      .show_text_con {
        background-color: #fff;
        width: 95%;
        height: 2.73rem;
        padding: 0 0.2rem;
        margin: auto;
        margin-top: 0.12rem;
        .show_text_top {
          width: 100%;
          height: 0.7rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .show_text_top_left {
            border-left: 0.05rem solid #fa9f47;
            padding-left: 0.1rem;
          }
          .show_text_top_right {
            border: 0.01rem solid #fa9f47;
            border-radius: 0.12rem;
            padding: 0 0.1rem;
            color: #fa9f47;
            font-size: 0.22rem;
          }
        }
        .show_text_content {
          width: 100%;
          height: 1.4rem;
          display: flex;
          justify-content: space-around;
          align-items: center;
          border-bottom: 0.01rem solid #ebebeb;
          margin-top: -0.2rem;
          div {
            width: 33%;
            overflow: hidden;
          }
          .intermediate {
            border-left: #ebebeb solid 0.01rem;
            border-right: #ebebeb solid 0.01rem;
          }
          p {
            white-space: nowrap;
            overflow: hidden;
            font-size: 0.24rem;
            color: #808080;
          }
          .content_top {
            font-size: 0.36rem;
            color: #000000;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            span {
              color: #808080;
              font-size: 0.22rem;
            }
          }
        }
        .show_text_foot {
          color: #808080;
          font-size: 0.22rem;
          width: 100%;
          height: 0.6rem;
          line-height: 0.6rem;
          margin-top: 0.14rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          span {
            color: #000000;
          }
        }
      }
    }
    .con_item_l {
      display: flex;
      flex-direction: column;
      width: 6.9rem;
      height: 2.52rem;
      border-radius: 0.12rem;
      justify-content: flex-start;
      background: none;
      .item_l_name {
        text-align: left;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        background: none !important;
        span {
          padding-bottom: 0.1rem;
        }
        p {
          color: #000000;
          &.item_p2 {
            font-size: 0.28rem;
            color: #000000;
          }
          &.item_p1 {
            font-size: 0.6rem;
            color: #ffffff;
          }
        }
      }
      .item_l_No {
        color: #000000;
        font-size: 0.2rem;
      }
      .con_item_r {
        display: flex;
        justify-content: space-between;
        margin-top: 0.6rem;
        .item_r_btn {
          width: 100%;
          height: 0.4rem;
          display: flex;
          color: #ffffff;
          align-items: center;
          justify-content: center;
          background: none;
          p {
            color: #000000;
          }
        }
        .item_r_img {
          width: 0.5rem;
          height: 0.4rem;
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            width: 0.12rem;
            height: 0.21rem;
          }
        }
      }
    }
  }
}
/deep/.vue-slim-better-scroll__wrapper {
  background: #f2f2f2;
}
@media screen and (min-device-height: 812px) {
  .div_show {
    height: 12rem !important;
  }
}
</style>
