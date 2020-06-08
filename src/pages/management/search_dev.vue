<template>
  <div class="content">
    <form action="/">
      <van-search
        v-model="value"
        show-action
        placeholder="搜索"
        @search="onSearch"
        @cancel="onCancel"
      />
    </form>
    <tabbar v-model="active"></tabbar>
  </div>
</template>

<script>
import tabbar from "../../components/foot";
import { Toast, Dialog, Search } from "vant";
export default {
  data() {
    return {
      active: 2,
      value: ""
    };
  },
  mounted() {},
  methods: {
    onSearch(val) {
     console.log("搜素");
    },
    onCancel() {
      this.$router.back(-1);

    }
  },
  components: {
    tabbar: tabbar
  }
};
</script>

<style lang="less" scoped>
.content{
  width: 100%;
  height: 100%;
}
</style>
