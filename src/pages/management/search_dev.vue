<template>
  <div>
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
import { Toast, Dialog, NavBar } from "vant";
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
      // Toast(val);
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
</style>
