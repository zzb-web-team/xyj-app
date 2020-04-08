<template>
  <div class="all_income">
    <van-nav-bar
      size="0.4rem"
      left-arrow
      fixed
      title="我的积分"
      @click-left="onClickLeft()"
      @click-right="onClickRight()"
      :z-index="0"
    >
      <div slot="left" class="alltitleleft">
        <van-icon name="arrow-left" color="#ffffff" />
      </div>
      <div slot="right" class="titright">
        <span>兑换</span>
      </div>
    </van-nav-bar>
    <!--  -->
    <div class="income_con">
      <div class="income_con_top">
        <p>积分(gfm)</p>
        <p class="dev_num">{{total_revenue}}</p>
      </div>
      <div class="income_con_btn">
        <van-dropdown-menu>
          <van-dropdown-item v-model="value11" :options="option1" @change="changegrow" />
          <van-dropdown-item v-model="value22" :options="option2" @change="changetime" />
        </van-dropdown-menu>
      </div>
      <!--  -->
      <div class="incon_con_body">
        <div class="incon_con_body_item" v-for="(item,index) in income_list" :key="index">
          <div class="incon_con_body_left">
            <p>{{item.num}}</p>
            <p>{{item.remaining}}gfm</p>
          </div>
          <div class="incon_con_body_right">
            <div>
              <p>{{item.income_type>0?"兑换":"收益"}}</p>
              <p>{{item.current_time |formatDate}}</p>
            </div>
            <van-icon name="arrow" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navBar from "../../components/navBar";
