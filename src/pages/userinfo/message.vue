<template>
  <div class="container">
    <!-- <navBar :title="title" :right-text="title">
      <van-icon name="search" slot="right" />
    </navBar> -->
    <van-nav-bar
      title="消息中心"
      left-text=""
      right-text
      rrow
      left-arrow
      @click-left="onClickLeft"
      :z-index="2000"
    >
      <div slot="left" class="alltitleleft">
        <van-icon name="arrow-left" color="#ffffff" />
        <span></span>
      </div>
    </van-nav-bar>
    <div class="xiala">
      <vuu-pull
        ref="vuuPull"
        :options="pullOptions"
        v-on:loadTop="loadTop"
        v-on:loadBottom="loadBottom"
      >
        <div class="user">
          <div class="user_con">
            <van-tabs
              v-model="active_tab"
              animated
              color="#5199FF"
              title-inactive-color="#666666"
              @click="onClick"
            >
              <van-tab title="消息通知" style="padding-bottom:1rem;">
                <div class="notext" v-show="notext">
                  <img src="../../assets/images/device_ illustration6.png" />
                  <p>暂无消息</p>
                </div>
                <div
                  class="message_item"
                  v-show="!notext"
                  v-for="(item, index) in rankList"
                  v-bind:key="index"
                  v-bind:class="[item.isActive ? activeClass : errorClass]"
                  @click="goother(item, index)"
                >
                  <van-swipe-cell :before-close="beforeClose">
                    <div class="message_item_img" v-show="item.imge">
                      <img :src="item.imge" alt="图片加载失败" />
                    </div>
                    <div class="message_item_text">
                      {{ item.conte }}
                    </div>
                    <div class="message_item_time">{{ item.time }}</div>
                    <template #right>
                      <van-button
                        square
                        text="删除"
                        type="danger"
                        class="delete-button"
                      />
                    </template>
                  </van-swipe-cell>
                </div>
              </van-tab>
              <van-tab title="公告" style="padding-bottom:1rem;">
                <div class="notext" v-show="noaccon">
                  <img src="../../assets/images/device_ illustration6.png" />
                  <p>暂无消息</p>
                </div>
                <div
                  v-show="!noaccon"
                  class="message_item"
                  v-for="(item, index) in announcement"
                  v-bind:key="'0' + index"
                  @click="goother(item, index)"
                  v-bind:class="[item.isActive ? activeClass : errorClass]"
                >
                  <van-swipe-cell :before-close="beforeClose">
                    <div class="message_item_img" v-show="item.imge">
                      <img :src="item.imge" alt="图片加载失败" />
                    </div>
                    <div class="message_item_text">
                      {{ item.conte }}
                    </div>
                    <div class="message_item_time">{{ item.time }}</div>
                    <template #right>
                      <van-button
                        square
                        text="删除"
                        type="danger"
                        class="delete-button"
                      />
                    </template>
                  </van-swipe-cell>
                </div>
              </van-tab>
            </van-tabs>
          </div>
        </div>
      </vuu-pull>
    </div>
  </div>
</template>

