<template>
  <div class="container">
    <van-nav-bar
      left-text=""
      left-a
      rrow
      left-arrow
      fixed
      @click-left="onClickLeft()"
      @click-right="onClickRight()"
      :z-index="2000"
    >
      <div slot="left" class="alltitleleft">
        <van-icon name="arrow-left" color="#333333" />
        <!-- <span>返回</span> -->
      </div>
      <div slot="right" class="titright">
        <van-icon name="scan" size="0.4rem" />
        <span>扫码绑定</span>
      </div>
      <!-- <van-icon name="comment" slot="right" size="0.46rem" color="#808080" /> -->
    </van-nav-bar>
    <scroller>
      <div class="container_introduction">
        <div class="number">发现{{ number }}个西柚机</div>
        <div class="introduction_text">
          <div class="protocol_text" id="protocol_text_con">
            <van-swipe
              class="swipe"
              :autoplay="300000000"
              indicator-color="white"
              :show-indicators="false"
              :loop="false"
              @change="onChange"
              ref="frame"
            >
              <!-- 按钮 -->
              <div class="item_active_next" slot="indicator">
                <div
                  class="item_active_left"
                  @click="previouspage()"
                  v-bind:style="{ opacity: leftstyle }"
                >
                  <img src="../../assets/images/findzuo.png" />
                </div>
                <div
                  class="item_active_right"
                  @click="nextpage()"
                  v-bind:style="{ opacity: rightstyle }"
                >
                  <img src="../../assets/images/findyou.png" />
                </div>
              </div>
              <van-swipe-item
                v-for="(item, index) in deviceArr"
                v-bind:key="index"
                @click="changeitem(item, index)"
              >
                <!-- :ref="`deviceArr${index}`" -->

                <!-- 类容区域 -->
                <div class="serial">
                  <span>{{
                    index + 1 >= 10 ? index + 1 : "0" + (index + 1)
                  }}</span>
                  <span v-show="item.dev_type == -1"
                    ><img src="../../assets/images/findtishi.png" alt="" />
                    非法设备</span
                  >
                </div>
                <div class="find_devive">
                  <div class="find_devive_item item_active">
                    <img src="../../assets/images/findxiyouji.png" />
                  </div>

                  <div class="find_devive_item item_active_one">
                    <!-- <img src="../../assets/images/binding_capacity.png" alt /> -->
                    容量：{{
                      (item.free_cap / 1024 / 1024 / 1024).toFixed(2)
                    }}GB
                  </div>
                  <div class="find_devive_item">序号：{{ item.dev_sn }}</div>
                  <!-- <div class="find_devive_item">请为西柚机取个名字</div> -->
                  <div class="find_devive_item item_active_two">
                    <input
                      type="text"
                      placeholder="请为西柚机取个名字"
                      v-model="item.dev_name"
                      @blur="resetDiv"
                      :disabled="devnameokArr[index]"
                      maxlength="10"
                    />
                  </div>
                  <div class="find_devive_item item_btn">
                    <div
                      class="usertel"
                      v-bind:style="{ display: item.nonestyle }"
                    >
                      {{ item.bind_user_tel_num | newtel }}
                    </div>
                    <div
                      class="usert"
                      v-bind:style="{ display: item.feistyle }"
                    >
                      {{ item.bind_num }}
                    </div>
                    <div>
                      <div class="item_btn_check">
                        <!-- <van-checkbox v-model="checked"></van-checkbox> -->
                        <van-button
                          class="find_btn"
                          @click="setname(item.dev_name, item.dev_sn, index)"
                          :disabled="devnameokArr[index]"
                          >{{ item.bind }}</van-button
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </van-swipe-item>
            </van-swipe>
          </div>
        </div>

        <div class="dopbtn">
          <van-button class="introduction_start" @click="bindind()"
            >绑定完成</van-button
          >
        </div>
      </div>
    </scroller>
    <van-loading type="spinner" color="white" />
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
// import navBar from "../../components/barBarScan";
import {
  Swipe,
  SwipeItem,
  Toast,
  Dialog,
  Checkbox,
  CheckboxGroup,
  NavBar
} from "vant";
import {
  bindMiner,
  adddevice,
  getDevid, //根据设备SN获取设备ID
  saomabindMiner,
  getMinerInfo,
  bindingmill, //绑定设备
  setDevName, //设置设备名称
  bindsetname //绑定并设置设备名称
} from "../../common/js/api.js";
import { err } from "../../common/js/status";

