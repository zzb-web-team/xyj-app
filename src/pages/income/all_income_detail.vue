<template>
  <div class="all_income">
    <navBar title="收益明细" left-arrow fixed @click-left="onClickLeft"></navBar>
    <!--  -->
    <div class="income_con">
      <div class="income_con_top">
        <p>{{revenue_time |formatDate}}累计收益(gfm)</p>
        <p class="dev_num">{{total_revenue}}</p>
      </div>
      <!--  -->
      <div class="content_body">
        <div class="content_con" v-for="(item,index) in dev_income_list" :key="index">
          <div class="content_body_top" @click="go_income_list(item)">
            <span>
              <img src="../../assets/images/income_name.png" alt />
              {{item.devname}}
            </span>
            <span>
              算力：{{item.shouyi}}
              <img src="../../assets/images/per_icon_arrow.png" alt />
            </span>
          </div>
          <div class="content_body_bottom" @click="go_income_list(item)">
            <div class="content_body_bottom_left">
              <img src="../../assets/images/income_shouyi.png" alt />
              <div class="content_body_bottom_right_detail">
                <p>累计收益</p>
                <p>
                  {{item.shouyi}}
                  <span>gfm</span>
                </p>
              </div>
            </div>
            <div class="content_body_bottom_right item_right">
              <div class="content_body_bottom_right_detail">
                <p>占用空间：{{item.hold_bandwidth}}GB</p>
                <p>上行带宽：{{item.up_bandwidth}}Mbps</p>
                <p>下行带宽：{{item.down_bandwidth}}Mbps</p>
                <p>在线时长：{{item.online_time}}h</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--  -->
    </div>
  </div>
</template>

<script>
import navBar from "../../components/navBar";
import { formatDate, transformTime } from "../../common/js/date.js";
export default {
  data() {
    return {
      total_revenue: 0,
      revenue_time: 0,
      dev_income_list: [
        {
          devname: "我的西柚机1",
          shouyi: 6334,
          suanli: 56,
          sn: 0,
          hold_bandwidth: 45,
          up_bandwidth: 346,
          down_bandwidth: 346,
          online_time: 346
        },
        {
          devname: "我的西柚机2",
          shouyi: 546,
          suanli: 34656,
          sn: 1,
          hold_bandwidth: 2346,
          up_bandwidth: 567,
          down_bandwidth: 3298,
          online_time: 46
        },
        {
          devname: "我的西柚机3",
          shouyi: 2745,
          suanli: 346,
          sn: 2,
          hold_bandwidth: 3445,
          up_bandwidth: 342,
          down_bandwidth: 17,
          online_time: 956
        },
        {
          devname: "我的西柚机4",
          shouyi: 547,
          suanli: 2345,
          sn: 3,
          hold_bandwidth: 436,
          up_bandwidth: 457,
          down_bandwidth: 437586,
          online_time: 235
        },
        {
          devname: "我的西柚机5",
          shouyi: 6334,
          suanli: 93684,
          sn: 4,
          hold_bandwidth: 437,
          up_bandwidth: 23,
          down_bandwidth: 4676,
          online_time: 244
        },
        {
          devname: "我的西柚机6",
          shouyi: 15073,
          suanli: 46,
          sn: 5,
          hold_bandwidth: 4673,
          up_bandwidth: 13,
          down_bandwidth: 574,
          online_time: 876
        },
        {
          devname: "我的西柚机7",
          shouyi: 45,
          suanli: 102375,
          sn: 6,
          hold_bandwidth: 346,
          up_bandwidth: 135,
          down_bandwidth: 583,
          online_time: 346
        }
      ]
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
  mounted() {
    this.total_revenue = this.$route.query.allshou.num;
    this.revenue_time = this.$route.query.allshou.record_time;
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    go_income_detail(data) {
      console.log(data);
    },
    show_dev() {
      this.showdev = true;
    },
    onSelect_dev(item) {
      this.showdev = false;
    },
    //取消按钮
    onCancel_dev() {
      this.showdev = false;
    }
  },
  components: {
    navBar: navBar
  }
};
</script>

<style lang="less" scoped>
/deep/.van-button .van-icon {
  transform: rotate(90deg);
}
/deep/.van-cell--clickable {
  border-bottom: 1px solid #eeeeee;
}
/deep/.van-cell__title {
  text-align: left;
  width: 1.65rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/deep/.van-popup {
  width: 94%;
  padding: 3%;
  overflow-y: scroll;
}
/deep/.van-dropdown-menu {
  justify-content: space-between;
  background-color: #f8fafb;
}
/deep/.van-dropdown-menu__item {
  flex: none;
  width: 2rem;
  height: 0.6rem;
  border-radius: 1rem;
  background-color: #fff;
  margin: auto;
  border: 1px solid #eeeeee;
}
.all_income {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .income_con {
    margin-top: 0.92rem;
    display: flex;
    flex-direction: column;
    .income_con_top {
      width: 100%;
      height: 24.5%;
      background: url(../../assets/images/suanlimingxi.png) no-repeat;
      background-size: 100% 100%;
      background-position: top;
      p {
        color: #fff;
        padding-top: 0.2rem;
      }
      .dev_num {
        font-size: 0.6rem;
        font-weight: bold;
        padding-bottom: 0.2rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .content_body {
      width: 100%;
      overflow-y: scroll;
      flex: 1;
      .content_con {
        width: 84%;
        padding: 4%;
        margin: auto;
        color: #333333;
        border: solid 0.01rem #eeeeee;
        border-radius: 0.1rem;
        margin-top: 0.2rem;
        text-align: left;

        img {
          width: 7%;
        }
        .content_body_top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.2rem;
          font-size: 0.28rem;
          font-weight: 600;
          span:nth-child(2) {
            font-weight: 500;
            font-size: 0.24rem;
            color: #666666;
            display: flex;
            align-items: center;
            img {
              width: 20%;
              margin-left: 0.1rem;
            }
          }
        }
        .content_body_bottom {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .content_body_bottom_left,
          .content_body_bottom_right {
            width: 28.5%;
            padding: 10%;
            display: flex;
            justify-content: space-between;
            align-content: center;
            border: solid 0.01rem #eeeeee;
            border-radius: 0.1rem;
            img {
              width: 28%;
            }
            .content_body_bottom_right_detail {
              width: 96%;
              padding-left: 4%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              p {
                font-size: 0.2rem;
                color: #666666;
              }
            }
          }
          .item_right {
            width: 38.5%;
            padding: 4.6% 5% 4.6% 5%;
          }
        }
      }
    }
  }
}
</style>