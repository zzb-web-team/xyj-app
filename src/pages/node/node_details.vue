<template>
  <div class="calculation">
    <!-- 头部 -->
    <van-nav-bar
      size="0.4rem"
      left-arrow
      fixed
      :title="devtitle"
      @click-left="onClickLeft()"
      @click-right="onClickRight()"
      :z-index="12"
    >
      <div slot="left" class="alltitleleft">
        <van-icon name="arrow-left" color="#ffffff" />
      </div>
      <div slot="right" class="titright">
        <span>等级规则</span>
      </div>
    </van-nav-bar>
    <div class="content">
      <div class="calculation_top">
        <span class="recird_content_left" v-if="progress_num == 0">
          <img src="../../assets/images/putong.svg" alt />
          普通节点
        </span>
        <span class="recird_content_left" v-else-if="progress_num == 2000">
          <img src="../../assets/images/huangjin.svg" alt />
          黄金节点
        </span>
        <span class="recird_content_left" v-else-if="progress_num == 6000">
          <img src="../../assets/images/bojin.svg" alt />
          铂金节点
        </span>
        <span class="recird_content_left" v-else>
          <img src="../../assets/images/zuanshi.svg" alt />
          钻石节点
        </span>
        <van-progress
          color="#316CFC"
          pivot-text="percentage_num"
          pivot-color="#ffffff"
          :percentage="percenb"
        />
        <div class="progress_num">
          <span>0</span>
          <span ref="progress_con">{{ progress_num }}</span>
          <span>2000</span>
        </div>
      </div>
      <div class="calculation_bottom">
        <div class="calculation_bottom_title">
          <div class="calculation_bottom_title_item">
            <div class="calculation_bottom_title_item_img">
              <img src="../../assets/images/huangjin.svg" alt />
            </div>
            <p>黄金节点</p>
          </div>
          <div class="calculation_bottom_title_item">
            <div class="calculation_bottom_title_item_img">
              <img src="../../assets/images/bojin.svg" alt />
            </div>
            <p>铂金节点</p>
          </div>
          <div class="calculation_bottom_title_item">
            <div class="calculation_bottom_title_item_img">
              <img src="../../assets/images/zuanshi.svg" alt />
            </div>
            <p>钻石节点</p>
          </div>
        </div>
        <div class="calculation_bottom_con">
          <div class="calculation_bottom_con_title">
            <img src="../../assets/images/mingxi_icon.png" alt /> 贡献值明细
          </div>

          <div class="income_con_btn">
            <van-dropdown-menu>
              <van-dropdown-item
                v-model="value11"
                :options="option1"
                @change="changedev()"
              />
              <van-dropdown-item
                v-model="value22"
                :options="option2"
                @change="changetime()"
              />
            </van-dropdown-menu>
          </div>
          <div v-if="datalist.length > 0">
          <vuu-pull
            ref="vuuPull"
            :options="pullOptions"
            v-on:loadTop="loadTop"
            v-on:loadBottom="loadBottom"
            :style="{ height: scrollerHeight }"
          >
              <div
                class="calculation_bottom_con_body"
                v-for="(item, index) in datalist"
                :key="index"
              >
                <div class="calculation_bottom_con_body_item">
                  <span
                    >{{ item.opt_value > 0 ? "+" : ""
                    }}{{ item.opt_value }}</span
                  >
                  <span v-if="item.type == 101">绑定设备</span>
                  <span v-else-if="item.type == 102">解绑设备</span>
                  <span v-else-if="item.type == 103">累计在线</span>
                  <span v-else-if="item.type == 104">离线</span>
                  <span v-else-if="item.type == 105">带宽利用</span>
                  <span v-else-if="item.type == 106">磁盘利用</span>
                  <span>{{ item.time_stamp | formatDate }}</span>
                </div>
              </div>

          </vuu-pull>
          </div>
            <van-empty class="node_nodata" description="暂无数据" v-else />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import navBar from "../../components/navBar";
