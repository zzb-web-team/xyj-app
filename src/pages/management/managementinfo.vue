<template>
  <div class="container">
    <navBar :title="title" :right-text="title">
      <van-icon name="search" slot="right" />
    </navBar>
    <scroller>
      <van-pull-refresh class="xiala" v-model="isLoading" @refresh="onRefresh">
        <!-- 网络异常 -->
        <div class="refresh" v-show="refresh">
          <div>
            <img src="../../assets/images/unusual_inset.png" alt />
            <p>网络异常，下拉刷新</p>
          </div>
        </div>
        <div
          class="device_info"
          v-show="!refresh"
          v-for="(item, index) in minerInfoArr"
          v-bind:key="index"
        >
          <div class="device_info_left">
            <div class="device_dot">
              <!-- <div class="dot" v-bind:style="{background:oldcolor}"></div> -->
              <span>{{ minnerstatus }}</span>
            </div>
            <div class="device_btn" @click="go_monitor()">监控</div>
          </div>
          <!-- <div class="device_info_img" @click="goRanking()"></div> -->
          <div class="device_info_space">
            <div class="device_top">剩余</div>
            <van-circle
              v-model="currentRate"
              color="#3477FD"
              layer-color="#DEE9FF"
              :rate="currentRate"
              :speed="currentRate"
              :text="text"
              :stroke-width="50"
              size="3.72rem"
            />

            <div class="device_already">
              {{
                ((item.total_cap - item.free_cap) / 1024 / 1024 / 1024).toFixed(
                  2
                )
              }}Gb/{{ (item.total_cap / 1024 / 1024 / 1024).toFixed(2) }}Gb
            </div>
          </div>
          <div class="device_bandwidth">
            <span>
              上行:{{ up_bandwidth }}Mbps
              <img src="../../assets/images/per_icon_arrow.png" alt />
            </span>
            <span>
              下行:{{ down_bandwidth }}Mbps
              <img src="../../assets/images/per_icon_arrow.png" alt />
            </span>
          </div>
          <!-- <div class="device_info_item">储存力：{{item.minerStorage}}</div>
          <div class="device_info_item">空间：{{item.minerSpace}}</div>
          <div class="device_info_item">上行宽带：{{item.minerBandwidth}}</div>
          <div class="device_info_item">在线时长：{{item.minerOnlinetime}}</div>-->
          <div class="device_btn">
            <!-- <div class="device_btn_item" @click="reStart()" disabled="devsta">
              <img src="../../assets/images/icon_list_reboot.png" disabled="devsta" alt />
            </div>-->
            <div class="device_btn_item" @click="reStart()">
              <img src="../../assets/images/chongqi.svg" alt />
            </div>
            <!-- <div class="device_btn_item" @click="reClose()">
          <img src="../../assets/images/guanbi.png" alt>
            </div>-->
            <div class="device_btn_item" @click="reUntied()">
              <img src="../../assets/images/jiebang.svg" alt />
            </div>
            <div class="device_btn_item" @click="goMining(item)">
              <img src="../../assets/images/shouyi.svg" alt />
            </div>
          </div>
          <div class="device_btns">
            <div class="device_btn_items">重启</div>
            <div class="device_btn_items">解绑</div>
            <div class="device_btn_items">收益</div>
          </div>
          <div class="user_con">
            <div class="user_con_item">
              <div class="con_item_l">设备名称</div>
              <div class="con_item_r" v-if="setActive" @click="openSetname()">
                <span>{{ device_name }}</span>
                <img
                  src="../../assets/images/evenmore.png"
                  alt
                  @click="openSetname()"
                />
              </div>
              <div class="con_item_r" v-else>
                <input
                  type="text"
                  v-model="device_name"
                  @blur="resetDiv"
                  maxlength="10"
                />
                <div @click="closeSetname()">确定</div>
              </div>
            </div>
            <div class="user_con_item">
              <div class="con_item_l">设备型号</div>
              <!-- <div class="con_item_r">{{item.dev_model}}</div> -->
              <div class="con_item_r">{{item.dev_type==1?"RK3328":"AMS805"}}</div>
            </div>
            <div class="user_con_item">
              <div class="con_item_l">ROM</div>
              <div class="con_item_r">{{ item.rom_version }}</div>
            </div>
            <div class="user_con_item">
              <div class="con_item_l">SN</div>
              <div class="con_item_r">{{ item.dev_sn }}</div>
            </div>
            <div class="user_con_item">
              <div class="con_item_l">MAC地址</div>
              <div class="con_item_r">{{ item.dev_mac }}</div>
            </div>
            <div class="user_con_item">
              <div class="con_item_l">IP地址</div>
              <div class="con_item_r">{{ item.dev_ip }}</div>
            </div>
          </div>
        </div>
      </van-pull-refresh>
    </scroller>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import navBar from "../../components/navBar";
