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
            <div>{{ item.cat_name }}</div>
            <van-icon name="arrow-down" />
          </div>
          <div class="con_item_right">
            <p
              v-for="(items, indexs) in item.problem"
              :key="indexs + 'problem'"
              v-show="indexs < item.aoenbum"
              @click="go_help_detail(items, indexs)"
            >
              {{ items.item_title }}
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
      datalist: [],
      zan_datalist: []
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
    try {
      window.android.setStatusBarAndNavigationBarColor("", "#ffffff");
    } catch (e) {}
    try {
      window.webkit.messageHandlers.setStatusBarAndNavigationBarColor.postMessage(
        "#559afe,#2762fd"
      );
    } catch (error) {}
    this.get_help();
  },
  methods: {
    ...mapMutations(["updateUser", "clearUser", "setdevsn", "setdevstatus"]),
    show_problem(sta, num) {
      if (sta.aoenbum == 2) {
        this.datalist[num].aoenbum = 100;
      } else {
        this.datalist[num].aoenbum = 2;
      }
      this.$forceUpdate();
      console.log(this.datalist[num]);
    },
    go_help_detail(datadetail, num) {
      console.log(datadetail);
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
            this.updateUser({ log_token: res.data.token_info.login_token });
            if (params.page_no == 0) {
              this.zan_datalist = res.data.cat_list;
            } else {
              this.zan_datalist = this.zan_datalist.concat(res.data.cat_list);
            }
            this.get_help_detail(0);
            this.zan_datalist.forEach((item, index) => {
              // this.get_help_detail(item.cat_id);
            });

            this.datalist = [];
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
    },
    get_help_detail(id) {
      let params = new Object();
      params.login_token = this.log_token;
      params.page_no = 0;
      params.page_size = 10;
      params.cat_id = id;
      app_query_help_item_info(params)
        .then(res => {
          if (res.status == 0) {
            this.updateUser({ log_token: res.data.token_info.login_token });
            let obje = {};
            this.zan_datalist.forEach((item, index) => {
              let key = item.cat_id;
              let value = item;
              obje[key] = value;
              obje[key].problem = [];
              obje[key].aoenbum = 2;
            });
            res.data.item_list.forEach((adme, index) => {
              let sad = adme.cat_id;
              if (obje[sad]) {
                obje[sad].problem.push(adme);
              }
            });
            for (var key in obje) {
              this.datalist.push(obje[key]);
            }

            console.log(this.datalist);
          }
        })
        .catch(error => {
          console.log(error);
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
