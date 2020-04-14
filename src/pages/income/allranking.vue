<template>
  <div class="container">
    <van-nav-bar
      left-text="返回"
      right-text
      rrow
      left-arrow
      @click-left="onClickLeft"
      :z-index="2000"
    >
      <div slot="left" class="alltitleleft">
        <van-icon name="arrow-left" color="#ffffff" />
        <span>返回</span>
      </div>
    </van-nav-bar>

    <div
      style="width:100%;height:0.8rem;position: fixed;top: 0;z-index:0;background: linear-gradient(45deg, #745af3 10%, #5c74f3 100%);"
    ></div>

    <div class="xiala">
      <Scroll ref="myscroller" :autoUpdate="true" :listenScroll="true" @pullingDown="onRefresh">
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
          <van-tabs v-model="active_ranking">
            <van-tab title="西柚机排名" @click="numrank">
              <div class="nointerval" v-show="noint">
                <img src="../../assets/images/paiming.png" alt />
                <p>排行榜暂未更新</p>
              </div>
              <div class="ranking_con" v-show="!noint">
                <div class="ranking_con_title">
                  <div class="tltle_l">
                    <b>名次</b>
                  </div>
                  <div class="tltle_m">
                    <b>西柚机数量</b>
                  </div>

                  <div class="tltle_r">
                    <b>用户</b>
                  </div>
                </div>
                <div class="ranking_item" v-for="(item,index) in rankList" v-bind:key="index">
                  <div
                    class="ranking_item_l"
                    :class="{'ranking_item_l1':index==0,
                'ranking_item_l2':index==1,
                'ranking_item_l3':index==2}"
                  >
                    <b>{{(index+1)|screen}}</b>
                  </div>
                  <div
                    class="ranking_item_r"
                    :class="{'ranking_item_r1':index==0,'ranking_item_r2':index==1,'ranking_item_r3':index==2}"
                  >
                    <b>{{item.bind_rank}}</b>
                  </div>
                  <div class="ranking_item_m">{{item.user_tel|newtel}}</div>
                </div>
                <div class="ranking_time">
                  <img src="../../assets/images/home_icon_notice.png" alt />
                  统计于：{{token_gen_ts}}
                </div>
              </div>
            </van-tab>
            <van-tab title="储存力排名" @click="pocrank">
              <div class="nointerval" v-show="noints">
                <img src="../../assets/images/earnings_illustration5.png" alt />
                <p>排行榜暂未更新</p>
              </div>
              <div class="ranking_con" v-show="!noints">
                <div class="ranking_con_title">
                  <div class="tltle_l">
                    <b>名次</b>
                  </div>
                  <div class="tltle_m">
                    <b>总存储力</b>
                  </div>
                  <div class="tltle_r">
                    <b>用户</b>
                  </div>
                </div>
                <div class="ranking_item" v-for="(item,index) in rankLists" v-bind:key="index">
                  <div
                    class="ranking_item_l"
                    :class="{'ranking_item_l1':index==0,'ranking_item_l2':index==1,'ranking_item_l3':index==2}"
                  >
                    <span>{{(index+1)|screen}}</span>
                  </div>
                  <div
                    class="ranking_item_r"
                    :class="{'ranking_item_r1':index==0,'ranking_item_r2':index==1,'ranking_item_r3':index==2}"
                  >
                    <b>{{((item.store_ability)/1000000).toFixed(6)}}</b>
                    <span>S/d</span>
                  </div>
                  <div class="ranking_item_m">{{item.user_tel|newtel}}</div>
                </div>
                <div class="ranking_time">
                  <img src="../../assets/images/home_icon_notice.png" alt />
                  统计于：{{token_gen_ts}}
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