import { Tabbar, TabbarItem, Circle, Dialog, Toast } from "vant";
import {
  getMinerInfo, // 获取我的西柚机详情
  restarts, //重启
  reClose,
  bindingmill, //解绑设备
  setDevName, //设置设备名称
  devinformation
} from "../../common/js/api.js";
import { err } from "../../common/js/status";
import { error } from "util";
import { request } from "http";

export default {
  data() {
    return {
      repeats: 0, //防止重复点击
      rescount: 0, //请求计数
      device_name: "",
      zdevname: "",
      title: "设备详情",
      refresh: false,
      oldcolor: "",
      isLoading: false, //控制上拉加载的加载动画
      minnerstatus: "",
      linkimg: [
        { src: request("../../assets/images/details_pop_icon_caution.png") }
      ],
      extrainfo: { ctrl_type: 1, command_msg: "reboot now!" },
      currentRate: 0,
      setActive: true,
      show: false,
      devsta: false,
      minerInfoArr: [],
      up_bandwidth: "",
      down_bandwidth: "",
      dev_sn: ""
    };
  },

  mounted() {
    this.scan(0);
    this.band_width();
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
    text() {
      return this.currentRate.toFixed(1) + "%";
    }
  },
  methods: {
    ...mapMutations(["updateUser", "clearUser", "setdevsn", "setdevstatus"]),
    // goRanking() {
    //   this.$router.push({ path: "/ranking" });
    // },
    //下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.scan(1);
        this.isLoading = false;
      }, 500);
    },
    //西柚机详情
    scan(key) {
      if (this.$parent.onLine == false) {
        this.$loading.show("无网络连接");
        Toast("无法连接网络，请检查网络状态");
      } else {
        if (key != 1) {
          this.$loading.show("加载中...");
        }
        if (this.repeats == 1) {
          return false;
        }
        this.repeats = 1;
        if (this.rescount >= 3) {
          this.repeats = 0;
          this.rescount = 0;
          this.$loading.hide();
          this.refresh = true;
          Toast(`请求超时，请稍后重试`);
          return false;
        }
        //获取西柚机详情信息
        let dev_online_state = this.minerstates; //接收上一个页面传输来的设备状态
        let minersn = [];
        minersn.push(this.devsn);
        if (dev_online_state == 1) {
          this.oldcolor = "#0FA427";
          this.minnerstatus = "在线";
        } else {
          this.oldcolor = "#8A8A8A";
          this.minnerstatus = "离线";
          // this.devsta = false;
          //根据获取的状态修改状态显示远点的颜色     红色：离线       (根据接口返回值做具体的调整  待定)
        }
        let params = new Object();
        let token = this.log_token;
        params.login_token = token;
        params.dev_sn = minersn;
        getMinerInfo(params) // 获取我的西柚机详情
          .then(res => {
            if (res) {
              this.$loading.hide();
            }
            this.repeats = 0;
            if (res.status == 0) {
              this.refresh = false;
              this.updateUser({ log_token: res.token_info.login_token });
              if (res.err_code == 0) {
                this.rescount = 0;
                this.minerInfoArr = res.data.dev_info_list;
                this.device_name = res.data.dev_info_list[0].dev_name;
                this.zdevname = res.data.dev_info_list[0].dev_name;
                this.dev_sn = res.data.dev_info_list[0].dev_sn;
                if (this.minerInfoArr[0].total_cap == 0) {
                  this.currentRate = 0.0;
                } else {
                  this.currentRate =
                    (
                      res.data.dev_info_list[0].free_cap /
                      res.data.dev_info_list[0].total_cap
                    ).toFixed(4) * 100;
                }
              } else {
                this.rescount = 0;
                const sta = err[res.err_code]
                  ? this.$t(err[res.err_code])
                  : `请稍后重试 ${res.err_code}`;
                this.$toast(sta);
              }
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
            } else if (res.status == -999) {
              this.rescount = 0;
              Toast("登录已过期，请重新登录");
              this.clearUser();
              setTimeout(() => {
                this.$router.push({ path: "/login" });
              }, 1000);
            } else if (res.status == -900) {
              this.rescount = 0;
              this.$router.push({ path: "/login" });
            } else if (res.status == -17) {
              this.rescount = 0;
              Dialog.alert({
                message: "账号在其它地方登录，请重新登录"
              }).then(() => {
                this.clearUser();
                this.$router.push({ path: "/login" });
              });
            } else if (res.status == -500) {
              this.rescount = 0;
            } else if (res.status == -5) {
              this.rescount++;
            } else {
              this.rescount = 0;
              const tip = this.$backStatusMap[res.status] || err[res.status];
              const str = tip ? this.$t(tip) : `请稍后重试 ${res.status}`;
              this.$toast(str);
            }
          })
          .catch(error => {
            this.repeats = 0;
            this.rescount++;
            // Toast("网络错误，请重新请求");
          });
      }
    },
    band_width() {
      let params = new Object();
      let starttime =
        new Date(new Date().toLocaleDateString()).getTime() / 1000 - 86400;
      let endtime = starttime + 86399;
      params.login_token = this.log_token;
      params.start_time = starttime;
      params.end_time = endtime;
      params.cur_page = 0;
      params.dev_sn = this.devsn;
      devinformation(params)
        .then(res => {
          console.log(res);
          if (res.status == 0) {
            this.updateUser({ log_token: res.data.token_info.token });
            this.up_bandwidth = (
              res.data.dev_info_list[0].up_bandwidth /
              1024 /
              1024
            ).toFixed(2);
            this.down_bandwidth = (
              res.data.dev_info_list[0].down_bandwidth /
              1024 /
              1024
            ).toFixed(2);
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
          console.log(error);
        });
    },
    go_monitor() {
      this.$router.push({
        path: "/monitor_details",
        query: { devsn: this.dev_sn, devname: this.device_name }
      });
    },
    goInfo() {
      this.$router.push({ path: "/login" });
    },
    openSetname() {
      this.setActive = false;
    },
    closeSetname() {
      if (this.$parent.onLine == false) {
        Toast("无法连接网络，请检查网络状态");
      } else {
        if (this.repeats == 1) {
          return false;
        }
        const toast = Toast.loading({
          duration: 15000, // 持续展示 toast
          forbidClick: true, // 禁用背景点击
          loadingType: "spinner",
          mask: false
        });
        this.repeats = 1;
        if (this.rescount >= 3) {
          this.repeats = 0;
          this.rescount = 0;
          Toast.clear();
          Toast(`请求超时，请稍后重试`);
          return false;
        }
        setTimeout(() => {
          //设置设备名称
          this.setActive = true;
          let params = new Object();
          let minersn = this.devsn;
          let token = this.log_token;
          params.login_token = token;
          params.dev_sn = minersn;
          params.dev_name = this.device_name;

          if (!this.device_name) {
            return this.$toast("该西柚机还未设置昵称");
          }
          if (!/^[\u4E00-\u9FA5A-Za-z0-9_]+$/.test(this.device_name)) {
            this.device_name = this.zdevname;
            return this.$toast("昵称不能含有非法字符");
          }
          setDevName(params)
            .then(res => {
              Toast.clear();
              this.repeats = 0;
              if (res.status == 0) {
                Toast(`设备名已更改`);
                this.updateUser({ log_token: res.token_info.login_token });
                if (res.err_code == 0) {
                  this.rescount = 0;
                }
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
              } else if (res.status == -999) {
                this.rescount = 0;
                Toast("登录已过期，请重新登录");
                this.clearUser();
                setTimeout(() => {
                  this.$router.push({ path: "/login" });
                }, 1000);
              } else if (res.status == -900) {
                this.rescount = 0;
                this.$router.push({ path: "/login" });
              } else if (res.status == -17) {
                this.rescount = 0;
                Dialog.alert({
                  message: "账号在其它地方登录，请重新登录"
                }).then(() => {
                  this.clearUser();
                  this.$router.push({ path: "/login" });
                });
              } else if (res.status == -500) {
                this.rescount = 0;
              } else if (res.status == -5) {
                this.repeats = 0;
                this.rescount++;
                this.closeSetname();
              } else if (res.status == -3) {
                this.rescount = 0;
                Toast("设备名称不能包含非法字符");
              } else {
                this.rescount = 0;
                const tip = this.$backStatusMap[res.status] || err[res.status];
                const str = tip ? this.$t(tip) : `请稍后重试 ${res.status}`;
                this.$toast(str);
              }
            })
            .catch(error => {
              this.repeats = 0;
              this.rescount++;
              this.closeSetname();
              // Toast("网络错误，请重新请求");
            });
        }, 100);
      }
    },
    //重启
    reStart() {
      // if (this.minerstates == 0) {
      //   Toast("离线设备无法重启");
      //   return false;
      // }
      if (this.$parent.onLine == false) {
        Toast("无法连接网络，请检查网络状态");
      } else {
        if (this.repeats == 1) {
          return false;
        }
        this.repeats = 1;
        if (this.rescount >= 3) {
          this.repeats = 0;
          this.rescount = 0;
          Toast(`请求超时，请稍后重试`);
          return false;
        }
        this.show = true;
        Dialog.confirm({
          title: "重启",
          message: "确定重启该设备？"
        })
          .then(() => {
            //重启西柚机
            let param = new Object();
            let extrainfo = new Object();
            extrainfo.ctrl_type = 1;
            param.dev_sn = this.devsn;
            param.login_token = this.log_token;
            param.extra_info = extrainfo;
            restarts(param)
              .then(res => {
                this.repeats = 0;
                if (res.status == 0) {
                  this.rescount = 0;
                  // this.$store.commit("changeLogin", {
                  //   //存token
                  //   token: res.token_info.login_token
                  // });
                  this.updateUser({ log_token: res.token_info.login_token });
                  if (res.err_code == 2) {
                    Toast("设备正在重启，请稍后");
                  }
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
                  this.rescount = 0;
                  const tip =
                    this.$backStatusMap[res.status] || err[res.status];
                  const str = tip ? this.$t(tip) : `请稍后重试 ${res.status}`;
                  this.$toast(str);
                }
              })
              .catch(error => {
                this.repeats = 0;
                this.rescount++;
                this.reStart();
                // Toast("网络错误，请重新请求");
              });
          })
          .catch(() => {
            // on cancel
            this.repeats = 0; //取消重启，避免进入防抖模式，将repeats重置为0
          });
      }
    },
    //解绑
    reUntied() {
      if (this.$parent.onLine == false) {
        Toast("无法连接网络，请检查网络状态");
      } else {
        this.show = true;
        Dialog.confirm({
          title: "解绑",
          message:
            "确认解绑该设备?<br/>①设备产生的收益可以正常兑换<br/>②您不再享受该设备的积分收益<br/>③该设备可被其他任意账号绑定"
        })
          .then(() => {
            if (this.repeats == 1) {
              return false;
            }
            const toast = Toast.loading({
              duration: 15000, // 持续展示 toast
              forbidClick: true, // 禁用背景点击
              loadingType: "spinner",
              mask: false
            });
            this.repeats = 1;
            if (this.rescount >= 3) {
              this.repeats = 0;
              this.rescount = 0;
              Toast.clear();
              Toast(`请求超时，请稍后重试`);
              return false;
            }

            let params = new Object();
            let bindtype = 0;
            let minersn = this.devsn; //获取上一个页面传过来的设备sn
            params.login_token = this.log_token;
            params.dev_sn = minersn;
            params.bind_type = bindtype;
            params.bind_user_tel_num = "";
            bindingmill(params)
              .then(res => {
                Toast.clear();
                this.repeats = 0;
                if (res.status == 0) {
                  this.updateUser({ log_token: res.token_info.login_token });
                  if (res.err_code == 0) {
                    this.rescount = 0;
                    Toast.success({
                      message: "解绑成功",
                      duration: 800
                    });
                    setTimeout(() => {
                      this.$router.push({
                        path: "/management" //设备解绑之后页面跳转到西柚机管理界面
                      });
                    }, 1000);
                  } else {
                    this.rescount = 0;
                    const sta = err[res.err_code]
                      ? this.$t(err[res.err_code])
                      : `请稍后重试 ${res.err_code}`;
                    this.$toast(sta);
                  }
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
                } else if (res.status == -999) {
                  this.rescount = 0;
                  Toast("登录已过期，请重新登录");
                  this.clearUser();
                  setTimeout(() => {
                    this.$router.push({ path: "/login" });
                  }, 1000);
                } else if (res.status == -17) {
                  this.rescount = 0;
                  Dialog.alert({
                    message: "账号在其它地方登录，请重新登录"
                  }).then(() => {
                    this.clearUser();
                    this.$router.push({ path: "/login" });
                  });
                } else if (res.status == -500) {
                  this.rescount = 0;
                } else if (res.status == -5) {
                  this.rescount++;
                  this.reUntied();
                } else if (res.status == -900) {
                  this.rescount = 0;
                  this.$router.push({ path: "/login" });
                } else {
                  this.rescount = 0;
                  const tip =
                    this.$backStatusMap[res.status] || err[res.status];
                  const str = tip ? this.$t(tip) : `请稍后重试 ${res.status}`;
                  this.$toast(str);
                }
              })
              .catch(error => {
                this.repeats = 0;
                this.rescount++;
                this.reUntied();
                // Toast("网络错误，请重新请求");
              });
          })
          .catch(() => {
            // on cancel
          });
      }
    },
    //挖矿
    goMining(item) {
      if (this.$parent.onLine == false) {
        Toast("无法连接网络，请检查网络状态");
      } else {
        this.$router.push({
          path: "/income_list",
          query: { allshou: item }
        });
      }
    },
    resetDiv() {
      //ios 兼容，input失去焦点后界面上移不恢复的问题
      setTimeout(() => {
        let scrollHeight =
          document.documentElement.scrollTop || document.body.scrollTop || 0;
        window.scrollTo(0, Math.max(scrollHeight - 1, 0));
      }, 100);
    }
  },
  components: {
    navBar: navBar
  }
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  overflow: hidden;
  background: #f8f8f8;
  .xiala {
    height: 100%;
    .refresh {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        margin-top: 4.3rem;
        width: 50%;
      }
    }
    .device_bandwidth {
      width: 100%;
      background-color: #fff;
      display: flex;
      justify-content: space-around;
      padding-top: 0.2rem;
      padding-bottom: 0.2rem;
      span {
        display: inline-block;
        width: 2.6rem;
        height: 0.48rem;
        line-height: 0.48rem;
        background: #f8fafb;
        border-radius: 0.1rem;
        font-size: 0.24rem;
        color: #666666;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 17%;
        }
      }
    }
  }
  .device_info {
    overflow: hidden;
    width: 100%;
    // height: 11.64rem;
    color: #000000;
    margin: auto;
    margin-top: 0.9rem;
    background: #f8f8f8;
    border-radius: 0.12rem;
    .device_info_left {
      width: 94%;
      height: 0.56rem;
      padding-left: 3%;
      padding-right: 3%;
      padding-top: 0.3rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #fff;
      .device_dot {
        width: 2rem;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .dot {
          width: 0.2rem;
          height: 0.2rem;
          border-radius: 50%;
          // background-color: #21E21C;
          margin-right: 0.1rem;
        }
      }
      .device_btn {
        width: 1.14rem;
        height: 0.56rem;
        background: rgba(255, 109, 110, 1);
        box-shadow: 0 0.1rem 0.1rem 0 #ff6d6e1a;
        border-radius: 0.1rem;
        color: #ffffff;
        margin: 0;
      }
    }
    .device_info_space {
      width: 100%;
      height: auto;
      position: relative;
      background-color: #fff;
      /deep/.van-circle__text {
        color: #000000;
        font-size: 0.9rem;
        position: absolute;
        top: 1.7rem;
      }
      .device_top {
        width: 1rem;
        position: relative;
        top: 1.1rem;
        left: 43%;
        font-size: 0.26rem;
        color: #666666;
      }
      .device_already {
        border-top: 0.01rem solid #dddddd;
        line-height: 0.7rem;
        color: #666666;
        font-size: 0.26rem;
        left: 50%;
        top: 75%;
        position: absolute;
        transform: translate(-50%, -50%);
      }
    }
    .device_info_item {
      width: 100%;
      height: auto;
      overflow: hidden;
      margin-top: 0.1rem;
    }
    .device_btn {
      width: 100%;
      margin: auto;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #f8fafb;
      margin-top: 0.2rem;
      .device_btn_item {
        width: 3rem;
        height: 1rem;
        border-radius: 50%;
        color: rgba(34, 42, 69, 1);
        display: flex;
        align-items: center;
        font-size: 0.24rem;
        justify-content: center;
        img {
          width: 0.75rem;
          height: 0.75rem;
        }
      }
    }
    .device_btns {
      width: 100%;
      margin: auto;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 0.28rem;
      color: #616c8a;
      background-color: #fff;
      margin-bottom: 0.2rem;
      background: #f8fafb;
      .device_btn_items {
        width: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .user_con {
      width: 100%;
      height: auto;
      margin: 0 auto;
      background: #f8fafb;
      .user_con_item {
        background-color: #fff;
        margin-top: 0.1rem;
        width: 100%;
        padding-left: 3%;
        padding-right: 3%;
        height: 1rem;
        overflow: hidden;
        font-size: 0.3rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .con_item_l {
          color: #333333;
          font-size: 0.28rem;
        }
      }
    }
  }
}
.con_item_r {
  display: flex;
  justify-content: flex-start;
  color: #666666;
  font-size: 0.28rem;
  align-items: center;
  span {
    max-width: 3rem;
    overflow: hidden;
  }
  img {
    width: 0.12rem;
    height: 0.24rem;
    margin-left: 0.1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  input {
    width: 2.5rem;
    margin-right: 0.2rem;
    background: none;
    border: none;
    border-bottom: 1px solid #616c8a;
    overflow: hidden;
  }
}
.device_info_img {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-right: 0.4rem;
  img {
    width: 0.32rem;
    height: 0.32rem;
  }
}
@media screen and (min-device-height: 812px) {
  .device_info {
    height: 13rem !important;
  }
}
</style>
