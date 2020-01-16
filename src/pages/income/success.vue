<template>
  <div class="container">
    <navBar :title="title" :right-text="title">
      <van-icon name="search" slot="right" />
    </navBar>
    <scroller>
      <div class="content">
        <div class="successtop">
          <span @click="gomanagementinfo">完成</span>
        </div>
        <div class="successimg">
          <img src="../../assets//images/success.png" alt />
          <div class="yin"></div>
          <p>兑换成功</p>
        </div>
        <div class="successcon">
          <span>积分</span>
          {{num|returnFloat}}
        </div>
        <div class="successfoot">
          <div class="successdop">
            <span class="successdop_left">充值账户</span>
            <span class="cuccessdop_right">{{tel}}</span>
          </div>
          <div class="successdop">
            <span class="successdop_left">充值方式</span>
            <span class="cuccessdop_right">积分兑换</span>
          </div>
          <div class="successdop">
            <span class="successdop_left">充值币种</span>
            <span class="cuccessdop_right">{{currency}}</span>
          </div>
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
import Scroll from "vue-slim-better-scroll";
import navBar from "../../components/navBar";
export default {
  data() {
    return {
      title: "兑换成功",
      num: 0,
      tel: "",
      currency: ""
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
  mounted() {
    this.num = this.$route.query.num;
    this.tel = this.$route.query.tel;
    this.currency = this.$route.query.currency;
    setTimeout(() => {
      this.$router.push({ path: "/minemachine" });
    }, 2500);
  },
  methods: {
    gomanagementinfo() {
      this.$router.push({ path: "/managementinfo" });
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
  background-color: #fff;
  color: #000000;
  .content {
    width: 100%;
    height: 100%;
    .successtop {
      width: 100%;
      padding-bottom: 0.6rem;
      margin-top: 1.2rem;
      text-align: right;
      span {
        color: #5cce80;
        margin-right: 0.2rem;
      }
    }
    .successimg {
      .yin {
        width: 0.6rem;
        height: 0.08rem;
        border-radius: 50%;
        background-color: #eaeaea;
        margin: auto;
        margin-bottom: 0.3rem;
        margin-top: 0.1rem;
      }
      p {
        font-size: 0.26rem;
        color: #424b66;
      }
    }
    .successcon {
      margin-top: 0.68rem;
      font-size: 0.72rem;
      font-weight: 600;
      color: #252834;
      span {
        font-size: 0.24rem;
        color: #6a6c79;
      }
    }
    .successfoot {
      margin-top: 0.8rem;
      .successdop {
        display: flex;
        justify-content: space-between;
        padding: 0 0.3rem;
        font-size: 0.28rem;
        line-height: 0.66rem;
        .successdop_left {
          color: #808080;
          font-weight: 400;
        }
        .successdop_right {
          color: #252834;
          font-weight: 500;
        }
      }
    }
  }
}
</style>