import { formatDate, transformTime } from "../../common/js/date.js";
import { authorization } from "../../common/js/api";
import { TabbarItem, Toast, PullRefresh, Dialog, NavBar } from "vant";
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      total_revenue: 0,
      activeNames: ["1"],
      showdev: false,
      system: "",
      income_list: [
        {
          num: "+6.70gfm",
          remaining: 1584962688,
          income_type: 1,
          current_time: 1585149384
        },
        {
          num: "+54.09gfm",
          remaining: 1584452688,
          income_type: 1,
          current_time: 1585149384
        },
        {
          num: "+6.03gfm",
          remaining: 1584962688,
          income_type: 1,
          current_time: 1585149384
        },
        {
          num: "+20.45gfm",
          remaining: 1584622688,
          income_type: 0,
          current_time: 1585149384
        },
        {
          num: "+9.88gfm",
          remaining: 1584969708,
          income_type: 0,
          current_time: 1585149384
        },
        {
          num: "+0.8gfm",
          remaining: 1584456688,
          income_type: 1,
          current_time: 1585149384
        }
      ],
      value11: 0,
      value22: 0,
      option1: [
        { text: "全部", value: 0 },
        { text: "收入", value: 1 },
        { text: "兑换", value: 2 }
      ],
      option2: [
        { text: "全部", value: 0 },
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
      ]
    };
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
  computed: mapState({
    log_token: state => state.user.log_token,
    phone_number: state => state.user.phone_number,
    user_name: state => state.user.user_name,
    user_sex: state => state.user.user_sex,
    charge_psd: state => state.user.charge_psd
  }),
  mounted() {
    this.total_revenue = this.$route.query.income;
    let date = new Date();
    this.value2 = date.getMonth() + 1;
    this.whatBrowser();
  },
  methods: {
    ...mapMutations(["updateUser", "clearUser"]),
    onClickLeft() {
      this.$router.go(-1);
    },
    onClickRight() {
      console.log("兑换");
      if (this.total_revenue <= 0) {
        Toast({
          message: "账户暂无积分",
          duration: 1500
        });
        return false;
      }
      const toast = Toast.loading({
        duration: 15000, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: "spinner",
        mask: false
      });
      let nowparam = new Object();
      nowparam.login_token = this.log_token;
      nowparam.login_type = 1;
      console.log(nowparam);
      authorization(nowparam)
        .then(res => {
          console.log(res);
          Toast.clear();
          if (res.status == 0) {
            if (res.data.bind_status == 1) {
              setTimeout(() => {
                this.$router.push({
                  path: "/tomoney"
                });
              }, 200);
            } else {
              Toast.fail({
                message: "未授权",
                duration: 400
              });
              console.log(this.system);
              if (this.system == "iPhone") {
                console.log(this.system);
                this.Authorization(res.url);
              } else {
                setTimeout(() => {
                  this.$router.push({
                    path: "/ding",
                    query: { url: res.url }
                  });
                }, 400);
              }
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
          } else if (res.status == -500) {
            this.noint = true;
          } else if (res.status == -900) {
            this.$router.push({ path: "/login" });
          } else if (res.status == -5) {
            Toast(`请求超时，请稍后重试`);
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
    //获去手机系统
    whatBrowser() {
      let u = navigator.userAgent;
      if (u.indexOf("Android") > -1 || u.indexOf("Linux") > -1) {
        //安卓手机
        this.system = "Android";
        // window.location.href = "mobile/index.html";
      } else if (u.indexOf("iPhone") > -1) {
        //苹果手机
        // window.location.href = "mobile/index.html";
        this.system = "iPhone";
      } else if (u.indexOf("Windows Phone") > -1) {
        //winphone手机
        this.system = "Windows Phone";
        // window.location.href = "mobile/index.html";
      }
    },
    changetime() {
      this.income_list = [];
    },
    changegrow() {
      this.income_list = [];
    },
    go_income_detail(data) {
      console.log(data);
    },
    show_dev() {
      this.showdev = true;
    },
    onSelect_dev(item) {
      this.showdev = false;
    },
    //取消按钮
    onCancel_dev() {
      this.showdev = false;
    }
  }
};
</script>

<style lang="less" scoped>
/deep/.van-button .van-icon {
  transform: rotate(90deg);
}
/deep/.van-cell--clickable {
  border-bottom: 1px solid #eeeeee;
}
/deep/.van-cell__title {
  text-align: left;
  width: 1.65rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/deep/.van-popup {
  width: 94%;
  padding: 3%;
  overflow-y: scroll;
}
/deep/.van-dropdown-menu {
  justify-content: space-between;
  background-color: #f8fafb;
}
/deep/.van-dropdown-menu__item {
  flex: none;
  width: 2rem;
  height: 0.6rem;
  border-radius: 1rem;
  background-color: #fff;
  margin: auto;
  border: 1px solid #eeeeee;
}
/deep/.van-collapse-item__content {
  background-color: #f9f9fd;
}
.all_income {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .titright {
    line-height: inherit;
    margin-right: 0.2rem;
  }
  .income_con {
    margin-top: 0.92rem;
    .income_con_top {
      width: 100%;
      height: 24.5%;
      background: url(../../assets/images/suanlimingxi.png) no-repeat;
      background-size: 100% 100%;
      background-position: top;
      p {
        color: #fff;
        padding-top: 0.2rem;
      }
      .dev_num {
        font-size: 0.6rem;
        font-weight: bold;
        padding-bottom: 0.2rem;
      }
    }
    .income_con_btn {
      background-color: #f8fafb;
      width: 100%;
    }
    .incon_con_body {
      .incon_con_body_item {
        display: flex;
        align-items: center;
        width: 92%;
        justify-content: space-between;
        padding: 0 4%;
        border-bottom: 1px solid #eeeeee;
        .incon_con_body_left {
          p {
            margin: 0.1rem 0;
            text-align: left;
          }
          p:nth-child(2) {
            color: #666666;
            font-size: 0.24rem;
          }
        }
        .incon_con_body_right {
          display: flex;
          align-items: center;
          text-align: right;
          div {
            margin-right: 0.1rem;
          }
          p {
            margin: 0.1rem 0;
          }
          p:nth-child(2) {
            color: #666666;
            font-size: 0.26rem;
          }
        }
      }
    }
  }
}
</style>