import { formatDate, transformTime } from "../../common/js/date.js";
import { get_app_dev_cp_list, get_app_dev_con_list } from "../../common/js/api";
import loadind from "../../assets/images/spainpink.gif"; //动画
import boadind from "../../assets/images/spinwhile.gif"; //动画
import { Toast, Dialog } from "vant";
export default {
  data() {
    return {
      percentage_num: 0,
      percenb: 0,
      devtitle: "",
      progress_num: 0,
      value11: 0,
      value22: -1,
      option1: [
        { text: "全部", value: 0 },
        { text: "增长", value: 1 },
        { text: "减少", value: 2 }
      ],
      option2: [
        { text: "全部", value: -1 },
        { text: "1月", value: 1 },
        { text: "2月", value: 2 },
        { text: "3月", value: 3 },
        { text: "4月", value: 4 },
        { text: "5月", value: 5 },
        { text: "6月", value: 6 },
        { text: "7月", value: 7 },
        { text: "8月", value: 8 },
        { text: "9月", value: 9 },
        { text: "10月", value: 10 },
        { text: "11月", value: 11 },
        { text: "12月", value: 12 }
      ],
      pagenum: 0,
      allpage: 1,
      datalist: [
        // { opt_value: -1, online_time: 7492, time_stamp: 1585726943, type: 103 },
        // { opt_value: 2, online_time: 243, time_stamp: 1585794943, type: 106 },
        // { opt_value: -1, online_time: 7492, time_stamp: 1585726943, type: 105 },
        // { opt_value: 2, online_time: 243, time_stamp: 1585794943, type: 102 },
        // { opt_value: -1, online_time: 7492, time_stamp: 1585726943, type: 106 },
        // { opt_value: -2, online_time: 243, time_stamp: 1585794943, type: 105 },
        // { opt_value: 2, online_time: 243, time_stamp: 1585794943, type: 102 },
        // { opt_value: -1, online_time: 7492, time_stamp: 1585726943, type: 106 },
        // { opt_value: -2, online_time: 243, time_stamp: 1585794943, type: 105 },
        // { opt_value: 2, online_time: 243, time_stamp: 1585794943, type: 102 },
        // { opt_value: -1, online_time: 7492, time_stamp: 1585726943, type: 106 },
        // { opt_value: -2, online_time: 243, time_stamp: 1585794943, type: 105 }
      ],

      pullOptions: {
        isBottomRefresh: true,
        isTopRefresh: true,
        slideResistance: 5, //拉动阻力
        topTriggerHeight: 40, //下拉触发刷新的有效距离
        topPull: {
          loadingIcon: boadind
        },
        bottomPull: {
          loadingIcon: loadind,
          triggerWord:"加载更多"
        },
        bottomCloseElMove: false //关闭上拉加载
      }
    };
  },
  components: {
    navBar: navBar
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
        return window.innerHeight - 4.4 * (window.deviceWidth / 7.5) + "px";
      } else {
        return window.innerHeight - 50 - 4.4 * 50 + "px";
      }
    }
  },
  filters: {
    //时间戳转时间
    formatDate(time) {
      if (parseFloat(time).toString() == "NaN") {
        return time;
      } else {
        time = time * 1000;
        let date = new Date(time);
        return formatDate(date, "yyyy-MM-dd");
      }
    }
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

    this.devtitle = this.$route.query.dev.node_name;
    this.progress_num = this.$route.query.dev.con_value;

    if (this.progress_num < 2000) {
      this.percenb = parseInt((this.progress_num / 2000).toFixed(2) * 100);
    } else if (this.progress_num >= 2000 && this.progress_num < 6000) {
      this.percenb = parseInt((this.progress_num / 6000).toFixed(2) * 100);
    } else if (this.progress_num >= 6000) {
      this.percenb = parseInt((this.progress_num / 18000).toFixed(2) * 100);
    }
    console.log(this.progress_num, this.percenb);
    // var date = new Date();
    // this.value22 = date.getMonth() + 1;
    this.get_cp_list(0);
  },
  methods: {
    ...mapMutations(["updateUser", "clearUser", "setdevsn", "setdevstatus"]),
    //下拉刷新
    loadTop() {
      setTimeout(() => {
        this.get_cp_list(0);
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
          this.get_cp_list(this.pagenum);
        } else {
          this.$refs.vuuPull.closeLoadBottom();
        }
        if (this.$refs.vuuPull.closeLoadBottom) {
          this.$refs.vuuPull.closeLoadBottom();
        }
      }, 500);
    },
    get_cp_list(page) {
      let parmas = new Object();
      parmas.login_token = this.log_token;
      if (this.$route.query.dev.dev_sn) {
        parmas.dev_sn = this.$route.query.dev.dev_sn;
      } else {
        parmas.dev_sn = JSON.parse(sessionStorage.getItem("node_sn"));
      }

      parmas.month = this.value22;
      parmas.con_type = this.value11;
      parmas.cur_page = page;
      get_app_dev_con_list(parmas)
        .then(res => {
          if (res.status == 0) {
            this.$nextTick(() => {
              if (parmas.cur_page == 0) {
                this.datalist = res.data.con_list;
              } else {
                this.datalist = this.datalist.concat(res.data.con_list);
              }
            });
            this.allpage=res.data.total_page;
            this.updateUser({ log_token: res.data.token_info.token });
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
          } else {
            Toast(res.err_msg);
          }
        })
        .catch(error => {
          //  console.log(error);
        });
    },
    changedev() {
      this.datalist = [];
      this.get_cp_list(0);
    },
    changetime() {
      this.datalist = [];
      this.get_cp_list(0);
    },
    onClickLeft() {
      this.$router.go(-1);
    },
    onClickRight() {
      this.$router.push({
        path: "/node_rules"
      });
    }
  }
};
</script>

