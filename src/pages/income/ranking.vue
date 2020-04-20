<template>
  <div class="container">
    <navBar>
      <van-icon name="search" slot="right" />
    </navBar>

    <div class="xiala">
      <!-- <Scroll> -->
        <!-- 网络异常 -->
        <div class="refresh" v-show="refresh">
          <div
            style="width:100%;height:46px;position: fixed;top: 0;z-index: 0;background: linear-gradient(45deg, #745af3 10%, #5c74f3 100%);"
          ></div>
          <div class="norefresh">
            <img src="../../assets/images/unusual_inset.png" alt />
            <p>网络异常，下拉刷新</p>
          </div>
        </div>
        <div class="ranking" v-show="!refresh">
          <div class="top">
            <div class="topimg">
              <div class="ranking_title">收益排行</div>
              <div class="ranking_time">统计于：{{ token_gen_ts }}</div>
            </div>
            <div class="ranking_img">
              <!-- <img src="../../assets/images/earnings_bg1_trophy.png" /> -->
            </div>
          </div>

          <van-pull-refresh class="xiala" v-model="isLoading" @refresh="onRefresh">
            <div class="nointerval" v-show="noint">
              <img src="../../assets/images/earnings_illustration5.png" alt />
              <p>排行榜暂未更新</p>
            </div>
            <div class="ranking_con" v-show="int">
              <div class="ranking_con_title">
                <div class="tltle_l">名次</div>
                <div class="tltle_m">收益</div>
                <div class="tltle_n">西柚机数量</div>
                <div class="tltle_r">用户</div>
              </div>
              <div class="ranking_item" v-for="(item, index) in incomeArr" v-bind:key="index">
                <div
                  class="ranking_item_l"
                  :class="{
                  ranking_item_l1: index == 0,
                  ranking_item_l2: index == 1,
                  ranking_item_l3: index == 2
                }"
                >{{ (index + 1) | screen }}</div>
                <div
                  class="ranking_item_r"
                  :class="{
                  ranking_item_r1: index == 0,
                  ranking_item_r2: index == 1,
                  ranking_item_r3: index == 2
                }"
                >
                  <p class="item_p1">
                    <b>{{ (item.profit_rank / 1000000).toFixed(6) }}</b>
                  </p>
                  <!-- <p>poc</p> -->
                </div>
                <div class="ranking_item_n">{{ item.bind_num }}</div>
                <div class="ranking_item_m">{{ item.user_tel | newtel }}</div>
              </div>
            </div>
          </van-pull-refresh>
        </div>
      <!-- </Scroll> -->
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import navBar from "../../components/navBar";
import { Tabbar, TabbarItem, Toast, PullRefresh, Dialog } from "vant";
import { rank } from "../../common/js/api.js";
import { format } from "date-fns";
import { err } from "../../common/js/status";

