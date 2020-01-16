<template>
  <div class="container">
    <van-nav-bar
      :title="title"
      left-a
      rrow
      left-arrow:true
      fixed
      @click-left="goRanking()"
      @click-right="onClickRight"
      :z-index="2000"
    >
      <div slot="left">排行榜</div>
      <div slot="right" class="titright">
        <img src="../../assets/images/equ_nav_icon_mess.png" class="titimg" alt />
      </div>
      <!-- <van-icon name="comment" slot="right" size="0.46rem" color="#808080" /> -->
    </van-nav-bar>
    <div class="xiala" :class="{isios:topshow,isandroid:!topshow}">
      <!-- <scroller
        style="background: #F8F8F8;margin-top: 1rem;height: 100%;"
        :on-refresh="refreshs"
        :on-infinite="infinite"
        ref="myscroller"
        class="scroller"
      >-->
      <Scroll
        ref="myscroller"
        :autoUpdate="true"
        :listenScroll="true"
        :pullDownConfig="{threshold: 90, // 触发 pullingDown 的距离
          stop: 0, // pullingDown 正在刷新 hold 时的距离
          txt: '松开刷新',}"
        @pullingDown="loadRefresh"
        @pullingUp="loadMore"
      >
        <!-- 网络异常 -->
        <div class="refresh" v-show="refresh">
          <div>
            <img src="../../assets/images/unusual_inset.png" alt />
            <p>网络异常，下拉刷新</p>
          </div>
        </div>
        <!--头部信息  -->
        <div class="my_income" v-show="!refresh">
          <div class="tel" @click="goBind()">
            <div class="tel_ranking_title">
              <span>{{phone_number}}</span>的设备清单
            </div>
            <div class="tel_ranking">
              <img src="../../assets/images/device_icon_add.png" />
            </div>
          </div>
          <!-- 没有请求到数据 -->
          <div class="nointerval" v-show="noint">
            <div>
              <img src="../../assets/images/sblb.png" />
              <p>您还没有设备，快去绑定新设备吧</p>
            </div>
          </div>
          <!-- 主体内容 -->
          <div class="my-top" v-show="!noint">
            <div class="ranking_title">
              在线
              <span>{{onlineCnt}}</span>台,离线
              <span>{{offlineCnt}}</span>台
            </div>
            <!-- <div class="ranking" @click="goRanking()">
            <img src="../../assets/images/paihangbang.png" alt>排行榜
            </div>-->
          </div>
          <div class="ranking_con" v-for="(item,index) in minerInfo" v-bind:key="index">
            <div
              class="ranking_con_item"
              v-bind:sn="item.dev_sn"
              @click="goInfo(item)"
              v-fb="{cls:'my_touchfeedback'}"
            >
              <div class="con_item_l">
                <div class="item_l_top">
                  <div class="item_l_name">{{item.dev_name}}</div>
                  <div class="dot" v-bind:style="{background:item.bgccolor}"></div>
                  <span v-bind:style="{color:item.spancolor}">{{item.equipment}}</span>
                </div>
                <div class="item_l_No">SN:{{item.dev_sn}}</div>
              </div>
              <div class="con_item_r">
                <!-- <div>
                  <van-button class="item_r_btn" @click="settingMiner(item)" v-show="devshow">启动</van-button>
                </div>-->
                <div class="item_r_img">
                  <img src="../../assets/images/moy.png" />
                </div>
              </div>
            </div>
          </div>
          <div class="bind_new" @click="goBind()">
            绑定新西柚机
            <img src="../../assets/images/device_btn_icon_add.png" alt />
          </div>
        </div>
        <!-- </scroller> -->
      </Scroll>
    </div>

    <tabbar v-model="active"></tabbar>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
