<template>
  <div class="container">
    <navBar :title="title" :right-text="title">
      <van-icon name="search" slot="right" />
    </navBar>
    <Scroll
      ref="myscroller"
      :autoUpdate="true"
      :listenScroll="true"
      @pullingDown="loadRefresh"
      @pullingUp="loadMore"
    >
      <div class="nointerval" v-show="noint">
        <div>
          <img src="../../assets/images/earnings_illustration4.png" alt />
          <p>暂无兑换记录</p>
        </div>
      </div>
      <div class="xiala">
        <!-- 网络异常 -->
        <div class="refresh" v-show="refresh">
          <div>
            <img src="../../assets/images/unusual_inset.png" alt />
            <p>网络异常，下拉刷新</p>
          </div>
        </div>
        <div class="ranking_con" v-show="!refresh">
          <div class="ranking_con_item" v-for="(item,index) in moneyArr" v-bind:key="index">
            <div class="con_item_l">
              <div class="item_l_name">
                <p>{{((item.xb_amount)/10000).toFixed(4)}}</p>
                <span>{{item.xb_wallet_type}}</span>
                <!-- <p class="item_p">POC</p> -->
              </div>
            </div>
            <div class="con_item_r">
              <div class="item_r_btn">{{item.xb_deal_ts| formatDate}}</div>
            </div>
          </div>
        </div>
      </div>
    </Scroll>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import navBar from "../../components/navBar";
import { Tabbar, Toast, Dialog, List } from "vant";
import { redeems } from "../../common/js/api.js";
import { err } from "../../common/js/status";
import { formatDate } from "../../common/js/date.js";
import Scroll from "vue-slim-better-scroll";

export default {
  data() {
    return {
      repeats: 0, //防止重复点击
      rescount: 0, //请求计数
      title: "兑换记录",
      noint: false,
      loading: false,
      finished: false,
      allpage: 0, //总页码
      pagenum: 0, //页码
      isLoading: false, //控制上拉加载的加载动画
      refresh: false,
      showStatus: false,
      moneyArr: [
        // {
        //   xb_amount: "-0.01",
        //   xb_deal_ts: "2013-12-01"
        // },
        // {
        //   xb_amount: "-0.05",
        //   xb_deal_ts: "2013-12-02"
        // }
      ]
    };
  },
  filters: {
    //时间戳转时间
    formatDate(time) {
      time = time * 1000;
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd");
    }
  },
  computed: mapState({
    log_token: state => state.user.log_token,
    phone_number: state => state.user.phone_number,
    user_name: state => state.user.user_name,
    user_sex: state => state.user.user_sex,
    charge_psd: state => state.user.charge_psd
  }),
  mounted: function() {
    this.redemptionrecord(0, 0);
  },
  methods: {
    ...mapMutations(["updateUser", "clearUser"]),
    //下拉刷新
    loadRefresh() {
      this.moneyArr = [];
      this.redemptionrecord(0, 1);
    },
    //上拉加载
    loadMore() {
      let self = this;
      if (self.allpage - 1 <= self.pagenum) {
        self.$refs.myscroller.update(true); //关闭上拉
      } else {
        self.pagenum++;
        self.redemptionrecord(self.pagenum, 1);
        self.$refs.myscroller.update(false); //不关闭上拉
      }
    },
    goLink() {
      this.$router.push({ path: "/login" });
    },
    redemptionrecord(pages, key) {
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
          Toast(`请求超时，请稍后重试`);
          return false;
        }
        let params = new Object();
        let querydate = 7;
        // let endtime = Date.parse(new Date()) / 1000; //获取当前日期时间戳
        let endtimes = Date.parse(new Date().toLocaleDateString()) / 1000; //获取当前年月日时间戳
        let starttime = endtimes - querydate * 24 * 3600; //获取前7天的时间戳
        let token = this.log_token;
        params.start_time = starttime;
        params.end_time = endtimes + 24 * 3600;
        params.login_token = token;
        params.cur_page = pages;
        redeems(params) //兑换记录
          .then(res => {
            if (res) {
              this.$loading.hide();
            }
            this.repeats = 0;
            if (res.status == 0) {
              this.updateUser({ log_token: res.token_info.token });
              if (res.err_code == 0) {
                this.rescount = 0;
                this.moneyArr = this.moneyArr.concat(res.deal_info_list);
                this.allpage = res.total_page;
                this.pagenum = res.page;
              } else if (res.err_code == -5) {
                this.rescount++;
              } else if (res.err_code == 500) {
                this.noint = true;
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
            } else if (res.status == -900) {
              this.rescount = 0;
              this.$router.push({ path: "/login" });
            } else if (res.status == -5) {
              this.rescount++;
              this.redemptionrecord(0,0);
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
              this.rescount = 0;
              const tip = this.$backStatusMap[res.status] || err[res.status];
              const str = tip ? this.$t(tip) : `请稍后重试 ${res.status}`;
              this.$toast(str);
            }
          })
          .catch(error => {
            this.repeats = 0;
            this.rescount++;
            this.redemptionrecord(0,0);
            // Toast("网络错误，请重新请求");
          });
      }
    }
  },
  components: {
    navBar: navBar
  }
};
</script>

<style lang="less" scoped >
.container {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  overflow: hidden;
  background: #f8f8f8;
  .xiala {
    height: 100%;
    .refresh {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 50%;
      }
    }
  }
  .nointerval {
    height: 11rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 50%;
      margin-top: 1rem;
    }
    p {
      margin-top: -0.6rem;
      color: #808080;
    }
  }
  .ranking_con {
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin-top: 0.2rem;
    // margin-top: 1rem;
    .ranking_con_item {
      display: flex;
      padding: 0rem 0.2rem;
      box-sizing: border-box;
      justify-content: space-between;
      align-items: center;
      position: relative;
      font-size: 0.28rem;
      width: 6.9rem;
      height: 1rem;
      border-radius: 0.12rem;
      margin: 0 auto;
      margin-top: 0.08rem;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 0px 10px 0px rgba(232, 232, 232, 0.6);
    }
    .con_item_l {
      display: flex;
      flex-direction: column;
      .item_l_name {
        text-align: left;
        color: #000000;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        p {
          font-size: 0.34rem;
        }
        p:nth-child(1) {
          color: #000000;
        }
        .item_p {
          font-size: 0.28rem;
        }
        span {
          font-size: 0.26rem;
        }
      }
      .item_l_No {
        color: #9ea9d3;
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
        font-size: 0.22rem;
        align-items: center;

        justify-content: center;
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
</style>