export default {
  data() {
    return {
      repeats: 0, //防止重复点击
      rescount: 0, //请求计数
      isLoading: false, //控制上拉加载的加载动画
      refresh: false,
      noint: false,
      int: true,
      incomeArr: [],
      token_gen_ts: format(Date.now(), "YYYY/MM/DD")
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
    newtel(value1) {
      if (!value1) return "";
      let value2 = value1.toString().substr(0, 3);
      value1 = value1.toString().substr(-4, 4);
      value1 = value2 + "*".repeat(4) + value1;
      return value1;
    },
    screen(val) {
      if (val > 9) {
        return val;
      } else if (val > 0 && val <= 9) {
        return "0" + val;
      }
    }
  },
  mounted() {
    this.revenueranking();
  },
  methods: {
    ...mapMutations(["updateUser", "clearUser"]),
    revenueranking(key) {
      if (this.$parent.onLine == false) {
        Toast("无法连接网络，请检查网络状态");
      } else {
        if (key != 1) {
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
        //获取收益排名信息
        let params = new Object();
        let querytype = 1;
        params.login_token = this.log_token;
        params.query_type = querytype;
        rank(params)
          .then(res => {
            if (res) {
              this.$loading.hide();
            }
            this.repeats = 0;
            if (res.status == 0) {
              this.updateUser({
                log_token: res.data.token_info.token
              });
              this.refresh = false;
              if (res.err_code == 0) {
                this.rescount = 0;
                this.incomeArr = res.data.profit_rank;
                this.incomeArr.sort((a, b) => {
                  return b.profit_rank - a.profit_rank;
                }); //降序
                if (this.incomeArr.length <= 0) {
                  this.noint = true;
                  this.int = false;
                } else {
                  this.noint = false;
                  this.int = true;
                }
                this.token_gen_ts = format(
                  res.data.token_info.token_gen_ts - 24 * 3600 * 1000,
                  "YYYY/MM/DD"
                );
              } else {
                this.rescount = 0;
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
              this.revenueranking();
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
            this.revenueranking();
            // Toast("网络错误，请重新请求");
          });
      }
    },
    onRefresh() {
      setTimeout(() => {
        this.revenueranking(1);
        // this.$toast("刷新成功");
        this.isLoading = false;
      }, 500);
    }
  },
  components: {
    navBar: navBar
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
.container {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  overflow: hidden;
  background: url(../../assets/images/bgc33.png) #f2f2f2 no-repeat 0 0;
  background-size: 100%;
  .xiala {
    height: 100%;
    .refresh {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .norefresh {
        width: 100%;
        height: 100%;
        background: #f2f2f2;
      }
      img {
        width: 50%;
        margin-top: 4rem;
      }
    }
  }
  .ranking {
    overflow: hidden;
    margin: 0 auto;
    width: 100%;
    height: auto;
    background: #ffffff;
    .top {
      height: 3rem;
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      background-image: url(../../assets/images/paihang_bgc.png);
      background-size: 100% 100%;
      margin-top: 0.1rem;
      .topimg {
        width: 60%;
        display: flex;
        flex-direction: column;
        .ranking_title {
          width: 100%;
          height: 50%;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          font-size: 0.42rem;
          font-weight: bold;
          color: #ffffff;
          margin: 0 auto;
          padding-left: 0.4rem;
        }
        .ranking_time {
          width: 100%;
          padding-left: 0.4rem;
          text-align: left;
          font-size: 0.2rem;
          color: #d8d2ff;
          margin-bottom: 0.4rem;
        }
      }
      .ranking_img {
        width: 30%;
        img {
          width: 67%;
          margin-bottom: -0.1rem;
        }
      }
    }

    .ranking_con_title {
      width: 100%;
      height: 1rem;
      background: none;
      display: flex;
      margin: 0 auto;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      color: #979797;
      font-size: 0.26rem;
      // border-bottom: #aaaaaa 0.01rem solid;
      .tltle_l {
        padding-left: 0.4rem;
      }
      .tltle_r {
        padding-right: 1.2rem;
      }
      .tltle_m {
        width: 20%;
        text-align: right;
        // padding-right: 1.1rem;
      }
      .tltle_n {
        width: 32%;
        text-align: center;
      }
    }
    .ranking_item {
      width: 100;
      height: 1rem;
      margin: 0 auto;
      // border-bottom: #aaaaaa 0.01rem solid;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.3rem;
      color: #313131;
      .ranking_item_l {
        width: 0.4rem;
        height: 0.4rem;
        line-height: 0.45rem;
        margin-left: 0.4rem;
        display: flex;
        justify-content: center;
        font-size: 0.28rem;
        color: #a8a8a8;
        margin-left: 0.4rem;
        background-color: #ffffff;
        border-radius: 50%;
        font-weight: 400;
        &.ranking_item_l1 {
          width: 0.8rem;
          height: 0.4rem;
          display: flex;
          justify-content: center;
          font-size: 0.26rem;
          color: #fff;
          margin-left: 0.2rem;
          background: url("../../assets/images/earnings_icon_one.png") no-repeat
            0.16rem 0;
          background-size: 0.6rem 0.4rem;
        }

        &.ranking_item_l2 {
          width: 0.8rem;
          height: 0.4rem;
          display: flex;
          justify-content: center;
          // align-items: center;
          //background-color: #cccccc;
          font-size: 0.26rem;
          color: #fff;
          margin-left: 0.2rem;
          background: url("../../assets/images/earnings_icon_two.png") no-repeat
            0.16rem 0;
          background-size: 0.6rem 0.4rem;
        }
        &.ranking_item_l3 {
          width: 0.8rem;
          height: 0.4rem;
          display: flex;
          justify-content: center;
          // align-items: center;
          //background-color: #cccccc;
          font-size: 0.26rem;
          color: #fff;
          margin-left: 0.2rem;
          background: url("../../assets/images/earnings_icon_three.png")
            no-repeat 0.16rem 0;
          background-size: 0.6rem 0.4rem;
        }
      }
      .ranking_item_r {
        width: 32%;
        text-align: left;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        justify-content: center;
        .item_p1 {
          color: rgb(0, 0, 0);
          font-size: 0.32rem;
          margin-right: 0.05rem;
        }
        &.ranking_item_r1 {
          margin-left: -0.2rem;
        }
        &.ranking_item_r2 {
          margin-left: -0.2rem;
        }
        &.ranking_item_r3 {
          margin-left: -0.2rem;
        }
      }
      .ranking_item_m {
        width: 32%;
        padding-right: 0.4rem;
        font-size: 0.28rem;
      }
    }
    .ranking_item:nth-child(11) {
      border: none;
    }
    .nointerval {
      width: 100%;
      height: 5.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      img {
        width: 50%;
        margin-top: 0.8rem;
      }
      p {
        margin-top: 0.2rem;
        color: #808080;
      }
    }
  }
  .van-pull-refresh {
    height: 100%;
  }
}
</style>