// import navBar from "../../components/barBarActive";
import { TabbarItem, Toast, PullRefresh, Dialog, NavBar } from "vant";
import { formatDate, getdate } from "../../common/js/date.js";
import {
  getMiner,
  setTing,
  isbindinglist //获取我的设备列表
} from "../../common/js/api.js";
import { err } from "../../common/js/status";
import tabbar from "../../components/foot";
import { error, debug, log } from "util";
import Scroll from "vue-slim-better-scroll";
import BScroll from "better-scroll";
export default {
  data() {
    return {
      repeats: 0, //防止重复点击
      rescount: 0, //请求计数
      title: "西柚机管理",
      active: 0,
      refresh: false,
      topshow: false,
      noint: false,
      icon: { active: 0 },
      dev_online_state: "", //设备状态传入下一个页面
      devshow: false,
      onlineCnt: "0", //在线
      offlineCnt: "0", //离线
      devlist: [],
      localcache: [], //暂存
      allpage: 0, //总页码
      pagenum: 0, //当前页码
      minerInfo: [
        // {
        //   dev_name: "我的西柚机一",
        //   dev_sn: "FA12345GXete245u7002r428",
        //   dev_online_state: 0,
        //   equipment: "离线"
        // },
        // {
        //   dev_name: "我的西柚机二",
        //   dev_sn: "FA12345GXete245u7002r428",
        //   dev_online_state: 1,
        //   equipment: "在线"
        // },
        // {
        //   dev_name: "我的西柚机三",
        //   dev_sn: "FA12345GXete245u7002r428",
        //   dev_online_state: 0,
        //   equipment: "离线"
        // }
      ]
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
  mounted: function() {
    this.$refs.myscroller.scrollTop = -500;
    let castatus = navigator.userAgent; //获取手机系统
    if (castatus.indexOf("iPhone") > -1) {
      //如果是苹果手机
      this.topshow = true;
    } else {
      console.log("22222");
      this.topshow = false;
    }
    try {
      window.android.setStatusBarAndNavigationBarColor("", "#ffffff");
    } catch (e) {}
    try {
      window.webkit.messageHandlers.setStatusBarAndNavigationBarColor.postMessage(
        "#745af3,#5e73f3"
      );
    } catch (error) {}
    this.device(0, 0);
    // this.device(0);
    // if (this.minerInfo.length <= 0) {
    //   this.noint = true;
    // } else {
    //   this.noint = false;
    // }
  },
  methods: {
    ...mapMutations(["updateUser", "clearUser", "setdevsn", "setdevstatus"]),
    //获取我的设备列表
    device(page, key) {
      this.topshow = false;
      this.localcache = [];
      this.devlist = [];
      if (this.$parent.onLine == false) {
        Toast("无法连接网络，请检查网络状态");
        // this.$loading.show("无网络连接");
      } else {
        if (key != 1) {
          this.$loading.show("加载中...");
        }
        if (key == 2) {
          return false;
        }
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
        this.onlineCnt = 0;
        this.offlineCnt = 0;
        let params = new Object();
        params.login_token = this.log_token;
        params.page_num = page;
        console.log(params);
        isbindinglist(params)
          .then(res => {
            if (res) {
              this.$loading.hide();
            }
            this.repeats = 0;
            console.log(res);
            if (res.status == 0) {
              this.updateUser({ log_token: res.token_info.login_token });
              this.$refs.myscroller.scrollToTop();
              if (res.err_code == 0) {
                this.rescount = 0;
                this.refresh = false;
                this.noint = false;
                this.onlineCnt = res.data.online_cnt; //在线
                this.offlineCnt = res.data.offline_cnt; //离线
                this.allpage = res.data.total_page; //总页码
                this.pagenum = res.data.page_num;
                if (res.data.bind_devinfo_list.length > 0) {
                  this.localcache = res.data.bind_devinfo_list;
                  this.localcache.forEach((item, index, arr) => {
                   if (item.dev_online_state == 1) {
                      item.equipment = "在线";
                      item.spancolor = "#0FA427";
                      item.bgccolor = "#0FA427";
                      this.devshow = true;
                    } else {
                      item.equipment = "离线";
                      item.spancolor = "#333333";
                      item.bgccolor = "#8A8A8A";
                      this.devshow = false;
                    }
                    this.devlist.push(item);
                  });
                  if (res.data.page_num == 0) {
                    this.minerInfo = this.devlist;
                  } else {
                    this.minerInfo.push(...this.devlist); //数组拼接
                  }
                  // this.device(0);
                  if (this.minerInfo.length <= 0) {
                    this.noint = true;
                  } else {
                    this.noint = false;
                  }
                }
              } else if (res.err_code == 292) {
                this.rescount = 0;
                this.noint = true;
                // Toast({
                //   message: "您暂时没有设备，请先绑定设备",
                //   duration: 1000
                // });
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
              } else if (res.err_code == -5) {
                this.rescount++;
                this.device(0, 0);
              } else {
                this.rescount = 0;
                const sta = err[res.err_code]
                  ? this.$t(err[res.err_code])
                  : `请稍后重试 ${res.err_code}`;
                this.$toast(sta);
              }
            } else if (res.status == -999) {
              this.rescount = 0;
              this.$toast({
                message: "登录已过期，请重新登录",
                onClose: () => {
                  this.clearUser();
                  this.$router.push({ path: "/login" });
                }
              });
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
              this.device(0, 0);
            } else {
              this.rescount = 0;
              const tip = this.$backStatusMap[res.status] || err[res.status];
              const str = tip ? this.$t(tip) : `请稍后重试 ${res.status}`;
              this.$toast(str);
            }
          })
          .catch(error => {
            console.log("错误");
            this.repeats = 0;
            this.rescount++;
            this.device(0, 0);
            // Toast("网络错误，请重新请求181");
          });
      }
    },
    chenaecolor(arr) {
      for (let i = 0; i < 10; i++) {
        if (arr[i].dev_online_state == 0) {
          this.equipment = "离线";
          this.oldcolor = "#F33767";
          this.devshow = true;
        } else if (arr[i].dev_online_state == 1) {
          this.equipment = "在线";
          this.oldcolor = "#21E21C";
          this.devnameno = true;
        }
      }
    },
    //下拉刷新
    loadRefresh() {
      this.localcache = [];
      this.devlist = [];
      this.device(0, 1);
      this.scrollTop = -1;
    },
    //上拉加载
    loadMore() {
      let self = this;
      if (self.allpage - 1 <= self.pagenum) {
        self.$refs.myscroller.update(true); //关闭上拉
      } else {
        self.pagenum++;
        self.device(self.pagenum, 1);
        self.$refs.myscroller.update(false); //不关闭上拉
      }
    },
    goLink() {
      this.$router.push({ path: "/login" });
    },
    //西柚机详情
    goInfo(item) {
      this.setdevsn(item.dev_sn);
      this.setdevstatus(item.dev_online_state);
      setTimeout(() => {
        this.$router.push({
          path: "/managementinfo"
        });
      }, 200);
    },
    //绑定新西柚机
    goBind() {
      this.$router.push({ path: "/binding" });
    },
    //排行榜
    goRanking() {
      this.$router.push({ path: "/allranking" });
    },
    onClickRight() {
      this.$router.push({ path: "/message" });
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.device(0, 0);
    });
  },
  beforeRouteLeave(to, from, next) {
    next();
  },
  components: {
    tabbar: tabbar
  }
};
</script>

<style lang="less" scoped >
/deep/.van-nav-bar__text {
  color: #ffffff;
  font-size: 0.26rem;
}
.van-nav-bar {
  color: #fff;
  // box-shadow: 0 5px 5px #e6e6e6;
  background: linear-gradient(
    45deg,
    rgba(116, 90, 243, 1) 10%,
    rgba(92, 116, 243, 1) 100%
  );
  /* border-bottom: 0.01rem solid #616c8a; */
}
body {
  height: 100%;
  // overflow: hidden;
}

.container {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  // overflow: hidden;
  background: #f8f8f8;
  position: relative;
  .titright {
    line-height: 33px;
    .titimg {
      width: 50%;
      height: 50%;
    }
  }
  .xiala {
    height: 100%;
    position: relative;
    top: 1rem;
    .refresh {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 50%;
        margin-top: 3.4rem;
      }
    }
    // .scroller {
    //   -webkit-overflow-scrolling: touch;
    // }
  }
  .van-nav-bar__left {
    font-size: 0.24rem;
    padding-left: 0.1rem;
  }
}
.my_income {
  width: 100%;
  height: auto;
  // margin-top: 1rem;
  position: relative;
  z-index: 200;
  background-color: #f8f8f8;
  .tel {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 1rem;
    line-height: 1rem;
    .tel_ranking {
      width: 1rem;
      height: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .tel_ranking_title {
      padding-left: 0.2rem;
      color: #000;
      span {
        color: #6560f4;
      }
    }
    img {
      width: 0.51rem;
      height: 0.51rem;
      padding-right: 0.2rem;
    }
  }
  .nointerval {
    height: 8.5rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 50%;
    }
    p {
      color: #808080;
    }
  }
  .my-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 0.64rem;
    line-height: 0.64rem;

    .ranking {
      width: 1.34rem;
      height: 0.4rem;
      font-size: 0.3rem;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(255, 70, 124, 1);
      margin-right: 0.3rem;
      line-height: 0.4rem;
      img {
        width: 0.26rem;
        height: 0.26rem;
        margin-right: 0.1rem;
      }
    }
    .ranking_title {
      margin-left: 0.3rem;
      font-size: 0.24rem;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: #000000;
      line-height: 0.34rem;
      span {
        font-size: 0.32rem;
      }
    }
  }
  .ranking_con {
    width: 90%;
    height: 1.56rem;
    overflow: hidden;
    margin: auto;
    margin-top: 0.1rem;
    margin-bottom: 0.17rem;
    box-shadow: 0px 0px 10px 0px rgba(224, 224, 224, 0.64);
    .ranking_con_item {
      width: 100%;
      height: 1.56rem;
      background: #ffffff;
      border-radius: 0.12rem;
      display: flex;
      box-sizing: border-box;
      justify-content: space-between;
      align-items: center;
      color: #808080;
      margin: auto;
      padding-left: 0.3rem;
    }
    .con_item_l {
      display: flex;
      flex-direction: column;
      .item_l_top {
        display: flex;
        flex-direction: row;
        // line-height: 0.42rem;
        font-size: 0.3rem;
        align-items: center;
        .dot {
          width: 0.2rem;
          height: 0.2rem;
          border-radius: 50%;
          background-color: #0fa427;
          margin-right: 0.1rem;
        }
        img {
          width: 0.16rem;
          height: 0.16rem;
        }
        .item_l_name {
          text-align: left;
          margin-right: 0.2rem;
          font-size: 0.36rem;
          color: #000;
        }
        span {
          display: inline-block;
          text-align: left;
          font-size: 0.26rem;
        }
      }
      .item_l_No {
        color: #808080;
        text-align: left;
        line-height: 0.52rem;
      }
    }
    .con_item_r {
      display: flex;
      justify-content: flex-start;
      .item_r_btn {
        width: auto;
        height: 0.56rem;
        background: #ff467c;
        border-radius: 0.12rem;
        font-size: 0.3rem;
        display: flex;
        color: #ffffff;
        align-items: center;
        justify-content: center;
        margin-right: 0.2rem;
        border: none;
      }
      .item_r_img {
        width: 0.8rem;
        height: 1rem;
        line-height: 1.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          margin-top: 0.1rem;
          height: 60%;
          width: 80%;
          color: #fff;
        }
      }
    }
  }
  .bind_new {
    width: 2.61rem;
    height: 0.6rem;
    border-radius: 1rem;
    // border: 0.02rem dashed #646b97;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0.64rem;
    font-size: 0.24rem;
    font-weight: 400;
    color: #8d8d8d;
    background-color: #e9e9e9;
    line-height: 0.94;
    margin-bottom: 0.4rem;
    img {
      width: 20%;
      margin-left: 0.2rem;
    }
  }
}
.van-button {
  line-height: 0px;
}
.btn1,
.btn2 {
  width: 2rem;
  height: 1rem;
  color: #ffffff;
  background-color: #21e21c;
  line-height: 1rem;
  text-align: center;
  margin-top: 0.2rem;
}
.isios {
  top: 0 !important;
}
.isandroid {
  top: 1rem;
}
</style>
