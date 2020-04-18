<template>
  <div class="dynamic">
    <van-pull-refresh class="xiala" v-model="isLoading" @refresh="onRefresh">
      <div class="pull_con">
        <div class="dynamic_top">
          <div class="bandwidth">
            <span class="bandwidth_left">
              <i></i>
              上行带宽 {{ up_bandwidth }}Mbps
            </span>
            <div class="bandwidth_right" @click="go_mining_node">
              <img src="../../assets/images/jiedian_icon.svg" alt />
              <span>挖矿节点 {{ node_pic_name }}</span>
            </div>
          </div>
          <div class="bandwidth">
            <span class="bandwidth_left">
              <i></i>
              下行带宽{{ down_bandwidth }}Mbps
            </span>
            <div class="bandwidth_right down_right" @click="go_calculation">
              <img src="../../assets/images/suanli_icon.svg" alt />
              <span>平均算力{{ node_suan }}</span>
            </div>
          </div>
        </div>
        <div class="dynamic_bottom">
          <div class="redic_title">
            <span>我的节点动态</span>
            <span class="view_all" @click="go_recird">查看全部</span>
          </div>
          <div class="dynamic_scroll" v-if="datalist.length > 0">
            <div
              class="recird_content"
              v-for="(item, index) in datalist"
              :key="index"
            >
              <span class="recird_content_left">
                <img src="../../assets/images/jiedian_icon.png" alt />
                {{ item.dev_name }}
              </span>
              <span class="recird_content_center">
                {{ item.event_type == 1 ? "节点网络" : "磁盘"
                }}{{ item.event_val == 0 ? "启用" : "停止" }}
              </span>
              <span class="recird_content_right">
                {{ item.event_tm | formatDate }}
              </span>
            </div>
          </div>
          <van-empty description="暂无数据" v-else />
        </div>
      </div>
    </van-pull-refresh>
    <foot v-model="active"></foot>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import foot from "../../components/foot";
import { formatDate, transformTime } from "../../common/js/date.js";
import { Empty } from "vant";
import {
  query_node_dynamic_info,
  get_user_average_cp,
  isbindinglist
} from "../../common/js/api";
export default {
  data() {
    return {
      active: 0,
      up_bandwidth: 0,
      down_bandwidth: 0,
      isLoading: false, //控制上拉加载的加载动画
      node_pic: [],
      node_pic_name: "",
      node_suan: 0,
      datalist: [
        // {
        //   node_name: "节点00020275037407",
        //   node_status: 0,
        //   update_time: "一个小时前"
        // },
        // { node_name: "节点0003", node_status: 1, update_time: 1580114065 },
        // { node_name: "节点0004", node_status: 0, update_time: "两天前" },
        // { node_name: "节点0005", node_status: 0, update_time: 1578011665 },
        // { node_name: "节点0005", node_status: 0, update_time: "一分钟前" }
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
        return formatDate(date, "yyyy-MM-dd\nhh:mm:ss");
      }
    }
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
    this.get_cp();
    this.get_use_dev_list();
  },
  methods: {
    ...mapMutations(["updateUser", "clearUser", "setdevsn", "setdevstatus"]),
    //下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.get_cp();
        this.get_use_dev_list();
        this.isLoading = false;
      }, 500);
    },
    //获取用户设备列表
    get_use_dev_list() {
      let params = new Object();
      params.login_token = this.log_token;
      isbindinglist(params)
        .then(res => {
          if (res.status == 0) {
            this.updateUser({ log_token: res.token_info.login_token });
            this.node_pic = res.data.bind_devinfo_list;
            this.node_pic_name = res.data.bind_devinfo_list[0].dev_name;
            this.get_my_dynace_info();
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
          }
        })
        .catch(error => {
          // console.log(error);
        });
    },
    //获取我的节点动态
    get_my_dynace_info() {
      let parmas = new Object();
      parmas.login_token = this.log_token;
      parmas.page_no = 0;
      parmas.page_size = 10;
      query_node_dynamic_info(parmas)
        .then(res => {
          if (res.status == 0) {
            this.updateUser({ log_token: res.data.token_info.login_token });
            let obje = {};
            this.node_pic.forEach((item, index) => {
              let key = item.dev_sn;
              let value = item;
              obje[key] = value;
              obje.event_type = 0;
              obje.event_val = 0;
              obje.event_tm = 0;
            });
            res.data.dynamic_list.forEach((adme, indexs) => {
              let sad = adme.dev_sn;
              let deas = new Object();
              deas = adme;
              if (obje[sad]) {
                obje[sad].event_type = deas.event_type;
                obje[sad].event_val = deas.event_val;
                obje[sad].event_tm = deas.event_tm;
                this.datalist.push(obje[sad]);
              }
            });
          }
        })
        .catch(error => {
          // console.log(error);
        });
    },
    //获取用户平均算力
    get_cp() {
      let params = new Object();
      params.login_token = this.log_token;
      get_user_average_cp(params)
        .then(res => {
          if (res.status == 0) {
            this.updateUser({ log_token: res.data.token_info.token });
            if (res.err_code == 0) {
              this.node_suan = res.data.average_cp;
              this.up_bandwidth = (res.data.up_bandwidth / 1024 / 1024).toFixed(
                2
              );
              this.down_bandwidth = (
                res.data.down_bandwidth /
                1024 /
                1024
              ).toFixed(2);
            }
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
          }
        })
        .catch(error => {
          //   console.log(error);
        });
    },
    go_recird() {
      this.$router.push("/node_recird");
    },
    go_mining_node() {
      this.$router.push("/mining_node");
    },
    go_calculation() {
      this.$router.push({
        path: "/dev_calculation",
        query: { suanli: this.node_suan }
      });
    }
  },
  components: {
    foot
  }
};
</script>

