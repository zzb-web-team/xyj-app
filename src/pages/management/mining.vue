<template>
  <div class="container">
    <!--- 头部导航  -->
    <navBar :title="title" left-text="返回" left-arrow fixed @click-left="onClickLeft">
      <!-- <van-icon name="question-o" slot="right" size="0.4rem" /> -->
    </navBar>
    <!--- 弹窗  -->
    <van-popup v-model="show">
      <van-icon name="close" size="0.48rem" v-model="show" @click="shaoew()" />
      <div class="bigtext">收益和存储力的相关介绍</div>
      <div class="scontent">
        <p>收益多少取决于设备存储力，存储力的三大决定因素：有效占用空间，上行带宽，有效在线时长。</p>
      </div>
    </van-popup>
    <div class="xiala">
      <!-- <scroller
        style="top:1rem;background: #F8F8F8;height: 100%;"
        :on-refresh="refreshs"
        :on-infinite="infinite"
        ref="myscroller"
        class="scroller"
      >-->
      <Scroll ref="myscroller" :autoUpdate="true" @pullingDown="loadRefresh" @pullingUp="loadMore">
        <!-- 网络异常 -->
        <div class="refresh" v-show="refresh">
          <div>
            <img src="../../assets/images/unusual_inset.png" alt />
            <p>网络异常，下拉刷新</p>
          </div>
        </div>
        <!--- 主体内容  -->

        <div class="mining" v-show="!refresh">
          <div class="mining_title">
            <span>{{miningMInername}}的每日收益</span>
            <span @click="onRight">
              <img src="../../assets/images/icon_bg_question_normal.png" />
            </span>
          </div>
          <div class="nointerval" v-show="noint">
            <img src="../../assets/images/home_illustration1.png" alt />
            <p>近期暂无收益</p>
          </div>
          <div
            class="mining_item"
            :class="{'mining_item_active':index==0}"
            v-for="(item,index) in miningArr"
            v-bind:key="index"
            v-show="!noint"
          >
            <div class="ranking_item_l" :class="{'ranking_item_l1':index==0}">
              <div
                class="message_item_a"
                @click="changeContent(index)"
                v-fb="{cls:'my_touchfeedback'}"
              >
                <div class="mining_item_l">{{item.date_stamp | formatDate}}</div>
                <div class="mining_item_right">
                  <div class="mining_item_r">
                    +{{((item.dev_profit)/1000000).toFixed(6)}}
                    <!-- <span>POC</span> -->
                  </div>
                  <div class="mining_item_i">
                    <van-icon
                      name="play"
                      class="playimg"
                      size="0.5rem"
                      click="changeContent(index)"
                      :class="[item.showcontent?'go':'aa']"
                    />
                    <!-- <img
                      src="../../assets/images/ear_icon_unfold.png"
                      @click="changeContent(index)"
                      :class="[item.showcontent?'go':'aa']"
                    />-->
                  </div>
                </div>
              </div>
              <div class="mining_item_b" v-if="item.showcontent">
                <div class="mining_item_b_top">
                  <div>
                    <span></span>
                    存储力：{{((item.store_ability)*1/1000000).toFixed(6)}}S/d
                  </div>
                  <div>
                    <span></span>
                    剩余空间：{{((item.free_cap)/1024/1024/1024).toFixed(2)}}Gb
                  </div>
                  <div>
                    <span></span>
                    总空间：{{((item.total_cap)/1024/1024/1024).toFixed(2)}}Gb
                  </div>
                </div>

                <div class="mining_item_b_bottom">
                  <div>
                    <span></span>
                    上行带宽：{{((item.up_bandwidth)/1024/1024).toFixed(2)}}Mb/s
                  </div>
                  <div>
                    <span></span>
                    下行带宽：{{((item.down_bandwidth)/1024/1024).toFixed(2)}}Mb/s
                  </div>
                  <div>
                    <span></span>
                    在线时间：{{((item.online_time)/3600).toFixed(2)}}h
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- </scroller> -->
      </Scroll>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import navBar from "../../components/navBar";
import {
  NavBar,
  Tabbar,
  TabbarItem,
  Popup,
  Icon,
  Toast,
  Dialog,
  Progress,
  List,
  Collapse,
  CollapseItem
} from "vant";
import { devinformation, devrevenue } from "../../common/js/api.js";
import { error } from "util";
import { formatDate, transformTime } from "../../common/js/date.js";
import MescrollVue from "mescroll.js/mescroll.vue";
import { inflate } from "zlib";
import { err } from "../../common/js/status";
import Scroll from "vue-slim-better-scroll";
import BScroll from "better-scroll";

