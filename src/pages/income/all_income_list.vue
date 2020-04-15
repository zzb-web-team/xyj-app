<template>
  <div class="all_income">
    <navBar
      title="收益明细"
      left-arrow
      fixed
      @click-left="onClickLeft"
    ></navBar>
    <!--  -->
    <div class="income_con">
      <div class="income_con_top">
        <p>累计收益(gfm)</p>
        <p class="dev_num">{{ total_revenue }}</p>
      </div>
      <div class="income_con_btn" v-show="income_list.length > 0">
        <van-dropdown-menu>
          <van-dropdown-item
            v-model="value11"
            :options="option1"
            @change="changedev(value11)"
          />
          <van-dropdown-item
            v-model="value22"
            :options="option2"
            @change="changetime(value22)"
          />
        </van-dropdown-menu>
      </div>
      <div v-if="income_list.length > 0">
        <div
          class="income_con_body"
          v-for="(item, index) in income_list"
          :key="index"
        >
          <van-cell
            is-link
            :title="'+' + (item.user_total_profit / 100).toFixed(2) + 'gfm'"
            @click="go_income_detail(item)"
            >{{ item.date_stamp | formatDate }}</van-cell
          >
        </div>
      </div>
      <van-empty description="暂无数据" v-else />
    </div>
  </div>
</template>

<script>
import navBar from "../../components/navBar";
import { formatDate, transformTime } from "../../common/js/date.js";
import {
  getuserdevlist,
  isbindinglist,
  devrevenue,
  query_node_total_profit_info
} from "../../common/js/api";
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      total_revenue: 0,
      value1: "全部",
      value2: "全部",
      showdev: false,
      income_list: [
        // { user_total_profit: "+63934525535532235345353GFM", date_stamp: 1584962688 },
        // { user_total_profit: "+54625GFM", date_stamp: 1584452688 },
        // { user_total_profit: "+634GFM", date_stamp: 1584962688 },
        // { user_total_profit: "+2459GFM", date_stamp: 1584622688 },
        // { user_total_profit: "+5GFM", date_stamp: 1584969708 },
        // { user_total_profit: "+76GFM", date_stamp: 1584456688 }
      ],
      value11: 0,
      value22: 0,
      option1: [
        { text: "全部", value: 0 }
        // { text: "设备一", value: 1 },
        // { text: "设备二", value: 2 },
        // { text: "设备三", value: 3 }
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
    // this.total_revenue = this.$route.query.allshou;
    this.changetime();
    this.get_use_dev_list();
  },
  methods: {
    ...mapMutations(["updateUser", "clearUser"]),
    //获取用户设备列表
    get_use_dev_list() {
      let params = new Object();
      params.login_token = this.log_token;
      isbindinglist(params)
        .then(res => {
          if (res.status == 0) {
            this.updateUser({ log_token: res.token_info.login_token });
            res.data.bind_devinfo_list.forEach(item => {
              let devobj = new Object();
              devobj.text = item.dev_name;
              devobj.value = item.dev_sn;
              this.option1.push(devobj);
            });
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
          }
        })
        .catch(error => {
          // console.log(error);
        });
    },
    //获取收益列表
    get_income_list(page) {
      let params = new Object();
      params.start_time = this.starttime;
      params.end_time = this.endtime;
      params.login_token = this.log_token;
      params.query_type = 2;
      params.cur_page = page;
      getuserdevlist(params)
        .then(res => {
          if (res.status == 0) {
            this.updateUser({
              log_token: res.data.token_info.token
            });
            this.income_list = this.income_list.concat(
              res.data.user_profit_list
            );
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
          }
        })
        .catch(error => {
          // console.log(error);
        }); //获取每天总收益
    },
    //获取单台设备每日收益
    get_dev_income_day(page) {
      let params = new Object();
      params.login_token = this.log_token;
      params.start_time = this.starttime;
      params.end_time = this.endtime;
      params.cur_page = page;
      params.dev_sn = this.value11;
      devrevenue(params)
        .then(res => {
          if (res.status == 0) {
            //this.income_list=res.data.dev_profit_list;
            res.data.dev_profit_list.forEach(item => {
              let dev_obj = new Object();
              dev_obj.user_total_profit = item.dev_profit;
              dev_obj.date_stamp = item.date_stamp;
              this.income_list.push(dev_obj);
            });
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
          }
        })
        .catch(error => {
          //console.log(error);
        });
    },
    //获取单台设备收益
    get_dev_income(page) {
      let params = new Object();
      params.login_token = this.log_token;
      params.cur_page = page;
      params.start_time = this.starttime;
      params.end_time = this.endtime;
      params.dev_sn = this.value11;
      query_node_total_profit_info(params)
        .then(res => {
          if (res.status == 0) {
            // this.updateUser({
            //   log_token: res.data.token_info.token
            // });
            this.total_revenue = (res.data.total_profit / 100).toFixed(2);
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
          }
        })
        .catch(error => {});
    },
    //获取总收益
    get_all_income(num) {
      let params = new Object();
      let token = this.log_token;
      params.login_token = token;
      params.start_time = this.starttime;
      params.end_time = this.endtime;
      params.query_type = 1;
      params.cur_page = 0;
      params.dev_sn = "";
      getuserdevlist(params)
        .then(res => {
          if (res.status == 0) {
            this.updateUser({
              log_token: res.data.token_info.token
            });
            this.total_revenue = (res.data.user_total_profit / 100).toFixed(2);
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
          }
        })
        .catch(error => {});
    },
    changetime() {
      this.income_list = [];
      if (this.value22 == 0) {
        let querydate = 90;
        this.endtime = Date.parse(new Date().toLocaleDateString()) / 1000; //获取当前年月日时间戳
        this.starttime = this.endtime - querydate * 24 * 3600; //获取前九十天的时间戳
      } else {
        var _this = this;
        var date = new Date();
        var y = date.getFullYear();
        function computeTime(year, month) {
          _this.starttime = new Date(year, month - 1, 1).getTime() / 1000;
          _this.endtime = new Date(year, month, 0).getTime() / 1000;
        }
        computeTime(y, this.value22);
      }
      if (this.value11 == 0) {
        this.get_income_list();
      } else {
        this.get_dev_income_day();
      }
      this.get_all_income(0);
    },
    onClickLeft() {
      this.$router.go(-1);
    },
    go_income_detail(val) {
      this.$router.push({
        path: "/all_income_detail",
        query: { allshou: val }
      });
    },
    //下拉菜单--设备
    changedev(str) {
      this.income_list = [];
      if (this.value11 == 0) {
        this.get_all_income();
        this.get_income_list();
      } else {
        this.get_dev_income();
        this.get_dev_income_day();
      }
    },
    //下拉菜单--时间
    // changetime(str) {
    //   console.log(str);
    // },
    //取消按钮
    onCancel_dev() {
      this.showdev = false;
    }
  },
  components: {
    navBar: navBar
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
.all_income {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .income_con {
    margin-top: 0.92rem;
    .income_con_top {
      width: 100%;
      height: 24.5%;
      background: url(../../assets/images/shouyi_bgc.png) no-repeat;
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
    .income_con_body {
      background-color: #fff;
    }
  }
}
</style>
