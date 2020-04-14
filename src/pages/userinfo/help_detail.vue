<template>
  <div class="help_detail">
    <navBar title="查看解决方案"></navBar>
    <div class="help_detail_con">
      <div class="help_detail_con_top">
        <i>Q:</i>
        {{problem_title}}
      </div>
      <div class="help_detail_con_bot">
        <i>A:</i>
        <div>{{Solution}}</div>
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
      problem_title: "",
      id: "",
      Solution:
        "目前暂不支持主动申请提高白条额度，京东会根据您的使用情况与消费情况调度对信用良好的用户，京东金融APP每周奖励提额包。每周一可领取当周提额包，提额包7日内未领取自动失效。以下情况暂无法领取提额包：1.当前有违约将无法领取当周提额包，还清违约账单次周可继续领取提额包。2.白条账户有超过30天的违约记录或账户被止付，暂无奖励提额包。其他相关问题可点击：1、咨询白条业务介绍可点击【什么是白条】2、咨询白条如何激活可点击右侧文章【京东白条怎么开通？怎么激活？ 】；3、咨询白条激活失败原因可点击金融帮助中心内容查看【白条激活失败怎么办】（页面可放大）；4、咨询如何使用白条问题可点击【如何使用白条】；5、咨询白条如何还款可点击金融帮助中心内容查看【白条如何还款】（页面可放大）；6、咨询白条如何开通自动还款可点击金融帮助中心内容查看【白条如何开通自动还款】（页面可放大）；7、咨询白条如何注销可点击【白条如何注销",
      datalist: []
    };
  },
  mounted() {
    this.problem_title = this.$route.query.problem.problem_item;
    this.id = this.$route.query.problem.problem_id;
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
  methods: {
    ...mapMutations(["updateUser", "clearUser", "setdevsn", "setdevstatus"]),
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
    },
    get_help_detail() {
      let params = new Object();
      params.login_token = this.log_token;
      params.page_no = 0;
      params.page_size = 10;
      params.cat_id=this.id;
      app_query_help_cat_info(params)
        .then(res => {
          if (res.status == 0) {
            this.updateUser({ log_token: res.token_info.token });
            // this.datalist = res.data.cat_list;
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
.help_detail {
  width: 100%;
  height: 100%;
  .help_detail_con {
    width: 92%;
    margin: auto;
    padding: 0 4%;
    margin-top: 0.92rem;
    .help_detail_con_top {
      line-height: 1rem;
      text-align: left;
      color: #333333;
      border-bottom: 1px solid #e2e0e0;
      i {
        color: #6e6e6e;
        margin-right: 0.2rem;
        font-size: 0.38rem;
        font-style:italic
      }
    }
    .help_detail_con_bot {
      display: flex;
      text-align: left;
      margin-top: 0.3rem;
      i {
        color: #6e6e6e;
        margin-right: 0.2rem;
        font-size: 0.38rem;
        font-style:italic
      }
    }
  }
}
</style>
