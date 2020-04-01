<template>
  <div class="calculation">
    <navBar title="算力明细" left-text="返回" left-arrow fixed @click-left="onClickLeft"></navBar>
    <div class="content">
      <div class="calculation_top">
        <p class="dev_num">{{dev_details.power}}</p>
        <p>{{dev_details.dev_name}}</p>
      </div>
      <div class="calculation_bottom">
        <van-dropdown-menu>
          <van-dropdown-item v-model="value1" :options="option1" @change="get_status" />
          <van-dropdown-item v-model="value2" :options="option2" @change="get_thmonth" />
        </van-dropdown-menu>
        <div class="calculation_content" v-for="(item,index) in node_list" :key="index">
          <div class="content_left">
            <p>{{item.setnum}}</p>
            <p>{{item.dev_name}}</p>
          </div>
          <div class="content_right">
            <p>累计在线{{item.online}}</p>
            <p>{{item.current_time |formatDate}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import navBar from "../../components/navBar";
import { formatDate, transformTime } from "../../common/js/date.js";
import { get_app_dev_cp_list } from "../../common/js/api";
import { Toast } from "vant";
export default {
  data() {
    return {
      dev_details: {},
      value1: 0,
      value2: 1,
      option1: [
        { text: "全部", value: 0 },
        { text: "增加", value: 1 },
        { text: "减少", value: 2 }
      ],
      option2: [
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
      node_list: [
        // {
        //   setnum: "+1",
        //   dev_name: "我的西柚机1",
        //   online: "26h",
        //   current_time: 1583308519
        // },
        // {
        //   setnum: "-1",
        //   dev_name: "我的西柚机2",
        //   online: "94h",
        //   current_time: 1583337600
        // }
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
  components: {
    navBar: navBar
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
  mounted() {
    this.dev_details = this.$route.query.item_detail;
    console.log(this.dev_details);
    var date = new Date();
    this.value2 = date.getMonth() + 1;
    this.get_power_list();
  },
  methods: {
    ...mapMutations(["updateUser", "clearUser", "setdevsn", "setdevstatus"]),
    onClickLeft() {
      this.$router.go(-1);
    },
    get_power_list() {
      let parmas = new Object();
      parmas.logen_token = this.log_token;
      parmas.dev_sn = this.dev_details.dev_sn;
      parmas.month = this.value2;
      parmas.con_type = this.value1;
      parmas.cur_page = 0;
      get_app_dev_cp_list(parmas)
        .then(res => {
          console.log(res);
          if (res.status == 0) {
            this.updateUser({ log_token: res.data.token_info.login_token });
          } else {
            Toast(res.err_msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //筛选状态
    get_status() {
      console.log(this.value1);
    },
    //筛选月份
    get_thmonth() {
      console.log(this.value2);
    }
  }
};
</script>

<style lang="less" scoped>
/deep/.van-popup {
  width: 94%;
  padding: 3%;
  overflow-y: scroll;
}
.calculation {
  width: 100%;
  height: 100%;
  background: #f8fafb;
  .content {
    width: 100%;
    height: 100%;
    .calculation_top {
      width: 100%;
      height: 24.5%;
      background: url(../../assets/images/suanlimingxi.png) no-repeat;
      background-size: 100% 100%;
      background-position: top;
      p {
        color: #fff;
      }
      .dev_num {
        font-size: 0.6rem;
        font-weight: bold;
        padding-top: 1.3rem;
      }
    }
    .calculation_bottom {
      height: 77.5%;
      font-size: 0.24rem;
      border-radius: 0.2rem 0.2rem 0 0;
      background: #f8fafb;
      width: 100%;
      position: relative;
      top: -2%;
      .calculation_content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 94%;
        margin: auto;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 0.1rem 0.1rem 0px rgba(109, 164, 255, 0.06);
        border-radius: 0.1rem;
        margin-top: 0.2rem;
        height: 1.28rem;
        .content_left {
          width: 30%;
          p {
            font-size: 0.28rem;
            color: #333333;
          }
          p:nth-child(2) {
            font-size: 0.24rem;
            color: #666666;
          }
        }
        .content_right {
          width: 30%;
          p {
            font-size: 0.28rem;
            color: #333333;
          }
          p:nth-child(2) {
            font-size: 0.24rem;
            color: #666666;
          }
        }
      }
    }
  }
}
</style>