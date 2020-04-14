<template>
  <div class="conter">
    <!-- <div
      style="height: 50px;background: #ae9bf9;line-height: 50px;position: relative;z-index: 1;display: flex;justify-content: space-between;align-items: center;padding: 0 0.3rem;"
    >
      <span @click="goback">返回</span>
      <span>头部导航栏</span>
      <span>更多</span>
    </div>-->
    <van-nav-bar
      title="头部导航栏"
      left-text="返回"
      right-text
      rrow
      left-arrow
      @click-left="goback"
      :z-index="2000"
    >
      <div slot="left" class="alltitleleft">
        <van-icon name="arrow-left" color="#ffffff" />
        <span>返回</span>
      </div>
    </van-nav-bar>
    <vuu-pull
      ref="vuuPull"
      :options="pullOptions"
      v-on:loadTop="loadTop"
      v-on:loadBottom="loadBottom"
    >
      <template v-for="(item , index) in paneList">
        <div style="display: flex;align-items: center;margin-bottom: 15px;background: bisque;">
          <div style="width: 1.8rem;height: 1.8rem;">
            <img style="width: 100%;" src="../../assets/images/head.jpg" alt />
          </div>
          <div style="width: 70%;">
            <p>
              <span>收益：</span>
              {{item.user_total_profit}}
            </p>
            <p>
              <span>时间：</span>
              {{item.date_stamp |formatDate}}
            </p>
          </div>
        </div>
      </template>
    </vuu-pull>
  </div>
</template>
<script>
import { NavBar, Toast } from "vant";
import { getuserdevlist } from "../../common/js/api.js";
import { formatDate } from "../../common/js/date.js";
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      paneList: [],
      pullOptions: {
        isBottomRefresh: true,
        isTopRefresh: true
      },
      pagenum: 0,
      tolpage: 1
    };
  },
  computed: mapState({
    log_token: state => state.user.log_token,
    phone_number: state => state.user.phone_number,
    user_name: state => state.user.user_name,
    user_sex: state => state.user.user_sex,
    charge_psd: state => state.user.charge_psd
  }),
  filters: {
    //时间戳转时间
    formatDate(time) {
      time = time * 1000;
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd");
    }
  },
  mounted() {
    // this.getStartPullUpState();
    this.getdatalist(0);
  },
  methods: {
    //请求数据
    getdatalist(page) {
      let params = new Object();
      let querydate = 90;
      let endtimes = Date.parse(new Date().toLocaleDateString()) / 1000; //获取当前年月日时间戳
      let starttime = endtimes - querydate * 24 * 3600; //获取前九十天的时间戳
      let token = this.log_token;
      params.start_time = starttime;
      params.end_time = endtimes;
      params.login_token = token;
      params.query_type = 2;
      params.cur_page = page;
      getuserdevlist(params) //获取每天总收益
        .then(res => {
          if (res.data.page == 0) {
            this.paneList = res.data.user_profit_list;
          } else {
            this.paneList = this.paneList.concat(res.data.user_profit_list);
          }

          this.pagenum = res.data.page;
          this.tolpage = res.data.total_page;
        })
        .catch(error => {
        });
    },
    //上拉
    loadBottom() {
      setTimeout(() => {
        if (this.pagenum <= this.tolpage - 1) {
          let pages = this.pagenum;
          pages++;
          this.getdatalist(pages);
        } else {
          return false;
        }
        // this.paneList.push({
        //   user_total_profit: "这是上拉请求的一条数据",
        //   date_stamp: 1575424593
        // });
        if (this.$refs.vuuPull.closeLoadBottom) {
          this.$refs.vuuPull.closeLoadBottom();
        }
      }, 1500);
    },
    //下拉
    loadTop() {
      setTimeout(() => {
        this.getdatalist(0);
        // this.paneList.unshift({
        //   user_total_profit: "这是下拉刷新的一条数据",
        //   date_stamp: "太棒了！！请继续下拉"
        // });
        if (this.$refs.vuuPull.closeLoadTop) {
          this.$refs.vuuPull.closeLoadTop();
        }
      }, 1500);
    },
    goback() {
      this.$router.back(-1);
    }
  }
};
</script>
<style scoped>
.conter {
  background: aliceblue;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