<style lang="less" scoped>
/deep/.van-progress {
  // top: 2.2rem;
  width: 90%;
  margin: auto;
}
/deep/.van-popup {
  width: 94%;
  padding: 3%;
  overflow-y: scroll;
}
/deep/.van-dropdown-menu {
  justify-content: space-between;
  background-color: #f9f9fb;
}
/deep/.van-dropdown-menu__item {
  flex: none;
  width: 1.5rem;
  height: 0.6rem;
  border-radius: 0.1rem;
  background-color: #fff;
  margin: auto;
  border: none;
}
/deep/.van-collapse-item__content {
  background-color: #f9f9fb;
}
/deep/.van-hairline--top-bottom::after,
.van-hairline-unset--top-bottom::after {
  border: none;
}
/deep/.van-dropdown-menu__item:nth-child(1) {
  margin-left: 0;
}
/deep/.van-dropdown-menu__item:nth-child(2) {
  margin-right: 0;
}
.titright {
  line-height: 44px;
  padding-right: 0.2rem;
  span {
    color: #fff;
  }
}
/deep/.van-nav-bar {
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
/deep/.van-empty {
  height: 9rem;
}
.calculation {
  width: 100%;
  height: 100%;
  background: #f8fafb;
  overflow: hidden;
  .content {
    // width: 100%;
    // height: 100%;
    margin-top: 0.92rem;
    .calculation_top {
      width: 100%;
      height: 2rem;
      background: url(../../assets/images/shebeisuanli.png) no-repeat;
      background-size: 100% 100%;
      background-position: top;
      position: relative;
      z-index: 11;
      .recird_content_left {
        width: 38%;
        display: flex;
        align-items: center;
        text-align: left;
        color: #ffffff;
        // padding-top: 1.6rem;
        margin-bottom: 0.2rem;
        padding-left: 4%;
        img {
          width: 15%;
          margin-right: 0.1rem;
        }
      }
      .progress_num {
        text-align: left;
        color: #ffffff;
        font-size: 0.2rem;
        position: relative;
        span {
          position: absolute;
        }
        span:nth-child(1) {
          left: 4%;
        }
        span:nth-child(2) {
          left: 50%;
        }
        span:nth-child(3) {
          left: 88%;
        }
      }
    }
    .calculation_bottom {
      height: 77.5%;
      font-size: 0.24rem;
      border-radius: 0.2rem 0.2rem 0 0;
      background: #ffffff;
      width: 100%;
      position: relative;
      top: -2%;
      // display: flex;
      // flex-direction: column;
      z-index: 1;
      .calculation_bottom_title {
        width: 80%;
        padding-left: 10%;
        padding-right: 10%;
        padding-bottom: 0.2rem;
        margin: auto;
        display: flex;
        justify-content: space-around;
        align-items: center;
        position: relative;
        z-index: 20;
        background: #ffffff;
        .calculation_bottom_title_item {
          margin-top: 0.4rem;
          font-size: 0.24rem;
          color: #333333;
          .calculation_bottom_title_item_img {
            width: 0.64rem;
            height: 0.64rem;
            line-height: 0.64rem;
            margin-bottom: 0.2rem;
            background: rgba(255, 255, 255, 1);
            box-shadow: 0 0.08rem 0.01rem 0 rgba(108, 135, 183, 0.1);
            border-radius: 0.1rem;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
              width: 80%;
            }
          }
        }
      }

      .calculation_bottom_con {
        width: 92%;
        text-align: left;
        padding-left: 4%;
        padding-right: 4%;
        background-color: #f9f9fb;
        // flex: 1;
        // position: relative;
        // z-index: 0;
        .calculation_bottom_con_title {
          display: flex;
          align-items: center;
          height: 0.6rem;
          padding-top: 0.1rem;
          width: 100%;
          background-color: #f9f9fb;
          position: relative;
          z-index: 20;
          img {
            width: 5%;
            margin-right: 0.1rem;
          }
        }
        .income_con_btn {
          background-color: #f8fafb;
          width: 100%;
          position: relative;
          z-index: 11;
        }
        .calculation_bottom_con_body {
          .calculation_bottom_con_body_item {
            width: 92%;
            padding-left: 4%;
            padding-right: 4%;
            background-color: #fff;
            margin: auto;
            height: 0.88rem;
            line-height: 0.88rem;
            background: rgba(255, 255, 255, 1);
            border-radius: 0.1rem;
            margin-top: 0.1rem;
            display: flex;
            justify-content: space-between;
            span {
              font-size: 0.28rem;
              color: #333333;
            }
            span:nth-child(1) {
              width: 1.8rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
      }
    }
  }
}
</style>
