<template>
  <div class="help_center">
    <navBar></navBar>
    <div class="help_center_content">
      <div class="help_center_content_top">
        <p>帮助中心</p>
      </div>
      <div class="help_center_content_con">
        <div class="help_center_content_con_item">
          <div class="con_item_left">
            <div>
              <img src="../../assets/images/help_shebei.png" alt />
            </div>
            <div>西柚机设备</div>
            <van-icon name="arrow-down" />
          </div>
          <div class="con_item_right">
            <p>如何绑定设备?</p>
            <p>设备链接电源后不在线怎么处理?</p>
          </div>
        </div>

        <div class="help_center_content_con_item">
          <div class="con_item_left">
            <div>
              <img src="../../assets/images/help_shouyi.png" alt />
            </div>
            <div>收益</div>
            <van-icon name="arrow-down" />
          </div>
          <div class="con_item_right">
            <p>如何绑定设备?</p>
            <p>设备链接电源后不在线怎么处理?</p>
          </div>
        </div>

        <div class="help_center_content_con_item">
          <div class="con_item_left">
            <div>
              <img src="../../assets/images/help_shouyi.png" alt />
            </div>
            <div>积分兑换</div>
            <van-icon name="arrow-down" />
          </div>
          <div class="con_item_right">
            <p>如何绑定设备?</p>
            <p>设备链接电源后不在线怎么处理?</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import navBar from "../../components/navBar";
export default {
  data() {
    return {};
  },
  components: {
    navBar: navBar
  }
};
</script>

<style lang="less" scoped>
.help_center {
  width: 100%;
  height: 100%;
  background-color: #eeeeee;
  .help_center_content {
    width: 100%;
    margin-top: 0.92rem;
    .help_center_content_top {
      width: 96%;
      height: 1.6rem;
      padding-left: 4%;
      background: url(../../assets/images/suanlimingxi.png) no-repeat;
      background-size: 100% 100%;
      background-position: top;
      text-align: left;
      p {
        color: #fff;
        padding-top: 0.5rem;
        font-size: 0.4rem;
      }
    }
    .help_center_content_con {
      width: 100%;
      height: 100%;
      background-color: #eeeeee;
      .help_center_content_con_item {
        margin-bottom: 0.2rem;
        width: 100%;
        height: 2rem;
        display: flex;
        align-items: center;
        background-color: #fff;
        .con_item_left {
          width: 35%;
          height: 2rem;
          border-right: 1px solid #eeeeee;
          img {
            width: 15%;
            margin-top: 0.35rem;
          }
        }
        .con_item_right {
          width: 60%;
          padding-left: 0.2rem;
          p {
            border-bottom: solid 1px #eeeeee;
            line-height: 1rem;
            text-align: left;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          p:nth-child(2) {
            border: none;
          }
        }
      }
    }
  }
}
</style>