<template>
  <div class="rules">
    <navBar title="节点等级规则" left-text="返回" left-arrow fixed @click-left="onClickLeft">
      <!-- <van-icon name="question-o" slot="right" size="0.4rem" /> -->
    </navBar>
    <!-- 内容 -->
    <div class="content first_con">
      <p class="content_title">等级有效期</p>
      <p class="content_text">用户等级有效期为1年,有效期截止时间用户保留节点贡献值80%,清算扣除节点贡献值20%。</p>
    </div>
    <div class="content">
      <p class="content_title">升级规则</p>
      <p class="content_text">用户在等级有效期内达到升级门槛,新等级立即生效,等级到期后,用户等级将根据上个有效期内累计的贡献值重新计算。</p>
    </div>
    <div class="content">
      <p class="content_title">节点等级对照表</p>
      <ol>
        <li>
          <span class="text_left">节点等级</span>
          <span>对应升级门槛（所需贡献值）</span>
        </li>
        <li>
          <span class="text_left">普通节点</span>
          <span>0</span>
        </li>
        <li>
          <span class="text_left">黄金节点</span>
          <span>2000</span>
        </li>
        <li>
          <span class="text_left">铂金节点</span>
          <span>6000</span>
        </li>
        <li>
          <span class="text_left">钻石节点</span>
          <span>18000</span>
        </li>
      </ol>
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
  },
  mounted() {},
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
.rules {
  width: 100%;
  height: 100%;
  margin: auto;
  background-color: #fff;
  .content {
    width: 84%;
    background: rgba(248, 250, 251, 1);
    box-shadow: 0 0.08rem 0.1rem 0 #0c58f50f;
    border-radius: 0.1rem;
    margin: auto;
    text-align: left;
    font-size: 0.28rem;
    color: #666666;
    margin-top: 0.33rem;
    font-weight: 500;
    padding: 0.3rem;
    .content_title {
      color: #333333;
      font-weight: 600;
      margin-bottom: 0.28rem;
    }
    ol {
      li {
        span {
          display: inline-block;
          line-height: 0.4rem;
        }
        .text_left {
          width: 40%;
        }
      }
    }
  }
  .first_con {
    margin-top: 1.25rem;
  }
}
</style>
