<template>
  <div class="container">
    <van-nav-bar
      left-text="返回"
      left-a
      rrow
      left-arrow
      fixed
      @click-left="onClickLeft()"
      @click-right="onClickRight()"
      :z-index="2000"
    >
      <div slot="left" class="alltitleleft">
        <van-icon name="arrow-left" color="#ffffff" />
        <span>返回</span>
      </div>
      <div slot="right" class="titright">
        <van-icon name="scan" size="0.4rem" />
        <span>扫码绑定</span>
      </div>
      <!-- <van-icon name="comment" slot="right" size="0.46rem" color="#808080" /> -->
    </van-nav-bar>
    <scroller>
      <div class="container_introduction">
        <div class="number">发现{{number}}个西柚机</div>
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
                  v-bind:style="{opacity:leftstyle}"
                >
                  <img src="../../assets/images/find_icon_arrow1.png" />
                </div>
                <div
                  class="item_active_right"
                  @click="nextpage()"
                  v-bind:style="{opacity:rightstyle}"
                >
                  <img src="../../assets/images/find_icon_arrow2.png" />
                </div>
              </div>
              <van-swipe-item
                v-for="(item,index) in deviceArr"
                v-bind:key="index"
                @click="changeitem(item,index)"
              >
                <!-- :ref="`deviceArr${index}`" -->

                <!-- 类容区域 -->
                <div class="serial">
                  <span>{{(index+1>=10)?index+1:"0"+(index+1)}}</span>
                </div>
                <div class="find_devive">
                  <div class="find_devive_item item_active">
                    <img src="../../assets/images/binding_illustration3.png" />
                  </div>

                  <div class="find_devive_item item_active_one">
                    <img src="../../assets/images/binding_capacity.png" alt />
                    容量：{{((item.free_cap)/1024/1024/1024).toFixed(2)}}GB
                  </div>
                  <div class="find_devive_item">序号：{{item.dev_sn}}</div>
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
                      v-bind:style="{display:item.nonestyle}"
                    >{{item.bind_user_tel_num|newtel}}</div>
                    <div class="usert" v-bind:style="{display:item.feistyle}">{{item.bind_num}}</div>
                    <div>
                      <div class="item_btn_check">
                        <!-- <van-checkbox v-model="checked"></van-checkbox> -->
                        <van-button
                          class="find_btn"
                          @click="setname(item.dev_name,item.dev_sn,index)"
                          :disabled="devnameokArr[index]"
                        >{{item.bind}}</van-button>
                      </div>
                    </div>
                  </div>
                </div>
              </van-swipe-item>
            </van-swipe>
          </div>
        </div>

        <div class="dopbtn">
          <van-button class="introduction_start" @click="bindind()">绑定完成</van-button>
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
      console.log(index);
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
        console.log(params);
        getMinerInfo(params) //获取设备信息
          .then(res => {
            console.log(res);
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
                    if (item.bind_state == 0) {
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
                console.log(this.deviceArr);
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
            console.log("无网络连接");
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
        if (!/^[\u4E00-\u9FA5A-Za-z0-9_]+$/.test(this.devname)) {
          return this.$toast("昵称格式不对");
        }
        if (this.repeats == 1) {
          return false;
        }
        this.repeats = 1;
        if (this.rescount >= 3) {
          this.rescount = 0;
          this.repeats = 0;
          Toast(`请求超时，请稍后重试`);
          return false;
        }
        // this.devnameokArr[this.current] = true;
        // console.log(this.devnameokArr);
        // this.devnameokArr = this.devnameokArr.concat([]);
        // console.log(this.devnameokArr);

        let params = new Object();
        params.login_token = this.log_token;
        params.dev_name = devname;
        params.dev_sn = devsn;
        params.bind_user_tel_num = this.phone_number;
        console.log(params);
        bindsetname(params) //设置设备名称
          .then(res => {
            console.log(res);
            this.repeats = 0;
            if (res.status == 0) {
              this.updateUser({ log_token: res.token_info.login_token });
              if (res.err_code == 0) {
                this.rescount = 0;
                Toast.success("设置成功");
                this.devnameokArr[num] = true;
                this.devnameokArr = this.devnameokArr.concat([]);
                // this.deviceArr = [];
                // this.scan();
              } else if (res.err_code == 210) {
                this.rescount = 0;
                Toast.success("当前设备名称已被占用，请换一个名称");
              } else {
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
              this.setname(devname, devsn, num);
            } else if (res.status == -3) {
              this.rescount = 0;
              Toast("设备名称中包含非法字符");
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
            this.setname(devname, devsn, num);
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
      console.log("扫码绑定");
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
      console.log(data);
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

<style lang="less" scoped >
/deep/.van-nav-bar .van-icon {
  color: #fff;
}
.titright {
  line-height: 44px;
  padding-right: 0.2rem;
  span {
    color: #fff;
  }
}
.van-nav-bar {
  color: #fff;
  background: linear-gradient(
    45deg,
    rgba(116, 90, 243, 1) 10%,
    rgba(92, 116, 243, 1) 100%
  );
}
.alltitleleft span {
  color: #ffffff;
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
      color: #000000;
      background-color: #f8f8f8;
      font-size: 0.52rem;
      margin-top: 1.3rem;
      font-weight: 700;
      margin-bottom: 0.4rem;
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
          top: -4.5rem;
          z-index: 3500;
        }
        .item_active_right {
          width: 1rem;
          height: 1rem;
          position: relative;
          right: -2rem;
          top: -4.5rem;
          z-index: 3500;
        }
      }

      .serial {
        color: #5f7bf2;
        text-align: left;
        padding-left: 0.5rem;
        margin-top: 0.2rem;
        border-radius: 0.12rem 0.12rem 0 0;
        span {
          display: inline-block;
          width: 0.6rem;
          height: 0.6rem;
          line-height: 0.6rem;
          text-align: center;
          border-radius: 50%;
          font-weight: 700;
          font-size: 0.52rem;
        }
      }
      .find_devive {
        width: 90%;
        margin: 0 auto;
        // overflow: hidden;
        .find_devive_item {
          margin-top: 0.1rem;
          font-size: 0.24rem;
          color: rgba(128, 128, 128, 1);
          .usertel,
          .usert {
            margin: 0 0 0.1rem 0;
            font-size: 0.22rem;
            color: #ff0000;
          }
          &.item_active {
            width: 2.4rem;
            height: 2.4rem;
            margin: 0 auto;
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
            font-size: 0.35rem;
            color: rgba(49, 49, 49, 1);
            font-weight: 700; //加粗
            img {
              margin-bottom: -0.08rem;
              width: 6%;
              height: 6%;
            }
          }
          &.item_active_two {
            margin-top: 0.8rem;
          }
          input {
            width: 3.03rem;
            height: 0.69rem;
            outline: none;
            border-radius: 0.12rem;
            color: #000000;
            padding-left: 0.2rem;
            margin: 0.02rem;
            border: none;
            background: none;
            text-align: left;
            background-color: #f1f1f1;
          }
          .find_btn {
            // margin: 0 auto;
            color: rgb(255, 255, 255);
            font-size: 0.26rem;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 1.88rem;
            height: 0.69rem;
            background: linear-gradient(
              90deg,
              rgba(116, 90, 243, 1) 0%,
              rgba(92, 116, 243, 1) 100%
            );
            border-radius: 0.12rem;
            border: none;
          }
        }
      }
    }
    .dopbtn {
      padding-top: 1.16rem;
      .introduction_start {
        font-size: 0.3rem;
        color: #ffffff;
        margin: 0 auto;
        // margin-top: 1.36rem;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 5.9rem;
        height: 0.88rem;
        background: linear-gradient(
          90deg,
          rgba(116, 90, 243, 1) 0%,
          rgba(92, 116, 243, 1) 100%
        );
        border-radius: 1rem;
        margin-bottom: 1.84rem;
        border: none;
      }
    }
  }
}
</style>
