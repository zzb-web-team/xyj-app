/* * @Author: mikey.zhaopeng * @Date: 2019-09-19 18:08:29 * @Last Modified by:
mikey.zhaopeng * @Last Modified time: 2019-12-12 09:31:51 */
<template>
  <div class="container">
    <div class="container_top">
      <img src="../../assets/images/bg5.png" />
      <div>共享经济时代的智能硬盘</div>
    </div>
    <div class="container_logo">
      <img src="../../assets/images/indexlog.png" />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { err } from "../../common/js/status";
import {
  get_code,
  login,
  getUserinfo,
  get_tag,
  turnon
} from "../../common/js/api.js";
import { error } from "util";

export default {
  data() {
    return { version: "1.3.2.163", tag: "", push_id: "" };
  },
  computed: mapState({
    log_token: state => state.user.log_token,
    phone_number: state => state.user.phone_number,
    user_name: state => state.user.user_name,
    user_sex: state => state.user.user_sex,
    charge_psd: state => state.user.charge_psd
  }),
  created() {
    window.get_pushid = this.get_pushid;
  },
  mounted: function() {
    // this.get_pushid();

    //状态栏颜色
    try {
      window.webkit.messageHandlers.setStatusBarAndNavigationBarColor.postMessage(
        "#6389FE"
      );
    } catch (error) {}
    this.mycommon.versionnumber({ version: this.version });
    setTimeout(() => {
      this.mycommon.obtain();
      window.gettoken = this.gettoken; //绑定在window全局变量上，不加括号
      // 浏览器端测试代码
      if (!window.webkit && !window.android) {
        this.gettoken("(null)");
      }
    }, 200);
  },
  methods: {
    ...mapMutations(["updateUser", "clearUser"]),
    //消息推送--传tag
    push_tag() {

      try {
        window.webkit.messageHandlers.setPushId.postMessage(this.tag);
      } catch (e) {}
      try {
        window.android.setPushTag(this.tag);
      } catch (e) {}
    },
    //消息推送--获取消息id
    get_pushid: function(data) {
      if (data == "(null)") {
        // 没有取到数据
        this.allid.pid = "a";
        this.$router.push({
          path: "/message",
          query: {
            push_id: this.allid.pid
          }
        });
      } else {
        // 取到数据
        if (data) {
          // let nearr = JSON.parse(data);
          this.allid.pid = data;
          this.$router.push({
            path: "/message_details",
            query: {
              push_id: this.allid.pid
            }
          });
        } else {
          this.allid.pid = "a";
          this.$router.push({
            path: "/message",
            query: {
              push_id: this.allid.pid
            }
          });
        }
      }
    },
    getuser() {
      //获取个人信息
      let params = new Object();
      params.col_name = [
        "user_name",
        "user_tel",
        "charge_psd",
        "user_birth",
        "user_sex"
      ];
      params.login_token = this.log_token;
      getUserinfo(params)
        .then(res => {
          if (res.status == 0) {
            this.updateUser({
              log_token: res.data.login_token,
              phone_number: res.data.col_value[1],
              user_name: res.data.col_value[0],
              user_sex: res.data.col_value[4],
              charge_psd: res.data.col_value[2]
            });
            let params = new Object();
            params.login_token = this.log_token;
            get_tag(params)
              .then(res => {
                if (res.status == 0) {
                  if (res.err_code == 0) {
                    this.updateUser({
                      log_token: res.token_info.token
                    });
                    let params = new Object();
                    params.phone = this.phone_number;
                    params.version = this.version;
                    turnon(params)
                      .then(res => {
                      })
                      .catch(error => {
                      });
                    this.tag = res.data.tag;
                    //调用原生方法并传递tag
                    this.push_tag();
                  }
                }
              })
              .catch(error => {
              });
            setTimeout(() => {
              try {
                window.android.splashLoadFinish();
              } catch (e) {}
              this.$router.push({
                path: "/management"
              });
            }, 200);
          } else {
            try {
              window.android.splashLoadFinish();
            } catch (e) {}
            this.$router.push({
              path: "/login"
            });
          }
        })
        .catch(error => {
          try {
            window.android.splashLoadFinish();
          } catch (e) {}
          this.$router.push({
            path: "/login"
          });
          // Toast("网络错误，请重新请求");
        });
    },
    //版本控制
    versioncontrol: function(arr) {
      let control = "";
      control = arr;
    },
    //取数据
    gettoken: function(data) {
      // 读取存储的数据
      if (data == "(null)") {
        // 没有取到数据
      } else {
        // 取到数据
        let nearr = JSON.parse(data);
        this.updateUser(nearr[0]);
      }
      if (this.log_token) {
        this.getuser();
      } else {
        try {
          window.android.splashLoadFinish();
        } catch (e) {}
        return this.$router.push({ path: "/login" });
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
  background: #ffffff;
  .container_top {
    width: 100%;
    position: relative;
    img {
      width: 100%;
      height: 10.76rem;
    }
    div {
      padding: 0 0.86rem;
      position: absolute;
      top: 15%;
      left: 0;
      color: #ffffff;
      font-size: 0.8rem;
      font-family: TTMeiHeiJ;
    }
  }
  .container_logo {
    width: 100%;
    height: 2.8rem;
    line-height: 2.8rem;
    img {
      width: 2.56rem;
      height: 0.88rem;
    }
  }
}
@media screen and (min-device-height: 812px) {
  .container {
    .container_top {
      img {
        height: 13rem;
      }
    }
  }
}
</style>
