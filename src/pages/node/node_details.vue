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
      :z-index="0"
    >
      <div slot="left" class="alltitleleft">
        <van-icon name="arrow-left" color="#ffffff" />
      </div>
      <div slot="right" class="titright">
        <span>等级规则</span>
      </div>
    </van-nav-bar>

    <!--  -->
    <div class="content">
      <div class="calculation_top">
        <span class="recird_content_left" v-if="node_level==0">
          <img src="../../assets/images/putong.svg" alt />
          普通节点
        </span>
        <span class="recird_content_left" v-else-if="node_level==1">
          <img src="../../assets/images/huangjin.svg" alt />
          黄金节点
        </span>
        <span class="recird_content_left" v-else-if="node_level==2">
          <img src="../../assets/images/bojin.svg" alt />
          铂金节点
        </span>
        <span class="recird_content_left" v-else>
          <img src="../../assets/images/zuanshi.svg" alt />
          钻石节点
        </span>
        <van-progress color="#316CFC" pivot-text="num" pivot-color="#ffffff" :percentage="num" />
        <div class="progress_num">
          <span>0</span>
          <span ref="progress_con">{{progress_num}}</span>
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
        <!--  -->
        <div class="calculation_bottom_con">
          <div class="calculation_bottom_con_title">
            <img src="../../assets/images/mingxi_icon.png" alt /> 贡献值明细
          </div>

          <div class="income_con_btn">
            <van-dropdown-menu>
              <van-dropdown-item v-model="value11" :options="option1" @change="changedev()" />
              <van-dropdown-item v-model="value22" :options="option2" @change="changetime()" />
            </van-dropdown-menu>
          </div>
          <div class="calculation_bottom_con_body" v-for="(item,index) in datalist" :key="index">
            <div class="calculation_bottom_con_body_item">
              <span>{{item.grow}}</span>
              <span>累计在线{{(item.online_time/3600).toFixed(2)}}h</span>
              <span>{{item.date_time |formatDate}}</span>
            </div>
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
      num: 38,
      devtitle: "",
      fullWidth: 0,
      node_level: 0,
      progress_num: 0,
      value11: 0,
      value22: 0,
      option1: [
        { text: "全部", value: 0 },
        { text: "增长", value: 1 },
        { text: "减少", value: 2 }
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
      ],
      datalist: [
        { grow: "+1", online_time: 7492, date_time: 1585726943 },
        { grow: "+2", online_time: 243, date_time: 1585794943 }
      ]
    };
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
    this.devtitle = this.$route.query.dev.node_name;
    this.progress_num = this.$route.query.dev.contribution;
    this.num = (this.$route.query.dev.contribution / 2000).toFixed(2) * 100;
    this.fullWidth = document.documentElement.clientWidth;
    this.$refs.progress_con.style.left =
      this.fullWidth * 0.96 * (this.num / 100) - 13 + "px";
    this.get_cp_list(0);
  },
  methods: {
    ...mapMutations(["updateUser"]),
    get_cp_list(page) {
      let parmas = new Object();
      parmas.login_token = this.log_token;
      parmas.dev_sn = this.log_token;
      parmas.month = this.value22;
      parmas.con_type = this.value11;
      parmas.cur_page = page;
      get_app_dev_cp_list(parmas)
        .then(res => {
          console.log(res);
          if (res.status == 0) {
            this.updateUser({ log_token: res.data.token_info.login_token });
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
          } else {
            Toast(res.err_msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    changedev() {
      this.datalist = [];
      this.get_cp_list();
    },
    changetime() {
      this.datalist = [];
      this.get_cp_list();
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
      background: url(../../assets/images/shebeisuanli.png) no-repeat;
      background-size: 100% 100%;
      background-position: top;
      .recird_content_left {
        width: 38%;
        display: flex;
        align-items: center;
        text-align: left;
        color: #ffffff;
        padding-top: 1.6rem;
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
      .calculation_bottom_title {
        width: 80%;
        margin: auto;
        display: flex;
        justify-content: space-around;
        align-items: center;
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
        margin-top: 0.2rem;
        background-color: #f9f9fb;
        .calculation_bottom_con_title {
          display: flex;
          align-items: center;
          width: 100%;
          background-color: #f9f9fb;
          img {
            width: 5%;
            margin-right: 0.1rem;
          }
        }
        .income_con_btn {
          background-color: #f8fafb;
          width: 100%;
        }
        .calculation_bottom_con_body {
          width: 100%;
          height: auto;
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