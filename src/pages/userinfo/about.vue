<template>
  <div class="container">
    <!-- <navBar :title="title" :right-text="title">
      <van-icon name="search" slot="right"/>
    </navBar>-->
    <navBar :title="title"></navBar>
    <scroller>
      <div class="user">
        <div class="user_con">
          <div class="user_con_item">
            <div class="kuang">
              <img src="../../assets/images/per_logo12x.png" alt />
            </div>
            <div class="app_name">
              <span class="app_name_left">西柚APP</span>
              <span class="app_name_right">V 1.3.1.134</span>
            </div>
            <p>更新于 2019-12-20</p>
          </div>

          <hr />
          <div class="user_con_content">
            <p>
              西柚机是一款西柚用户们通过贡献闲置网络带宽、存储空间提供给上游的需求企业，用户从中赚取积分奖励的智能硬件产品。西柚用户可以使用西柚积分在公司搭建的闲置共享经济体系中进行各种价值兑换。
            </p>
          </div>
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
import navBar from "../../components/navBar";

export default {
  data() {
    return {
      title: "关于我们"
    };
  },
  mounted() {},
  methods: {},
  components: {
    navBar: navBar
  }
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  margin: 0 auto;
  height: 100%;
  overflow: hidden;
  background: #ffffff;
  .user {
    width: 6.9rem;
    background: #ffffff;
    border-radius: 0.12rem;
    height: auto;
    overflow: hidden;
    margin: auto;
    margin: 1.3rem 0.3rem 0.3rem;
    hr {
      width: 6.3rem;
      height: 0.01rem;
      background-color: #aaaaaa;
      color: #222a45;
      border: solid #aaaaaa 0.01rem;
    }
    .user_con {
      width: 95%;
      height: auto;
      margin: 0 auto;
      .user_con_item {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        flex-direction: column;
        text-align: left;
        padding: 0rem 0rem;
        box-sizing: border-box;
        margin: 0 auto;
        .kuang {
          margin: auto;
          margin-top: 0.6rem;
          width: 1.52rem;
          height: 1.52rem;
          line-height: 1.52rem;
          text-align: center;
          border-radius: 0.28rem;
          // border: 0.04rem solid #656bf3;
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width: 80%;
            height: 80%;
          }
        }
        .app_name {
          margin: 0 auto;
          margin-top: 0.107rem;
          .app_name_left {
            height: 0.44rem;
            font-size: 0.32rem;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: #000000;
            line-height: 0.44rem;
          }
          .app_name_right {
            margin-left: 0.2rem;
            height: 0.44rem;
            font-size: 0.32rem;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: #656bf3;
            line-height: 0.44rem;
          }
        }
        p {
          display: inline-block;
          text-align: center;
          margin: 0.32rem 0;
          height: 0.34rem;
          font-size: 0.24rem;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: #0f0f0f;
          line-height: 0.34rem;
        }
      }
      .user_con_content {
        font-size: 0.28rem;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgb(0, 0, 0);
        line-height: 0.4rem;
        text-align: left;
        padding: 0 0.26rem 0 0.34rem;
        overflow: auto;
        height: 7.35rem;
        -webkit-overflow-scrolling: touch; /* liuhx:可以把这整行注释掉对比差别 */
        p {
          margin-bottom: 0.2rem;
          text-indent: 0.6rem;
        }
      }
    }
  }
}
@media screen and (min-device-height: 812px) {
  .user_con_content {
    height: 9.35rem !important;
  }
}
</style>