<style lang="less" scoped>
/deep/.van-empty {
  padding: 0;
  margin: 0;
}
/deep/.van-empty__image {
  width: 2rem;
  height: 2rem;
}
.dynamic {
  width: 100%;
  height: 100%;
  background-color: #fff;
  overflow: hidden;
  .pull_con {
    width: 100%;
    height: 100%;
  }
  .dynamic_top {
    width: 100%;
    height: 64%;
    background: url(../../assets/images/pic.png) no-repeat;
    background-size: 100% 100%;
    .bandwidth {
      width: 100%;
      line-height: 0.48rem;
      padding-top: 0.2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .bandwidth_left {
        width: 30%;
        color: #6d6a89;
        font-size: 0.24rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-left: 4%;
        i {
          display: inline-block;
          width: 0.1rem;
          height: 0.1rem;
          background-color: #6d6a89;
          border-radius: 50%;
        }
      }
      .bandwidth_right {
        display: flex;
        align-items: center;
        width: 3.51rem;
        padding-left: 0.3rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0 0.04rem 0.04rem 0 rgba(65, 60, 89, 0.06);
        border-radius: 0.24rem 0 0 0.24rem;
        img {
          width: 10%;
        }
        span {
          font-size: 0.24rem;
          color: #333333;
          padding-left: 0.1rem;
        }
      }
      .down_right {
        width: 2.38rem;
      }
    }
  }
  .dynamic_bottom {
    width: 92%;

    padding: 0 4%;
    margin: auto;

    .redic_title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.3rem;
      color: #333333;
      margin-top: 0.2rem;
      .view_all {
        color: #6c6c95;
        font-size: 0.24rem;
      }
    }
    .dynamic_scroll {
      height: 3rem;
      overflow-x: hidden;
      overflow-y: scroll;
      .recird_content {
        display: flex;
        font-size: 0.24rem;
        span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          line-height: 0.6rem;
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
          color: #6c6c95;
        }
      }
    }
  }
}
.xiala {
  height: 100%;
}
</style>
