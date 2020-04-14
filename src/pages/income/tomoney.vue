<template>
  <div class="container">
    <navBar :title="title" :right-text="title">
      <van-icon name="search" slot="right" />
    </navBar>
    <scroller>
      <div class="tomoney">
        <div class="tomoney_con">
          <div class="tomoney_con_item_integral">账户积分：{{toMoneyNum}}</div>
          <!-- <div class="tomoney_con_item">选择币种</div> -->
          <!-- <form>
          <select
            name="public-choice"
            class="iselect"
            v-model="couponSelected"
            @change="getCouponSelected"
          >
            <option
              :value="coupon.name"
              v-for="(coupon,index) in couponList"
              v-bind:key="index"
            >{{coupon.name}}</option>
          </select>
          </form>-->
          <!-- <div class="tomoney_con_item item_active_01">兑换积分</div> -->
          <div class="tomoney_con_item con_item_active item_active_02">
            <input
              type="number"
              v-model="toMoneyText"
              min="0"
              class="exchange"
              placeholder="请输入兑换积分"
              @blur="resetDiv"
              @keydown="handleInput2"
            />
            <span @click="all">全部</span>
          </div>
          <div class="tomoney_con_item">
            <!-- <p>可兑换 {{toMoneyText}} EUSD</p> -->
          </div>
          <div>
            <van-button class="tomoney_btn" @click="toMoneyBack()">确认兑换</van-button>
          </div>
        </div>
      </div>
    </scroller>
    <div class="masklayer" v-show="shows"></div>
    <transition name="bottom">
      <div class="foue" v-show="ave">
        <div class="level" v-show="levelshow">
          <div class="level_up">
            <div class="cancel">
              <div @click.stop="leavefalse">
                <img src="../../assets/images/cha.png" />
              </div>

              <!-- <span>取消</span> -->
            </div>
            <div class="level_ti">
              <div class="prompt">
                {{toMoneyText|returnFloat}}
                <!-- <span>POC</span> -->
              </div>
              <div class="account">
                <span>充值平台:</span>
                <span>小白交易</span>
              </div>
              <div class="account">
                <span>充值账号:</span>
                <span>{{xbuser_name}}</span>
              </div>
              <div class="way">
                <span>充值方式:</span>
                <span>积分兑换</span>
              </div>
              <div class="way">
                <span>订单号:</span>
                <span>{{orderid}}</span>
              </div>
              <div class="amount">
                <span>充值额度:</span>
                <p>
                  <span class="quota">{{toMoneyText|returnFloat}}</span>
                  <!-- <span>EUSD</span> -->
                </p>
              </div>
              <van-button class="tomoney_btn" @click="exchange()">立即兑换</van-button>
              <p>西柚积分将在您所授权的第三方平台完成充值</p>
              <p>最终的可兑换额度取决于第三方平台的实时汇率</p>
              <p>请确认后进行兑换</p>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <van-dialog
      v-model="shows"
      title="请输入六位交易密码"
      :overlay="false"
      show-cancel-button
      :beforeClose="beforeClose"
    >
      <div class="code-con">
        <div class="code-input-main">
          <!-- <div
            class="code-input-main-item"
            v-for="(disInput,index) in disInputs"
            v-bind:key="index"
          >{{disInput.value}}</div>-->
          <van-password-input :value="valuee" @focus="test()" />
        </div>
      </div>
    </van-dialog>
    <van-number-keyboard
      :show="show"
      theme="custom"
      extra-key="."
      close-button-text="完成"
      @blur="show = false"
      @input="onInput"
      @delete="onDelete"
      @close="gomomey"
      :safe-area-inset-bottom="true"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import navBar from "../../components/navBar";
import {
  Tabbar,
  TabbarItem,
  Toast,
  Dialog,
  NumberKeyboard,
  PasswordInput
} from "vant";
// Vue.use(Dialog)
import {
  toMoneyInfo,
  redeempoints,
  confirmorder
} from "../../common/js/api.js";
import { error } from "util";