export default {
  data() {
    return {
      repeats: 0, //防止重复点击
      rescount: 0, //请求计数
      title: "收益",
      refresh: false,
      loading: false,
      show: false,
      noint: false,
      showcontent: false,
      rotate: false,
      numpag: 0, //总页码
      curpage: 0, //页码
      mewarr: [],
      noData: "",
      miningMInername: "",
      devsn: "",
      miningArr: [
        // {
        //   date_stamp: 1554348537, //时间戳
        //   dev_profit: 1.093, //总收益
        //   store_ability: 1.24005, //存储力
        //   free_cap: 509.908, //空间
        //   up_bandwidth: 19.32, //上行带宽
        //   online_time: 3 //在线时间
        // },
        // {
        //   date_stamp: 1554262137,
        //   dev_profit: 1.092,
        //   store_ability: 18.130012,
        //   free_cap: 509.908,
        //   up_bandwidth: 45.19,
        //   online_time: 24
        // },
        // {
        //   date_stamp: 1554175737,
        //   dev_profit: 19.392,
        //   store_ability: 1.53,
        //   free_cap: 509.908,
        //   up_bandwidth: 0.14,
        //   online_time: 13
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
    }
  },
  mounted: function() {
    this.devsn = this.$route.query.minersn;
    this.miningMInername = this.$route.query.devname;
    this.infolist(0);
  },
  methods: {
    ...mapMutations(["updateUser", "clearUser"]),
    // //下拉刷新
    // refreshs() {
    //   this.mewarr = [];
    //   this.infolist(0, 1);
    //   let self = this;
    //   setTimeout(function() {
    //     self.$refs.myscroller.finishPullToRefresh(); //停止下拉刷新动效
    //   }, 1000);
    // },
    // //上拉加载
    // infinite() {
    //   let self = this;
    //   console.log(self.numpag);
    //   if (self.numpag - 1 <= self.curpage) {
    //     if (self.numpag * 1 == 0 && self.curpage * 1 == 0) {
    //       self.$refs.myscroller.finishInfinite(true);
    //       self.$refs.myscroller.noData = "暂无收益"; //更改上拉加载的文字
    //     } else {
    //       self.$refs.myscroller.finishInfinite(true);
    //       self.$refs.myscroller.noData = "没有更多数据"; //更改上拉加载的文字
    //     }
    //   } else {
    //     self.curpage++;
    //     console.log(self.curpage);
    //     self.infolist(self.curpage, 1);
    //     self.$refs.myscroller.finishInfinite(false);
    //   }
    // },
    //下拉刷新
    loadRefresh() {
      this.mewarr = [];
      this.infolist(0, 1);
    },
    //上拉加载
    loadMore() {
      let self = this;
      if (self.numpag - 1 <= self.curpage) {
        self.$refs.myscroller.update(true); //关闭上拉
      } else {
        self.curpage++;
        self.infolist(self.curpage, 1);
        self.$refs.myscroller.update(false); //不关闭上拉
      }
    },
    infolist(page, key) {
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

        this.mewarr = [];
        let params = new Object();
        let querydate = 90;
        let endtimes = Date.parse(new Date().toLocaleDateString()) / 1000; //获取当前年月日时间戳
        let starttime = endtimes - querydate * 24 * 3600; //获取前？天的时间戳
        let token = this.log_token;
        params.login_token = token;
        params.start_time = starttime;
        params.end_time = endtimes;
        params.cur_page = page;
        params.dev_sn = this.devsn;
        console.log(params);
        devinformation(params) //所有设备详情
          .then(res => {
            if (res) {
              this.$loading.hide();
            }
            console.log(res);
            this.repeats = 0;
            if (res.status == 0) {
              this.updateUser({
                log_token: res.data.token_info.token
              });
              this.refresh = false;
              if (res.err_code == 0) {
                this.rescount = 0;
                this.mewarr = res.data.dev_info_list;
                console.log(this.mewarr);
                console.log(params);
                devrevenue(params) //所有设备收益
                  .then(res => {
                    console.log(res);
                    this.repeats = 0;
                    if (res.status == 0) {
                      this.updateUser({
                        log_token: res.data.token_info.token
                      });
                      if (res.err_code == 0) {
                        console.log(this.noint, this.refresh);
                        this.rescount = 0;
                        this.noint = false;
                        this.numpag = res.data.total_page;
                        this.curpage = res.data.page;
                        console.log(res);
                        // res.data.dev_profit_list.forEach((item, index) => {
                        //   this.mewarr.forEach((xtems, zindex) => {
                        //     if (
                        //       xtems.date_stamp -
                        //         ((xtems.date_stamp + 8 * 3600) % 86400) <=
                        //         item.date_stamp &&
                        //       xtems.date_stamp -
                        //         ((xtems.date_stamp + 8 * 3600) % 86400) +
                        //         86400 >=
                        //         item.date_stamp
                        //     ) {
                        //       xtems.dev_profit = item.dev_profit;
                        //       xtems.store_ability = item.store_ability;
                        //       xtems.showcontent = false;

                        //     }
                        //   });
                        // });

                        let ary = [];
                        this.mewarr.forEach((item, index) => {
                          ary[transformTime(item.date_stamp)] = item;
                          ary[transformTime(item.date_stamp)].dev_profit = 0;
                          ary[transformTime(item.date_stamp)].store_ability = 0;
                        });

                        res.data.dev_profit_list.forEach((item, index) => {
                          if (
                            ary[transformTime(item.date_stamp)] != undefined
                          ) {
                            ary[transformTime(item.date_stamp)].dev_profit =
                              item.dev_profit;
                            ary[transformTime(item.date_stamp)].store_ability =
                              item.store_ability;
                          }
                        });
                        console.log(ary);
                        var newAry = [];
                        for (let index in ary) {
                          newAry.push(ary[index]);
                        }
                        if (res.data.page == 0) {
                          this.miningArr = newAry;
                        } else {
                          this.miningArr.push(...newAry); //数组拼接
                        }
                        console.log(this.miningArr);
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
                    } else if (res.status == -900) {
                      this.rescount = 0;
                      this.$router.push({ path: "/login" });
                    } else if (res.status == -17) {
                      this.rescount = 0;
                      Dialog.alert({
                        message: "账号在其它地方登录，请重新登录"
                      }).then(() => {
                        this.clearUser();
                        this.$router.push({ path: "/login" });
                      });
                    } else if (res.status == -5) {
                      this.rescount++;
                      this.infolist(0, 0);
                    } else {
                      this.rescount = 0;
                      const tip =
                        this.$backStatusMap[res.status] || err[res.status];
                      const str = tip
                        ? this.$t(tip)
                        : `请稍后重试 ${res.status}`;
                      this.$toast(str);
                    }
                  })
                  .catch(error => {
                    this.repeats = 0;
                    this.rescount++;
                    console.log(error);
                    // this.infolist(0, 0);
                    // Toast("网络错误，请重新请求");
                  });
              } else if (res.err_code == 500) {
                this.rescount = 0;
                this.noint = true;
                // Toast("暂无收益记录");
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
              this.rescount = 0;
              this.$router.push({ path: "/login" });
            } else if (res.status == -5) {
              this.rescount++;
              this.infolist(0, 0);
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
            } else {
              const tip = this.$backStatusMap[res.status] || err[res.status];
              const str = tip ? this.$t(tip) : `请稍后重试 ${res.status}`;
              this.$toast(str);
            }
          })
          .catch(error => {
            this.repeats = 0;
            this.rescount++;
            this.infolist(0, 0);
            // Toast("网络错误，请重新请求");
          });
      }
    },
    onClickLeft() {
      this.$router.go(-1);
    },
    onRight() {
      // this.$router.push({path:"/message"});
      this.show = !this.show;
    },
    shaoew() {
      this.show = !this.show;
    },
    //点击展开
    changeContent(index) {
      //通过index拿到当前值
      this.rotate = !this.rotate;
      this.miningArr[index].showcontent = !this.miningArr[index].showcontent;
      this.$forceUpdate();
    }
  },
  components: {
    navBar: navBar
  }
};
</script>

<style lang="less" scoped >
.playimg {
  transform: rotate(90deg);
}
.aa {
  transition: all 0.5s;
}
.go {
  transform: rotate(270deg);
  transition: all 0.5s;
}
body {
  background-color: #f8f8f8;
}
.container {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  // overflow: hidden;
  background: #ffffff;
  position: relative;
  .xiala {
    height: 100%;
    position: relative;
    // top: 0.8rem;
    left: 0;
    .refresh {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f8f8f8;
      img {
        width: 50%;
        margin-top: 3rem;
      }
    }
    .scroller {
      -webkit-overflow-scrolling: touch;
    }
  }
  .mining {
    width: 100%;
    height: auto;
    color: #000;
    margin-top: 0.2rem;
    position: relative;
    z-index: 200;
    background-color: #f8f8f8;
    .nointerval {
      margin-top: 0.2rem;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: #f8f8f8;
      img {
        width: 38%;
        margin-top: 2rem;
      }
      p {
        // margin-top: -0.4rem;
        color: #808080;
        font-size: 0.22rem;
      }
    }
    .mining_title {
      width: 100%;
      height: 1rem;
      display: flex;
      // justify-content: space-between;
      align-items: center;
      font-size: 0.3rem;
      color: #000000;
      font-weight: bold;
      margin: auto;
      padding-left: 0.3rem;
      box-sizing: border-box;
      background: #ffffff;
      img {
        width: 0.44rem;
        margin-left: 0.1rem;
        margin-top: 0.1rem;
      }
    }
    .mining_top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: rgba(255, 70, 124, 1);
      font-size: 0.3rem;
      padding: 0 0.3rem;
      margin-top: 0.2rem;
      line-height: 0.6rem;

      img {
        width: 0.32rem;
        height: 0.3rem;
      }
      // }
      .mining_top_r {
        width: 1.5rem;
        position: relative;
        img {
          width: 0.5rem;
          height: 0.42rem;
          position: absolute;
          bottom: 0.1rem;
          right: -0.15rem;
        }
      }
    }
    .mining_item {
      color: rgba(136, 143, 169, 1);
      font-size: 0.24rem;
      width: 100%;
      margin: auto;
      overflow: hidden;
      position: relative;
      margin-top: 0.2rem;
      .ranking_item_l {
        .message_item_a {
          height: 1rem;
          // line-height: 0.96rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #ffffff;
          .mining_item_l {
            font-size: 0.28rem;
            padding-left: 0.25rem;
            color: #808080;
          }
          .mining_item_right {
            display: flex;
            justify-content: center;
            align-items: center;
            .mining_item_r {
              font-size: 0.34rem;
              font-weight: 300;
              color: #979797;
              span {
                font-size: 0.34rem;
                color: #979797;
                display: inline-table;
              }
            }
            .mining_item_i {
              width: 0.96rem;
              line-height: 0.1rem;
              .playimg {
                color: #a4a4a4;
              }
            }
          }
        }
        .mining_item_b {
          background-color: #f6f6f6;
          width: 100%;
          height: auto;
          height: 1.08rem;
          text-align: left;
          overflow: hidden;
          font-size: 0.24rem;
          // border-top: 0.01rem solid #808080;
          color: #808080;
          span {
            display: inline-block;
            width: 0.1rem;
            height: 0.1rem;
            border-radius: 50%;
            background-color: #a4a4a4;
          }
          div {
            width: 32%;
            margin-right: 0.1rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .mining_item_b_top {
            padding-left: 0.1rem;
            width: 100%;
            height: 0.54rem;
            line-height: 0.54rem;
            display: flex;
            justify-content: flex-start;
            align-items: center;
          }
          .mining_item_b_bottom {
            padding-left: 0.1rem;
            // border-top: 0.01rem solid #808080;
            width: 100%;
            height: 0.54rem;
            line-height: 0.54rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
        }
        &.ranking_item_l1 {
          margin-top: 0.2rem;
          .message_item_a {
            background-color: #fa9f47;
            .mining_item_l {
              color: #ffffffc0;
            }
            .mining_item_r {
              font-size: 0.34rem;
              font-weight: 300;
              color: #ffffff;

              span {
                font-size: 0.34rem;
                color: #ffffff;
                display: inline-table;
              }
            }
            .mining_item_i {
              width: 0.96rem;
              line-height: 0.1rem;
              .playimg {
                color: #ffd4aa;
              }
            }
          }
          .mining_item_b {
            background-color: #fffaf5;
            span {
              display: inline-block;
              width: 0.1rem;
              height: 0.1rem;
              border-radius: 50%;
              background-color: #fa9f47;
            }
          }
        }
      }
    }
  }
}
.bigtext {
  color: #000000;
  font-size: 0.36rem;
  padding-bottom: 0.1rem;
  border-bottom: 0.01rem solid #000;
  margin-bottom: 0.1rem;
}
.scontent {
  text-align: left;
  p {
    font-size: 0.28rem;
    line-height: 0.39rem;
    letter-spacing: 0.01rem;
  }
}
//切换字体的大小和颜色
.hong {
  color: #ff467c;
  font-size: 0.3rem;
}
.hui {
  color: #616c8a;
  font-size: 0.24rem;
}
.van-progress {
  height: 1rem;
}
// ._v-container[data-v-ecaca2b0] {
//   height: auto;
// }
// ._v-container {
//   height: auto !important;
// }
</style>
