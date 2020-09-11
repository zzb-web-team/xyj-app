<template>
  <div class="container">
    <van-nav-bar
      left-text=""
      right-text
      rrow
      fixed
      left-arrow
      @click-left="onClickLeft"
      :z-index="2000"
    >
      <div slot="left" class="alltitleleft">
        <van-icon name="arrow-left" color="#ffffff" />
        <!-- <span>返回</span> -->
      </div>
    </van-nav-bar>
    <!-- <navBar>
      <van-icon name="search" slot="right" />
    </navBar> -->
    <div class="xiala">
      <Scroll
        ref="myscroller"
        :autoUpdate="true"
        :listenScroll="true"
        @pullingDown="onRefresh"
      >
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
          <van-tabs v-model="active_ranking" type="card" @click="onClick">
            <div class="ranking_top">
              <p class="ranking_title">{{ all_title }}</p>
              <div class="ranking_time">统计于：{{ token_gen_ts }}</div>
            </div>
            <van-tab title="西柚机收益排行">
              <div class="nointerval" v-show="noint">
                <img src="../../assets/images/paiming.png" alt />
                <p>排行榜暂未更新</p>
              </div>
              <div class="ranking_con" v-show="!noint">
                <div class="ranking_con_title">
                  <div class="tltle_l"><b>名次</b></div>
                  <div class="title_n">
                    <b>西柚机收益</b>
                  </div>
                  <div class="tltle_m">
                    <b>西柚机数量</b>
                  </div>
                  <div class="tltle_r">
                    <b>用户</b>
                  </div>
                </div>
                <div
                  class="ranking_item"
                  v-for="(item, index) in rankLists"
                  v-bind:key="index"
                >
                  <div
                    class="ranking_item_l"
                    :class="{
                      ranking_item_l1: index == 0,
                      ranking_item_l2: index == 1,
                      ranking_item_l3: index == 2
                    }"
                  >
                    <b>{{ (index + 1) | screen }}</b>
                  </div>
                  <div class="ranking_item_n">
                    {{ item.profit_rank / 100 }} gfm
                  </div>
                  <div class="ranking_item_r">
                    <b>{{ item.bind_num }}</b>
                  </div>
                  <div class="ranking_item_m">{{ item.user_tel | newtel }}</div>
                </div>
                <div class="ranking_time">
                  <img src="../../assets/images/home_icon_notice.png" alt />
                  统计于：{{ token_gen_ts }}
                </div>
              </div>
            </van-tab>
            <van-tab title="节点收益排行">
              <div class="nointerval" v-show="noints">
                <img src="../../assets/images/earnings_illustration5.png" alt />
                <p>排行榜暂未更新</p>
              </div>
              <div class="ranking_con" v-show="!noints">
                <div class="ranking_con_title">
                  <div class="tltle_l">
                    <b>名次</b>
                  </div>
                  <div class="title_n node_title_n">
                    <b>节点收益</b>
                  </div>
                  <div class="tltle_m">
                    <b>节点数量</b>
                  </div>
                  <div class="tltle_r">
                    <b>用户</b>
                  </div>
                </div>
                <div
                  class="ranking_item"
                  v-for="(item, index) in rankList"
                  v-bind:key="index"
                >
                  <div
                    class="ranking_item_l"
                    :class="{
                      ranking_item_l1: index == 0,
                      ranking_item_l2: index == 1,
                      ranking_item_l3: index == 2
                    }"
                  >
                    <span>{{ (index + 1) | screen }}</span>
                  </div>
                  <div class="ranking_item_n">
                    {{ item.node_income | set_node_income }} 积分
                  </div>
                  <div class="ranking_item_r">
                    <b>{{ item.bind_rank }}</b>
                  </div>
                  <div class="ranking_item_m">{{ item.user_tel | newtel }}</div>
                </div>
                <div class="ranking_time">
                  <img src="../../assets/images/home_icon_notice.png" alt />
                  统计于：{{ token_gen_ts }}
                </div>
              </div>
            </van-tab>
          </van-tabs>
        </div>
      </Scroll>
    </div>
  </div>
</template>

<script>
import { Tabbar, TabbarItem, PullRefresh, Toast, Dialog } from "vant";
import { rank } from "../../common/js/api.js";
import { format } from "date-fns";
import { mapState, mapMutations } from "vuex";
import { err } from "../../common/js/status";
import navBar from "../../components/navBar";