export default {
  data() {
    return {
      showdbs: false,
      code: "123",
      show: false,
      shows: false,
      title: "积分兑换",
      active: 1,
      toMoneyNum: 0,
      minerAddress: "",
      toMoneyText: "",
      realInput: "",
      levelshow: false,
      repeats: 0, //防止重复点击
      rescount: 0, //请求计数
      ave: false,
      orderid: "",
      openid: "",
      xbuser_name: "",
      disInputs: [
        { value: "" },
        { value: "" },
        { value: "" },
        { value: "" },
        { value: "" },
        { value: "" }
      ],
      couponList: [
        { name: "EUSD" },
        { name: "POC" },
        { name: "BTC" },
        { name: "REBT" },
        { name: "ETH" },
        { name: "EOS" },
        { name: "USDT" }
      ],
      couponSelected: "",
      valuee: "",
      showKeyboard: true
    };
  },
  filters: {
    returnFloat(value) {
      var value = Math.round(parseFloat(value) * 100) / 100;
      var s = value.toString().split(".");
      if (s.length == 1) {
        value = value.toString() + ".00";
        return value;
      }
      if (s.length > 1) {
        if (s[1].length < 2) {
          value = value.toString() + "0";
        }
        return value;
      }
    }
  },
  computed: mapState({
    log_token: state => state.user.log_token,
    phone_number: state => state.user.phone_number,
    user_name: state => state.user.user_name,
    user_sex: state => state.user.user_sex,
    charge_psd: state => state.user.charge_psd
  }),
  // created() {
  //   // 判断是否授权，如果没有就跳到授权页面
  //   let secc_token = this.$store.state.access_token;
  //   if (secc_token == null) {
  //     this.$router.push({ path: "/ding" });
  //   }
  // },
  mounted: function() {
    this.toMoneyNum = (
      JSON.parse(sessionStorage.getItem("money")) / 1000000
    ).toFixed(6);
    if (this.$parent.onLine == false) {
      Toast("无法连接网络，请检查网络状态");
    } else {
    }
    this.couponSelected = this.couponList[0].name;
    //获取可兑换额度
    let param = new Object();
    param.minerPhoneNum = this.phone_number;
    // toMoney(param)
    //   .then(response => {
    //     console.log(response);
    //     let { data } = response;
    //     if (data != null) {
    //       console.log(response.data);
    //       this.toMoneyArr = response.data.toMoneyArr;
    //       this.minerAddress = response.data.toMoneyArr[0].toMoneyAddress;
    //     }
    //   })
    //   .catch(error => {
    //     Toast("网络错误，请重新请求");
    //   });
  },
  methods: {
    ...mapMutations(["updateUser", "clearUser"]),
    handleInput2(e) {
      // 通过正则过滤小数点后两位
      e.target.value = e.target.value.match(/^\d*(\.?\d{0,6})/g)[0] || null;
    },
    all() {
      this.toMoneyText = this.toMoneyNum;
    },
    // getCouponSelected() {
    //   //获取选中币种
    //   console.log(this.couponSelected);
    // },
    test() {
      this.show = true;
      this.shows = true;
    },
    //确认-取消按钮
    beforeClose(action, done) {
      if (action === "confirm") {
        this.confirm();
        this.valuee = "";
        done();
      } else if (action === "cancel") {
        done();
        this.valuee = "";
      }
    },
    getNum() {
      for (let i = 0; i < this.realInput.length; i++) {
        this.disInputs[i].value = this.realInput.charAt(i);
        // 表示字符串中某个位置的数字，即字符在字符串中的下标。
      }
    },
    delNum() {
      let oEvent = window.event;
      if (oEvent.keyCode == 8) {
        if (this.realInput.length > 0) {
          this.disInputs[this.realInput.length - 1].value = "";
        }
      }
    },
    goLink() {
      this.$router.push({ path: "/login" });
    },
    //确认订单信息
    toMoneyBack() {
      let MoneyNum = this.toMoneyNum;
      let reg = /^([1-9]\d*|0)(\.\d{1,6})?$/;
      if (this.toMoneyText == "" || this.toMoneyText * 1 == 0) {
        Toast("兑换额度不能为空");
        this.toMoneyText = 0;
        return false;
      } else if (this.toMoneyText * 1 > MoneyNum * 1) {
        Toast("您没有这么多额度");
        return false;
      } else if (!reg.test(this.toMoneyText)) {
        Toast("兑换额度最多到小数点后两位");
        return false;
      } else {
        const toast = Toast.loading({
          duration: 15000, // 持续展示 toast
          forbidClick: true, // 禁用背景点击
          loadingType: "spinner",
          mask: false
        });
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
        this.ave = true;
        let params = new Object();
        params.login_token = this.log_token;
        params.login_type = 1;
        params.amount = this.toMoneyText;
        params.wallet_type = "EUSD";
        // params.charge_psd = this.valuee;
        confirmorder(params)
          .then(res => {
            if (res.status == 0) {
              this.repeats = 0;
              this.rescount = 0;
              Toast.clear();
              this.levelshow = true;
              this.updateUser({ log_token: res.data.login_token });
              this.orderid = res.data.order_id;
              this.openid = res.data.open_id;
              this.xbuser_name = res.data.xb_user_name;
            } else if (res.status == -999) {
              this.rescount = 0;
              Toast.clear();
              Toast("登录已过期，请重新登录");
              setTimeout(() => {
                this.$router.push({ path: "/login" });
              }, 1000);
            } else if (res.status == -17) {
              this.rescount = 0;
              Toast.clear();
              Dialog.alert({
                message: "账号在其它地方登录，请重新登录"
              }).then(() => {
                this.$router.push({ path: "/login" });
              });
            } else if (res.status == -900) {
              this.rescount = 0;
              this.$router.push({ path: "/login" });
            } else if (res.status == -3) {
              this.rescount = 0;
              Toast.clear();
              Toast("您没有这么多额度");
            } else if (res.status == -5) {
              this.repeats = 0;
              this.rescount++;
              Toast.clear();
              this.toMoneyBack();
            } else {
              this.rescount = 0;
              Toast.clear();
              const tip = this.$backStatusMap[res.status] || err[res.status];
              const str = tip ? this.$t(tip) : `请稍后重试 ${res.status}`;
              this.$toast(str);
            }
          })
          .catch(error => {});
      }
    },
    //立即兑换
    exchange() {
      this.levelshow = false;
      this.ave = false;
      this.show = true;
      this.shows = true;
    },
    //数字键盘-数字按钮
    onInput(key) {
      this.valuee = (this.valuee + key).slice(0, 6);
    },
    //数字键盘-删除
    onDelete() {
      this.valuee = this.valuee.slice(0, this.valuee.length - 1);
    },
    //数字键盘-完成按钮
    gomomey() {
      this.confirm();
      this.shows = false;
      this.toMoneyText = "";
      this.valuee = "";
    },
    //输入密码兑换
    confirm() {
      let reg = /^\d{6}$/;
      if (!reg.test(this.valuee)) {
        Toast("密码格式错误");
        return false;
      } else {
        const toast = Toast.loading({
          duration: 9000, // 持续展示 toast
          forbidClick: true, // 禁用背景点击
          loadingType: "spinner",
          mask: false
        });
        let nowparam = new Object();
        nowparam.login_type = 1;
        nowparam.amount = this.toMoneyText;
        nowparam.wallet_type = "EUSD";
        nowparam.open_id = this.openid;
        nowparam.order_code = this.orderid;
        nowparam.login_token = this.log_token;
        nowparam.charge_psd = this.valuee; //获取密码
        redeempoints(nowparam)
          .then(res => {
            return res;
          })
          .then(res => {
            if (res) {
              Toast.clear();
            }
            if (res.status == 0) {
              this.toMoneyText = "";
              this.valuee = "";
              this.updateUser({ log_token: res.data.login_token });
              this.$router.push({
                path: "/success",
                query: {
                  tel: this.xbuser_name,
                  currency: nowparam.wallet_type,
                  num: nowparam.amount
                }
              });
            } else if (res.status == -901) {
              Toast(res.msg.msg); //系统错误
            } else if (res.status == -999) {
              Toast("登录已过期，请重新登录");
              setTimeout(() => {
                this.$router.push({ path: "/login" });
              }, 1000);
            } else if (res.status == -17) {
              Dialog.alert({
                message: "账号在其它地方登录，请重新登录"
              }).then(() => {
                this.$router.push({ path: "/login" });
              });
            } else if (res.status == -900) {
              this.$router.push({ path: "/login" });
            } else if (res.status == -5) {
              Toast(`请求超时，请稍后重试`);
            } else if (res.status == -15) {
              if (res.err_code == 421) {
                Toast({
                  message:
                    "您未设置交易密码，为了您的账号安全请先去设置交易密码",
                  duration: 800
                });
                setTimeout(() => {
                  this.$router.push({ path: "/password" });
                }, 800);
              } else if (res.err_code == 423) {
                Toast({
                  message: "交易密码错误，请确认后重试",
                  duration: 800
                });
              }
            } else {
              const tip = this.$backStatusMap[res.status] || err[res.status];
              const str = tip ? this.$t(tip) : `请稍后重试 ${res.status}`;
              this.$toast(str);
            }
          })
          .catch(error => {
            // Toast("网络错误，请重新请求");
          });
      }
    },
    cancel() {
      //console.log("取消");
    },
    //取消
    leavefalse() {
      this.levelshow = false;
      this.ave = false;
    },
    preventNotNumber(event) {
      let keyValue = event.key;
      if (
        !calculator.isBackspace(keyValue) &&
        !calculator.isDot(keyValue) &&
        !calculator.isNumber(keyValue)
      ) {
        // 其他按键
        event.preventDefault();
        event.stopPropagation();
        return false;
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

<style lang="less" scoped >
/deep/.van-password-input {
  width: 100%;
}
/deep/.van-password-input__security {
  height: 0.6rem;
  margin-top: 0.2rem;
}
.container {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  overflow: hidden;
  background: #f8f8f8;
  .masklayer {
    position: relative;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    background-color: rgba(255, 0, 0, 0);
  }
  .tomoney {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 6.44rem;
    background: #f8f8f8;
    border-radius: 0.12rem;
    margin: auto;
    margin-top: 0.8rem;
    .tomoney_con {
      width: 100%;
      height: auto;
      margin: 0 auto;
      display: flex;
      justify-content: flex-start;
      flex-direction: column;
      //text-align: left;
      .tomoney_con_item_integral {
        text-align: left;
        height: 0.44rem;
        font-size: 0.3rem;
        padding-top: 0.2rem;
        padding-left: 0.2rem;
        margin-bottom: 0.2rem;
        color: #000;
      }
      .iselect {
        width: 100%;
        height: 0.6rem;
        font-size: 0.36rem;
        color: #ffffff;
        background: #293253;
      }
      .tomoney_con_item {
        padding-left: 0.2rem;
        &:nth-child(1) {
          margin-top: 0.3rem;
        }
        display: flex;
        justify-content: flex-start;
        height: 0.6rem;
        align-items: center;
        color: #7e869f;
        font-size: 0.3rem;
        p {
          font-size: 0.28rem;
          color: #ff467c;
        }
        .active_p {
          color: #ff467c;
          font-size: 0.24rem;
        }
        font-size: 0.3rem;
        &.con_item_active {
          // border-bottom: 1px solid #999999;
          font-size: 0.24rem;
          color: #000000;
          input {
            border: none;
            background: none;
            font-size: 0.26rem;
          }
          span {
            color: #000000;
            font-size: 0.3rem;
          }
        }
        &.item_active_01 {
          margin-top: 0.4rem;
        }
        &.item_active_02 {
          background-color: #fff;
          height: 0.88rem;
          .exchange {
            padding-left: 0.2rem;
            height: 0.36rem;
            width: 85%;
            max-width: 85%;
            overflow: hidden;
          }
        }
        &.con_item_input {
          width: 100%;
          margin: 0 auto;
          margin-top: 0.6rem;
          input {
            width: 100%;
            color: #000000;
          }
        }
      }
      .tomoney_btn {
        color: #ffffff;
        font-size: 0.3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        margin-top: 0.2rem;
        width: 5.9rem;
        height: 0.88rem;
        background: linear-gradient(
          45deg,
          rgba(116, 90, 243, 1) 10%,
          rgba(92, 116, 243, 1) 100%
        );
        border-radius: 1rem;
        border: none;
        margin-top: 0.65rem;
      }
    }
  }
}
.code-con {
  width: 100%;
  height: auto;
  overflow: hidden;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
}
.code-input-input {
  height: 0.44rem;

  outline: none;
  color: transparent;
  text-shadow: 0 0 0 transparent;
  width: 100%;
  color: red;
}
.code-input-main {
  display: flex;
  height: 1rem;
  width: 4rem;
  margin: 0 auto;
  justify-content: space-around;
}
.code-input-main-item {
  width: 0.34rem;
  height: 0.44rem;
  opacity: 0.8;
  border-bottom: solid #9ea9d3 2px;
  margin: 0 0.05rem;
  text-align: center;
  //padding-bottom: 0.1rem;
  font-size: 0.3rem;
  color: #000000;
  display: flex;
  justify-content: center;
  align-items: center;
}
.van-button--default {
  background-color: #48537a;
}
.foue {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(240, 240, 240, 0.1);
  .level {
    background-color: #ffffff;
    color: rgb(0, 0, 0);
    width: 100%;
    height: 75%;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 110;
    -webkit-transition: all 0.6s ease-in;
    transition: all 0.1s ease-in;
    .level_up {
      .cancel {
        text-align: left;
        padding: 0.1rem;
        img {
          margin-left: 0.2rem;
          margin-top: 0.1rem;
          width: 7%;
        }
      }
    }
    .level_ti {
      .prompt {
        width: 100%;
        font-size: 0.6rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-bottom: 0.4rem;
        span {
          color: #ff467c;
          font-size: 0.5rem;
        }
      }
      .account {
        line-height: 0.8rem;
        margin: 0 0.2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 0.01rem solid #f3f3f3;
        span:nth-child(1) {
          color: #7e869f;
        }
      }
      .way {
        line-height: 0.8rem;
        margin: 0 0.2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 0.01rem solid #f3f3f3;
        span:nth-child(1) {
          color: #7e869f;
        }
      }
      .amount {
        line-height: 0.8rem;
        margin: 0 0.2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 0.01rem solid #f3f3f3;
        p {
          span {
            font-size: 0.3rem;
          }
        }
        span:nth-child(1) {
          color: #7e869f;
        }
        .quota {
          color: #000 !important;
        }
      }
      .tomoney_btn {
        color: #ffffff;
        font-size: 0.3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        width: 6.9rem;
        height: 0.88rem;
        background: linear-gradient(
          45deg,
          rgba(116, 90, 243, 1) 10%,
          rgba(92, 116, 243, 1) 100%
        );
        border-radius: 1rem;
        border: none;
        margin-top: 1rem;
        margin-bottom: 0.1rem;
      }
      p {
        font-size: 0.2rem;
        color: #5c74f3;
        margin: 0.05rem 0;
      }
    }
  }
}
.bottom-enter,
.bottom-leave-to {
  transform: translate3d(0, 200%, 0);
}
.bottom-leave,
.bottom-enter-to {
  transform: translate3d(0, 0, 0);
}
.bottom-enter-active,
.bottom-leave-active {
  transition: all 0.6s;
}
</style>