<script>
import { NavBar, Toast } from "vant";
import { mapState, mapMutations } from "vuex";
import navBar from "../../components/navBar";
import { request } from "http";
import loadind from "../../assets/images/spainpink.gif"; //动画
import boadind from "../../assets/images/spinwhile.gif"; //动画
import {
  query_push_history_listex,
  delete_push_list
} from "../../common/js/api";
import { error } from "util";
export default {
  data() {
    return {
      activeClass: "active",
      errorClass: "textdanger",
      repeats: 0, //防止重复点击
      rescount: 0, //请求计数
      title: "消息中心",
      active: 1,
      active_tab: 0,
      sum_earnings: null,
      notext: true,
      noaccon: true,
      pullOptions: {
        isBottomRefresh: true,
        isTopRefresh: true,
        slideResistance: 5, //拉动阻力
        topTriggerHeight: 40, //下拉触发刷新的有效距离
        topPull: {
          loadingIcon: boadind
        },
        bottomPull: {
          loadingIcon: loadind,
          triggerWord:"加载更多"
        }
      },
      id: [],
      pos: 0,
      pagenum: 0,
      tolpage: 0,
      rankList: [
        // {
        //   imge: require("../../assets/images/xiaoxi1.png"),
        //   conte:
        //     "虚拟币最新资讯：西柚机今日全球同步发售！比特币近日涨势趋于平稳",
        //   time: "2019-11-25",
        //   notice_url: "http://www.baidu.com",
        //   push_id: "1d56a1f56156we1fgg4qw4g9865",
        //   notice_type: 0,
        //   isActive: false
        // },
        // {
        //   imge: require("../../assets/images/xiaoxi2.png"),
        //   conte: "市场调研：西柚机今日全球同步发售！300万人表示有兴趣。",
        //   time: "2019-10-25",
        //   notice_url: "http://www.baidu.com",
        //   push_id: "1d56a1f56waedhdfe1fg5w4g46w5",
        //   notice_type: 0,
        //   isActive: false
        // },
        // {
        //   imge: require("../../assets/images/xiaoxi1.png"),
        //   conte: "虚拟币风向标：西柚机今日全球同步发售！比特币近日涨势趋于平稳",
        //   time: "2019-10-25",
        //   notice_url: "http://www.baidu.com",
        //   push_id: "f1v5w165a1h561a51g6wae1gwe",
        //   notice_type: 0,
        //   isActive: false
        // }
      ],
      announcement: [
        // {
        //   imge: require("../../assets/images/xiaoxi1.png"),
        //   conte: "公告：西柚机今日全球同步发售！比特币近日涨势趋于平稳",
        //   time: "2019-11-25",
        //   notice_url: "http://www.baidu.com",
        //   push_id: "df1e651wga651651gh56e1ha",
        //   notice_type: 1,
        //   isActive: false
        // },
        // {
        //   imge: require("../../assets/images/xiaoxi1.png"),
        //   conte: "公告：西柚机今日全球同步发售！比特币近日涨势趋于平稳",
        //   time: "2019-10-25",
        //   notice_url: "http://www.baidu.com",
        //   push_id: "gdfsfg1235e1h51sh5e1r",
        //   notice_type: 1,
        //   isActive: false
        // }
      ],
      tabnum: 0
    };
  },
  mounted() {
    if (this.$route.query.notice_type) {
      this.tabnum = this.$route.query.notice_type;
    }
    this.gettag(this.tabnum);
    // this.announcement.forEach((item,index)=>{
    //    item.isActive = this.ser(item.push_id);
    // });
    // this.rankList.forEach((item,index)=>{
    //    item.isActive = this.ser(item.push_id);
    // });
    // this.pushid = this.$route.query.push_id;
  },
  computed: {
    ...mapState({
      log_token: state => state.user.log_token
    })
  },
  methods: {
    ...mapMutations(["updateUser", "clearUser"]),
    goLink() {
      this.$router.push({ path: "/login" });
    },
    ser(key) {
      var starts = JSON.parse(sessionStorage.getItem("pushid"));
      let arr2 = Array.from(new Set(starts)); //去重
      if (arr2.indexOf(key) < 0) {
        return false;
      }
      return true;
    },
    //返回
    onClickLeft() {
      // this.$router.push({
      //   path: "/usercenter"
      // });
      this.$router.go(-1);
      // if (this.fromname == "message") {
      //   this.$router.back(-1);
      // } else {

      // }
    },
    //Tab 标签页点击事件
    onClick(name, title) {
      this.tabnum = name;
      this.gettag(this.tabnum);
    },
    //跳转页面
    goother(data, num) {
      if (data.notice_type == 0) {
        this.rankList[num].isActive = true;
        this.id.push(data.push_id);
        sessionStorage.setItem("pushid", JSON.stringify(this.id));
        this.$router.push({
          path: "/message_details",
          query: { push_id: data.push_id }
        });
      } else {
        this.announcement[num].isActive = true;
        this.id.push(data.push_id);
        sessionStorage.setItem("pushid", JSON.stringify(this.id));
        this.$router.push({
          path: "/message_details",
          query: { push_id: data.push_id }
        });
      }
    },
    //请求数据--获取推送标签
    gettag(num) {
      this.announcement = [];
      this.rankList = [];
      let params = new Object();
      params.login_token = this.log_token;
      params.notice_type = num;
      params.cur_page = this.pagenum;
      query_push_history_listex(params)
        .then(res => {
          this.pagenum = res.data.cur_page;
          this.tolpage = res.data.total_num;
          this.updateUser({
            log_token: res.data.token_info.token
          });
          if (res.status == 0 && res.data.data) {
            res.data.data.forEach((item, index) => {
              if (item == null) {
              } else {
                let rect = {};
                // rect.imge = require(item.notice_pic_url);
                rect.imge = item.Notice_pic_url;
                rect.conte = item.Notice_title;
                rect.time = item.Notice_push_time;
                rect.notice_url = item.Notice_url;
                rect.push_id = item.Notice_back_id;
                rect.notice_type = item.Notice_type;
                if (item.Notice_type == 0) {
                  rect.isActive = this.ser(rect.push_id);
                  this.rankList.push(rect);
                } else {
                  this.announcement.push(rect);
                }
              }
            });
          }
          if (this.rankList.length <= 0) {
            this.notext = true;
          } else {
            this.notext = false;
          }
          if (this.announcement.length <= 0) {
            this.noaccon = true;
          } else {
            this.noaccon = false;
          }
        })
        .catch(error => {
          //  console.log(error);
        });
    },

    //上拉加载
    loadBottom() {
      setTimeout(() => {
        if (this.pagenum <= this.tolpage / 10 - 1) {
          this.pagenum++;
          this.gettag(this.tabnum);
        } else {
          this.$refs.vuuPull.closeLoadBottom();
        }
        if (this.$refs.vuuPull.closeLoadBottom) {
          this.$refs.vuuPull.closeLoadBottom();
        }
      }, 500);
    },
    //下拉刷新
    loadTop() {
      setTimeout(() => {
        if (this.tabnum == 0) {
          this.rankList = [];
          this.gettag(this.tabnum);
        } else {
          this.announcement = [];
          this.gettag(this.tabnum);
        }
        // this.paneList.unshift({
        //   user_total_profit: "这是下拉刷新的一条数据",
        //   date_stamp: "太棒了！！请继续下拉"
        // });
        if (this.$refs.vuuPull.closeLoadTop) {
          this.$refs.vuuPull.closeLoadTop();
        }
      }, 500);
    },

    // position 为关闭时点击的位置
    // instance 为对应的 SwipeCell 实例
    beforeClose({ position, instance }) {
      switch (position) {
        case "left":
        case "cell":
        case "outside":
          instance.close();
          break;
        case "right":
          this.$dialog
            .confirm({
              message: "确定删除吗？"
            })
            .then(() => {
              instance.close();
            });
          break;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  overflow: hidden;
  // background: url(../../assets/images/bgc33.png) #f2f2f2 no-repeat 0 0;
  background-size: 100% 40%;
  .xiala {
    height: 100%;
  }
  .user {
    width: 100%;
    height: auto;
    overflow: hidden;
    margin: auto;
    // margin-top: 0.8rem;
    background-color: #f2f2f2;
    .user_con {
      width: 100%;
      margin: auto;
      margin-top: -0.02rem;
      .message_item {
        width: 6.9rem;
        height: 5.08rem;
        background: rgb(255, 255, 255);
        border-radius: 0.12rem 0.12rem 0 0;
        margin: auto;
        margin-top: 0.3rem;
        overflow: hidden;
        // color: rgb(0, 0, 0);
        font-size: 0.32rem;
        .message_item_img {
          background: #cccccc;
          height: 3.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .message_item_text {
          height: 1.2rem;
          display: flex;
          align-items: center;
          line-height: 0.42rem;
          text-align: left;
          padding: 0 0.3rem;
          text-indent: 0.1rem;
          border-bottom: 0.01rem solid #f8f8f8;
        }
        .message_item_time {
          height: 0.7rem;
          display: flex;
          padding: 0 0.3rem;
          color: #888fa9;
          align-items: center;
          text-indent: 0.1rem;
        }
      }

      .notext {
        width: 100%;
        height: 500px;
        display: flex;
        flex-direction: column;
        align-items: center;
        background: #f2f2f2;
        img {
          display: table-cell; //主要是这个属性
          vertical-align: middle;
          text-align: center;
          width: 60%;
          margin-top: 3.5rem;
        }
        p {
          margin-top: -0.2rem;
        }
      }
    }
  }
}

.textdanger {
  color: #000000;
}
.active {
  color: #888fa9;
  opacity: 0.6;
}
.delete-button {
  height: 100%;
}
</style>
