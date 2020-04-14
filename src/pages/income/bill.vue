<template>
  <div class="container">
    <navBar :title="title" :right-text="title">
      <van-icon name="search" slot="right" />
    </navBar>
    <!-- <scroller
      style="margin-top:1.2rem;background: #F8F8F8;height: 100%;"
      :on-refresh="refreshs"
      :on-infinite="infinite"
      ref="myscroller"
      class="scroller"
    >-->
    <div class="xiala">
      <Scroll
        ref="myscroller"
        class="scrollContainer"
        :autoUpdate="true"
        :listenScroll="true"
        @pullingDown="loadRefresh"
        @pullingUp="loadMore"
      >
        <div class="nointerval" v-show="noint">
          <div>
            <img src="../../assets/images/earnings_illustration4.png" alt />
            <p>暂无积分收益哦，快快绑定设备赚取积分吧</p>
          </div>
        </div>
        <!-- 网络异常 -->
        <div class="refresh" v-show="refresh">
          <div>
            <img src="../../assets/images/unusual_inset.png" alt />
            <p>网络异常，下拉刷新</p>
          </div>
        </div>
        <div class="ranking_con" v-show="!refresh" ref="sortMenu">
          <div
            class="ranking_con_item"
            v-for="(item,index) in moneyListdetails"
            v-bind:key="index"
            v-bind:id="item.date_stamp"
            @click="showList(item,item.date_stamp)"
            v-fb="{cls:'my_touchfeedback'}"
          >
            <div class="con_item_l">
              <div class="item_l_name">
                <p>+{{((item.user_total_profit)/1000000).toFixed(6)}}</p>
                <!-- <span>POC</span> -->
                <!-- <p class="item_p">POC</p> -->
              </div>
              <!-- <div class="item_l_No">
                在线西柚机
                <span>{{item.moneyOnline}}</span>台 离线西柚机
                <span>{{item.moneyOffline}}</span>台
              </div>-->
            </div>
            <div class="con_item_r">
              <!-- <div class="item_r_btn">{{item.date_stamp}}</div> -->
              <div class="item_r_btn">{{item.date_stamp | formatDate}}</div>
              <div class="item_r_img">
                <img src="../../assets/images/evenmore.png" />
              </div>
            </div>
          </div>
        </div>
        <!-- </scroller> -->
        <div class="foot"></div>
      </Scroll>
    </div>
    <!-- </van-pull-refresh> -->
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import navBar from "../../components/navBar";
import { Tabbar, TabbarItem, Toast, Dialog, List } from "vant";
import { getuserdevlist } from "../../common/js/api.js";
import { formatDate } from "../../common/js/date.js";
import { error } from "util";
import { err } from "../../common/js/status";
import Scroll from "vue-slim-better-scroll";
import BScroll from "better-scroll";
export default {
  data() {
    return {
      repeats: 0, //防止重复点击
      rescount: 0, //请求计数
      title: "收益明细",
      refresh: false,
      time: "",
      noint: false,
      loading: false,
      numpag: 0, //总页码
      curpage: 0, //页码
      nelist: [],
      scrollTop:"",
      devlist: [],
      devlist_id: "",
      moneyListdetails: [
        // {
        //   user_total_profit: 200000,
        //   moneyOffline: "1",
        //   moneyOnline: "3",
        //   date_stamp: 1557986072
        // },
        // {
        //   user_total_profit: 156000,
        //   moneyOffline: "1",
        //   moneyOnline: "3",
        //   date_stamp: 1557986072
        // },
        //  {
        //   user_total_profit: 156000,
        //   moneyOffline: "1",
        //   moneyOnline: "3",
        //   date_stamp: 1557986072
        // },
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
    // this.initScroll();
    this.revenue(0);
  },
  methods: {
    ...mapMutations(["updateUser", "clearUser"]),
    //下拉刷新
    loadRefresh() {
      this.revenue(0, 1);
    },
    //上拉加载
    loadMore() {
      let self = this;
      if (self.numpag - 1 <= self.curpage) {
        self.$refs.myscroller.update(true); //关闭上拉
      } else {
        self.curpage++;
        self.revenue(self.curpage, 1);
        self.$refs.myscroller.update(false); //不关闭上拉
      }
    },
    //存储混动距离
    mea(pos) {
      if (pos) {
        let h = Math.round(pos.y);
        sessionStorage.askPositon = h;
      }
    },
    //去下一页
    showList(item, id) {
      this.scrollTop = document.body.scrollTop|| document.documentElement.scrollTop || window.pageYOffset
      this.devlist_id = id;
      setTimeout(() => {
        this.$router.push({
          name: "billdetail",
          params: {
            othertime: item.date_stamp, //时间
            userprofit: item.user_total_profit, //总收益
            devOffline: item.moneyOffline, //离线
            devonline: item.moneyOnline //在线
          }
        });
      }, 200);
    },
    //查询和收益
    revenue(page, key) {
      this.nelist = [];
      this.devlist = [];
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

        let params = new Object();
        let querydate = 90;
        let endtimes = Date.parse(new Date().toLocaleDateString()) / 1000; //获取当前年月日时间戳
        let starttime = endtimes - querydate * 24 * 3600; //获取前九十天的时间戳
        let token = this.log_token;
        params.start_time = starttime;
        params.end_time = endtimes;
        params.login_token = token;
        params.query_type = 2;
        params.cur_page = page;
        getuserdevlist(params) //获取每天总收益
          .then(res => {
            if (res) {
              this.$loading.hide();
            }
            this.repeats = 0;
            if (res.status == 0) {
              this.updateUser({
                log_token: res.data.token_info.token
              });
              if (res.err_code == 0) {
                this.rescount = 0;
                this.refresh = false;
                this.numpag = res.data.total_page; //总页码
                this.curpage = res.data.page; //页码
                if (!res.data.user_profit_list) {
                  this.noint = true;
                  return false;
                }
                this.nelist = res.data.user_profit_list;
                if (this.nelist.length <= 0 ) {
                  this.noint = true;
                  this.moneyListdetails=[];
                } else {
                  this.noint = false;
                  if(res.data.page == 0){
                    this.moneyListdetails = this.devlist;
                  }
                  this.nelist.forEach((item, index, arr) => {
                    this.moneyListdetails.push(item);
                  });
                }
                this.$refs.myscroller.scrollToTop();
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
              this.noint = false;
              this.rescount++;
              this.revenue(0);
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
            this.revenue(0);
            // Toast("网络错误，请重新请求");
          });
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    if (!sessionStorage.askPositon || from.name != "billdetail") {
      sessionStorage.askPositon = "";

      next(vm => {
        vm.revenue(0, 0);
        vm.$refs.myscroller.scrollTo(0, -10, true);
      });
    } else {
      next(vm => {
        if (vm && vm.$refs.myscroller) {
          //通过vm实例访问this
          setTimeout(function() {
            try {
              setTimeout(() => {
                vm.$refs.myscroller.scrollTo(
                  0,
                  sessionStorage.askPositon,
                  true
                );
              }, 10);
            } catch (error) {
              setTimeout(() => {
                window.scrollTo(0, sessionStorage.askPositon, true);
              }, 10);
            }
          }, 0); //同步转异步操作
        }
      });
    }
  },
  beforeRouteLeave(to, from, next) {
    // 记录离开时的位置;
    sessionStorage.askid = this.scrollTop;
    sessionStorage.cachedata = this.moneyListdetails;
    next();
  },

  components: {
    navBar: navBar
  }
};
</script>

<style lang="less" scoped >
body {
  height: 100%;
  // overflow: hidden;
}
.container {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  overflow: hidden;
  background: #f8f8f8;
  position: relative;
  .xiala {
    height: 98%;
    margin-top: 2%;
    position: relative;
    top: 0.1rem;
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
        margin-top: 4rem;
      }
      // .scroller {
      //   -webkit-overflow-scrolling: touch;
      // }
    }
  }
  .nointerval {
    // height: 100%;
    margin-top: 1rem;
    background-color: #f8f8f8;
    position: relative;
    z-index: 2001;
    width: 100%;
    height: 11rem;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 50%;
    }
    p {
      margin-top: -0.6rem;
      font-size: 0.24rem;
      color: #808080;
    }
  }
  .ranking_con {
    width: 100%;
    height: auto;
    margin-top: 0.4rem;
    position: relative;
    z-index: 200;
    background-color: #f8f8f8;
    .ranking_con_item {
      display: flex;
      padding: 0rem 0.2rem;
      box-sizing: border-box;
      justify-content: space-between;
      align-items: center;
      font-size: 0.28rem;
      width: 6.9rem;
      height: 1.06rem;
      background: #ffffff;
      border-radius: 0.12rem;
      box-sizing: border-box;
      margin: 0 auto;
      margin-top: 0.05rem;
      box-shadow: 0px 0px 18px 0px rgba(232, 232, 232, 1);
    }
    .con_item_l {
      display: flex;
      flex-direction: column;
      .item_l_name {
        text-align: left;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        p {
          color: #000000;
          font-size: 0.34rem;
          &.item_p {
            font-size: 0.34rem;
          }
        }
        span {
          color: #ccc;
          font-size: 0.2rem;
          margin-left: 0.1rem;
        }
      }
      .item_l_No {
        color: #9ea9d3;
        font-size: 0.2rem;
        span:nth-child(1) {
          color: #3fccf7;
        }
        span:nth-child(2) {
          color: #f7db3f;
        }
      }
    }
    .con_item_r {
      display: flex;
      justify-content: flex-start;
      .item_r_btn {
        width: auto;
        height: 0.4rem;
        display: flex;
        color: #aaaaaa;
        align-items: center;
        justify-content: center;
        font-size: 0.22rem;
        p {
          color: #aaaaaa;
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
          height: 0.26rem;
        }
      }
    }
  }
}
.vue-slim-better-scroll__pulldown {
  z-index: 0;
}
.foot {
  width: 100%;
  height: 0.05rem;
  opacity: 0;
}
</style>