export default {
  data() {
    return {
      repeats: 0, //防止重复点击
      rescount: 0, //请求计数
      devnameok: false, //提交按钮是否可点击 false是可点击,true不可点击
      devnameokArr: [],
      current: "",
      checked: false,
      dev_name: "",
      number: "",
      leftstyle: 0.2,
      rightstyle: "",
      startingpoint: 0,
      // devlist: ['PTFS201909000014'],
      devlist: [],
      deviceArr: [
        // {
        //   free_cap: 16000000000,
        //   bind_user_tel_num: 18872926121,
        //   dev_sn: "m15y65123k",
        //   bind: "立即绑定"
        // },
        // {
        //   free_cap: 96000000000,
        //   bind_user_tel_num: 15913246981,
        //   dev_sn: "c1my6f1dr31",
        //   bind: "已绑定"
        // }
      ]
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
    newtel(value1) {
      if (!value1) return "";
      let value2 = value1.toString().substr(0, 3);
      value1 = value1.toString().substr(-4, 4);
      value1 = value2 + "*".repeat(4) + value1;
      return value1;
    }
  },
  mounted() {
    if (this.$parent.onLine == false) {
      Toast("无法连接网络，请检查网络状态");
      setTimeout(() => {
        this.$router.push({ path: "/searchbinding" });
      }, 300);
    }
    this.devlist = this.$route.query.dev_list;
    this.scan();
    //this.getdevlist();
    this.$refs.frame.show = false;
  },
  methods: {
    ...mapMutations(["updateUser", "clearUser"]),
    changeitem(item, index) {},
    bimjj() {
      this.$refs.frame.swipeTo(4);
    },
    //上一页
    previouspage() {
      let left = this.startingpoint;
      left--;
      if (left <= 0) {
        left = 0;
      }
      this.$refs.frame.swipeTo(left);
      this.startingpoint = left;
    },
    //下一页
    nextpage() {
      let right = this.startingpoint;
      right++;
      if (right >= this.deviceArr.length - 1) {
        right = this.deviceArr.length - 1;
      }
      this.$refs.frame.swipeTo(right);
      this.startingpoint = right;
    },
    onChange(index) {
      if (this.deviceArr.length <= 1) {
        this.rightstyle = 0.2;
      }
      if (index <= 0) {
        this.leftstyle = 0.2;
      } else {
        this.leftstyle = 1;
      }
      if (index >= this.deviceArr.length - 1) {
        this.rightstyle = 0.2;
      } else {
        this.rightstyle = 1;
      }

      this.startingpoint = index;
      this.current = index;
    },
    // getdevlist() {
    //   this.$route.params.dev_list.forEach((item, index, arr) => {
    //     console.log(item, index, arr);
    //     if (item.dev_type == -1) {
    //       this.devnameokArr[index] = true;
    //       this.devnameokArr = this.devnameokArr.concat([]);
    //       console.log(this.devnameokArr[index]);
    //     } else if (item.bind_state == 1) {
    //       this.devnameokArr[index] = true;
    //       this.devnameokArr = this.devnameokArr.concat([]);
    //       console.log(this.devnameokArr[index]);
    //     }
    //   });
    //   this.deviceArr = this.$route.params.dev_list;
    //   this.number = this.deviceArr.length;
    //   console.log(this.deviceArr, this.number);
    //   this.$forceUpdate();
    // },
    //搜索设备
    scan() {
      if (this.$parent.onLine == false) {
        Toast("无法连接网络，请检查网络状态");
        // setTimeout(() => {
        //   this.$router.push({ path: "/searchbinding" });
        // }, 300);
      } else {
        if (this.repeats == 1) {
          return false;
        }
        this.repeats = 1;
        let params = new Object();
        params.login_token = this.log_token;
        params.dev_sn = this.devlist;
        getMinerInfo(params) //获取设备信息
          .then(res => {
            Toast.clear();
            if (res.status == 0) {
              this.repeats = 0;
              this.updateUser({ log_token: res.token_info.login_token });
              if (res.err_code == 0 || res.err_code == 263) {
                // this.rescount = 0;
                this.number = res.data.dev_info_list.length;
                res.data.dev_info_list.forEach((item, index, arr) => {
                  this.deviceArr.push(item);
                  if (item.dev_type == -1) {
                    this.devnameokArr[index] = true;
                    this.devnameokArr = this.devnameokArr.concat([]);
                    this.deviceArr[index].nonestyle = "none";
                    this.deviceArr[index].feistyle = "black";
                    this.deviceArr[index].bind_num = "非法设备";
                    this.deviceArr[index].bind = "立即绑定";
                  } else {
                    if (item.bind_state == 0||item.bind_state==102) {
                      this.deviceArr[index].nonestyle = "none";
                      this.deviceArr[index].feistyle = "none";
                      this.deviceArr[index].bind = "立即绑定";
                    } else {
                      this.devnameokArr[index] = true;
                      this.devnameokArr = this.devnameokArr.concat([]);
                      this.deviceArr[index].distea = true;
                      this.deviceArr[index].bind = "已绑定";
                    }
                  }
                });
                this.$router.push({
                  name: "find",
                  // name: "localsearch",
                  params: {
                    dev_list: this.deviceArr
                  }
                });
              } else {
                // this.rescount = 0;
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
            } else if (res.status == -5) {
              this.$router.push({ path: "/searchbinding" });
            } else {
              // this.rescount = 0;
              const tip = this.$backStatusMap[res.status] || err[res.status];
              const str = tip ? this.$t(tip) : `请稍后重试 ${res.status}`;
              this.$toast(str);
            }
          })
          .catch(error => {
            Toast.clear();
            this.repeats = 0;
            this.$router.push({ path: "/searchbinding" });
          });
      }
    },
    // 设置设备名称并绑定
    setname(devname, devsn, num) {
      if (this.$parent.onLine == false) {
        Toast("无法连接网络，请检查网络状态");
      } else {
        if (!devname) {
          return this.$toast("该西柚机还未设置昵称");
        }
        if (!/^[\u4E00-\u9FA5A-Za-z0-9_]{4,20}$/.test(this.devname)) {
          return this.$toast("设备名由4-20位汉字字母数字字符组成，请检查输入格式");
        }
        let params = new Object();
        params.login_token = this.log_token;
        params.dev_name = devname;
        params.dev_sn = devsn;
        params.bind_user_tel_num = this.phone_number;
        bindsetname(params) //设置设备名称
          .then(res => {
            if (res.status == 0) {
              this.updateUser({ log_token: res.token_info.login_token });
              if (res.err_code == 0) {
                Toast.success("设置成功");
                this.devnameokArr[num] = true;
                this.devnameokArr = this.devnameokArr.concat([]);
              } else if (res.err_code == 210) {
                Toast.success("当前设备名称已被占用，请换一个名称");
              } else {
                const sta = err[res.err_code]
                  ? this.$t(err[res.err_code])
                  : `请稍后重试 ${res.err_code}`;
                this.$toast(sta);
              }
            } else if (res.status == -13) {
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
              Toast("登录已过期，请重新登录");
              this.clearUser();
              setTimeout(() => {
                this.$router.push({ path: "/login" });
              }, 1000);
            } else if (res.status == -17) {
              Dialog.alert({
                message: "账号在其它地方登录，请重新登录"
              }).then(() => {
                this.clearUser();
                this.$router.push({ path: "/login" });
              });
            } else if (res.status == -500) {
            } else if (res.status == -5) {
              Toast("响应超时，请稍后重试");
            } else if (res.status == -3) {
              Toast("设备名称中包含非法字符");
            } else {
              const tip = this.$backStatusMap[res.status] || err[res.status];
              const str = tip ? this.$t(tip) : `请稍后重试 ${res.status}`;
              this.$toast(str);
            }
          })
          .catch(error => {
            // Toast("网络错误，请重新请求1");
          });
      }
    },

    bindind() {
      //绑定完成进入下一页面
      //  window.location.href ="http://47.99.193.140/window.html";
      this.$router.push({
        path: "/management"
      });
      //Toast("已绑定1/3西柚机");
    },
    resetDiv() {
      //ios 兼容，input失去焦点后界面上移不恢复的问题
      setTimeout(() => {
        let scrollHeight =
          document.documentElement.scrollTop || document.body.scrollTop || 0;
        window.scrollTo(0, Math.max(scrollHeight - 1, 0));
      }, 100);
    },
    onClickLeft() {
      this.$router.push({
        path: "/binding"
      });
    },
    onClickRight() {
      try {
        window.webkit.messageHandlers.scanQRCodeByCamera.postMessage(
          "scancode"
        );
      } catch (e) {}
      try {
        window.android.startScanCode("scancode");
      } catch (e) {}
      window.scancode = this.scancode; //绑定在window全局变量上，不加括号
    },
    scancode: function(data) {
      try {
        let nowarr = JSON.parse(data);
        if (!nowarr.sn) {
          Toast(`未知二维码`);
        } else {
          this.devlist.push(nowarr.sn);
          this.$router.push({
            name: "find",
            params: {
              dev_list: this.devlist
            }
          });
        }
      } catch (e) {
        Toast(`未知二维码`);
      }
    }
  }
};
</script>

<style lang="less" scoped>
/deep/.van-nav-bar .van-icon {
  color: #333333;
}
/deep/ .van-nav-bar .van-icon {
  margin-top: 0;
}
.titright {
  line-height: 44px;
  padding-right: 0.2rem;
  display: flex;
  align-items: center;
  span {
    color: #333333;
  }
}
.van-nav-bar {
  color: #333333;
  background: #ffffff;
}
.alltitleleft span {
  color: #333333;
  font-size: 0.28rem;
}
.container {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  // overflow: hidden;
  background: #f8f8f8;
  .container_introduction {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    // overflow: hidden;
    background: #f8f8f8;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    .number {
      height: 1rem;
      width: 100%;
      color: #333333;
      background-color: #f8f8f8;
      font-size: 0.48rem;
      margin-top: 1.3rem;
    }
    .introduction_text {
      font-size: 0.4rem;
      color: #cccccc;
      background-color: #fff;
      margin: auto;
      width: 6.69rem;
      height: 7.32rem;
      padding-bottom: 0.2rem;
      // background: #fff;
      border-radius: 0.12rem;
      box-shadow: 0 0 10px #e6e6e6;
      .item_active_next {
        width: 100%;
        height: 0.0000001rem;
        position: relative;
        top: 0.6rem;
        left: 0;
        display: flex;
        background-color: #ffffff;
        justify-content: center;
        img {
          width: 62%;
        }
        .item_active_left {
          width: 1rem;
          height: 1rem;
          position: relative;
          left: -2rem;
          top: -5rem;
          z-index: 3500;
        }
        .item_active_right {
          width: 1rem;
          height: 1rem;
          position: relative;
          right: -2rem;
          top: -5rem;
          z-index: 3500;
        }
      }

      .serial {
        width: 90%;
        color: #000000;
        text-align: left;
        padding: 0 4% 0 6%;
        margin-top: 0.2rem;
        border-radius: 0.12rem 0.12rem 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span {
          display: inline-block;
          width: 1;
          height: 0.6rem;
          line-height: 0.6rem;
          text-align: center;
          border-radius: 50%;
          font-size: 0.28rem;
        }
        span:nth-child(2) {
          color: #ff6d6e;
          font-size: 0.24rem;
          display: flex;
          align-items: center;
          img {
            width: 20%;
            margin-right: 0.1rem;
          }
        }
      }
      .find_devive {
        width: 90%;
        margin: 0 auto;
        // overflow: hidden;
        .find_devive_item {
          font-size: 0.24rem;
          color: #666666;
          .usertel,
          .usert {
            margin: 0 0 0.1rem 0;
            font-size: 0.22rem;
            color: #ff0000;
          }
          &.item_active {
            width: 2.4rem;
            // height: 2.4rem;
            margin: 0 auto;
            margin-top: 0.6rem;
            // display: flex;
            // justify-content: center;
            // align-items: center;
            // border-radius: 50%;
            img {
              width: 93%;
              height: 77%;
            }
          }
          &.item_btn {
            margin-top: 0.2rem;
            .item_btn_check {
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }
          &.item_active_one {
            font-size: 0.28rem;
            color: #333333;
            margin-top: 0.4rem;
            img {
              margin-bottom: -0.08rem;
              width: 6%;
              height: 6%;
            }
          }
          &.item_active_two {
            margin-top: 0.4rem;
          }
          input {
            width: 4.6rem;
            height: 0.8rem;
            outline: none;
            border-radius: 0.1rem;
            color: #000000;
            padding-left: 0.2rem;
            margin: 0.02rem;
            border: none;
            background: none;
            text-align: left;
            background-color: #f2f2f2;
          }
          .find_btn {
            // margin: 0 auto;
            color: #3477fd;
            font-size: 0.26rem;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 0.69rem;
            line-height: 1rem;
            background: #ffffff;
            border-radius: 0;
            border: none;
            border-bottom: 1px solid #3477fd;
          }
        }
      }
    }
    .dopbtn {
      padding-top: 1.16rem;
      .introduction_start {
        font-size: 0.28rem;
        color: #ffffff;
        margin: 0 auto;
        // margin-top: 1.36rem;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 6rem;
        height: 0.8rem;
        background: linear-gradient(
          90deg,
          rgba(254, 168, 107, 1) 0%,
          rgba(255, 109, 110, 1) 100%
        );
        box-shadow: 0 0.1rem 0.1rem 0 #ff6d6e1a;
        border-radius: 0.1rem;
        margin-bottom: 1.84rem;
        border: none;
      }
    }
  }
}
</style>
