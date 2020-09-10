<template>
  <div class="container">
    <van-nav-bar
      title="消息详情"
      left-text="返回"
      right-text
      rrow
      fixed
      left-arrow
      @click-left="onClickLeft"
      :z-index="20000"
    >
      <div slot="left" class="alltitleleft">
        <van-icon name="arrow-left" color="#ffffff" />
        <span>返回</span>
      </div>
    </van-nav-bar>
    <!-- <div class="mes_dea_con">我是小希，收到的消息id是：{{ pushid }}</div> -->
    <div class="con">
      <div class="contitle">{{ notice_title }}</div>
      <div class="connest">
        <span>{{ notice_push_user_name }}</span
        ><span>{{ notice_push_time | formatDate }}</span>
      </div>
      <div class="conimg" v-if="notice_pic_url">
        <img :src="notice_pic_url" alt="" />
      </div>
      <div class="context">{{ notice_content }}</div>
    </div>
    <div class="otecon" v-show="notice_url">
      <iframe
        id="mainContent"
        :src="notice_url"
        width="100%"
        height="667px"
      ></iframe>
    </div>
  </div>
</template>

<script>
import { NavBar, Toast } from "vant";
import { mapState, mapMutations } from "vuex";
import { query_push_history_listex } from "../../common/js/api";
import { formatDate } from "../../common/js/date.js";
import { error } from "util";
export default {
  data() {
    return {
      fromname: "",
      pushid: "",
      notice_content: "",
      notice_push_time: "",
      notice_push_user_name: "",
      // notice_pic_url: require("../../assets/images/xiaoxi1.png"),
      notice_pic_url: "",
      notice_title: "",
      notice_url: "",
      notice_type: ""
    };
  },
  filters: {
    //时间戳转时间
    formatDate(time) {
      time = time * 1000;
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd");
    }
  },
  computed: {
    ...mapState({
      log_token: state => state.user.log_token
    })
  },
  mounted() {
    try {
      window.android.setStatusBarAndNavigationBarColor("", "#ffffff");
    } catch (e) {}
    try {
      window.webkit.messageHandlers.setStatusBarAndNavigationBarColor.postMessage(
        "#745af3,#5e73f3"
      );
    } catch (error) {}
    // this.fromname = JSON.parse(sessionStorage.getItem("frname"));
    this.pushid = this.$route.query.push_id;
    this.getlist();
  },
  methods: {
    ...mapMutations(["updateUser", "clearUser"]),
    //
    getlist() {
      let parmas = new Object();
      parmas.login_token = this.log_token;
      parmas.cur_page = 0;
      parmas.query_type = 1;
      parmas.back_id = 3;
      parmas.back_id = this.pushid;
      query_push_history_listex(parmas)
        .then(res => {
          if (res.status == 0 && res.data.data) {
            this.notice_content = res.data.data[0].Notice_content;
            this.notice_push_time = res.data.data[0].Notice_push_time;
            this.Notice_pic_url = res.data.data[0].Notice_pic_url;
            this.notice_title = res.data.data[0].Notice_title;
            this.notice_url = res.data.data[0].Notice_url;
            this.notice_push_user_name = res.data.data[0].Notice_push_user_name;
            this.notice_type = res.data.data[0].Notice_type;
          }
        })
        .catch(error => {
       //   console.log(error);
        });
    },
    onClickLeft() {
      this.$router.push({
        path: "/message",
        query: { notice_type: this.notice_type }
      });
      // if (this.fromname == "message") {
      //   this.$router.back(-1);
      // } else {

      // }
    }
  }
  //清除上次来的路由地址
  // beforeRouteLeave(to, from, next) {
  //   sessionStorage.setItem("frname", JSON.stringify(""));
  //   next();
  // }
};
</script>

<style lang="less" scoped>
.container {
  overflow-x: hidden;
}
.mes_dea_con {
  margin-top: 1rem;
}
.con {
  height: 100%;
  margin-top: 0.8rem;
  .contitle {
    width: 100%;
    color: #000000;
    font-size: 0.4rem;
    font-weight: 600;
    text-align: center;
    padding: 0.2rem 0;
  }
  .connest {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #9a9a9a;
    span {
      margin: 0.1rem;
    }
  }
  .conimg {
    width: 100%;
    img {
      width: 98%;
      height: 98%;
      margin: auto;
    }
  }
  .context {
    margin: 0.1rem;
    text-align: left;
  }
}
.otecon {
  width: 100%;
  height: 60%;
  margin-top: 0.8rem;
  #mainContent {
    border: none;
  }
}
</style>
