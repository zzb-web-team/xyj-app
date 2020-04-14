<template>
  <div class="help_center">
    <navBar></navBar>
    <div class="help_center_content">
      <div class="help_center_content_top">
        <p>帮助中心</p>
      </div>
      <div class="help_center_content_con">
        <!-- <div class="help_center_content_con_item">
          <div class="con_item_left">
            <div>
              <img src="../../assets/images/help_shebei.png" alt />
            </div>
            <div>西柚机设备</div>
            <van-icon name="arrow-down" />
          </div>
          <div class="con_item_right">
            <p>如何绑定设备?</p>
            <p>设备链接电源后不在线怎么处理?</p>
          </div>
        </div>-->

        <!-- <div class="help_center_content_con_item">
          <div class="con_item_left">
            <div>
              <img src="../../assets/images/help_shouyi.png" alt />
            </div>
            <div>收益</div>
            <van-icon name="arrow-down" />
          </div>
          <div class="con_item_right">
            <p>如何绑定设备?</p>
            <p>设备链接电源后不在线怎么处理?</p>
          </div>
        </div>-->

        <!-- <div class="help_center_content_con_item">
          <div class="con_item_left">
            <div>
              <img src="../../assets/images/help_shouyi.png" alt />
            </div>
            <div>积分兑换</div>
            <van-icon name="arrow-down" />
          </div>
          <div class="con_item_right">
            <p>如何绑定设备?</p>
            <p>设备链接电源后不在线怎么处理?</p>
          </div>
        </div>-->
        <div
          class="help_center_content_con_item"
          v-for="(item, index) in datalist"
          :key="index"
        >
          <div class="con_item_left" @click="show_problem(item, index)">
            <div>
              <img src="../../assets/images/help_shouyi.png" alt />
            </div>
            <div>{{ item.title }}</div>
            <van-icon name="arrow-down" />
          </div>
          <div class="con_item_right">
            <p
              v-for="(items, indexs) in item.problem"
              :key="indexs + 'problem'"
              v-show="indexs < item.aoenbum"
              @click="go_help_detail(items)"
            >
              {{ items.problem_item }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import navBar from "../../components/navBar";
import { Tabbar, TabbarItem, Toast, Dialog, List } from "vant";
import {
  app_query_help_cat_info,
  app_query_help_item_info
} from "../../common/js/api";
export default {
  data() {
    return {
      datalist: [
        {
          title: "收益",
          title_id: 0,
          aoenbum: 2,
          problem: [
            { problem_item: "如何绑定设备", problem_id: 0 },
            { problem_item: "搜索不到设备怎么办", problem_id: 1 },
            { problem_item: "绑定设备多久才会产生收益", problem_id: 2 },
            { problem_item: "绑定设备多久才会产生收益", problem_id: 3 },
            { problem_item: "绑定设备多久才会产生收益", problem_id: 4 },
            { problem_item: "绑定设备多久才会产生收益", problem_id: 5 },
            { problem_item: "绑定设备多久才会产生收益", problem_id: 6 },
            { problem_item: "绑定设备多久才会产生收益", problem_id: 7 },
            { problem_item: "绑定设备多久才会产生收益", problem_id: 8 }
          ]
        },
        {
          title: "积分兑换",
          title_id: 1,
          aoenbum: 2,
          problem: [
            { problem_item: "积分有什么用", problem_id: 0 },
            { problem_item: "积分兑换比例是多少", problem_id: 1 },
            { problem_item: "积分能不直接交易吗", problem_id: 2 }
          ]
        }
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
  mounted() {
    this.get_help();
  },
  methods: {
    ...mapMutations(["updateUser", "clearUser", "setdevsn", "setdevstatus"]),
    show_problem(sta, num) {
      if (sta.aoenbum == 2) {
        this.datalist[num].aoenbum = 5e5;
      } else {
        this.datalist[num].aoenbum = 2;
      }
    },
    go_help_detail(datadetail) {
      this.$router.push({
        path: "help_detail",
        query: { problem: datadetail }
      });
    },
    get_help() {
      let params = new Object();
      params.login_token = this.log_token;
      params.page_no = 0;
      params.page_size = 10;
      app_query_help_cat_info(params)
        .then(res => {
          if (res.status == 0) {
            this.updateUser({ log_token: res.token_info.token });
            this.datalist = res.data.cat_list;
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
        //  console.log(error);
        });
    }
  }
};
</script>

<style lang="less" scoped>
/deep/.van-nav-bar {
  z-index: 2 !important;
  color: #fff;
  background: linear-gradient(45deg, #4c94fe 10%, #2762fd 100%);
}
/deep/.van-icon-arrow-left:before {
  color: #ffffff;
}
.help_center {
  width: 100%;
  height: 100%;
  background-color: #eeeeee;
  .help_center_content {
    width: 100%;
    margin-top: 0.92rem;
    .help_center_content_top {
      width: 96%;
      height: 1.6rem;
      padding-left: 4%;
      background: url(../../assets/images/suanlimingxi.png) no-repeat;
      background-size: 100% 100%;
      background-position: top;
      text-align: left;
      p {
        color: #fff;
        padding-top: 0.5rem;
        font-size: 0.4rem;
      }
    }
    .help_center_content_con {
      width: 100%;
      height: 100%;
      background-color: #eeeeee;
      .help_center_content_con_item {
        margin-bottom: 0.2rem;
        width: 100%;
        // height: 2rem;
        display: flex;
        align-items: center;
        background-color: #fff;
        .con_item_left {
          width: 35%;
          height: 2rem;

          img {
            width: 15%;
            margin-top: 0.35rem;
          }
        }
        .con_item_right {
          width: 60%;
          padding-left: 0.2rem;
          border-left: 1px solid #eeeeee;
          p {
            border-bottom: solid 1px #eeeeee;
            line-height: 1rem;
            text-align: left;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          p:nth-last-child(1) {
            border: none;
          }
        }
      }
    }
  }
}
</style>
