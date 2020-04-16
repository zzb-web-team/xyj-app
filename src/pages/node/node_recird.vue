<template>
  <div class="recird">
    <navBar title="节点动态" left-arrow fixed @click-left="onClickLeft">
      <!-- <van-icon name="question-o" slot="right" size="0.4rem" /> -->
    </navBar>
    <!-- 内容 -->
    <div v-if="datalist.length > 0" class="recird_con">
      <vuu-pull
        ref="vuuPull"
        :options="pullOptions"
        v-on:loadTop="loadTop"
        v-on:loadBottom="loadBottom"
        :style="{ height: scrollerHeight }"
      >
        <div
          class="recird_content"
          v-for="(item, index) in datalist"
          :key="index"
        >
          <span class="recird_content_left">
            <img src="../../assets/images/jiedian_icon.png" alt />
            {{ item.node_name }}
          </span>
          <span class="recird_content_center">{{
            item.node_status == 0 ? "节点网络启用" : "节点网络断开"
          }}</span>
          <span class="recird_content_right">{{
            item.update_time | formatDate
          }}</span>
        </div>
      </vuu-pull>
    </div>
    <van-empty description="暂无数据" v-else />
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import navBar from "../../components/navBar";
import { formatDate, transformTime } from "../../common/js/date.js";
import { query_node_dynamic_info } from "../../common/js/api";
import loadind from "../../assets/images/spainpink.gif"; //动画
import boadind from "../../assets/images/spinwhile.gif"; //动画
export default {
  data() {
    return {
      datalist: [
        // {
        //   node_name: "节点00020275037407",
        //   node_status: 0,
        //   update_time: "一个小时前"
        // },
        // { node_name: "节点0003", node_status: 1, update_time: 1580114065 },
        // { node_name: "节点0004", node_status: 0, update_time: "两天前" },
        // { node_name: "节点0005", node_status: 0, update_time: 1578011665 }
      ],
      pagenum: 0,
      allpage: 1,
      pullOptions: {
        isBottomRefresh: true,
        isTopRefresh: true,
        slideResistance: 5, //拉动阻力
        topTriggerHeight: 40, //下拉触发刷新的有效距离
        topPull: {
          loadingIcon: boadind
        },
        bottomCloseElMove: false //关闭上拉加载
      }
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
  computed: {
    ...mapState({
      log_token: state => state.user.log_token,
      phone_number: state => state.user.phone_number,
      user_name: state => state.user.user_name,
      user_sex: state => state.user.user_sex,
      charge_psd: state => state.user.charge_psd,
      minerstates: state => state.management.minerstates,
      devsn: state => state.management.devsn
    }),
    scrollerHeight: function() {
      if (window.innerWidth > 375) {
        return window.innerHeight - 0.92 * 100 + "px";
      } else {
        return window.innerHeight - 0.92 * 50 + "px";
      }
    }
  },
  mounted() {
    this.get_my_dynace_info();
  },
  methods: {
    ...mapMutations(["updateUser", "clearUser", "setdevsn", "setdevstatus"]),
    //下拉刷新
    loadTop() {
      setTimeout(() => {
        //  this.income_list = [];
        this.get_my_dynace_info(0);
        if (this.$refs.vuuPull.closeLoadTop) {
          this.$refs.vuuPull.closeLoadTop();
        }
      }, 500);
    },
    //上拉加载
    loadBottom() {
      setTimeout(() => {
        if (this.pagenum < this.allpage) {
          this.pagenum++;
          this.get_my_dynace_info(this.pagenum);
        } else {
          return false;
        }
        if (this.$refs.vuuPull.closeLoadBottom) {
          this.$refs.vuuPull.closeLoadBottom();
        }
      }, 500);
    },
    //获取我的节点动态
    get_my_dynace_info(page) {
      let parmas = new Object();
      parmas.login_token = this.log_token;
      parmas.page_no = page;
      parmas.page_size = 10;
      query_node_dynamic_info(parmas)
        .then(res => {
          if (res.status == 0) {
            // this.updateUser({ log_token: res.token_info.login_token });
            if (res.err_code == 0) {
              if (parmas.page_no == 0) {
                this.datalist = res.data.list;
                this.get_my_dynace_info(1);
              } else {
                this.datalist = this.datalist.concat(res.data.list);
              }
            }
          }
        })
        .catch(error => {
          //  console.log(error);
        });
    },
    onClickLeft() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
/deep/.van-nav-bar {
  /* z-index: 2 !important; */
  color: #000000;
  background: #ffffff;
}
/deep/.van-nav-bar__title {
  color: #333333;
}
/deep/.van-icon-arrow-left:before {
  color: #333333;
}
/deep/.income_overview {
  color: #333333;
}
/deep/.van-empty {
  margin-top: 3rem;
}
.recird {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .recird_con {
    margin-top: 0.92rem;
    width: 100%;
    height: 100%;
  }
  .recird_content {
    display: flex;
    padding: 0 2%;
    font-size: 0.28rem;
    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      border-bottom: 0.01rem solid #eeeeee;
      line-height: 0.96rem;
      color: #333333;
      img {
        width: 15%;
      }
    }
    .recird_content_left {
      width: 38%;
      display: flex;
      align-items: center;
      text-align: left;
    }
    .recird_content_center {
      width: 30%;
      text-align: center;
    }
    .recird_content_right {
      width: 30%;
      text-align: right;
    }
  }
}
</style>