export default {
  data() {
    return {
      repeats: 0, //防止重复点击
      rescount: 0, //请求计数
      noint: false,
      noints: false,
      isLoading: false,
      refresh: false,
      active_ranking: 0,
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
    }
  },
  mounted() {
    this.pocrank();
  },
  methods: {
    ...mapMutations(["updateUser", "clearUser"]),
    onClickLeft() {
      this.$router.back(-1);
    },
    //获取存储力排名列表
    pocrank(key) {
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
          this.rescount = 0;
          this.repeats = 0;
          this.$loading.hide();
          this.refresh = true;
          Toast(`请求超时，请稍后重试`);
          return false;
        }
        //存储力排名
        let params = new Object();
        let querytype = 3;
        params.login_token = this.log_token;
        params.query_type = querytype;
        rank(params)
          .then(res => {
            this.repeats = 0;
            if (res.status == 0) {
              this.rescount = 0;
              this.updateUser({
                log_token: res.data.token_info.token
              });
              if (res.err_code == 0) {
                this.refresh = false;
                this.rankLists = res.data.store_rank;
                this.rankLists.sort((a,b)=>{ return b.store_ability-a.store_ability})//降序
                if (this.rankLists.length <= 0) {
                  this.noints = true;
                } else {
                  this.noints = false;
                }
                this.token_gen_ts = format(
                  res.data.token_info.token_gen_ts,
                  "YYYY/MM/DD"
                );
                this.numrank();
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
            } else if (res.status == -500) {
              this.rescount = 0;
            } else if (res.status == -900) {
              this.rescount = 0;
              this.$router.push({ path: "/login" });
            } else if (res.status == -5) {
              this.rescount++;
              this.pocrank();
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
            this.pocrank();
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
             this.rankLists.sort((a,b)=>{ return b.bind_rank-a.bind_rank})//降序
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

<style lang="less" scoped >
/deep/.van-tabs__nav {
  color: #ffffff;
  background: url(../../assets/images/bg2.png);
  background-size: 100% 100%;
}
/deep/.van-tabs__wrap {
  position: static;
}
/deep/.van-tabs--line {
  padding-top: 0;
  top: -0.1rem;
}
/deep/.van-tabs--line .van-tabs__wrap {
  height: 2.88rem;
}
/deep/.van-tab {
  color: #b5bcfe;
  line-height: 3.2rem;
  font-size: 0.36rem;
  span {
    font-family: TTMeiHeiJ;
  }
}
/deep/.van-tab--active {
  color: #ffffff;
  line-height: 3.2rem;
  font-size: 0.64rem;
  span {
    font-family: TTMeiHeiJ;
  }
}
/deep/.van-nav-bar {
  color: #fff;
  background: none;
}

.container {
  width: 100%;
  height: 100%;
  margin: auto;
  overflow: hidden;
  background: url(../../assets/images/bgc33.png) #f2f2f2 no-repeat 0 0;
  background-size: 100%;
  .xiala {
    height: 100%;
    margin-top: -0.2rem;
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
    .ranking_con {
      width: 100%;
      height: 100%;
      background: #ffffff;
      // border-radius: 0.12rem;
      margin: 0 auto;
      // margin-top: 0.2rem;
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
      justify-content: flex-start;
      align-items: center;
      font-size: 0.34rem;
      font-weight: bold;
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
      .tltle_l {
        width: 20%;
        text-align: center;
      }
      .tltle_m {
        width: 40%;
        text-align: center;
      }
      .tltle_r {
        width: 40%;
        text-align: center;
      }
    }
    .ranking_item {
      width: 100;
      height: 1rem;
      line-height: 0.5rem;
      margin: 0 auto;
      // border-bottom: 0.01rem solid #aaaaaa;
      display: flex;
      // justify-content: space-between;
      justify-content: flex-start;
      align-items: center;
      color: #000;
      .ranking_item_l {
        width: 20%;
        height: 0.4rem;
        display: flex;
        justify-content: center;
        font-size: 0.24rem;
        color: #a8a8a8;
        // background-color: #00a0e9;
        border-radius: 50%;
        // background: url("../../assets/images/ranking_04.png") no-repeat center;
        // background-size: 0.4rem 0.4rem;
        &.ranking_item_l1 {
          width: 20%;
          height: 0.4rem;
          display: flex;
          justify-content: center;
          // align-items: center;
          //background-color: #cccccc;
          font-size: 0.2rem;
          color: #fff;
          // margin-left: 0.35rem;
          background: url("../../assets/images/earnings_icon_one.png") no-repeat
            55% 50%;
          background-size: 0.6rem 0.4rem;
        }

        &.ranking_item_l2 {
          width: 20%;
          height: 0.4rem;
          display: flex;
          justify-content: center;
          // align-items: center;
          //background-color: #cccccc;
          font-size: 0.2rem;
          color: #fff;
          // margin-left: 0.35rem;
          background: url("../../assets/images/earnings_icon_two.png") no-repeat
            55% 50%;
          background-size: 0.6rem 0.4rem;
        }
        &.ranking_item_l3 {
          width: 20%;
          height: 0.4rem;
          display: flex;
          justify-content: center;
          // align-items: center;
          //background-color: #cccccc;
          font-size: 0.2rem;
          color: #fff;
          // margin-left: 0.35rem;
          background: url("../../assets/images/earnings_icon_three.png")
            no-repeat 55% 50%;
          background-size: 0.6rem 0.4rem;
        }
      }
      .ranking_item_m {
        width: 40%;
        // padding-right: 0.4rem;
      }
      .ranking_item_r {
        // margin-left: 1.45rem;
        width: 40%;
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