export default {
  data() {
    return {
      noint: false,
      noints: false,
      isLoading: false,
      refresh: false,
      active_ranking: 0,
      all_title: "西柚机收益排行",
      rankLists: [
        // { store_ability: 12, user_tel: 13301201366 },
        // { store_ability: 1, user_tel: 18714124198 },
        // { store_ability: 12, user_tel: 13301201366 },
        // { store_ability: 1, user_tel: 18714124198 }
      ],
      rankList: [
        // { bind_rank: 12, user_tel: 13301201366 },
        // { bind_rank: 1, user_tel: 18714124198 },
        // { bind_rank: 12, user_tel: 13301201366 },
        // { bind_rank: 1, user_tel: 18714124198 }
      ],
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
    },
    set_node_income(data) {
      if (data) {
        return data;
      } else {
        return 0;
      }
    }
  },

  components: {
    navBar: navBar
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
    this.pocrank();
  },
  methods: {
    ...mapMutations(["updateUser", "clearUser"]),
    onClickLeft() {
      this.$router.back(-1);
    },
    onClick(name, title) {
      if (title == "西柚机收益排行") {
        this.all_title = "西柚机收益排行";
        this.pocrank();
      } else {
        this.all_title = "节点收益排行";
        this.numrank();
      }
    },
    //获取存储力排名列表
    pocrank() {
      if (this.$parent.onLine == false) {
        Toast("无法连接网络，请检查网络状态");
      } else {
        //存储力排名
        let params = new Object();
        let querytype = 1;
        params.login_token = this.log_token;
        params.query_type = querytype;
        rank(params)
          .then(res => {
            if (res.status == 0) {
              this.updateUser({
                log_token: res.data.token_info.token
              });
              if (res.err_code == 0) {
                this.refresh = false;
                this.rankLists = res.data.profit_rank;
                this.rankLists.sort((a, b) => {
                  return b.profit_rank - a.profit_rank;
                }); //降序
                if (this.rankLists.length <= 0) {
                  this.noints = true;
                } else {
                  this.noints = false;
                }
                this.token_gen_ts = format(
                  res.data.token_info.token_gen_ts,
                  "YYYY/MM/DD"
                );
              } else {
                const sta = err[res.err_code]
                  ? this.$t(err[res.err_code])
                  : `请稍后重试 ${res.err_code}`;
                this.$toast(sta);
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
            } else if (res.status == -500) {
            } else if (res.status == -900) {
              this.$router.push({ path: "/login" });
            } else if (res.status == -5) {
            } else {
              const tip = this.$backStatusMap[res.status] || err[res.status];
              const str = tip ? this.$t(tip) : `请稍后重试 ${res.status}`;
              this.$toast(str);
            }
          })
          .catch(error => {
            // Toast("网络错误，请重新请求");
          });
      }
    },
    numrank() {
      //获取西柚机绑定数量排名
      let params = new Object();
      let querytype = 2;
      params.login_token = this.log_token;
      params.query_type = querytype;
      rank(params)
        .then(res => {
          this.$loading.hide();
          if (res.status == 0) {
            this.rankList = res.data.bind_rank;
            this.rankList.sort((a, b) => {
              return b.bind_rank - a.bind_rank;
            }); //降序
            if (this.rankList.length <= 0) {
              this.noint = true;
            } else {
              this.noint = false;
            }
            this.updateUser({
              log_token: res.data.token_info.token
            });
            this.token_gen_ts = format(
              res.data.token_info.token_gen_ts - 24 * 3600 * 1000,
              "YYYY/MM/DD"
            );
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
          } else if (res.status == -17) {
            Dialog.alert({
              message: "账号在其它地方登录，请重新登录"
            }).then(() => {
              this.clearUser();
              this.$router.push({ path: "/login" });
            });
          } else if (res.status == -999) {
            Toast("登录已过期，请重新登录");
            this.clearUser();
            setTimeout(() => {
              this.$router.push({ path: "/login" });
            }, 1000);
          } else if (res.status == -500) {
          } else if (res.status == -900) {
            this.$router.push({ path: "/login" });
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
    //下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.pocrank(1);
        //this.$toast("刷新成功");
        this.isLoading = false; //刷新成功清除loading
      }, 800);
    },
    goLink() {
      this.$router.push({ path: "/login" });
    }
  }
};
</script>

<style lang="less" scoped>
/deep/.van-nav-bar {
  z-index: 2 !important;
  color: #fff;
  background: linear-gradient(115deg, #4c95ff 0%, #2c6afe 100%) 0;
  background-color: #fff;
}
/deep/.van-nav-bar__left {
  color: #ffffff;
}
/deep/.van-nav-bar__title {
  font-size: 0.34rem;
  color: #ffffff;
}
/deep/.van-icon-arrow-left:before {
  // color: #ffffff;
  color: #000000;
}
/deep/.van-tabs__wrap {
  height: 2.5rem !important;
  background: url(../../assets/images/jifen_bgc.png) #f2f2f2 no-repeat 0 0;
  background-size: cover; /* 将背景图片等比缩放填满整个容器 */
}
/deep/.van-tabs__nav--line {
  width: 75%;
  margin: auto;
  border: 0.01rem #eeeeee solid;
  // border-radius: 0.15rem;
}
/deep/.van-tabs__nav--card {
  border: none;
  width: 70%;
  margin: auto;
  background: linear-gradient(115deg, #4990ff 0%, #2f70fe 100%) 0;
}
/deep/.van-tabs__nav--card .van-tab {
  color: #ffffff;
  background: #3477fd;
}
/deep/.van-tabs__nav--card .van-tab.van-tab--active {
  background: #d8eaff;
  color: #333333;
}
/deep/.van-tabs__nav--card .van-tab {
  border: none;
  // border-radius: 0.16rem;
}

/deep/.van-tab:nth-child(1) {
  border-radius: 0.16rem 0 0 0.16rem;
}
/deep/.van-tab:nth-child(2) {
  border-radius: 0 0.16rem 0.16rem 0;
}

.container {
  width: 100%;
  height: 100%;
  margin: auto;
  overflow: hidden;
  // background: url(../../assets/images/bgc33.png) #f2f2f2 no-repeat 0 0;
  background-size: 100%;

  .xiala {
    height: 100%;
    margin-top: 0.92rem;
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
    width: 100%;
    height: auto;
    overflow: hidden;
    margin: 0 auto;
    // .top {
    //   height: 3rem;
    //   display: flex;
    //   flex-direction: row;
    //   align-items: flex-end;
    //   background-image: url(../../assets/images/paihang_bgc.png);
    //   background-size: 100% 100%;
    //   margin-top: 0.1rem;
    // }
    .ranking_top {
      height: 0;
      position: relative;
      top: -1.5rem;
      .ranking_title {
        color: #ffffff;
        font-size: 0.4rem;
      }
      .ranking_time {
        color: #ffffff;
      }
    }
    .ranking_con {
      width: 100%;
      height: 100%;
      background: #ffffff;
      // border-radius: 0.12rem;
      margin: 0 auto;
      margin-top: 0.2rem;
    }
    .ranking_time {
      width: 100%;
      height: 0.6rem;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 0.28rem;
      color: #7e869f;
      img {
        width: 7%;
      }
    }
    .ranking_title {
      width: 95%;
      height: 0.6rem;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 0.34rem;
      font-weight: bold;
      text-align: center;
      color: #000;
      margin: 0 auto;
    }

    .ranking_con_title {
      width: 100%;
      height: 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      color: #979797;
      text-align: left;
      box-sizing: border-box;
      padding-right: 0.5rem;
      .tltle_l {
        width: 20%;
        text-align: center;
        font-weight: 700;
      }
      .tltle_m {
        width: 25%;
        text-align: center;
        margin-left: 0.5rem;
        font-weight: 700;
      }
      .title_n {
        width: 25%;
        text-align: center;
        margin-left: 0.5rem;
        font-weight: 700;
      }
      .node_title_n {
        margin-left: 0;
        font-weight: 700;
      }
      .tltle_r {
        width: 30%;
        text-align: center;
        font-weight: 700;
      }
      b {
        font-weight: 700;
      }
    }
    .ranking_item {
      width: 100;
      height: 1rem;
      line-height: 0.5rem;
      margin: 0 auto;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      color: #000;
      box-sizing: border-box;
      padding-right: 0.5rem;
      .ranking_item_l {
        width: 20%;
        height: 0.4rem;
        display: flex;
        justify-content: center;
        font-size: 0.24rem;
        color: #a8a8a8;
        border-radius: 50%;
        &.ranking_item_l1 {
          width: 20%;
          height: 0.4rem;
          display: flex;
          justify-content: center;
          font-size: 0.2rem;
          color: #fff;
          background: url("../../assets/images/earnings_icon_one.png") no-repeat
            55% 50%;
          background-size: 0.6rem 0.4rem;
        }

        &.ranking_item_l2 {
          width: 20%;
          height: 0.4rem;
          display: flex;
          justify-content: center;
          font-size: 0.2rem;
          color: #fff;
          background: url("../../assets/images/earnings_icon_two.png") no-repeat
            55% 50%;
          background-size: 0.6rem 0.4rem;
        }
        &.ranking_item_l3 {
          width: 20%;
          height: 0.4rem;
          display: flex;
          justify-content: center;
          font-size: 0.2rem;
          color: #fff;
          background: url("../../assets/images/earnings_icon_three.png")
            no-repeat 55% 50%;
          background-size: 0.6rem 0.4rem;
        }
      }
      .ranking_item_m {
        width: 25%;
        // padding-right: 0.4rem;
      }
      .ranking_item_n {
        width: 25%;
        // padding-right: 0.4rem;
      }
      .ranking_item_r {
        // margin-left: 1.45rem;
        width: 30%;
        text-align: center;
        overflow: hidden;
        color: #000;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .van-pull-refresh {
    height: 100%;
  }
  .van-tabs--line .van-tabs__wrap {
    background-color: #fff;
  }

  .nointerval {
    margin-top: 0.2rem;
    width: 100%;
    height: 7.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    img {
      width: 40%;
      margin-top: 1.8rem;
    }
    p {
      margin-top: 0.2rem;
      color: #808080;
    }
  }
}
</style>
