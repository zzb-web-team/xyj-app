<template>
  <div class="help_detail">
    <navBar title="查看解决方案"></navBar>
    <iframe
      ref="iframe"
      class="ifrem_detail"
      scrolling="auto"
      :src="url"
      frameborder="0"
    ></iframe>
    <div class="help_detail_con">
      <!-- <div class="help_detail_con_top">
        <i>Q:</i>
        {{ problem_title }}
      </div> -->
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
      url: "",
      Solution: "",
      datalist: []
    };
  },
  mounted() {
    try {
      window.android.setStatusBarAndNavigationBarColor("1", "#ffffff");
    } catch (e) {}
    try {
      window.webkit.messageHandlers.setStatusBarAndNavigationBarColor.postMessage(
        "#ffffff"
      );
    } catch (error) {}
    this.problem_title = this.$route.query.problem.item_title;
    this.url = this.$route.query.problem.item_url;
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
    })
  },
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
      params.cat_id = this.id;
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
  position: relative;
  .ifrem_detail {
    width: 100%;
    height: 100%;
    margin-top: 0.92rem;
  }
}
</style>
