<template>
  <div class="content" id="outesr">
    <div>
      <van-nav-bar
        :title="title"
        left-text="返回"
        right-text
        rrow
        fixed
        left-arrow
        @click-left="onClickLeft"
        @click-right="onClickRight"
        :z-index="2000"
      >
        <div slot="left" class="alltitleleft">
          <van-icon name="arrow-left" color="#ffffff" />
          <span>返回</span>
        </div>
      </van-nav-bar>
    </div>

    <section class="container">
      <v-refresh :on-refresh="onRefresh">
        <v-reload
          :on-infinite-load="onInfiniteLoad"
          :parent-pull-up-state="infiniteLoadData.pullUpState"
        >
          <div
            v-for="(item,index) in infiniteLoadData.pullUpList"
            v-bind:key="index"
            style="display: flex;justify-content: space-between;align-items: center;height: 45px;padding: 0 10px;background: darkgray;margin-bottom: 10px;"
          >
            <span>+{{((item.user_total_profit)/1000000).toFixed(6)}}</span>
            <span>{{item.date_stamp | formatDate}}</span>
          </div>
        </v-reload>
      </v-refresh>
    </section>
  </div>
</template>

<script>
import { NavBar, Toast } from "vant";
import DropDownRefresh from "../../components/DropDownRefresh";
import PullUpReload from "../../components/PullUpReload";
import { getuserdevlist } from "../../common/js/api.js";
import { formatDate } from "../../common/js/date.js";
import { mapState, mapMutations } from "vuex";
import { error } from "util";
export default {
  data() {
    return {
      title: "刷新",
      bankList: [],
      cardList: [],
      pagenum: 0,
      tolpage: 1,
      // 上拉加载的设置
      infiniteLoadData: {
        initialShowNum: 10, // 初始显示多少条
        everyLoadingNum: 10, // 每次加载的个数
        pullUpState: 2, // 子组件的pullUpState状态
        pullUpList: [], // 上拉加载更多数据的数组
        showPullUpListLength: this.initialShowNum // 上拉加载后所展示的个数
      }
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
    this.getPullUpDefData();
  },
  methods: {
    /**获取数据 */
    getdatalist(page) {
      if (page == 0) {
        this.infiniteLoadData.pullUpList = [];
      }
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
          this.cardList = res.data.user_profit_list;
          this.pagenum = res.data.page;
          this.tolpage = res.data.total_page;
          setTimeout(() => {
            if (this.cardList.length <= 0) {
            } else {
              for (let i = 0; i < this.cardList.length; i++) {
                this.infiniteLoadData.pullUpList.push(this.cardList[i]);
              }
            }
          });
        })
        .catch(error => {
          // console.log(error);
        });
    },
    /**
     * 获取上拉加载的初始数据
     */
    getPullUpDefData() {
      this.getdatalist(0);
      this.getStartPullUpState();
    },

    /**
     * 获取上拉加载的pullUpState状态
     */
    getStartPullUpState() {
      if (this.infiniteLoadData.pullUpList.length) {
        if (this.tolpage <= this.pagenum) {
          // 修改子组件的pullUpState状态
          this.infiniteLoadData.pullUpState = 3;
        } else {
          this.infiniteLoadData.pullUpState = 1;
        }
      } else {
        this.infiniteLoadData.pullUpState = 0;
      }
    },

    /**
     * 上拉一次加载更多的数据
     */
    getPullUpMoreData() {
      this.showPullUpListLength = this.infiniteLoadData.pullUpList.length;
      if (
        this.infiniteLoadData.pullUpList.length +
          this.infiniteLoadData.everyLoadingNum >
        this.cardList.length
      ) {
        for (
          let i = 0;
          i < this.cardList.length - this.showPullUpListLength;
          i++
        ) {
          this.infiniteLoadData.pullUpList.push(
            this.cardList[i + this.showPullUpListLength]
          );
        }
      } else {
        for (let i = 0; i < this.infiniteLoadData.everyLoadingNum; i++) {
          this.infiniteLoadData.pullUpList.push(
            this.cardList[i + this.showPullUpListLength]
          );
        }
      }
      if (this.cardList.length === this.infiniteLoadData.pullUpList.length) {
        this.infiniteLoadData.pullUpState = 3;
      } else {
        this.infiniteLoadData.pullUpState = 1;
      }
    },

    /**
     * 下拉刷新
     */
    onRefresh(done) {
      // 如果下拉刷新和上拉加载同时使用，下拉时初始化上拉的数据
      this.getStartPullUpState();
      this.getPullUpDefData();
      done(); // call done
    },

    /**
     * 上拉加载
     */
    onInfiniteLoad(done) {
      if (this.infiniteLoadData.pullUpState === 1) {
        this.getPullUpMoreData();
      }
      done();
    },
    onClickLeft() {
      this.$router.back(-1);
    },
    onClickRight() {
      Toast("按钮");
    }
  },
  components: {
    "v-refresh": DropDownRefresh,
    "v-reload": PullUpReload
  }
};
</script>

<style scoped>
/* @import "../../assets/css/not2rem.css"; */
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  /* overflow-x: hidden; */
  height: 800px;
  background-color: #f7f7f7;
  margin-top: 1rem;
  /* overflow: scroll;

touch-action: none; */
}
</style>
